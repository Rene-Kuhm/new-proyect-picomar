'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/lib/actions/products'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface ProductData {
  id?: string
  name: string
  description?: string | null
  sku: string
  price: number
  unit: string
  minOrderQty: number
  stock: number
  lowStockAlert: number
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  imageUrl?: string | null
}

interface ProductFormProps {
  product?: ProductData
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!product?.id

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const input = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      sku: formData.get('sku') as string,
      price: Number(formData.get('price')),
      unit: formData.get('unit') as 'KG' | 'UNIT' | 'BOX' | 'PACK',
      minOrderQty: Number(formData.get('minOrderQty')),
      stock: Number(formData.get('stock')),
      lowStockAlert: Number(formData.get('lowStockAlert')),
      categoryId: formData.get('categoryId') as string,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      imageUrl: (formData.get('imageUrl') as string) || '',
    }

    try {
      const result = isEditing
        ? await updateProduct(product.id!, input)
        : await createProduct(input)

      if (result.success) {
        toast.success(isEditing ? 'Producto actualizado' : 'Producto creado')
        router.push('/admin/productos')
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Error al guardar el producto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Name & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={product?.sku}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description || ''}
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <select
                name="categoryId"
                defaultValue={product?.categoryId}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Seleccionar...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Unidad *</Label>
              <select
                name="unit"
                defaultValue={product?.unit || 'KG'}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="KG">Kilogramo (kg)</option>
                <option value="UNIT">Unidad</option>
                <option value="BOX">Caja</option>
                <option value="PACK">Pack</option>
              </select>
            </div>
          </div>

          {/* Price & Min Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio ($) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrderQty">Cantidad mínima *</Label>
              <Input
                id="minOrderQty"
                name="minOrderQty"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.minOrderQty || 1}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Stock & Alert */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock actual</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.stock || 0}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockAlert">Alerta stock bajo</Label>
              <Input
                id="lowStockAlert"
                name="lowStockAlert"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.lowStockAlert || 10}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de imagen</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://res.cloudinary.com/..."
              defaultValue={product?.imageUrl || ''}
              disabled={isLoading}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={product?.isActive ?? true}
                className="rounded border-input"
              />
              <span className="text-sm">Activo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={product?.isFeatured ?? false}
                className="rounded border-input"
              />
              <span className="text-sm">Destacado</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar'
                  : 'Crear Producto'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/productos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
