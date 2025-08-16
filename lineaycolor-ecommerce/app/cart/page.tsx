'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/app/lib/cart-store'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

  if (items.length === 0) {
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

        <main className="mt-20 px-8 max-w-7xl mx-auto py-8 min-h-screen">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <Link href="/products" className="inline-block px-8 py-3 bg-primary text-white font-semibold hover:bg-gray-700 transition-colors">
              Shop Now
            </Link>
          </div>
        </main>
      </>
    )
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b py-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.product.images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Size: {item.size} | Color: {item.color}</p>
                  <p className="font-semibold mt-2">${item.product.price}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 border border-gray-300 hover:border-primary"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border border-gray-300 hover:border-primary"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              onClick={clearCart}
              className="mt-4 text-red-500 hover:text-red-700 underline"
            >
              Clear Cart
            </button>
          </div>
          
          <div className="bg-gray-100 p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3 bg-primary text-white text-center font-semibold hover:bg-gray-700 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}