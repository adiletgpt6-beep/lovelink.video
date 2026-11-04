import React from 'react';
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL003 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn } from '../lib/anim';
import { BrandBg, LightBg } from '../ui/Backgrounds';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { BigText, Chip, SectionNumber } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { TemplateCard } from '../screens/Templates';
import { FirstCard, ThirdCard, CARD_W, CARD_H, GiftViewerScreen } from '../screens/GiftViewer';
import { ArtPhoto } from '../ui/ArtPhoto';
import { Bouquet, LockIcon, QrCard } from '../ui/Illustrations';
import { TEMPLATES, loveGift, momGift, DEMO_GIFT } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt } from './common';

const tl = TL003;
const PLAN_ROWS = [
  { name: 'Start', price: '$10', note: '30 страниц · 1 год', dark: false },
  { name: 'Business', price: '$50', note: '300 страниц · 2 года', dark: true },
  { name: 'Pro', price: '$100', note: '1000 страниц · 3 года', dark: false },
];
const [S0, S1, S2, S3, S4, S5, S6] = tl.scenes;

const Strike: React.FC<{ p: number }> = ({ p }) => <div style={{ position: 'absolute', left: '-4%', top: '50%', height: 14, width: `${p * 108}%`, background: '#fff', borderRadius: 8, transform: 'translateY(-50%) rotate(-6deg)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }} />;

/* scene 0 — hook: открытка / цветы / страница */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = wordAt(S0, 'цветы'); const t2 = wordAt(S0, 'а') > 0 ? wordAt(S0, 'страница') : 90;
  const phase = f < t1 ? 0 : f < t2 ? 1 : 2;
  const k = phase === 0 ? f : phase === 1 ? f - t1 : f - t2;
  const inP = popIn(k, 30, 0);
  const strike = prog(k, 16, 10);
  const rise = springIn(f, 30, t2 + 6, { damping: 16, stiffness: 110 });
  return (
    <AbsoluteFill>
      <BrandBg dark={phase === 2} />
      {phase < 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 260, transform: `scale(${inP})` }}>{phase === 0 ? '💌' : '💐'}</div>
          <div style={{ position: 'relative', marginTop: 40, transform: `scale(${inP})` }}>
            <div style={{ fontFamily: font.bold, fontWeight: 900, fontSize: 108, color: '#fff', letterSpacing: -2, textTransform: 'uppercase', lineHeight: 1 }}>{phase === 0 ? 'Открытка' : 'Цветы'}</div>
            <Strike p={strike} />
          </div>
          <div style={{ marginTop: 30, fontFamily: font.caption, fontWeight: 700, fontSize: 48, color: 'rgba(255,255,255,0.85)', opacity: strike }}>{phase === 0 ? 'забудут' : 'завянут'}</div>
        </AbsoluteFill>
      )}
      {phase === 2 && (
        <AbsoluteFill>
          <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', transform: `scale(${inP})` }}>
            <div style={{ fontFamily: font.bold, fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: -2, textTransform: 'uppercase', lineHeight: 1.05 }}>Страница-<br />подарок</div>
            <div style={{ marginTop: 24, fontFamily: font.bold, fontWeight: 700, fontSize: 56, color: '#FDA4C4' }}>останется ✓</div>
          </div>
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 620, transform: `translateY(${(1 - rise) * 900}px)` }}>
            <PhoneFrame scale={1.25} statusColor="#fff" glow="rgba(248,72,136,0.4)"><GiftViewerScreen g={loveGift} active={0} frame={f} playing /></PhoneFrame>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* scene 1 — 01 шаблоны */
const Templates: React.FC = () => {
  const f = useCurrentFrame();
  const items = [TEMPLATES[0], TEMPLATES[1], TEMPLATES[4], TEMPLATES[5], TEMPLATES[6], TEMPLATES[3]];
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: 'absolute', top: 210, left: 80 }}><SectionNumber n="01" title="Готовые шаблоны" color="#0a0a0a" numberColor="rgba(120,80,240,0.35)" /></div>
      <div style={{ position: 'absolute', top: 400, left: 90, right: 90, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 26 }}>
        {items.map((t, i) => {
          const p = springIn(f, 30, 8 + i * 6, { damping: 14, stiffness: 140 });
          return <div key={i} style={{ transform: `translateY(${(1 - p) * 300}px) rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg) scale(1.0)`, opacity: p, transformOrigin: 'center' }}><div style={{ width: 290, transform: 'scale(1.0)' }}><div style={{ zoom: 1.6 } as React.CSSProperties}><TemplateCard {...t} /></div></div></div>;
        })}
      </div>
      <div style={{ position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', padding: '0 70px' }}>
        {['Для девушки', 'Для парня', 'Для мамы', 'Для папы', 'Для друга', 'Для клиента'].map((c, i) => <Chip key={c} start={20 + i * 4} fontSize={26}><span style={{ width: 10, height: 10, borderRadius: 99, background: '#fb7185', display: 'inline-block' }} />{c}</Chip>)}
      </div>
    </AbsoluteFill>
  );
};

/* scene 2 — 02 ваш контент */
const Content: React.FC = () => {
  const f = useCurrentFrame();
  const tV = wordAt(S2, 'видео'); const tP = wordAt(S2, 'фото'); const tW = wordAt(S2, 'слова');
  const tiles = [
    { t: tV, label: 'ВИДЕО', node: <FirstCard g={loveGift} playing frame={f} seed={31} /> },
    { t: tP, label: 'ФОТО', node: <ArtPhoto variant="rose" seed={32} style={{ position: 'absolute', inset: 0, borderRadius: 28 }}><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110 }}>📷</div></ArtPhoto> },
    { t: tW, label: 'СЛОВА', node: <ThirdCard g={loveGift} reasonIndex={2} seed={33} /> },
  ];
  return (
    <AbsoluteFill>
      <BrandBg angle={160} />
      <div style={{ position: 'absolute', top: 210, left: 80 }}><SectionNumber n="02" title="Ваш контент" /></div>
      <div style={{ position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 18 }}>
        {tiles.map((tile, i) => {
          const p = springIn(f, 30, Math.max(0, tile.t - 6), { damping: 13, stiffness: 160 });
          const scale = i === 1 ? 1.12 : 1;
          return (
            <div key={i} style={{ transform: `translateY(${(1 - p) * 500}px) scale(${scale})`, opacity: p, transformOrigin: 'bottom center' }}>
              <div style={{ position: 'relative', width: CARD_W * 1.15, height: CARD_H * 1.15, borderRadius: 32, overflow: 'hidden', boxShadow: '0 20px 34px rgba(0,0,0,0.35)' }}><div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: CARD_H, transform: 'scale(1.15)', transformOrigin: 'top left' }}>{tile.node}</div></div>
              <div style={{ marginTop: 22, textAlign: 'center', fontFamily: font.bold, fontWeight: 700, fontSize: 36, color: '#fff' }}>{tile.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 1180, left: 0, right: 0, textAlign: 'center', padding: '0 90px' }}>
        <BigText text="а не чужой текст с открытки" start={tW + 8} stagger={3} fontFamily={font.bold} fontSize={54} weight={700} reveal="up" letterSpacing={-1} />
      </div>
    </AbsoluteFill>
  );
};

/* scene 3 — 03 личный доступ */
const Access: React.FC = () => {
  const f = useCurrentFrame();
  const tL = wordAt(S3, 'ссылка'); const tQ = wordAt(S3, 'qr'); const tP = wordAt(S3, 'пароль');
  const pL = springIn(f, 30, tL - 4); const pQ = springIn(f, 30, tQ - 4); const pP = springIn(f, 30, tP - 4);
  const filled = Math.min(6, Math.max(0, Math.floor((f - tP) / 5)));
  const lock = popIn(f, 30, 2);
  return (
    <AbsoluteFill>
      <BrandBg dark />
      <div style={{ position: 'absolute', top: 210, left: 80 }}><SectionNumber n="03" title="Личный доступ" dark /></div>
      <div style={{ position: 'absolute', top: 390, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${lock})` }}><div style={{ width: 160, height: 160, borderRadius: 48, background: 'linear-gradient(135deg,#F84888,#7850F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 34px rgba(248,72,136,0.4)' }}><LockIcon size={90} /></div></div>
      <div style={{ position: 'absolute', top: 620, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ opacity: pL, transform: `translateX(${(1 - pL) * -120}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '26px 34px', borderRadius: 28, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontFamily: font.bold, fontSize: 30, color: '#FDA4C4', width: 170 }}>ССЫЛКА</span>
          <span style={{ fontFamily: font.mono, fontSize: 32, color: '#fff' }}>{DEMO_GIFT.url}</span>
        </div>
        <div style={{ opacity: pQ, transform: `translateX(${(1 - pQ) * 120}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '26px 34px', borderRadius: 28, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontFamily: font.bold, fontSize: 30, color: '#FDA4C4', width: 170 }}>QR-КОД</span>
          <img src={staticFile('brand/qr-02-bg.png')} alt="QR" style={{ width: 170, height: 170, borderRadius: 18 }} />
          <span style={{ fontFamily: font.caption, fontSize: 30, color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>13 стилей<br />с фоном и без</span>
        </div>
        <div style={{ opacity: pP, transform: `translateX(${(1 - pP) * -120}px)`, display: 'flex', alignItems: 'center', gap: 20, padding: '26px 34px', borderRadius: 28, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontFamily: font.bold, fontSize: 30, color: '#FDA4C4', width: 170 }}>ПАРОЛЬ</span>
          <div style={{ display: 'flex', gap: 14 }}>{DEMO_GIFT.code.split('').map((d, i) => <span key={i} style={{ width: 78, height: 96, borderRadius: 18, background: i < filled ? '#fff' : 'rgba(255,255,255,0.12)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.bold, fontSize: 48, fontWeight: 700 }}>{i < filled ? d : ''}</span>)}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, textAlign: 'center', padding: '0 90px' }}>
        <BigText text="увидит только адресат" start={tP + 30} stagger={4} fontFamily={font.bold} fontSize={58} weight={700} reveal="up" letterSpacing={-1} />
      </div>
    </AbsoluteFill>
  );
};

/* scene 4 — 04 тридцать лет */
const Years: React.FC = () => {
  const f = useCurrentFrame();
  const t = wordAt(S4, 'тридцать') - 4;
  const n = Math.round(interpolate(f, [t, t + 40], [1, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut }));
  const ring = interpolate(f, [t, t + 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  const R = 300; const C = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <BrandBg angle={110} />
      <div style={{ position: 'absolute', top: 210, left: 80 }}><SectionNumber n="04" title="Хранение" /></div>
      <div style={{ position: 'absolute', top: 480, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 720, height: 720 }}>
          <svg width="720" height="720" viewBox="0 0 720 720" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="360" cy="360" r={R} stroke="rgba(255,255,255,0.18)" strokeWidth="26" fill="none" />
            <circle cx="360" cy="360" r={R} stroke="#fff" strokeWidth="26" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: font.bold, fontWeight: 900, fontSize: 300, color: '#fff', lineHeight: 1, letterSpacing: -10 }}>{n}</div>
            <div style={{ fontFamily: font.bold, fontWeight: 700, fontSize: 56, color: 'rgba(255,255,255,0.9)', marginTop: 6 }}>лет</div>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1250, left: 0, right: 0, textAlign: 'center', padding: '0 90px' }}>
        <BigText text="страницы хранятся 30 лет — пересматривайте хоть через годы" start={t + 10} stagger={3} fontFamily={font.caption} fontSize={46} weight={700} reveal="up" letterSpacing={-0.5} />
      </div>
    </AbsoluteFill>
  );
};

/* scene 5 — 05 для бизнеса */
const Business: React.FC = () => {
  const f = useCurrentFrame();
  const tSalon = wordAt(S5, 'салон'); const tQr = wordAt(S5, 'qr'); const tClient = wordAt(S5, 'клиент');
  const b = springIn(f, 30, 6, { damping: 16 });
  const q = springIn(f, 30, tQr - 4, { damping: 13 });
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: 'absolute', top: 210, left: 80 }}><SectionNumber n="05" title="Для бизнеса" color="#0a0a0a" numberColor="rgba(248,72,136,0.35)" /></div>
      <div style={{ position: 'absolute', top: 330, left: 40, transform: `translateY(${(1 - b) * 200}px) rotate(-6deg)`, opacity: b }}>
        <Bouquet width={480}>
          <div style={{ position: 'absolute', left: 300, top: 300, transform: `rotate(10deg) scale(${q})`, opacity: q }}><QrCard qr={staticFile('brand/qr-05-bg.png')} width={190} label="Отсканируй меня 🤍" /></div>
        </Bouquet>
      </div>
      <div style={{ position: 'absolute', top: 400, right: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 18 }}>
        <Chip start={tSalon - 4} fontSize={30}>💐 Цветочный салон</Chip>
        <Chip start={tSalon + 8} fontSize={30}>🎁 Магазин подарков</Chip>
        <Chip start={tQr} fontSize={30}>QR-код в каждом заказе</Chip>
      </div>
      <div style={{ position: 'absolute', top: 930, left: 70, right: 70, opacity: springIn(f, 30, tClient - 4), transform: `translateY(${(1 - springIn(f, 30, tClient - 4)) * 60}px)` }}>
        <div style={{ borderRadius: 30, background: '#0a0a0a', padding: '30px 36px', color: '#fff', boxShadow: '0 20px 34px rgba(0,0,0,0.25)' }}>
          <div style={{ fontFamily: font.caption, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Код для редактирования</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontFamily: font.mono, fontSize: 64, fontWeight: 700, letterSpacing: 10 }}>{DEMO_GIFT.editCode}</span>
            <span style={{ fontFamily: font.caption, fontSize: 26, color: 'rgba(255,255,255,0.7)', textAlign: 'right', lineHeight: 1.3 }}>клиент сам меняет<br />текст и фото</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1160, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PLAN_ROWS.map((p, i) => {
          const sp = springIn(f, 30, 24 + i * 6);
          return (
            <div key={p.name} style={{ opacity: sp, transform: `translateY(${(1 - sp) * 60}px)`, display: 'flex', alignItems: 'center', gap: 22, padding: '16px 26px', borderRadius: 22, background: p.dark ? '#0a0a0a' : 'rgba(255,255,255,0.9)', color: p.dark ? '#fff' : '#0a0a0a', boxShadow: '0 14px 34px rgba(0,0,0,0.10)', border: p.dark ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 24, letterSpacing: 3, textTransform: 'uppercase', width: 150, opacity: 0.6 }}>{p.name}</span>
              <span style={{ fontFamily: font.bold, fontWeight: 700, fontSize: 40, width: 130 }}>{p.price}</span>
              <span style={{ fontFamily: font.caption, fontWeight: 600, fontSize: 26, opacity: 0.85 }}>{p.note}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* scene 6 — end */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const l = popIn(f, 30, 2); const d = springIn(f, 30, wordAt(S6, 'lovelink') - 6, { damping: 14 });
  return (
    <AbsoluteFill>
      <BrandBg />
      <div style={{ position: 'absolute', top: 600, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ background: '#fff', borderRadius: 40, padding: '40px 60px', transform: `scale(${l})`, boxShadow: '0 20px 34px rgba(0,0,0,0.25)' }}><Logo width={560} /></div>
        <div style={{ opacity: d, transform: `translateY(${(1 - d) * 40}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <Domain size={96} />
          <div style={{ fontFamily: font.caption, fontWeight: 700, fontSize: 38, color: 'rgba(255,255,255,0.9)' }}>страница-подарок, которая останется</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Video003: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#7850F0' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-003-music.mp3" bed={0.5} duck={0.16} />
      <SceneSeq scene={S0} fadeIn={false}><Hook /></SceneSeq>
      <SceneSeq scene={S1}><Templates /></SceneSeq>
      <SceneSeq scene={S2}><Content /></SceneSeq>
      <SceneSeq scene={S3}><Access /></SceneSeq>
      <SceneSeq scene={S4}><Years /></SceneSeq>
      <SceneSeq scene={S5}><Business /></SceneSeq>
      <SceneSeq scene={S6} overlap={30}><End /></SceneSeq>
      <Captions timeline={tl} variant="boxed" bottom={300} fontSize={44} accent="#FDA4C4" fontFamily={font.bold} fontWeight={700} maxWords={4} maxChars={24} hideScenes={[6]} />
    </AbsoluteFill>
  );
};
