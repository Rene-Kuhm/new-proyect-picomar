import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, MapPin, Calendar, Package } from 'lucide-react'
import { format, startOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Logística - Admin' }

const dayMap: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
}

const dayLabels: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
}

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  DISPATCHED: 'bg-indigo-100 text-indigo-800',
}

export default async function LogisticsPage() {
  const [zones, pendingOrders] = await Promise.all([
    prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        orders: {
          where: {
            status: { in: ['CONFIRMED', 'PREPARING', 'DISPATCHED'] },
          },
          include: {
            user: { select: { businessName: true, city: true } },
            items: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.order.count({
      where: { status: { in: ['CONFIRMED', 'PREPARING'] } },
    }),
  ])

  // Build weekly calendar
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 6 }, (_, i) => ({
    date: addDays(weekStart, i),
    dayKey: Object.keys(dayMap).find((k) => dayMap[k] === i + 1)!,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logística</h1>
          <p className="text-muted-foreground">
            Semana del{' '}
            {format(weekStart, "dd 'de' MMMM", { locale: es })}
            {' — '}
            {pendingOrders} pedidos por despachar
          </p>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDays.map(({ date, dayKey }) => {
          const isToday =
            format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          const zonesForDay = zones.filter((z) =>
            z.deliveryDays.includes(dayKey as never)
          )

          const totalOrders = zonesForDay.reduce(
            (sum, z) => sum + z.orders.length,
            0
          )

          return (
            <Card
              key={dayKey}
              className={isToday ? 'border-blue-500 border-2' : ''}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {dayLabels[dayKey]}{' '}
                    {format(date, 'dd/MM', { locale: es })}
                  </span>
                  {isToday && (
                    <Badge variant="default" className="text-[10px]">
                      HOY
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {zonesForDay.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sin entregas programadas
                  </p>
                ) : (
                  zonesForDay.map((zone) => (
                    <div
                      key={zone.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-medium text-sm">
                          <MapPin className="h-3 w-3 text-blue-600" />
                          {zone.name}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {zone.orders.length} pedidos
                        </Badge>
                      </div>

                      {zone.orders.length > 0 && (
                        <div className="space-y-1">
                          {zone.orders.slice(0, 5).map((order) => (
                            <Link
                              key={order.id}
                              href={`/admin/pedidos/${order.id}`}
                              className="flex items-center justify-between text-xs hover:bg-muted p-1 rounded"
                            >
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {order.user.businessName}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`${statusColors[order.status] || ''} text-[9px]`}
                              >
                                {order.status === 'CONFIRMED'
                                  ? 'Confirmar'
                                  : order.status === 'PREPARING'
                                    ? 'Preparando'
                                    : 'Despachado'}
                              </Badge>
                            </Link>
                          ))}
                          {zone.orders.length > 5 && (
                            <p className="text-[10px] text-muted-foreground text-center">
                              +{zone.orders.length - 5} más
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {totalOrders === 0 && zonesForDay.length > 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Sin pedidos pendientes
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Route Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Resumen de Rutas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((zone) => (
              <div key={zone.id} className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {zone.name}
                </h3>
                <p className="text-2xl font-bold mt-1">{zone.orders.length}</p>
                <p className="text-xs text-muted-foreground">
                  pedidos por entregar
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {zone.deliveryDays.map((day) => (
                    <Badge key={day} variant="secondary" className="text-[10px]">
                      {dayLabels[day]?.slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
