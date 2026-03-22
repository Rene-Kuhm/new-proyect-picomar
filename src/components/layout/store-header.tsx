'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Fish, User, LogOut, Menu, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StoreHeaderProps {
  user: {
    businessName: string
    role: string
  } | null
  cartItemCount?: number
}

const storeNav = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/pedidos', label: 'Mis Pedidos' },
]

export function StoreHeader({ user, cartItemCount = 0 }: StoreHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
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
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/carrito">
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
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.businessName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pedidos" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          ⚙️ Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout" className="flex items-center gap-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {user &&
                  storeNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium',
                        pathname.startsWith(item.href)
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
