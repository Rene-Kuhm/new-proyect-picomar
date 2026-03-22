import type { NextAuthConfig } from 'next-auth'
import type { UserRole, UserStatus } from '@/generated/prisma/enums'

declare module 'next-auth' {
  interface User {
    role: UserRole
    status: UserStatus
    businessName: string
  }
  interface Session {
    user: User & {
      id: string
      role: UserRole
      status: UserStatus
      businessName: string
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: UserRole
    status: UserStatus
    businessName: string
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.status = user.status
        token.businessName = user.businessName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.status = token.status
        session.user.businessName = token.businessName
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      const publicRoutes = ['/', '/login', '/register', '/api/auth', '/api/zones', '/api/webhooks']
      const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

      if (isPublicRoute) return true

      if (!isLoggedIn) return false // Will redirect to signIn page

      // Admin routes require ADMIN role
      if (pathname.startsWith('/admin')) {
        if (auth?.user?.role !== 'ADMIN') {
          return Response.redirect(new URL('/catalogo', nextUrl))
        }
      }

      return true
    },
  },
  providers: [], // Providers added in auth.ts (server-only)
}
