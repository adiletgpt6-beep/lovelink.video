import React from 'react';
import { Img, staticFile } from 'remotion';
import { font } from '../lib/theme';

export const CARD_W = 600;
export const CARD_H = 400;

type Props = {
  /** 0..1 — how many code cells are revealed (digits typed in / printed) */
  digits?: string;
  revealed?: number;
  variant?: 'ivory' | 'blush' | 'night';
  /** Tilt in degrees for the 2.5D look */
  rotX?: number;
  rotY?: number;
  scale?: number;
  glow?: number;
  style?: React.CSSProperties;
  /** Position of a moving light sweep 0..1 (undefined = none) */
  sweep?: number;
  recipient?: string;
  showCode?: boolean;
};

/**
 * Physical LoveLink postcard: real scannable QR (https://password.lovelink.my — the address the
 * product's own QR assets encode) + SIX code cells + a gentle paper/foil look.
 * 600×400 logical px, 3:2 like a printed card.
 */
export const Postcard: React.FC<Props> = ({ digits = '482913', revealed = 0, variant = 'ivory', rotX = 0, rotY = 0, scale = 1, glow = 0, style, sweep, recipient = 'Для тебя', showCode = true }) => {
  const palette = {
    ivory: { paper: 'linear-gradient(160deg,#fffaf5 0%,#fff2ea 55%,#ffe9e2 100%)', ink: '#2a1a24', accent: '#F84888', soft: '#9b7f8d', cell: '#fff', cellBorder: 'rgba(248,72,136,0.35)' },
    blush: { paper: 'linear-gradient(160deg,#ffe9f1 0%,#ffd6e6 55%,#f9c3dc 100%)', ink: '#3a1430', accent: '#7850F0', soft: '#a56f8c', cell: '#fff8fb', cellBorder: 'rgba(120,80,240,0.35)' },
    night: { paper: 'linear-gradient(160deg,#1c1230 0%,#120a24 55%,#0b0618 100%)', ink: '#fff', accent: '#FDA4C4', soft: 'rgba(255,255,255,0.6)', cell: 'rgba(255,255,255,0.08)', cellBorder: 'rgba(253,164,196,0.5)' },
  }[variant];
  const cells = digits.split('');
  return (
    <div style={{ width: CARD_W, height: CARD_H, position: 'relative', transform: `perspective(1600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`, transformStyle: 'preserve-3d', ...style }}>
      {/* shadow */}
      <div style={{ position: 'absolute', left: 20, right: 20, top: 30, bottom: -18, borderRadius: 28, background: 'rgba(0,0,0,0.45)', filter: 'none', boxShadow: '0 30px 34px rgba(0,0,0,0.35)', opacity: 0.8 }} />
      {/* paper */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: palette.paper, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.05), 0 0 ${40 * glow}px rgba(248,72,136,${0.5 * glow})`, overflow: 'hidden' }}>
        {/* paper grain + foil corner */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('brand/noise.png')})`, backgroundSize: '200px 200px', opacity: variant === 'night' ? 0.12 : 0.18 }} />
        <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(248,72,136,0.22) 0%, rgba(120,80,240,0.12) 45%, rgba(255,255,255,0) 70%)' }} />
        <div style={{ position: 'absolute', left: -60, bottom: -90, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,80,240,0.16) 0%, rgba(255,255,255,0) 70%)' }} />
        {sweep !== undefined && <div style={{ position: 'absolute', top: -40, bottom: -40, width: 160, left: `${-30 + sweep * 140}%`, transform: 'skewX(-20deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)', opacity: 0.7 }} />}
        {/* header */}
        <div style={{ position: 'absolute', left: 34, top: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Img src={staticFile('brand/logo.png')} style={{ height: 34, width: 'auto', filter: variant === 'night' ? 'brightness(1.1)' : undefined }} />
        </div>
        <div style={{ position: 'absolute', right: 34, top: 30, fontFamily: font.display, fontStyle: 'italic', fontSize: 30, color: palette.accent }}>{recipient} 🤍</div>
        {/* QR */}
        <div style={{ position: 'absolute', left: 34, top: 86, width: 190, height: 190, borderRadius: 18, background: '#fff', padding: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
          <Img src={staticFile('brand/qr-password.png')} style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }} />
        </div>
        <div style={{ position: 'absolute', left: 36, top: 286, fontFamily: font.caption, fontSize: 15, color: palette.soft, letterSpacing: 0.5 }}>1 · Отсканируй QR-код</div>
        {/* code cells */}
        <div style={{ position: 'absolute', left: 250, top: 100, right: 34 }}>
          <div style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase', color: palette.soft }}>Секретный код</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {cells.map((d, i) => {
              const on = showCode && revealed * 6 > i + 0.01;
              return <div key={i} style={{ width: 44, height: 58, borderRadius: 12, background: palette.cell, border: `1.5px solid ${palette.cellBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.bold, fontWeight: 700, fontSize: 30, color: palette.ink, boxShadow: on ? `0 0 0 2px ${palette.accent}33` : undefined, transform: on ? 'translateY(-2px)' : undefined }}>{on ? d : ''}</div>;
            })}
          </div>
          <div style={{ marginTop: 12, fontFamily: font.caption, fontSize: 15, color: palette.soft, letterSpacing: 0.5 }}>2 · Введи шесть цифр</div>
          <div style={{ marginTop: 26, fontFamily: font.display, fontStyle: 'italic', fontSize: 22, color: palette.ink, lineHeight: 1.25 }}>Внутри — послание,<br />созданное для тебя.</div>
        </div>
        <div style={{ position: 'absolute', right: 34, bottom: 22, fontFamily: font.caption, fontSize: 14, color: palette.soft }}>lovelink.my</div>
      </div>
    </div>
  );
};
