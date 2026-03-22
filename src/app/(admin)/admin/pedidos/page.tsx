import Link from 'next/link'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getOrders } from '@/lib/actions/orders'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const metadata = { title: 'Pedidos - Admin' }

const statusConfig: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmado', class: 'bg-blue-100 text-blue-800' },
  PREPARING: { label: 'Preparando', class: 'bg-purple-100 text-purple-800' },
  DISPATCHED: { label: 'Despachado', class: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: 'Entregado', class: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', class: 'bg-red-100 text-red-800' },
}

const paymentLabels: Record<string, string> = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  DEBIT_CARD: 'Débito',
  CREDIT_CARD: 'Crédito',
}

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const result = await getOrders({
    status: params.status,
    page,
    limit: 25,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">{result.total} pedidos en total</p>
      </div>

      {/* Status filters */}
      <div className="flex gap-1 flex-wrap">
        <Button variant={!params.status ? 'default' : 'outline'} size="sm" asChild>
          <a href="/admin/pedidos">Todos</a>
        </Button>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <Button
            key={key}
            variant={params.status === key ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <a href={`/admin/pedidos?status=${key}`}>{cfg.label}</a>
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No hay pedidos
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((order) => {
                const cfg = statusConfig[order.status] || statusConfig.PENDING
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{order.user.businessName}</p>
                        <p className="text-xs text-muted-foreground">{order.user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{order.deliveryZone.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{paymentLabels[order.paymentMethod]}</p>
                        <Badge
                          variant={
                            order.paymentStatus === 'PAID' ? 'default' : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {order.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${Number(order.total).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cfg.class}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'dd/MM/yy HH:mm', {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/pedidos/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
