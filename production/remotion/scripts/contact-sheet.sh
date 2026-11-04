#!/usr/bin/env bash
# Extract 12 evenly spaced frames from a rendered MP4 into one contact sheet (visual QA).
# usage: scripts/contact-sheet.sh videos/VIDEO-001/VIDEO-001.mp4 out.jpg
set -euo pipefail
IN="$1"; OUT="$2"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
TMP=$(mktemp -d)
for i in $(seq 0 11); do
  T=$(python3 -c "print(($i+0.5)*$DUR/12)")
  ffmpeg -v error -y -ss "$T" -i "$IN" -frames:v 1 -vf scale=360:-1 "$TMP/f$(printf %02d $i).jpg"
done
python3 - "$TMP" "$OUT" <<'PY'
import sys,glob,os
from PIL import Image
tmp,out=sys.argv[1],sys.argv[2]
fs=sorted(glob.glob(os.path.join(tmp,'f*.jpg')))
ims=[Image.open(f) for f in fs]
w,h=ims[0].size
sheet=Image.new('RGB',(w*6,h*2),'black')
for i,im in enumerate(ims): sheet.paste(im,((i%6)*w,(i//6)*h))
sheet.save(out,quality=85); print(out)
PY
rm -rf "$TMP"
