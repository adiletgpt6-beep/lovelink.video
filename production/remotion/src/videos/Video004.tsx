import React from 'react';
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL004 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn, typed } from '../lib/anim';
import { WarmBg } from '../ui/Backgrounds';
import { Bokeh, Confetti, FloatingHearts, Stars } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip, Tap } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { HomeScreen } from '../screens/Templates';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { EditorPanel } from '../screens/EditorScreen';
import { PinLockScreen } from '../screens/PinLockScreen';
import { Bouquet, QrCard } from '../ui/Illustrations';
import { momGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt } from './common';

const tl = TL004;
const [S0, S1, S2, S3, S4, S5] = tl.scenes;

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: 32, padding: '30px 36px', boxShadow: '0 20px 34px rgba(0,0,0,0.25)', fontFamily: font.caption, color: '#171717', ...style }}>{children}</div>
);

/* scene 0 — two cities */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const title = popIn(f, 30, 2);
  const tMom = wordAt(S0, 'мамы'); const tCity = wordAt(S0, 'другом');
  const cal = springIn(f, 30, tMom - 4);
  const arc = prog(f, tCity - 6, 30);
  const pinA = springIn(f, 30, tCity - 10); const pinB = springIn(f, 30, tCity + 10);
  return (
    <AbsoluteFill>
      <WarmBg phase="evening" />
      <Bokeh count={12} colors={['#ffb199', '#ffd6e0', '#fff']} opacity={0.25} />
      <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', transform: `scale(${title})`, opacity: title }}>
        <div style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>история клиента</div>
        <div style={{ marginTop: 14, fontFamily: font.display, fontWeight: 600, fontSize: 100, color: '#fff', letterSpacing: -2 }}>История Айданы</div>
      </div>
      <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: cal, transform: `translateY(${(1 - cal) * 40}px)` }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <div style={{ width: 120, borderRadius: 20, overflow: 'hidden', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}><div style={{ background: '#F84888', color: '#fff', fontSize: 22, fontWeight: 700, padding: '8px 0', letterSpacing: 2 }}>ЗАВТРА</div><div style={{ fontSize: 64, fontWeight: 800, padding: '8px 0 12px', color: '#0a0a0a' }}>5</div></div>
          <div><div style={{ fontSize: 40, fontWeight: 800 }}>День рождения мамы</div><div style={{ marginTop: 8, fontSize: 30, color: '#737373' }}>🎂 напоминание · 09:00</div></div>
        </Card>
      </div>
      <div style={{ position: 'absolute', top: 880, left: 0, right: 0, height: 500 }}>
        <svg width="1080" height="500" viewBox="0 0 1080 500" style={{ position: 'absolute', inset: 0 }}>
          <path d="M200 380 C 350 60, 730 60, 880 380" stroke="rgba(255,255,255,0.85)" strokeWidth="8" strokeDasharray="22 22" fill="none" strokeLinecap="round" pathLength={1} strokeDashoffset={0} style={{ strokeDasharray: `${arc} 1`, opacity: arc > 0 ? 1 : 0 }} />
          <path d="M200 380 C 350 60, 730 60, 880 380" stroke="rgba(255,255,255,0.35)" strokeWidth="8" fill="none" strokeDasharray="4 18" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', left: 120, top: 330, transform: `scale(${pinA})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}><div style={{ fontSize: 90 }}>📍</div><Card style={{ padding: '14px 26px', fontSize: 32, fontWeight: 800 }}>Айдана</Card></div>
        <div style={{ position: 'absolute', right: 120, top: 330, transform: `scale(${pinB})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}><div style={{ fontSize: 90 }}>📍</div><Card style={{ padding: '14px 26px', fontSize: 32, fontWeight: 800 }}>Мама</Card></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: font.caption, fontWeight: 700, fontSize: 36, color: '#fff', opacity: arc }}>другой город · 600 км</div>
      </div>
    </AbsoluteFill>
  );
};

/* scene 1 — flowers ordered, but… */
const Flowers: React.FC = () => {
  const f = useCurrentFrame();
  const tBut = wordAt(S1, 'но'); const tMore = wordAt(S1, 'больше');
  const a = springIn(f, 30, 4); const b = springIn(f, 30, tBut - 2);
  const strike = prog(f, tMore, 14);
  const bq = springIn(f, 30, 10, { damping: 16 });
  return (
    <AbsoluteFill>
      <WarmBg phase="evening" />
      <Bokeh count={10} colors={['#ffb199', '#ffd6e0', '#fff']} opacity={0.22} />
      <div style={{ position: 'absolute', top: 200, left: 60, transform: `translateY(${(1 - bq) * 200}px) rotate(-8deg)`, opacity: bq }}><Bouquet width={460} /></div>
      <div style={{ position: 'absolute', top: 330, right: 60, width: 560, opacity: a, transform: `translateX(${(1 - a) * 200}px)` }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ width: 56, height: 56, borderRadius: 28, background: '#34d399', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>✓</span><span style={{ fontSize: 36, fontWeight: 800 }}>Букет заказан</span></div>
          <div style={{ marginTop: 14, fontSize: 28, color: '#737373', lineHeight: 1.4 }}>Доставка завтра к 09:00<br />25 тюльпанов · розовые</div>
        </Card>
      </div>
      <div style={{ position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: b, transform: `translateY(${(1 - b) * 60}px)` }}>
        <Card style={{ width: 760, position: 'relative' }}>
          <div style={{ fontSize: 26, color: '#a3a3a3', letterSpacing: 3, textTransform: 'uppercase' }}>Открытка к букету</div>
          <div style={{ marginTop: 12, fontFamily: font.serif, fontSize: 40, color: '#171717', lineHeight: 1.3 }}>«С днём рождения, мама! Люблю, целую, скуч…»</div>
          <div style={{ marginTop: 14, fontSize: 26, color: '#F84888', fontWeight: 700 }}>⚠ осталось 0 из 120 символов</div>
          <div style={{ position: 'absolute', left: 30, right: 30, top: '58%', height: 8, borderRadius: 8, background: '#F84888', transform: 'rotate(-3deg)', width: `${strike * 92}%`, opacity: strike > 0 ? 1 : 0 }} />
        </Card>
      </div>
      <div style={{ position: 'absolute', top: 1180, left: 0, right: 0, textAlign: 'center', padding: '0 100px' }}>
        <BigText text="хотелось сказать больше" start={tMore} stagger={5} fontSize={76} italic weight={400} />
      </div>
    </AbsoluteFill>
  );
};

/* scene 2 — building the page at night */
const Build: React.FC = () => {
  const f = useCurrentFrame();
  const tOpen = wordAt(S2, 'открыла'); const tTpl = wordAt(S2, 'шаблон'); const tVideo = wordAt(S2, 'видео'); const tPhoto = wordAt(S2, 'фотографии'); const tReasons = wordAt(S2, 'пять');
  const rise = springIn(f, 30, 2, { damping: 18, stiffness: 90 });
  const tap = tTpl + 6;
  const toEditor = tap + 16;
  const kind = f < tPhoto - 2 ? 'video' : f < tReasons - 2 ? 'bg' : 'reasons';
  const reasons = ['За терпение', 'За поддержку в любой день', 'За тёплые ужины', 'За веру в меня', 'За всё, что не сказать словами'];
  const n = Math.max(0, Math.min(5, Math.floor((f - tReasons) / 9) + 1));
  const g = { ...momGift, words: n > 0 ? reasons.slice(0, n) : ['…'] };
  const hl = prog(f, tTpl, 12);
  const pressed = Math.sin(Math.min(1, Math.max(0, (f - tap) / 14)) * Math.PI);
  return (
    <AbsoluteFill>
      <WarmBg phase="night" />
      <Stars count={50} seed={9} />
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center' }}><Chip start={0} dark fontSize={32}>🌙 вечером · lovelink.my</Chip></div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 290, transform: `translateY(${(1 - rise) * 800}px)` }}>
        <PhoneFrame scale={1.2} statusColor={f < toEditor ? '#111' : '#fff'} glow="rgba(120,80,240,0.35)">
          {f < toEditor ? (
            <HomeScreen highlightIndex={1} highlightAmt={hl} pressedIndex={1} pressedAmt={pressed} />
          ) : (
            <GiftViewerScreen g={g} active={2} frame={f} editorButtons reasonIndex={0}>
              <EditorPanel kind={kind} open={prog(f, toEditor + 8, 12)} fileName={kind === 'video' && f > tVideo + 4 ? 'pozdravlenie_mame.mp4' : kind === 'bg' && f > tPhoto + 6 ? 'mama_i_ya_2019.jpg' : undefined} preset={1} titleValue="Мама, спасибо вам за всё" reasons={reasons.slice(0, n)} reasonInput={n < 5 && f >= tReasons ? typed(reasons[n], f, tReasons + n * 9, 30, 50) : ''} focusField={kind === 'reasons' ? 'reason' : 'none'} />
            </GiftViewerScreen>
          )}
          <Tap x={290} y={300} start={tap} />
        </PhoneFrame>
      </AbsoluteFill>
      <div style={{ position: 'absolute', right: 50, top: 760, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
        <Chip start={tVideo} dark fontSize={30}>🎬 видео</Chip>
        <Chip start={tPhoto} dark fontSize={30}>📷 фото</Chip>
        <Chip start={tReasons} dark fontSize={30}>🤍 5 причин</Chip>
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,7,22,0) 62%, rgba(7,7,22,0.9) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

/* scene 3 — QR in the bouquet */
const Qr: React.FC = () => {
  const f = useCurrentFrame();
  const b = springIn(f, 30, 0, { damping: 16 });
  const q = springIn(f, 30, wordAt(S3, 'вложили') - 8, { damping: 12 });
  const print = springIn(f, 30, 2);
  return (
    <AbsoluteFill>
      <WarmBg phase="evening" />
      <Bokeh count={14} colors={['#ffb199', '#fff', '#ffd6e0']} opacity={0.25} />
      <div style={{ position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - b) * 300}px)`, opacity: b }}>
        <Bouquet width={720}>
          <div style={{ position: 'absolute', left: 390, top: 420, transform: `translate(${(1 - q) * 300}px, ${(1 - q) * -500}px) rotate(${8 + (1 - q) * 30}deg)`, opacity: q }}><QrCard qr={staticFile('brand/qr-01-bg.png')} width={250} label="Для мамы 🤍" /></div>
        </Bouquet>
      </div>
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: print }}><Chip fontSize={32}>🖨 распечатали QR-код</Chip></div>
      <div style={{ position: 'absolute', top: 1250, left: 0, right: 0, textAlign: 'center', padding: '0 100px' }}>
        <BigText text="и вложили в букет" start={wordAt(S3, 'вложили')} stagger={5} fontSize={76} italic weight={400} />
      </div>
    </AbsoluteFill>
  );
};

/* scene 4 — morning: mom opens */
const Morning: React.FC = () => {
  const f = useCurrentFrame();
  const tCode = wordAt(S4, 'ввела'); const tSee = wordAt(S4, 'увидела');
  const step = 7;
  const filled = f < tCode ? 0 : Math.min(6, Math.floor((f - tCode) / step) + 1);
  const pressIdx = Math.floor((f - tCode) / step);
  const pressAmt = f >= tCode && pressIdx < 6 ? ((f - tCode) % step) / step : 0;
  const successAt = Math.max(tCode + step * 6 + 6, tSee - 6);
  const rise = springIn(f, 30, 2, { damping: 18, stiffness: 90 });
  const big = prog(f, successAt + 30, 20);
  return (
    <AbsoluteFill>
      <WarmBg phase="morning" />
      <Bokeh count={10} colors={['#fff', '#ffe0cc']} opacity={0.3} blur={20} />
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center' }}><Chip start={0} fontSize={32}>☀️ утром · телефон мамы</Chip></div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 290, transform: `translateY(${(1 - rise) * 800}px) scale(${1 + big * 0.06})`, transformOrigin: '50% 35%' }}>
        <PhoneFrame scale={1.2} statusColor="#fff" glow="rgba(248,72,136,0.3)">
          <PinLockScreen filled={filled} state={f >= successAt ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} successProgress={prog(f, successAt, 14)} giftIcon="🌸" giftTitle="Мама, спасибо вам за всё 🤍" giftText={<>С днём рождения! Я собрала для вас страницу: видео, наши фото и пять причин, за которые я благодарна.</>} />
        </PhoneFrame>
      </AbsoluteFill>
      <Confetti start={successAt} count={80} />
      <FloatingHearts count={10} start={successAt} colors={['#F84888', '#FDA4C4', '#fff']} />
    </AbsoluteFill>
  );
};

/* scene 5 — end */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const l = popIn(f, 30, wordAt(S5, 'создайте') - 10);
  const d = springIn(f, 30, wordAt(S5, 'lovelink') - 6, { damping: 14 });
  return (
    <AbsoluteFill>
      <WarmBg phase="morning" />
      <Bokeh count={10} colors={['#fff', '#ffe0cc', '#fbcfe8']} opacity={0.35} blur={22} />
      <FloatingHearts count={8} colors={['#F84888', '#FDA4C4']} />
      <div style={{ position: 'absolute', top: 420, left: 0, right: 0, textAlign: 'center', padding: '0 90px' }}>
        <BigText text="Эта страница останется у неё на годы." start={2} stagger={5} fontSize={84} weight={600} color="#171717" accentWords={['годы']} accentColor="#F84888" />
      </div>
      <div style={{ position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <div style={{ transform: `scale(${l})`, opacity: l, background: '#fff', borderRadius: 40, padding: '34px 56px', boxShadow: '0 20px 34px rgba(248,72,136,0.2)' }}><Logo width={520} /></div>
        <div style={{ opacity: d, transform: `translateY(${(1 - d) * 40}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <Domain size={92} gradient />
          <div style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 36, color: '#404040' }}>создайте свою страницу-подарок</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Video004: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#2b1430' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-004-music.mp3" bed={0.42} duck={0.14} />
      <SceneSeq scene={S0} fadeIn={false}><Intro /></SceneSeq>
      <SceneSeq scene={S1}><Flowers /></SceneSeq>
      <SceneSeq scene={S2}><Build /></SceneSeq>
      <SceneSeq scene={S3}><Qr /></SceneSeq>
      <SceneSeq scene={S4}><Morning /></SceneSeq>
      <SceneSeq scene={S5} overlap={30}><End /></SceneSeq>
      <Captions timeline={tl} variant="pill" bottom={440} fontSize={48} accent="#FDA4C4" hideScenes={[5]} />
    </AbsoluteFill>
  );
};
