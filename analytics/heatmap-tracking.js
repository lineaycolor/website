// Heatmap and User Behavior Tracking for Lineaycolor
// Lightweight implementation for tracking user interactions

class HeatmapTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.interactions = [];
    this.scrollData = [];
    this.clickData = [];
    this.mouseMovements = [];
    this.lastMousePosition = { x: 0, y: 0 };
    this.isRecording = true;
    this.maxDataPoints = 1000; // Limit data for performance
    
    this.init();
  }

  init() {
    if (!this.isRecording) return;
    
    // Set up event listeners
    this.setupClickTracking();
    this.setupMouseTracking();
    this.setupScrollTracking();
    this.setupEngagementTracking();
    
    // Send data periodically
    this.startDataSync();
  }

  generateSessionId() {
    return 'heat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Click tracking
  setupClickTracking() {
    document.addEventListener('click', (e) => {
      const clickData = {
        x: e.pageX,
        y: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        element: this.getElementSelector(e.target),
        text: e.target.textContent?.substring(0, 50),
        timestamp: Date.now(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
      
      this.clickData.push(clickData);
      
      // Track as interaction
      this.trackInteraction('click', clickData);
      
      // Limit data size
      if (this.clickData.length > this.maxDataPoints) {
        this.clickData.shift();
      }
    });
  }

  // Mouse movement tracking (sampled)
  setupMouseTracking() {
    let mouseMoveTimer;
    
    document.addEventListener('mousemove', (e) => {
      // Sample mouse movements to reduce data
      clearTimeout(mouseMoveTimer);
      mouseMoveTimer = setTimeout(() => {
        const distance = Math.sqrt(
          Math.pow(e.pageX - this.lastMousePosition.x, 2) +
          Math.pow(e.pageY - this.lastMousePosition.y, 2)
        );
        
        // Only record significant movements
        if (distance > 50) {
          this.mouseMovements.push({
            x: e.pageX,
            y: e.pageY,
            timestamp: Date.now()
          });
          
          this.lastMousePosition = { x: e.pageX, y: e.pageY };
          
          // Limit data size
          if (this.mouseMovements.length > this.maxDataPoints / 2) {
            this.mouseMovements.shift();
          }
        }
      }, 100); // Sample every 100ms max
    });
  }

  // Scroll tracking
  setupScrollTracking() {
    let scrollTimer;
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPosition = window.pageYOffset;
        const scrollPercentage = (scrollPosition / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        this.scrollData.push({
          position: scrollPosition,
          percentage: Math.round(scrollPercentage),
          direction: scrollPosition > lastScrollPosition ? 'down' : 'up',
          timestamp: Date.now(),
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        });
        
        lastScrollPosition = scrollPosition;
        
        // Track scroll depth milestones
        const milestones = [25, 50, 75, 90, 100];
        milestones.forEach(milestone => {
          if (scrollPercentage >= milestone && !this.scrollData.some(d => d.milestone === milestone)) {
            this.trackInteraction('scroll_depth', {
              depth: milestone,
              timestamp: Date.now()
            });
          }
        });
        
        // Limit data size
        if (this.scrollData.length > this.maxDataPoints / 4) {
          this.scrollData.shift();
        }
      }, 150);
    });
  }

  // Engagement tracking
  setupEngagementTracking() {
    let engagementStart = Date.now();
    let totalEngagement = 0;
    let isEngaged = true;
    
    // Track tab visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (isEngaged) {
          totalEngagement += Date.now() - engagementStart;
          isEngaged = false;
        }
      } else {
        engagementStart = Date.now();
        isEngaged = true;
      }
    });
    
    // Track rage clicks
    let clickTimes = [];
    document.addEventListener('click', (e) => {
      const now = Date.now();
      clickTimes.push(now);
      
      // Keep only clicks from last 2 seconds
      clickTimes = clickTimes.filter(time => now - time < 2000);
      
      // Detect rage click (3+ clicks in 2 seconds on same area)
      if (clickTimes.length >= 3) {
        this.trackInteraction('rage_click', {
          element: this.getElementSelector(e.target),
          count: clickTimes.length,
          timestamp: now
        });
      }
    });
    
    // Track form abandonment
    let formStarted = {};
    document.addEventListener('focusin', (e) => {
      if (e.target.matches('input, textarea, select')) {
        const formId = e.target.form?.id || 'unknown_form';
        if (!formStarted[formId]) {
          formStarted[formId] = Date.now();
          this.trackInteraction('form_start', {
            formId: formId,
            field: e.target.name || e.target.id,
            timestamp: Date.now()
          });
        }
      }
    });
    
    // Track when user leaves
    window.addEventListener('beforeunload', () => {
      if (isEngaged) {
        totalEngagement += Date.now() - engagementStart;
      }
      
      // Check for abandoned forms
      Object.keys(formStarted).forEach(formId => {
        const form = document.getElementById(formId);
        if (form && !form.dataset.submitted) {
          this.trackInteraction('form_abandon', {
            formId: formId,
            duration: Date.now() - formStarted[formId],
            timestamp: Date.now()
          });
        }
      });
      
      // Send final engagement data
      this.trackInteraction('session_end', {
        totalEngagement: totalEngagement,
        clicks: this.clickData.length,
        scrollDepth: Math.max(...this.scrollData.map(d => d.percentage || 0)),
        timestamp: Date.now()
      });
    });
  }

  // Track interaction
  trackInteraction(type, data) {
    const interaction = {
      type: type,
      data: data,
      url: window.location.href,
      sessionId: this.sessionId,
      timestamp: Date.now()
    };
    
    this.interactions.push(interaction);
    
    // Send to analytics
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'heatmap_interaction',
        interaction_type: type,
        ...data
      });
    }
    
    // Limit interaction history
    if (this.interactions.length > this.maxDataPoints) {
      this.interactions.shift();
    }
  }

  // Get element selector
  getElementSelector(element) {
    if (!element) return '';
    
    // Try to get a unique selector
    if (element.id) return '#' + element.id;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      if (classes) return element.tagName.toLowerCase() + '.' + classes;
    }
    
    // Fallback to tag name with index
    const siblings = element.parentNode ? Array.from(element.parentNode.children) : [];
    const index = siblings.indexOf(element);
    return element.tagName.toLowerCase() + ':nth-child(' + (index + 1) + ')';
  }

  // Generate heatmap data
  generateHeatmapData() {
    const heatmapData = {
      clicks: this.aggregateClickData(),
      scrollMap: this.generateScrollMap(),
      interactions: this.summarizeInteractions(),
      session: {
        id: this.sessionId,
        duration: Date.now() - parseInt(this.sessionId.split('_')[1]),
        url: window.location.href,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
    
    return heatmapData;
  }

  // Aggregate click data for heatmap
  aggregateClickData() {
    const grid = {};
    const gridSize = 20; // 20px grid
    
    this.clickData.forEach(click => {
      const gridX = Math.floor(click.x / gridSize) * gridSize;
      const gridY = Math.floor(click.y / gridSize) * gridSize;
      const key = `${gridX},${gridY}`;
      
      if (!grid[key]) {
        grid[key] = {
          x: gridX,
          y: gridY,
          count: 0,
          elements: []
        };
      }
      
      grid[key].count++;
      if (!grid[key].elements.includes(click.element)) {
        grid[key].elements.push(click.element);
      }
    });
    
    return Object.values(grid);
  }

  // Generate scroll heatmap
  generateScrollMap() {
    const scrollMap = {};
    const segmentHeight = 100; // 100px segments
    
    this.scrollData.forEach(scroll => {
      const segment = Math.floor(scroll.position / segmentHeight) * segmentHeight;
      
      if (!scrollMap[segment]) {
        scrollMap[segment] = {
          position: segment,
          count: 0,
          avgPercentage: 0
        };
      }
      
      scrollMap[segment].count++;
      scrollMap[segment].avgPercentage = 
        (scrollMap[segment].avgPercentage * (scrollMap[segment].count - 1) + scroll.percentage) / 
        scrollMap[segment].count;
    });
    
    return Object.values(scrollMap);
  }

  // Summarize interactions
  summarizeInteractions() {
    const summary = {};
    
    this.interactions.forEach(interaction => {
      if (!summary[interaction.type]) {
        summary[interaction.type] = {
          count: 0,
          firstTime: interaction.timestamp,
          lastTime: interaction.timestamp
        };
      }
      
      summary[interaction.type].count++;
      summary[interaction.type].lastTime = interaction.timestamp;
    });
    
    return summary;
  }

  // Start syncing data
  startDataSync() {
    // Send data every 30 seconds
    setInterval(() => {
      if (this.interactions.length > 0) {
        this.sendData();
      }
    }, 30000);
    
    // Also send on page unload
    window.addEventListener('beforeunload', () => {
      this.sendData();
    });
  }

  // Send data to server (placeholder)
  sendData() {
    const data = this.generateHeatmapData();
    
    // In production, this would send to your analytics endpoint
    console.log('Heatmap data:', data);
    
    // For now, store in dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'heatmap_data',
        heatmap: data
      });
    }
  }

  // Visual heatmap overlay (for testing)
  showHeatmapOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: ${document.documentElement.scrollHeight}px;
      pointer-events: none;
      z-index: 9999;
    `;
    
    const heatmapData = this.aggregateClickData();
    const maxCount = Math.max(...heatmapData.map(d => d.count));
    
    heatmapData.forEach(point => {
      const dot = document.createElement('div');
      const intensity = point.count / maxCount;
      
      dot.style.cssText = `
        position: absolute;
        left: ${point.x - 10}px;
        top: ${point.y - 10}px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(255, 0, 0, ${intensity * 0.5});
        pointer-events: none;
      `;
      
      overlay.appendChild(dot);
    });
    
    document.body.appendChild(overlay);
    
    // Remove after 5 seconds
    setTimeout(() => {
      overlay.remove();
    }, 5000);
  }

  // Public methods
  startRecording() {
    this.isRecording = true;
  }

  stopRecording() {
    this.isRecording = false;
  }

  clearData() {
    this.interactions = [];
    this.clickData = [];
    this.scrollData = [];
    this.mouseMovements = [];
  }
}

// Initialize heatmap tracking
window.heatmapTracker = new HeatmapTracker();

// Expose for debugging
window.showHeatmap = () => window.heatmapTracker.showHeatmapOverlay();

// Integration with Microsoft Clarity (if needed)
window.clarity = window.clarity || function() {
  (window.clarity.q = window.clarity.q || []).push(arguments);
};

// Clarity initialization (replace with your project ID)
// clarity('init', 'YOUR_CLARITY_PROJECT_ID');

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeatmapTracker;
}