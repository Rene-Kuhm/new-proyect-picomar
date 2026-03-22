import Link from 'next/link'
import { Plus, Pencil, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProducts } from '@/lib/actions/products'

export const metadata = { title: 'Productos - Admin' }

const unitLabels: Record<string, string> = {
  KG: 'kg',
  UNIT: 'unidad',
  BOX: 'caja',
  PACK: 'pack',
}

interface Props {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const result = await getProducts({
    search: params.search,
    page,
    limit: 25,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            {result.total} productos en total
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Search */}
      <form className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Buscar por nombre o SKU..."
            defaultValue={params.search}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            ) : (
              result.data.map((product) => {
                const stock = Number(product.stock.toString())
                const lowAlert = Number(product.lowStockAlert.toString())
                const isLowStock = stock <= lowAlert && stock > 0
                const isOutOfStock = stock <= 0

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-lg">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            '🐟'
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.isFeatured && (
                            <Badge variant="secondary" className="text-[10px]">
                              Destacado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${Number(product.price.toString()).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                      })}
                      <span className="text-xs text-muted-foreground font-normal">
                        /{unitLabels[product.unit]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          isOutOfStock
                            ? 'text-red-600 font-bold'
                            : isLowStock
                              ? 'text-yellow-600 font-semibold'
                              : ''
                        }
                      >
                        {stock.toLocaleString('es-AR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.isActive ? (
                        <Badge variant="default">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/productos/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`/admin/productos?page=${p}${params.search ? `&search=${params.search}` : ''}`}
                className={`px-3 py-1 rounded text-sm ${
                  p === page
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {p}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  )
}
