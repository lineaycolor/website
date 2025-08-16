import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, ProductVariant } from '@/types/product'

interface CartItem {
  id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Computed values
  getSubtotal: () => number
  getItemCount: () => number
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        const itemId = variant ? `${product.id}-${variant.id}` : product.id
        const existingItem = get().getCartItem(product.id, variant?.id)

        if (existingItem) {
          // Update quantity if item already exists
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }))
        } else {
          // Add new item
          const price = variant?.price ?? product.price
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            variantId: variant?.id,
            product,
            variant,
            quantity,
            price,
          }
          set((state) => ({ items: [...state.items, newItem] }))
        }
        
        // Open cart when item is added
        set({ isOpen: true })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      getCartItem: (productId, variantId) => {
        const itemId = variantId ? `${productId}-${variantId}` : productId
        return get().items.find((item) => item.id === itemId)
      },
    }),
    {
      name: 'lineaycolor-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
)