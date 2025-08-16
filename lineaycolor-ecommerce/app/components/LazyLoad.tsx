'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  fallback?: ReactNode
  onLoad?: () => void
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
  onLoad
}: LazyLoadProps) {
  const [hasLoaded, setHasLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && !hasLoaded) {
      setHasLoaded(true)
      onLoad?.()
    }
  }, [inView, hasLoaded, onLoad])

  return (
    <div ref={ref}>
      {hasLoaded ? children : fallback}
    </div>
  )
}

// Dynamic import wrapper for components
export function lazyLoadComponent<T extends {}>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>
) {
  return dynamic(importFunc, {
    loading: () => <ComponentSkeleton />,
    ssr: false
  })
}

function ComponentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  )
}

// Re-export dynamic from Next.js for convenience
export { default as dynamic } from 'next/dynamic'