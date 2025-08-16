# Progressive Web App (PWA) Features Documentation

## Overview

The Lineaycolor fashion website has been transformed into a fully-featured Progressive Web App with offline capabilities, push notifications, and an app-like experience.

## Features Implemented

### 1. Offline Support
- **Service Worker**: Automatically generated and managed by `next-pwa`
- **Caching Strategies**:
  - **Cache First**: Google Fonts (1 year cache)
  - **Stale While Revalidate**: Images, JS, CSS, and fonts
  - **Network First**: API calls and dynamic content
- **Offline Fallback**: Custom offline page with branding

### 2. App Installation
- **Install Prompt**: Smart UI component that appears after 3 seconds
- **iOS Support**: Custom instructions for Safari users
- **Desktop Support**: Works on Chrome, Edge, Firefox
- **Install Tracking**: Remembers dismissal for 7 days

### 3. Push Notifications
- **Permission Management**: User-friendly opt-in flow
- **Notification Types**:
  - New Collections
  - Sales & Promotions
  - Back in Stock alerts
  - Order Updates
- **Custom Actions**: Explore collections or dismiss
- **Background Sync**: Cart data syncs when back online

### 4. App Manifest
- **App Name**: Lineaycolor - Fashion Redefined
- **Theme**: Matches brand colors (#1a1a1a)
- **Display**: Standalone (no browser UI)
- **Icons**: 8 sizes from 72x72 to 512x512
- **Shortcuts**: Quick access to Collections and Contact

### 5. Performance Optimizations
- **Resource Caching**: Static assets cached for offline use
- **Image Optimization**: Progressive loading with cache
- **Font Caching**: Google Fonts cached for 1 year
- **Network Resilience**: Graceful fallbacks for failed requests

## Technical Implementation

### Dependencies
```json
{
  "next-pwa": "^5.6.0",
  "workbox-window": "^7.0.0"
}
```

### Configuration Files

#### next.config.ts
- PWA plugin configuration
- Runtime caching rules
- Offline fallback settings

#### manifest.json
- App metadata
- Icon definitions
- App shortcuts
- Screenshot references

#### Service Worker
- Notification click handlers
- Push event listeners
- Background sync for cart
- Periodic sync for updates

### Custom Components

1. **InstallPrompt.tsx**
   - Detects installation capability
   - Shows platform-specific instructions
   - Tracks user preferences

2. **NotificationPreferences.tsx**
   - Permission management UI
   - Notification type toggles
   - Subscription status display

3. **usePushNotifications.ts**
   - Push notification hook
   - Subscription management
   - Test notification sending

## User Experience

### Installation Flow
1. User visits site
2. Install prompt appears after 3 seconds
3. One-click installation for supported browsers
4. iOS users see custom instructions

### Offline Experience
1. All visited pages cached automatically
2. Images and assets available offline
3. Custom offline page for uncached content
4. Automatic reconnection detection

### Notification Flow
1. User visits Settings page
2. Clicks "Subscribe" to notifications
3. Browser permission prompt
4. Welcome notification sent
5. Preferences saved locally

## Testing the PWA

### Lighthouse PWA Audit
Run Lighthouse in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Check "Progressive Web App"
4. Generate report

Expected score: 90+ for PWA

### Manual Testing

#### Offline Mode
1. Load the site
2. Go offline (DevTools > Network > Offline)
3. Navigate around - cached pages work
4. Try uncached page - see offline fallback

#### Installation
1. Desktop Chrome: Look for install icon in address bar
2. Mobile: Look for "Add to Home Screen" banner
3. iOS: Share > Add to Home Screen

#### Notifications
1. Go to Settings page
2. Subscribe to notifications
3. Test notification appears
4. Click notification - opens app

## Deployment Checklist

- [x] HTTPS enabled (required for PWA)
- [x] Valid manifest.json
- [x] Service worker registered
- [x] Offline fallback page
- [x] App icons in all sizes
- [x] Meta tags for mobile
- [x] Install prompt UI
- [x] Push notification support

## Future Enhancements

1. **Advanced Caching**
   - Implement cache versioning
   - Add cache size management
   - Selective cache updates

2. **Enhanced Notifications**
   - Rich notifications with images
   - Action buttons for quick responses
   - Notification scheduling

3. **Offline Features**
   - Browse full catalog offline
   - Save favorites locally
   - Queue actions for sync

4. **App Features**
   - Share Target API for sharing products
   - Contact Picker API for sharing
   - File System Access for downloads

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   - Check HTTPS is enabled
   - Clear browser cache
   - Check console for errors

2. **Install Prompt Not Showing**
   - Already installed?
   - Previously dismissed?
   - Browser doesn't support PWA?

3. **Notifications Not Working**
   - Check browser permissions
   - Ensure service worker active
   - Test with sendTestNotification()

### Debug Commands

```javascript
// Check service worker
navigator.serviceWorker.ready.then(reg => console.log(reg))

// Check push subscription
navigator.serviceWorker.ready.then(reg => 
  reg.pushManager.getSubscription().then(sub => console.log(sub))
)

// Clear all caches
caches.keys().then(names => 
  Promise.all(names.map(name => caches.delete(name)))
)
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Install | ✅ | ✅ | ⚠️ | ✅ |
| Offline | ✅ | ✅ | ✅ | ✅ |
| Push | ✅ | ✅ | ⚠️ | ✅ |
| Shortcuts | ✅ | ❌ | ❌ | ✅ |

⚠️ = Partial support
❌ = Not supported