import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';

const GRAIN = `url(${staticFile('brand/noise.png')})`;

export const Grain: React.FC<{ opacity?: number; blend?: boolean }> = ({ opacity = 0.09, blend = false }) => (
  <AbsoluteFill style={{ backgroundImage: GRAIN, backgroundSize: '256px 256px', opacity, mixBlendMode: blend ? 'overlay' : 'normal', pointerEvents: 'none' }} />
);

/** Dark aurora used by the real LoveLink password screen (violet / blue / pink blobs on #060715). */
export const AuroraBg: React.FC<{ speed?: number; intensity?: number }> = ({ speed = 1, intensity = 1 }) => {
  const f = useCurrentFrame() * speed;
  const dx = Math.sin(f / 180) * 4;
  const dy = Math.cos(f / 220) * 3;
  // Pre-rendered glows (public/brand/aurora.png, 1.2x canvas) panned by transform — cheap to rasterise.
  return (
    <AbsoluteFill style={{ background: '#060715' }}>
      <Img src={staticFile('brand/aurora.png')} style={{ position: 'absolute', left: '-10%', top: '-10%', width: '120%', height: '120%', transform: `translate(${dx}%, ${dy}%)`, opacity: intensity }} />
      <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 50% 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)' }} />
      <Grain />
    </AbsoluteFill>
  );
};

/** Light page background of lovelink.my (white → #fff7fb with pink / violet blur blobs). */
export const LightBg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#fff 0%,#fff7fb 100%)' }}>
      <div style={{ position: 'absolute', left: '50%', top: 60 + Math.sin(f / 90) * 20, width: 620, height: 620, marginLeft: -310, borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(251,207,232,0.45) 0%, rgba(251,207,232,0.45) 25%, rgba(251,207,232,0) 100%)' }} />
      <div style={{ position: 'absolute', right: -120, top: 700 + Math.cos(f / 110) * 20, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(221,214,254,0.45) 0%, rgba(221,214,254,0.45) 25%, rgba(221,214,254,0) 100%)' }} />
      <div style={{ position: 'absolute', left: -160, bottom: 120, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(252,231,243,0.6) 0%, rgba(252,231,243,0.6) 25%, rgba(252,231,243,0) 100%)' }} />
    </AbsoluteFill>
  );
};

/** Animated brand gradient (pink → violet). */
export const BrandBg: React.FC<{ angle?: number; dark?: boolean }> = ({ angle = 135, dark = false }) => {
  const f = useCurrentFrame();
  const a = angle + Math.sin(f / 120) * 8;
  return (
    <AbsoluteFill style={{ background: dark ? `linear-gradient(${a}deg,#2a0f3f 0%,#120a2e 55%,#06040f 100%)` : `linear-gradient(${a}deg,#F84888 0%,#B34CC2 50%,#7850F0 100%)` }}>
      <div style={{ position: 'absolute', left: '-10%', top: '10%', width: '70%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 100%)', transform: `translateY(${Math.sin(f / 70) * 40}px)` }} />
      <div style={{ position: 'absolute', right: '-10%', bottom: '5%', width: '70%', height: '40%', borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(120,80,240,0.35) 0%, rgba(120,80,240,0.35) 25%, rgba(120,80,240,0) 100%)', transform: `translateY(${Math.cos(f / 80) * 40}px)` }} />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};

/** Warm evening tone for storytelling (VIDEO-004). */
export const WarmBg: React.FC<{ phase?: 'evening' | 'night' | 'morning' }> = ({ phase = 'evening' }) => {
  const f = useCurrentFrame();
  const map = {
    evening: 'linear-gradient(180deg,#2b1430 0%,#5a2143 40%,#c2563f 100%)',
    night: 'linear-gradient(180deg,#070716 0%,#161238 55%,#2b1f55 100%)',
    morning: 'linear-gradient(180deg,#fff4ea 0%,#ffd9c7 45%,#f7b7b7 100%)',
  } as const;
  return (
    <AbsoluteFill style={{ background: map[phase] }}>
      <div style={{ position: 'absolute', left: '20%', top: '15%', width: 700, height: 700, borderRadius: '50%', background: phase === 'morning' ? 'radial-gradient(circle closest-side, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)' : 'radial-gradient(circle closest-side, rgba(255,170,120,0.22) 0%, rgba(255,170,120,0) 100%)', transform: `translate(${Math.sin(f / 100) * 30}px, ${Math.cos(f / 130) * 20}px)` }} />
      <Grain opacity={phase === 'morning' ? 0.05 : 0.08} />
    </AbsoluteFill>
  );
};
