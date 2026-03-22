import { ProductForm } from '@/components/admin/product-form'
import { getCategories } from '@/lib/actions/products'

export const metadata = { title: 'Nuevo Producto - Admin' }

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
        <p className="text-muted-foreground">Agregá un producto al catálogo</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
