import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import './style.css';
import { AuroraBg, Grain } from './ui/Backgrounds';
import { Stars } from './ui/Fx';
import { PhoneFrame } from './ui/PhoneFrame';
import { MessengerScreen } from './screens/Messenger';
import { ArtPhoto } from './ui/ArtPhoto';
import { GiftViewerScreen } from './screens/GiftViewer';
import { loveGift } from './lib/content';
import { HomeScreen, TemplateCard } from './screens/Templates';
import { TEMPLATES } from './lib/content';
import { staticFile, Img } from 'remotion';

export const Perf: React.FC<{ variant: string }> = ({ variant }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#060715' }}>
      {variant === 'blank' && <AbsoluteFill style={{ background: `hsl(${f * 3}, 50%, 40%)` }} />}
      {variant === 'aurora' && <AbsoluteFill style={{ background: 'linear-gradient(135deg,#060715,#070a18 30%,#050510)' }}><AbsoluteFill style={{ inset: '-10%', transform: `translate(${Math.sin(f / 180) * 4}%, 0)`, background: 'radial-gradient(1200px 800px at 20% 10%, rgba(124,58,237,0.44), transparent 55%), radial-gradient(1000px 760px at 80% 20%, rgba(59,130,246,0.34), transparent 58%)' }} /></AbsoluteFill>}
      {variant === 'grain' && <AbsoluteFill style={{ background: '#223' }}><Grain /></AbsoluteFill>}
      {variant === 'grainBlend' && <AbsoluteFill style={{ background: '#223' }}><Grain blend /></AbsoluteFill>}
      {variant === 'auroraFull' && <AuroraBg />}
      {variant === 'stars' && <AbsoluteFill style={{ background: '#223' }}><Stars count={60} /></AbsoluteFill>}
      {variant === 'art' && <ArtPhoto variant="sunset" seed={3} style={{ position: 'absolute', inset: 0 }} bokehCount={22} />}
      {variant === 'viewer' && <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><PhoneFrame scale={1.4} statusColor="#fff"><GiftViewerScreen g={loveGift} active={0} frame={f} playing /></PhoneFrame></AbsoluteFill>}
      {variant === 'home' && <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><PhoneFrame scale={1.4}><HomeScreen /></PhoneFrame></AbsoluteFill>}
      {variant === 'imgs' && <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 100 }}>{['sunset-1','peach-1','night-1','lavender-1'].map((n) => <Img key={n} src={staticFile(`art/${n}.jpg`)} style={{ width: '100%', height: 600, objectFit: 'cover', borderRadius: 30 }} />)}</AbsoluteFill>}
      {variant === 'cards' && <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 100, alignContent: 'start' }}>{TEMPLATES.slice(0, 4).map((t, i) => <div key={i} style={{ zoom: 1.6 } as React.CSSProperties}><TemplateCard {...t} /></div>)}</AbsoluteFill>}
      {variant === 'phoneEmpty' && <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><PhoneFrame scale={1.4}><div style={{ position: 'absolute', inset: 0, background: '#fff' }} /></PhoneFrame></AbsoluteFill>}
      {variant === 'phone' && <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}><PhoneFrame scale={1.4} statusColor="#fff"><MessengerScreen typed="Скучаю по тебе" /></PhoneFrame></AbsoluteFill>}
    </AbsoluteFill>
  );
};
