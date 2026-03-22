import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/product-form'
import { getCategories } from '@/lib/actions/products'

export const metadata = { title: 'Editar Producto - Admin' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
  ])

  if (!product) notFound()

  const productData = {
    ...product,
    price: Number(product.price.toString()),
    stock: Number(product.stock.toString()),
    minOrderQty: Number(product.minOrderQty.toString()),
    lowStockAlert: Number(product.lowStockAlert.toString()),
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={productData} categories={categories} />
    </div>
  )
}
