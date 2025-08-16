import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        collections:product_collections(
          collection:collections(*)
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Transform collections data
    if (product.collections) {
      product.collections = product.collections.map((pc: any) => pc.collection)
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}