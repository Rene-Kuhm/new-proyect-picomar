import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU requerido'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  unit: z.enum(['KG', 'UNIT', 'BOX', 'PACK']),
  minOrderQty: z.coerce.number().positive('Cantidad mínima debe ser mayor a 0'),
  stock: z.coerce.number().min(0, 'Stock no puede ser negativo'),
  lowStockAlert: z.coerce.number().min(0),
  categoryId: z.string().min(1, 'Categoría requerida'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
