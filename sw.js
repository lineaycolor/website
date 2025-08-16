// Service Worker for Lineaycolor Website
// Version: 1.0.0

const CACHE_NAME = 'lineaycolor-v1';
const RUNTIME_CACHE = 'lineaycolor-runtime';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index-performance.html',
  '/hero-image.jpg',
  '/collection1.jpg',
  '/collection2.jpg',
  '/collection3.jpg'
];

// Cache optimized images
const IMAGE_ASSETS = [
  '/images/optimized/hero-1920w.webp',
  '/images/optimized/hero-1920w.jpg',
  '/images/optimized/hero-1440w.webp',
  '/images/optimized/hero-1440w.jpg',
  '/images/optimized/hero-1024w.webp',
  '/images/optimized/hero-1024w.jpg',
  '/images/optimized/hero-768w.webp',
  '/images/optimized/hero-768w.jpg',
  '/images/optimized/hero-480w.webp',
  '/images/optimized/hero-480w.jpg',
  '/images/optimized/collection1-600w.webp',
  '/images/optimized/collection1-600w.jpg',
  '/images/optimized/collection1-450w.webp',
  '/images/optimized/collection1-450w.jpg',
  '/images/optimized/collection1-300w.webp',
  '/images/optimized/collection1-300w.jpg',
  '/images/optimized/collection2-600w.webp',
  '/images/optimized/collection2-600w.jpg',
  '/images/optimized/collection2-450w.webp',
  '/images/optimized/collection2-450w.jpg',
  '/images/optimized/collection2-300w.webp',
  '/images/optimized/collection2-300w.jpg',
  '/images/optimized/collection3-600w.webp',
  '/images/optimized/collection3-600w.jpg',
  '/images/optimized/collection3-450w.webp',
  '/images/optimized/collection3-450w.jpg',
  '/images/optimized/collection3-300w.webp',
  '/images/optimized/collection3-300w.jpg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll([...STATIC_ASSETS, ...IMAGE_ASSETS]);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
            .map(cacheName => {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    // Images: Cache First strategy
    event.respondWith(cacheFirst(request));
  } else if (url.origin === location.origin) {
    // Same-origin HTML/CSS/JS: Network First strategy
    event.respondWith(networkFirst(request));
  } else {
    // External resources: Network First with timeout
    event.respondWith(networkFirstWithTimeout(request, 3000));
  }
});

// Cache First strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return placeholder image if available
    const placeholder = await cache.match('/images/placeholder.jpg');
    return placeholder || new Response('Image not available', { status: 404 });
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response('Offline - Content not available', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Network First with timeout
async function networkFirstWithTimeout(request, timeout) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  return new Promise((resolve, reject) => {
    let timeoutId;
    const doFetch = fetch(request)
      .then(response => {
        clearTimeout(timeoutId);
        if (response.ok) {
          cache.put(request, response.clone());
        }
        resolve(response);
      })
      .catch(async error => {
        clearTimeout(timeoutId);
        const cached = await cache.match(request);
        if (cached) {
          resolve(cached);
        } else {
          reject(error);
        }
      });
    
    timeoutId = setTimeout(async () => {
      const cached = await cache.match(request);
      if (cached) {
        resolve(cached);
      }
    }, timeout);
  });
}

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys()
        .then(cacheNames => Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        ))
        .then(() => event.ports[0].postMessage({ cleared: true }))
    );
  }
});