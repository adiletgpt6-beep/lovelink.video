import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { font } from '../lib/theme';
import { easeOut, prog } from '../lib/anim';

type BigTextProps = {
  text: string;
  /** Frame (local) when the first word appears. */
  start?: number;
  /** Frames between words. */
  stagger?: number;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  weight?: number;
  italic?: boolean;
  align?: 'left' | 'center';
  lineHeight?: number;
  style?: React.CSSProperties;
  accentWords?: string[];
  accentColor?: string;
  /** Per-word reveal style. */
  reveal?: 'blur' | 'up' | 'pop' | 'none';
  letterSpacing?: number;
  uppercase?: boolean;
  maxWidth?: number;
  /** Explicit per-word start frames (overrides start/stagger). */
  starts?: number[];
};

/** Headline with per-word reveal (blur/up/pop). */
export const BigText: React.FC<BigTextProps> = ({ text, start = 0, stagger = 4, fontFamily = font.display, fontSize = 92, color = '#fff', weight = 600, italic = false, align = 'center', lineHeight = 1.12, style, accentWords = [], accentColor = '#F84888', reveal = 'blur', letterSpacing = -1.5, uppercase = false, maxWidth, starts }) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{ fontFamily, fontSize, color, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', textAlign: align, lineHeight, letterSpacing, textTransform: uppercase ? 'uppercase' : 'none', display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: '0 0.26em', maxWidth, ...style }}>
      {words.map((w, i) => {
        const p = prog(frame, starts ? (starts[i] ?? starts[starts.length - 1]) : start + i * stagger, 14, easeOut);
        const clean = w.replace(/[^\p{L}\p{N}]/gu, '');
        const isAccent = accentWords.includes(clean);
        const t: React.CSSProperties =
          reveal === 'blur' ? { opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 12}px)` }
          : reveal === 'up' ? { opacity: p, transform: `translateY(${(1 - p) * 40}px)` }
          : reveal === 'pop' ? { opacity: p, transform: `scale(${0.7 + 0.3 * p})` }
          : {};
        return <span key={i} style={{ display: 'inline-block', color: isAccent ? accentColor : undefined, whiteSpace: 'pre', ...t }}>{w}</span>;
      })}
    </div>
  );
};

/** Small step / section label chip ("Шаг 1 · Выбираем шаблон"). */
export const StepBadge: React.FC<{ text: string; start?: number; dark?: boolean; style?: React.CSSProperties; color?: string }> = ({ text, start = 0, dark = false, style, color }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, start, 14);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 999, background: dark ? 'rgba(10,10,14,0.72)' : 'rgba(255,255,255,0.88)', color: color ?? (dark ? '#fff' : '#0a0a0a'), fontFamily: font.caption, fontWeight: 700, fontSize: 34, letterSpacing: -0.3, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', backdropFilter: 'blur(12px)', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, ...style }}>
      <span style={{ width: 12, height: 12, borderRadius: 999, background: 'linear-gradient(90deg,#F84888,#7850F0)' }} />
      {text}
    </div>
  );
};

/** Finger-tap indicator (expanding ring) in local screen coordinates. */
export const Tap: React.FC<{ x: number; y: number; start: number; color?: string; size?: number }> = ({ x, y, start, color = 'rgba(120,80,240,0.55)', size = 44 }) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / 16;
  if (t < 0 || t > 1) return null;
  return (
    <>
      <span style={{ position: 'absolute', left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, borderRadius: '50%', background: color, opacity: 1 - t, transform: `scale(${0.6 + t * 1.8})`, zIndex: 999 }} />
      <span style={{ position: 'absolute', left: x, top: y, width: size * 0.6, height: size * 0.6, marginLeft: -size * 0.3, marginTop: -size * 0.3, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', opacity: t < 0.5 ? 1 : 1 - (t - 0.5) * 2, transform: `scale(${t < 0.3 ? 1 - t : 0.7})`, zIndex: 999, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }} />
    </>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; start?: number; dark?: boolean; style?: React.CSSProperties; fontSize?: number }> = ({ children, start = 0, dark, style, fontSize = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = prog(frame, start, Math.round(fps * 0.4));
  return <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 26px', borderRadius: 999, fontFamily: font.caption, fontWeight: 700, fontSize, background: dark ? 'rgba(255,255,255,0.1)' : '#fff', color: dark ? '#fff' : '#0a0a0a', border: dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', opacity: p, transform: `translateY(${(1 - p) * 18}px) scale(${0.9 + 0.1 * p})`, ...style }}>{children}</div>;
};

/** Numbered section header for VIDEO-003 ("01 / Шаблоны"). */
export const SectionNumber: React.FC<{ n: string; title: string; start?: number; color?: string; dark?: boolean; numberColor?: string }> = ({ n, title, start = 0, color = '#fff', dark, numberColor }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, start, 12);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <span style={{ fontFamily: font.bold, fontWeight: 900, fontSize: 120, color: numberColor ?? (dark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.35)'), lineHeight: 1 }}>{n}</span>
      <span style={{ fontFamily: font.bold, fontWeight: 700, fontSize: 56, color, letterSpacing: -1 }}>{title}</span>
    </div>
  );
};
