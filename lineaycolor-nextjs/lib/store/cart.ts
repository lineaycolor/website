import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, CartItem, Cart } from '@/types/product';

interface CartStore extends Cart {
  isOpen: boolean;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  calculateTotals: () => void;
}

const TAX_RATE = 0.08; // 8% tax rate
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      isOpen: false,

      addItem: (product: Product, variant: ProductVariant, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.variant.id === variant.id
          );

          let newItems: CartItem[];

          if (existingItemIndex > -1) {
            // Update quantity if item already exists
            newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            const newItem: CartItem = {
              product,
              variant,
              quantity,
              addedAt: new Date()
            };
            newItems = [...state.items, newItem];
          }

          return { items: newItems };
        });

        get().calculateTotals();
        get().openCart(); // Open cart when item is added
      },

      removeItem: (variantId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.variant.id !== variantId)
        }));
        get().calculateTotals();
      },

      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.variant.id === variantId
              ? { ...item, quantity }
              : item
          )
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0
        });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      calculateTotals: () => {
        const state = get();
        const subtotal = state.items.reduce(
          (sum, item) => sum + (item.variant.price * item.quantity),
          0
        );

        const tax = subtotal * TAX_RATE;
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const total = subtotal + tax + shipping - state.discount;

        set({
          subtotal,
          tax,
          shipping,
          total
        });
      }
    }),
    {
      name: 'lineaycolor-cart',
      partialize: (state) => ({
        items: state.items,
        discount: state.discount
      })
    }
  )
);