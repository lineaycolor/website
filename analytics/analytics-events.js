// Analytics Event Tracking for Lineaycolor
// Comprehensive GA4 and GTM event implementation

class LineaycolorAnalytics {
  constructor() {
    this.dataLayer = window.dataLayer || [];
    this.currency = 'USD';
    this.initialized = false;
    this.init();
  }

  init() {
    if (this.initialized) return;
    
    // Set up default e-commerce settings
    this.dataLayer.push({
      'event': 'ecommerce_config',
      'currency': this.currency
    });
    
    // Initialize user session
    this.initializeUserSession();
    
    // Set up event listeners
    this.setupEventListeners();
    
    this.initialized = true;
  }

  // User Session Management
  initializeUserSession() {
    const sessionId = this.getOrCreateSessionId();
    const userId = this.getUserId();
    
    this.dataLayer.push({
      'event': 'session_start',
      'session_id': sessionId,
      'user_id': userId,
      'timestamp': new Date().toISOString()
    });
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('lc_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('lc_session_id', sessionId);
    }
    return sessionId;
  }

  getUserId() {
    // In production, this would come from your authentication system
    return localStorage.getItem('lc_user_id') || 'anonymous_' + Date.now();
  }

  // E-commerce Events
  viewItemList(items, listName, listId) {
    this.dataLayer.push({
      'event': 'view_item_list',
      'ecommerce': {
        'currency': this.currency,
        'item_list_id': listId,
        'item_list_name': listName,
        'items': items.map((item, index) => ({
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'coupon': item.coupon || '',
          'discount': item.discount || 0,
          'index': index,
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_category2': item.subcategory || '',
          'item_list_id': listId,
          'item_list_name': listName,
          'item_variant': item.variant || '',
          'location_id': 'web',
          'price': item.price,
          'quantity': 1
        }))
      }
    });
  }

  viewItem(item) {
    this.dataLayer.push({
      'event': 'view_item',
      'ecommerce': {
        'currency': this.currency,
        'value': item.price,
        'items': [{
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'coupon': '',
          'discount': item.discount || 0,
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_category2': item.subcategory || '',
          'item_variant': item.variant || '',
          'price': item.price,
          'quantity': 1,
          'item_image': item.image,
          'item_url': item.url
        }]
      }
    });
  }

  addToCart(item, quantity = 1) {
    this.dataLayer.push({
      'event': 'add_to_cart',
      'ecommerce': {
        'currency': this.currency,
        'value': item.price * quantity,
        'items': [{
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'coupon': '',
          'discount': item.discount || 0,
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_variant': item.variant || '',
          'price': item.price,
          'quantity': quantity
        }]
      }
    });
  }

  removeFromCart(item, quantity = 1) {
    this.dataLayer.push({
      'event': 'remove_from_cart',
      'ecommerce': {
        'currency': this.currency,
        'value': item.price * quantity,
        'items': [{
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_variant': item.variant || '',
          'price': item.price,
          'quantity': quantity
        }]
      }
    });
  }

  beginCheckout(items, value, coupon = '') {
    this.dataLayer.push({
      'event': 'begin_checkout',
      'ecommerce': {
        'currency': this.currency,
        'value': value,
        'coupon': coupon,
        'items': items.map(item => ({
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'coupon': coupon,
          'discount': item.discount || 0,
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_variant': item.variant || '',
          'price': item.price,
          'quantity': item.quantity
        }))
      }
    });
  }

  purchase(transactionData) {
    this.dataLayer.push({
      'event': 'purchase',
      'ecommerce': {
        'transaction_id': transactionData.id,
        'value': transactionData.value,
        'tax': transactionData.tax || 0,
        'shipping': transactionData.shipping || 0,
        'currency': this.currency,
        'coupon': transactionData.coupon || '',
        'items': transactionData.items.map(item => ({
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'coupon': transactionData.coupon || '',
          'discount': item.discount || 0,
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_variant': item.variant || '',
          'price': item.price,
          'quantity': item.quantity
        }))
      }
    });
  }

  // User Engagement Events
  search(searchTerm, results = []) {
    this.dataLayer.push({
      'event': 'search',
      'search_term': searchTerm,
      'search_results': results.length,
      'search_category': 'products'
    });
  }

  share(method, contentType, itemId) {
    this.dataLayer.push({
      'event': 'share',
      'method': method, // facebook, twitter, email, etc.
      'content_type': contentType, // product, collection, etc.
      'item_id': itemId
    });
  }

  login(method) {
    this.dataLayer.push({
      'event': 'login',
      'method': method // email, google, facebook, etc.
    });
  }

  signUp(method) {
    this.dataLayer.push({
      'event': 'sign_up',
      'method': method
    });
  }

  // Custom Events
  viewPromotion(promotion) {
    this.dataLayer.push({
      'event': 'view_promotion',
      'ecommerce': {
        'promo_id': promotion.id,
        'promo_name': promotion.name,
        'creative_name': promotion.creative,
        'creative_slot': promotion.position,
        'location_id': promotion.location
      }
    });
  }

  selectPromotion(promotion) {
    this.dataLayer.push({
      'event': 'select_promotion',
      'ecommerce': {
        'promo_id': promotion.id,
        'promo_name': promotion.name,
        'creative_name': promotion.creative,
        'creative_slot': promotion.position,
        'location_id': promotion.location
      }
    });
  }

  // Wishlist Events
  addToWishlist(item) {
    this.dataLayer.push({
      'event': 'add_to_wishlist',
      'ecommerce': {
        'currency': this.currency,
        'value': item.price,
        'items': [{
          'item_id': item.id,
          'item_name': item.name,
          'affiliation': 'Lineaycolor',
          'item_brand': 'Lineaycolor',
          'item_category': item.category,
          'item_variant': item.variant || '',
          'price': item.price,
          'quantity': 1
        }]
      }
    });
  }

  // Error Tracking
  trackError(errorType, errorMessage, errorLocation) {
    this.dataLayer.push({
      'event': 'error',
      'error_type': errorType,
      'error_message': errorMessage,
      'error_location': errorLocation
    });
  }

  // Page Timing
  trackPageTiming() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      this.dataLayer.push({
        'event': 'page_timing',
        'page_load_time': pageLoadTime,
        'dom_ready_time': domReadyTime,
        'page_url': window.location.href
      });
    }
  }

  // Setup Event Listeners
  setupEventListeners() {
    // Track page timing after load
    window.addEventListener('load', () => {
      setTimeout(() => this.trackPageTiming(), 0);
    });

    // Track scroll depth
    this.setupScrollTracking();

    // Track engagement time
    this.setupEngagementTracking();
  }

  setupScrollTracking() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    const triggeredThresholds = new Set();

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !triggeredThresholds.has(threshold)) {
            triggeredThresholds.add(threshold);
            this.dataLayer.push({
              'event': 'scroll',
              'scroll_depth': threshold,
              'page_url': window.location.href
            });
          }
        });
      }
    };

    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(trackScroll, 100);
    });
  }

  setupEngagementTracking() {
    let startTime = Date.now();
    let totalEngagedTime = 0;
    let isEngaged = true;

    const trackEngagement = () => {
      if (isEngaged) {
        totalEngagedTime += Date.now() - startTime;
      }
      
      this.dataLayer.push({
        'event': 'user_engagement',
        'engagement_time_msec': totalEngagedTime,
        'page_url': window.location.href
      });
    };

    // Track when user leaves
    window.addEventListener('beforeunload', trackEngagement);

    // Track when tab becomes inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isEngaged) {
          totalEngagedTime += Date.now() - startTime;
          isEngaged = false;
        }
      } else {
        if (!isEngaged) {
          startTime = Date.now();
          isEngaged = true;
        }
      }
    });

    // Send engagement data every 30 seconds
    setInterval(() => {
      if (isEngaged && totalEngagedTime > 0) {
        trackEngagement();
      }
    }, 30000);
  }
}

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.lcAnalytics = new LineaycolorAnalytics();
  });
} else {
  window.lcAnalytics = new LineaycolorAnalytics();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LineaycolorAnalytics;
}