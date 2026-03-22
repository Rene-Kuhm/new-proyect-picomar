import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrderById } from '@/lib/actions/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
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
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Clock, Truck, Package, CircleX } from 'lucide-react'

export const metadata = { title: 'Detalle de Pedido' }

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Confirmado', class: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  PREPARING: { label: 'En preparación', class: 'bg-purple-100 text-purple-800', icon: Package },
  DISPATCHED: { label: 'En camino', class: 'bg-indigo-100 text-indigo-800', icon: Truck },
  DELIVERED: { label: 'Entregado', class: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelado', class: 'bg-red-100 text-red-800', icon: CircleX },
}

const paymentLabels: Record<string, string> = {
  CASH: 'Efectivo contra entrega',
  TRANSFER: 'Transferencia bancaria',
  DEBIT_CARD: 'Tarjeta de débito',
  CREDIT_CARD: 'Tarjeta de crédito',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientOrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) notFound()

  const cfg = statusConfig[order.status] || statusConfig.PENDING
  const StatusIcon = cfg.icon

  return (
    <div className="container py-8 max-w-3xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/pedidos">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Mis Pedidos
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-mono">{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            {format(new Date(order.createdAt), "dd 'de' MMMM yyyy, HH:mm", {
              locale: es,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          <Badge variant="secondary" className={`${cfg.class} text-sm px-3 py-1`}>
            {cfg.label}
          </Badge>
        </div>
      </div>

      {/* Status timeline */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex justify-between">
            {['PENDING', 'CONFIRMED', 'PREPARING', 'DISPATCHED', 'DELIVERED'].map(
              (step, i) => {
                const stepCfg = statusConfig[step]
                const StepIcon = stepCfg.icon
                const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'DISPATCHED', 'DELIVERED']
                const currentIdx = statuses.indexOf(order.status)
                const isActive = i <= currentIdx && order.status !== 'CANCELLED'
                const isCancelled = order.status === 'CANCELLED'

                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCancelled
                          ? 'bg-red-100 text-red-400'
                          : isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <p
                      className={`text-[11px] mt-1 ${
                        isActive && !isCancelled ? 'font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {stepCfg.label}
                    </p>
                  </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Delivery */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{order.deliveryZone.name}</p>
            {order.deliveryDate && (
              <p>
                {format(new Date(order.deliveryDate), 'dd/MM/yyyy', {
                  locale: es,
                })}
              </p>
            )}
            {order.deliveryNotes && (
              <p className="text-muted-foreground">{order.deliveryNotes}</p>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">
              {paymentLabels[order.paymentMethod]}
            </p>
            <Badge
              variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
            >
              {order.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Cant.</TableHead>
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
                    ${Number(item.unitPrice).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(item.quantity)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${Number(item.subtotal).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator className="my-4" />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-blue-600">
              ${Number(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
