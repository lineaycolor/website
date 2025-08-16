"use client";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal, tax, shipping, total } = useCartStore();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={closeCart} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                      <Dialog.Title className="text-xl font-serif font-bold text-primary">
                        Shopping Cart ({items.length})
                      </Dialog.Title>
                      <button
                        onClick={closeCart}
                        className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      {items.length === 0 ? (
                        <div className="text-center py-12">
                          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500">Your cart is empty</p>
                          <Link
                            href="/#collections"
                            onClick={closeCart}
                            className="mt-4 inline-block text-accent hover:text-primary transition-colors"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {items.map((item) => (
                            <div key={item.variant.id} className="flex gap-4">
                              <div className="relative w-24 h-32 bg-gray-100 overflow-hidden">
                                <Image
                                  src={item.product.images[0]?.url || '/placeholder.jpg'}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="96px"
                                />
                              </div>
                              
                              <div className="flex-1">
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  onClick={closeCart}
                                  className="font-medium text-primary hover:text-accent transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.variant.size} / {item.variant.color}
                                </p>
                                <p className="text-sm font-medium mt-1">
                                  ${item.variant.price}
                                </p>
                                
                                <div className="flex items-center gap-3 mt-3">
                                  <div className="flex items-center border border-gray-300">
                                    <button
                                      onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                                      className="px-2 py-1 hover:bg-gray-100"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                                      className="px-2 py-1 hover:bg-gray-100"
                                    >
                                      +
                                    </button>
                                  </div>
                                  
                                  <button
                                    onClick={() => removeItem(item.variant.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-medium text-primary">
                                  ${(item.variant.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t px-6 py-4 space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                          </div>
                          {shipping > 0 && (
                            <p className="text-xs text-gray-500">
                              Add ${(100 - subtotal).toFixed(2)} more for free shipping
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between text-lg font-medium pt-2 border-t">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        
                        <Link
                          href="/checkout"
                          onClick={closeCart}
                          className="w-full block text-center py-3 bg-primary text-white font-medium uppercase tracking-wider hover:bg-opacity-90 transition-all"
                        >
                          Checkout
                        </Link>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}