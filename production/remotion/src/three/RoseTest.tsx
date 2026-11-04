import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { Env, Rose, StudioLights } from './Rose';

export const RoseTest: React.FC<{ transparent?: boolean }> = ({ transparent = false }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const bloom = Math.min(1, f / 80);
  return (
    <AbsoluteFill style={{ background: transparent ? 'transparent' : 'radial-gradient(circle at 50% 35%, #2a0b1c 0%, #0b0410 70%)' }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 2.0, 5.2], fov: 34, near: 0.1, far: 50 }} gl={{ antialias: true, alpha: transparent, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15, outputColorSpace: THREE.SRGBColorSpace }} style={{ width, height }}>
        {!transparent && <color attach="background" args={['#130616']} />}
        <Env intensity={1.0} />
        <StudioLights />
        <group rotation={[0.55, f * 0.008, 0]} position={[0, -0.2, 0]}>
          <Rose bloom={bloom} scale={1.5} stem={0} />
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
