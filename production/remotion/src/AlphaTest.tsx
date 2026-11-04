import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { BrandBg } from './ui/Backgrounds';

/** Checks that a VP9 alpha layer rendered by a 3D composition composites correctly. */
export const AlphaTest: React.FC = () => (
  <AbsoluteFill>
    <BrandBg />
    <OffthreadVideo src={staticFile('3d/test-alpha.webm')} transparent style={{ width: 1080, height: 1920 }} />
  </AbsoluteFill>
);
