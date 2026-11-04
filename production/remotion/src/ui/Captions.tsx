import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { Timeline, Word } from '../lib/timeline';
import { font } from '../lib/theme';

export type CaptionStyle = 'pill' | 'clean' | 'boxed' | 'serif';

type Chunk = { words: (Word & { abs: number; absEnd: number })[]; start: number; end: number };

function chunkScene(words: Word[], voStart: number, fps: number, maxWords: number, maxChars: number): Chunk[] {
  const chunks: Chunk[] = [];
  let cur: Chunk['words'] = [];
  let chars = 0;
  const flush = () => {
    if (!cur.length) return;
    chunks.push({ words: cur, start: cur[0].abs, end: cur[cur.length - 1].absEnd });
    cur = []; chars = 0;
  };
  for (const w of words) {
    const abs = voStart + w.start * fps;
    const absEnd = voStart + w.end * fps;
    const endsSentence = /[.!?…»]$/.test(w.text) || /[:;]$/.test(w.text);
    if (cur.length && (cur.length >= maxWords || chars + w.text.length > maxChars)) flush();
    cur.push({ ...w, abs, absEnd });
    chars += w.text.length + 1;
    if (endsSentence) flush();
  }
  flush();
  // extend each chunk's display until the next one starts (max 0.6 s)
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    const hold = next ? Math.min(next.start - 2, chunks[i].end + fps * 0.6) : chunks[i].end + fps * 0.6;
    chunks[i].end = Math.max(chunks[i].end + 3, hold);
    chunks[i].start -= 2;
  }
  return chunks;
}

type Props = {
  timeline: Timeline;
  variant?: CaptionStyle;
  /** Distance from the bottom of the canvas to the caption baseline block (px). Stays in the safe zone. */
  bottom?: number;
  accent?: string;
  color?: string;
  fontSize?: number;
  maxWords?: number;
  maxChars?: number;
  uppercase?: boolean;
  width?: number;
  /** Scene indexes whose words are shown as big on-screen typography instead of captions. */
  hideScenes?: number[];
  fontFamily?: string;
  fontWeight?: number;
};

/** Word-synchronised captions driven by the ElevenLabs character alignment. */
export const Captions: React.FC<Props> = ({ timeline, variant = 'pill', bottom = 470, accent = '#F84888', color = '#fff', fontSize = 52, maxWords = 4, maxChars = 26, uppercase = false, width = 900, hideScenes = [], fontFamily, fontWeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => timeline.scenes.filter((s) => !hideScenes.includes(s.index)).flatMap((s) => chunkScene(s.seg.words, s.voStart, fps, maxWords, maxChars)), [timeline, fps, maxWords, maxChars, hideScenes]);
  const chunk = chunks.find((c) => frame >= c.start && frame <= c.end);
  if (!chunk) return null;
  const appear = Math.min(1, (frame - chunk.start) / 5);
  const base: React.CSSProperties = {
    position: 'absolute', left: '50%', bottom, transform: `translateX(-50%) translateY(${(1 - appear) * 14}px)`, width, maxWidth: '86%',
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.28em', textAlign: 'center', opacity: appear,
    fontFamily: fontFamily ?? (variant === 'serif' ? font.display : font.caption), fontWeight: fontWeight ?? (variant === 'serif' ? 600 : 800), fontSize, lineHeight: 1.18, color, letterSpacing: variant === 'boxed' ? 0.5 : -0.5,
    textTransform: uppercase ? 'uppercase' : 'none',
  };
  const frameStyle: React.CSSProperties =
    variant === 'pill' ? { padding: '18px 34px', borderRadius: 28, background: 'rgba(8,8,16,0.62)', boxShadow: '0 12px 34px rgba(0,0,0,0.25)' }
    : variant === 'boxed' ? { padding: '14px 28px', borderRadius: 14, background: '#0a0a0a' }
    : { textShadow: '0 4px 24px rgba(0,0,0,0.65), 0 1px 2px rgba(0,0,0,0.7)' };
  return (
    <div style={{ ...base, ...frameStyle }}>
      {chunk.words.map((w, i) => {
        const active = frame >= w.abs - 1 && frame < w.absEnd + 2;
        const past = frame >= w.absEnd + 2;
        const k = active ? Math.min(1, (frame - w.abs + 1) / 4) : 0;
        return (
          <span key={i} style={{ display: 'inline-block', color: active ? accent : color, opacity: past || active ? 1 : 0.72, transform: `scale(${1 + 0.06 * k * (1 - k * 0.3)})`, transition: 'none', whiteSpace: 'pre' }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
