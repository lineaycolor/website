// A/B Testing Framework for Lineaycolor
// Simple but powerful split testing implementation

class ABTestingFramework {
  constructor() {
    this.tests = {};
    this.userId = this.getOrCreateUserId();
    this.loadTests();
  }

  // Get or create persistent user ID
  getOrCreateUserId() {
    let userId = localStorage.getItem('lc_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('lc_user_id', userId);
    }
    return userId;
  }

  // Load test configurations
  loadTests() {
    // Define active tests
    this.tests = {
      heroMessage: {
        name: 'Hero Message Test',
        variants: {
          A: {
            title: 'NEW COLLECTION 2024',
            subtitle: 'Discover the latest trends in fashion'
          },
          B: {
            title: 'SUMMER ESSENTIALS',
            subtitle: 'Shop the perfect wardrobe for warm days'
          }
        },
        traffic: 0.5, // 50% of traffic
        goals: ['click_cta', 'add_to_cart', 'purchase']
      },
      
      ctaButton: {
        name: 'CTA Button Test',
        variants: {
          A: { text: 'SHOP NOW', color: '#000000' },
          B: { text: 'VIEW COLLECTION', color: '#FF6B6B' }
        },
        traffic: 1.0, // 100% of traffic
        goals: ['click_cta', 'view_collection']
      },
      
      productGrid: {
        name: 'Product Grid Layout',
        variants: {
          A: { columns: 3, showQuickView: false },
          B: { columns: 4, showQuickView: true }
        },
        traffic: 0.3, // 30% of traffic
        goals: ['product_click', 'add_to_cart']
      },
      
      pricingDisplay: {
        name: 'Pricing Display Test',
        variants: {
          A: { format: 'simple', showSavings: false },
          B: { format: 'detailed', showSavings: true }
        },
        traffic: 0.5,
        goals: ['add_to_cart', 'purchase']
      }
    };
  }

  // Get variant for a test
  getVariant(testName) {
    const test = this.tests[testName];
    if (!test) return null;

    // Check if user should be in test
    if (Math.random() > test.traffic) {
      return null; // User not in test
    }

    // Check for existing assignment
    const storageKey = `ab_test_${testName}`;
    let variant = localStorage.getItem(storageKey);

    if (!variant) {
      // Assign variant based on user ID hash
      variant = this.assignVariant(testName);
      localStorage.setItem(storageKey, variant);
      
      // Track assignment
      this.trackEvent('test_assigned', {
        test_name: testName,
        variant: variant,
        user_id: this.userId
      });
    }

    return {
      variant: variant,
      data: test.variants[variant]
    };
  }

  // Assign variant based on consistent hashing
  assignVariant(testName) {
    const test = this.tests[testName];
    const variants = Object.keys(test.variants);
    
    // Simple hash based on user ID and test name
    const hash = this.hashCode(this.userId + testName);
    const index = Math.abs(hash) % variants.length;
    
    return variants[index];
  }

  // Simple hash function
  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  // Track conversion/goal
  trackGoal(goalName, value = 1) {
    // Find all tests with this goal
    Object.entries(this.tests).forEach(([testName, test]) => {
      if (test.goals.includes(goalName)) {
        const storageKey = `ab_test_${testName}`;
        const variant = localStorage.getItem(storageKey);
        
        if (variant) {
          this.trackEvent('goal_completed', {
            test_name: testName,
            variant: variant,
            goal_name: goalName,
            value: value,
            user_id: this.userId
          });
        }
      }
    });
  }

  // Track custom event
  trackEvent(eventName, data) {
    // Send to analytics
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'ab_test_event',
        event_name: eventName,
        ...data
      });
    }

    // Also track in Facebook Pixel if available
    if (window.fbq) {
      window.fbq('trackCustom', 'ABTest_' + eventName, data);
    }

    // Log in development
    if (window.location.hostname === 'localhost') {
      console.log('A/B Test Event:', eventName, data);
    }
  }

  // Apply test variant to DOM
  applyVariant(testName, callback) {
    const result = this.getVariant(testName);
    if (result) {
      callback(result.variant, result.data);
    }
  }

  // Helper methods for common tests
  applyHeroTest() {
    this.applyVariant('heroMessage', (variant, data) => {
      const heroTitle = document.querySelector('.hero h1');
      const heroSubtitle = document.querySelector('.hero p');
      
      if (heroTitle) heroTitle.textContent = data.title;
      if (heroSubtitle) heroSubtitle.textContent = data.subtitle;
    });
  }

  applyCTATest() {
    this.applyVariant('ctaButton', (variant, data) => {
      const ctaButtons = document.querySelectorAll('.btn-primary');
      
      ctaButtons.forEach(btn => {
        btn.textContent = data.text;
        btn.style.backgroundColor = data.color;
      });
    });
  }

  applyProductGridTest() {
    this.applyVariant('productGrid', (variant, data) => {
      const grid = document.querySelector('.product-grid');
      if (grid) {
        grid.style.gridTemplateColumns = `repeat(${data.columns}, 1fr)`;
        
        if (data.showQuickView) {
          // Add quick view buttons
          document.querySelectorAll('.product-item').forEach(item => {
            if (!item.querySelector('.quick-view')) {
              const quickView = document.createElement('button');
              quickView.className = 'quick-view';
              quickView.textContent = 'Quick View';
              quickView.onclick = () => this.trackGoal('quick_view_click');
              item.appendChild(quickView);
            }
          });
        }
      }
    });
  }

  // Get test results (for internal dashboard)
  getTestResults(testName) {
    const test = this.tests[testName];
    if (!test) return null;

    // In production, this would fetch from analytics API
    return {
      test: testName,
      variants: Object.keys(test.variants).map(variant => ({
        name: variant,
        visitors: 0, // Would be populated from analytics
        conversions: 0,
        conversionRate: 0
      }))
    };
  }

  // Clear test assignment (for testing)
  clearTest(testName) {
    localStorage.removeItem(`ab_test_${testName}`);
  }

  // Clear all tests
  clearAllTests() {
    Object.keys(this.tests).forEach(testName => {
      this.clearTest(testName);
    });
  }
}

// Initialize and expose globally
window.abTesting = new ABTestingFramework();

// Auto-apply tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.abTesting.applyHeroTest();
    window.abTesting.applyCTATest();
    window.abTesting.applyProductGridTest();
  });
} else {
  window.abTesting.applyHeroTest();
  window.abTesting.applyCTATest();
  window.abTesting.applyProductGridTest();
}

// Track common goals automatically
document.addEventListener('click', (e) => {
  // Track CTA clicks
  if (e.target.matches('.btn, .btn-primary, .cta')) {
    window.abTesting.trackGoal('click_cta');
  }
  
  // Track product clicks
  if (e.target.closest('.product-item')) {
    window.abTesting.trackGoal('product_click');
  }
  
  // Track add to cart
  if (e.target.matches('.add-to-cart, [data-action="add-to-cart"]')) {
    window.abTesting.trackGoal('add_to_cart');
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ABTestingFramework;
}