import ProductCard from './product-card'
import { Product } from '@/types/product'

async function getProducts(searchParams: {
  category?: string
  sort?: string
  page?: string
}) {
  const params = new URLSearchParams()
  
  if (searchParams.category) params.append('category', searchParams.category)
  if (searchParams.page) {
    const page = parseInt(searchParams.page)
    params.append('offset', ((page - 1) * 20).toString())
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products?${params}`,
    { cache: 'no-store' }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return response.json()
}

export default async function ProductGrid({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; page?: string }
}) {
  const { products, pagination } = await getProducts(searchParams)
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    )
  }
  
  // Sort products if needed
  const sortedProducts = [...products]
  if (searchParams.sort === 'price-asc') {
    sortedProducts.sort((a, b) => a.price - b.price)
  } else if (searchParams.sort === 'price-desc') {
    sortedProducts.sort((a, b) => b.price - a.price)
  } else if (searchParams.sort === 'newest') {
    sortedProducts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {pagination.hasMore && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>
      )}
    </>
  )
}