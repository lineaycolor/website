from PIL import Image, ImageDraw, ImageFont
import os

# Create images directory if it doesn't exist
if not os.path.exists('images'):
    os.makedirs('images')

# Hero image - 1920x1080
hero = Image.new('RGB', (1920, 1080), color='#1a1a1a')
draw = ImageDraw.Draw(hero)

# Create gradient effect for hero
for i in range(1080):
    color_value = int(26 + (45 - 26) * (i / 1080))
    draw.rectangle([0, i, 1920, i+1], fill=(color_value, color_value, color_value))

# Add text to hero (using default font)
try:
    font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 120)
    font_medium = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()

# Center text
text = "LINEAYCOLOR"
bbox = draw.textbbox((0, 0), text, font=font_large)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]
x = (1920 - text_width) // 2
y = 450
draw.text((x, y), text, fill='white', font=font_large)

text2 = "FASHION & STYLE"
bbox2 = draw.textbbox((0, 0), text2, font=font_medium)
text_width2 = bbox2[2] - bbox2[0]
x2 = (1920 - text_width2) // 2
draw.text((x2, 600), text2, fill='white', font=font_medium)

hero.save('hero-image.jpg', 'JPEG', quality=95)

# Collection 1 - Summer (600x800)
col1 = Image.new('RGB', (600, 800), color='#FFE5CC')
draw1 = ImageDraw.Draw(col1)
# Gradient
for i in range(800):
    r = int(255 - (255 - 255) * (i / 800))
    g = int(229 - (229 - 171) * (i / 800))
    b = int(204 - (204 - 145) * (i / 800))
    draw1.rectangle([0, i, 600, i+1], fill=(r, g, b))

draw1.text((300 - 100, 380), "SUMMER", fill='#333333', font=font_large if 'font_large' in locals() else ImageFont.load_default())
draw1.text((300 - 100, 450), "COLLECTION", fill='#333333', font=font_medium if 'font_medium' in locals() else ImageFont.load_default())
col1.save('collection1.jpg', 'JPEG', quality=95)

# Collection 2 - Evening (600x800)
col2 = Image.new('RGB', (600, 800), color='#1a1a2e')
draw2 = ImageDraw.Draw(col2)
# Dark gradient
for i in range(800):
    color_value = int(26 + (22 - 26) * (i / 800))
    draw2.rectangle([0, i, 600, i+1], fill=(color_value, color_value, color_value + 20))

draw2.text((300 - 100, 380), "EVENING", fill='#C9A961', font=font_large if 'font_large' in locals() else ImageFont.load_default())
draw2.text((300 - 100, 450), "ELEGANCE", fill='#C9A961', font=font_medium if 'font_medium' in locals() else ImageFont.load_default())
col2.save('collection2.jpg', 'JPEG', quality=95)

# Collection 3 - Casual (600x800)
col3 = Image.new('RGB', (600, 800), color='#E8E8E8')
draw3 = ImageDraw.Draw(col3)
# Light gradient
for i in range(800):
    color_value = int(232 - (232 - 184) * (i / 800))
    draw3.rectangle([0, i, 600, i+1], fill=(color_value, color_value, color_value))

draw3.text((300 - 80, 380), "CASUAL", fill='#333333', font=font_large if 'font_large' in locals() else ImageFont.load_default())
draw3.text((300 - 40, 450), "CHIC", fill='#333333', font=font_medium if 'font_medium' in locals() else ImageFont.load_default())
col3.save('collection3.jpg', 'JPEG', quality=95)

print("Images generated successfully!")
print("- hero-image.jpg (1920x1080)")
print("- collection1.jpg (600x800)")
print("- collection2.jpg (600x800)")
print("- collection3.jpg (600x800)")