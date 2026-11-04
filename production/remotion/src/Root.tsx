import React from 'react';
import { Composition, Folder } from 'remotion';
import { Preview, PreviewScreen } from './Preview';
import { Perf } from './Perf';
import { ThreePerf } from './ThreePerf';
import { AlphaTest } from './AlphaTest';
import { RoseTest } from './three/RoseTest';
import { GiftTest } from './three/GiftTest';
import { LAYERS } from './three/Layers';
import { TL001, TL002, TL003, TL004, TL005, TL006, TL007, TL008, TL009, TL010 } from './lib/timelines';
import { Video001 } from './videos/Video001';
import { Video002 } from './videos/Video002';
import { Video003 } from './videos/Video003';
import { Video004 } from './videos/Video004';
import { Video005 } from './videos/Video005';
import { Video006 } from './videos/Video006';
import { Video007 } from './videos/Video007';
import { Video008 } from './videos/Video008';
import { Video009 } from './videos/Video009';
import { Video010 } from './videos/Video010';

const screens: PreviewScreen[] = ['postcard', 'home', 'templates', 'pin', 'pinSuccess', 'viewer', 'viewer3', 'viewer4', 'editor', 'publish', 'cabinet', 'pricing'];
const base = { fps: 30, width: 1080, height: 1920 };

export const Root: React.FC = () => (
  <>
    <Folder name="Videos">
      <Composition id="VIDEO-001" component={Video001} durationInFrames={TL001.durationInFrames} {...base} />
      <Composition id="VIDEO-002" component={Video002} durationInFrames={TL002.durationInFrames} {...base} />
      <Composition id="VIDEO-003" component={Video003} durationInFrames={TL003.durationInFrames} {...base} />
      <Composition id="VIDEO-004" component={Video004} durationInFrames={TL004.durationInFrames} {...base} />
      <Composition id="VIDEO-005" component={Video005} durationInFrames={TL005.durationInFrames} {...base} />
      <Composition id="VIDEO-006" component={Video006} durationInFrames={TL006.durationInFrames} {...base} />
      <Composition id="VIDEO-007" component={Video007} durationInFrames={TL007.durationInFrames} {...base} />
      <Composition id="VIDEO-008" component={Video008} durationInFrames={TL008.durationInFrames} {...base} />
      <Composition id="VIDEO-009" component={Video009} durationInFrames={TL009.durationInFrames} {...base} />
      <Composition id="VIDEO-010" component={Video010} durationInFrames={TL010.durationInFrames} {...base} />
    </Folder>
    <Folder name="Layers3D">
      {LAYERS.map((l) => <Composition key={l.id} id={l.id} component={l.component} durationInFrames={l.frames} {...base} />)}
    </Folder>
    <Folder name="Perf">
      <Composition id="Perf-three40" component={ThreePerf} durationInFrames={300} defaultProps={{ petals: 40, shadows: false }} {...base} />
      <Composition id="RoseTest" component={RoseTest} durationInFrames={120} {...base} />
      <Composition id="RoseTest-alpha" component={RoseTest} durationInFrames={120} defaultProps={{ transparent: true }} {...base} />
      {(['bouquet', 'gifts', 'petals'] as const).map((w) => <Composition key={w} id={`GiftTest-${w}`} component={GiftTest} durationInFrames={120} defaultProps={{ what: w }} {...base} />)}
      <Composition id="AlphaTest" component={AlphaTest} durationInFrames={60} {...base} />
      <Composition id="Perf-three40t" component={ThreePerf} durationInFrames={300} defaultProps={{ petals: 40, shadows: false, transparent: true }} {...base} />
      <Composition id="Perf-three40s" component={ThreePerf} durationInFrames={300} defaultProps={{ petals: 40, shadows: true }} {...base} />
      {['blank', 'aurora', 'grain', 'grainBlend', 'auroraFull', 'stars', 'phone', 'art', 'viewer', 'home', 'imgs', 'cards', 'phoneEmpty'].map((v) => (
        <Composition key={v} id={`Perf-${v}`} component={Perf} durationInFrames={300} defaultProps={{ variant: v }} {...base} />
      ))}
    </Folder>
    <Folder name="Previews">
      {screens.map((s) => (
        <Composition key={s} id={`Preview-${s}`} component={Preview} durationInFrames={90} defaultProps={{ screen: s }} {...base} />
      ))}
    </Folder>
  </>
);
