import React, { useMemo } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL009 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, rng, springIn } from '../lib/anim';
import { Grain } from '../ui/Backgrounds';
import { Stars } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText } from '../ui/Text';
import { Domain } from '../ui/Logo';
import { Layer3D } from '../ui/Layer3D';
import { Postcard } from '../ui/Postcard';
import { PinLockScreen } from '../screens/PinLockScreen';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { loveGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt, wordStarts } from './common';
import logoPoints from '../lib/logo-points.json';

const tl = TL009;
const [S0, S1, S2, S3, S4] = tl.scenes;
const DIGITS = ['4', '8', '2', '9', '1', '3'];

const NeonBg: React.FC<{ pulse?: number }> = ({ pulse = 0 }) => (
  <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, #2a0a3a 0%, #120521 45%, #05020a 100%)' }}>
    <div style={{ position: 'absolute', left: '50%', top: '45%', width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: '50%', background: `radial-gradient(circle closest-side, rgba(255,79,139,${0.25 + 0.35 * pulse}) 0%, rgba(120,80,240,${0.12 + 0.2 * pulse}) 50%, rgba(0,0,0,0) 100%)` }} />
    <Stars count={90} seed={909} color="rgba(255,200,230,0.9)" />
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

/** Big glowing digit with neon layers. */
const Digit: React.FC<{ d: string; p: number; x: number; y: number; size?: number }> = ({ d, p, x, y, size = 260 }) => (
  <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * p}) rotate(${(1 - p) * -20}deg)`, opacity: p, fontFamily: font.bold, fontWeight: 900, fontSize: size, color: '#fff', lineHeight: 1, textShadow: '0 0 20px rgba(255,120,170,0.9), 0 0 60px rgba(255,79,139,0.7), 0 0 120px rgba(120,80,240,0.6)' }}>{d}</div>
);

/* S0 — six glowing digits among petals */
const Six: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(f / 5);
  const starts = wordStarts(S0);
  return (
    <AbsoluteFill>
      <NeonBg pulse={pulse * 0.4} />
      <Layer3D id="L009-swirl" />
      {DIGITS.map((d, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const p = popIn(f, 30, 6 + i * 9);
        return <Digit key={i} d={d} p={p} x={270 + col * 270} y={720 + row * 330} size={250} />;
      })}
      <div style={{ position: 'absolute', top: 1360, left: 0, right: 0, padding: '0 90px' }}>
        <BigText text={S0.seg.text} starts={starts} fontFamily={font.bold} fontSize={88} weight={900} uppercase letterSpacing={2} reveal="pop" />
      </div>
    </AbsoluteFill>
  );
};

/* S1 — each digit triggers a transformation; petals fold into a card */
const Transform: React.FC = () => {
  const f = useCurrentFrame();
  const tHidden = wordAt(S1, 'спрятано'); const tCard = wordAt(S1, 'открыткой') - 8;
  const cardIn = springIn(f, 30, tCard, { damping: 13, stiffness: 70 });
  const ringP = (i: number) => prog(f, 4 + i * 10, 40);
  return (
    <AbsoluteFill>
      <NeonBg pulse={0.3} />
      <Layer3D id="L009-swirl" offset={120} opacity={1 - cardIn * 0.5} />
      {/* six expanding neon rings — one per digit */}
      {DIGITS.map((d, i) => {
        const p = ringP(i);
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: 540, top: 840, width: 200 + p * 1100, height: 200 + p * 1100, transform: 'translate(-50%,-50%)', borderRadius: '50%', border: `3px solid rgba(255,120,170,${(1 - p) * 0.9})`, boxShadow: `0 0 ${30 * (1 - p)}px rgba(255,79,139,${0.6 * (1 - p)})` }} />
            <Digit d={d} p={Math.min(1, p * 3) * (1 - prog(f, tCard, 20))} x={540 + Math.cos((i / 6) * Math.PI * 2 - Math.PI / 2) * 330} y={840 + Math.sin((i / 6) * Math.PI * 2 - Math.PI / 2) * 330} size={150} />
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 540, top: 840, transform: `translate(-50%,-50%) scale(${1.45 * cardIn}) rotate(${(1 - cardIn) * 40}deg)`, opacity: cardIn }}>
        <Postcard variant="night" revealed={0} rotX={8} rotY={-10} sweep={prog(f, tCard + 12, 40)} glow={0.9} />
      </div>
      <div style={{ position: 'absolute', top: 260, left: 0, right: 0, textAlign: 'center', fontFamily: font.bold, fontWeight: 700, fontSize: 46, color: '#ffd6e8', opacity: prog(f, tHidden, 10), letterSpacing: 1 }}>что спрятано за открыткой?</div>
    </AbsoluteFill>
  );
};

/* S2 — the card becomes a phone screen; scan QR, type the code */
const Enter: React.FC = () => {
  const f = useCurrentFrame();
  const tScan = wordAt(S2, 'отсканируй'); const tType = wordAt(S2, 'введи');
  const morph = prog(f, 0, 30);
  const step = 6;
  const filled = f < tType ? 0 : Math.min(6, Math.floor((f - tType) / step) + 1);
  const pressIdx = Math.floor((f - tType) / step);
  const pressAmt = f >= tType && pressIdx < 6 ? ((f - tType) % step) / step : 0;
  return (
    <AbsoluteFill>
      <NeonBg pulse={filled / 6} />
      <Layer3D id="L009-swirl" offset={240} opacity={0.6} />
      {/* card shrinks into the phone */}
      <div style={{ position: 'absolute', left: 540, top: 800, transform: `translate(-50%,-50%) scale(${1.45 - morph * 0.9}) translateY(${morph * -260}px)`, opacity: 1 - morph }}>
        <Postcard variant="night" revealed={0} rotX={8} rotY={-10} glow={0.9} />
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 240, transform: `scale(${0.5 + 0.5 * morph})`, opacity: morph, transformOrigin: '50% 45%' }}>
        <PhoneFrame scale={1.25} statusColor="#fff" glow="rgba(255,79,139,0.4)">
          <PinLockScreen filled={filled} pressedKey={pressIdx >= 0 && pressIdx < 6 ? DIGITS[pressIdx] : null} pressAmt={pressAmt} />
        </PhoneFrame>
      </AbsoluteFill>
      {/* QR flashes in from the card */}
      <div style={{ position: 'absolute', left: 90, top: 560, width: 190, height: 190, borderRadius: 24, background: '#fff', padding: 12, opacity: prog(f, tScan, 8) * (1 - prog(f, tType - 4, 10)), transform: `scale(${popIn(f, 30, tScan)})`, boxShadow: '0 0 40px rgba(255,120,170,0.8)' }}><Img src={staticFile('brand/qr-password.png')} style={{ width: '100%', height: '100%' }} /></div>
      {/* the six digits travel into the phone */}
      {DIGITS.map((d, i) => { const p = prog(f, tType + i * step - 12, 12); return <div key={i} style={{ position: 'absolute', left: 170 + i * 150, top: 1500 - p * 420, opacity: (1 - p) * prog(f, tType - 20, 10), fontFamily: font.bold, fontWeight: 900, fontSize: 110, color: '#fff', textShadow: '0 0 30px rgba(255,79,139,0.9)' }}>{d}</div>; })}
    </AbsoluteFill>
  );
};

/* S3 — the message unfolds */
const Unfold: React.FC = () => {
  const f = useCurrentFrame();
  const tVideo = wordAt(S3, 'видео'); const tPhoto = wordAt(S3, 'фото'); const tWords = wordAt(S3, 'слова');
  const active = prog(f, tPhoto - 2, 12) + prog(f, Math.max(tWords - 2, tPhoto + 12), 12);
  const grow = springIn(f, 30, 0, { damping: 16, stiffness: 70 });
  return (
    <AbsoluteFill>
      <NeonBg pulse={0.5} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 230, transform: `scale(${0.85 + 0.15 * grow})`, transformOrigin: '50% 40%' }}>
        <PhoneFrame scale={1.3} statusColor="#fff" glow="rgba(255,79,139,0.45)">
          <GiftViewerScreen g={loveGift} active={active} frame={f} playing={f > tVideo - 6} reasonIndex={3} seed={4} heroSeed={13} />
        </PhoneFrame>
      </AbsoluteFill>
      <Layer3D id="L009-swirl" offset={320} opacity={0.7} />
    </AbsoluteFill>
  );
};

/* S4 — petals fly into the LoveLink logo */
const LogoFinale: React.FC = () => {
  const f = useCurrentFrame();
  const pts = logoPoints as { x: number; y: number }[];
  const particles = useMemo(() => { const r = rng(99); return pts.map((p, i) => ({ ...p, sx: r() * 1080, sy: r() * 1920, delay: r() * 30, hue: r(), size: 14 + r() * 18, rot: r() * 360 })); }, [pts]);
  const tDomain = wordAt(S4, 'lovelink') - 6;
  const d = springIn(f, 30, tDomain, { damping: 14 });
  const W = 820; const ox = 540 - W / 2; const oy = 600;
  return (
    <AbsoluteFill>
      <NeonBg pulse={0.4} />
      <Layer3D id="L009-swirl" offset={60} opacity={0.35} />
      {particles.map((p, i) => {
        const k = prog(f, 10 + p.delay, 40);
        const x = p.sx + (ox + p.x * W - p.sx) * k; const y = p.sy + (oy + p.y * W - p.sy) * k;
        const col = p.hue < 0.5 ? '#F84888' : '#7850F0';
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: p.size, height: p.size * 1.4, borderRadius: '60% 60% 50% 50%', background: `radial-gradient(circle at 35% 30%, #ffd6e8 0%, ${col} 60%)`, transform: `translate(-50%,-50%) rotate(${p.rot + f * 2}deg)`, opacity: 0.3 + 0.7 * k }} />;
      })}
      <div style={{ position: 'absolute', top: 1230, left: 0, right: 0, padding: '0 80px' }}>
        <BigText text="Всего шесть цифр. И столько чувств." starts={wordStarts(S4).slice(0, 6)} fontFamily={font.bold} fontSize={66} weight={900} color="#fff" lineHeight={1.1} letterSpacing={-1} reveal="pop" accentWords={['шесть', 'цифр']} accentColor="#ff79ad" />
      </div>
      <div style={{ position: 'absolute', top: 1430, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: d, transform: `translateY(${(1 - d) * 30}px)` }}><Domain size={74} /></div>
    </AbsoluteFill>
  );
};

export const Video009: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#05020a' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-009-music.mp3" bed={0.5} duck={0.16} />
      <SceneSeq scene={S0} fadeIn={false}><Six /></SceneSeq>
      <SceneSeq scene={S1}><Transform /></SceneSeq>
      <SceneSeq scene={S2}><Enter /></SceneSeq>
      <SceneSeq scene={S3}><Unfold /></SceneSeq>
      <SceneSeq scene={S4} overlap={30}><LogoFinale /></SceneSeq>
      <Captions timeline={tl} variant="clean" bottom={470} fontSize={50} accent="#ff79ad" hideScenes={[0, 4]} fontFamily={font.bold} fontWeight={700} />
    </AbsoluteFill>
  );
};
