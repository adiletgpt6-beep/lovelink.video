import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import './style.css';
import { useFontsReady } from './lib/fonts';
import { PhoneFrame } from './ui/PhoneFrame';
import { AuroraBg, LightBg } from './ui/Backgrounds';
import { HomeScreen, TemplatesPageScreen } from './screens/Templates';
import { PinLockScreen } from './screens/PinLockScreen';
import { GiftViewerScreen } from './screens/GiftViewer';
import { EditorPanel } from './screens/EditorScreen';
import { PublishModal } from './screens/PublishModal';
import { GiftsCabinetScreen } from './screens/GiftsCabinet';
import { PricingScreen } from './screens/PricingScreen';
import { loveGift, momGift } from './lib/content';
import { Captions } from './ui/Captions';
import { Postcard } from './ui/Postcard';
import { TL001 } from './lib/timelines';

export type PreviewScreen = 'postcard' | 'home' | 'templates' | 'pin' | 'pinSuccess' | 'viewer' | 'viewer3' | 'viewer4' | 'editor' | 'publish' | 'cabinet' | 'pricing';

export const Preview: React.FC<{ screen: PreviewScreen }> = ({ screen }) => {
  useFontsReady();
  const frame = useCurrentFrame();
  const dark = ['pin', 'pinSuccess', 'viewer', 'viewer3', 'viewer4', 'editor', 'publish'].includes(screen);
  const content = (() => {
    switch (screen) {
      case 'postcard': return null;
      case 'home': return <HomeScreen highlightIndex={1} highlightAmt={1} />;
      case 'templates': return <TemplatesPageScreen sheetOpen={1} activeChip={3} />;
      case 'pin': return <PinLockScreen filled={4} pressedKey="9" pressAmt={0.5} />;
      case 'pinSuccess': return <PinLockScreen filled={6} state="success" />;
      case 'viewer': return <GiftViewerScreen g={loveGift} active={0} frame={frame} />;
      case 'viewer3': return <GiftViewerScreen g={momGift} active={2} reasonIndex={1} frame={frame} />;
      case 'viewer4': return <GiftViewerScreen g={loveGift} active={3} activeEmoji="🤍" responseText="Ты правда особенная." frame={frame} />;
      case 'editor': return <GiftViewerScreen g={momGift} active={2} frame={frame} editorButtons><EditorPanel kind="reasons" open={1} titleValue="Мама, спасибо вам за всё" reasons={['За терпение', 'За поддержку в любой день']} reasonInput="За тёплые уж" focusField="reason" /></GiftViewerScreen>;
      case 'publish': return <GiftViewerScreen g={momGift} active={2} frame={frame} editorButtons><PublishModal open={1} qr={0} highlight="code" /></GiftViewerScreen>;
      case 'cabinet': return <GiftsCabinetScreen />;
      case 'pricing': return <PricingScreen highlight={1} highlightAmt={1} />;
    }
  })();
  const tl = TL001;
  return (
    <AbsoluteFill>
      {dark ? <AuroraBg /> : <LightBg />}
      {screen === 'postcard' && <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 60 }}><div style={{ transform: 'scale(1.5)' }}><Postcard revealed={1} rotX={8} rotY={-12} sweep={0.5} /></div><div style={{ transform: 'scale(1.2)' }}><Postcard variant="night" revealed={0.5} rotX={-6} rotY={10} /></div></AbsoluteFill>}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', display: screen === 'postcard' ? 'none' : 'flex' }}>
        <PhoneFrame scale={1.75} statusColor={dark || ['viewer', 'editor'].includes(screen) ? '#fff' : '#111'}>{content}</PhoneFrame>
      </AbsoluteFill>
      <Captions timeline={tl} variant="pill" />
    </AbsoluteFill>
  );
};
