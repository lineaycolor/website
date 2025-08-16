const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Base icon design - creates a simple logo with "LC" text
async function createBaseIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1a1a1a"/>
      <text x="50%" y="50%" font-family="Playfair Display, serif" font-size="${size * 0.35}" 
            font-weight="bold" fill="#c9a961" text-anchor="middle" dominant-baseline="middle">LC</text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

// Generate icons
async function generateIcons() {
  console.log('Generating PWA icons...');
  
  for (const size of sizes) {
    try {
      const svgBuffer = await createBaseIcon(size);
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .png()
        .resize(size, size)
        .toFile(outputPath);
      
      console.log(`✓ Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size} icon:`, error);
    }
  }
  
  // Generate favicon
  try {
    const faviconSvg = await createBaseIcon(32);
    await sharp(faviconSvg)
      .png()
      .resize(32, 32)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    console.log('✓ Generated favicon.ico');
  } catch (error) {
    console.error('✗ Failed to generate favicon:', error);
  }
  
  // Generate Apple touch icon
  try {
    const appleTouchSvg = await createBaseIcon(180);
    await sharp(appleTouchSvg)
      .png()
      .resize(180, 180)
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');
  } catch (error) {
    console.error('✗ Failed to generate apple-touch-icon:', error);
  }
}

generateIcons().then(() => {
  console.log('Icon generation complete!');
}).catch(console.error);