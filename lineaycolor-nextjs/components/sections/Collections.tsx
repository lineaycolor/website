"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const collections = [
  {
    id: 1,
    title: "Summer Elegance",
    image: "/images/collection1.jpg",
    price: "From $120",
  },
  {
    id: 2,
    title: "Urban Minimalism",
    image: "/images/collection2.jpg",
    price: "From $95",
  },
  {
    id: 3,
    title: "Evening Grace",
    image: "/images/collection3.jpg",
    price: "From $150",
  },
];

export default function Collections() {
  return (
    <section id="collections" className="py-20 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of timeless pieces
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={`/collections/${collection.id}`}>
                <div className="relative overflow-hidden aspect-[3/4] mb-4">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-center">
                      <p className="text-lg font-medium mb-2">{collection.price}</p>
                      <span className="inline-block px-6 py-2 bg-white text-black text-sm uppercase tracking-wider">
                        View Collection
                      </span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-serif text-2xl text-primary group-hover:text-accent transition-colors">
                  {collection.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}