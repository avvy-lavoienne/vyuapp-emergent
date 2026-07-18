#!/usr/bin/env python3
"""Generate a simple OG image for VyuApp using Pillow."""
from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT = '/root/vyuapp/public/opengraph-image.png'
WIDTH, HEIGHT = 1200, 630

# Create gradient background (dark blue to black)
img = Image.new('RGB', (WIDTH, HEIGHT), '#000000')
draw = ImageDraw.Draw(img)

# Draw gradient background
for y in range(HEIGHT):
    r = int(0 + (y / HEIGHT) * 10)
    g = int(0 + (y / HEIGHT) * 20)
    b = int(30 + (y / HEIGHT) * 40)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# Draw accent line
draw.rectangle([(60, 280), (620, 284)], fill='#2997ff')

# Try to use a system font, fallback to default
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
    font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    font_tag = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 18)
except:
    font_title = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_tag = ImageFont.load_default()

# Draw text
draw.text((60, 300), 'VyuApp', fill='#f5f5f7', font=font_title)
draw.text((60, 390), 'Bespoke Web Engineering & Market Intelligence', fill='#86868b', font=font_sub)
draw.text((60, 440), 'vyuapp.my.id', fill='#2997ff', font=font_tag)

# Draw small logo indicator
draw.rectangle([(60, 200), (64, 270)], fill='#2997ff')

img.save(OUTPUT, 'PNG', optimize=True)
print(f"Created {OUTPUT} ({os.path.getsize(OUTPUT)} bytes)")
