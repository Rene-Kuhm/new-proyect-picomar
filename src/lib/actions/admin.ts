'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Decimal } from '@/generated/prisma/runtime/library'

// ==========================================
// CLIENT MANAGEMENT
// ==========================================

export async function getClients(params?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  }

  const { status, search, page = 1, limit = 20 } = params || {}

  const where = {
    role: 'CLIENT' as const,
    ...(status && { status: status as never }),
    ...(search && {
      OR: [
        { businessName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { cuit: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [clients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        businessName: true,
        cuit: true,
        phone: true,
        city: true,
        province: true,
        status: true,
        zone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return {
    data: clients,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function approveClient(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  await prisma.user.update({
    where: { id },
    data: { status: 'APPROVED' },
  })

  revalidatePath('/admin/clientes')

  return { success: true, message: 'Cliente aprobado exitosamente' }
}

export async function blockClient(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  await prisma.user.update({
    where: { id },
    data: { status: 'BLOCKED' },
  })

  revalidatePath('/admin/clientes')

  return { success: true, message: 'Cliente bloqueado' }
}

// ==========================================
// STOCK MANAGEMENT
// ==========================================

export async function updateStock(
  productId: string,
  quantity: number,
  type: 'IN' | 'ADJUSTMENT',
  reason?: string
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    return { success: false, error: 'Producto no encontrado' }
  }

  const quantityDecimal = new Decimal(quantity)
  let newStock: Decimal

  if (type === 'IN') {
    newStock = product.stock.add(quantityDecimal)
  } else {
    newStock = quantityDecimal // ADJUSTMENT sets absolute value
  }

  if (newStock.lessThan(0)) {
    return { success: false, error: 'El stock no puede ser negativo' }
  }

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    }),
    prisma.stockMovement.create({
      data: {
        productId,
        type,
        quantity: quantityDecimal,
        previousStock: product.stock,
        newStock,
        reason: reason || (type === 'IN' ? 'Entrada de mercadería' : 'Ajuste de stock'),
        userId: session.user.id,
      },
    }),
  ])

  revalidatePath('/admin/stock')
  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')

  return { success: true }
}

export async function getLowStockProducts() {
  return prisma.product.findMany({
    where: {
      isActive: true,
      stock: { lte: prisma.product.fields.lowStockAlert },
    },
    include: { category: true },
    orderBy: { stock: 'asc' },
  })
}

export async function getStockMovements(params?: {
  productId?: string
  page?: number
  limit?: number
}) {
  const { productId, page = 1, limit = 50 } = params || {}

  const where = {
    ...(productId && { productId }),
  }

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true } },
        user: { select: { businessName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.stockMovement.count({ where }),
  ])

  return {
    data: movements,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

// ==========================================
// DELIVERY ZONES
// ==========================================

export async function getDeliveryZones(activeOnly = false) {
  return prisma.deliveryZone.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { users: true, orders: true } } },
  })
}

export async function createDeliveryZone(input: {
  name: string
  description?: string
  deliveryDays: string[]
  isActive?: boolean
  sortOrder?: number
}) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const zone = await prisma.deliveryZone.create({
    data: {
      name: input.name,
      description: input.description || null,
      deliveryDays: input.deliveryDays as never[],
      isActive: input.isActive ?? true,
      sortOrder: input.sortOrder ?? 0,
    },
  })

  revalidatePath('/admin/zonas')

  return { success: true, data: zone }
}

export async function updateDeliveryZone(
  id: string,
  input: {
    name?: string
    description?: string
    deliveryDays?: string[]
    isActive?: boolean
    sortOrder?: number
  }
) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const zone = await prisma.deliveryZone.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description || null }),
      ...(input.deliveryDays && { deliveryDays: input.deliveryDays as never[] }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
      ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
    },
  })

  revalidatePath('/admin/zonas')

  return { success: true, data: zone }
}

// ==========================================
// DASHBOARD
// ==========================================

export async function getDashboardStats() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  const [
    totalOrders,
    pendingOrders,
    totalClients,
    pendingClients,
    recentOrders,
    lowStockCount,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'CLIENT', status: 'APPROVED' } }),
    prisma.user.count({ where: { role: 'CLIENT', status: 'PENDING' } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { businessName: true } },
        deliveryZone: { select: { name: true } },
      },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        stock: { lte: 10 }, // Simplified low stock check
      },
    }),
  ])

  // Revenue this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const monthlyRevenue = await prisma.order.aggregate({
    where: {
      createdAt: { gte: startOfMonth },
      status: { not: 'CANCELLED' },
    },
    _sum: { total: true },
  })

  return {
    totalOrders,
    pendingOrders,
    totalClients,
    pendingClients,
    recentOrders,
    lowStockCount,
    monthlyRevenue: monthlyRevenue._sum.total?.toNumber() || 0,
  }
}
