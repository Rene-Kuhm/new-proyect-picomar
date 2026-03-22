// Authentication middleware for PICOMAR
// Using NextAuth v5 pattern with authorized callback

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
    '/_next',
    '/favicon.ico',
  ]

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionToken = request.cookies.get('next-auth.session-token') 
    || request.cookies.get('__Secure-next-auth.session-token')

  if (!sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}