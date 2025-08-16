export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'summer' | 'evening' | 'casual'
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: ShippingAddress
  payment_intent_id: string
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}