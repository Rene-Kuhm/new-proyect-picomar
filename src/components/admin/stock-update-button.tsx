'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { updateStock } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'

interface StockUpdateButtonProps {
  productId: string
  productName: string
  currentStock: number
  unit: string
}

export function StockUpdateButton({
  productId,
  productName,
  currentStock,
  unit,
}: StockUpdateButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'IN' | 'ADJUSTMENT'>('IN')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const quantity = Number(formData.get('quantity'))
    const reason = formData.get('reason') as string

    const result = await updateStock(productId, quantity, mode, reason)

    if (result.success) {
      toast.success('Stock actualizado')
      setOpen(false)
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Package className="h-3 w-3 mr-1" />
          Actualizar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Stock — {productName}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Stock actual: <strong>{currentStock} {unit}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'IN' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('IN')}
            >
              Entrada de mercadería
            </Button>
            <Button
              type="button"
              variant={mode === 'ADJUSTMENT' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('ADJUSTMENT')}
            >
              Ajuste manual
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {mode === 'IN'
                ? `Cantidad a agregar (${unit})`
                : `Nuevo stock total (${unit})`}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              step="0.01"
              min="0"
              required
              disabled={isLoading}
              placeholder={mode === 'IN' ? 'Ej: 100' : `Ej: ${currentStock}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Input
              id="reason"
              name="reason"
              placeholder="Ej: Recepción proveedor Mar del Plata"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
