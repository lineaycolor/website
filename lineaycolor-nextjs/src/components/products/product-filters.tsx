'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bags', label: 'Bags' },
]

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    sort: true,
  })
  
  const currentCategory = searchParams.get('category') || 'all'
  const currentSort = searchParams.get('sort') || 'featured'
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all' && key === 'category') {
      params.delete(key)
    } else if (value === 'featured' && key === 'sort') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`/products?${params.toString()}`)
  }
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium">Category</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.category ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSections.category && (
          <div className="mt-4 space-y-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center cursor-pointer hover:text-gray-700"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.value}
                  checked={currentCategory === category.value}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{category.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Sort */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-medium">Sort By</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.sort ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSections.sort && (
          <div className="mt-4 space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center cursor-pointer hover:text-gray-700"
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={currentSort === option.value}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}