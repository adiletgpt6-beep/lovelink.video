import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL007 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn } from '../lib/anim';
import { Grain } from '../ui/Backgrounds';
import { LightSweep, Stars } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { Layer3D } from '../ui/Layer3D';
import { Postcard } from '../ui/Postcard';
import { PinLockScreen } from '../screens/PinLockScreen';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { loveGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt, wordStarts } from './common';

const tl = TL007;
const [S0, S1, S2, S3] = tl.scenes;

/** Black velvet with a faint warm spotlight — premium brand look. */
const VelvetBg: React.FC<{ spot?: number }> = ({ spot = 1 }) => (
  <AbsoluteFill style={{ background: '#050308' }}>
    <div style={{ position: 'absolute', left: '50%', top: '38%', width: 1300, height: 1300, marginLeft: -650, marginTop: -650, borderRadius: '50%', background: `radial-gradient(circle closest-side, rgba(120,40,70,${0.45 * spot}) 0%, rgba(60,15,40,${0.25 * spot}) 40%, rgba(0,0,0,0) 100%)` }} />
    <Stars count={40} seed={77} color="rgba(255,220,200,0.8)" />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);

const GoldLine: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 180, style }) => <div style={{ width: w, height: 2, background: 'linear-gradient(90deg,transparent,#e9c46a,transparent)', ...style }} />;

/* S0 — a rose opens in the dark */
const Bloom: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = 1 + prog(f, 0, 240, easeOut) * 0.06;
  return (
    <AbsoluteFill>
      <VelvetBg spot={prog(f, 0, 60)} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 42%' }}><Layer3D id="L007-rose" /></AbsoluteFill>
      <div style={{ position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <GoldLine style={{ opacity: prog(f, 40, 20) }} />
        <BigText text={S0.seg.text} starts={wordStarts(S0)} fontSize={70} weight={400} italic color="#fff3e6" />
        <GoldLine style={{ opacity: prog(f, 60, 20) }} />
      </div>
    </AbsoluteFill>
  );
};

/* S1 — petals swirl into a card; QR; phone; six digits */
const Magic: React.FC = () => {
  const f = useCurrentFrame();
  const tCard = wordAt(S1, 'открытка') - 10;
  const tQr = wordAt(S1, 'qr'); const tPage = wordAt(S1, 'страницу'); const tSix = wordAt(S1, 'шесть');
  const cardIn = springIn(f, 30, tCard, { damping: 14, stiffness: 70 });
  // camera pushes towards the QR after the card settles
  const push = prog(f, tQr - 4, 40);
  // keep the whole card (QR + six cells) inside the frame while pushing in
  const cardScale = 1.3 + push * 0.3;
  const cardX = 540; const cardY = 700 - push * 60;
  const phoneIn = springIn(f, 30, tPage - 4, { damping: 16, stiffness: 80 });
  const step = 6;
  const filled = f < tSix ? 0 : Math.min(6, Math.floor((f - tSix) / step) + 1);
  const pressIdx = Math.floor((f - tSix) / step);
  const pressAmt = f >= tSix && pressIdx < 6 ? ((f - tSix) % step) / step : 0;
  const swirlFade = 1 - prog(f, tCard + 30, 40) * 0.7;
  return (
    <AbsoluteFill>
      <VelvetBg />
      <Layer3D id="L007-swirl" opacity={swirlFade} />
      <div style={{ position: 'absolute', left: cardX, top: cardY, transform: `translate(-50%,-50%) scale(${cardScale * (0.6 + 0.4 * cardIn)})`, opacity: cardIn }}>
        <Postcard variant="night" revealed={Math.min(1, filled / 6)} rotX={10 - push * 6} rotY={-14 + push * 10} sweep={prog(f, tCard + 10, 50)} glow={0.6} />
      </div>
      {/* QR focus ring */}
      <div style={{ position: 'absolute', left: cardX - 300 * (cardScale / 1.3) * 0.68 + 90, top: cardY - 95, width: 0, height: 0, opacity: 0 }} />
      <div style={{ position: 'absolute', right: 60, top: 900, transform: `translateY(${(1 - phoneIn) * 900}px) rotate(${(1 - phoneIn) * 10}deg)`, opacity: phoneIn }}>
        <PhoneFrame scale={0.68} statusColor="#fff" glow="rgba(233,196,106,0.25)">
          <PinLockScreen filled={filled} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} />
        </PhoneFrame>
      </div>
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', fontFamily: font.display, fontStyle: 'italic', fontSize: 54, color: '#fff3e6', opacity: prog(f, tCard, 14) }}>Маленькая открытка LoveLink</div>
    </AbsoluteFill>
  );
};

/* S2 — the screen opens into the message */
const Open: React.FC = () => {
  const f = useCurrentFrame();
  const tVideo = wordAt(S2, 'видео'); const tPhoto = wordAt(S2, 'фото'); const tWords = wordAt(S2, 'слова');
  const grow = springIn(f, 30, 0, { damping: 18, stiffness: 70 });
  const active = prog(f, tPhoto - 2, 12) + prog(f, Math.max(tWords - 2, tPhoto + 12), 12);
  return (
    <AbsoluteFill>
      <VelvetBg />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 220, transform: `scale(${0.8 + 0.2 * grow})`, transformOrigin: '50% 40%' }}>
        <PhoneFrame scale={1.35} statusColor="#fff" glow="rgba(233,196,106,0.3)">
          <GiftViewerScreen g={loveGift} active={active} frame={f} playing={f > tVideo - 6} reasonIndex={2} seed={9} heroSeed={11} />
        </PhoneFrame>
      </AbsoluteFill>
      <Layer3D id="L007-swirl" offset={100} opacity={0.5} />
      <LightSweep period={180} start={10} width="50%" opacity={0.5} />
    </AbsoluteFill>
  );
};

/* S3 — bouquet finale */
const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const tDomain = wordAt(S3, 'lovelink') - 6;
  const d = springIn(f, 30, tDomain, { damping: 14 });
  return (
    <AbsoluteFill>
      <VelvetBg />
      <Layer3D id="L007-bouquet" offset={15} speed={0.9} style={{ transform: 'translateY(200px)' }} />
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, padding: '0 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <GoldLine />
        <BigText text="Маленькая открытка. Большие эмоции." starts={wordStarts(S3).slice(0, 4)} fontSize={78} weight={600} color="#fff3e6" lineHeight={1.15} accentWords={['Большие', 'эмоции']} accentColor="#e9c46a" />
        <GoldLine />
      </div>
      <div style={{ position: 'absolute', top: 1340, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: d, transform: `translateY(${(1 - d) * 30}px)` }}>
        <Logo width={380} white />
        <Domain size={80} color="#e9c46a" />
      </div>
    </AbsoluteFill>
  );
};

export const Video007: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#050308' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-007-music.mp3" bed={0.45} duck={0.15} />
      <SceneSeq scene={S0} fadeIn={false}><Bloom /></SceneSeq>
      <SceneSeq scene={S1}><Magic /></SceneSeq>
      <SceneSeq scene={S2}><Open /></SceneSeq>
      <SceneSeq scene={S3} overlap={30}><Finale /></SceneSeq>
      <Captions timeline={tl} variant="clean" bottom={300} fontSize={48} accent="#e9c46a" hideScenes={[0, 3]} fontFamily={font.display} fontWeight={600} />
    </AbsoluteFill>
  );
};
