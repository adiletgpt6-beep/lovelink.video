import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL001 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn, typed, window01 } from '../lib/anim';
import { AuroraBg } from '../ui/Backgrounds';
import { Confetti, FloatingHearts, LightSweep, Stars } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { MessengerScreen } from '../screens/Messenger';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { PinLockScreen } from '../screens/PinLockScreen';
import { loveGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt, wordStarts } from './common';

const tl = TL001;
const [S0, S1, S2, S3, S4, S5] = tl.scenes;

/* ---------- scene 0: hook ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = 1 + f * 0.0007;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}><AuroraBg speed={0.6} /><Stars count={80} /></AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 90px' }}>
        <BigText text={S0.seg.text} starts={wordStarts(S0)} fontSize={96} weight={600} lineHeight={1.15} maxWidth={900} accentWords={['слова']} accentColor="#FDA4C4" />
      </AbsoluteFill>
      <LightSweep period={200} start={20} />
    </AbsoluteFill>
  );
};

/* ---------- scene 1: drafts ---------- */
const DRAFTS = ['Спасибо тебе за всё', 'Скучаю по тебе', 'Ты для меня — всё'];
const Drafts: React.FC = () => {
  const f = useCurrentFrame();
  // typing schedule (local frames)
  const steps: { text: string; from: number; to: number; del: number }[] = [
    { text: DRAFTS[0], from: 6, to: 50, del: 62 },
    { text: DRAFTS[1], from: 70, to: 108, del: 120 },
    { text: DRAFTS[2], from: 128, to: 180, del: 9999 },
  ];
  let shown = '';
  for (const s of steps) {
    if (f >= s.from && f < s.del) shown = typed(s.text, f, s.from, 30, 15);
    if (f >= s.to && f < s.del) shown = s.text;
    if (f >= s.del && f < s.del + 12) shown = s.text.slice(0, Math.max(0, Math.round(s.text.length * (1 - (f - s.del) / 12))));
  }
  const slide = prog(f, 0, 28, easeOut);
  const dim = prog(f, 185, 25);
  return (
    <AbsoluteFill>
      <AuroraBg speed={0.5} intensity={0.75} />
      <Stars count={40} seed={7} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 130, transform: `translateY(${(1 - slide) * 80}px)`, opacity: slide }}>
        <PhoneFrame scale={1.42} statusColor="#fff" glow="rgba(120,80,240,0.35)">
          <MessengerScreen typed={shown} draftLabel={f >= 186} />
          <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim * 0.45, pointerEvents: 'none' }} />
        </PhoneFrame>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,7,21,0) 55%, rgba(6,7,21,0.85) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* ---------- scene 2: what if ---------- */
const WhatIf: React.FC = () => (
  <AbsoluteFill>
    <AuroraBg speed={0.8} />
    <Stars count={60} seed={21} />
    <FloatingHearts count={10} start={10} colors={['#FDA4C4', '#C4B5FD', '#ffffff']} />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 100px' }}>
      <BigText text={S2.seg.text} starts={wordStarts(S2)} fontSize={84} italic weight={400} lineHeight={1.2} maxWidth={880} accentWords={['запомнилось']} accentColor="#FDA4C4" />
    </AbsoluteFill>
    <LightSweep period={150} start={30} />
  </AbsoluteFill>
);

/* ---------- scene 3: LoveLink reveal ---------- */
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const fps = 30;
  const logo = popIn(f, fps, 2);
  const rise = springIn(f, fps, 10, { damping: 18, stiffness: 90 });
  const tVideo = wordAt(S3, 'видео');
  const tPhoto = wordAt(S3, 'фото');
  const tWords = wordAt(S3, 'слова');
  const active = prog(f, tPhoto - 2, 14) + prog(f, Math.max(tWords - 2, tPhoto + 14), 14);
  return (
    <AbsoluteFill>
      <AuroraBg speed={0.8} />
      <Stars count={60} seed={33} />
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${logo})`, opacity: logo }}>
        <Logo width={520} />
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 440, transform: `translateY(${(1 - rise) * 700}px)` }}>
        <PhoneFrame scale={1.3} statusColor="#fff" glow="rgba(248,72,136,0.35)">
          <GiftViewerScreen g={loveGift} active={active} frame={f} playing={f > tVideo - 10} reasonIndex={0} seed={3} />
        </PhoneFrame>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 60, top: 620 }}><Chip start={tVideo} dark fontSize={34}>🎬 ваше видео</Chip></div>
      <div style={{ position: 'absolute', right: 60, top: 860 }}><Chip start={tPhoto} dark fontSize={34}>📷 ваши фото</Chip></div>
      <div style={{ position: 'absolute', left: 60, top: 1100 }}><Chip start={tWords} dark fontSize={34}>💌 ваши слова</Chip></div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,7,21,0) 60%, rgba(6,7,21,0.9) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* ---------- scene 4: password ---------- */
const Unlock: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = wordAt(S4, 'вводит') + 4;
  const step = 9;
  const digits = ['4', '8', '2', '9', '1', '3'];
  const filled = Math.max(0, Math.min(6, Math.floor((f - t0) / step) + (f >= t0 ? 1 : 0)));
  const pressIdx = Math.floor((f - t0) / step);
  const pressAmt = f >= t0 && pressIdx < 6 ? ((f - t0) % step) / step : 0;
  const successAt = t0 + step * 6 + 18;
  const success = f >= successAt;
  const sp = prog(f, successAt, 16);
  const slide = prog(f, 0, 24, easeOut);
  return (
    <AbsoluteFill>
      <AuroraBg speed={1} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 170, transform: `scale(${0.96 + 0.04 * slide})`, opacity: slide }}>
        <PhoneFrame scale={1.42} statusColor="#fff" glow={success ? 'rgba(52,211,153,0.3)' : 'rgba(120,80,240,0.35)'}>
          <PinLockScreen filled={filled} state={success ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? digits[pressIdx] : null} pressAmt={pressAmt} successProgress={sp} giftIcon="🤍" giftTitle="Ты для меня — всё 🤍" giftText={<>Я собрал эту страницу для тебя.<br />Открывай её, когда захочется тепла.</>} />
        </PhoneFrame>
      </AbsoluteFill>
      <Confetti start={successAt} count={90} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,7,21,0) 60%, rgba(6,7,21,0.85) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* ---------- scene 5: end card ---------- */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const logo = popIn(f, 30, 4);
  const tDomain = wordAt(S5, 'lovelink') - 4;
  const dom = springIn(f, 30, tDomain, { damping: 14 });
  return (
    <AbsoluteFill>
      <AuroraBg speed={0.7} />
      <Stars count={70} seed={55} />
      <FloatingHearts count={12} start={0} colors={['#F84888', '#FDA4C4', '#C4B5FD']} />
      <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${logo})`, opacity: logo }}>
        <Logo width={560} />
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 800, padding: '800px 100px 0' }}>
        <BigText text="Скажите это красиво." starts={wordStarts(S5).slice(0, 3)} fontSize={82} italic weight={400} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 1040, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transform: `translateY(${(1 - dom) * 40}px)`, opacity: dom }}>
        <Domain size={92} />
        <div style={{ width: 360, height: 8, borderRadius: 8, background: 'linear-gradient(90deg,#F84888,#7850F0)' }} />
        <div style={{ marginTop: 10, fontFamily: font.caption, fontWeight: 600, fontSize: 34, color: 'rgba(255,255,255,0.7)' }}>страница-подарок с паролем</div>
      </div>
    </AbsoluteFill>
  );
};

export const Video001: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#060715' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-001-music.mp3" bed={0.42} duck={0.14} />
      <SceneSeq scene={S0} fadeIn={false}><Hook /></SceneSeq>
      <SceneSeq scene={S1}><Drafts /></SceneSeq>
      <SceneSeq scene={S2}><WhatIf /></SceneSeq>
      <SceneSeq scene={S3}><Reveal /></SceneSeq>
      <SceneSeq scene={S4}><Unlock /></SceneSeq>
      <SceneSeq scene={S5} overlap={40}><End /></SceneSeq>
      <Captions timeline={tl} variant="clean" bottom={460} fontSize={54} hideScenes={[0, 2, 5]} accent="#FDA4C4" />
    </AbsoluteFill>
  );
};
