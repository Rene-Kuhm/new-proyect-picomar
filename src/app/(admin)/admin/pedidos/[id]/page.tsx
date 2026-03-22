import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/actions/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, MapPin, CreditCard, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { OrderStatusUpdate } from '@/components/admin/order-status-update'

export const metadata = { title: 'Detalle Pedido - Admin' }

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
  DEBIT_CARD: 'Tarjeta Débito',
  CREDIT_CARD: 'Tarjeta Crédito',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  const cfg = statusConfig[order.status] || statusConfig.PENDING

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/admin/pedidos">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-mono">{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            {format(new Date(order.createdAt), "dd 'de' MMMM yyyy, HH:mm", {
              locale: es,
            })}
          </p>
        </div>
        <Badge variant="secondary" className={`${cfg.class} text-base px-4 py-1`}>
          {cfg.label}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Client info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{order.user.businessName}</p>
            <p>{order.user.email}</p>
            <p>{order.user.phone}</p>
            <p>{order.user.address}, {order.user.city}</p>
          </CardContent>
        </Card>

        {/* Delivery info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" /> Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{order.deliveryZone.name}</p>
            {order.deliveryDate && (
              <p>
                Fecha:{' '}
                {format(new Date(order.deliveryDate), 'dd/MM/yyyy', {
                  locale: es,
                })}
              </p>
            )}
            {order.deliveryNotes && (
              <p className="text-muted-foreground">Nota: {order.deliveryNotes}</p>
            )}
          </CardContent>
        </Card>

        {/* Payment info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4" /> Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{paymentLabels[order.paymentMethod]}</p>
            <Badge
              variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
            >
              {order.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente'}
            </Badge>
            <p className="text-2xl font-bold mt-2">
              ${Number(order.total).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Productos ({order.items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Precio Unit.</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product.name}
                  </TableCell>
                  <TableCell className="text-right">
                    ${Number(item.unitPrice).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(item.quantity).toLocaleString('es-AR')}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${Number(item.subtotal).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  ${Number(order.total).toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status update */}
      {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
        <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
      )}
    </div>
  )
}
