import { NextResponse } from 'next/server'
import { ordersApi, supabase } from '@/app/lib/supabase'
import type { CartItem } from '@/app/lib/types'

export async function POST(request: Request) {
  try {
    const { items, total, shippingAddress, paymentIntentId } = await request.json()

    // Create order
    const order = await ordersApi.create({
      user_id: null, // Guest checkout for now
      items,
      total,
      status: 'pending',
      shipping_address: shippingAddress,
      payment_intent_id: paymentIntentId,
    })

    // Update inventory for each item
    for (const item of items as CartItem[]) {
      // Decrease product stock
      const { error: stockError } = await supabase
        .from('products')
        .update({ stock: item.product.stock - item.quantity })
        .eq('id', item.product.id)

      if (stockError) {
        console.error('Error updating stock:', stockError)
      }

      // Record inventory transaction
      const { error: transactionError } = await supabase
        .from('inventory_transactions')
        .insert({
          product_id: item.product.id,
          order_id: order.id,
          quantity: -item.quantity,
          transaction_type: 'sale',
        })

      if (transactionError) {
        console.error('Error recording transaction:', transactionError)
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}