/** Gift content used in the mock-ups. Shapes mirror FeelLink's gift `content` document. */
export type GiftContent = {
  heroVariant: 'sunset' | 'night' | 'rose' | 'garden' | 'gold' | 'ocean' | 'lavender' | 'peach';
  firstVariant: 'sunset' | 'night' | 'rose' | 'garden' | 'gold' | 'ocean' | 'lavender' | 'peach';
  secondVariant: 'sunset' | 'night' | 'rose' | 'garden' | 'gold' | 'ocean' | 'lavender' | 'peach';
  thirdVariant: 'sunset' | 'night' | 'rose' | 'garden' | 'gold' | 'ocean' | 'lavender' | 'peach';
  icon: string;
  title: string;
  words: string[];
  button: string;
  reactions: { emoji: string; text: string }[];
  center: { icon: string; text: string };
  caption: string;
  last: { firstText: string; emoji: string; thirdText: string };
};

/** Default FeelLink template copy (src/components/data.js in the viewer). */
export const loveGift: GiftContent = {
  heroVariant: 'night', firstVariant: 'sunset', secondVariant: 'rose', thirdVariant: 'lavender',
  icon: '💌',
  title: 'Почему мне нравится быть рядом с тобой',
  words: ['С тобой всегда весело', 'Ты заряжаешь энергией', 'Ты настоящая', 'С тобой легко быть собой', 'Ты делаешь день лучше'],
  button: '👆 Нажми — продолжим',
  reactions: [
    { emoji: '😊', text: 'Ты мне нравишься.' },
    { emoji: '😌', text: 'Мне с тобой легко.' },
    { emoji: '✨', text: 'С тобой всегда интересно.' },
    { emoji: '🤍', text: 'Ты правда особенная.' },
    { emoji: '🔥', text: 'Ты мне правда нравишься.' },
  ],
  center: { icon: '💫', text: 'С тобой всё ярче.' },
  caption: 'Нажми на эмоцию — и моя любовь ответит 🤍',
  last: { firstText: 'И это только', emoji: '🤍', thirdText: 'начало нашей истории.' },
};

/** The "Для мамы" gift from VIDEO-004 (Aidana's story). */
export const momGift: GiftContent = {
  heroVariant: 'peach', firstVariant: 'garden', secondVariant: 'gold', thirdVariant: 'rose',
  icon: '🌸',
  title: 'Мама, спасибо вам за всё',
  words: ['За терпение', 'За поддержку в любой день', 'За тёплые ужины', 'За веру в меня', 'За всё, что не сказать словами'],
  button: '👆 Нажми — продолжим',
  reactions: [
    { emoji: '😊', text: 'Вы лучшая.' },
    { emoji: '🤗', text: 'Обнимаю крепко.' },
    { emoji: '✨', text: 'Горжусь вами.' },
    { emoji: '🤍', text: 'Люблю вас.' },
    { emoji: '🌸', text: 'С днём рождения!' },
  ],
  center: { icon: '💐', text: 'Вы — моё всё.' },
  caption: 'Нажми на эмоцию — и я отвечу 🤍',
  last: { firstText: 'С днём рождения,', emoji: '🤍', thirdText: 'мама.' },
};

export const TEMPLATES = [
  { title: '💖 История нашей любви', badge: 'Для девушки', variant: 'sunset' as const, seed: 11 },
  { title: '🌸 Для мамы', badge: 'Для мамы', variant: 'peach' as const, seed: 12 },
  { title: '🌙 Наша ночь', badge: 'Для жены', variant: 'night' as const, seed: 13 },
  { title: '💌 Любовное письмо', badge: 'Для парня', variant: 'lavender' as const, seed: 14 },
  { title: '🎉 С днём рождения, друг', badge: 'Для друга', variant: 'ocean' as const, seed: 15 },
  { title: '🤍 Спасибо, что вы с нами', badge: 'Для клиента', variant: 'gold' as const, seed: 16 },
  { title: '🍎 Любимому учителю', badge: 'Для учителя', variant: 'garden' as const, seed: 17 },
  { title: '🌷 Для тебя', badge: 'Для девушки', variant: 'rose' as const, seed: 18 },
];

export const FOR_WHOM_CHIPS = ['Все', 'Девушка', 'Парень', 'Мама', 'Папа', 'Друг', 'Жена', 'Муж', 'Клиент', 'Учитель', 'Другое'];

export const QR_STYLES = [
  { key: 'qr-01-bg', label: 'Классика с фоном' },
  { key: 'qr-02-bg', label: 'Морской с фоном' },
  { key: 'qr-05-bg', label: 'Алый с фоном' },
  { key: 'qr-08-bg', label: 'Изумрудный с фоном' },
  { key: 'qr-13-bg', label: 'Graphite Orange с фоном' },
];

export const DEMO_GIFT = { code: '482913', editCode: 'A7KQ2M', url: 'view.lovelink.my/g/8f3a2c1e', title: '🌸 Для мамы', date: '4 ноября 2026' };

/** Gift for a friend (VIDEO-010). */
export const friendGift: GiftContent = {
  heroVariant: 'ocean', firstVariant: 'ocean', secondVariant: 'gold', thirdVariant: 'garden',
  icon: '🎉', title: 'С днём рождения, Дан!',
  words: ['За то, что всегда рядом', 'За наши поездки', 'За честность', 'За смех до слёз', 'За десять лет дружбы'],
  button: '👆 Нажми — продолжим',
  reactions: [{ emoji: '😎', text: 'Ты лучший.' }, { emoji: '🔥', text: 'Жжёшь!' }, { emoji: '🤝', text: 'Всегда вместе.' }, { emoji: '🎂', text: 'С днём рождения!' }, { emoji: '🙌', text: 'Горжусь.' }],
  center: { icon: '🎁', text: 'Это тебе.' }, caption: 'Нажми на эмоцию — и я отвечу',
  last: { firstText: 'Дружба —', emoji: '🤝', thirdText: 'это навсегда.' },
};

/** Gift from a business to a client (VIDEO-010, VIDEO-008). */
export const clientGift: GiftContent = {
  heroVariant: 'gold', firstVariant: 'lavender', secondVariant: 'rose', thirdVariant: 'gold',
  icon: '🤍', title: 'Спасибо, что вы с нами',
  words: ['За доверие', 'За тёплые отзывы', 'За то, что возвращаетесь', 'За рекомендации друзьям', 'За целый год вместе'],
  button: '👆 Нажми — продолжим',
  reactions: [{ emoji: '😊', text: 'Вы — наш любимый клиент.' }, { emoji: '✨', text: 'Спасибо!' }, { emoji: '💐', text: 'Ждём вас снова.' }, { emoji: '🤍', text: 'С любовью, команда.' }, { emoji: '🎁', text: 'Сюрприз внутри.' }],
  center: { icon: '💐', text: 'Благодарим вас.' }, caption: 'Нажми на эмоцию 🤍',
  last: { firstText: 'Спасибо,', emoji: '🤍', thirdText: 'что выбираете нас.' },
};

/** Anniversary gift for a wife (VIDEO-006). */
export const wifeGift: GiftContent = {
  heroVariant: 'sunset', firstVariant: 'peach', secondVariant: 'rose', thirdVariant: 'lavender',
  icon: '💌', title: 'Семь лет — и я всё так же влюблён',
  words: ['В твой смех по утрам', 'В то, как ты держишь мою руку', 'В наши разговоры до ночи', 'В твоё терпение', 'В тебя — целиком'],
  button: '👆 Нажми — продолжим',
  reactions: [{ emoji: '😊', text: 'Ты моя любимая.' }, { emoji: '😌', text: 'С тобой спокойно.' }, { emoji: '✨', text: 'Ты — моё чудо.' }, { emoji: '🤍', text: 'Люблю тебя.' }, { emoji: '🌹', text: 'С годовщиной!' }],
  center: { icon: '💍', text: 'Навсегда.' }, caption: 'Нажми на эмоцию — и я отвечу 🤍',
  last: { firstText: 'Семь лет.', emoji: '🤍', thirdText: 'И это только начало.' },
};
