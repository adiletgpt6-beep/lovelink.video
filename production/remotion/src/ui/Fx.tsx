import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { rng } from '../lib/anim';

/** Twinkling stars (mirrors .star on the password page). */
export const Stars: React.FC<{ count?: number; seed?: number; color?: string }> = ({ count = 70, seed = 101, color = 'rgba(255,255,255,0.92)' }) => {
  const frame = useCurrentFrame();
  const stars = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => ({ id: i, x: r() * 100, y: r() * 100, size: 1.5 + r() * 3.5, delay: r() * 120, dur: 70 + r() * 80, op: 0.3 + r() * 0.7 }));
  }, [count, seed]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {stars.map((s) => {
        const t = ((frame + s.delay) % s.dur) / s.dur;
        const tw = 0.1 + 0.75 * (0.5 - 0.5 * Math.cos(t * Math.PI * 2));
        return <span key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: 999, background: color, opacity: s.op * tw, boxShadow: '0 0 12px rgba(255,255,255,0.25)', transform: `scale(${0.9 + tw * 0.2})` }} />;
      })}
    </AbsoluteFill>
  );
};

export const Confetti: React.FC<{ start: number; count?: number; seed?: number; duration?: number }> = ({ start, count = 70, seed = 202, duration = 110 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const pieces = useMemo(() => {
    const r = rng(seed);
    const colors = ['#F84888', '#7850F0', '#FFD166', '#34d399', '#60a5fa', '#ffffff', '#fb7185'];
    return Array.from({ length: count }, (_, i) => ({ id: i, x: r() * 100, y0: -10 - r() * 30, w: 8 + r() * 10, h: 12 + r() * 16, r: r() * 360, spin: (r() - 0.5) * 900, speed: 0.8 + r() * 0.9, drift: (r() - 0.5) * 120, delay: r() * 20, bg: colors[Math.floor(r() * colors.length)], round: r() > 0.6 }));
  }, [count, seed]);
  const t = frame - start;
  if (t < 0 || t > duration) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {pieces.map((p) => {
        const lt = Math.max(0, t - p.delay);
        const prog = lt / duration;
        const y = p.y0 + prog * p.speed * (height * 0.0012) * 100;
        const x = p.x + Math.sin(lt / 12 + p.id) * 2 + prog * (p.drift / 10);
        const op = prog < 0.75 ? 1 : 1 - (prog - 0.75) / 0.25;
        return <span key={p.id} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: p.w, height: p.h, borderRadius: p.round ? 999 : 3, background: p.bg, opacity: op, transform: `rotate(${p.r + lt * (p.spin / 60)}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};

const HeartPath = 'M12 21s-7.5-4.6-9.7-9.2C.6 8.3 2.5 4.5 6.1 4.1c2-.2 3.7.8 4.6 2.2.9-1.4 2.6-2.4 4.6-2.2 3.6.4 5.5 4.2 3.8 7.7C19.5 16.4 12 21 12 21z';

export const Heart: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({ size = 24, color = '#F84888', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}><path d={HeartPath} fill={color} /></svg>
);

/** Soft hearts drifting upward. */
export const FloatingHearts: React.FC<{ count?: number; seed?: number; start?: number; colors?: string[]; area?: { x: number; w: number } }> = ({ count = 14, seed = 303, start = 0, colors = ['#F84888', '#FDA4C4', '#C4B5FD', '#ffffff'], area = { x: 0, w: 100 } }) => {
  const frame = useCurrentFrame();
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => ({ id: i, x: area.x + r() * area.w, delay: r() * 160, dur: 150 + r() * 120, size: 14 + r() * 30, sway: 10 + r() * 30, color: colors[Math.floor(r() * colors.length)] }));
  }, [count, seed, colors, area.x, area.w]);
  const t = frame - start;
  if (t < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((h) => {
        const lt = (t + h.delay) % h.dur;
        const p = lt / h.dur;
        const y = 105 - p * 115;
        const op = p < 0.1 ? p / 0.1 : p > 0.8 ? (1 - p) / 0.2 : 1;
        return <Heart key={h.id} size={h.size} color={h.color} style={{ position: 'absolute', left: `calc(${h.x}% + ${Math.sin(lt / 20) * h.sway}px)`, top: `${y}%`, opacity: op * 0.85 }} />;
      })}
    </AbsoluteFill>
  );
};

/** Drifting blurred light circles (bokeh). */
export const Bokeh: React.FC<{ count?: number; seed?: number; colors?: string[]; blur?: number; opacity?: number }> = ({ count = 14, seed = 404, colors = ['#F84888', '#7850F0', '#ffffff'], blur = 14, opacity = 0.35 }) => {
  const frame = useCurrentFrame();
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => ({ id: i, x: r() * 100, y: r() * 100, size: 40 + r() * 160, speed: 0.2 + r() * 0.6, phase: r() * 6.28, color: colors[Math.floor(r() * colors.length)] }));
  }, [count, seed, colors]);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((b) => (
        <div key={b.id} style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, marginLeft: -b.size / 2, marginTop: -b.size / 2, borderRadius: '50%', background: `radial-gradient(circle closest-side, ${b.color} 0%, ${b.color} ${Math.max(10, 70 - blur * 3)}%, ${b.color}00 100%)`, opacity: opacity * (0.6 + 0.4 * Math.sin(frame / 40 * b.speed + b.phase)), transform: `translate(${Math.sin(frame / 60 * b.speed + b.phase) * 30}px, ${Math.cos(frame / 70 * b.speed + b.phase) * 30}px)` }} />
      ))}
    </AbsoluteFill>
  );
};

/** Diagonal light sweep, like .lightSweep on the password page. */
export const LightSweep: React.FC<{ period?: number; start?: number; width?: string; opacity?: number }> = ({ period = 150, start = 0, width = '45%', opacity = 1 }) => {
  const frame = useCurrentFrame();
  const t = ((frame - start) % period) / period;
  if (frame < start) return null;
  const x = -120 + t * 340;
  return <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}><div style={{ position: 'absolute', top: '-30%', left: `${x}%`, width, height: '160%', transform: 'skewX(-18deg)', background: 'linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.14) 45%, transparent 85%)', opacity: opacity * (t < 0.4 ? 1 : Math.max(0, 1 - (t - 0.4) / 0.2)) }} /></AbsoluteFill>;
};

/** Emoji particle burst (the Four card reaction effect). */
export const EmojiBurst: React.FC<{ start: number; x: number; y: number; seed?: number; count?: number; chars?: string[] }> = ({ start, x, y, seed = 505, count = 12, chars = ['✨', '💫', '🤍', '💖', '❤️'] }) => {
  const frame = useCurrentFrame();
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => { const a = r() * Math.PI * 2; const d = 60 + r() * 120; return { id: i, ch: chars[Math.floor(r() * chars.length)], dx: Math.cos(a) * d, dy: Math.sin(a) * d, s: 18 + r() * 18, rot: (r() - 0.5) * 70 }; });
  }, [count, seed, chars]);
  const t = (frame - start) / 27;
  if (t < 0 || t > 1) return null;
  const e = 1 - Math.pow(1 - t, 3);
  return <>{items.map((p) => <span key={p.id} style={{ position: 'absolute', left: x, top: y, fontSize: p.s, transform: `translate(-50%,-50%) translate(${p.dx * e}px, ${p.dy * e}px) rotate(${p.rot * e}deg) scale(${0.75 + 0.35 * e})`, opacity: t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88 }}>{p.ch}</span>)}</>;
};
