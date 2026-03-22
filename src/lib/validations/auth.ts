import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  businessName: z.string().min(2, 'La razón social es requerida'),
  cuit: z
    .string()
    .regex(/^\d{2}-\d{8}-\d{1}$/, 'Formato CUIT inválido (XX-XXXXXXXX-X)'),
  phone: z.string().min(8, 'Teléfono inválido'),
  address: z.string().min(5, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  province: z.string().min(2, 'Provincia requerida'),
  zoneId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
