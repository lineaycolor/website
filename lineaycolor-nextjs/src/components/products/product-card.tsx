'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // If product has variants, redirect to product page
    if (product.variants && product.variants.length > 1) {
      window.location.href = `/products/${product.id}`
      return
    }
    
    // Otherwise add to cart with default variant or no variant
    const variant = product.variants?.[0]
    addItem(product, variant)
  }
  
  const mainImage = product.images[0]
  const hoverImage = product.images[1]
  
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
        {mainImage && (
          <>
            <Image
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              fill
              className="object-cover transition-opacity duration-300 group-hover:opacity-0"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {hoverImage && (
              <Image
                src={hoverImage.url}
                alt={hoverImage.alt || product.name}
                fill
                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-gray-100 flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Quick Add
        </button>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </p>
          {product.compareAtPrice && (
            <p className="text-sm text-gray-500 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}