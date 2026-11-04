// Render evenly spaced check frames for QA: node scripts/stills.mjs VIDEO-002 /out/dir [count] [frame,frame,...]
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind-v4';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const [id, out, countArg, framesArg] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), webpackOverride: (c) => enableTailwind(c), publicDir: path.join(root, 'public') });
const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions: { gl: 'swangle' } });
const n = Number(countArg || 10);
const frames = framesArg ? framesArg.split(',').map(Number) : Array.from({ length: n }, (_, i) => Math.floor(composition.durationInFrames * (i + 0.5) / n));
console.log(id, 'frames', composition.durationInFrames, '->', frames.join(','));
for (const frame of frames) {
  await renderStill({ composition, serveUrl, output: path.join(out, `f${frame}.jpg`), frame, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, chromiumOptions: { gl: 'swangle' } });
}
fs.writeFileSync(path.join(out, 'frames.txt'), frames.join(' '));
console.log('done');
