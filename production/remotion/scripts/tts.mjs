// Generates the Russian voice-over for every video with ElevenLabs
// (text-to-speech with character timestamps), normalises loudness with
// ffmpeg and writes word-level timing JSON consumed by the Remotion
// compositions (src/lib/voTimeline.ts).
//
// Usage: ELEVENLABS_API_KEY=... node scripts/tts.mjs [VIDEO-001 ...] [--force]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(here, 'vo-scripts.json'), 'utf8'));
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not set');

const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter((a) => a.startsWith('VIDEO-'));
const outRoot = path.join(root, 'public', 'audio', 'vo');
// loudness normalise, trim trailing silence down to ~0.15 s, tiny fade-in
const FILTERS = 'loudnorm=I=-16:TP=-1.5:LRA=11,areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.15,areverse,afade=t=in:st=0:d=0.02';
const reprocess = process.argv.includes('--reprocess');

function wordsFromAlignment(text, alignment) {
  // alignment: { characters[], character_start_times_seconds[], character_end_times_seconds[] }
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;
  const words = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const isSpace = /\s/.test(ch);
    if (isSpace) {
      if (cur) { words.push(cur); cur = null; }
      continue;
    }
    if (!cur) cur = { text: ch, start: starts[i], end: ends[i] };
    else { cur.text += ch; cur.end = ends[i]; }
  }
  if (cur) words.push(cur);
  // Strip pure punctuation tokens into neighbours
  const cleaned = [];
  for (const w of words) {
    if (/^[\p{P}\p{S}]+$/u.test(w.text) && cleaned.length) {
      cleaned[cleaned.length - 1].text += w.text;
      cleaned[cleaned.length - 1].end = w.end;
    } else cleaned.push(w);
  }
  return cleaned;
}

async function synth(voice, text, model) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}/with-timestamps?output_format=mp3_44100_128`;
  const body = { text, model_id: model, language_code: 'ru', voice_settings: voice.settings };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return res.json();
    const txt = await res.text();
    console.warn(`  attempt ${attempt} failed: ${res.status} ${txt.slice(0, 200)}`);
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
  throw new Error('TTS failed');
}

function duration(file) {
  return parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());
}

for (const [videoId, video] of Object.entries(cfg.videos)) {
  if (only.length && !only.includes(videoId)) continue;
  const dir = path.join(outRoot, videoId);
  fs.mkdirSync(dir, { recursive: true });
  const manifestPath = path.join(dir, 'timeline.json');
  const manifest = { videoId, title: video.title, voice: video.voice.name, model: cfg.model, segments: [] };
  console.log(`\n== ${videoId} — ${video.title} (${video.voice.name})`);
  for (const seg of video.segments) {
    const raw = path.join(dir, `${seg.id}.raw.mp3`);
    const out = path.join(dir, `${seg.id}.mp3`);
    const meta = path.join(dir, `${seg.id}.json`);
    if (force || !fs.existsSync(meta)) {
      process.stdout.write(`  ${seg.id}: ${seg.text.slice(0, 60)}… `);
      const json = await synth(video.voice, seg.text, cfg.model);
      fs.writeFileSync(raw, Buffer.from(json.audio_base64, 'base64'));
      const words = wordsFromAlignment(seg.text, json.alignment);
      // loudness normalise (single pass) + gentle fades; keep mp3 for size
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', FILTERS, '-ar', '44100', '-b:a', '160k', out]);
      fs.writeFileSync(meta, JSON.stringify({ id: seg.id, text: seg.text, words }, null, 1));
      console.log(`ok (${words.length} words)`);
    }
    if (reprocess) {
      const src = fs.existsSync(raw) ? raw : out;
      const tmp = out + '.tmp.mp3';
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', src, '-af', FILTERS, '-ar', '44100', '-b:a', '160k', tmp]);
      fs.renameSync(tmp, out);
    }
    const m = JSON.parse(fs.readFileSync(meta, 'utf8'));
    manifest.segments.push({ id: seg.id, text: seg.text, file: `audio/vo/${videoId}/${seg.id}.mp3`, duration: duration(out), words: m.words });
  }
  const total = manifest.segments.reduce((a, s) => a + s.duration, 0);
  manifest.totalSpeech = total;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  console.log(`  total speech: ${total.toFixed(1)}s`);
}
