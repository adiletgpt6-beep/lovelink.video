import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { Env, StudioLights } from './Rose';
import { Bouquet } from './Bouquet';
import { GiftBox, Chocolate, Teddy, Pendant } from './Gifts';
import { PetalRain, Sparkles } from './Petals';

export const GiftTest: React.FC<{ what: 'bouquet' | 'gifts' | 'petals' }> = ({ what }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = f / 30;
  return (
    <AbsoluteFill style={{ background: '#140717' }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 2.4, 8.5], fov: 34, near: 0.1, far: 60 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1, outputColorSpace: THREE.SRGBColorSpace }} style={{ width, height }}>
        <color attach="background" args={['#140717']} />
        <Env intensity={1} />
        <StudioLights />
        {what === 'bouquet' && <group rotation={[0.3, t * 0.25, 0]} position={[0, -0.4, 0]}><Bouquet bloom={0.9} scale={1.15} /></group>}
        {what === 'gifts' && (
          <group rotation={[0.25, t * 0.2, 0]} position={[0, -1.2, 0]}>
            <GiftBox position={[-2.2, 0, 0]} scale={1.1} lidOpen={0.3} />
            <Chocolate position={[1.6, 0, 1.2]} rotation={[0, -0.5, 0]} />
            <Teddy position={[2.3, 0, -1.2]} scale={0.8} rotation={[0, -0.6, 0]} />
            <Pendant position={[-0.6, 0, 2.2]} rotation={[0, 0.3, 0]} />
          </group>
        )}
        {what === 'petals' && <><PetalRain t={t} count={140} /><Sparkles t={t} /></>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
