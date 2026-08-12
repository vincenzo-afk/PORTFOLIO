"""Prepare portfolio brand assets from the GitHub avatar: nav badge, favicon, OG card."""
from PIL import Image, ImageDraw, ImageFont

SRC = "/home/ubuntu/PORTFOLIO/assets/bk-avatar.png"
OUT = "/home/ubuntu/PORTFOLIO/assets"

DARK = (10, 10, 10)
CARD = (22, 22, 22)
LIME = (200, 255, 0)
MUTED = (136, 136, 136)

src = Image.open(SRC).convert("RGBA")
if src.size != (460, 460):
    src = src.resize((460, 460), Image.LANCZOS)

# Mask avatar to a circle
mask = Image.new("L", (460, 460), 0)
d = ImageDraw.Draw(mask)
d.ellipse([4, 4, 456, 456], fill=255)
circ = Image.new("RGBA", (460, 460), (0, 0, 0, 0))
circ.paste(src, (0, 0), mask)

# 1. Nav logo badge: 40x40 with lime border plate
bs = 40
badge = Image.new("RGBA", (bs, bs), (0, 0, 0, 0))
bd = ImageDraw.Draw(badge)
bd.ellipse([1, 1, bs - 2, bs - 2], fill=LIME)
p = circ.resize((bs - 4, bs - 4), Image.LANCZOS)
badge.paste(p, (2, 2))
badge.save(f"{OUT}/logo-40.png")

# 2. Favicon 32x32
fs = 32
fav = Image.new("RGBA", (fs, fs), DARK + (255,))
fd = ImageDraw.Draw(fav)
fd.ellipse([1, 1, fs - 2, fs - 2], fill=LIME)
p = circ.resize((fs - 4, fs - 4), Image.LANCZOS)
fav.paste(p, (2, 2))
fav.save(f"{OUT}/favicon-32.png")

# 3. OG image 1200x630 (dark theme matching the site)
og = Image.new("RGBA", (1200, 630), DARK + (255,))
d = ImageDraw.Draw(og)
# subtle top lime line
d.rectangle([0, 0, 1200, 10], fill=LIME)
# avatar plate
px0, py0 = 90, 135
plate_w, plate_h = 360, 360
d.rectangle([px0, py0, px0 + plate_w, py0 + plate_h], outline=LIME, width=6)
ap = circ.resize((plate_w - 24, plate_h - 24), Image.LANCZOS)
og.paste(ap, (px0 + 12, py0 + 12))
# text
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
    sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    sub2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
except OSError:
    font = sub = sub2 = ImageFont.load_default()
d.text((510, 215), "BHARANI KUMAR S", fill=(255, 255, 255), font=font)
d.text((510, 340), "Software Developer — AI full-stack", fill=LIME, font=sub)
d.text((510, 410), "70+ AI projects, 55+ public repositories", fill=MUTED, font=sub2)
d.text((510, 485), "vincenzo-afk.github.io/PORTFOLIO", fill=MUTED, font=sub2)
og.convert("RGB").save(f"{OUT}/og-portfolio.png")
print("saved logo-40.png, favicon-32.png, og-portfolio.png")
