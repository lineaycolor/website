'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useWishlistStore } from '@/app/lib/wishlist-store'
import ProductCard from '@/app/components/ProductCard'

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore()

  return (
    <>
      <header className="bg-white py-4 shadow-md fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-brand">LINEAYCOLOR</Link>
          <ul className="flex gap-8">
            <li><Link href="/" className="text-primary hover:text-secondary transition-colors font-medium">Home</Link></li>
            <li><Link href="/products" className="text-primary hover:text-secondary transition-colors font-medium">Collections</Link></li>
            <li><Link href="/wishlist" className="text-primary hover:text-secondary transition-colors font-medium">Wishlist</Link></li>
            <li><Link href="/cart" className="text-primary hover:text-secondary transition-colors font-medium">Cart</Link></li>
          </ul>
        </nav>
      </header>

      <main className="mt-20 px-8 max-w-7xl mx-auto py-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-xl mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save your favorite items here for later</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-primary text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={clearWishlist}
                className="text-red-500 hover:text-red-700 underline text-sm"
              >
                Clear All
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </>
  )
}