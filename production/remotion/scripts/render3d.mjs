// Render 3D layer compositions (transparent) to PNG sequences in public/3d/<name>/element-N.png
// using the swangle GL renderer (WebGL works there). The main 2D compositions then load the
// frames as images, so they keep the fast swiftshader renderer.
// usage: node scripts/render3d.mjs <CompositionId> [<CompositionId> ...]   (env CONCURRENCY=4)
// env FRAMES="a-b" re-renders only that inclusive frame range into the existing directory.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind-v4';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const ids = process.argv.slice(2);
if (!ids.length) throw new Error('pass composition ids');
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const chromiumOptions = { gl: 'swangle' };
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), webpackOverride: (c) => enableTailwind(c), publicDir: path.join(root, 'public') });
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000 });
  const outputDir = path.join(root, 'public', '3d', id);
  const range = process.env.FRAMES ? process.env.FRAMES.split('-').map(Number) : null;
  if (!range) fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  const t = Date.now(); let last = -1;
  console.log(`== ${id}: ${composition.durationInFrames} frames -> public/3d/${id}`);
  await renderFrames({
    composition, serveUrl, outputDir, imageFormat: 'png', browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000,
    concurrency: Number(process.env.CONCURRENCY || 4), inputProps: {}, frameRange: range ?? undefined,
    onStart: () => {}, onFrameUpdate: (n) => { const p = Math.floor((n / composition.durationInFrames) * 10); if (p !== last) { last = p; process.stdout.write(`${p * 10}% `); } },
  });
  fs.writeFileSync(path.join(outputDir, 'meta.json'), JSON.stringify({ id, frames: composition.durationInFrames, renderedAt: new Date().toISOString() }));
  const readyPath = path.join(root, 'src', 'lib', 'layers-ready.json');
  const cur = fs.existsSync(readyPath) ? JSON.parse(fs.readFileSync(readyPath, 'utf8')).ready : [];
  if (!cur.includes(id)) cur.push(id);
  fs.writeFileSync(readyPath, JSON.stringify({ ready: cur }, null, 1));
  console.log(`\n   done in ${((Date.now() - t) / 1000).toFixed(0)} s (${((Date.now() - t) / composition.durationInFrames).toFixed(0)} ms/frame)`);
}
