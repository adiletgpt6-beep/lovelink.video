# lovelink.video — рекламные видео для LoveLink (lovelink.my)

Десять вертикальных рекламных роликов (две волны) (9:16, 1080×1920, 30 fps, H.264 + AAC, русская озвучка,
синхронные субтитры), собранных в Remotion по реальному дизайну и функциям LoveLink.

| Ролик | Концепция | Файл | Длит. · размер |
|---|---|---|---|
| VIDEO-001 | Эмоциональная реклама «Слова, которые мы не говорим» | `videos/VIDEO-001/VIDEO-001.mp4` | 38.6 с · 15 МБ |
| VIDEO-002 | Демонстрация сайта «Как это работает» | `videos/VIDEO-002/VIDEO-002.mp4` | 41.2 с · 5 МБ |
| VIDEO-003 | Преимущества «Почему LoveLink» | `videos/VIDEO-003/VIDEO-003.mp4` | 43.0 с · 14 МБ |
| VIDEO-004 | История клиента «История Айданы» | `videos/VIDEO-004/VIDEO-004.mp4` | 42.0 с · 11 МБ |
| VIDEO-005 | Прямая реклама «Подарок, который открывают» | `videos/VIDEO-005/VIDEO-005.mp4` | 40.2 с · 14 МБ |
| VIDEO-006 | Кинематографичная «Букет, который умеет говорить» (для флористов) | `videos/VIDEO-006/VIDEO-006.mp4` | 43.1 с · 18 МБ |
| VIDEO-007 | Премиальная 3D motion-graphics «Магия внутри открытки» | `videos/VIDEO-007/VIDEO-007.mp4` | 31.3 с · 16 МБ |
| VIDEO-008 | B2B «Ваш цветочный магазин особенный» | `videos/VIDEO-008/VIDEO-008.mp4` | 38.0 с · 9.6 МБ |
| VIDEO-009 | Гипнотическая анимация «Шесть цифр до эмоций» | `videos/VIDEO-009/VIDEO-009.mp4` | 29.8 с · 25 МБ |
| VIDEO-010 | Lifestyle «Любой подарок становится личным» | `videos/VIDEO-010/VIDEO-010.mp4` | 35.1 с · 9.8 МБ |

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
node scripts/render3d.mjs L006-rose L006-bouquet LPetals L007-rose L007-swirl L007-bouquet L008-bouquet L009-swirl L010-roses L010-box L010-choc L010-teddy L010-pendant L010-all  # 3D-слои для VIDEO-006…010 (~1.5 ч на CPU)
node scripts/render.mjs             # все ролики -> ../../videos/*/
node scripts/render.mjs VIDEO-002   # один ролик
npx remotion studio                 # превью в браузере
```
