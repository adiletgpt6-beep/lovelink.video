import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL010 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn } from '../lib/anim';
import { Grain } from '../ui/Backgrounds';
import { Confetti } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { Layer3D } from '../ui/Layer3D';
import { Postcard } from '../ui/Postcard';
import { PinLockScreen } from '../screens/PinLockScreen';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { clientGift, friendGift, loveGift, momGift, wifeGift, GiftContent } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt } from './common';

const tl = TL010;
const [S0, S1, S2, S3, S4] = tl.scenes;

type Item = { id: string; layer: string; label: string; bg: [string, string]; accent: string; gift: GiftContent; reaction: string; text: string; emoji: string };
const ITEMS: Item[] = [
  { id: 'roses', layer: 'L010-roses', label: 'Розы', bg: ['#2a0a16', '#5a1230'], accent: '#ff5c8a', gift: wifeGift, reaction: '🤍', text: 'Люблю тебя.', emoji: '🥹' },
  { id: 'box', layer: 'L010-box', label: 'Подарок', bg: ['#ffe4ee', '#f7c3d9'], accent: '#F84888', gift: loveGift, reaction: '✨', text: 'С тобой всегда интересно.', emoji: '😍' },
  { id: 'choc', layer: 'L010-choc', label: 'Шоколад', bg: ['#2b1a12', '#5a3420'], accent: '#e9c46a', gift: friendGift, reaction: '🔥', text: 'Жжёшь!', emoji: '😄' },
  { id: 'teddy', layer: 'L010-teddy', label: 'Мягкая игрушка', bg: ['#dff1ff', '#b7dcf7'], accent: '#7850F0', gift: momGift, reaction: '🤗', text: 'Обнимаю крепко.', emoji: '🥰' },
  { id: 'pendant', layer: 'L010-pendant', label: 'Украшение', bg: ['#0b0612', '#2a1130'], accent: '#e9c46a', gift: clientGift, reaction: '💐', text: 'Ждём вас снова.', emoji: '😊' },
];

const ItemBg: React.FC<{ item: Item }> = ({ item }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg,${item.bg[0]} 0%,${item.bg[1]} 100%)` }}>
    <div style={{ position: 'absolute', left: '50%', top: '40%', width: 1100, height: 1100, marginLeft: -550, marginTop: -550, borderRadius: '50%', background: `radial-gradient(circle closest-side, ${item.accent}33 0%, ${item.accent}00 100%)` }} />
    <Grain opacity={0.07} />
  </AbsoluteFill>
);

const isDark = (item: Item) => ['roses', 'choc', 'pendant'].includes(item.id);

/* S0 — five objects, match-cut */
const Objects: React.FC = () => {
  const f = useCurrentFrame();
  const words = ['розы', 'коробка', 'шоколад', 'мягкая', 'украшение'];
  const starts = words.map((w) => wordAt(S0, w));
  const idx = Math.max(0, starts.findIndex((s, i) => f >= s && (i === starts.length - 1 || f < starts[i + 1])));
  const item = ITEMS[idx];
  const local = f - starts[idx];
  const punch = 1.08 - 0.08 * prog(local, 0, 12);
  return (
    <AbsoluteFill>
      <ItemBg item={item} />
      <AbsoluteFill style={{ transform: `scale(${punch})`, transformOrigin: '50% 50%' }}><Layer3D id={item.layer} offset={Math.max(0, local)} /></AbsoluteFill>
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: font.bold, fontWeight: 900, fontSize: 92, color: isDark(item) ? '#fff' : '#0a0a0a', letterSpacing: -2, textTransform: 'uppercase', transform: `translateY(${(1 - prog(local, 0, 10)) * 40}px)`, opacity: prog(local, 0, 8) }}>{item.label}</div>
        <div style={{ marginTop: 10, fontFamily: font.caption, fontWeight: 700, fontSize: 30, color: isDark(item) ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)' }}>{idx + 1} / 5</div>
      </div>
      <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><Chip start={starts[0]} dark={isDark(item)} fontSize={32}>любой подарок становится личным</Chip></div>
    </AbsoluteFill>
  );
};

/* S1 — a LoveLink card is added to each */
const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const tQr = wordAt(S1, 'qr-кодом'); const tSix = wordAt(S1, 'шести');
  return (
    <AbsoluteFill>
      <ItemBg item={ITEMS[1]} />
      <Layer3D id="L010-all" opacity={0.95} style={{ transform: 'translateY(380px) scale(1.1)' }} />
      {ITEMS.map((it, i) => {
        const p = springIn(f, 30, 6 + i * 7, { damping: 13, stiffness: 110 });
        const x = 140 + i * 200; const y = 1180 - Math.abs(i - 2) * 40;
        return <div key={it.id} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${0.3 * p}) rotate(${(i - 2) * 8}deg)`, opacity: p }}><Postcard variant={i % 2 ? 'blush' : 'ivory'} revealed={prog(f, tSix, 20)} /></div>;
      })}
      <div style={{ position: 'absolute', left: 540, top: 560, transform: `translate(-50%,-50%) scale(${1.25 * springIn(f, 30, 0, { damping: 15 })})` }}>
        <Postcard variant="ivory" revealed={prog(f, tSix, 20)} rotX={8} rotY={-10} sweep={prog(f, tQr, 40)} />
      </div>
      <div style={{ position: 'absolute', left: 70, top: 840 }}><Chip start={tQr} fontSize={30}>QR-код</Chip></div>
      <div style={{ position: 'absolute', right: 70, top: 840 }}><Chip start={tSix} fontSize={30}>код из шести цифр</Chip></div>
    </AbsoluteFill>
  );
};

/* S2 — recipients open their messages */
const Opens: React.FC = () => {
  const f = useCurrentFrame();
  const tScan = wordAt(S2, 'сканирует'); const tType = wordAt(S2, 'вводит'); const tSee = wordAt(S2, 'видит');
  const step = 5;
  const filled = f < tType ? 0 : Math.min(6, Math.floor((f - tType) / step) + 1);
  const pressIdx = Math.floor((f - tType) / step);
  const pressAmt = f >= tType && pressIdx < 6 ? ((f - tType) % step) / step : 0;
  const successAt = tType + step * 6 + 8;
  const showViewer = f >= tSee;
  const which = Math.min(2, Math.floor((f - tSee) / 32));
  const gifts = [friendGift, momGift, clientGift];
  const item = ITEMS[showViewer ? [2, 3, 4][which] : 0];
  return (
    <AbsoluteFill>
      <ItemBg item={item} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 220 }}>
        <PhoneFrame scale={1.3} statusColor="#fff" glow={`${item.accent}55`}>
          {showViewer ? <GiftViewerScreen g={gifts[which]} active={which === 0 ? 0 : which === 1 ? 2 : 3} frame={f} playing reasonIndex={1} activeEmoji={which === 2 ? '💐' : null} responseText={which === 2 ? 'Ждём вас снова.' : null} seed={which + 20} heroSeed={which + 30} /> : <PinLockScreen filled={filled} state={f >= successAt ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} successProgress={prog(f, successAt, 10)} giftIcon="🎉" giftTitle="С днём рождения, Дан!" giftText={<>Видео, наши фото и пять причин, почему ты лучший.</>} />}
        </PhoneFrame>
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 1372, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14 }}>
        <Chip start={tScan} dark={isDark(item)} fontSize={28}>📷 сканирует</Chip>
        <Chip start={tType} dark={isDark(item)} fontSize={28}>🔢 вводит код</Chip>
        <Chip start={tSee} dark={isDark(item)} fontSize={28}>💌 видит послание</Chip>
      </div>
      <Confetti start={successAt} count={60} />
    </AbsoluteFill>
  );
};

/* S3 — reactions */
const Reactions: React.FC = () => {
  const f = useCurrentFrame();
  const tGifts = wordAt(S3, 'разные'); const tPeople = wordAt(S3, 'люди'); const tEmotion = wordAt(S3, 'эмоция');
  return (
    <AbsoluteFill>
      <ItemBg item={ITEMS[3]} />
      <Layer3D id="L010-all" offset={60} opacity={0.5} style={{ transform: 'translateY(520px) scale(1.15)' }} />
      <div style={{ position: 'absolute', top: 300, left: 60, right: 60, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 14 }}>
        {ITEMS.map((it, i) => { const p = springIn(f, 30, tPeople - 6 + i * 5, { damping: 12 }); return (
          <div key={it.id} style={{ transform: `translateY(${(1 - p) * 120}px) scale(${p})`, opacity: p, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 150, height: 150, borderRadius: 40, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 92, boxShadow: '0 16px 30px rgba(0,0,0,0.15)' }}>{it.emoji}</div>
            <div style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 22, color: '#0a0a0a', textAlign: 'center' }}>{it.text}</div>
          </div>); })}
      </div>
      <div style={{ position: 'absolute', top: 700, left: 0, right: 0, padding: '0 80px' }}>
        <BigText text="Разные подарки. Разные люди. Одна искренняя эмоция." start={tGifts} stagger={4} fontFamily={font.bold} fontSize={70} weight={900} color="#0a0a0a" lineHeight={1.08} letterSpacing={-2} reveal="up" accentWords={['эмоция']} accentColor="#F84888" />
      </div>
      <div style={{ position: 'absolute', top: 1180, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16, opacity: prog(f, tEmotion, 10) }}>
        {['💐', '🎁', '🍫', '🧸', '💍'].map((e, i) => <div key={i} style={{ fontSize: 70, transform: `translateY(${Math.sin(f / 8 + i) * 8}px)` }}>{e}</div>)}
      </div>
    </AbsoluteFill>
  );
};

/* S4 — whatever you sell, add emotion */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const tDomain = wordAt(S4, 'lovelink') - 6;
  const d = springIn(f, 30, tDomain, { damping: 14 }); const l = popIn(f, 30, tDomain - 12);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(160deg,#F84888 0%,#b83ea0 50%,#7850F0 100%)' }} />
      <Layer3D id="L010-all" offset={90} style={{ transform: 'translateY(330px) scale(1.05)' }} />
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, padding: '0 70px' }}>
        <BigText text="Что бы вы ни продавали — добавьте эмоции." start={2} stagger={4} fontFamily={font.bold} fontSize={78} weight={900} color="#fff" lineHeight={1.05} letterSpacing={-2} reveal="up" accentWords={['эмоции']} accentColor="#ffe08a" />
      </div>
      <div style={{ position: 'absolute', top: 1320, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ transform: `scale(${l})`, opacity: l, background: '#fff', borderRadius: 30, padding: '20px 40px', boxShadow: '0 20px 34px rgba(0,0,0,0.25)' }}><Logo width={340} /></div>
        <div style={{ opacity: d, transform: `translateY(${(1 - d) * 30}px)` }}><Domain size={78} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Video010: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#111' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-010-music.mp3" bed={0.5} duck={0.16} />
      <SceneSeq scene={S0} fadeIn={false}><Objects /></SceneSeq>
      <SceneSeq scene={S1}><Cards /></SceneSeq>
      <SceneSeq scene={S2}><Opens /></SceneSeq>
      <SceneSeq scene={S3}><Reactions /></SceneSeq>
      <SceneSeq scene={S4} overlap={30}><End /></SceneSeq>
      <Captions timeline={tl} variant="pill" bottom={300} fontSize={46} accent="#FDA4C4" hideScenes={[3, 4]} fontFamily={font.caption} />
    </AbsoluteFill>
  );
};
