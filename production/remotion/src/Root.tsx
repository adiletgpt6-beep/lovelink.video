import React from 'react';
import { Composition, Folder } from 'remotion';
import { Preview, PreviewScreen } from './Preview';
import { TL001, TL002, TL003, TL004, TL005 } from './lib/timelines';
import { Video001 } from './videos/Video001';
import { Video002 } from './videos/Video002';
import { Video003 } from './videos/Video003';
import { Video004 } from './videos/Video004';
import { Video005 } from './videos/Video005';

const screens: PreviewScreen[] = ['home', 'templates', 'pin', 'pinSuccess', 'viewer', 'viewer3', 'viewer4', 'editor', 'publish', 'cabinet', 'pricing'];
const base = { fps: 30, width: 1080, height: 1920 };

export const Root: React.FC = () => (
  <>
    <Folder name="Videos">
      <Composition id="VIDEO-001" component={Video001} durationInFrames={TL001.durationInFrames} {...base} />
      <Composition id="VIDEO-002" component={Video002} durationInFrames={TL002.durationInFrames} {...base} />
      <Composition id="VIDEO-003" component={Video003} durationInFrames={TL003.durationInFrames} {...base} />
      <Composition id="VIDEO-004" component={Video004} durationInFrames={TL004.durationInFrames} {...base} />
      <Composition id="VIDEO-005" component={Video005} durationInFrames={TL005.durationInFrames} {...base} />
    </Folder>
    <Folder name="Previews">
      {screens.map((s) => (
        <Composition key={s} id={`Preview-${s}`} component={Preview} durationInFrames={90} defaultProps={{ screen: s }} {...base} />
      ))}
    </Folder>
  </>
);
