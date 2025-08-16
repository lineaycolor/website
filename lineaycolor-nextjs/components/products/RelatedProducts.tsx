import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="py-16 border-t border-gray-200">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
        You May Also Like
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Link href={`/products/${product.slug}`} className="group">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.images?.[0]?.alt || product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {product.compareAtPrice && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-medium">
                    Sale
                  </div>
                )}
              </div>
              
              <h3 className="font-serif text-lg text-primary group-hover:text-accent transition-colors mb-1">
                {product.name}
              </h3>
              
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-light text-primary">
                  ${product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}