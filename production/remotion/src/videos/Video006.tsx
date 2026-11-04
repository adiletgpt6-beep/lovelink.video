import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL006 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn } from '../lib/anim';
import { Grain } from '../ui/Backgrounds';
import { Bokeh, Confetti, LightSweep } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { Layer3D } from '../ui/Layer3D';
import { Postcard } from '../ui/Postcard';
import { ScanScreen } from '../ui/Scan';
import { PinLockScreen } from '../screens/PinLockScreen';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { wifeGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt, wordStarts } from './common';

const tl = TL006;
const [S0, S1, S2, S3, S4, S5] = tl.scenes;

/** Warm florist-studio backdrop: cream light from above, deep burgundy shadows. */
const StudioBg: React.FC<{ warmth?: number }> = ({ warmth = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg,#2a0f18 0%,#140810 45%,#0b0509 100%)' }}>
      <div style={{ position: 'absolute', left: '50%', top: -300, width: 1400, height: 1100, marginLeft: -700, borderRadius: '50%', background: `radial-gradient(circle closest-side, rgba(255,214,190,${0.28 * warmth}) 0%, rgba(255,160,150,${0.12 * warmth}) 45%, rgba(0,0,0,0) 100%)`, transform: `translateY(${Math.sin(f / 90) * 20}px)` }} />
      <div style={{ position: 'absolute', right: -400, bottom: -200, width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle closest-side, rgba(248,72,136,0.16) 0%, rgba(0,0,0,0) 100%)' }} />
      <Bokeh count={10} colors={['#ffd9c2', '#ffb3c6', '#fff']} opacity={0.18} />
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};

/* S0 — hook: a rose blooms, words appear */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const starts = wordStarts(S0);
  const line1 = 'Каждый букет собирают с любовью.';
  const line2 = 'Но слова, ради которых его дарят, часто остаются несказанными.';
  const n1 = line1.split(' ').length;
  const zoom = 1 + prog(f, 0, 270, easeOut) * 0.05;
  return (
    <AbsoluteFill>
      <StudioBg />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 45%' }}><Layer3D id="L006-rose" speed={0.96} /></AbsoluteFill>
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, padding: '0 90px' }}>
        <BigText text={line1} starts={starts.slice(0, n1)} fontSize={74} weight={400} color="#fff6ef" lineHeight={1.15} />
      </div>
      <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, padding: '0 90px' }}>
        <BigText text={line2} starts={starts.slice(n1)} fontSize={52} weight={400} italic color="rgba(255,235,225,0.9)" lineHeight={1.2} accentWords={['несказанными']} accentColor="#FDA4C4" />
      </div>
      <LightSweep period={240} start={40} width="55%" opacity={0.45} />
    </AbsoluteFill>
  );
};

/* S1 — bouquet assembles, the card is added */
const Assemble: React.FC = () => {
  const f = useCurrentFrame();
  const tCard = wordAt(S1, 'открытку') - 6;
  const cardIn = springIn(f, 30, tCard, { damping: 15, stiffness: 90 });
  return (
    <AbsoluteFill>
      <StudioBg />
      <Layer3D id="L006-bouquet" />
      <div style={{ position: 'absolute', left: 540, top: 1120, transform: `translate(-50%,-50%) translateX(${(1 - cardIn) * 900}px) rotate(${-8 + (1 - cardIn) * 25}deg) scale(0.78)`, opacity: Math.min(1, cardIn * 1.4), filter: undefined }}>
        <Postcard revealed={0} rotX={6} rotY={-10} sweep={prog(f, tCard + 20, 40)} />
      </div>
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><Chip start={4} dark fontSize={32}>💐 флорист собирает букет</Chip></div>
    </AbsoluteFill>
  );
};

/* S2 — card close-up: QR and the six-digit code are two different things */
const CardCloseUp: React.FC = () => {
  const f = useCurrentFrame();
  const tQr = wordAt(S2, 'qr'); const tCode = wordAt(S2, 'секретный'); const tSix = wordAt(S2, 'шести');
  const inP = springIn(f, 30, 0, { damping: 16, stiffness: 80 });
  const revealed = prog(f, tSix - 4, 30);
  const rotY = interpolate(f, [0, 160], [-22, -6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  return (
    <AbsoluteFill>
      <StudioBg warmth={0.8} />
      <Layer3D id="L006-bouquet" offset={200} speed={0.6} opacity={0.35} style={{ transform: 'scale(1.3) translateY(300px)' }} />
      <div style={{ position: 'absolute', left: 540, top: 880, transform: `translate(-50%,-50%) scale(${1.55 * (0.9 + 0.1 * inP)})`, opacity: inP }}>
        <Postcard revealed={revealed} rotX={8} rotY={rotY} sweep={prog(f, 20, 60)} glow={0.4} />
      </div>
      {/* callouts */}
      <div style={{ position: 'absolute', left: 90, top: 430, opacity: prog(f, tQr, 10), transform: `translateY(${(1 - prog(f, tQr, 10)) * 20}px)` }}>
        <Chip fontSize={34}>① QR-код — открывает страницу</Chip>
        <div style={{ marginLeft: 120, width: 4, height: 120, background: 'linear-gradient(180deg,#F84888,transparent)' }} />
      </div>
      <div style={{ position: 'absolute', right: 70, top: 1230, opacity: prog(f, tCode, 10), transform: `translateY(${(1 - prog(f, tCode, 10)) * -20}px)`, textAlign: 'right' }}>
        <div style={{ marginLeft: 'auto', marginRight: 140, width: 4, height: 110, background: 'linear-gradient(0deg,#7850F0,transparent)' }} />
        <Chip fontSize={34}>② секретный код — шесть цифр</Chip>
      </div>
    </AbsoluteFill>
  );
};

/* S3 — scan + type the six digits */
const ScanType: React.FC = () => {
  const f = useCurrentFrame();
  const tScan = wordAt(S3, 'сканирует'); const tType = wordAt(S3, 'вводит');
  const recognizedAt = tType - 22;
  const switchAt = tType - 8;
  const step = 7;
  const filled = f < tType ? 0 : Math.min(6, Math.floor((f - tType) / step) + 1);
  const pressIdx = Math.floor((f - tType) / step);
  const pressAmt = f >= tType && pressIdx < 6 ? ((f - tType) % step) / step : 0;
  const successAt = tType + step * 6 + 12;
  const rise = springIn(f, 30, 0, { damping: 17, stiffness: 90 });
  return (
    <AbsoluteFill>
      <StudioBg warmth={0.7} />
      <Layer3D id="LPetals" offset={60} opacity={0.55} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 230, transform: `translateY(${(1 - rise) * 500}px)` }}>
        <PhoneFrame scale={1.3} statusColor="#fff" glow="rgba(248,72,136,0.3)">
          {f < switchAt ? <ScanScreen t={f / 30} recognized={f >= recognizedAt} /> : <PinLockScreen filled={filled} state={f >= successAt ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} successProgress={prog(f, successAt, 12)} giftIcon="💌" giftTitle="Семь лет — и я всё так же влюблён" giftText={<>Открой — внутри видео, наши фото и то, что я давно хотел сказать.</>} />}
        </PhoneFrame>
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
        <Chip start={tScan} dark fontSize={30}>📷 сканирует QR</Chip>
        <Chip start={tType} dark fontSize={30}>🔢 вводит 6 цифр</Chip>
      </div>
      <Confetti start={successAt} count={70} />
    </AbsoluteFill>
  );
};

/* S4 — the personal message */
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const tVideo = wordAt(S4, 'видео'); const tPhoto = wordAt(S4, 'фотографии'); const tWords = wordAt(S4, 'слова');
  const active = prog(f, tPhoto - 2, 14) + prog(f, Math.max(tWords - 2, tPhoto + 14), 14);
  return (
    <AbsoluteFill>
      <StudioBg />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 200 }}>
        <PhoneFrame scale={1.3} statusColor="#fff" glow="rgba(248,72,136,0.35)">
          <GiftViewerScreen g={wifeGift} active={active} frame={f} playing={f > tVideo - 6} reasonIndex={1} seed={5} heroSeed={3} />
        </PhoneFrame>
      </AbsoluteFill>
      <Layer3D id="LPetals" offset={120} opacity={0.85} />
      <div style={{ position: 'absolute', left: 50, top: 520 }}><Chip start={tVideo} fontSize={32}>🎬 видео</Chip></div>
      <div style={{ position: 'absolute', right: 50, top: 760 }}><Chip start={tPhoto} fontSize={32}>📷 фотографии</Chip></div>
      <div style={{ position: 'absolute', left: 50, top: 1000 }}><Chip start={tWords} fontSize={32}>💌 слова</Chip></div>
    </AbsoluteFill>
  );
};

/* S5 — finale */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const tDomain = wordAt(S5, 'lovelink') - 6;
  const d = springIn(f, 30, tDomain, { damping: 14 });
  const l = popIn(f, 30, tDomain - 14);
  return (
    <AbsoluteFill>
      <StudioBg />
      <Layer3D id="L006-bouquet" offset={180} speed={0.7} style={{ transform: 'translateY(260px) scale(1.05)' }} />
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, padding: '0 80px' }}>
        <BigText text="Пусть ваши букеты говорят больше" starts={wordStarts(S5).slice(0, 5)} fontSize={84} weight={600} color="#fff6ef" lineHeight={1.12} accentWords={['больше']} accentColor="#FDA4C4" />
      </div>
      <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ transform: `scale(${l})`, opacity: l, background: 'rgba(255,255,255,0.96)', borderRadius: 32, padding: '22px 44px', boxShadow: '0 20px 34px rgba(0,0,0,0.3)' }}><Logo width={360} /></div>
        <div style={{ opacity: d, transform: `translateY(${(1 - d) * 30}px)` }}><Domain size={78} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Video006: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#140810' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-006-music.mp3" bed={0.42} duck={0.14} />
      <SceneSeq scene={S0} fadeIn={false}><Hook /></SceneSeq>
      <SceneSeq scene={S1}><Assemble /></SceneSeq>
      <SceneSeq scene={S2}><CardCloseUp /></SceneSeq>
      <SceneSeq scene={S3}><ScanType /></SceneSeq>
      <SceneSeq scene={S4}><Reveal /></SceneSeq>
      <SceneSeq scene={S5} overlap={30}><End /></SceneSeq>
      <Captions timeline={tl} variant="clean" bottom={470} fontSize={50} accent="#FDA4C4" hideScenes={[0, 2, 5]} />
    </AbsoluteFill>
  );
};
