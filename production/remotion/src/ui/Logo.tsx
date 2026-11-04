import React from 'react';
import { Img, staticFile } from 'remotion';
import { font } from '../lib/theme';

/** The real LoveLink logo (public/logo/logo_without_bg.png from the front-end repo). */
export const Logo: React.FC<{ width?: number; style?: React.CSSProperties; white?: boolean }> = ({ width = 420, style, white }) => (
  <Img src={staticFile('brand/logo.png')} style={{ width, height: 'auto', display: 'block', filter: white ? 'brightness(0) invert(1)' : undefined, ...style }} />
);

/** Big "lovelink.my" domain lockup used on end cards and CTAs. */
export const Domain: React.FC<{ size?: number; color?: string; gradient?: boolean; style?: React.CSSProperties }> = ({ size = 84, color = '#fff', gradient = false, style }) => (
  <div
    style={{
      fontFamily: font.bold, fontWeight: 700, fontSize: size, letterSpacing: -1, lineHeight: 1, color,
      ...(gradient ? { background: 'linear-gradient(90deg,#F84888,#7850F0)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
      ...style,
    }}
  >
    lovelink.my
  </div>
);
