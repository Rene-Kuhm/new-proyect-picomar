'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
  _count: { products: number }
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory?: string
}

export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    params.delete('page')
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <Select value={selectedCategory || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[200px] h-9 sm:h-10 text-sm">
        <SelectValue placeholder="Categoría" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas las categorías</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name} ({cat._count.products})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
