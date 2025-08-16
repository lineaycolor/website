import { notFound } from 'next/navigation'
import ProductDetail from '@/components/products/product-detail'
import { Product } from '@/types/product'

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${id}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found - Lineaycolor',
    }
  }
  
  return {
    title: `${product.name} - Lineaycolor`,
    description: product.description || `Shop ${product.name} from our ${product.category} collection`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  if (!product) {
    notFound()
  }
  
  return <ProductDetail product={product} />
}