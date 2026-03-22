'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  MapPin,
  BarChart3,
  Fish,
  Boxes,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/stock', label: 'Stock', icon: Boxes },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/zonas', label: 'Zonas de Entrega', icon: MapPin },
  { href: '/admin/logistica', label: 'Logística', icon: Truck },
  { href: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/40 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <Fish className="h-6 w-6 text-blue-600" />
        <div>
          <span className="font-bold text-blue-600">PICOMAR</span>
          <p className="text-[10px] text-muted-foreground">Panel de Administración</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminNav.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to store */}
      <div className="border-t px-3 py-4">
        <Link
          href="/catalogo"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la tienda
        </Link>
      </div>
    </aside>
  )
}
