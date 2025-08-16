import { NextResponse } from 'next/server'
import { productsApi } from '@/app/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let products

    if (category) {
      products = await productsApi.getByCategory(category)
    } else if (featured === 'true') {
      products = await productsApi.getFeatured()
    } else {
      products = await productsApi.getAll()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}