# HANDOFF — как продолжить работу над видео LoveLink

Документ для следующего сеанса Claude Code или человека-монтажёра. Всё, что нужно знать,
чтобы перерендерить, изменить или дополнить ролики без потери контекста.

## 1. Что такое LoveLink (выжимка из исходников)

* **lovelink.my** (репо `LoveLink_front`, Next.js 16 + Tailwind 4) — каталог шаблонов
  («FeelLink»), категории «Для кого»: девушка, парень, мама, папа, друг, жена, муж, клиент,
  учитель, другое. Вход через email/Google. Страницы `/`, `/templates/[model]`, `/pricing`,
  `/gifts` («Мои подарки»), `/auth`.
* **edit.lovelink.my** (репо `FeelLinkEdit`) — редактор страницы-подарка: фон страницы,
  карточки «Видео и обложка», картинка/гифка, «Причины» (иконка, заголовок, до 10 причин,
  текст кнопки), карточка эмоций, финальная карточка; загрузка файлов (Cloudinary) или ссылки
  (в т.ч. YouTube). После «Сохранить» — модалка «Ваша страница готова»: ссылка
  `view.lovelink.my/g/{giftId}`, пароль (6 цифр), код для редактирования (платные тарифы),
  QR-код (13 стилей, с фоном/без).
* **view.lovelink.my** (репо `FeelLink`) — страница подарка: фон + Swiper-карточки.
* **Экран пароля** (репо `LoveLink_Password`): «Введите пароль, чтобы увидеть подарок 🎁»,
  6 точек, стеклянная клавиатура на тёмной «авроре», «Открыто! 🎉 / Подарок внутри».
* **Тарифы** (`pricing/page.tsx`): Start $10 (30 страниц, 1 год), Business $50 (300, 2 года,
  «Популярный», для магазинов подарков и цветочных салонов), Pro $100 (1000, 3 года).
  Все: страницы хранятся 30 лет; в платные входит: все шаблоны, безлимитные готовые ссылки,
  редактор текста подарка, ИИ-помощник для текста, клонирование подарков.
  Бесплатно: готовые ссылки на шаблоны (гость 2 / после регистрации 5) и один персональный подарок.
* Поддержка — WhatsApp (ссылка в меню). Оплата — переводом по реквизитам через WhatsApp.

## 2. Структура репозитория

```
videos/VIDEO-00X/            script.md (сценарий/раскадровка/таймкоды) + VIDEO-00X.mp4
production/STATUS.md         статус этапов
production/HANDOFF.md        этот файл
production/STYLE_GUIDE.md    цвета, шрифты, безопасные зоны, что нельзя обещать
production/remotion/         проект Remotion (React 19, Remotion 4.0.540, Tailwind v4)
  scripts/vo-scripts.json    тексты озвучки + голоса (источник правды для сценариев)
  scripts/tts.mjs            ElevenLabs → mp3 + пословные таймкоды (timeline.json)
  scripts/music.py           генератор музыки (numpy)
  scripts/render.mjs         финальный рендер MP4
  scripts/stills.mjs         контрольные кадры для QA (sheet.py — контактный лист)
  scripts/export-scripts.py  генерация videos/*/script.md
  public/audio/vo/VIDEO-00X/ s01..s07.mp3 + .json + timeline.json
  public/audio/music/        VIDEO-00X-music.mp3
  public/brand/              logo.png (из LoveLink_front), qr-*.png (реальные QR-ассеты сайта)
  public/fonts/              Playfair Display, Unbounded, Manrope, Cormorant (OFL, кириллица)
  src/lib/                   theme, anim, timeline (тайминг сцен), timelines (планы 5 роликов), content (тексты подарков)
  src/ui/                    PhoneFrame, Captions, Backgrounds, Fx, Text, Logo, ArtPhoto, Illustrations
  src/screens/               реконструкции экранов продукта
  src/videos/                Video001..005.tsx + common.tsx
```

## 3. Как собрать

```bash
cd production/remotion && npm install
node scripts/render.mjs                 # все ролики → ../../videos/
node scripts/render.mjs VIDEO-003       # один ролик
node scripts/stills.mjs VIDEO-003 /tmp/v3 10 && python3 scripts/sheet.py /tmp/v3   # контрольные кадры
npx remotion studio                     # интерактивный превью
```
Chromium: `REMOTION_BROWSER` (по умолчанию `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`);
без переменной Remotion скачает свой браузер.

**Производительность рендера (важно для серверов без GPU).** Программный GL-рендерер
`swiftshader` (`GL=swiftshader`, задан по умолчанию в `remotion.config.ts` и скриптах) в ~4 раза
быстрее `swangle` на этом проекте. Дорогие в софтверном рендере приёмы уже убраны:
`filter: blur()`, `backdrop-filter`, SVG `feTurbulence`, `mix-blend-mode`, большие `box-shadow`.
Фоны-«аврора» и генеративные «фото» предрендерены в `public/brand/aurora.png` и `public/art/*.jpg`
(`scripts/art.py`). Профилировать слои можно композициями `Perf-*` (`node scripts/perf.mjs Perf-home`).
Ориентир: 170–260 мс/кадр при concurrency 4 → 4–6 минут на ролик.

## 4. Как менять

* **Текст озвучки** → `scripts/vo-scripts.json` → `ELEVENLABS_API_KEY=… node scripts/tts.mjs VIDEO-00X --force`
  (платная операция: ~400–600 символов на ролик). Затем `python3 scripts/export-scripts.py` и рендер.
  Тайминг сцен пересчитывается автоматически из длительности аудио (`src/lib/timelines.ts`,
  параметры `voDelay / gapAfter / minSec`).
* **Голос** → поле `voice` в `vo-scripts.json` (доступные premade: `GET /v1/voices`).
* **Субтитры** → компонент `src/ui/Captions.tsx` (стили `pill|clean|boxed|serif`, `hideScenes`).
* **Экраны** → `src/screens/*`. Tailwind-классы скопированы из реальных компонентов; при изменении
  дизайна сайта обновлять именно там.
* **Контент подарка** (тексты карточек) → `src/lib/content.ts` (`loveGift`, `momGift`, `TEMPLATES`).

## 4a. Состояние живого сайта на момент производства (2026-11-04)

* `https://lovelink.my` → 307 → `https://www.lovelink.my` (200). Страницы `/`, `/templates/feel-link`,
  `/pricing`, `/auth` сняты Playwright-ом (390×844 @3x) — `production/remotion/public/screens/`.
  Тексты и вёрстка полностью совпали с реконструкциями в `src/screens/*`.
* **Бэкенд недоступен:** `https://www.lovelink.my/api/templates` отдаёт страницу Render
  «This service has been suspended by its owner». Из-за этого главная показывает fallback-шаблоны
  из моков с пустыми серыми превью (YouTube-embed вместо постера). Поэтому в роликах каталог
  шаблонов показан реконструкцией с собственными превью, а не реальным скриншотом главной.
  Реальный скриншот использован там, где страница рендерится без бэкенда — `/pricing` (VIDEO-005).
* `edit.lovelink.my`, `view.lovelink.my`, `*.vercel.app`, `*.onrender.com`, `res.cloudinary.com`
  из сессии недоступны (сетевая политика) — редактор, страница подарка и экран пароля
  реконструированы по коду.

## 5. Как заменить реконструкции на реальные записи интерфейса

1. Разрешить в сетевых настройках сессии `lovelink.my`, `edit.lovelink.my`, `view.lovelink.my`
   (или запустить фронты локально: `npm ci --ignore-scripts && npx next dev` в `LoveLink_front`,
   `FeelLinkEdit`, `FeelLink`, `LoveLink_Password` — в этой сессии запуск был заблокирован политикой).
2. Снять экраны Playwright-ом при viewport 390×844, `deviceScaleFactor: 3`, и положить PNG/WebM
   в `public/screens/`.
3. В `src/screens/*` подменить соответствующий компонент на `<Img src={staticFile('screens/…png')}/>`
   или `<OffthreadVideo/>` — пропсы анимации (tap, highlight) остаются.

## 6. Проверка качества (что сделано)

* `production/QA_REPORT.md` (генерируется `scripts/qa.sh`): 1080×1920, 30 fps, h264 yuv420p, aac 48 kHz,
  длительности 38.6–43.0 с, blackdetect = 0, интегральная громкость −16.7…−17.8 LUFS, true peak ≤ −4.1 dBFS.
* Контактные листы готовых MP4 (12 кадров на ролик): `production/qa/VIDEO-00X-contact-sheet.jpg`
  (`scripts/contact-sheet.sh`), просмотрены на предмет обрезанного текста и перекрытий.
* Голос нормализован до −16 LUFS, музыка приглушается до ~0.14–0.16 во время речи.
* Субтитры генерируются из таймкодов того же аудио — рассинхрон исключён по построению;
  соответствие текста = `vo-scripts.json`.
* Сайт в роликах указан как `lovelink.my` (и реальные поддомены `view.lovelink.my`, `edit.lovelink.my`).

* Волна 2: см. раздел «Волна 2 — дополнительные проверки» в `QA_REPORT.md` (QR-декодирование с кадров, шесть ячеек,
  длительности по брифу, исправленные наложения).

## 7. Что улучшить в следующей итерации

* Прослушать озвучку и при необходимости заменить голоса на нативные русские (нужно право
  `voices_write` на ключе ElevenLabs, чтобы добавить голос из библиотеки, например
  «Veronica», «Victoria», «Alexander»).
* Заменить генеративные «фото» (ArtPhoto) на лицензированные фото/видео клиентов.
* При наличии доступа к сайту — реальные записи экранов (п. 5).
* Проверить ролики на реальных устройствах в интерфейсах Reels/TikTok.


---

## 8. Волна 2 — VIDEO-006…010: что добавлено и как с этим работать

**Позиционирование:** B2B для цветочных магазинов и продавцов подарков: к товару добавляется физическая открытка
LoveLink с QR-кодом (ведёт на `password.lovelink.my`) и **шестизначным** секретным кодом; получатель сканирует QR,
вводит 6 цифр и видит персональное послание (видео, фото, текст — других типов контента в продукте нет).

**Новые модули**
* `src/ui/Postcard.tsx` — физическая открытка (3 варианта: ivory / blush / night), реальный QR
  (`public/brand/qr-password.png|svg`, генератор — `qrcode`, URL `https://password.lovelink.my`), шесть ячеек кода,
  параметры `revealed`, `rotX/rotY`, `sweep`, `glow`.
* `src/ui/Scan.tsx` — экран камеры телефона с распознаванием QR.
* `src/three/*` — процедурные 3D-объекты (`Rose`, `Bouquet` с параметром `assemble`, `PetalRain`, `Sparkles`,
  `GiftBox`, `Chocolate`, `Teddy`, `Pendant`), `Layers.tsx` — прозрачные слои-композиции (`L006-rose`, …).
* `scripts/render3d.mjs` — рендер слоёв в PNG-последовательности `public/3d/<id>/element-N.png` (gitignored,
  ~1.1 с/кадр при concurrency 4 на swangle). `src/ui/Layer3D.tsx` показывает кадры слоя в 2D-композиции.
  **Перед рендером VIDEO-006…010 слои должны быть отрендерены:** `node scripts/render3d.mjs $(node -e "console.log(require('./src/three/Layers.tsx'))" )` → проще: `node scripts/render3d.mjs L006-rose L006-bouquet LPetals L007-rose L007-swirl L007-bouquet L008-bouquet L009-swirl L010-roses L010-box L010-choc L010-teddy L010-pendant L010-all`.
* WebGL не работает в рендерере `swiftshader`, поэтому 3D слои рендерятся отдельно с `gl: swangle`, а основные
  композиции — быстрым `swiftshader`.
* Новые тексты подарков в `src/lib/content.ts`: `wifeGift`, `friendGift`, `clientGift`.
* Музыка: `python3 scripts/music.py --new` (треки 006–010), `--all` — все десять.

**Статус на конец сессии:** все пять MP4 отрендерены, проверены (`QA_REPORT.md`, раздел «Волна 2») и закоммичены.
Незавершённого нет. Если понадобится перерендер — слои `public/3d/` в репозиторий не входят (≈1 ГБ PNG):
сначала `node scripts/render3d.mjs <все 14 слоёв>` (~1.7 ч на 4 CPU), затем `node scripts/render.mjs VIDEO-006 … VIDEO-010`.
`src/lib/layers-ready.json` перечисляет готовые слои; `node scripts/layers-ready.mjs` пересобирает его по факту
(проверяет число кадров). `FRAMES=a-b node scripts/render3d.mjs <слой>` дорендеривает диапазон кадров — Remotion
именует их без дополнения нулями (`element-7.png`), после чего файлы нужно переименовать в `element-007.png`.

**Git: история ветки `ccr-90360352-qwt9c9`**
* Коммиты `11cdd7b`…`bb75341` случайно включили PNG-последовательности `production/remotion/public/3d/` (≈280 MiB):
  шаблон `.gitignore` `public/3d/` не совпадал с вложенным путём. В `f7999c9` файлы сняты с отслеживания и шаблон
  исправлен (`production/remotion/public/3d/`), но блобы остались в истории ветки.
* Чтобы убрать их до слияния в `main`, нужен перезапис истории и force-push (в этой сессии не выполнялся —
  политика запрещает force-push без явного разрешения):
  `git filter-branch -f --index-filter 'git rm -r -q --cached --ignore-unmatch production/remotion/public/3d' 8a861a0..HEAD && git push --force-with-lease origin ccr-90360352-qwt9c9`.
  Альтернатива — слить ветку squash-ом, тогда блобы в `main` не попадут.

**Как улучшить дальше (если появятся ресурсы)**
* Съёмка/сток с людьми (флорист, получательница) — заменить сцены S3/S4 в VIDEO-006 и S2 в VIDEO-008 на реальные
  кадры (`<OffthreadVideo>`), остальная структура сохраняется.
* Фотореалистичные розы: подключить glTF-модели (CC0) в `Bouquet.tsx` вместо процедурных лепестков.
* Печать открытки: макет открытки можно экспортировать из `Postcard.tsx` (600×400 логических px, 3:2).
