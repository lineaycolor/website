#!/usr/bin/env node

// Dynamic Sitemap Generator for Lineaycolor
// Generates XML sitemap with proper SEO structure

const fs = require('fs');
const path = require('path');

class SitemapGenerator {
  constructor() {
    this.baseUrl = 'https://lineaycolor.github.io/website';
    this.pages = [];
    this.collections = [];
    this.products = [];
  }

  // Define site structure
  initializePages() {
    // Main pages
    this.pages = [
      {
        loc: '/',
        changefreq: 'weekly',
        priority: '1.0',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/collections',
        changefreq: 'weekly',
        priority: '0.9',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/sustainability',
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/size-guide',
        changefreq: 'yearly',
        priority: '0.5',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/shipping-returns',
        changefreq: 'yearly',
        priority: '0.5',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/privacy-policy',
        changefreq: 'yearly',
        priority: '0.3',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/terms-conditions',
        changefreq: 'yearly',
        priority: '0.3',
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    // Collection pages
    this.collections = [
      {
        loc: '/collections/summer-2024',
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0],
        images: [
          {
            loc: `${this.baseUrl}/images/collections/summer-hero.jpg`,
            title: 'Summer Collection 2024',
            caption: 'Light and breezy designs for warm weather'
          }
        ]
      },
      {
        loc: '/collections/evening-wear',
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0],
        images: [
          {
            loc: `${this.baseUrl}/images/collections/evening-hero.jpg`,
            title: 'Evening Wear Collection',
            caption: 'Elegant and sophisticated evening dresses'
          }
        ]
      },
      {
        loc: '/collections/casual-chic',
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0],
        images: [
          {
            loc: `${this.baseUrl}/images/collections/casual-hero.jpg`,
            title: 'Casual Chic Collection',
            caption: 'Everyday essentials with style'
          }
        ]
      },
      {
        loc: '/collections/new-arrivals',
        changefreq: 'daily',
        priority: '0.9',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/collections/sale',
        changefreq: 'daily',
        priority: '0.8',
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    // Sample product pages (in production, these would be generated from database)
    this.products = [
      {
        loc: '/products/summer-breeze-dress',
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0],
        images: [
          {
            loc: `${this.baseUrl}/images/products/summer-breeze-dress-1.jpg`,
            title: 'Summer Breeze Dress - Front View',
            caption: 'Flowing summer dress in light blue'
          },
          {
            loc: `${this.baseUrl}/images/products/summer-breeze-dress-2.jpg`,
            title: 'Summer Breeze Dress - Back View',
            caption: 'Back detail of the summer dress'
          }
        ]
      },
      {
        loc: '/products/evening-elegance-gown',
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/products/casual-comfort-tee',
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];
  }

  // Generate XML sitemap
  generateXML() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    // Add all URLs
    const allUrls = [...this.pages, ...this.collections, ...this.products];
    
    allUrls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${this.baseUrl}${url.loc}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      
      // Add images if present
      if (url.images) {
        url.images.forEach(image => {
          xml += '    <image:image>\n';
          xml += `      <image:loc>${image.loc}</image:loc>\n`;
          if (image.title) {
            xml += `      <image:title>${this.escapeXML(image.title)}</image:title>\n`;
          }
          if (image.caption) {
            xml += `      <image:caption>${this.escapeXML(image.caption)}</image:caption>\n`;
          }
          xml += '    </image:image>\n';
        });
      }
      
      // Add language alternates
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${this.baseUrl}${url.loc}"/>\n`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${this.baseUrl}${url.loc}"/>\n`;
      
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  // Generate sitemap index for large sites
  generateSitemapIndex() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Main sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemap-main.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Products sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemap-products.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    // Images sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemap-images.xml</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
    xml += '  </sitemap>\n';
    
    xml += '</sitemapindex>';
    return xml;
  }

  // Helper to escape XML special characters
  escapeXML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
  }

  // Save sitemap files
  save() {
    this.initializePages();
    
    // Generate main sitemap
    const sitemap = this.generateXML();
    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('✓ Generated sitemap.xml');
    
    // Generate sitemap index for larger sites
    const sitemapIndex = this.generateSitemapIndex();
    fs.writeFileSync('sitemap-index.xml', sitemapIndex);
    console.log('✓ Generated sitemap-index.xml');
    
    // Generate robots.txt
    const robotsTxt = this.generateRobotsTxt();
    fs.writeFileSync('robots.txt', robotsTxt);
    console.log('✓ Updated robots.txt');
  }

  // Generate enhanced robots.txt
  generateRobotsTxt() {
    let robots = '# Robots.txt for Lineaycolor\n';
    robots += '# Updated: ' + new Date().toISOString() + '\n\n';
    
    // Allow all bots
    robots += 'User-agent: *\n';
    robots += 'Allow: /\n\n';
    
    // Specific bot rules
    robots += '# Googlebot\n';
    robots += 'User-agent: Googlebot\n';
    robots += 'Allow: /\n';
    robots += 'Crawl-delay: 0\n\n';
    
    robots += '# Bingbot\n';
    robots += 'User-agent: Bingbot\n';
    robots += 'Allow: /\n';
    robots += 'Crawl-delay: 1\n\n';
    
    // Disallow certain paths
    robots += '# Disallow admin and private areas\n';
    robots += 'User-agent: *\n';
    robots += 'Disallow: /admin/\n';
    robots += 'Disallow: /api/\n';
    robots += 'Disallow: /checkout/\n';
    robots += 'Disallow: /cart/\n';
    robots += 'Disallow: /account/\n';
    robots += 'Disallow: /*.json$\n';
    robots += 'Disallow: /*?*sort=\n';
    robots += 'Disallow: /*?*filter=\n\n';
    
    // Block bad bots
    robots += '# Block bad bots\n';
    robots += 'User-agent: AhrefsBot\n';
    robots += 'Disallow: /\n\n';
    
    robots += 'User-agent: SemrushBot\n';
    robots += 'Disallow: /\n\n';
    
    // Sitemap location
    robots += '# Sitemaps\n';
    robots += `Sitemap: ${this.baseUrl}/sitemap.xml\n`;
    robots += `Sitemap: ${this.baseUrl}/sitemap-index.xml\n`;
    
    return robots;
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new SitemapGenerator();
  generator.save();
  console.log('\n✅ Sitemap generation complete!');
}

module.exports = SitemapGenerator;