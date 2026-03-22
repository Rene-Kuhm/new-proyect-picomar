'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { registerUser } from '@/lib/actions/auth'

interface Zone {
  id: string
  name: string
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState('')

  useEffect(() => {
    fetch('/api/zones')
      .then((res) => res.json())
      .then((data) => setZones(data))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const input = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      businessName: formData.get('businessName') as string,
      cuit: formData.get('cuit') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      zoneId: selectedZone || undefined,
    }

    try {
      const result = await registerUser(input)

      if (result.success) {
        setSuccess(true)
        toast.success(result.message)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">
            ¡Registro exitoso!
          </CardTitle>
          <CardDescription className="text-base">
            Tu solicitud fue enviada. Te notificaremos cuando tu cuenta sea
            aprobada por nuestro equipo.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild variant="outline">
            <Link href="/login">Ir a Iniciar Sesión</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Registro de Cliente</CardTitle>
        <CardDescription>
          Completá tus datos para solicitar una cuenta mayorista
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Business Info */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Razón Social *</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="Mi Pescadería S.R.L."
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuit">CUIT *</Label>
              <Input
                id="cuit"
                name="cuit"
                placeholder="XX-XXXXXXXX-X"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="2954-XXXXXX"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              name="address"
              placeholder="Av. San Martín 1234"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Santa Rosa"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provincia *</Label>
              <Input
                id="province"
                name="province"
                placeholder="La Pampa"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {zones.length > 0 && (
            <div className="space-y-2">
              <Label>Zona de Entrega</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná tu zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Datos de acceso</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@empresa.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Solicitar Cuenta'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿Ya tenés cuenta?{' '}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Iniciá sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
