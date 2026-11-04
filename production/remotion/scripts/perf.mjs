import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderFrames, selectComposition, openBrowser } from '@remotion/renderer';
import { enableTailwind } from '@remotion/tailwind-v4';
import fs from 'node:fs';
const here = path.dirname(fileURLToPath(import.meta.url)); const root = path.join(here, '..');
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const gl = process.env.GL || 'swiftshader';
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), webpackOverride: (c) => enableTailwind(c), publicDir: path.join(root, 'public') });
const ids = process.argv.slice(2);
for (const id of ids) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions: { gl } });
  const out = fs.mkdtempSync('/tmp/perf-');
  const t = Date.now();
  await renderFrames({ composition, serveUrl, outputDir: out, imageFormat: 'jpeg', jpegQuality: 90, frameRange: [Number(process.env.FRAME_START || 0), Number(process.env.FRAME_START || 0) + 23], concurrency: Number(process.env.CONCURRENCY || 4), browserExecutable, chromiumOptions: { gl }, onFrameUpdate: () => {}, onStart: () => {}, inputProps: {} });
  console.log(id, gl, 'ms/frame', ((Date.now() - t) / 24).toFixed(0));
  fs.rmSync(out, { recursive: true });
}
