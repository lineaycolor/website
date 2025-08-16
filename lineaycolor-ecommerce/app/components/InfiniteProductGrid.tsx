'use client'

import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { Product } from '@/app/lib/types'

interface InfiniteProductGridProps {
  initialProducts: Product[]
  loadMore: (page: number) => Promise<Product[]>
  hasMore: boolean
  gridCols?: string
}

export default function InfiniteProductGrid({ 
  initialProducts, 
  loadMore, 
  hasMore: initialHasMore,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [error, setError] = useState<string | null>(null)

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newProducts = await loadMore(page + 1)
      
      if (newProducts.length === 0) {
        setHasMore(false)
      } else {
        setProducts(prev => [...prev, ...newProducts])
        setPage(prev => prev + 1)
      }
    } catch (err) {
      setError('Failed to load more products. Please try again.')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, loadMore])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreProducts()
    }
  }, [inView, hasMore, loading, loadMoreProducts])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`grid ${gridCols} gap-8`}
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {loading && (
        <div className={`grid ${gridCols} gap-8 mt-8`}>
          {[...Array(6)].map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center mt-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadMoreProducts}
            className="px-6 py-2 bg-primary text-white hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {hasMore && !loading && !error && (
        <div ref={ref} className="flex justify-center mt-8">
          <div className="animate-pulse text-gray-500">
            Scroll for more...
          </div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center mt-8 text-gray-500">
          You've reached the end of the collection
        </div>
      )}
    </div>
  )
}