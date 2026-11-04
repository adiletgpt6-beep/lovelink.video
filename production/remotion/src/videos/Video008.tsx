import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL008 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn } from '../lib/anim';
import { Grain } from '../ui/Backgrounds';
import { Confetti } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip, StepBadge } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { Layer3D } from '../ui/Layer3D';
import { Postcard } from '../ui/Postcard';
import { ScanScreen } from '../ui/Scan';
import { PinLockScreen } from '../screens/PinLockScreen';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { TemplateCard } from '../screens/Templates';
import { TEMPLATES, clientGift, momGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt, wordStarts } from './common';

const tl = TL008;
const [S0, S1, S2, S3, S4] = tl.scenes;

/** Bright modern flower-shop backdrop: warm white, mint and brand pink shapes. */
const ShopBg: React.FC<{ tone?: 'light' | 'pink' }> = ({ tone = 'light' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: tone === 'light' ? 'linear-gradient(180deg,#fffdf9 0%,#fff1f5 100%)' : 'linear-gradient(160deg,#F84888 0%,#c13a9a 55%,#7850F0 100%)' }}>
      <div style={{ position: 'absolute', left: -200, top: 100 + Math.sin(f / 80) * 20, width: 700, height: 700, borderRadius: '50%', background: tone === 'light' ? 'radial-gradient(circle closest-side, rgba(187,247,208,0.7) 0%, rgba(187,247,208,0) 100%)' : 'radial-gradient(circle closest-side, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)' }} />
      <div style={{ position: 'absolute', right: -220, top: 900 + Math.cos(f / 70) * 20, width: 760, height: 760, borderRadius: '50%', background: tone === 'light' ? 'radial-gradient(circle closest-side, rgba(251,207,232,0.8) 0%, rgba(251,207,232,0) 100%)' : 'radial-gradient(circle closest-side, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)' }} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ children: React.ReactNode; start?: number; color?: string }> = ({ children, start = 0, color = '#0a0a0a' }) => {
  const f = useCurrentFrame(); const p = springIn(f, 30, start, { damping: 13 });
  return <div style={{ display: 'inline-block', padding: '16px 30px', borderRadius: 18, background: color, color: color === '#0a0a0a' ? '#fff' : '#0a0a0a', fontFamily: font.bold, fontWeight: 700, fontSize: 34, letterSpacing: -0.5, boxShadow: '0 14px 30px rgba(0,0,0,0.15)', transform: `scale(${p}) rotate(-2deg)`, opacity: p }}>{children}</div>;
};

/* S0 — your flower shop can give more than flowers */
const Hero: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ShopBg />
      <Layer3D id="L008-bouquet" style={{ transform: 'translateY(120px)' }} />
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, padding: '0 70px' }}>
        <BigText text="Ваш цветочный магазин может дарить больше" starts={wordStarts(S0).slice(0, 6)} fontFamily={font.bold} fontSize={76} weight={900} color="#0a0a0a" lineHeight={1.05} letterSpacing={-2} reveal="up" accentWords={['больше']} accentColor="#F84888" />
      </div>
      <div style={{ position: 'absolute', left: 60, top: 1250 }}><Tag start={wordAt(S0, 'цветы') - 2}>букет</Tag></div>
      <div style={{ position: 'absolute', left: 300, top: 1250, fontFamily: font.bold, fontSize: 60, color: '#0a0a0a', opacity: prog(f, wordAt(S0, 'цветы') + 6, 8) }}>+</div>
      <div style={{ position: 'absolute', left: 380, top: 1250 }}><Tag start={wordAt(S0, 'цветы') + 8} color="#F84888">открытка LoveLink</Tag></div>
    </AbsoluteFill>
  );
};

/* S1 — the card: QR + six-digit code */
const CardScene: React.FC = () => {
  const f = useCurrentFrame();
  const tQr = wordAt(S1, 'qr'); const tCode = wordAt(S1, 'шестизначный');
  const inP = springIn(f, 30, 0, { damping: 15, stiffness: 80 });
  return (
    <AbsoluteFill>
      <ShopBg />
      <Layer3D id="L008-bouquet" offset={150} speed={0.5} opacity={0.5} style={{ transform: 'scale(1.25) translateY(420px)' }} />
      <div style={{ position: 'absolute', left: 540, top: 820, transform: `translate(-50%,-50%) rotate(${-4 + 4 * inP}deg) scale(${1.5 * (0.85 + 0.15 * inP)})`, opacity: inP }}>
        <Postcard variant="blush" revealed={prog(f, tCode, 24)} rotX={6} rotY={-8} sweep={prog(f, 10, 50)} />
      </div>
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><StepBadge text="Добавьте открытку к букету" start={2} /></div>
      <div style={{ position: 'absolute', left: 70, top: 1210 }}><Tag start={tQr}>QR-код</Tag></div>
      <div style={{ position: 'absolute', right: 70, top: 1210 }}><Tag start={tCode} color="#F84888">код из 6 цифр</Tag></div>
      <div style={{ position: 'absolute', top: 1330, left: 0, right: 0, textAlign: 'center', fontFamily: font.caption, fontWeight: 700, fontSize: 32, color: '#404040', opacity: prog(f, tCode + 14, 10) }}>два разных элемента: QR ведёт на страницу, код открывает послание</div>
    </AbsoluteFill>
  );
};

/* S2 — client records, recipient opens */
const Flow: React.FC = () => {
  const f = useCurrentFrame();
  const tRecord = wordAt(S2, 'записывает'); const tOpen = wordAt(S2, 'открывает'); const tScan = wordAt(S2, 'отсканировав'); const tSix = wordAt(S2, 'шесть');
  const step = 6;
  const filled = f < tSix ? 0 : Math.min(6, Math.floor((f - tSix) / step) + 1);
  const pressIdx = Math.floor((f - tSix) / step);
  const pressAmt = f >= tSix && pressIdx < 6 ? ((f - tSix) % step) / step : 0;
  const successAt = tSix + step * 6 + 10;
  const left = springIn(f, 30, 0, { damping: 15, stiffness: 90 });
  const right = springIn(f, 30, tOpen - 10, { damping: 15, stiffness: 90 });
  return (
    <AbsoluteFill>
      <ShopBg />
      <div style={{ position: 'absolute', left: 50, top: 300, transform: `translateX(${(1 - left) * -600}px)` }}>
        <PhoneFrame scale={1.0} statusColor="#fff" glow="rgba(248,72,136,0.2)">
          <GiftViewerScreen g={clientGift} active={0} frame={f} playing={f > tRecord} editorButtons seed={2} heroSeed={6} />
        </PhoneFrame>
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}><Chip start={tRecord} fontSize={28}>🎬 клиент записывает</Chip></div>
      </div>
      <div style={{ position: 'absolute', right: 50, top: 560, transform: `translateX(${(1 - right) * 600}px)` }}>
        <PhoneFrame scale={1.0} statusColor="#fff" glow="rgba(120,80,240,0.25)">
          {f < tSix - 6 ? <ScanScreen t={f / 30} recognized={f >= tSix - 20} /> : <PinLockScreen filled={filled} state={f >= successAt ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} successProgress={prog(f, successAt, 12)} giftIcon="🤍" giftTitle="Спасибо, что вы с нами" giftText={<>Видео от команды и несколько тёплых слов — специально для вас.</>} />}
        </PhoneFrame>
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}><Chip start={tScan} fontSize={28}>📷 QR → 🔢 6 цифр</Chip></div>
      </div>
      <Confetti start={successAt} count={60} />
    </AbsoluteFill>
  );
};

/* S3 — for the shop: templates + plans */
const ForShop: React.FC = () => {
  const f = useCurrentFrame();
  const tTpl = wordAt(S3, 'готовые'); const tPlans = wordAt(S3, 'тарифы');
  const items = [TEMPLATES[1], TEMPLATES[5], TEMPLATES[0], TEMPLATES[4]];
  const rows = [['Start', '$10', '30 страниц · 1 год'], ['Business', '$50', '300 страниц · 2 года'], ['Pro', '$100', '1000 страниц · 3 года']];
  return (
    <AbsoluteFill>
      <ShopBg />
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><StepBadge text="Для магазина" start={0} /></div>
      <div style={{ position: 'absolute', top: 330, left: 70, right: 70, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 18 }}>
        {items.map((t, i) => { const p = springIn(f, 30, tTpl - 4 + i * 5, { damping: 14 }); return <div key={i} style={{ transform: `translateY(${(1 - p) * 200}px)`, opacity: p }}><div style={{ zoom: 1.2 } as React.CSSProperties}><TemplateCard {...t} /></div></div>; })}
      </div>
      <div style={{ position: 'absolute', top: 700, left: 0, right: 0, textAlign: 'center', fontFamily: font.bold, fontWeight: 700, fontSize: 38, color: '#0a0a0a', opacity: prog(f, tTpl, 10) }}>готовые шаблоны для любого повода</div>
      <div style={{ position: 'absolute', top: 870, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map((r, i) => { const p = springIn(f, 30, tPlans - 4 + i * 6, { damping: 14 }); const dark = i === 1; return (
          <div key={r[0]} style={{ opacity: p, transform: `translateX(${(1 - p) * 120}px)`, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 28px', borderRadius: 22, background: dark ? '#0a0a0a' : '#fff', color: dark ? '#fff' : '#0a0a0a', boxShadow: '0 14px 30px rgba(0,0,0,0.08)', border: dark ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
            <span style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', width: 160, opacity: 0.6 }}>{r[0]}</span>
            <span style={{ fontFamily: font.bold, fontWeight: 700, fontSize: 42, width: 140 }}>{r[1]}</span>
            <span style={{ fontFamily: font.caption, fontWeight: 600, fontSize: 27, opacity: 0.85 }}>{r[2]}</span>
            {dark && <span style={{ marginLeft: 'auto', fontFamily: font.caption, fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color: '#FDA4C4' }}>для салонов</span>}
          </div>); })}
      </div>
      <div style={{ position: 'absolute', top: 1265, left: 70, right: 70, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip start={tPlans + 16} fontSize={28}>код для редактирования — клиенту</Chip>
        <Chip start={tPlans + 22} fontSize={28}>страницы хранятся 30 лет</Chip>
        <Chip start={tPlans + 28} fontSize={28}>поддержка в WhatsApp</Chip>
      </div>
    </AbsoluteFill>
  );
};

/* S4 — sell experiences, not just flowers */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const tDomain = wordAt(S4, 'lovelink') - 6;
  const d = springIn(f, 30, tDomain, { damping: 14 });
  const l = popIn(f, 30, tDomain - 12);
  return (
    <AbsoluteFill>
      <ShopBg tone="pink" />
      <Layer3D id="L008-bouquet" offset={200} speed={0.7} style={{ transform: 'translateY(300px) scale(1.05)' }} />
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, padding: '0 70px' }}>
        <BigText text="Продавайте не просто цветы. Дарите впечатления." starts={wordStarts(S4).slice(0, 6)} fontFamily={font.bold} fontSize={80} weight={900} color="#fff" lineHeight={1.05} letterSpacing={-2} reveal="up" />
      </div>
      <div style={{ position: 'absolute', top: 1320, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ transform: `scale(${l})`, opacity: l, background: '#fff', borderRadius: 30, padding: '20px 40px', boxShadow: '0 20px 34px rgba(0,0,0,0.25)' }}><Logo width={340} /></div>
        <div style={{ opacity: d, transform: `translateY(${(1 - d) * 30}px)` }}><Domain size={78} /></div>
      </div>
    </AbsoluteFill>
  );
};

export const Video008: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-008-music.mp3" bed={0.5} duck={0.16} />
      <SceneSeq scene={S0} fadeIn={false}><Hero /></SceneSeq>
      <SceneSeq scene={S1}><CardScene /></SceneSeq>
      <SceneSeq scene={S2}><Flow /></SceneSeq>
      <SceneSeq scene={S3}><ForShop /></SceneSeq>
      <SceneSeq scene={S4} overlap={30}><End /></SceneSeq>
      <Captions timeline={tl} variant="pill" bottom={300} fontSize={46} accent="#FDA4C4" hideScenes={[0, 4]} fontFamily={font.bold} fontWeight={700} maxWords={4} maxChars={24} />
    </AbsoluteFill>
  );
};
