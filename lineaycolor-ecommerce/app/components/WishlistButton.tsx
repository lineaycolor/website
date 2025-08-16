'use client'

import { motion } from 'framer-motion'
import { useWishlistStore } from '@/app/lib/wishlist-store'
import { Product } from '@/app/lib/types'

interface WishlistButtonProps {
  product: Product
  className?: string
  showLabel?: boolean
}

export default function WishlistButton({ product, className = '', showLabel = false }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore()
  const isWishlisted = isInWishlist(product.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`relative group ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <motion.svg
        className="w-6 h-6"
        fill={isWishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={false}
        animate={{
          scale: isWishlisted ? [1, 1.2, 1] : 1,
          fill: isWishlisted ? '#ef4444' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
      
      {showLabel && (
        <span className="ml-2 text-sm">
          {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
      
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      </div>
    </motion.button>
  )
}