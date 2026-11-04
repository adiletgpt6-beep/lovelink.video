import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import '../style.css';
import { useFontsReady } from '../lib/fonts';
import { TL002 } from '../lib/timelines';
import { font } from '../lib/theme';
import { easeOut, popIn, prog, springIn, typed } from '../lib/anim';
import { LightBg } from '../ui/Backgrounds';
import { Confetti } from '../ui/Fx';
import { Captions } from '../ui/Captions';
import { PhoneFrame } from '../ui/PhoneFrame';
import { StepBadge, Tap } from '../ui/Text';
import { Domain, Logo } from '../ui/Logo';
import { BrowserBar } from '../screens/AppChrome';
import { HomeScreen, TemplatesPageScreen } from '../screens/Templates';
import { GiftViewerScreen } from '../screens/GiftViewer';
import { EditorPanel } from '../screens/EditorScreen';
import { PublishModal } from '../screens/PublishModal';
import { PinLockScreen } from '../screens/PinLockScreen';
import { GiftsCabinetScreen } from '../screens/GiftsCabinet';
import { QrCard } from '../ui/Illustrations';
import { momGift } from '../lib/content';
import { SceneSeq, VideoAudio, wordAt } from './common';
import { staticFile } from 'remotion';

const tl = TL002;
const [S0, S1, S2, S3, S4, S5] = tl.scenes;
const PH = 1.3; // phone scale for this video (keeps captions inside the safe zone)
const PHONE_TOP = 140;

const Stage: React.FC<{ children: React.ReactNode; badge?: string; badgeStart?: number; statusColor?: string; zoom?: number; origin?: string; glow?: string }> = ({ children, badge, badgeStart = 0, statusColor = '#111', zoom = 1, origin = '50% 40%', glow }) => (
  <AbsoluteFill>
    <LightBg />
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: PHONE_TOP, transform: `scale(${zoom})`, transformOrigin: origin }}>
      <PhoneFrame scale={PH} statusColor={statusColor} glow={glow ?? 'rgba(248,72,136,0.18)'}>{children}</PhoneFrame>
    </AbsoluteFill>
    {badge && <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><StepBadge text={badge} start={badgeStart} /></div>}
  </AbsoluteFill>
);

/* scene 0 — open lovelink.my */
const Open: React.FC = () => {
  const f = useCurrentFrame();
  const url = typed('lovelink.my', f, 10, 30, 12);
  const done = f >= 48;
  const load = prog(f, 48, 22);
  const title = popIn(f, 30, 0);
  return (
    <AbsoluteFill>
      <LightBg />
      <div style={{ position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', transform: `scale(${title})`, opacity: title }}>
        <div style={{ fontFamily: font.bold, fontWeight: 700, fontSize: 64, color: '#0a0a0a', letterSpacing: -1 }}>Как это работает</div>
        <div style={{ marginTop: 14, fontFamily: font.caption, fontWeight: 600, fontSize: 32, color: '#737373' }}>подарок-страница за несколько минут</div>
      </div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 420 }}>
        <PhoneFrame scale={1.1} statusColor="#111" glow="rgba(120,80,240,0.18)">
          <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: load }}><HomeScreen /></div>
          <BrowserBar url={url} progress={done ? load : 0} focused={!done} />
        </PhoneFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* scene 1 — choose a template */
const Choose: React.FC = () => {
  const f = useCurrentFrame();
  const tGirl = wordAt(S1, 'девушки'); const tMom = wordAt(S1, 'мамы'); const tFriend = wordAt(S1, 'друга'); const tClient = wordAt(S1, 'клиента');
  const sheetAt = tGirl - 14;
  const sheet = prog(f, sheetAt, 14);
  const chip = f >= tClient ? 8 : f >= tFriend ? 5 : f >= tMom ? 3 : f >= tGirl ? 1 : 0;
  const closeAt = tClient + 24;
  const sheetOpen = f < closeAt ? sheet : 1 - prog(f, closeAt, 10);
  const tapAt = closeAt + 16;
  const pressed = Math.sin(Math.min(1, Math.max(0, (f - tapAt) / 14)) * Math.PI);
  const hl = prog(f, tapAt + 4, 14);
  const zoom = 1 + prog(f, tapAt + 10, 40) * 0.35;
  const scroll = interpolate(f, [0, 30], [0, 0]);
  return (
    <Stage badge="Шаг 1 · Выбираем шаблон" badgeStart={4} zoom={zoom} origin="62% 34%">
      {f < sheetAt - 6 ? <HomeScreen scroll={scroll} /> : <TemplatesPageScreen sheetOpen={sheetOpen} activeChip={chip} items={undefined} highlightIndex={1} highlightAmt={hl} pressedIndex={1} pressedAmt={pressed} />}
      <Tap x={290} y={300} start={tapAt} />
    </Stage>
  );
};

/* scene 2 — editor */
const Edit: React.FC = () => {
  const f = useCurrentFrame();
  const tBg = wordAt(S2, 'фон'); const tVideo = wordAt(S2, 'видео'); const tTitle = wordAt(S2, 'заголовок'); const tReasons = wordAt(S2, 'причины');
  const tapPencil = tBg - 22;
  const panelOpen = prog(f, tapPencil + 6, 12);
  const preset = f < tBg + 10 ? 0 : f < tBg + 24 ? 1 : 3;
  const kind = f < tVideo - 4 ? 'bg' : f < tTitle - 6 ? 'video' : 'reasons';
  const titleTyped = typed('Мама, спасибо вам за всё', f, tTitle - 2, 30, 22);
  const reasons = ['За терпение', 'За поддержку в любой день', 'За тёплые ужины'];
  const nReasons = Math.max(0, Math.min(3, Math.floor((f - tReasons) / 10) + 1));
  const g = { ...momGift, heroVariant: (['peach', 'rose', 'rose', 'sunset'] as const)[preset], title: titleTyped || 'Почему мне нравится быть рядом с тобой', words: nReasons > 0 ? reasons.slice(0, nReasons) : momGift.words };
  return (
    <Stage badge="Шаг 2 · Редактируем — всё видно сразу" badgeStart={4} statusColor="#fff" glow="rgba(120,80,240,0.3)">
      <GiftViewerScreen g={g} active={2} frame={f} editorButtons reasonIndex={0}>
        <EditorPanel kind={kind} open={panelOpen} preset={preset} titleValue={titleTyped} focusField={kind === 'reasons' ? (f < tReasons ? 'title' : 'reason') : 'none'} reasons={reasons.slice(0, nReasons)} reasonInput={f >= tReasons && nReasons < 3 ? typed(reasons[nReasons], f, tReasons + nReasons * 10, 30, 40) : ''} fileName={kind === 'video' && f > tVideo + 6 ? 'mama_video.mp4' : undefined} />
      </GiftViewerScreen>
      <Tap x={366} y={78} start={tapPencil} />
    </Stage>
  );
};

/* scene 3 — publish */
const Publish: React.FC = () => {
  const f = useCurrentFrame();
  const tSave = wordAt(S3, 'сохранить') - 6;
  const tLink = wordAt(S3, 'ссылка'); const tCode = wordAt(S3, 'пароль'); const tQr = wordAt(S3, 'qr');
  const press = Math.sin(Math.min(1, Math.max(0, (f - tSave) / 12)) * Math.PI);
  const modalAt = tSave + 14;
  const open = prog(f, modalAt, 14);
  const highlight = f >= tQr ? 'qr' : f >= tCode ? 'code' : f >= tLink ? 'link' : null;
  const qr = f < tQr + 20 ? 0 : f < tQr + 36 ? 1 : f < tQr + 52 ? 2 : 3;
  const scroll = highlight === 'qr' ? Math.min(250, (f - tQr) * 12) : 0;
  return (
    <Stage badge="Шаг 3 · Сохраняем — страница готова" badgeStart={4} statusColor="#fff" glow="rgba(248,72,136,0.3)">
      <GiftViewerScreen g={{ ...momGift, words: ['За терпение', 'За поддержку в любой день', 'За тёплые ужины'] }} active={2} frame={f} editorButtons>
        <EditorPanel kind="reasons" open={1 - open} titleValue="Мама, спасибо вам за всё" reasons={['За терпение', 'За поддержку в любой день', 'За тёплые ужины']} savePressed={press} saved={f > tSave + 8} scroll={260} />
        <PublishModal open={open} qr={qr} highlight={highlight} scroll={scroll} />
      </GiftViewerScreen>
      <Tap x={290} y={690} start={tSave} />
    </Stage>
  );
};

/* scene 4 — recipient */
const Receive: React.FC = () => {
  const f = useCurrentFrame();
  const tScan = wordAt(S4, 'сканирует') - 10;
  const tCode = wordAt(S4, 'вводит');
  const tSee = wordAt(S4, 'видит');
  const step = 7;
  const filled = f < tCode ? 0 : Math.min(6, Math.floor((f - tCode) / step) + 1);
  const pressIdx = Math.floor((f - tCode) / step);
  const pressAmt = f >= tCode && pressIdx < 6 ? ((f - tCode) % step) / step : 0;
  const successAt = tCode + step * 6 + 10;
  const openAt = tSee + 4;
  const viewer = f >= openAt;
  const active = interpolate(f, [openAt + 30, openAt + 48, openAt + 75, openAt + 93], [0, 2, 2, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  const scanY = ((f - tScan) % 30) / 30;
  const qrCardP = prog(f, 0, 18);
  const qrOut = prog(f, tCode - 14, 12);
  return (
    <Stage badge="Шаг 4 · Получатель сканирует QR и вводит пароль" badgeStart={4} statusColor="#fff" glow="rgba(120,80,240,0.3)">
      {viewer ? (
        <GiftViewerScreen g={{ ...momGift, words: ['За терпение', 'За поддержку в любой день', 'За тёплые ужины'] }} active={active} frame={f} playing={f > openAt + 8} activeEmoji={f > openAt + 100 ? '🤍' : null} responseText={f > openAt + 100 ? 'Люблю вас.' : null} burstStart={openAt + 100} />
      ) : (
        <PinLockScreen filled={filled} state={f >= successAt ? 'success' : 'locked'} pressedKey={pressIdx >= 0 && pressIdx < 6 ? ['4', '8', '2', '9', '1', '3'][pressIdx] : null} pressAmt={pressAmt} successProgress={prog(f, successAt, 12)} giftIcon="🌸" giftTitle="Мама, спасибо вам за всё 🤍" />
      )}
      {/* QR card being scanned */}
      <div style={{ position: 'absolute', left: 95, top: 250, opacity: qrCardP * (1 - qrOut), transform: `translateY(${(1 - qrCardP) * 40 - qrOut * 60}px) scale(${0.9 + 0.1 * qrCardP})`, zIndex: 50 }}>
        <QrCard qr={staticFile('brand/qr-01-bg.png')} width={200} />
        <div style={{ position: 'absolute', left: 14, right: 14, top: 14 + scanY * 150, height: 3, background: 'linear-gradient(90deg,transparent,#F84888,transparent)', boxShadow: '0 0 16px #F84888', opacity: f >= tScan && f < tCode ? 1 : 0 }} />
      </div>
      {f >= successAt && f < openAt + 10 && <Confetti start={successAt} count={60} />}
    </Stage>
  );
};

/* scene 5 — cabinet + CTA */
const Cabinet: React.FC = () => {
  const f = useCurrentFrame();
  const tTry = wordAt(S5, 'попробуйте');
  const scroll = interpolate(f, [20, 120], [0, 420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut });
  const cta = springIn(f, 30, tTry - 6, { damping: 14 });
  const shrink = prog(f, tTry - 10, 20);
  return (
    <AbsoluteFill>
      <LightBg />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: PHONE_TOP - shrink * 40, transform: `scale(${1 - shrink * 0.12})`, transformOrigin: '50% 20%' }}>
        <PhoneFrame scale={PH} statusColor="#111" glow="rgba(248,72,136,0.18)"><GiftsCabinetScreen scroll={scroll} qr={0} /></PhoneFrame>
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - shrink }}><StepBadge text="Шаг 5 · Все подарки — в кабинете" start={4} /></div>
      <div style={{ position: 'absolute', top: 1130, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: cta, transform: `translateY(${(1 - cta) * 40}px)` }}>
        <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 32, padding: '26px 40px', boxShadow: '0 20px 34px rgba(120,80,240,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Logo width={300} />
          <Domain size={64} gradient />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Video002: React.FC = () => {
  useFontsReady();
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      <VideoAudio tl={tl} music="audio/music/VIDEO-002-music.mp3" bed={0.4} duck={0.13} />
      <SceneSeq scene={S0} fadeIn={false}><Open /></SceneSeq>
      <SceneSeq scene={S1}><Choose /></SceneSeq>
      <SceneSeq scene={S2}><Edit /></SceneSeq>
      <SceneSeq scene={S3}><Publish /></SceneSeq>
      <SceneSeq scene={S4}><Receive /></SceneSeq>
      <SceneSeq scene={S5} overlap={30}><Cabinet /></SceneSeq>
      <Captions timeline={tl} variant="pill" bottom={440} fontSize={46} accent="#F84888" />
    </AbsoluteFill>
  );
};
