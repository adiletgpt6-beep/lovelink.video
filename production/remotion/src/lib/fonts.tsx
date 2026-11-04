import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

/** @font-face rules for the brand fonts (OFL, served from /public/fonts via staticFile). */
const FONT_FACE_CSS = `
@font-face { font-family: 'Playfair Display'; font-weight: 400; font-style: normal; src: url('${staticFile('fonts/PlayfairDisplay-400-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Playfair Display'; font-weight: 400; font-style: normal; src: url('${staticFile('fonts/PlayfairDisplay-400-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Playfair Display'; font-weight: 400; font-style: italic; src: url('${staticFile('fonts/PlayfairDisplay-400-italic-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Playfair Display'; font-weight: 400; font-style: italic; src: url('${staticFile('fonts/PlayfairDisplay-400-italic-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Playfair Display'; font-weight: 600; font-style: normal; src: url('${staticFile('fonts/PlayfairDisplay-600-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Playfair Display'; font-weight: 600; font-style: normal; src: url('${staticFile('fonts/PlayfairDisplay-600-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Playfair Display'; font-weight: 700; font-style: normal; src: url('${staticFile('fonts/PlayfairDisplay-700-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Playfair Display'; font-weight: 700; font-style: normal; src: url('${staticFile('fonts/PlayfairDisplay-700-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Unbounded'; font-weight: 500; src: url('${staticFile('fonts/Unbounded-500-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Unbounded'; font-weight: 500; src: url('${staticFile('fonts/Unbounded-500-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Unbounded'; font-weight: 700; src: url('${staticFile('fonts/Unbounded-700-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Unbounded'; font-weight: 700; src: url('${staticFile('fonts/Unbounded-700-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Unbounded'; font-weight: 900; src: url('${staticFile('fonts/Unbounded-900-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Unbounded'; font-weight: 900; src: url('${staticFile('fonts/Unbounded-900-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Manrope'; font-weight: 400; src: url('${staticFile('fonts/Manrope-400-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Manrope'; font-weight: 400; src: url('${staticFile('fonts/Manrope-400-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Manrope'; font-weight: 500; src: url('${staticFile('fonts/Manrope-500-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Manrope'; font-weight: 500; src: url('${staticFile('fonts/Manrope-500-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Manrope'; font-weight: 600; src: url('${staticFile('fonts/Manrope-600-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Manrope'; font-weight: 600; src: url('${staticFile('fonts/Manrope-600-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Manrope'; font-weight: 700; src: url('${staticFile('fonts/Manrope-700-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Manrope'; font-weight: 700; src: url('${staticFile('fonts/Manrope-700-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Manrope'; font-weight: 800; src: url('${staticFile('fonts/Manrope-800-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Manrope'; font-weight: 800; src: url('${staticFile('fonts/Manrope-800-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Cormorant Garamond'; font-weight: 500; font-style: normal; src: url('${staticFile('fonts/CormorantGaramond-500-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Cormorant Garamond'; font-weight: 500; font-style: normal; src: url('${staticFile('fonts/CormorantGaramond-500-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Cormorant Garamond'; font-weight: 500; font-style: italic; src: url('${staticFile('fonts/CormorantGaramond-500-italic-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Cormorant Garamond'; font-weight: 500; font-style: italic; src: url('${staticFile('fonts/CormorantGaramond-500-italic-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'Cormorant Garamond'; font-weight: 600; font-style: normal; src: url('${staticFile('fonts/CormorantGaramond-600-normal-cyrillic.woff2')}') format('woff2'); unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
@font-face { font-family: 'Cormorant Garamond'; font-weight: 600; font-style: normal; src: url('${staticFile('fonts/CormorantGaramond-600-normal-latin.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
`;

let injected = false;
function injectFontFaces() {
  if (injected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-ll-fonts', '1');
  style.textContent = FONT_FACE_CSS;
  document.head.appendChild(style);
  injected = true;
}

const PROBES = [
  "700 20px 'Playfair Display'", "400 20px 'Playfair Display'", "italic 400 20px 'Playfair Display'", "600 20px 'Playfair Display'",
  "500 20px 'Unbounded'", "700 20px 'Unbounded'", "900 20px 'Unbounded'",
  "400 20px 'Manrope'", "500 20px 'Manrope'", "600 20px 'Manrope'", "700 20px 'Manrope'", "800 20px 'Manrope'",
  "500 20px 'Cormorant Garamond'", "italic 500 20px 'Cormorant Garamond'", "600 20px 'Cormorant Garamond'",
];
const SAMPLE = 'Аа Яя Ёё Aa Zz 0123 — «»';

/** Blocks rendering until every brand font (Cyrillic + Latin subsets) is loaded. */
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    injectFontFaces();
    const handle = delayRender('Loading brand fonts');
    let cancelled = false;
    (async () => {
      try {
        await Promise.all(PROBES.map((p) => document.fonts.load(p, SAMPLE)));
        await document.fonts.ready;
      } catch (e) {
        console.warn('font load issue', e);
      }
      if (!cancelled) {
        setReady(true);
        continueRender(handle);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return ready;
};
