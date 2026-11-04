import { buildTimeline, Manifest } from './timeline';
import m1 from '../../public/audio/vo/VIDEO-001/timeline.json';
import m2 from '../../public/audio/vo/VIDEO-002/timeline.json';
import m3 from '../../public/audio/vo/VIDEO-003/timeline.json';
import m4 from '../../public/audio/vo/VIDEO-004/timeline.json';
import m5 from '../../public/audio/vo/VIDEO-005/timeline.json';

const FPS = 30;

export const TL001 = buildTimeline(m1 as Manifest, [
  { voDelay: 0.9, gapAfter: 0.6, minSec: 4.6 },
  { voDelay: 0.3, gapAfter: 0.7 },
  { voDelay: 0.3, gapAfter: 0.9 },
  { voDelay: 0.5, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.6 },
  { voDelay: 0.4, gapAfter: 0.6, minSec: 6 },
], { fps: FPS, tailSec: 1.0 });

export const TL002 = buildTimeline(m2 as Manifest, [
  { voDelay: 0.6, gapAfter: 0.5, minSec: 5.5 },
  { voDelay: 0.3, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.6 },
  { voDelay: 0.3, gapAfter: 0.6 },
  { voDelay: 0.4, gapAfter: 0.6, minSec: 6.5 },
], { fps: FPS, tailSec: 0.8 });

export const TL003 = buildTimeline(m3 as Manifest, [
  { voDelay: 0.4, gapAfter: 0.3, minSec: 5.6 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.5, minSec: 4.5 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.5, minSec: 4.5 },
], { fps: FPS, tailSec: 0.6 });

export const TL004 = buildTimeline(m4 as Manifest, [
  { voDelay: 0.8, gapAfter: 0.5, minSec: 6 },
  { voDelay: 0.3, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.6 },
  { voDelay: 0.3, gapAfter: 0.7 },
  { voDelay: 0.3, gapAfter: 0.6, minSec: 6.5 },
], { fps: FPS, tailSec: 0.8 });

export const TL005 = buildTimeline(m5 as Manifest, [
  { voDelay: 0.4, gapAfter: 0.3, minSec: 4 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.4 },
  { voDelay: 0.3, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.6, minSec: 6 },
], { fps: FPS, tailSec: 0.6 });

export const TIMELINES = { 'VIDEO-001': TL001, 'VIDEO-002': TL002, 'VIDEO-003': TL003, 'VIDEO-004': TL004, 'VIDEO-005': TL005 } as const;
export type VideoId = keyof typeof TIMELINES;
