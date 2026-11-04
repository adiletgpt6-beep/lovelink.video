"""QR sanity check: extract frames at the given seconds from each MP4 and try to decode any QR codes.
usage: python3 scripts/qa-qr.py VIDEO-006:17 VIDEO-007:12 ...   (id:second)"""
import subprocess, sys, tempfile, os
import zxingcpp
from PIL import Image
root = os.path.join(os.path.dirname(__file__), '..', '..', '..')
for arg in sys.argv[1:]:
    vid, sec = arg.split(':')
    f = os.path.join(root, 'videos', vid, vid + '.mp4')
    with tempfile.TemporaryDirectory() as d:
        out = os.path.join(d, 'f.png')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', sec, '-i', f, '-frames:v', '1', out], check=True)
        res = zxingcpp.read_barcodes(Image.open(out))
        print(f"{vid} @ {sec}s -> {[r.text for r in res] or 'no QR decoded'}")
