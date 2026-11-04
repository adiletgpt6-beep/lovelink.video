import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL005 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn } from '../lib/anim';
import { BrandBg, LightBg } from '../ui/Backgrounds';
import { Confetti, FloatingHearts, LightSweep } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { HomeScreen } from '../screens/Templates';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { EditorPanel } from '../screens/EditorScreen';
import { PublishModal } from '../screens/PublishModal';
import { PinLockScreen } from '../screens/PinLockScreen';
import { PlanCard } from '../screens/PricingScreen';
import { Bouquet, QrCard } from '../ui/Illustrations';
import { loveGift, momGift, DEMO_GIFT } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt } from './common';

const tl = TL005;
const [S0, S1, S2, S3, S4, S5] = tl.scenes;

/* scene 0 — hook */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['🧸', '🍫', '🎈'];
  const tForget = wordAt(S0, 'забудут');
  const zoom = 1 + prog(f, 0, 100, easeOut) * 0.08;
  return (
    <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
      <BrandBg dark />
      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40 }}>
        {items.map((it, i) => {
          const p = springIn(f, 30, 2 + i * 4, { damping: 11, stiffness: 180 });
          const gone = prog(f, tForget + i * 3, 10);
          return <div key={i} style={{ fontSize: 170, transform: `scale(${p * (1 - gone * 0.4)}) rotate(${(i - 1) * 12 + gone * 30}deg) translateY(${gone * 120}px)`, opacity: p * (1 - gone), filter: `grayscale(${gone})` }}>{it}</div>;
        })}
      </div>
      <div style={{ position: 'absolute', top: 640, left: 0, right: 0, padding: '0 80px' }}>
        <BigText text="Хватит дарить то, что забудут через неделю" start={2} stagger={3} fontFamily={font.bold} fontSize={88} weight={900} uppercase lineHeight={1.05} letterSpacing={-2} reveal="up" accentWords={['забудут']} accentColor="#F84888" />
      </div>
      <LightSweep period={90} />
    </AbsoluteFill>
  );
};

/* scene 1 — what it is */
const What: React.FC = () => {
  const f = useCurrentFrame();
  const tV = wordAt(S1, 'видео'); const tP = wordAt(S1, 'фото'); const tW = wordAt(S1, 'слова'); const tPass = wordAt(S1, 'паролю');
  const rise = springIn(f, 30, 0, { damping: 16, stiffness: 100 });
  const active = prog(f, tP - 2, 14) + prog(f, Math.max(tW - 2, tP + 14), 14);
  const lock = springIn(f, 30, tPass - 6, { damping: 12 });
  return (
    <AbsoluteFill>
      <BrandBg />
      <div style={{ position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><div style={{ background: '#fff', borderRadius: 28, padding: '18px 34px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', opacity: rise }}><Logo width={340} /></div></div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 330, transform: `translateY(${(1 - rise) * 700}px)` }}>
        <PhoneFrame scale={1.3} statusColor="#fff" glow="rgba(255,255,255,0.35)"><GiftViewerScreen g={loveGift} active={active} frame={f} playing={f > tV - 8} seed={7} /></PhoneFrame>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 50, top: 560 }}><Chip start={tV} fontSize={32}>🎬 видео</Chip></div>
      <div style={{ position: 'absolute', right: 50, top: 780 }}><Chip start={tP} fontSize={32}>📷 фото</Chip></div>
      <div style={{ position: 'absolute', left: 50, top: 1000 }}><Chip start={tW} fontSize={32}>💌 слова</Chip></div>
      <div style={{ position: 'absolute', right: 40, top: 1180, transform: `scale(${lock})`, opacity: lock }}>
        <div style={{ background: '#0a0a0a', color: '#fff', borderRadius: 28, padding: '20px 30px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}><span style={{ fontSize: 40 }}>🔒</span><div style={{ fontFamily: font.caption, fontWeight: 800, fontSize: 30 }}>по паролю<div style={{ fontFamily: font.mono, fontSize: 34, letterSpacing: 8, marginTop: 4 }}>{DEMO_GIFT.code}</div></div></div>
      </div>
    </AbsoluteFill>
  );
};

/* scene 2 — three steps */
const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = wordAt(S2, 'выбираете'); const t2 = wordAt(S2, 'меняете'); const t3 = wordAt(S2, 'нажимаете'); const tDone = wordAt(S2, 'готово');
  const steps = [
    { t: t1, label: '1 · Шаблон', node: <HomeScreen highlightIndex={1} highlightAmt={1} />, status: '#111' },
    { t: t2, label: '2 · Редактор', node: <GiftViewerScreen g={momGift} active={2} frame={f} editorButtons><EditorPanel kind="reasons" open={1} titleValue="Мама, спасибо вам за всё" reasons={['За терпение', 'За поддержку']} /></GiftViewerScreen>, status: '#fff' },
    { t: t3, label: '3 · Сохранить', node: <GiftViewerScreen g={momGift} active={2} frame={f}><PublishModal open={1} highlight="code" /></GiftViewerScreen>, status: '#fff' },
  ];
  const done = popIn(f, 30, tDone - 2);
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center', fontFamily: font.bold, fontWeight: 900, fontSize: 72, color: '#0a0a0a', letterSpacing: -2 }}>ТРИ ШАГА</div>
      <div style={{ position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0 }}>
        {steps.map((s, i) => {
          const p = springIn(f, 30, Math.max(0, s.t - 6), { damping: 14, stiffness: 150 });
          const focus = i === 0 ? (f < t2 ? 1 : 0.88) : i === 1 ? (f >= t2 && f < t3 ? 1 : 0.88) : f >= t3 ? 1 : 0.88;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, transform: `translateY(${(1 - p) * 400}px) scale(${focus})`, opacity: p, marginLeft: i ? -40 : 0, zIndex: focus === 1 ? 3 : 1 }}>
              <PhoneFrame scale={0.82} statusColor={s.status} glow="rgba(120,80,240,0.2)">{s.node}</PhoneFrame>
              <Chip fontSize={30} start={Math.max(0, s.t - 6)}>{s.label}</Chip>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${done})`, opacity: done }}>
        <div style={{ background: 'linear-gradient(90deg,#F84888,#7850F0)', color: '#fff', borderRadius: 999, padding: '26px 60px', fontFamily: font.bold, fontWeight: 900, fontSize: 64, boxShadow: '0 30px 80px rgba(120,80,240,0.35)' }}>ГОТОВО ✓</div>
      </div>
    </AbsoluteFill>
  );
};

/* scene 3 — share & open */
const Share: React.FC = () => {
  const f = useCurrentFrame();
  const tLink = wordAt(S3, 'ссылку'); const tQr = wordAt(S3, 'qr-код'); const tCode = wordAt(S3, 'вводит'); const tMoment = wordAt(S3, 'момент');
  const bubble = springIn(f, 30, tLink - 4, { damping: 13 });
  const bq = springIn(f, 30, tQr - 6, { damping: 14 });
  const step = 6;
  const filled = f < tCode ? 0 : Math.min(6, Math.floor((f - tCode) / step) + 1);
  const pressIdx = Math.floor((f - tCode) / step);
  const pressAmt = f >= tCode && pressIdx < 6 ? ((f - tCode) % step) / step : 0;
  const successAt = Math.max(tCode + step * 6 + 6, tMoment - 10);
  const phoneIn = springIn(f, 30, tCode - 20, { damping: 16, stiffness: 100 });
  return (
    <AbsoluteFill>
      <BrandBg dark />
      <div style={{ position: 'absolute', top: 220, left: 70, right: 70, opacity: bubble, transform: `translateY(${(1 - bubble) * 60}px) scale(${0.9 + 0.1 * bubble})` }}>
        <div style={{ alignSelf: 'flex-end', background: '#2f6bff', color: '#fff', borderRadius: 34, borderBottomRightRadius: 10, padding: '26px 34px', fontFamily: font.ui, fontSize: 36, lineHeight: 1.3, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginLeft: 120 }}>Открой, это для тебя 🤍<br /><span style={{ textDecoration: 'underline', opacity: 0.9 }}>{DEMO_GIFT.url}</span></div>
        <div style={{ textAlign: 'right', marginTop: 10, fontFamily: font.caption, fontSize: 26, color: 'rgba(255,255,255,0.55)' }}>Доставлено · 21:16</div>
      </div>
      <div style={{ position: 'absolute', top: 440, left: -40, transform: `translateY(${(1 - bq) * 300}px) rotate(-10deg)`, opacity: bq }}>
        <Bouquet width={440}><div style={{ position: 'absolute', left: 250, top: 260, transform: 'rotate(10deg)' }}><QrCard qr={staticFile('brand/qr-02-bg.png')} width={170} /></div></Bouquet>
      </div>
      <div style={{ position: 'absolute', top: 520, right: 60, transform: `translateY(${(1 - phoneIn) * 900}px)`, opacity: phoneIn }}>
        <PhoneFrame scale={1.05} statusColor="#fff" glow="rgba(248,72,136,0.35)">
          <PinLockScreen filled={filled} state={f >= successAt ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} successProgress={prog(f, successAt, 12)} giftIcon="🤍" giftTitle="Для тебя 🤍" giftText={<>Открой — я собрал это специально для тебя.</>} />
        </PhoneFrame>
      </div>
      <Confetti start={successAt} count={80} />
      <FloatingHearts count={10} start={successAt} colors={['#F84888', '#FDA4C4', '#fff']} />
      <div style={{ position: 'absolute', top: 1180, left: 0, right: 0, textAlign: 'center', padding: '0 80px' }}>
        <BigText text="тот самый момент" start={tMoment} stagger={4} fontFamily={font.bold} fontSize={70} weight={900} uppercase letterSpacing={-1} reveal="pop" />
      </div>
    </AbsoluteFill>
  );
};

/* scene 4 — free + pricing */
const Price: React.FC = () => {
  const f = useCurrentFrame();
  const tPlans = wordAt(S4, 'тарифы');
  const free = springIn(f, 30, 2, { damping: 12 });
  const plans = [
    { name: 'Start', price: '$10', tagline: 'Для онлайн-подарков близким', dark: false, badge: null, features: ['До 30 страниц-подарков', 'Тариф активен 1 год', 'Страницы хранятся 30 лет'] },
    { name: 'Business', price: '$50', tagline: 'Для магазинов подарков и цветочных салонов', dark: true, badge: 'Популярный', features: ['До 300 страниц-подарков', 'Тариф активен 2 года', 'Страницы хранятся 30 лет'] },
    { name: 'Pro', price: '$100', tagline: 'Для сети точек и высокого объёма заказов', dark: false, badge: null, features: ['До 1000 страниц-подарков', 'Тариф активен 3 года', 'Страницы хранятся 30 лет'] },
  ];
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, transform: `scale(${free})`, opacity: free }}>
        <div style={{ fontFamily: font.bold, fontWeight: 900, fontSize: 92, color: '#0a0a0a', letterSpacing: -3 }}>БЕСПЛАТНО</div>
        <div style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 36, color: '#404040', textAlign: 'center' }}>попробовать можно без оплаты</div>
      </div>
      <div style={{ position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, padding: '0 40px' }}>
        {plans.map((p, i) => {
          const s = springIn(f, 30, Math.max(0, tPlans - 6 + i * 5), { damping: 14 });
          return <div key={p.name} style={{ width: 330, opacity: s, transform: `translateY(${(1 - s) * 200}px)` }}><div style={{ zoom: 1.05 } as React.CSSProperties}><PlanCard plan={p} highlight={i === 0 ? prog(f, tPlans + 20, 10) : 0} /></div></div>;
        })}
      </div>
      <div style={{ position: 'absolute', top: 1230, left: 0, right: 0, textAlign: 'center', padding: '0 80px' }}>
        <BigText text="тарифы — от $10 в год" start={tPlans + 6} stagger={4} fontFamily={font.bold} fontSize={60} weight={700} color="#0a0a0a" reveal="up" letterSpacing={-1} accentWords={['10']} accentColor="#F84888" />
      </div>
    </AbsoluteFill>
  );
};

/* scene 5 — CTA */
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const l = popIn(f, 30, 2); const d = springIn(f, 30, wordAt(S5, 'lovelink') - 6, { damping: 14 }); const b = springIn(f, 30, wordAt(S5, 'создайте') - 4, { damping: 12 });
  const pulse = 1 + 0.03 * Math.sin(f / 6);
  return (
    <AbsoluteFill>
      <BrandBg />
      <FloatingHearts count={10} colors={['#fff', '#FDA4C4']} />
      <div style={{ position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>
        <div style={{ background: '#fff', borderRadius: 40, padding: '40px 60px', transform: `scale(${l})`, boxShadow: '0 40px 100px rgba(0,0,0,0.25)' }}><Logo width={560} /></div>
        <div style={{ opacity: d, transform: `translateY(${(1 - d) * 40}px)` }}><Domain size={100} /></div>
        <div style={{ opacity: b, transform: `scale(${b * pulse})`, background: '#0a0a0a', color: '#fff', borderRadius: 999, padding: '30px 64px', fontFamily: font.bold, fontWeight: 700, fontSize: 48, boxShadow: '0 30px 80px rgba(0,0,0,0.35)' }}>Создать подарок →</div>
        <div style={{ opacity: b, fontFamily: font.caption, fontWeight: 700, fontSize: 34, color: 'rgba(255,255,255,0.9)' }}>шаблон · ваш контент · ссылка, QR и пароль</div>
      </div>
    </AbsoluteFill>
  );
};

export const Video005: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#06040f' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-005-music.mp3" bed={0.5} duck={0.16} />
      <SceneSeq scene={S0} fadeIn={false}><Hook /></SceneSeq>
      <SceneSeq scene={S1}><What /></SceneSeq>
      <SceneSeq scene={S2}><Steps /></SceneSeq>
      <SceneSeq scene={S3}><Share /></SceneSeq>
      <SceneSeq scene={S4}><Price /></SceneSeq>
      <SceneSeq scene={S5} overlap={30}><Cta /></SceneSeq>
      <Captions timeline={tl} variant="pill" bottom={300} fontSize={48} accent="#FDA4C4" hideScenes={[0, 5]} fontFamily={font.caption} />
    </AbsoluteFill>
  );
};
