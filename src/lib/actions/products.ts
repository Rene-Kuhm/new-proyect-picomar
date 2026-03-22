'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { productSchema, categorySchema, type ProductInput, type CategoryInput } from '@/lib/validations/product'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// ==========================================
// PRODUCTS
// ==========================================

export async function getProducts(params?: {
  search?: string
  categoryId?: string
  isActive?: boolean
  page?: number
  limit?: number
}) {
  const { search, categoryId, isActive, page = 1, limit = 20 } = params || {}

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(isActive !== undefined && { isActive }),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    data: products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function createProduct(input: ProductInput) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const validated = productSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const slug = slugify(validated.data.name)

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    return { success: false, error: 'Ya existe un producto con ese nombre' }
  }

  const product = await prisma.product.create({
    data: {
      ...validated.data,
      slug,
      price: validated.data.price,
      stock: validated.data.stock,
      minOrderQty: validated.data.minOrderQty,
      lowStockAlert: validated.data.lowStockAlert,
      imageUrl: validated.data.imageUrl || null,
    },
  })

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')

  return { success: true, data: product }
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return { success: false, error: 'Producto no encontrado' }
  }

  const updateData: Record<string, unknown> = { ...input }

  if (input.name && input.name !== product.name) {
    updateData.slug = slugify(input.name)
  }

  if (input.imageUrl === '') {
    updateData.imageUrl = null
  }

  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')

  return { success: true, data: updated }
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  })

  revalidatePath('/admin/productos')
  revalidatePath('/catalogo')

  return { success: true }
}

// ==========================================
// CATEGORIES
// ==========================================

export async function getCategories(activeOnly = false) {
  return prisma.category.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  })
}

export async function createCategory(input: CategoryInput) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const validated = categorySchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const slug = slugify(validated.data.name)

  const category = await prisma.category.create({
    data: {
      ...validated.data,
      slug,
      imageUrl: validated.data.imageUrl || null,
    },
  })

  revalidatePath('/admin/productos')

  return { success: true, data: category }
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'No autorizado' }
  }

  const updateData: Record<string, unknown> = { ...input }

  if (input.name) {
    updateData.slug = slugify(input.name)
  }

  const category = await prisma.category.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/admin/productos')

  return { success: true, data: category }
}
