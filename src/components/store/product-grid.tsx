'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Product {
  id: string
  name: string
  slug: string
  price: number | { toString(): string }
  unit: string
  stock: number | { toString(): string }
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
      <div className="text-center py-12 sm:py-16">
        <p className="text-base sm:text-lg text-muted-foreground">
          No se encontraron productos
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product) => {
          const price = Number(product.price.toString())
          const stock = Number(product.stock.toString())

          return (
            <div key={product.id} className="group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <Link href={`/catalogo/${product.slug}`}>
                <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl">🐟</span>
                  )}
                  {product.isFeatured && (
                    <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[10px] sm:text-xs">Destacado</Badge>
                  )}
                  {stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-xs sm:text-sm">
                        Sin Stock
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
                  {product.category.name}
                </p>
                <Link href={`/catalogo/${product.slug}`}>
                  <h3 className="text-xs sm:text-sm font-semibold hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-base sm:text-xl md:text-2xl font-bold mt-1.5 sm:mt-2 text-blue-600">
                  ${price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  <span className="text-[10px] sm:text-sm font-normal text-muted-foreground">
                    /{unitLabels[product.unit] || product.unit}
                  </span>
                </p>
              </div>

              <div className="p-3 sm:p-4 pt-0">
                <Button
                  className="w-full text-xs sm:text-sm h-8 sm:h-9"
                  disabled={stock <= 0}
                >
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Agregar al pedido</span>
                  <span className="sm:hidden">Agregar</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/catalogo?page=${page}`}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
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
