'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { createOrderSchema, type CreateOrderInput } from '@/lib/validations/order'
import { revalidatePath } from 'next/cache'
import { Decimal } from '@/generated/prisma/runtime/library'

function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0')
  return `PIC-${year}-${random}`
}

export async function createOrder(input: CreateOrderInput) {
  const session = await auth()
  if (!session) {
    return { success: false, error: 'No autorizado' }
  }

  if (session.user.status !== 'APPROVED') {
    return { success: false, error: 'Tu cuenta no está aprobada para realizar pedidos' }
  }

  const validated = createOrderSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const { items, paymentMethod, deliveryZoneId, deliveryDate, deliveryNotes } =
    validated.data

  // Verify zone exists
  const zone = await prisma.deliveryZone.findUnique({ where: { id: deliveryZoneId } })
  if (!zone || !zone.isActive) {
    return { success: false, error: 'Zona de entrega inválida' }
  }

  // Get all products and validate stock
  const productIds = items.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  })

  if (products.length !== items.length) {
    return { success: false, error: 'Algunos productos no están disponibles' }
  }

  // Calculate totals and validate stock
  let subtotal = new Decimal(0)
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!
    const quantity = new Decimal(item.quantity)

    if (quantity.lessThan(product.minOrderQty)) {
      throw new Error(
        `Cantidad mínima para ${product.name}: ${product.minOrderQty} ${product.unit}`
      )
    }

    if (quantity.greaterThan(product.stock)) {
      throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}`)
    }

    const itemSubtotal = product.price.mul(quantity)
    subtotal = subtotal.add(itemSubtotal)

    return {
      productId: product.id,
      quantity,
      unitPrice: product.price,
      subtotal: itemSubtotal,
    }
  })

  // Create order in transaction (order + items + stock updates)
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          deliveryZoneId,
          paymentMethod,
          subtotal,
          total: subtotal, // Could add taxes/shipping later
          deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
          deliveryNotes: deliveryNotes || null,
          items: {
            create: orderItems,
          },
        },
        include: { items: { include: { product: true } }, deliveryZone: true },
      })

      // Update stock for each product
      for (const item of orderItems) {
        const product = products.find((p) => p.id === item.productId)!
        const newStock = product.stock.sub(item.quantity)

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: newStock },
        })

        // Record stock movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            quantity: item.quantity,
            previousStock: product.stock,
            newStock,
            reason: `Pedido ${newOrder.orderNumber}`,
            userId: session.user.id,
          },
        })
      }

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod,
          amount: subtotal,
          status: paymentMethod === 'CASH' ? 'PENDING' : 'PENDING',
        },
      })

      return newOrder
    })

    revalidatePath('/pedidos')
    revalidatePath('/admin/pedidos')
    revalidatePath('/admin/stock')

    return { success: true, data: order }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Error al crear el pedido' }
  }
}

export async function getOrders(params?: {
  userId?: string
  status?: string
  page?: number
  limit?: number
}) {
  const session = await auth()
  if (!session) return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 }

  const { status, page = 1, limit = 20 } = params || {}

  const where = {
    ...(session.user.role === 'CLIENT' && { userId: session.user.id }),
    ...(params?.userId && session.user.role === 'ADMIN' && { userId: params.userId }),
    ...(status && { status: status as never }),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { businessName: true, email: true, phone: true } },
        deliveryZone: true,
        items: { include: { product: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    data: orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getOrderById(id: string) {
  const session = await auth()
  if (!session) return null

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { businessName: true, email: true, phone: true, address: true, city: true } },
      deliveryZone: true,
      items: { include: { product: true } },
      payment: true,
    },
  })

  // Clients can only see their own orders
  if (session.user.role === 'CLIENT' && order?.userId !== session.user.id) {
    return null
  }

  return order
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return { success: false, error: 'Pedido no encontrado' }
  }

  // If cancelling, restore stock
  if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
    await prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({ where: { orderId: id } })

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } })
        if (product) {
          const newStock = product.stock.add(item.quantity)
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock },
          })
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              type: 'IN',
              quantity: item.quantity,
              previousStock: product.stock,
              newStock,
              reason: `Cancelación pedido ${order.orderNumber}`,
              userId: session.user.id,
            },
          })
        }
      }

      await tx.order.update({ where: { id }, data: { status: 'CANCELLED' } })
    })
  } else {
    await prisma.order.update({
      where: { id },
      data: { status: status as never },
    })
  }

  // If delivered and payment is cash, mark as paid
  if (status === 'DELIVERED') {
    await prisma.payment.updateMany({
      where: { orderId: id, method: 'CASH', status: 'PENDING' },
      data: { status: 'PAID', paidAt: new Date() },
    })
  }

  revalidatePath('/admin/pedidos')
  revalidatePath('/pedidos')

  return { success: true }
}
