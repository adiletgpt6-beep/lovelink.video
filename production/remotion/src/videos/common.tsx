import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { musicVolume, Scene, Timeline } from '../lib/timeline';
import { fade } from '../lib/anim';

/** Music bed with ducking + one VO clip per scene. */
export const VideoAudio: React.FC<{ tl: Timeline; music: string; bed?: number; duck?: number; voVolume?: number }> = ({ tl, music, bed = 0.5, duck = 0.16, voVolume = 1 }) => (
  <>
    <Audio src={staticFile(music)} volume={(f) => musicVolume(f, tl, { bed, duck })} />
    {tl.scenes.map((s) => (
      <Sequence key={s.seg.id} from={s.voStart} durationInFrames={Math.ceil(s.seg.duration * tl.fps) + 2}>
        <Audio src={staticFile(s.seg.file)} volume={voVolume} />
      </Sequence>
    ))}
  </>
);

/** Mounts children for the scene's frames (+overlap) with a short fade-in. */
export const SceneSeq: React.FC<{ scene: Scene; overlap?: number; fadeIn?: boolean; children: React.ReactNode; z?: number }> = ({ scene, overlap = 10, fadeIn = true, children, z }) => (
  <Sequence from={scene.start} durationInFrames={scene.duration + overlap} layout="none">
    <SceneFade enabled={fadeIn && scene.index > 0} z={z}>{children}</SceneFade>
  </Sequence>
);

const SceneFade: React.FC<{ enabled: boolean; children: React.ReactNode; z?: number }> = ({ enabled, children, z }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: enabled ? fade(f, 0, 8) : 1, zIndex: z }}>{children}</AbsoluteFill>;
};

/** Seconds → frames helper bound to 30 fps. */
export const sec = (s: number) => Math.round(s * 30);

/** Local frame (relative to scene start) at which a spoken word starting with `needle` begins. */
export function wordAt(scene: Scene, needle: string, fallbackSec = 0): number {
  const n = needle.toLowerCase();
  const w = scene.seg.words.find((x) => x.text.toLowerCase().replace(/^[«"(]+/, '').startsWith(n));
  if (!w) return scene.voStart - scene.start + Math.round(fallbackSec * 30);
  return scene.voStart - scene.start + Math.round(w.start * 30);
}

/** Frames per spoken word (local to the scene) — for typography synced with the voice. */
export function wordStarts(scene: Scene): number[] {
  const off = scene.voStart - scene.start;
  return scene.seg.words.map((w) => off + Math.round(w.start * 30));
}
