'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ShoppingCart, Fish, User, LogOut, Menu, Package, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

interface StoreHeaderProps {
  user: {
    businessName: string
    role: string
  } | null
}

const storeNav = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/pedidos', label: 'Mis Pedidos' },
]

export function StoreHeader({ user }: StoreHeaderProps) {
  const pathname = usePathname()
  const { cart } = useCart()
  const cartItemCount = cart.itemCount
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Fish className="h-8 w-8 text-blue-600" />
          <div>
            <span className="text-xl font-bold text-blue-600">PICOMAR</span>
            <p className="text-[10px] text-muted-foreground leading-none">
              Uniendo La Pampa y el Mar
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {user &&
            storeNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname.startsWith(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Cart */}
              <Link href="/carrito" className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium hover:bg-muted transition-colors outline-none">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.businessName}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/perfil" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/pedidos" className="flex items-center gap-2 w-full">
                      <Package className="h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/admin" className="flex items-center gap-2 w-full">
                          ⚙️ Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/api/auth/signout" className="flex items-center gap-2 w-full text-red-600">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4">
          <nav className="flex flex-col gap-3">
            {user &&
              storeNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'text-base font-medium py-2',
                    pathname.startsWith(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      )}
    </header>
  )
}
