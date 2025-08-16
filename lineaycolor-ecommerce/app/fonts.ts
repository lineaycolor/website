// Font optimization with Next.js font loader

export const fontOptimization = `
  /* Font Display Swap for immediate text rendering */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url('/fonts/inter-var.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* Fallback font optimization */
  .font-sans {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-feature-settings: 'liga' 1, 'calt' 1; /* Enable ligatures and contextual alternates */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  
  /* Preload critical text to avoid layout shift */
  .font-loading {
    visibility: hidden;
  }
  
  .fonts-loaded .font-loading {
    visibility: visible;
  }
`

// Font loading observer
export const fontLoadingScript = `
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 1em Inter'),
      document.fonts.load('600 1em Inter'),
      document.fonts.load('700 1em Inter')
    ]).then(function () {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
`