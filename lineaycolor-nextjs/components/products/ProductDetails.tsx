"use client";

import { useState } from 'react';
import { Product, ProductVariant } from '@/types/product';
import { useCartStore } from '@/lib/store/cart';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Truck, Shield } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  // Find the matching variant based on selected size and color
  const selectedVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select size and color');
      return;
    }

    addItem(product, selectedVariant, quantity);
  };

  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Product Name & Price */}
      <div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">
          {product.name}
        </h1>
        
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-light text-primary">
            ${selectedVariant?.price || product.price}
          </span>
          {product.compareAtPrice && (
            <span className="text-xl text-gray-500 line-through">
              ${product.compareAtPrice}
            </span>
          )}
          {product.compareAtPrice && (
            <span className="text-sm text-red-600 font-medium">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {product.description}
      </p>

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="font-medium text-primary mb-3">Color</h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                disabled={!color.available}
                className={`group relative ${!color.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={color.name}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color.name
                      ? 'border-primary scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                {!color.available && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <h3 className="font-medium text-primary mb-3">Size</h3>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.code}
                onClick={() => setSelectedSize(size.name)}
                disabled={!size.available}
                className={`px-4 py-2 border transition-all ${
                  selectedSize === size.name
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 hover:border-gray-400'
                } ${!size.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {size.code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-medium text-primary mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 hover:border-primary transition-colors"
          >
            -
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={selectedVariant && quantity >= selectedVariant.stock}
            className="w-10 h-10 border border-gray-300 hover:border-primary transition-colors disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || !selectedSize || !selectedColor}
          className="w-full py-4 bg-primary text-white font-medium uppercase tracking-wider transition-all hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <ShoppingBag size={20} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="w-full py-4 border-2 border-primary text-primary font-medium uppercase tracking-wider transition-all hover:bg-primary hover:text-white flex items-center justify-center gap-3"
        >
          <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      {/* Product Features */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-gray-600">
          <Truck size={20} />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600">
          <Shield size={20} />
          <span>30-day return policy</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 text-sm text-gray-500">
        {product.tags && product.tags.length > 0 && (
          <p>Tags: {product.tags.join(', ')}</p>
        )}
        <p>Category: {product.category}</p>
        {product.subcategory && <p>Subcategory: {product.subcategory}</p>}
      </div>
    </motion.div>
  );
}