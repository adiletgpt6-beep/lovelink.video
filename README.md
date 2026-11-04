# lovelink.video — рекламные видео для LoveLink (lovelink.my)

Пять вертикальных рекламных роликов (9:16, 1080×1920, 30 fps, H.264 + AAC, русская озвучка,
синхронные субтитры), собранных в Remotion по реальному дизайну и функциям LoveLink.

| Ролик | Концепция | Файл |
|---|---|---|
| VIDEO-001 | Эмоциональная реклама «Слова, которые мы не говорим» | `videos/VIDEO-001/VIDEO-001.mp4` |
| VIDEO-002 | Демонстрация сайта «Как это работает» | `videos/VIDEO-002/VIDEO-002.mp4` |
| VIDEO-003 | Преимущества «Почему LoveLink» | `videos/VIDEO-003/VIDEO-003.mp4` |
| VIDEO-004 | История клиента «История Айданы» | `videos/VIDEO-004/VIDEO-004.mp4` |
| VIDEO-005 | Прямая реклама «Подарок, который открывают» | `videos/VIDEO-005/VIDEO-005.mp4` |

В каждой папке `videos/VIDEO-00X/` лежат `script.md` (сценарий, раскадровка, таймкоды) и готовый MP4.
Исходники монтажа — `production/remotion/` (React/Remotion), озвучка и музыка — `production/remotion/public/audio/`.

Статус и передача контекста: `production/STATUS.md`, `production/HANDOFF.md`, гайд по стилю: `production/STYLE_GUIDE.md`.

## Пересборка

```bash
cd production/remotion
npm install
# озвучка уже сгенерирована; для перегенерации нужен ELEVENLABS_API_KEY
# node scripts/tts.mjs --force
# python3 scripts/music.py          # музыка (numpy)
node scripts/render.mjs             # все 5 роликов -> ../../videos/*/
node scripts/render.mjs VIDEO-002   # один ролик
npx remotion studio                 # превью в браузере
```
