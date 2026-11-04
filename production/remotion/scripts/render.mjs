// Render the final MP4s: node scripts/render.mjs [VIDEO-001 ...]
// Output: <repo>/videos/<ID>/<ID>.mp4 — 1080x1920, 30 fps, H.264 (yuv420p) + AAC.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind-v4';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const repo = path.join(root, '..', '..');
const ids = process.argv.slice(2).filter((a) => a.startsWith('VIDEO-'));
const all = ids.length ? ids : ['VIDEO-001', 'VIDEO-002', 'VIDEO-003', 'VIDEO-004', 'VIDEO-005'];
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const chromiumOptions = { gl: 'swangle' };

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), webpackOverride: (c) => enableTailwind(c), publicDir: path.join(root, 'public') });
for (const id of all) {
  const outDir = path.join(repo, 'videos', id);
  fs.mkdirSync(outDir, { recursive: true });
  const outputLocation = path.join(outDir, `${id}.mp4`);
  const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions });
  console.log(`\n== ${id}: ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(2)} s)`);
  const started = Date.now();
  let last = -1;
  await renderMedia({
    composition, serveUrl, codec: 'h264', outputLocation, browserExecutable, chromiumOptions,
    crf: 18, pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '192k', imageFormat: 'jpeg', jpegQuality: 92,
    concurrency: Number(process.env.CONCURRENCY || 4), x264Preset: 'slow', colorSpace: 'bt709',
    onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p !== last) { last = p; process.stdout.write(`${p * 5}% `); } },
  });
  console.log(`\n   done in ${((Date.now() - started) / 1000).toFixed(0)} s -> ${outputLocation}`);
}
