# Puts the screenshots into simple device frames for the home page.
import os, sys
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'out')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '../../apps/web/src/assets/images')

def rounded(size, radius, fill):
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius, fill=fill)
    return im

def shadow(size, radius, offset, blur, alpha):
    sh = Image.new('RGBA', (size[0] + blur * 4, size[1] + blur * 4), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([blur * 2, blur * 2 + offset, blur * 2 + size[0], blur * 2 + size[1] + offset], radius, fill=(15, 30, 60, alpha))
    return sh.filter(ImageFilter.GaussianBlur(blur))

def screen(path, width, radius):
    im = Image.open(path).convert('RGBA')
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    mask = rounded(im.size, radius, (255, 255, 255, 255)).getchannel('A')
    im.putalpha(mask)
    return im

def laptop():
    scr = screen(f'{SRC}/desktop.png', 1400, 10)
    bezel = 22
    lid = rounded((scr.width + bezel * 2, scr.height + bezel * 2 + 10), 34, (32, 38, 52, 255))
    lid.alpha_composite(scr, (bezel, bezel))
    base_w, base_h = lid.width + 160, 34
    canvas = Image.new('RGBA', (base_w + 80, lid.height + base_h + 120), (0, 0, 0, 0))
    canvas.alpha_composite(shadow((base_w, lid.height + base_h), 30, 26, 28, 70), (40 - 56, 40 - 56))
    lx = (canvas.width - lid.width) // 2
    canvas.alpha_composite(lid, (lx, 40))
    base = Image.new('RGBA', (base_w, base_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle([0, 0, base_w - 1, base_h - 1], 16, fill=(214, 220, 230, 255))
    d.rectangle([0, 0, base_w - 1, 6], fill=(196, 203, 215, 255))
    d.rounded_rectangle([base_w // 2 - 110, 0, base_w // 2 + 110, 12], 6, fill=(184, 192, 205, 255))
    canvas.alpha_composite(base, ((canvas.width - base_w) // 2, 40 + lid.height - 4))
    return canvas.crop(canvas.getbbox())

FONT = os.path.join(HERE, '../../apps/web/src/assets/fonts/Rubik-Medium.ttf')

def status_bar_screen(path, width, radius, bar=78):
    """Screenshot below a phone status bar (time, signal, battery)."""
    from PIL import ImageFont
    shot = Image.open(path).convert('RGBA')
    shot = shot.resize((width, round(shot.height * width / shot.width)), Image.LANCZOS)
    scr = Image.new('RGBA', (width, shot.height), (255, 255, 255, 255))
    scr.alpha_composite(shot.crop((0, 0, width, shot.height - bar)), (0, bar))
    d = ImageDraw.Draw(scr)
    font = ImageFont.truetype(FONT, 26)
    d.text((70, 26), '9:41', font=font, fill=(17, 24, 39, 255))
    x = width - 70
    d.rounded_rectangle([x - 44, 30, x, 52], 6, outline=(17, 24, 39, 255), width=2)
    d.rounded_rectangle([x - 40, 34, x - 10, 48], 3, fill=(17, 24, 39, 255))
    d.rectangle([x + 2, 37, x + 5, 45], fill=(17, 24, 39, 255))
    for i, h in enumerate([8, 12, 16, 20]):
        d.rounded_rectangle([x - 100 + i * 9, 52 - h, x - 94 + i * 9, 52], 2, fill=(17, 24, 39, 255))
    scr.putalpha(rounded(scr.size, radius, (255, 255, 255, 255)).getchannel('A'))
    return scr

def phone():
    scr = status_bar_screen(f'{SRC}/mobile.png', 660, 74)
    bezel = 18
    body = rounded((scr.width + bezel * 2, scr.height + bezel * 2), 92, (32, 38, 52, 255))
    ImageDraw.Draw(body).rounded_rectangle([1, 1, body.width - 2, body.height - 2], 91, outline=(96, 106, 128, 255), width=3)
    body.alpha_composite(scr, (bezel, bezel))
    island = rounded((190, 54), 27, (12, 14, 20, 255))
    body.alpha_composite(island, ((body.width - island.width) // 2, bezel + 14))
    canvas = Image.new('RGBA', (body.width + 120, body.height + 140), (0, 0, 0, 0))
    canvas.alpha_composite(shadow(body.size, 92, 24, 26, 90), (60 - 52, 50 - 52))
    canvas.alpha_composite(body, (60, 50))
    return canvas.crop(canvas.getbbox())

def card(name, width):
    im = Image.open(f'{SRC}/{name}.png').convert('RGBA')
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

for out, im in [('laptop', laptop()), ('phone', phone()),
                ('weight-card', card('weight-card', 1100)), ('vaccination-card', card('vaccines-card', 1600))]:
    im.save(f'{OUT}/{out}.webp', 'WEBP', quality=88, method=6)
    print(out, im.size, os.path.getsize(f'{OUT}/{out}.webp') // 1024, 'KB')
