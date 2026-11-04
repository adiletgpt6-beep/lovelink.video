import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import * as THREE from 'three';
import { Env, Rose, StudioLights } from './Rose';
import { Bouquet } from './Bouquet';
import { PetalRain, Sparkles } from './Petals';
import { GiftBox, Chocolate, Teddy, Pendant } from './Gifts';

const ease = (x: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

/** Transparent 3D stage shared by all layer compositions (rendered to PNG sequences). */
const Stage: React.FC<{ cam: [number, number, number]; fov?: number; look?: [number, number, number]; light?: number; env?: number; children: React.ReactNode; exposure?: number }> = ({ cam: camIn, fov = 36, look = [0, 0, 0], light = 1, env = 1, children, exposure = 1.1 }) => {
  const { width, height } = useVideoConfig();
  // portrait 9:16 has a narrow horizontal field of view — push the camera back
  const cam: [number, number, number] = [camIn[0] * 1.6, look[1] + (camIn[1] - look[1]) * 1.6, camIn[2] * 1.6];
  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      <ThreeCanvas width={width} height={height} camera={{ position: cam, fov, near: 0.1, far: 80 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure, outputColorSpace: THREE.SRGBColorSpace }} style={{ width, height }} onCreated={({ camera }) => { camera.lookAt(new THREE.Vector3(...look)); }}>
        <CameraRig cam={cam} look={look} />
        <Env intensity={env} />
        <StudioLights intensity={light} />
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

import { useThree } from '@react-three/fiber';
const CameraRig: React.FC<{ cam: [number, number, number]; look: [number, number, number] }> = ({ cam, look }) => {
  const { camera } = useThree();
  camera.position.set(cam[0], cam[1], cam[2]);
  camera.lookAt(new THREE.Vector3(look[0], look[1], look[2]));
  camera.updateProjectionMatrix();
  return null;
};

/* --- VIDEO-006 --- */
export const L006Rose: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const bloom = ease(f / 150);
  return (
    <Stage cam={[0, 2.0 - 0.3 * ease(f / 200), 6.4 - 1.0 * ease(f / 220)]} look={[0, 0.3, 0]}>
      <group position={[0, 0.2, 0]} rotation={[0.5, t * 0.12, 0]}><Rose bloom={bloom} scale={1.25} /></group>
      <PetalRain t={t} count={70} scale={0.16} area={[8, 12, 4]} seed={5} />
      <Sparkles t={t} count={220} size={0.06} />
    </Stage>
  );
};

export const L006Bouquet: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const asm = ease((f - 10) / 110);
  return (
    <Stage cam={[0, 2.2, 9.2 - 0.6 * ease(f / 300)]} look={[0, 0.2, 0]}>
      <group position={[0, -0.3, 0]} rotation={[0.28, 0.4 + t * 0.12, 0]}><Bouquet bloom={0.85} assemble={asm} scale={1.1} /></group>
      <Sparkles t={t} count={160} size={0.05} />
    </Stage>
  );
};

/* --- shared petal overlay --- */
export const LPetals: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <Stage cam={[0, 0, 9]} look={[0, 0, 0]} light={1.1}>
      <PetalRain t={t} count={90} scale={0.2} area={[10, 16, 6]} seed={9} speed={0.9} />
    </Stage>
  );
};

/* --- VIDEO-007 --- */
export const L007Rose: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const bloom = ease((f - 20) / 130);
  const scaleOut = 1 - 0.15 * ease((f - 190) / 50);
  return (
    <Stage cam={[0.6 * Math.sin(t * 0.3), 1.8, 6.0 - 1.4 * ease(f / 180)]} look={[0, 0.4, 0]} light={0.9} env={0.8} exposure={1.0}>
      <group position={[0, 0.25, 0]} rotation={[0.55, t * 0.15, 0]} scale={scaleOut}><Rose bloom={bloom} scale={1.3} tint="#b4123f" /></group>
      <Sparkles t={t} count={380} size={0.07} color="#ffd0a8" />
    </Stage>
  );
};

export const L007Swirl: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <Stage cam={[0, 0.5, 8]} look={[0, 0, 0]} light={1.0}>
      <PetalRain t={t + 3} count={170} scale={0.19} swirl={1} seed={13} tint="#d8336b" />
      <Sparkles t={t} count={300} size={0.06} color="#ffd0a8" />
    </Stage>
  );
};

export const L007Bouquet: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const rise = ease(f / 70);
  return (
    <Stage cam={[0, 1.6, 9.5]} look={[0, 0.2, 0]} light={1.0} env={0.9}>
      <group position={[0, -0.6 - (1 - rise) * 7, 0]} rotation={[0.25, 0.6 + t * 0.15, 0]}><Bouquet bloom={0.9} scale={1.15} wrap="blush" tints={['#b4123f', '#c81d4e', '#a50e3a', '#d8336b']} /></group>
      <Sparkles t={t} count={320} size={0.07} color="#ffd0a8" />
      <PetalRain t={t} count={50} scale={0.17} seed={21} />
    </Stage>
  );
};

/* --- VIDEO-008 --- */
export const L008Bouquet: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const asm = ease((f - 6) / 80);
  return (
    <Stage cam={[0, 2.0, 9.4]} look={[0, 0.2, 0]} light={1.25} env={1.2} exposure={1.2}>
      <group position={[0, -0.4, 0]} rotation={[0.3, 0.3 + t * 0.14, 0]}><Bouquet bloom={0.9} assemble={asm} scale={1.1} wrap="kraft" tints={['#e04e7e', '#f06292', '#d8336b', '#ff8fb1']} /></group>
    </Stage>
  );
};

/* --- VIDEO-009 --- */
export const L009Swirl: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <Stage cam={[0, 0.3, 8.5]} look={[0, 0, 0]} light={1.1}>
      <PetalRain t={t + 5} count={230} scale={0.17} swirl={1} seed={31} tint="#ff4f8b" />
      <Sparkles t={t} count={420} size={0.06} color="#ffc7e3" />
    </Stage>
  );
};

/* --- VIDEO-010 --- objects, each 150 frames, centred */
const ObjStage: React.FC<{ children: React.ReactNode; cam?: [number, number, number]; look?: [number, number, number]; light?: number }> = ({ children, cam = [0, 1.9, 6.4], look = [0, 0.4, 0], light = 1.15 }) => (
  <Stage cam={cam} look={look} light={light} env={1.1} exposure={1.15}>{children}</Stage>
);

export const L010Roses: React.FC = () => { const f = useCurrentFrame(); const t = f / 30; return <ObjStage cam={[0, 2.2, 9]} look={[0, 0.2, 0]}><group position={[0, -0.4, 0]} rotation={[0.3, 0.4 + t * 0.2, 0]}><Bouquet bloom={0.9} scale={1.05} wrap="kraft" tints={['#c81d4e', '#b4123f', '#d8336b']} roses={7} /></group></ObjStage>; };
export const L010Box: React.FC = () => { const f = useCurrentFrame(); const t = f / 30; return <ObjStage><group position={[0, -0.6, 0]} rotation={[0.1, 0.6 + t * 0.25, 0]}><GiftBox scale={1.35} lidOpen={ease((f - 40) / 60) * 0.7} /></group></ObjStage>; };
export const L010Choc: React.FC = () => { const f = useCurrentFrame(); const t = f / 30; return <ObjStage cam={[0, 2.6, 5.6]} look={[0, 0, 0]}><group position={[0, -0.2, 0]} rotation={[0.2, -0.4 + t * 0.25, 0]}><Chocolate scale={1.5} /></group></ObjStage>; };
export const L010Teddy: React.FC = () => { const f = useCurrentFrame(); const t = f / 30; return <ObjStage cam={[0, 1.8, 7]} look={[0, 1.0, 0]}><group position={[0, -0.4 + Math.sin(t * 1.5) * 0.06, 0]} rotation={[0.05, -0.3 + Math.sin(t * 0.8) * 0.25, 0]}><Teddy scale={1.05} /></group></ObjStage>; };
export const L010Pendant: React.FC = () => { const f = useCurrentFrame(); const t = f / 30; return <ObjStage cam={[0, 2.4, 5.2]} look={[0, 0.3, 0]}><group position={[0, -0.3, 0]} rotation={[0.15, -0.5 + t * 0.22, 0]}><Pendant scale={1.6} /></group></ObjStage>; };
export const L010All: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  return (
    <ObjStage cam={[0, 2.4, 9.5]} look={[0, 0.2, 0]}>
      <group rotation={[0.12, Math.sin(t * 0.4) * 0.1, 0]} position={[0, -1.0, 0]}>
        <group position={[-2.2, 0.6, -0.4]} rotation={[0.2, 0.5, 0]}><Bouquet bloom={0.9} scale={0.5} wrap="kraft" roses={7} /></group>
        <GiftBox position={[-1.0, 0, 1.2]} scale={0.7} lidOpen={0.4} rotation={[0, 0.4, 0]} />
        <Chocolate position={[0.3, 0, 2.0]} rotation={[0, -0.5, 0]} scale={0.7} />
        <Teddy position={[1.5, 0, 0.6]} scale={0.55} rotation={[0, -0.4, 0]} />
        <Pendant position={[2.5, 0, 1.9]} rotation={[0, -0.6, 0]} scale={0.75} />
      </group>
      <Sparkles t={t} count={200} size={0.05} />
    </ObjStage>
  );
};

export const LAYERS: { id: string; component: React.FC; frames: number }[] = [
  { id: 'L006-rose', component: L006Rose, frames: 260 },
  { id: 'L006-bouquet', component: L006Bouquet, frames: 360 },
  { id: 'LPetals', component: LPetals, frames: 240 },
  { id: 'L007-rose', component: L007Rose, frames: 240 },
  { id: 'L007-swirl', component: L007Swirl, frames: 200 },
  { id: 'L007-bouquet', component: L007Bouquet, frames: 240 },
  { id: 'L008-bouquet', component: L008Bouquet, frames: 330 },
  { id: 'L009-swirl', component: L009Swirl, frames: 420 },
  { id: 'L010-roses', component: L010Roses, frames: 150 },
  { id: 'L010-box', component: L010Box, frames: 150 },
  { id: 'L010-choc', component: L010Choc, frames: 150 },
  { id: 'L010-teddy', component: L010Teddy, frames: 150 },
  { id: 'L010-pendant', component: L010Pendant, frames: 150 },
  { id: 'L010-all', component: L010All, frames: 180 },
];
