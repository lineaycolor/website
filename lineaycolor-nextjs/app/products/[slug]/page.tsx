import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductDetails from '@/components/products/ProductDetails';
import RelatedProducts from '@/components/products/RelatedProducts';
import { Product } from '@/types/product';

async function getProduct(slug: string): Promise<{ product: Product; relatedProducts: Product[] } | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  
  if (!data) {
    return {
      title: 'Product Not Found - Lineaycolor',
    };
  }

  const { product } = data;

  return {
    title: `${product.name} - Lineaycolor`,
    description: product.description || `Shop ${product.name} from Lineaycolor's collection. ${product.category} starting at $${product.price}`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
              <Image
                src={product.images[0]?.url || '/placeholder.jpg'}
                alt={product.images[0]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div key={image.id} className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 2}`}
                      fill
                      className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <ProductDetails product={product} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}