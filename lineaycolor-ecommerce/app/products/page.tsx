'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '../components/ProductCard'
import { Product } from '../lib/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, products])

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-4xl font-bold text-center mb-8 tracking-brand">OUR COLLECTIONS</h1>
        
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-primary hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedCategory('summer')}
            className={`px-6 py-2 font-medium transition-colors ${
              selectedCategory === 'summer'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-primary hover:bg-gray-300'
            }`}
          >
            Summer
          </button>
          <button
            onClick={() => setSelectedCategory('evening')}
            className={`px-6 py-2 font-medium transition-colors ${
              selectedCategory === 'evening'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-primary hover:bg-gray-300'
            }`}
          >
            Evening
          </button>
          <button
            onClick={() => setSelectedCategory('casual')}
            className={`px-6 py-2 font-medium transition-colors ${
              selectedCategory === 'casual'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-primary hover:bg-gray-300'
            }`}
          >
            Casual
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}