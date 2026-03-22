import { Suspense } from 'react'
import { getProducts } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/products'
import { ProductGrid } from '@/components/store/product-grid'
import { CategoryFilter } from '@/components/store/category-filter'
import { SearchBar } from '@/components/store/search-bar'

export const metadata = {
  title: 'Catálogo',
}

interface CatalogoPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    page?: string
  }>
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const [productsResult, categories] = await Promise.all([
    getProducts({
      search: params.search,
      categoryId: params.category,
      isActive: true,
      page,
      limit: 20,
    }),
    getCategories(true),
  ])

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
          <p className="text-muted-foreground mt-1">
            Explorá nuestra variedad de productos del mar
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar defaultValue={params.search} />
          <CategoryFilter
            categories={categories}
            selectedCategory={params.category}
          />
        </div>

        <Suspense fallback={<div>Cargando productos...</div>}>
          <ProductGrid
            products={productsResult.data}
            totalPages={productsResult.totalPages}
            currentPage={page}
          />
        </Suspense>
      </div>
    </div>
  )
}
