export interface Product {
  id: string
  sku: string
  name: string
  description?: string
  price: number
  compareAtPrice?: number
  currency: string
  category: string
  subcategory?: string
  brand: string
  tags: string[]
  images: ProductImage[]
  isActive: boolean
  isFeatured: boolean
  metadata: Record<string, any>
  variants?: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  url: string
  alt?: string
  width?: number
  height?: number
  position?: number
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name: string
  size?: string
  color?: string
  material?: string
  price?: number
  compareAtPrice?: number
  inventoryQuantity: number
  inventoryPolicy: 'deny' | 'continue'
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  imageUrl?: string
  position: number
  isActive: boolean
  metadata: Record<string, any>
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  position: number
  metadata: Record<string, any>
  products?: Product[]
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
}