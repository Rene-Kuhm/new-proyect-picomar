'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { createDeliveryZone, updateDeliveryZone } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'
import { Plus, Pencil } from 'lucide-react'

const DAYS = [
  { value: 'MONDAY', label: 'Lunes' },
  { value: 'TUESDAY', label: 'Martes' },
  { value: 'WEDNESDAY', label: 'Miércoles' },
  { value: 'THURSDAY', label: 'Jueves' },
  { value: 'FRIDAY', label: 'Viernes' },
  { value: 'SATURDAY', label: 'Sábado' },
]

interface ZoneData {
  id: string
  name: string
  description: string
  deliveryDays: string[]
  isActive: boolean
  sortOrder: number
}

interface ZoneFormProps {
  zone?: ZoneData
}

export function ZoneForm({ zone }: ZoneFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(
    zone?.deliveryDays || []
  )
  const isEditing = !!zone

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (selectedDays.length === 0) {
      toast.error('Seleccioná al menos un día de entrega')
      return
    }
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const input = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      deliveryDays: selectedDays,
      isActive: true,
    }

    const result = isEditing
      ? await updateDeliveryZone(zone.id, input)
      : await createDeliveryZone(input)

    if (result.success) {
      toast.success(isEditing ? 'Zona actualizada' : 'Zona creada')
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
        {isEditing ? (
          <Button variant="outline" size="sm">
            <Pencil className="h-3 w-3 mr-1" />
            Editar
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Zona
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Editar ${zone.name}` : 'Nueva Zona de Entrega'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={zone?.name}
              placeholder="Ej: Santa Rosa"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              defaultValue={zone?.description}
              placeholder="Ej: Santa Rosa y alrededores"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Días de entrega *</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <Button
                  key={day.value}
                  type="button"
                  variant={
                    selectedDays.includes(day.value) ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => toggleDay(day.value)}
                >
                  {day.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
