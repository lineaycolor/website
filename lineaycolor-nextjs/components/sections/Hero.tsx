"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Floating Shapes */}
      <div className="shape shape-1" />
      <div className="shape shape-2" />
      <div className="shape shape-3" />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4"
          >
            Elegance Redefined
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl lg:text-2xl font-light tracking-wider mb-12 max-w-2xl mx-auto"
          >
            Minimalist fashion that makes a statement
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#collections" className="btn-primary">
              Shop Collection
            </Link>
            <Link href="#about" className="btn-secondary">
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="scroll-indicator"
      />
    </section>
  );
}