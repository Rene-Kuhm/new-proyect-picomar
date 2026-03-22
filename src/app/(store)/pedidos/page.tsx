import Link from 'next/link'
import { getOrders } from '@/lib/actions/orders'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Eye, ShoppingCart } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const metadata = { title: 'Mis Pedidos' }

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmado', class: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'En preparación', class: 'bg-purple-100 text-purple-800' },
  DISPATCHED: { label: 'En camino', class: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
}

export default async function ClientOrdersPage() {
  const result = await getOrders({ limit: 50 })

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Pedidos</h1>
          <p className="text-muted-foreground">Historial de todos tus pedidos</p>
        </div>
        <Button asChild>
          <Link href="/catalogo">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Nuevo Pedido
          </Link>
        </Button>
      </div>

      {result.data.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tenés pedidos aún</h2>
          <p className="text-muted-foreground mb-6">
            Explorá el catálogo y realizá tu primer pedido
          </p>
          <Button asChild>
            <Link href="/catalogo">Ver Catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {result.data.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.PENDING
            return (
              <Card key={order.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <Package className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-mono font-bold">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "dd 'de' MMMM yyyy", {
                          locale: es,
                        })}{' '}
                        • {order.items.length} producto
                        {order.items.length !== 1 ? 's' : ''} •{' '}
                        {order.deliveryZone.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className={cfg.class}>
                      {cfg.label}
                    </Badge>
                    <p className="font-bold text-lg min-w-[100px] text-right">
                      $
                      {Number(order.total).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/pedidos/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
