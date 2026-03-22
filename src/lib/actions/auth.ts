'use server'

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function registerUser(input: RegisterInput) {
  const validated = registerSchema.safeParse(input)

  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message }
  }

  const { email, password, businessName, cuit, phone, address, city, province, zoneId } =
    validated.data

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) {
    return { success: false, error: 'Este email ya está registrado' }
  }

  // Check if CUIT already exists
  const existingCuit = await prisma.user.findUnique({ where: { cuit } })
  if (existingCuit) {
    return { success: false, error: 'Este CUIT ya está registrado' }
  }

  const hashedPassword = await hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      businessName,
      cuit,
      phone,
      address,
      city,
      province,
      zoneId: zoneId || null,
      role: 'CLIENT',
      status: 'PENDING',
    },
  })

  return {
    success: true,
    message:
      'Registro exitoso. Tu cuenta está pendiente de aprobación. Te notificaremos cuando sea aprobada.',
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Error al iniciar sesión' }
  }

  redirect('/catalogo')
}
