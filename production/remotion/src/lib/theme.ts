/** Brand tokens taken from the real LoveLink front-end (logo + Tailwind classes). */
export const brand = {
  pink: '#F84888',
  pinkDeep: '#E11D74',
  pinkSoft: '#FDA4C4',
  violet: '#7850F0',
  violetDeep: '#5B2BD9',
  violetSoft: '#C4B5FD',
  night: '#060715',
  ink: '#0A0A0A',
  neutral950: '#0a0a0a',
  neutral900: '#171717',
  neutral700: '#404040',
  neutral500: '#737373',
  neutral400: '#a3a3a3',
  rose400: '#fb7185',
  violet500: '#8b5cf6',
  emerald400: '#34d399',
  white: '#ffffff',
  pageLight: 'linear-gradient(180deg,#fff 0%,#fff7fb 100%)',
  gradient: 'linear-gradient(90deg,#F84888 0%,#7850F0 100%)',
  gradientSoft: 'linear-gradient(135deg,#FDA4C4 0%,#C4B5FD 100%)',
};

export const font = {
  ui: "Inter, 'Manrope', Arial, sans-serif",
  display: "'Playfair Display', Georgia, serif",
  bold: "'Unbounded', 'Manrope', sans-serif",
  caption: "'Manrope', Inter, sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
  mono: "'DejaVu Sans Mono', ui-monospace, monospace",
};

/** 9:16 canvas + safe zones for Reels / TikTok (text stays inside). */
export const canvas = { width: 1080, height: 1920, fps: 30 };
export const safe = { top: 220, bottom: 420, left: 72, right: 110 };
