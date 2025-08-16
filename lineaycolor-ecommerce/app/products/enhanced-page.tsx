'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import InfiniteProductGrid from '../components/InfiniteProductGrid'
import ProductFilters, { SelectedFilters, FilterOptions } from '../components/ProductFilters'
import ProductSort, { SortOption } from '../components/ProductSort'
import { Product } from '../lib/types'
import { useMediaQuery } from 'react-use'

const ITEMS_PER_PAGE = 9

export default function EnhancedProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: null
  })
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    fetchAllProducts()
  }, [])

  async function fetchAllProducts() {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setAllProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOptions: FilterOptions = useMemo(() => {
    const categories = [...new Set(allProducts.map(p => p.category))]
    const sizes = [...new Set(allProducts.flatMap(p => p.sizes))]
    const colors = [...new Set(allProducts.flatMap(p => p.colors))]
    
    return {
      categories,
      sizes,
      colors,
      priceRanges: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: 'Over $200', min: 200, max: 999999 }
      ]
    }
  }, [allProducts])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Apply filters
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(p => selectedFilters.categories.includes(p.category))
    }
    if (selectedFilters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => selectedFilters.sizes.includes(size))
      )
    }
    if (selectedFilters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(color => selectedFilters.colors.includes(color))
      )
    }
    if (selectedFilters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= selectedFilters.priceRange!.min && 
        p.price <= selectedFilters.priceRange!.max
      )
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'newest':
      default:
        // Assuming newer products have later created_at dates
        break
    }

    return filtered
  }, [allProducts, selectedFilters, sortOption])

  const loadMore = async (page: number) => {
    // Simulate pagination for infinite scroll
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredAndSortedProducts.slice(start, end)
  }

  const initialProducts = filteredAndSortedProducts.slice(0, ITEMS_PER_PAGE)
  const hasMore = filteredAndSortedProducts.length > ITEMS_PER_PAGE

  return (
    <>
      <header className="bg-white py-4 shadow-md fixed w-full top-0 z-40">
        <nav className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-brand">LINEAYCOLOR</Link>
          <ul className="hidden md:flex gap-8">
            <li><Link href="/" className="text-primary hover:text-secondary transition-colors font-medium">Home</Link></li>
            <li><Link href="/products" className="text-primary hover:text-secondary transition-colors font-medium">Collections</Link></li>
            <li><Link href="/wishlist" className="text-primary hover:text-secondary transition-colors font-medium">Wishlist</Link></li>
            <li><Link href="/cart" className="text-primary hover:text-secondary transition-colors font-medium">Cart</Link></li>
          </ul>
        </nav>
      </header>

      <main className="mt-20 px-4 md:px-8 max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center mb-2 tracking-brand">OUR COLLECTIONS</h1>
          <p className="text-center text-gray-600">
            Discover {filteredAndSortedProducts.length} stunning pieces
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {filteredAndSortedProducts.length} products
          </div>
          <ProductSort currentSort={sortOption} onSortChange={setSortOption} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {!isMobile && (
            <div className="lg:col-span-1">
              <ProductFilters 
                options={filterOptions} 
                onFilterChange={setSelectedFilters}
              />
            </div>
          )}

          <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No products match your filters</p>
                <button
                  onClick={() => setSelectedFilters({
                    categories: [],
                    sizes: [],
                    colors: [],
                    priceRange: null
                  })}
                  className="px-6 py-2 bg-primary text-white hover:bg-gray-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <InfiniteProductGrid
                initialProducts={initialProducts}
                loadMore={loadMore}
                hasMore={hasMore}
                gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              />
            )}
          </div>
        </div>

        {isMobile && (
          <ProductFilters 
            options={filterOptions} 
            onFilterChange={setSelectedFilters}
            isMobile
          />
        )}
      </main>
    </>
  )
}