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

## 5. Как заменить реконструкции на реальные записи интерфейса

1. Разрешить в сетевых настройках сессии `lovelink.my`, `edit.lovelink.my`, `view.lovelink.my`
   (или запустить фронты локально: `npm ci --ignore-scripts && npx next dev` в `LoveLink_front`,
   `FeelLinkEdit`, `FeelLink`, `LoveLink_Password` — в этой сессии запуск был заблокирован политикой).
2. Снять экраны Playwright-ом при viewport 390×844, `deviceScaleFactor: 3`, и положить PNG/WebM
   в `public/screens/`.
3. В `src/screens/*` подменить соответствующий компонент на `<Img src={staticFile('screens/…png')}/>`
   или `<OffthreadVideo/>` — пропсы анимации (tap, highlight) остаются.

## 6. Проверка качества (что сделано)

* `ffprobe`: 1080×1920, 30 fps, h264 yuv420p, aac 48 kHz, длительности 38.6–43.0 с.
* `ffmpeg blackdetect` (d=0.3, pix_th=0.10): чёрных кадров нет.
* Контрольные кадры каждой сцены просмотрены (контактные листы, `scripts/stills.mjs`).
* Громкость: голос −16 LUFS (loudnorm), музыка приглушается до ~−30 dB во время речи.
* Субтитры генерируются из таймкодов того же аудио — рассинхрон исключён по построению;
  соответствие текста = `vo-scripts.json`.
* Сайт в роликах указан как `lovelink.my` (и реальные поддомены `view.lovelink.my`, `edit.lovelink.my`).

## 7. Что улучшить в следующей итерации

* Прослушать озвучку и при необходимости заменить голоса на нативные русские (нужно право
  `voices_write` на ключе ElevenLabs, чтобы добавить голос из библиотеки, например
  «Veronica», «Victoria», «Alexander»).
* Заменить генеративные «фото» (ArtPhoto) на лицензированные фото/видео клиентов.
* При наличии доступа к сайту — реальные записи экранов (п. 5).
* Проверить ролики на реальных устройствах в интерфейсах Reels/TikTok.
