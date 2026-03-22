'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/actions/orders'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ArrowLeft, CreditCard, Banknote, Building2, Loader2 } from 'lucide-react'

interface Zone {
  id: string
  name: string
  deliveryDays: string[]
}

const dayLabels: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
}

const paymentMethods = [
  { value: 'CASH', label: 'Efectivo contra entrega', icon: Banknote },
  { value: 'TRANSFER', label: 'Transferencia bancaria', icon: Building2 },
  { value: 'DEBIT_CARD', label: 'Tarjeta de débito', icon: CreditCard },
  { value: 'CREDIT_CARD', label: 'Tarjeta de crédito', icon: CreditCard },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetch('/api/zones')
      .then((res) => res.json())
      .then((data) => setZones(data))
      .catch(() => {})
  }, [])

  const selectedZoneData = zones.find((z) => z.id === selectedZone)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!selectedZone) {
      toast.error('Seleccioná una zona de entrega')
      return
    }
    if (!selectedPayment) {
      toast.error('Seleccioná un método de pago')
      return
    }
    if (cart.items.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    setIsLoading(true)

    const result = await createOrder({
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      paymentMethod: selectedPayment as 'CASH' | 'TRANSFER' | 'DEBIT_CARD' | 'CREDIT_CARD',
      deliveryZoneId: selectedZone,
      deliveryNotes: notes || undefined,
    })

    if (result.success) {
      clearCart()
      toast.success('¡Pedido realizado exitosamente!')
      router.push(`/pedidos/${result.data?.id}`)
    } else {
      toast.error(result.error)
    }

    setIsLoading(false)
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">No hay productos</h1>
        <p className="text-muted-foreground mb-6">
          Agregá productos al carrito antes de continuar
        </p>
        <Button asChild>
          <Link href="/catalogo">Ver Catálogo</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/carrito">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver al carrito
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Finalizar Pedido</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Zone */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zona de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {zones.map((zone) => (
                  <label
                    key={zone.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedZone === zone.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="zone"
                        value={zone.id}
                        checked={selectedZone === zone.id}
                        onChange={() => setSelectedZone(zone.id)}
                        className="accent-primary"
                      />
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Entrega:{' '}
                          {zone.deliveryDays
                            .map((d) => dayLabels[d] || d)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Método de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPayment === method.value
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={selectedPayment === method.value}
                        onChange={() => setSelectedPayment(method.value)}
                        className="accent-primary"
                      />
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{method.label}</span>
                    </label>
                  )
                })}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas del pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Indicaciones especiales para la entrega (opcional)"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.productName} x{item.quantity}
                      </span>
                      <span>
                        $
                        {(item.price * item.quantity).toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {selectedZoneData && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Zona de entrega</p>
                    <p className="font-medium">{selectedZoneData.name}</p>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-blue-600">
                    $
                    {cart.total.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || !selectedZone || !selectedPayment}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
