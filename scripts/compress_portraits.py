#!/usr/bin/env python3
"""Re-save portrait PNGs with adaptive palette quantization for smaller size."""
from PIL import Image

for name in ('portrait-hero.png', 'portrait-intro.png'):
    im = Image.open(f'assets/{name}')
    q = im.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
    q.save(f'assets/{name}', optimize=True)
    print(name, len(open(f'assets/{name}', 'rb').read()) // 1024, 'KB')
