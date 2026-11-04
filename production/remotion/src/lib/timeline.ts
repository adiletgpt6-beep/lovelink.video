export type Word = { text: string; start: number; end: number };
export type Segment = { id: string; text: string; file: string; duration: number; words: Word[] };
export type Manifest = { videoId: string; title: string; voice: string; model?: string; segments: Segment[]; totalSpeech: number };

export type ScenePlan = {
  /** Minimum visual length of the scene in seconds (even if the VO is shorter). */
  minSec?: number;
  /** Seconds between scene start and the first spoken word. */
  voDelay?: number;
  /** Seconds of air after the VO ends before the next scene starts. */
  gapAfter?: number;
};

export type Scene = {
  index: number;
  seg: Segment;
  /** Scene start frame (absolute). */
  start: number;
  /** Frame when the VO clip starts (absolute). */
  voStart: number;
  voEnd: number;
  end: number;
  duration: number;
};

export type Timeline = { scenes: Scene[]; durationInFrames: number; fps: number; speechFrames: number };

/** Display normalisation: the voice says «lovelink точка my», captions show «lovelink.my». */
export function normalizeWords(words: Word[]): Word[] {
  const out: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const a = w.text.toLowerCase();
    const b = words[i + 1]?.text.toLowerCase();
    const c = words[i + 2]?.text.toLowerCase();
    if (a.startsWith('lovelink') && b === 'точка' && c && c.startsWith('my')) {
      const tail = words[i + 2].text.replace(/^my/i, '');
      out.push({ text: `lovelink.my${tail}`, start: w.start, end: words[i + 2].end });
      i += 2;
      continue;
    }
    out.push(w);
  }
  return out;
}

export function buildTimeline(mIn: Manifest, plans: ScenePlan[], opts: { fps: number; tailSec: number }): Timeline {
  const { fps } = opts;
  const m: Manifest = { ...mIn, segments: mIn.segments.map((s) => ({ ...s, words: normalizeWords(s.words), text: s.text.replace(/lovelink точка my/gi, 'lovelink.my') })) };
  let cursor = 0;
  const scenes: Scene[] = m.segments.map((seg, i) => {
    const p = plans[i] ?? {};
    const voDelay = Math.round((p.voDelay ?? 0.4) * fps);
    const gap = Math.round((p.gapAfter ?? 0.45) * fps);
    const voFrames = Math.ceil(seg.duration * fps);
    const minFrames = Math.round((p.minSec ?? 0) * fps);
    const duration = Math.max(minFrames, voDelay + voFrames + gap);
    const scene: Scene = {
      index: i,
      seg,
      start: cursor,
      voStart: cursor + voDelay,
      voEnd: cursor + voDelay + voFrames,
      end: cursor + duration,
      duration,
    };
    cursor += duration;
    return scene;
  });
  return { scenes, durationInFrames: cursor + Math.round(opts.tailSec * fps), fps, speechFrames: Math.round(m.totalSpeech * fps) };
}

/** Music ducking curve: low while the voice speaks, higher in the gaps, fade out at the end. */
export function musicVolume(frame: number, tl: Timeline, opts: { bed?: number; duck?: number; ramp?: number; fadeOut?: number; fadeIn?: number } = {}) {
  const bed = opts.bed ?? 0.5;
  const duck = opts.duck ?? 0.16;
  const ramp = opts.ramp ?? 10;
  let v = bed;
  for (const s of tl.scenes) {
    const a = s.voStart - ramp;
    const b = s.voEnd + ramp * 1.5;
    if (frame >= a && frame <= b) {
      let k = 1;
      if (frame < s.voStart) k = (frame - a) / ramp;
      else if (frame > s.voEnd) k = 1 - (frame - s.voEnd) / (ramp * 1.5);
      v = Math.min(v, bed - (bed - duck) * Math.max(0, Math.min(1, k)));
    }
  }
  const fo = opts.fadeOut ?? 60;
  const tail = (tl.durationInFrames - frame) / fo;
  if (tail < 1) v *= Math.max(0, tail);
  const fi = opts.fadeIn ?? 20;
  if (frame < fi) v *= frame / fi;
  return Math.max(0, v);
}
