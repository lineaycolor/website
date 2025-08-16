import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    
    const { data: product, error } = await supabase
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
          stock,
          images
        )
      `)
      .eq('slug', slug)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform the data to match our TypeScript types
    const transformedProduct = {
      ...product,
      images: product.product_images || [],
      sizes: product.product_sizes || [],
      colors: product.product_colors || [],
      variants: product.product_variants || [],
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at),
    };

    // Get related products
    const { data: relatedProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        compare_at_price,
        product_images (
          url,
          alt,
          is_primary
        )
      `)
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(4);

    return NextResponse.json({ 
      product: transformedProduct,
      relatedProducts: relatedProducts || []
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update a product (admin only - add auth check in production)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        compare_at_price: body.compareAtPrice,
        category: body.category,
        subcategory: body.subcategory,
        stock: body.stock,
        featured: body.featured,
        is_new: body.isNew,
        tags: body.tags,
        metadata: body.metadata,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete a product (admin only - add auth check in production)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('slug', slug);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}