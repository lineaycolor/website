import { Suspense } from 'react'
import ProductGrid from '@/components/products/product-grid'
import ProductFilters from '@/components/products/product-filters'

export const metadata = {
  title: 'Products - Lineaycolor',
  description: 'Explore our collection of minimalist fashion pieces',
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; page?: string }
}) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        <h1 className="text-4xl font-serif font-bold text-center mb-12">
          Our Collection
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters />
          </aside>
          
          <main className="lg:col-span-3">
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}