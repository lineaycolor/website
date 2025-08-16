'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from './components/ProductCard'
import { Product } from './lib/types'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  async function fetchFeaturedProducts() {
    try {
      const response = await fetch('/api/products?featured=true')
      const data = await response.json()
      setFeaturedProducts(data)
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="bg-white py-4 shadow-md fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-brand">LINEAYCOLOR</div>
          <ul className="flex gap-8">
            <li><Link href="/" className="text-primary hover:text-secondary transition-colors font-medium">Home</Link></li>
            <li><Link href="/products" className="text-primary hover:text-secondary transition-colors font-medium">Collections</Link></li>
            <li><Link href="/about" className="text-primary hover:text-secondary transition-colors font-medium">About</Link></li>
            <li><Link href="/cart" className="text-primary hover:text-secondary transition-colors font-medium">Cart</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="mt-16 h-[90vh] bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-center text-white">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4 tracking-wide-brand">NEW COLLECTION 2024</h1>
            <p className="text-xl mb-8">Discover the latest trends in fashion</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-white text-primary font-semibold tracking-wider transition-all hover:translate-y-[-2px] hover:shadow-lg">
              SHOP NOW
            </Link>
          </div>
        </section>

        <section className="py-16 px-8 max-w-7xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-12 tracking-brand">FEATURED COLLECTIONS</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-gray-100 py-12 px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay in Style</h2>
          <p className="mb-6">Get exclusive offers and be the first to know about new collections</p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-primary"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-gray-900 text-white text-center py-8">
        <p>&copy; 2024 Lineaycolor. All rights reserved.</p>
      </footer>
    </>
  )
}