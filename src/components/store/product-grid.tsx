'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Product {
  id: string
  name: string
  slug: string
  price: { toString(): string }
  unit: string
  stock: { toString(): string }
  imageUrl: string | null
  isActive: boolean
  isFeatured: boolean
  category: { name: string }
}

interface ProductGridProps {
  products: Product[]
  totalPages: number
  currentPage: number
}

const unitLabels: Record<string, string> = {
  KG: 'kg',
  UNIT: 'unidad',
  BOX: 'caja',
  PACK: 'pack',
}

export function ProductGrid({
  products,
  totalPages,
  currentPage,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">
          No se encontraron productos
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <Link href={`/catalogo/${product.slug}`}>
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-4xl">🐟</span>
                )}
                {product.isFeatured && (
                  <Badge className="absolute top-2 left-2">Destacado</Badge>
                )}
                {Number(product.stock.toString()) <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg">
                      Sin Stock
                    </Badge>
                  </div>
                )}
              </div>
            </Link>
            <CardContent className="flex-1 pt-4">
              <p className="text-xs text-muted-foreground mb-1">
                {product.category.name}
              </p>
              <Link href={`/catalogo/${product.slug}`}>
                <h3 className="font-semibold hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-2xl font-bold mt-2 text-blue-600">
                ${Number(product.price.toString()).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                <span className="text-sm font-normal text-muted-foreground">
                  /{unitLabels[product.unit] || product.unit}
                </span>
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={Number(product.stock.toString()) <= 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al pedido
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/catalogo?page=${page}`}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
