import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().positive('Cantidad debe ser mayor a 0'),
})

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'El pedido debe tener al menos un producto'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD']),
  deliveryZoneId: z.string().min(1, 'Zona de entrega requerida'),
  deliveryDate: z.string().optional(),
  deliveryNotes: z.string().optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'DISPATCHED',
    'DELIVERED',
    'CANCELLED',
  ]),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
