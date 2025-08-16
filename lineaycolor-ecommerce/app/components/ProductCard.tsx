'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/app/lib/types'
import WishlistButton from './WishlistButton'
import QuickViewModal from './QuickViewModal'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false)

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowQuickView(true)
  }

  return (
    <>
      <motion.article 
        className="group relative overflow-hidden cursor-pointer rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
        whileHover={{ y: -5 }}
      >
        <Link href={`/products/${product.id}`}>
          <div className="relative h-[400px] overflow-hidden">
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <WishlistButton product={product} className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white" />
            </div>
          </div>
        </Link>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-6 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="text-xl font-semibold mb-2 text-primary">{product.name}</h3>
          <p className="text-secondary mb-2 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-end">
            <p className="text-lg font-bold text-primary">From ${product.price}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickView}
              className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Quick View
            </motion.button>
          </div>
        </div>
      </motion.article>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  )
}