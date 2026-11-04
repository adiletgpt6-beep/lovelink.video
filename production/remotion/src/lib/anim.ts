import { Easing, interpolate, spring } from 'remotion';

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** 0..1 progress between start and start+dur (frames), eased. */
export function prog(frame: number, start: number, dur: number, easing = easeOut) {
  return interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });
}

export function fade(frame: number, start: number, dur = 12) {
  return prog(frame, start, dur, Easing.linear);
}

/** Fade in at `start` and out at `end` (frames). */
export function window01(frame: number, start: number, end: number, inDur = 10, outDur = 10) {
  const i = prog(frame, start, inDur, Easing.linear);
  const o = 1 - prog(frame, end - outDur, outDur, Easing.linear);
  return Math.min(i, o);
}

export function springIn(frame: number, fps: number, delay = 0, config: { damping?: number; stiffness?: number; mass?: number } = {}) {
  return spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120, mass: 0.9, ...config } });
}

export function popIn(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
}

/** Deterministic PRNG (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Typewriter: characters visible at frame given chars-per-second. */
export function typed(text: string, frame: number, start: number, fps: number, cps = 18) {
  const n = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  return text.slice(0, Math.min(text.length, n));
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
