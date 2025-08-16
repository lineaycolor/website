"use client";

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CartButton() {
  const { items, openCart } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-primary hover:text-accent transition-colors"
      aria-label="Open shopping cart"
    >
      <ShoppingBag size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}