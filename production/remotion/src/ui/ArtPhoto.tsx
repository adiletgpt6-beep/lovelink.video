import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';

export type ArtVariant = 'sunset' | 'night' | 'rose' | 'garden' | 'gold' | 'ocean' | 'lavender' | 'peach';

type Props = { variant?: ArtVariant; seed?: number; style?: React.CSSProperties; animate?: boolean; children?: React.ReactNode; bokehCount?: number; zoom?: number };

/**
 * Generative "photo" stand-in (pre-rendered by scripts/art.py into public/art as JPEG so the
 * browser paints one bitmap per frame). Used wherever the real product would show a user's
 * photo — no third-party stock imagery is embedded. `seed` picks one of two renders and a
 * mirror direction, so neighbouring cards look different.
 */
export const ArtPhoto: React.FC<Props> = ({ variant = 'sunset', seed = 1, style, animate = false, children, zoom = 1 }) => {
  const frame = useCurrentFrame();
  const n = (seed % 2) + 1;
  const flip = Math.floor(seed / 2) % 2 === 1 ? -1 : 1;
  const z = zoom + (animate ? frame * 0.0004 : 0);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#111', ...style }}>
      <Img src={staticFile(`art/${variant}-${n}.jpg`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z * flip}, ${z})` }} />
      {children}
    </div>
  );
};
