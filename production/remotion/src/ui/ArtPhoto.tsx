import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { rng } from '../lib/anim';

export type ArtVariant = 'sunset' | 'night' | 'rose' | 'garden' | 'gold' | 'ocean' | 'lavender' | 'peach';

const PALETTES: Record<ArtVariant, { base: string; glows: string[]; bokeh: string[] }> = {
  sunset: { base: 'linear-gradient(180deg,#3b1d4e 0%,#b14a6a 45%,#f0a06a 100%)', glows: ['rgba(255,170,120,0.8)', 'rgba(255,90,140,0.5)'], bokeh: ['#ffd9b0', '#ff9ab8', '#ffffff'] },
  night: { base: 'linear-gradient(180deg,#05061a 0%,#141a4a 55%,#2a2f7a 100%)', glows: ['rgba(120,140,255,0.55)', 'rgba(200,180,255,0.35)'], bokeh: ['#c7d2ff', '#ffffff', '#9fb4ff'] },
  rose: { base: 'linear-gradient(160deg,#ffe4ef 0%,#f9a8d4 50%,#c084fc 100%)', glows: ['rgba(255,255,255,0.7)', 'rgba(248,72,136,0.35)'], bokeh: ['#ffffff', '#fecdd3', '#e9d5ff'] },
  garden: { base: 'linear-gradient(180deg,#eaf7d9 0%,#9fd3a3 50%,#4b8b6a 100%)', glows: ['rgba(255,255,220,0.8)', 'rgba(255,200,120,0.4)'], bokeh: ['#ffffff', '#fef3c7', '#fda4af'] },
  gold: { base: 'linear-gradient(170deg,#2a1b0a 0%,#8a5a1f 50%,#f2c77d 100%)', glows: ['rgba(255,220,150,0.75)', 'rgba(255,255,255,0.3)'], bokeh: ['#ffe9b0', '#ffffff', '#ffd27a'] },
  ocean: { base: 'linear-gradient(180deg,#8ad7f0 0%,#2f8fc9 55%,#123f6b 100%)', glows: ['rgba(255,255,255,0.75)', 'rgba(170,230,255,0.4)'], bokeh: ['#ffffff', '#c8f0ff', '#ffe29a'] },
  lavender: { base: 'linear-gradient(160deg,#f5f0ff 0%,#c4b5fd 50%,#7850F0 100%)', glows: ['rgba(255,255,255,0.75)', 'rgba(248,72,136,0.25)'], bokeh: ['#ffffff', '#fbcfe8', '#ddd6fe'] },
  peach: { base: 'linear-gradient(160deg,#fff1e6 0%,#ffb59a 50%,#f26b8a 100%)', glows: ['rgba(255,255,255,0.8)', 'rgba(248,72,136,0.3)'], bokeh: ['#ffffff', '#ffe4d6', '#fecdd3'] },
};

type Props = { variant?: ArtVariant; seed?: number; style?: React.CSSProperties; animate?: boolean; children?: React.ReactNode; bokehCount?: number; zoom?: number };

/**
 * Generative "photo" stand-in: gradient scene + light leaks + bokeh + grain.
 * Used wherever the real product would show a user's photo (we own no licensed
 * stock imagery, so nothing third-party is embedded).
 */
export const ArtPhoto: React.FC<Props> = ({ variant = 'sunset', seed = 1, style, animate = true, children, bokehCount = 16, zoom = 1 }) => {
  const frame = useCurrentFrame();
  const p = PALETTES[variant];
  const items = useMemo(() => {
    const r = rng(seed * 97 + 13);
    return Array.from({ length: bokehCount }, (_, i) => ({ id: i, x: r() * 100, y: r() * 100, s: 6 + r() * 22, blur: r() * 6, op: 0.25 + r() * 0.55, c: p.bokeh[Math.floor(r() * p.bokeh.length)], ph: r() * 6.28, sp: 0.3 + r() * 0.7 }));
  }, [seed, bokehCount, p.bokeh]);
  const t = animate ? frame : 0;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: p.base, ...style }}>
      <div style={{ position: 'absolute', inset: '-10%', transform: `scale(${zoom + (animate ? frame * 0.00025 : 0)})` }}>
        <div style={{ position: 'absolute', left: '15%', top: '12%', width: '60%', height: '45%', borderRadius: '50%', background: p.glows[0], filter: 'blur(60px)', transform: `translate(${Math.sin(t / 90) * 12}px, ${Math.cos(t / 110) * 10}px)` }} />
        <div style={{ position: 'absolute', right: '-10%', bottom: '5%', width: '70%', height: '50%', borderRadius: '50%', background: p.glows[1], filter: 'blur(70px)', transform: `translate(${Math.cos(t / 100) * 12}px, ${Math.sin(t / 120) * 10}px)` }} />
        {items.map((b) => (
          <div key={b.id} style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, width: `${b.s}%`, paddingTop: `${b.s}%`, marginLeft: `-${b.s / 2}%`, borderRadius: '50%', background: b.c, opacity: b.op * (0.75 + 0.25 * Math.sin(t / 50 * b.sp + b.ph)), filter: `blur(${b.blur}px)`, transform: `translate(${Math.sin(t / 80 * b.sp + b.ph) * 6}px, ${Math.cos(t / 90 * b.sp + b.ph) * 6}px)` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 100% at 50% 40%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08, mixBlendMode: 'overlay', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")" }} />
      {children}
    </div>
  );
};
