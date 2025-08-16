#!/usr/bin/env python3
"""
Image optimization script for Lineaycolor website
Generates WebP and optimized JPEG versions with multiple sizes
"""

import os
import subprocess
from pathlib import Path

# Image configurations
IMAGE_CONFIGS = {
    'hero-image.jpg': {
        'sizes': [
            (1920, 1080, 'hero-1920w.jpg'),
            (1440, 810, 'hero-1440w.jpg'),
            (1024, 576, 'hero-1024w.jpg'),
            (768, 432, 'hero-768w.jpg'),
            (480, 270, 'hero-480w.jpg')
        ],
        'quality': 85
    },
    'collection1.jpg': {
        'sizes': [
            (600, 800, 'collection1-600w.jpg'),
            (450, 600, 'collection1-450w.jpg'),
            (300, 400, 'collection1-300w.jpg')
        ],
        'quality': 85
    },
    'collection2.jpg': {
        'sizes': [
            (600, 800, 'collection2-600w.jpg'),
            (450, 600, 'collection2-450w.jpg'),
            (300, 400, 'collection2-300w.jpg')
        ],
        'quality': 85
    },
    'collection3.jpg': {
        'sizes': [
            (600, 800, 'collection3-600w.jpg'),
            (450, 600, 'collection3-450w.jpg'),
            (300, 400, 'collection3-300w.jpg')
        ],
        'quality': 85
    }
}

def create_optimized_images():
    """Create optimized directory and generate images"""
    
    # Create optimized images directory
    opt_dir = Path('images/optimized')
    opt_dir.mkdir(parents=True, exist_ok=True)
    
    for source_image, config in IMAGE_CONFIGS.items():
        if not os.path.exists(source_image):
            print(f"Warning: {source_image} not found")
            continue
            
        print(f"\nProcessing {source_image}...")
        
        # Generate different sizes
        for width, height, output_name in config['sizes']:
            output_path = opt_dir / output_name
            
            # Create optimized JPEG
            cmd = [
                'sips',
                '-z', str(height), str(width),
                '--setProperty', 'formatOptions', str(config['quality']),
                source_image,
                '--out', str(output_path)
            ]
            
            try:
                subprocess.run(cmd, check=True, capture_output=True)
                print(f"  ✓ Created {output_name} ({width}x{height})")
                
                # Create WebP version
                webp_path = output_path.with_suffix('.webp')
                webp_cmd = [
                    'cwebp',
                    '-q', '80',
                    str(output_path),
                    '-o', str(webp_path)
                ]
                
                try:
                    subprocess.run(webp_cmd, check=True, capture_output=True)
                    print(f"  ✓ Created {webp_path.name}")
                except (subprocess.CalledProcessError, FileNotFoundError):
                    print(f"  ! WebP conversion failed (cwebp not installed)")
                    
            except subprocess.CalledProcessError as e:
                print(f"  ✗ Failed to create {output_name}: {e}")

def generate_picture_element_code():
    """Generate HTML picture elements with srcset"""
    
    print("\n\nGenerated Picture Elements:\n")
    
    for source_image, config in IMAGE_CONFIGS.items():
        base_name = source_image.replace('.jpg', '')
        sizes = config['sizes']
        
        print(f"<!-- {source_image} -->")
        print("<picture>")
        
        # WebP sources
        webp_srcset = []
        jpg_srcset = []
        
        for width, height, output_name in sizes:
            webp_name = output_name.replace('.jpg', '.webp')
            webp_srcset.append(f"images/optimized/{webp_name} {width}w")
            jpg_srcset.append(f"images/optimized/{output_name} {width}w")
        
        # Sizes attribute
        if 'hero' in base_name:
            sizes_attr = "(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px"
        else:
            sizes_attr = "(max-width: 300px) 300px, (max-width: 450px) 450px, 600px"
        
        print(f'  <source type="image/webp" srcset="{", ".join(webp_srcset)}" sizes="{sizes_attr}">')
        print(f'  <source type="image/jpeg" srcset="{", ".join(jpg_srcset)}" sizes="{sizes_attr}">')
        print(f'  <img src="{source_image}" alt="" loading="lazy" decoding="async">')
        print("</picture>\n")

if __name__ == "__main__":
    print("Image Optimization Script for Lineaycolor")
    print("=" * 50)
    
    # Check for required tools
    try:
        subprocess.run(['sips', '--help'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: 'sips' command not found. This script requires macOS.")
        exit(1)
    
    create_optimized_images()
    generate_picture_element_code()
    
    print("\nOptimization complete! Check the images/optimized directory.")