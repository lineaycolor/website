// Custom service worker extensions for notifications

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    // Open collections page
    event.waitUntil(
      clients.openWindow('/#collections')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open home page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle push events
self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Check out our latest collection!',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || '1'
    },
    actions: data.actions || [
      { action: 'explore', title: 'Explore' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Lineaycolor', options)
  );
});

// Background sync for cart
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  try {
    // Get cart data from IndexedDB
    const cache = await caches.open('cart-data');
    const cartRequest = await cache.match('/cart-data');
    
    if (cartRequest) {
      const cartData = await cartRequest.json();
      
      // Sync cart with server
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });
      
      if (response.ok) {
        // Clear local cart cache after successful sync
        await cache.delete('/cart-data');
      }
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

// Periodic background sync for notifications
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'check-notifications') {
    event.waitUntil(checkForNotifications());
  }
});

async function checkForNotifications() {
  try {
    const response = await fetch('/api/notifications/check');
    const data = await response.json();
    
    if (data.hasNewNotifications) {
      self.registration.showNotification('Lineaycolor', {
        body: data.message || 'You have new updates!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'notification-check'
      });
    }
  } catch (error) {
    console.error('Notification check failed:', error);
  }
}