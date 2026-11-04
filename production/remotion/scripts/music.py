"""Procedural, royalty-free background music for the five LoveLink videos.

Everything is synthesised from scratch with numpy (no samples, no third-party
audio), so the tracks carry no licence restrictions. Each track has its own
tempo, key, chord progression and instrumentation so the five videos sound
different from one another. Output: 44.1 kHz stereo WAV -> AAC/MP3 via ffmpeg.

Usage: python3 scripts/music.py [out_dir]
"""
import math, os, subprocess, sys, wave, struct
import numpy as np

SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'music')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}

def freq(name):
    # name like 'A4', 'F#3'
    n, octv = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((NOTE[n] - 9) / 12 + (octv - 4))

def adsr(n, a, d, s, r, sr=SR):
    a_n, d_n, r_n = int(a * sr), int(d * sr), int(r * sr)
    s_n = max(n - a_n - d_n - r_n, 0)
    env = np.concatenate([
        np.linspace(0, 1, a_n, endpoint=False),
        np.linspace(1, s, d_n, endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, r_n),
    ])
    return env[:n] if len(env) >= n else np.pad(env, (0, n - len(env)))

def lowpass(x, cutoff, sr=SR):
    # one-pole IIR, cheap and smooth
    rc = 1.0 / (2 * math.pi * cutoff)
    dt = 1.0 / sr
    alpha = dt / (rc + dt)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    return y

def lowpass_fast(x, cutoff, sr=SR):
    # vectorised approximation using scipy-free FFT brickwall-ish with soft slope
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / sr)
    gain = 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X * gain, n=len(x))

def osc(f, n, kind='sine', detune=0.0, sr=SR):
    t = np.arange(n) / sr
    ph = 2 * math.pi * f * (1 + detune) * t
    if kind == 'sine':
        return np.sin(ph)
    if kind == 'tri':
        return 2 / math.pi * np.arcsin(np.sin(ph))
    if kind == 'saw':
        return 2 * ((f * (1 + detune) * t) % 1) - 1
    if kind == 'square':
        return np.sign(np.sin(ph))
    raise ValueError(kind)

def piano(f, dur, vel=1.0):
    n = int(dur * SR)
    out = np.zeros(n)
    for k, amp in enumerate([1.0, 0.5, 0.25, 0.12, 0.06]):
        partial = osc(f * (k + 1), n, 'sine') * amp
        partial *= np.exp(-np.arange(n) / SR * (2.2 + k * 1.5))
        out += partial
    out *= adsr(n, 0.004, 0.2, 0.6, min(0.4, dur * 0.5))
    return out * vel * 0.5

def pluck(f, dur, vel=1.0):
    n = int(dur * SR)
    out = osc(f, n, 'tri') * 0.7 + osc(f, n, 'sine', 0.002) * 0.3
    out *= np.exp(-np.arange(n) / SR * 5.0)
    out *= adsr(n, 0.002, 0.05, 0.5, 0.15)
    return out * vel * 0.6

def pad(f, dur, vel=1.0, bright=900):
    n = int(dur * SR)
    out = (osc(f, n, 'saw', -0.004) + osc(f, n, 'saw', 0.004) + osc(f / 2, n, 'tri')) / 3
    out = lowpass_fast(out, bright)
    out *= adsr(n, min(0.6, dur * 0.3), 0.3, 0.8, min(1.2, dur * 0.4))
    return out * vel * 0.35

def bell(f, dur, vel=1.0):
    n = int(dur * SR)
    out = osc(f, n, 'sine') + 0.4 * osc(f * 2.76, n, 'sine') + 0.2 * osc(f * 5.4, n, 'sine')
    out *= np.exp(-np.arange(n) / SR * 3.0)
    return out * vel * 0.25

def bass(f, dur, vel=1.0):
    n = int(dur * SR)
    out = osc(f, n, 'sine') * 0.8 + osc(f, n, 'tri') * 0.3
    out *= adsr(n, 0.01, 0.1, 0.7, 0.1)
    return out * vel * 0.6

def kick(dur=0.35, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 150 * np.exp(-t * 18) + 45
    ph = 2 * math.pi * np.cumsum(f) / SR
    out = np.sin(ph) * np.exp(-t * 9)
    return out * vel

def hat(dur=0.06, vel=1.0, open_=False):
    n = int((0.25 if open_ else dur) * SR)
    noise = rng.standard_normal(n)
    X = np.fft.rfft(noise); fr = np.fft.rfftfreq(n, 1 / SR)
    X[fr < 6000] *= 0.05
    noise = np.fft.irfft(X, n=n)
    env = np.exp(-np.arange(n) / SR * (12 if open_ else 60))
    return noise * env * vel * 0.25

def snare(vel=1.0):
    n = int(0.22 * SR)
    noise = rng.standard_normal(n)
    X = np.fft.rfft(noise); fr = np.fft.rfftfreq(n, 1 / SR)
    X[fr < 1500] *= 0.3
    noise = np.fft.irfft(X, n=n) * np.exp(-np.arange(n) / SR * 22)
    tone = np.sin(2 * math.pi * 190 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR * 30)
    return (noise * 0.7 + tone * 0.5) * vel * 0.6

def shaker(vel=1.0):
    n = int(0.08 * SR)
    noise = rng.standard_normal(n)
    X = np.fft.rfft(noise); fr = np.fft.rfftfreq(n, 1 / SR)
    X[fr < 4000] *= 0.1
    noise = np.fft.irfft(X, n=n) * np.exp(-np.arange(n) / SR * 45)
    return noise * vel * 0.15

def reverb(x, decay=0.5, mix=0.25, sr=SR):
    # Schroeder-style: 4 combs + 2 allpass, vectorised with FFT convolution of an exponential noise IR
    n_ir = int(sr * 1.8)
    t = np.arange(n_ir) / sr
    ir = rng.standard_normal(n_ir) * np.exp(-t / (decay * 0.9))
    ir[0] = 0
    ir = lowpass_fast(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    wet = np.fft.irfft(np.fft.rfft(x, len(x) + n_ir) * np.fft.rfft(ir, len(x) + n_ir))[: len(x)]
    return x * (1 - mix) + wet * mix * 3.0

def place(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if i < len(buf):
        buf[i:j] += sig[: j - i]

def chord_notes(root, kind):
    semis = {'maj': [0, 4, 7], 'min': [0, 3, 7], 'maj7': [0, 4, 7, 11], 'min7': [0, 3, 7, 10], 'sus2': [0, 2, 7], 'add9': [0, 4, 7, 14], 'min9': [0, 3, 7, 10, 14]}[kind]
    base = freq(root)
    return [base * 2 ** (s / 12) for s in semis]

def stereo(mono_l, mono_r=None, width=0.0):
    if mono_r is None:
        mono_r = mono_l
    return np.stack([mono_l, mono_r], axis=1)

def finalize(name, left, right, target_peak=0.5, fade_out=3.0):
    n = len(left)
    fade = np.ones(n)
    f_n = int(fade_out * SR)
    fade[-f_n:] = np.linspace(1, 0, f_n)
    fade_in = int(0.8 * SR)
    fade[:fade_in] *= np.linspace(0, 1, fade_in)
    left = left * fade; right = right * fade
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)), 1e-9)
    left = left / peak * target_peak; right = right / peak * target_peak
    data = np.stack([left, right], axis=1)
    pcm = (np.clip(data, -1, 1) * 32767).astype('<i2')
    wav_path = os.path.join(OUT, f'{name}.wav')
    with wave.open(wav_path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    mp3_path = os.path.join(OUT, f'{name}.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav_path, '-b:a', '192k', mp3_path], check=True)
    os.remove(wav_path)
    print(f'{name}: {n / SR:.1f}s -> {mp3_path}')

# ---------------------------------------------------------------- tracks

def track_emotional(length=52.0):
    """VIDEO-001: slow cinematic piano + warm pad, 66 BPM, D major-ish (I V vi IV)."""
    bpm = 66; beat = 60 / bpm; bar = beat * 4
    n = int(length * SR)
    L = np.zeros(n); R = np.zeros(n)
    prog = [('D3', 'maj7'), ('A2', 'maj'), ('B2', 'min7'), ('G2', 'maj7')]
    t = 0.0; i = 0
    while t < length:
        root, kind = prog[i % 4]
        notes = chord_notes(root, kind)
        p = pad(notes[0] * 2, bar * 1.05, 0.9, 700)
        place(L, p, t); place(R, pad(notes[1] * 2, bar * 1.05, 0.9, 650), t)
        # arpeggiated piano (8ths), soft velocities, slight humanisation
        for k in range(8):
            nt = notes[(k * 2) % len(notes)] * (2 if k % 4 in (1, 3) else 1) * 2
            vel = 0.55 + 0.25 * (k % 2 == 0) + rng.uniform(-0.05, 0.05)
            s = piano(nt, beat * 1.6, vel)
            at = t + k * beat / 2 + rng.uniform(0, 0.012)
            place(L if k % 2 == 0 else R, s * 0.9, at); place(R if k % 2 == 0 else L, s * 0.6, at)
        # sparse bell on bar start every second bar
        if i % 2 == 0:
            b = bell(notes[2] * 4, 2.5, 0.5)
            place(L, b, t + beat * 2); place(R, b * 0.8, t + beat * 2 + 0.01)
        place(L, bass(freq(root) / 2 if freq(root) > 100 else freq(root), bar, 0.5), t)
        place(R, bass(freq(root) / 2 if freq(root) > 100 else freq(root), bar, 0.5), t)
        t += bar; i += 1
    L = reverb(L, 1.1, 0.33); R = reverb(R, 1.1, 0.33)
    finalize('VIDEO-001-music', L, R, 0.45)

def track_demo(length=52.0):
    """VIDEO-002: light, modern product-demo groove, 104 BPM, plucks + soft kick/hats, F major."""
    bpm = 104; beat = 60 / bpm; bar = beat * 4
    n = int(length * SR)
    L = np.zeros(n); R = np.zeros(n)
    prog = [('F3', 'add9'), ('C3', 'maj'), ('D3', 'min7'), ('A#2', 'maj7')]
    t = 0.0; i = 0
    while t < length:
        root, kind = prog[i % 4]
        notes = chord_notes(root, kind)
        place(L, pad(notes[0], bar, 0.5, 1200), t); place(R, pad(notes[2], bar, 0.5, 1100), t)
        for k in range(16):
            if k % 4 in (0, 1, 3):
                nt = notes[(k // 2) % len(notes)] * 2
                s = pluck(nt, beat * 0.5, 0.7 + 0.2 * (k % 4 == 0))
                place(L if k % 2 else R, s, t + k * beat / 4); place(R if k % 2 else L, s * 0.5, t + k * beat / 4)
        for k in range(4):
            place(L, kick(0.3, 0.8), t + k * beat); place(R, kick(0.3, 0.8), t + k * beat)
            place(L, hat(0.05, 0.6), t + k * beat + beat / 2); place(R, hat(0.05, 0.6), t + k * beat + beat / 2)
            if k in (1, 3) and i >= 1:
                place(L, snare(0.35) * 0.6, t + k * beat); place(R, snare(0.35) * 0.6, t + k * beat)
        for k in range(8):
            place(R, shaker(0.5 + 0.3 * (k % 2)), t + k * beat / 2 + beat / 4)
        bf = freq(root) / 2
        for k in range(8):
            place(L, bass(bf, beat * 0.45, 0.55), t + k * beat / 2); place(R, bass(bf, beat * 0.45, 0.55), t + k * beat / 2)
        t += bar; i += 1
    L = reverb(L, 0.6, 0.18); R = reverb(R, 0.6, 0.18)
    finalize('VIDEO-002-music', L, R, 0.5)

def track_dynamic(length=52.0):
    """VIDEO-003: energetic ad groove, 124 BPM, driving kick + saw stabs, A minor."""
    bpm = 124; beat = 60 / bpm; bar = beat * 4
    n = int(length * SR)
    L = np.zeros(n); R = np.zeros(n)
    prog = [('A2', 'min'), ('F2', 'maj'), ('C3', 'maj'), ('G2', 'maj')]
    t = 0.0; i = 0
    while t < length:
        root, kind = prog[i % 4]
        notes = chord_notes(root, kind)
        # stabs on off-beats
        for k in range(8):
            if k % 2 == 1 or k == 0:
                st = pad(notes[0] * 2, beat * 0.45, 1.0, 2200) + pad(notes[1] * 2, beat * 0.45, 0.8, 2000)
                st = st * np.exp(-np.arange(len(st)) / SR * 6)
                place(L, st, t + k * beat / 2); place(R, st * 0.9, t + k * beat / 2 + 0.004)
        for k in range(4):
            place(L, kick(0.32, 1.0), t + k * beat); place(R, kick(0.32, 1.0), t + k * beat)
            place(L, hat(0.04, 0.7), t + k * beat + beat / 2); place(R, hat(0.04, 0.7), t + k * beat + beat / 2)
            if k in (1, 3):
                place(L, snare(0.5), t + k * beat); place(R, snare(0.5), t + k * beat)
        if i % 4 == 3:
            place(L, hat(0.1, 0.5, True), t + 3.5 * beat); place(R, hat(0.1, 0.5, True), t + 3.5 * beat)
        bf = freq(root)
        for k in range(16):
            vel = 0.7 if k % 4 == 0 else 0.45
            place(L, bass(bf * (2 if k % 8 == 6 else 1), beat * 0.22, vel), t + k * beat / 4)
            place(R, bass(bf * (2 if k % 8 == 6 else 1), beat * 0.22, vel), t + k * beat / 4)
        # lead arpeggio in later bars
        if i >= 2:
            for k in range(8):
                nt = notes[k % 3] * 4
                s = pluck(nt, beat * 0.4, 0.4)
                place(R if k % 2 else L, s, t + k * beat / 2)
        t += bar; i += 1
    L = reverb(L, 0.5, 0.14); R = reverb(R, 0.5, 0.14)
    finalize('VIDEO-003-music', L, R, 0.55)

def track_story(length=55.0):
    """VIDEO-004: warm, hopeful storytelling, 84 BPM, 6/8 feel, felt piano + plucks, G major."""
    bpm = 84; beat = 60 / bpm; bar = beat * 3
    n = int(length * SR)
    L = np.zeros(n); R = np.zeros(n)
    prog = [('G2', 'maj'), ('D3', 'maj'), ('E2', 'min7'), ('C3', 'maj7'), ('G2', 'maj'), ('B2', 'min'), ('C3', 'add9'), ('D3', 'sus2')]
    t = 0.0; i = 0
    while t < length:
        root, kind = prog[i % len(prog)]
        notes = chord_notes(root, kind)
        place(L, pad(notes[0] * 2, bar * 1.1, 0.6, 800), t); place(R, pad(notes[1] * 2, bar * 1.1, 0.6, 750), t)
        for k in range(6):
            nt = notes[k % len(notes)] * (2 if k in (1, 2, 4, 5) else 1) * 2
            vel = 0.75 if k == 0 else 0.5 + rng.uniform(-0.05, 0.08)
            s = piano(nt, beat * 1.2, vel)
            at = t + k * beat / 2 + rng.uniform(0, 0.01)
            place(L, s * (0.9 if k % 2 == 0 else 0.6), at); place(R, s * (0.6 if k % 2 == 0 else 0.9), at)
        if i % 2 == 1:
            s = pluck(notes[-1] * 4, beat, 0.4)
            place(R, s, t + beat * 2); place(L, s * 0.5, t + beat * 2 + 0.01)
        if i >= 2:
            place(L, shaker(0.35), t + beat * 1.5); place(R, shaker(0.35), t + beat * 2.5)
        place(L, bass(freq(root) / 2 if freq(root) > 100 else freq(root), bar * 0.9, 0.5), t)
        place(R, bass(freq(root) / 2 if freq(root) > 100 else freq(root), bar * 0.9, 0.5), t)
        t += bar; i += 1
    L = reverb(L, 0.9, 0.3); R = reverb(R, 0.9, 0.3)
    finalize('VIDEO-004-music', L, R, 0.45)

def track_ad(length=50.0):
    """VIDEO-005: punchy, bright pop, 128 BPM, four-on-the-floor, plucky chords, C major."""
    bpm = 128; beat = 60 / bpm; bar = beat * 4
    n = int(length * SR)
    L = np.zeros(n); R = np.zeros(n)
    prog = [('C3', 'maj'), ('G2', 'maj'), ('A2', 'min7'), ('F2', 'maj7')]
    t = 0.0; i = 0
    while t < length:
        root, kind = prog[i % 4]
        notes = chord_notes(root, kind)
        for k in range(8):
            chord = sum(pluck(nn * 2, beat * 0.5, 0.5) for nn in notes[:3])
            if k % 2 == 0 or k == 3 or k == 7:
                place(L, chord, t + k * beat / 2); place(R, chord * 0.9, t + k * beat / 2 + 0.003)
        for k in range(4):
            place(L, kick(0.3, 1.0), t + k * beat); place(R, kick(0.3, 1.0), t + k * beat)
            place(L, hat(0.04, 0.8), t + k * beat + beat / 2); place(R, hat(0.04, 0.8), t + k * beat + beat / 2)
            if k in (1, 3):
                place(L, snare(0.45), t + k * beat); place(R, snare(0.45), t + k * beat)
        for k in range(16):
            place(R if k % 2 else L, hat(0.03, 0.25), t + k * beat / 4)
        bf = freq(root)
        for k in range(8):
            place(L, bass(bf, beat * 0.4, 0.6), t + k * beat / 2); place(R, bass(bf, beat * 0.4, 0.6), t + k * beat / 2)
        if i >= 1:
            for k in range(4):
                nt = notes[(k + i) % 3] * 4
                s = bell(nt, beat, 0.35)
                place(L if k % 2 else R, s, t + k * beat + beat / 2)
        t += bar; i += 1
    L = reverb(L, 0.45, 0.12); R = reverb(R, 0.45, 0.12)
    finalize('VIDEO-005-music', L, R, 0.55)

if __name__ == '__main__':
    track_emotional(); track_demo(); track_dynamic(); track_story(); track_ad()
