import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { supabase, supabaseAdmin } from '@/lib/auth/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    const sessionId = cookieStore.get('cart-session')?.value

    let cart = null

    if (session?.user) {
      // Get user's cart
      const { data } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      
      cart = data
    } else if (sessionId) {
      // Get guest cart
      const { data } = await supabase
        .from('carts')
        .select('*')
        .eq('session_id', sessionId)
        .single()
      
      cart = data
    }

    return NextResponse.json({ cart: cart || { items: [] } })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { items } = body

    const cookieStore = cookies()
    let sessionId = cookieStore.get('cart-session')?.value

    // Generate session ID for guests
    if (!session?.user && !sessionId) {
      sessionId = crypto.randomUUID()
      cookieStore.set('cart-session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    const cartData = {
      items,
      user_id: session?.user?.id || null,
      session_id: session?.user ? null : sessionId,
      updated_at: new Date().toISOString(),
    }

    let cart

    if (session?.user) {
      // Upsert user cart
      const { data, error } = await supabaseAdmin
        .from('carts')
        .upsert(cartData, {
          onConflict: 'user_id',
        })
        .select()
        .single()

      if (error) throw error
      cart = data
    } else if (sessionId) {
      // Upsert guest cart
      const { data, error } = await supabaseAdmin
        .from('carts')
        .upsert(cartData, {
          onConflict: 'session_id',
        })
        .select()
        .single()

      if (error) throw error
      cart = data
    }

    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Cart sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    const sessionId = cookieStore.get('cart-session')?.value

    if (session?.user) {
      await supabaseAdmin
        .from('carts')
        .delete()
        .eq('user_id', session.user.id)
    } else if (sessionId) {
      await supabaseAdmin
        .from('carts')
        .delete()
        .eq('session_id', sessionId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart clear error:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}