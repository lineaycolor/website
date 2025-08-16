'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/app/lib/types'
import { useCartStore } from '@/app/lib/cart-store'
import { useWishlistStore } from '@/app/lib/wishlist-store'
import ImageZoom from '@/app/components/ImageZoom'
import WishlistButton from '@/app/components/WishlistButton'
import SizeGuideModal from '@/app/components/SizeGuideModal'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  async function fetchProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      setProduct(data)
      if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
      if (data.colors?.length > 0) setSelectedColor(data.colors[0])
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleAddToCart() {
    if (!product || !selectedSize || !selectedColor) return
    
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      product,
      quantity,
      size: selectedSize,
      color: selectedColor
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link href="/products" className="text-primary underline">Back to products</Link>
      </div>
    )
  }

  return (
    <>
      <header className="bg-white py-4 shadow-md fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-brand">LINEAYCOLOR</Link>
          <ul className="flex gap-8">
            <li><Link href="/" className="text-primary hover:text-secondary transition-colors font-medium">Home</Link></li>
            <li><Link href="/products" className="text-primary hover:text-secondary transition-colors font-medium">Collections</Link></li>
            <li><Link href="/about" className="text-primary hover:text-secondary transition-colors font-medium">About</Link></li>
            <li><Link href="/cart" className="text-primary hover:text-secondary transition-colors font-medium">Cart</Link></li>
          </ul>
        </nav>
      </header>

      <main className="mt-20 px-8 max-w-7xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <div className="space-y-4">
            <ImageZoom
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              className="h-[600px] rounded-lg"
            />
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-20 rounded overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <WishlistButton product={product} className="p-2" />
            </div>
            <p className="text-2xl font-semibold mb-6">${product.price}</p>
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Size</label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-gray-300 hover:border-primary"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 border border-gray-300 hover:border-primary"
                >
                  +
                </button>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 font-semibold transition-colors ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-gray-700'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
            
            <p className="mt-4 text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} items in stock` : 'Currently unavailable'}
            </p>
            
            <div className="mt-8 border-t pt-8">
              <h3 className="font-semibold mb-4">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Premium quality materials</li>
                <li>• Designed for comfort and style</li>
                <li>• Easy care instructions included</li>
                <li>• Free shipping on orders over $100</li>
              </ul>
            </div>
          </div>
        </motion.div>
        
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          category={product.category}
        />
      </main>
    </>
  )
}