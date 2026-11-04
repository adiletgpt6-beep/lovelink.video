import sys, glob, os
from PIL import Image
out = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 5
fs = sorted(glob.glob(os.path.join(out, 'f*.jpg')), key=lambda x: int(os.path.basename(x)[1:-4]))
ims = [Image.open(f).resize((360, 640)) for f in fs]
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (360 * cols, 640 * rows), 'black')
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * 360, (i // cols) * 640))
sheet.save(os.path.join(out, 'sheet.jpg'), quality=85)
print('sheet', len(ims), [os.path.basename(f) for f in fs])
