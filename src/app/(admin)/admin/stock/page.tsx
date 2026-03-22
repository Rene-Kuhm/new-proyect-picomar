import { getProducts } from '@/lib/actions/products'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StockUpdateButton } from '@/components/admin/stock-update-button'

export const metadata = { title: 'Stock - Admin' }

const unitLabels: Record<string, string> = {
  KG: 'kg',
  UNIT: 'un',
  BOX: 'caja',
  PACK: 'pack',
}

export default async function AdminStockPage() {
  const result = await getProducts({ isActive: true, limit: 200 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Stock</h1>
        <p className="text-muted-foreground">
          Controlá el inventario de todos los productos
        </p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Stock Actual</TableHead>
              <TableHead className="text-right">Alerta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[200px]">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((product) => {
              const stock = Number(product.stock.toString())
              const alert = Number(product.lowStockAlert.toString())
              const isLow = stock <= alert && stock > 0
              const isOut = stock <= 0

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        isOut
                          ? 'text-red-600 font-bold'
                          : isLow
                            ? 'text-yellow-600 font-semibold'
                            : 'font-medium'
                      }
                    >
                      {stock.toLocaleString('es-AR')} {unitLabels[product.unit]}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {alert} {unitLabels[product.unit]}
                  </TableCell>
                  <TableCell>
                    {isOut ? (
                      <Badge variant="destructive">Sin Stock</Badge>
                    ) : isLow ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Stock Bajo
                      </Badge>
                    ) : (
                      <Badge variant="default">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <StockUpdateButton
                      productId={product.id}
                      productName={product.name}
                      currentStock={stock}
                      unit={unitLabels[product.unit]}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
