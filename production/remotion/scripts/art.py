"""Pre-render the generative "photo" backgrounds (ArtPhoto) as JPEGs so Chrome paints a bitmap
instead of dozens of radial gradients per frame. 8 palettes x 2 seeds -> public/art/<variant>-<n>.jpg"""
import os, numpy as np
from PIL import Image, ImageFilter
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'art'); os.makedirs(OUT, exist_ok=True)
W, H = 720, 1280
P = {
 'sunset':   (['#3b1d4e', '#b14a6a', '#f0a06a'], [(255,170,120,0.8), (255,90,140,0.5)], ['#ffd9b0', '#ff9ab8', '#ffffff']),
 'night':    (['#05061a', '#141a4a', '#2a2f7a'], [(120,140,255,0.55), (200,180,255,0.35)], ['#c7d2ff', '#ffffff', '#9fb4ff']),
 'rose':     (['#ffe4ef', '#f9a8d4', '#c084fc'], [(255,255,255,0.7), (248,72,136,0.35)], ['#ffffff', '#fecdd3', '#e9d5ff']),
 'garden':   (['#eaf7d9', '#9fd3a3', '#4b8b6a'], [(255,255,220,0.8), (255,200,120,0.4)], ['#ffffff', '#fef3c7', '#fda4af']),
 'gold':     (['#2a1b0a', '#8a5a1f', '#f2c77d'], [(255,220,150,0.75), (255,255,255,0.3)], ['#ffe9b0', '#ffffff', '#ffd27a']),
 'ocean':    (['#8ad7f0', '#2f8fc9', '#123f6b'], [(255,255,255,0.75), (170,230,255,0.4)], ['#ffffff', '#c8f0ff', '#ffe29a']),
 'lavender': (['#f5f0ff', '#c4b5fd', '#7850F0'], [(255,255,255,0.75), (248,72,136,0.25)], ['#ffffff', '#fbcfe8', '#ddd6fe']),
 'peach':    (['#fff1e6', '#ffb59a', '#f26b8a'], [(255,255,255,0.8), (248,72,136,0.3)], ['#ffffff', '#ffe4d6', '#fecdd3']),
}
def hex2(c): return np.array([int(c[i:i+2],16) for i in (1,3,5)], np.float32)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
for name, (stops, glows, bokeh) in P.items():
    for seed in (1, 2):
        rng = np.random.default_rng(seed * 31 + hash(name) % 1000)
        t = np.clip((y / H) * 0.85 + (x / W) * 0.15, 0, 1)
        c0, c1, c2 = map(hex2, stops)
        img = np.where((t < 0.5)[..., None], c0 + (c1 - c0) * (t / 0.5)[..., None], c1 + (c2 - c1) * ((t - 0.5) / 0.5)[..., None])
        def glow(cx, cy, rx, ry, col, a):
            d = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2)
            al = np.clip(1 - d, 0, 1) ** 1.6 * a
            return col, al[..., None]
        for (r, g, b, a), (fx, fy, rx, ry) in zip(glows, [(0.45 + rng.uniform(-.1,.1), 0.33, 0.55, 0.35), (0.85, 0.85, 0.7, 0.45)]):
            col, al = glow(fx * W, fy * H, rx * W, ry * H, np.array([r, g, b], np.float32), a)
            img = img * (1 - al) + col * al
        for i in range(14):
            cx, cy = rng.uniform(0, 1) * W, rng.uniform(0, 1) * H
            rad = (0.04 + rng.uniform(0, 0.12)) * W
            soft = rng.uniform(0.15, 0.6)
            col = hex2(bokeh[rng.integers(0, len(bokeh))])
            d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / rad
            al = np.clip((1 - d) / soft, 0, 1) * rng.uniform(0.25, 0.7)
            al = al[..., None]
            img = img * (1 - al) + col * al
        # vignette
        vx = ((x - W / 2) / (W * 0.7)) ** 2 + ((y - H * 0.4) / (H * 0.75)) ** 2
        vig = np.clip((vx - 0.5) / 0.9, 0, 1) * 0.35
        img = img * (1 - vig[..., None])
        # grain
        img = img + rng.normal(0, 3.5, img.shape)
        im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
        im.save(os.path.join(OUT, f'{name}-{seed}.jpg'), quality=86, optimize=True)
print('ok', len(os.listdir(OUT)))
