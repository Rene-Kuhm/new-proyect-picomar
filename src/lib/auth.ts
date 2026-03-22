import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { authConfig } from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          throw new Error('Credenciales inválidas')
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Credenciales inválidas')
        }

        if (user.status === 'BLOCKED') {
          throw new Error('Tu cuenta ha sido bloqueada. Contactá al administrador.')
        }

        if (user.status === 'PENDING') {
          throw new Error('Tu cuenta está pendiente de aprobación. Te notificaremos cuando sea aprobada.')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          businessName: user.businessName,
        }
      },
    }),
  ],
})
