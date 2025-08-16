import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 12;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

  try {
    const supabase = await createClient();
    
    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          url,
          alt,
          is_primary,
          order
        ),
        product_sizes (
          name,
          code,
          available
        ),
        product_colors (
          name,
          hex,
          available
        ),
        product_variants (
          id,
          sku,
          size,
          color,
          price,
          stock
        )
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Transform the data to match our TypeScript types
    const transformedProducts = products?.map(product => ({
      ...product,
      images: product.product_images || [],
      sizes: product.product_sizes || [],
      colors: product.product_colors || [],
      variants: product.product_variants || [],
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    }));

    return NextResponse.json({ 
      products: transformedProducts || [],
      pagination: {
        limit,
        offset,
        hasMore: products?.length === limit
      }
    });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a new product (admin only - add auth check in production)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        compare_at_price: body.compareAtPrice,
        category: body.category,
        subcategory: body.subcategory,
        stock: body.stock || 0,
        featured: body.featured || false,
        is_new: body.isNew || false,
        tags: body.tags || [],
        metadata: body.metadata || {}
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Insert images
    if (body.images && body.images.length > 0) {
      const images = body.images.map((img: any, index: number) => ({
        product_id: product.id,
        url: img.url,
        alt: img.alt || body.name,
        is_primary: img.isPrimary || index === 0,
        order: img.order || index
      }));

      await supabase.from('product_images').insert(images);
    }

    // Insert sizes
    if (body.sizes && body.sizes.length > 0) {
      const sizes = body.sizes.map((size: any) => ({
        product_id: product.id,
        name: size.name,
        code: size.code,
        available: size.available !== false
      }));

      await supabase.from('product_sizes').insert(sizes);
    }

    // Insert colors
    if (body.colors && body.colors.length > 0) {
      const colors = body.colors.map((color: any) => ({
        product_id: product.id,
        name: color.name,
        hex: color.hex,
        available: color.available !== false
      }));

      await supabase.from('product_colors').insert(colors);
    }

    // Insert variants
    if (body.variants && body.variants.length > 0) {
      const variants = body.variants.map((variant: any) => ({
        product_id: product.id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        price: variant.price || body.price,
        stock: variant.stock || 0,
        images: variant.images || []
      }));

      await supabase.from('product_variants').insert(variants);
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error in product creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}