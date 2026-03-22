'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/actions/orders'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">No hay productos</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Agregá productos al carrito antes de continuar
        </p>
        <Link href="/catalogo">
          <Button>Ver Catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link href="/carrito" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Volver al carrito
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Finalizar Pedido</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Delivery Zone */}
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="p-4 sm:p-5 border-b bg-muted/30">
                <h2 className="text-sm sm:text-base font-bold">Zona de Entrega</h2>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {zones.map((zone) => (
                  <label
                    key={zone.id}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedZone === zone.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <input
                        type="radio"
                        name="zone"
                        value={zone.id}
                        checked={selectedZone === zone.id}
                        onChange={() => setSelectedZone(zone.id)}
                        className="accent-blue-600"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-medium">{zone.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {zone.deliveryDays.map((d) => dayLabels[d] || d).join(', ')}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="p-4 sm:p-5 border-b bg-muted/30">
                <h2 className="text-sm sm:text-base font-bold">Método de Pago</h2>
              </div>
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPayment === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={selectedPayment === method.value}
                        onChange={() => setSelectedPayment(method.value)}
                        className="accent-blue-600"
                      />
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">{method.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border bg-white overflow-hidden">
              <div className="p-4 sm:p-5 border-b bg-muted/30">
                <h2 className="text-sm sm:text-base font-bold">Notas del pedido</h2>
              </div>
              <div className="p-3 sm:p-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Indicaciones especiales para la entrega (opcional)"
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-4 sm:p-5 sticky top-20 space-y-4">
              <h2 className="text-base sm:text-lg font-bold">Resumen</h2>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground truncate mr-2">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="shrink-0">
                      ${(item.price * item.quantity).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {selectedZoneData && (
                <>
                  <div className="text-xs sm:text-sm">
                    <p className="text-muted-foreground">Zona de entrega</p>
                    <p className="font-medium">{selectedZoneData.name}</p>
                  </div>
                  <Separator />
                </>
              )}

              <div className="flex justify-between font-bold text-base sm:text-xl">
                <span>Total</span>
                <span className="text-blue-600">
                  ${cart.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11"
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
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
