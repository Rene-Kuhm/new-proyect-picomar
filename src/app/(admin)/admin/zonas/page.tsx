import { getDeliveryZones } from '@/lib/actions/admin'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Users, ShoppingCart, Calendar } from 'lucide-react'
import { ZoneForm } from '@/components/admin/zone-form'

export const metadata = { title: 'Zonas de Entrega - Admin' }

const dayLabels: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
}

export default async function AdminZonesPage() {
  const zones = await getDeliveryZones()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zonas de Entrega</h1>
          <p className="text-muted-foreground">
            Configurá las zonas y días de entrega
          </p>
        </div>
        <ZoneForm />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {zone.name}
                </CardTitle>
                {zone.isActive ? (
                  <Badge>Activa</Badge>
                ) : (
                  <Badge variant="secondary">Inactiva</Badge>
                )}
              </div>
              {zone.description && (
                <p className="text-sm text-muted-foreground">
                  {zone.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Delivery days */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {zone.deliveryDays.map((day) => (
                    <Badge key={day} variant="secondary" className="text-xs">
                      {dayLabels[day] || day}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {zone._count.users} clientes
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingCart className="h-3 w-3" />
                  {zone._count.orders} pedidos
                </span>
              </div>

              {/* Edit */}
              <ZoneForm zone={{
                id: zone.id,
                name: zone.name,
                description: zone.description || '',
                deliveryDays: zone.deliveryDays,
                isActive: zone.isActive,
                sortOrder: zone.sortOrder,
              }} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
