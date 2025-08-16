export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  subcategory?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  sizes: ProductSize[];
  colors: ProductColor[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  rating?: number;
  reviewCount?: number;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  images?: string[];
}

export interface ProductSize {
  name: string;
  code: string;
  available: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  available: boolean;
}

export type ProductCategory = 
  | "dresses"
  | "tops"
  | "bottoms"
  | "outerwear"
  | "accessories"
  | "shoes";

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  shippingAddress: Address;
  billingAddress?: Address;
  sameAsShipping: boolean;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  email: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: ShippingMethod;
  paymentIntent?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  variantDetails: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus = 
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";