import type { Metadata, Viewport } from 'next'
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lineaycolor - Fashion & Style | Modern Fashion Brand',
  description: 'Discover Lineaycolor\'s latest fashion collections. Modern, elegant designs for the contemporary lifestyle.',
  keywords: 'fashion, style, clothing, lineaycolor, modern fashion, designer clothes',
  authors: [{ name: 'Lineaycolor' }],
  openGraph: {
    title: 'Lineaycolor - Fashion & Style',
    description: 'Discover modern fashion collections at Lineaycolor',
    type: 'website',
    locale: 'en_US',
    siteName: 'Lineaycolor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lineaycolor - Fashion & Style',
    description: 'Discover modern fashion collections at Lineaycolor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for potential external resources */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .font-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          `
        }} />
      </head>
      <body className="font-sans">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}