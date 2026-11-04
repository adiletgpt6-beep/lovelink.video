import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { LAYERS } from '../three/Layers';
import ready from '../lib/layers-ready.json';

type Props = {
  /** Composition id rendered by scripts/render3d.mjs (folder public/3d/<id>) */
  id: string;
  /** Total frames available in the sequence (defaults to the layer definition) */
  frames?: number;
  /** Frame offset into the sequence at local frame 0 */
  offset?: number;
  /** Playback speed multiplier */
  speed?: number;
  style?: React.CSSProperties;
  opacity?: number;
};

/** Displays a pre-rendered transparent PNG sequence (3D layer) frame-accurately. */
export const Layer3D: React.FC<Props> = ({ id, frames, offset = 0, speed = 1, style, opacity = 1 }) => {
  const f = useCurrentFrame();
  const total = frames ?? LAYERS.find((l) => l.id === id)?.frames ?? 1;
  const n = Math.max(0, Math.min(total - 1, Math.round(offset + f * speed)));
  const name = String(n).padStart(String(total - 1).length, '0'); // Remotion zero-pads sequence frames
  // A layer whose sequence has not been rendered yet is skipped (run scripts/render3d.mjs + layers-ready.mjs)
  if (!(ready.ready as string[]).includes(id)) return null;
  // onError: a missing sequence (not rendered yet) must not abort the render
  return <Img src={staticFile(`3d/${id}/element-${name}.png`)} onError={() => undefined} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, ...style }} />;
};
