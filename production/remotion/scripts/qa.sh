#!/usr/bin/env bash
# Technical QA for the rendered videos -> production/QA_REPORT.md
set -uo pipefail
cd "$(dirname "$0")/../../.."
REPORT="${QA_REPORT:-production/QA_REPORT.md}"
{
echo "# QA отчёт — рекламные видео LoveLink"
echo
echo "_Сгенерировано scripts/qa.sh: $(date -u +%Y-%m-%dT%H:%MZ)_"
echo
echo "| Ролик | Размер | Длит. | Видео | Аудио | Чёрные кадры | Громкость (LUFS) | True peak |"
echo "|---|---|---|---|---|---|---|---|"
IDS="${*:-VIDEO-001 VIDEO-002 VIDEO-003 VIDEO-004 VIDEO-005}"
for id in $IDS; do
  f="videos/$id/$id.mp4"
  if [ ! -f "$f" ]; then echo "| $id | — | — | нет файла | | | | |"; continue; fi
  size=$(du -h "$f" | cut -f1)
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  v=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt -of csv=p=0 "$f" | tr ',' ' ')
  a=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,sample_rate,channels -of csv=p=0 "$f" | tr ',' ' ')
  black=$(ffmpeg -v info -i "$f" -vf "blackdetect=d=0.3:pix_th=0.10" -an -f null - 2>&1 | grep -c "black_start" || true)
  loud=$(ffmpeg -v info -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 | tr -s ' ' | tr '\n' ' ')
  I=$(echo "$loud" | grep -oE "I: *-?[0-9.]+ LUFS" | head -1 | grep -oE "\-?[0-9.]+")
  TP=$(echo "$loud" | grep -oE "Peak: *-?[0-9.]+ dBFS" | tail -1 | grep -oE "\-?[0-9.]+")
  printf "| %s | %s | %.1f с | %s | %s | %s | %s | %s dBFS |\n" "$id" "$size" "$dur" "$v" "$a" "$black" "${I:-?}" "${TP:-?}"
done
echo
echo "Критерии: 1080×1920 (9:16), 30 fps, h264 yuv420p, aac; длительность 30–45 с; blackdetect (d≥0.3 с, порог 10 %) = 0; интегральная громкость около −16…−20 LUFS."
} > "$REPORT"
cat "$REPORT"
