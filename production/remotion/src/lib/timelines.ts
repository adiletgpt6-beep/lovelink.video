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


/* ------------------------------------------------------------------ VIDEO-006 … VIDEO-010 */
import m6 from '../../public/audio/vo/VIDEO-006/timeline.json';
import m7 from '../../public/audio/vo/VIDEO-007/timeline.json';
import m8 from '../../public/audio/vo/VIDEO-008/timeline.json';
import m9 from '../../public/audio/vo/VIDEO-009/timeline.json';
import m10 from '../../public/audio/vo/VIDEO-010/timeline.json';

export const TL006 = buildTimeline(m6 as Manifest, [
  { voDelay: 1.6, gapAfter: 0.6, minSec: 9 },     // rose bloom hook
  { voDelay: 0.4, gapAfter: 0.5, minSec: 6 },     // bouquet assembles + card
  { voDelay: 0.3, gapAfter: 0.6, minSec: 5.5 },   // card close-up: QR + 6 digits
  { voDelay: 0.3, gapAfter: 0.5, minSec: 6 },     // scan + type
  { voDelay: 0.3, gapAfter: 0.6 },                // message reveal
  { voDelay: 0.5, gapAfter: 0.6, minSec: 7 },     // finale
], { fps: FPS, tailSec: 0.8 });

export const TL007 = buildTimeline(m7 as Manifest, [
  { voDelay: 2.2, gapAfter: 0.8, minSec: 8 },     // rose opens in darkness
  { voDelay: 0.4, gapAfter: 0.6, minSec: 9 },     // petals → card → QR → phone → digits
  { voDelay: 0.3, gapAfter: 0.6, minSec: 6 },     // message opens
  { voDelay: 0.5, gapAfter: 0.6, minSec: 7.5 },   // bouquet finale
], { fps: FPS, tailSec: 0.8 });

export const TL008 = buildTimeline(m8 as Manifest, [
  { voDelay: 0.6, gapAfter: 0.4, minSec: 6 },
  { voDelay: 0.3, gapAfter: 0.5, minSec: 6.5 },
  { voDelay: 0.3, gapAfter: 0.5 },
  { voDelay: 0.3, gapAfter: 0.5, minSec: 6.5 },
  { voDelay: 0.4, gapAfter: 0.6, minSec: 7 },
], { fps: FPS, tailSec: 0.6 });

export const TL009 = buildTimeline(m9 as Manifest, [
  { voDelay: 2.0, gapAfter: 0.8, minSec: 6 },     // six digits appear among petals
  { voDelay: 0.3, gapAfter: 0.6, minSec: 6 },     // transformations → card
  { voDelay: 0.3, gapAfter: 0.5, minSec: 5 },     // card → phone → scan/type
  { voDelay: 0.3, gapAfter: 0.6, minSec: 5 },     // message
  { voDelay: 0.4, gapAfter: 0.6, minSec: 7 },     // flowers form the logo
], { fps: FPS, tailSec: 0.8 });

export const TL010 = buildTimeline(m10 as Manifest, [
  { voDelay: 0.4, gapAfter: 0.4, minSec: 8 },     // five objects match-cut
  { voDelay: 0.3, gapAfter: 0.5, minSec: 6.5 },   // cards added
  { voDelay: 0.3, gapAfter: 0.5, minSec: 7 },     // recipients open
  { voDelay: 0.3, gapAfter: 0.5, minSec: 6 },     // reactions
  { voDelay: 0.4, gapAfter: 0.6, minSec: 7 },     // finale
], { fps: FPS, tailSec: 0.6 });

export const TIMELINES = { 'VIDEO-001': TL001, 'VIDEO-002': TL002, 'VIDEO-003': TL003, 'VIDEO-004': TL004, 'VIDEO-005': TL005, 'VIDEO-006': TL006, 'VIDEO-007': TL007, 'VIDEO-008': TL008, 'VIDEO-009': TL009, 'VIDEO-010': TL010 } as const;
export type VideoId = keyof typeof TIMELINES;
