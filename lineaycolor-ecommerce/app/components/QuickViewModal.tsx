'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FocusTrap from 'focus-trap-react'
import Image from 'next/image'
import { Product } from '@/app/lib/types'
import { useCartStore } from '@/app/lib/cart-store'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '')
      setSelectedColor(product.colors?.[0] || '')
      setQuantity(1)
    }
  }, [product])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!product) return null

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    
    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      product,
      quantity,
      size: selectedSize,
      color: selectedColor
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <FocusTrap>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-4xl mx-auto bg-white rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-y-auto md:inset-x-auto md:left-1/2 md:-translate-x-1/2"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                <div className="relative h-96 md:h-full min-h-[400px]">
                  <Image
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-xl font-semibold text-primary">${product.price}</p>
                  </div>

                  <p className="text-gray-600">{product.description}</p>

                  {product.sizes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Size</label>
                      <div className="flex gap-2 flex-wrap">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 border transition-all ${
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <div className="flex gap-2 flex-wrap">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border transition-all ${
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 border border-gray-300 hover:border-primary transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-1 border border-gray-300 hover:border-primary transition-colors"
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

                  <p className="text-sm text-gray-600">
                    {product.stock > 0 ? `${product.stock} items in stock` : 'Currently unavailable'}
                  </p>
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        </>
      )}
    </AnimatePresence>
  )
}