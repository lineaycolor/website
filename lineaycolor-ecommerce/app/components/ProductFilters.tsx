'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface FilterOptions {
  categories: string[]
  sizes: string[]
  colors: string[]
  priceRanges: { label: string; min: number; max: number }[]
}

interface ProductFiltersProps {
  options: FilterOptions
  onFilterChange: (filters: SelectedFilters) => void
  isMobile?: boolean
}

export interface SelectedFilters {
  categories: string[]
  sizes: string[]
  colors: string[]
  priceRange: { min: number; max: number } | null
}

export default function ProductFilters({ options, onFilterChange, isMobile = false }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(!isMobile)
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: null
  })

  const handleFilterToggle = (type: keyof Omit<SelectedFilters, 'priceRange'>, value: string) => {
    const newFilters = { ...selectedFilters }
    const array = newFilters[type] as string[]
    
    if (array.includes(value)) {
      newFilters[type] = array.filter(item => item !== value) as any
    } else {
      newFilters[type] = [...array, value] as any
    }
    
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceRangeChange = (range: { min: number; max: number } | null) => {
    const newFilters = { ...selectedFilters, priceRange: range }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      categories: [],
      sizes: [],
      colors: [],
      priceRange: null
    }
    setSelectedFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = 
    selectedFilters.categories.length > 0 ||
    selectedFilters.sizes.length > 0 ||
    selectedFilters.colors.length > 0 ||
    selectedFilters.priceRange !== null

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-40 bg-white' : 'sticky top-20'}`}>
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { x: '100%' } : { opacity: 0 }}
            animate={isMobile ? { x: 0 } : { opacity: 1 }}
            exit={isMobile ? { x: '100%' } : { opacity: 0 }}
            className={`${isMobile ? 'p-4 overflow-y-auto h-full' : 'p-4 bg-white rounded-lg shadow-md'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter Products</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {options.categories.map(category => (
                  <label key={category} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.categories.includes(category)}
                      onChange={() => handleFilterToggle('categories', category)}
                      className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Size</h4>
              <div className="grid grid-cols-3 gap-2">
                {options.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleFilterToggle('sizes', size)}
                    className={`px-3 py-1 text-sm border rounded transition-all ${
                      selectedFilters.sizes.includes(size)
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Color</h4>
              <div className="space-y-2">
                {options.colors.map(color => (
                  <label key={color} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.colors.includes(color)}
                      onChange={() => handleFilterToggle('colors', color)}
                      className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-2">
                {options.priceRanges.map(range => (
                  <label key={range.label} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        selectedFilters.priceRange?.min === range.min &&
                        selectedFilters.priceRange?.max === range.max
                      }
                      onChange={() => handlePriceRangeChange(range)}
                      className="mr-2 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedFilters.priceRange === null}
                    onChange={() => handlePriceRangeChange(null)}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">All Prices</span>
                </label>
              </div>
            </div>

            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-primary text-white font-semibold hover:bg-gray-700 transition-colors"
              >
                Apply Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      )}
    </div>
  )
}