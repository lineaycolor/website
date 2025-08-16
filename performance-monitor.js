// Performance Monitoring for Lineaycolor Website
// Tracks Core Web Vitals and custom metrics

(function() {
  'use strict';
  
  // Performance metrics storage
  const metrics = {
    FCP: 0,    // First Contentful Paint
    LCP: 0,    // Largest Contentful Paint  
    FID: 0,    // First Input Delay
    CLS: 0,    // Cumulative Layout Shift
    TTFB: 0,   // Time to First Byte
    TTI: 0,    // Time to Interactive
    TBT: 0,    // Total Blocking Time
    INP: 0,    // Interaction to Next Paint
    customMetrics: {}
  };
  
  // Helper function to send metrics
  function sendMetrics(metric, value) {
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric,
        value: Math.round(value),
        non_interaction: true
      });
    }
    
    // Console log in development
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      console.log(`[Performance] ${metric}: ${value}ms`);
    }
  }
  
  // Measure First Contentful Paint (FCP)
  function measureFCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          sendMetrics('FCP', metrics.FCP);
          observer.disconnect();
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  }
  
  // Measure Largest Contentful Paint (LCP)
  function measureLCP() {
    let lcp = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcp = lastEntry.startTime;
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Report final LCP when user leaves
    ['pagehide', 'visibilitychange'].forEach(type => {
      addEventListener(type, () => {
        if (lcp > 0) {
          metrics.LCP = lcp;
          sendMetrics('LCP', metrics.LCP);
          observer.disconnect();
        }
      }, { once: true });
    });
  }
  
  // Measure First Input Delay (FID)
  function measureFID() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        metrics.FID = entry.processingStart - entry.startTime;
        sendMetrics('FID', metrics.FID);
        observer.disconnect();
      }
    });
    observer.observe({ entryTypes: ['first-input'] });
  }
  
  // Measure Cumulative Layout Shift (CLS)
  function measureCLS() {
    let clsValue = 0;
    let clsEntries = [];
    let sessionValue = 0;
    let sessionEntries = [];
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only count shifts without user input
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
          
          // Start a new session if the gap is more than 1s or duration > 5s
          if (sessionValue && 
              (entry.startTime - lastSessionEntry.startTime > 1000 ||
               entry.startTime - firstSessionEntry.startTime > 5000)) {
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              clsEntries = [...sessionEntries];
            }
            sessionValue = entry.value;
            sessionEntries = [entry];
          } else {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    
    // Report final CLS when user leaves
    ['pagehide', 'visibilitychange'].forEach(type => {
      addEventListener(type, () => {
        if (sessionValue > clsValue) {
          clsValue = sessionValue;
          clsEntries = [...sessionEntries];
        }
        metrics.CLS = clsValue;
        sendMetrics('CLS', metrics.CLS);
        observer.disconnect();
      }, { once: true });
    });
  }
  
  // Measure Time to First Byte (TTFB)
  function measureTTFB() {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      metrics.TTFB = navigationEntry.responseStart - navigationEntry.fetchStart;
      sendMetrics('TTFB', metrics.TTFB);
    }
  }
  
  // Measure custom metrics
  function measureCustomMetrics() {
    // Image loading performance
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let totalLoadTime = 0;
    
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          const loadTime = performance.now();
          totalLoadTime += loadTime;
          
          if (loadedImages === images.length) {
            metrics.customMetrics.avgImageLoadTime = totalLoadTime / images.length;
            sendMetrics('AvgImageLoadTime', metrics.customMetrics.avgImageLoadTime);
          }
        });
      }
    });
    
    // JavaScript execution time
    const jsExecTime = performance.now();
    metrics.customMetrics.jsExecutionTime = jsExecTime;
    sendMetrics('JSExecutionTime', jsExecTime);
    
    // Memory usage (if available)
    if (performance.memory) {
      metrics.customMetrics.memoryUsage = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
  }
  
  // Resource timing analysis
  function analyzeResources() {
    const resources = performance.getEntriesByType('resource');
    const resourceStats = {
      images: { count: 0, totalSize: 0, totalDuration: 0 },
      scripts: { count: 0, totalSize: 0, totalDuration: 0 },
      stylesheets: { count: 0, totalSize: 0, totalDuration: 0 },
      fonts: { count: 0, totalSize: 0, totalDuration: 0 }
    };
    
    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;
      const size = resource.transferSize || 0;
      
      if (resource.initiatorType === 'img') {
        resourceStats.images.count++;
        resourceStats.images.totalSize += size;
        resourceStats.images.totalDuration += duration;
      } else if (resource.initiatorType === 'script') {
        resourceStats.scripts.count++;
        resourceStats.scripts.totalSize += size;
        resourceStats.scripts.totalDuration += duration;
      } else if (resource.initiatorType === 'css' || resource.initiatorType === 'link') {
        resourceStats.stylesheets.count++;
        resourceStats.stylesheets.totalSize += size;
        resourceStats.stylesheets.totalDuration += duration;
      } else if (resource.initiatorType === 'font') {
        resourceStats.fonts.count++;
        resourceStats.fonts.totalSize += size;
        resourceStats.fonts.totalDuration += duration;
      }
    });
    
    metrics.customMetrics.resourceStats = resourceStats;
    
    // Log summary
    console.table(resourceStats);
  }
  
  // Initialize all measurements
  function init() {
    // Check for browser support
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }
    
    // Start measurements
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();
    
    // Custom metrics after load
    if (document.readyState === 'complete') {
      measureCustomMetrics();
      analyzeResources();
    } else {
      window.addEventListener('load', () => {
        measureCustomMetrics();
        analyzeResources();
      });
    }
    
    // Expose metrics for debugging
    window.performanceMetrics = metrics;
  }
  
  // Start monitoring
  init();
  
  // Public API
  window.LineaycolorPerformance = {
    getMetrics: () => metrics,
    logMetrics: () => {
      console.group('Performance Metrics');
      console.log('Core Web Vitals:');
      console.log(`  FCP: ${metrics.FCP.toFixed(2)}ms`);
      console.log(`  LCP: ${metrics.LCP.toFixed(2)}ms`);
      console.log(`  FID: ${metrics.FID.toFixed(2)}ms`);
      console.log(`  CLS: ${metrics.CLS.toFixed(4)}`);
      console.log(`  TTFB: ${metrics.TTFB.toFixed(2)}ms`);
      console.log('\nCustom Metrics:', metrics.customMetrics);
      console.groupEnd();
    },
    reset: () => {
      Object.keys(metrics).forEach(key => {
        if (key === 'customMetrics') {
          metrics[key] = {};
        } else {
          metrics[key] = 0;
        }
      });
    }
  };
})();