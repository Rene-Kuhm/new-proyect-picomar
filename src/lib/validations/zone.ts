import { z } from 'zod'

export const deliveryZoneSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  deliveryDays: z
    .array(z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']))
    .min(1, 'Debe seleccionar al menos un día de entrega'),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
})

export type DeliveryZoneInput = z.infer<typeof deliveryZoneSchema>
