'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function CartButton() {
  const { toggleCart, getItemCount } = useCartStore()
  const itemCount = getItemCount()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label="Open shopping cart"
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}