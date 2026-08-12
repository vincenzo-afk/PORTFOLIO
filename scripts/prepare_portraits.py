#!/usr/bin/env python3
"""Build optimized portrait images for the hero and intro sections.

Reads the GitHub avatar from /tmp/avatar_src.png (fetched with curl),
trims transparency, and outputs sizes tuned to the rendered dimensions
(hero 280x380, intro 450x600 max) so the browser never has to decode
an oversized image.
"""
from PIL import Image

OUT = 'assets'

im = Image.open('/tmp/avatar_src.png').convert('RGBA')

# Trim transparency onto the site's dark background
bg = Image.new('RGBA', im.size, (17, 17, 17, 255))
bg.alpha_composite(im)
im = bg.convert('RGB')

# Hero: 280x380 cover crop
hw, hh = 280, 380
hero = im.copy()
scale = max(hw / hero.width, hh / hero.height)
hero = hero.resize((round(hero.width * scale), round(hero.height * scale)), Image.LANCZOS)
left = (hero.width - hw) // 2
top = (hero.height - hh) // 2
hero = hero.crop((left, top, left + hw, top + hh))
hero.save(f'{OUT}/portrait-hero.png', optimize=True)

# Intro: 450x600 cover crop
iw, ih = 450, 600
intro = im.copy()
scale = max(iw / intro.width, ih / intro.height)
intro = intro.resize((round(intro.width * scale), round(intro.height * scale)), Image.LANCZOS)
left = (intro.width - iw) // 2
top = (intro.height - ih) // 2
intro = intro.crop((left, top, left + iw, top + ih))
intro.save(f'{OUT}/portrait-intro.png', optimize=True)

for name in ('portrait-hero.png', 'portrait-intro.png'):
    print(name, len(open(f'{OUT}/{name}', 'rb').read()) // 1024, 'KB')
