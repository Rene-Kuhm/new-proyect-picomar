// Edge-compatible auth config (NO Prisma, NO server-side imports)
// This file is for middleware only - runs on Edge Runtime
import type { NextAuthConfig } from 'next-auth'

export const edgeConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      // Public routes - no auth required
      const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/api/auth',
        '/api/zones',
        '/api/webhooks',
        '/catalogo',
        '/carrito',
      ]
      const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))

      if (isPublicRoute) {
        return true
      }

      // Require auth for everything else
      if (!isLoggedIn) {
        return false // Redirects to login automatically by NextAuth
      }

      // Admin routes require ADMIN role
      if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        if (auth?.user?.role !== 'ADMIN') {
          return Response.redirect(new URL('/catalogo', nextUrl))
        }
      }

      return true
    },
  },
  providers: [], // No providers here - auth.ts handles that
}