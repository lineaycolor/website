// Facebook Pixel Implementation for Lineaycolor
// Enhanced e-commerce tracking and conversion API

(function() {
  'use strict';

  // Facebook Pixel Base Code
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  // Initialize Pixel with your ID
  fbq('init', 'YOUR_PIXEL_ID');
  
  // Track PageView
  fbq('track', 'PageView');

  // Enhanced E-commerce Tracking Class
  class FacebookPixelTracker {
    constructor() {
      this.currency = 'USD';
      this.initialized = true;
      this.setupEventListeners();
    }

    // Product Events
    viewContent(product) {
      fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: this.currency,
        contents: [{
          id: product.id,
          quantity: 1,
          item_price: product.price
        }]
      });
    }

    addToCart(product, quantity = 1) {
      fbq('track', 'AddToCart', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price * quantity,
        currency: this.currency,
        contents: [{
          id: product.id,
          quantity: quantity,
          item_price: product.price
        }]
      });
    }

    initiateCheckout(items, totalValue) {
      const contents = items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }));

      fbq('track', 'InitiateCheckout', {
        content_category: 'Fashion',
        content_ids: items.map(item => item.id),
        contents: contents,
        currency: this.currency,
        num_items: items.length,
        value: totalValue
      });
    }

    addPaymentInfo(value) {
      fbq('track', 'AddPaymentInfo', {
        content_category: 'Fashion',
        currency: this.currency,
        value: value
      });
    }

    purchase(orderData) {
      const contents = orderData.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }));

      fbq('track', 'Purchase', {
        content_ids: orderData.items.map(item => item.id),
        content_name: 'Lineaycolor Order',
        content_type: 'product',
        contents: contents,
        currency: this.currency,
        num_items: orderData.items.length,
        value: orderData.value,
        order_id: orderData.id
      });
    }

    // User Events
    completeRegistration(registrationMethod) {
      fbq('track', 'CompleteRegistration', {
        content_name: 'User Registration',
        status: true,
        registration_method: registrationMethod
      });
    }

    search(searchQuery, searchResults) {
      fbq('track', 'Search', {
        content_category: 'Fashion',
        search_string: searchQuery,
        search_results: searchResults
      });
    }

    // Wishlist Events
    addToWishlist(product) {
      fbq('track', 'AddToWishlist', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: this.currency
      });
    }

    // Custom Events
    viewCategory(category, products) {
      fbq('trackCustom', 'ViewCategory', {
        content_category: category,
        content_ids: products.map(p => p.id),
        content_type: 'product_group',
        contents: products.map(p => ({
          id: p.id,
          item_price: p.price
        }))
      });
    }

    shareProduct(product, method) {
      fbq('trackCustom', 'ShareProduct', {
        content_name: product.name,
        content_id: product.id,
        method: method,
        content_type: 'product'
      });
    }

    // Lead Generation
    generateLead(leadType, value) {
      fbq('track', 'Lead', {
        content_name: leadType,
        content_category: 'Fashion',
        value: value || 0,
        currency: this.currency
      });
    }

    // Setup automatic event tracking
    setupEventListeners() {
      // Track time on page
      let timeOnPage = 0;
      setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage === 30) {
          fbq('trackCustom', 'TimeOnPage_30s');
        } else if (timeOnPage === 60) {
          fbq('trackCustom', 'TimeOnPage_60s');
        } else if (timeOnPage === 180) {
          fbq('trackCustom', 'TimeOnPage_3m');
        }
      }, 10000);

      // Track scroll depth
      let maxScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          
          if (maxScroll >= 25 && maxScroll < 50) {
            fbq('trackCustom', 'ScrollDepth_25');
          } else if (maxScroll >= 50 && maxScroll < 75) {
            fbq('trackCustom', 'ScrollDepth_50');
          } else if (maxScroll >= 75 && maxScroll < 90) {
            fbq('trackCustom', 'ScrollDepth_75');
          } else if (maxScroll >= 90) {
            fbq('trackCustom', 'ScrollDepth_90');
          }
        }
      });
    }

    // Advanced Matching (with user consent)
    setUserData(userData) {
      if (userData.email || userData.phone || userData.firstName || userData.lastName) {
        fbq('init', 'YOUR_PIXEL_ID', {
          em: userData.email ? this.hashData(userData.email.toLowerCase()) : undefined,
          ph: userData.phone ? this.hashData(userData.phone) : undefined,
          fn: userData.firstName ? this.hashData(userData.firstName.toLowerCase()) : undefined,
          ln: userData.lastName ? this.hashData(userData.lastName.toLowerCase()) : undefined,
          external_id: userData.id
        });
      }
    }

    // Hash function for advanced matching
    hashData(data) {
      // In production, use proper SHA256 hashing
      // This is a placeholder
      return btoa(data);
    }

    // Conversion API Helper (server-side)
    getEventData(eventName, parameters) {
      return {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: this.generateEventId(),
        event_source_url: window.location.href,
        user_data: {
          client_ip_address: '{{CLIENT_IP}}', // Set server-side
          client_user_agent: navigator.userAgent,
          fbc: this.getFBCookie('_fbc'),
          fbp: this.getFBCookie('_fbp')
        },
        custom_data: parameters,
        action_source: 'website'
      };
    }

    generateEventId() {
      return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getFBCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
  }

  // Initialize Facebook Pixel Tracker
  window.fbPixelTracker = new FacebookPixelTracker();

  // GDPR Compliance Helper
  window.fbPixelConsent = {
    grant: function() {
      fbq('consent', 'grant');
      localStorage.setItem('fb_pixel_consent', 'granted');
    },
    revoke: function() {
      fbq('consent', 'revoke');
      localStorage.setItem('fb_pixel_consent', 'revoked');
    },
    status: function() {
      return localStorage.getItem('fb_pixel_consent') || 'pending';
    }
  };

})();