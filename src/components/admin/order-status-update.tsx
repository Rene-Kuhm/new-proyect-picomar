'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateOrderStatus } from '@/lib/actions/orders'
import {
  CheckCircle,
  Package,
  Truck,
  CircleCheck,
  XCircle,
} from 'lucide-react'

const statusFlow: Record<string, { next: string; label: string; icon: React.ElementType; color: string }> = {
  PENDING: { next: 'CONFIRMED', label: 'Confirmar Pedido', icon: CheckCircle, color: 'bg-blue-600 hover:bg-blue-700' },
  CONFIRMED: { next: 'PREPARING', label: 'Iniciar Preparación', icon: Package, color: 'bg-purple-600 hover:bg-purple-700' },
  PREPARING: { next: 'DISPATCHED', label: 'Marcar como Despachado', icon: Truck, color: 'bg-indigo-600 hover:bg-indigo-700' },
  DISPATCHED: { next: 'DELIVERED', label: 'Marcar como Entregado', icon: CircleCheck, color: 'bg-green-600 hover:bg-green-700' },
}

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

export function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const flow = statusFlow[currentStatus]
  if (!flow) return null

  async function handleNext() {
    setIsLoading(true)
    const result = await updateOrderStatus(orderId, flow.next)
    if (result.success) {
      toast.success(`Pedido actualizado a: ${flow.label.replace('Marcar como ', '')}`)
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsLoading(false)
  }

  async function handleCancel() {
    if (!confirm('¿Estás seguro de cancelar este pedido? Se restaurará el stock.')) return
    setIsLoading(true)
    const result = await updateOrderStatus(orderId, 'CANCELLED')
    if (result.success) {
      toast.success('Pedido cancelado y stock restaurado')
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsLoading(false)
  }

  const Icon = flow.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actualizar Estado</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className={`${flow.color} text-white`}
        >
          <Icon className="h-4 w-4 mr-2" />
          {flow.label}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancelar Pedido
        </Button>
      </CardContent>
    </Card>
  )
}
