import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const collection = searchParams.get('collection')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (collection) {
      // Join with collections
      query = supabase
        .from('product_collections')
        .select(`
          products!inner(
            *,
            variants:product_variants(*)
          )
        `)
        .eq('collection_id', collection)
        .eq('products.is_active', true)
        .order('position', { ascending: true })
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .limit(limit)

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Transform the data if it's from collections
    const products = collection && data ? data.map(item => item.products) : data

    return NextResponse.json({
      products: products || [],
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: count ? offset + limit < count : false
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}