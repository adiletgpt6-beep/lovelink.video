// Writes src/lib/layers-ready.json = ids of 3D layers whose PNG sequences are complete (meta.json present).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public', '3d');
const ready = fs.existsSync(dir) ? fs.readdirSync(dir).filter((d) => fs.existsSync(path.join(dir, d, 'meta.json'))) : [];
fs.writeFileSync(path.join(root, 'src', 'lib', 'layers-ready.json'), JSON.stringify({ ready }, null, 1));
console.log('ready layers:', ready.join(', ') || '(none)');
