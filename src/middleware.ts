import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/api/auth', '/api/zones', '/api/webhooks']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Admin routes require ADMIN role
  if (pathname.startsWith('/admin')) {
    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/catalogo', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
