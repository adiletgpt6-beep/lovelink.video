// Writes src/lib/layers-ready.json = ids of 3D layers whose PNG sequences are complete (meta.json + all frames present).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', '3d');
const complete = (d) => {
  const metaPath = path.join(dir, d, 'meta.json');
  if (!fs.existsSync(metaPath)) return false;
  const { frames } = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const pngs = fs.readdirSync(path.join(dir, d)).filter((f) => f.endsWith('.png')).length;
  if (pngs !== frames) console.warn(`incomplete layer ${d}: ${pngs}/${frames} frames`);
  return pngs === frames;
};
const ready = fs.existsSync(dir) ? fs.readdirSync(dir).filter(complete) : [];
fs.writeFileSync(path.join(root, 'src', 'lib', 'layers-ready.json'), JSON.stringify({ ready }, null, 1));
console.log('ready layers:', ready.join(', ') || '(none)');
