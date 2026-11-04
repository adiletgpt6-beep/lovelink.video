import React from 'react';
import { ArtPhoto } from '../ui/ArtPhoto';
import { PlayIcon } from '../ui/Illustrations';
import { EmojiBurst } from '../ui/Fx';
import type { GiftContent } from '../lib/content';

export const CARD_W = 260;
export const CARD_H = Math.round(260 * 16 / 9);

/** First card: video with poster + play button (First.jsx). */
export const FirstCard: React.FC<{ g: GiftContent; playing?: boolean; seed?: number; frame?: number }> = ({ g, playing = false, seed = 21, frame = 0 }) => (
  <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-black ring-1 ring-white/10">
    <ArtPhoto variant={g.firstVariant} seed={seed} style={{ position: 'absolute', inset: 0 }} zoom={playing ? 1.08 : 1} animate={playing}>
      {playing && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at ${50 + Math.sin(frame / 15) * 20}% ${40 + Math.cos(frame / 20) * 15}%, rgba(255,255,255,0.25), transparent 40%)` }} />
          <div className="absolute left-4 right-4 bottom-5 text-center text-white/90" style={{ fontSize: 15, textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>с любовью 🤍</div>
        </>
      )}
    </ArtPhoto>
    {!playing && (
      <div className="absolute inset-0 flex items-center justify-center"><PlayIcon size={64} /></div>
    )}
  </div>
);

export const SecondCard: React.FC<{ g: GiftContent; seed?: number }> = ({ g, seed = 22 }) => (
  <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-black ring-1 ring-white/10">
    <ArtPhoto variant={g.secondVariant} seed={seed} style={{ position: 'absolute', inset: 0 }}>
      <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: 96 }}>🎂</div>
    </ArtPhoto>
  </div>
);

/** Third card: "Причины" (Third.jsx). */
export const ThirdCard: React.FC<{ g: GiftContent; reasonIndex?: number; seed?: number; pressed?: number }> = ({ g, reasonIndex = 0, seed = 23, pressed = 0 }) => (
  <div className="relative h-full w-full overflow-hidden rounded-[28px] ring-1 ring-white/10">
    <ArtPhoto variant={g.thirdVariant} seed={seed} style={{ position: 'absolute', inset: 0 }} />
    <div className="absolute inset-0 bg-black/45" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
    <div className="absolute left-4 right-4 top-4 z-10 flex gap-1.5">
      {g.words.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i === reasonIndex ? 'bg-white' : i < reasonIndex ? 'bg-white/70' : 'bg-white/25'}`} />)}
    </div>
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-10 text-center select-none">
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-[0_18px_34px_rgba(0,0,0,0.35)]"><span className="text-2xl">{g.icon}</span></div>
      <h2 className="mt-2.5 text-[24px] font-medium text-white" style={{ lineHeight: 1.2, textShadow: '0 4px 14px rgba(0,0,0,0.45)' }}>{g.title}</h2>
      <p className="mt-5 text-[17px] text-white" style={{ textShadow: '0 4px 14px rgba(0,0,0,0.45)' }}>{g.words[reasonIndex]}</p>
      <div className="mt-8 mb-2.5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-white/90 ring-1 ring-white/20 shadow-[0_16px_34px_rgba(0,0,0,0.35)]" style={{ transform: `scale(${1 - 0.04 * pressed})` }}>{g.button}</div>
      <p className="mt-3 text-[12px] text-white/80">{reasonIndex + 1} / {g.words.length}</p>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/70 to-transparent" />
  </div>
);

/** Fourth card: emoji reactions (Four.jsx). */
export const FourCard: React.FC<{ g: GiftContent; activeEmoji?: string | null; responseText?: string | null; burstStart?: number; frame?: number }> = ({ g, activeEmoji = null, responseText = null, burstStart, frame = 0 }) => {
  const cloud = g.reactions;
  const cx = CARD_W / 2; const cy = CARD_H * 0.46;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] ring-1 ring-white/10">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#151210 0%,#0e0d0c 55%,#131110 100%)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.10]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)', backgroundSize: '18px 18px' }} />
      <div className="pointer-events-none absolute rounded-full" style={{ left: '50%', top: '46%', width: 300, height: 300, transform: 'translate(-50%,-50%)', opacity: 0.6, background: 'radial-gradient(circle, rgba(255,105,180,0.14) 0%, rgba(255,200,140,0.1) 35%, rgba(255,255,255,0) 70%)' }} />
      {activeEmoji && <div className="pointer-events-none absolute inset-0" style={{ opacity: 0.5, background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.45) 0%, rgba(255,240,246,0.22) 35%, rgba(255,255,255,0) 70%)' }} />}
      {/* center heart */}
      <span className="absolute select-none" style={{ left: cx, top: cy, transform: `translate(-50%,-50%) scale(${(activeEmoji === 'CENTER' ? 1.18 : 1) * (1 + 0.03 * Math.sin(frame / 15))})`, fontSize: 52, textShadow: activeEmoji === 'CENTER' ? '0 0 18px rgba(255,105,180,0.55)' : undefined }}>{g.center.icon}</span>
      {cloud.map((r, idx) => {
        const t = idx / Math.max(1, cloud.length - 1);
        const ang = -Math.PI * 0.92 + t * (Math.PI * 0.88);
        const x = Math.cos(ang) * 88; const y = Math.sin(ang) * 104;
        const isActive = activeEmoji === r.emoji;
        return <span key={r.emoji} className="absolute select-none" style={{ left: cx + x, top: cy + y + Math.sin(frame / 22 + idx) * 3, transform: `translate(-50%,-50%) scale(${isActive ? 1.22 : 1})`, fontSize: 38, textShadow: isActive ? '0 0 16px rgba(255,105,180,0.42)' : undefined }}>{r.emoji}</span>;
      })}
      {burstStart !== undefined && <EmojiBurst start={burstStart} x={cx} y={cy} />}
      <div className="absolute inset-x-0 z-20 flex justify-center px-5" style={{ bottom: 160 }}>
        {responseText ? (
          <div className="max-w-[92%] rounded-2xl bg-black/60 px-5 py-3 text-center text-[15px] leading-snug text-white/90">{responseText}</div>
        ) : (
          <div className="max-w-[90%] rounded-[20px] border border-white/[0.09] px-5 py-[10px] text-center text-[13px] font-medium leading-snug text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.22)]" style={{ backgroundColor: 'rgba(14,14,20,0.48)' }}>{g.caption}</div>
        )}
      </div>
    </div>
  );
};

/** Fifth card: night sky finale (Five.jsx). `t` = seconds since the card became active. */
export const FiveCard: React.FC<{ g: GiftContent; t?: number }> = ({ g, t = 10 }) => {
  const line1 = Math.min(1, Math.max(0, (t - 0.4) / 0.9));
  const heart = Math.min(1, Math.max(0, (t - 1.2) / 0.9));
  const line2 = Math.min(1, Math.max(0, (t - 2.0) / 0.9));
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[28px] ring-1 ring-white/10">
      <div className="absolute inset-0 bg-[#06060a]" />
      <div className="absolute inset-0" style={{ opacity: Math.min(1, t / 1.4), background: 'radial-gradient(circle at 50% 38%, rgba(120,90,255,0.18) 0%, rgba(20,16,36,0.75) 42%, rgba(6,6,10,1) 100%), linear-gradient(180deg, rgba(12,12,18,0.55), rgba(6,6,10,0.95))' }} />
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (i * 73) % 100; const y = (i * 41) % 100; const size = 1 + ((i * 7) % 2);
        const tw = 0.5 + 0.5 * Math.sin(t * 2 + i);
        return <span key={i} className="absolute rounded-full bg-white/90" style={{ left: `${x}%`, top: `${y}%`, width: size + 1, height: size + 1, boxShadow: '0 0 10px rgba(255,255,255,0.35)', opacity: Math.min(1, Math.max(0, (t - 0.2 - i * 0.1) / 0.8)) * (0.5 + tw * 0.5) }} />;
      })}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-10 text-center">
        <p className="text-[26px] font-light tracking-wide text-white/90" style={{ opacity: line1, transform: `translateY(${(1 - line1) * 6}px)`, textShadow: '0 10px 34px rgba(0,0,0,0.6)' }}>{g.last.firstText}</p>
        <div className="relative mt-8" style={{ opacity: heart, transform: `scale(${0.96 + 0.04 * heart + 0.03 * Math.sin(t * 2)})` }}>
          <span className="inline-flex text-[56px] text-white/95" style={{ textShadow: '0 18px 34px rgba(255,255,255,0.22)' }}>{g.last.emoji}</span>
        </div>
        <p className="mt-10 text-[14px] font-light uppercase tracking-[0.22em] text-white/55" style={{ opacity: line2 }}>{g.last.thirdText}</p>
      </div>
    </div>
  );
};

export type CardId = 'first' | 'second' | 'third' | 'four' | 'five';
const ORDER: CardId[] = ['first', 'second', 'third', 'four', 'five'];

type ViewerProps = {
  g: GiftContent;
  /** Fractional active index 0..4 (animate for swipes). */
  active: number;
  frame?: number;
  reasonIndex?: number;
  reasonPressed?: number;
  playing?: boolean;
  activeEmoji?: string | null;
  responseText?: string | null;
  burstStart?: number;
  fiveT?: number;
  seed?: number;
  /** Show the top-right editor buttons (edit.lovelink.my). */
  editorButtons?: boolean;
  heroSeed?: number;
  children?: React.ReactNode;
};

/** Gift page (view.lovelink.my/g/…): hero background + Swiper "cards" stack + controls. */
export const GiftViewerScreen: React.FC<ViewerProps> = ({ g, active, frame = 0, reasonIndex = 0, reasonPressed = 0, playing = false, activeEmoji = null, responseText = null, burstStart, fiveT = 10, seed = 1, editorButtons = false, heroSeed = 5, children }) => {
  const idx = Math.round(active);
  return (
    <div className="font-ui relative h-full w-full overflow-hidden text-white">
      <ArtPhoto variant={g.heroVariant} seed={heroSeed} style={{ position: 'absolute', inset: 0 }} bokehCount={22} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 20%, rgba(0,0,0,0.58) 100%)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%)' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 100%)' }} />
      {editorButtons && (
        <div className="absolute z-40 flex gap-2" style={{ top: 60, right: 16 }}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg></span>
        </div>
      )}
      <div className="relative flex flex-col items-center" style={{ paddingTop: 100 }}>
        <div style={{ position: 'relative', width: CARD_W, height: CARD_H }}>
          {ORDER.map((id, i) => {
            const d = i - active; // 0 = active, >0 behind, <0 swiped away
            let transform: string; let opacity = 1; let z = 10 - i;
            if (d >= 0) {
              const k = Math.min(d, 3);
              transform = `translateX(${k * 8}%) translateY(0) rotate(${k * 2}deg) scale(${1 - k * 0.05})`;
              opacity = d > 2.5 ? 0 : 1;
              z = 10 - Math.round(d);
            } else {
              const k = -d; // swiped away to the left
              transform = `translateX(${-k * 115}%) rotate(${-k * 14}deg)`;
              opacity = Math.max(0, 1 - k * 0.6);
              z = 20;
            }
            const shade = d > 0 ? Math.min(0.45, d * 0.22) : 0;
            return (
              <div key={id} style={{ position: 'absolute', inset: 0, transform, opacity, zIndex: z, transformOrigin: 'center bottom', borderRadius: 28, boxShadow: '0 20px 34px rgba(0,0,0,0.35)' }}>
                {id === 'first' && <FirstCard g={g} playing={playing && idx === 0} seed={seed + 1} frame={frame} />}
                {id === 'second' && <SecondCard g={g} seed={seed + 2} />}
                {id === 'third' && <ThirdCard g={g} reasonIndex={reasonIndex} seed={seed + 3} pressed={reasonPressed} />}
                {id === 'four' && <FourCard g={g} activeEmoji={activeEmoji} responseText={responseText} burstStart={burstStart} frame={frame} />}
                {id === 'five' && <FiveCard g={g} t={idx === 4 ? fiveT : 0} />}
                {shade > 0 && <div style={{ position: 'absolute', inset: 0, borderRadius: 28, background: `rgba(0,0,0,${shade})` }} />}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-5" style={{ width: CARD_W, marginTop: 24 }}>
          <span className="flex h-11 w-11 items-center justify-center" style={{ opacity: idx === 0 ? 0.2 : 0.6 }}><span className="text-[26px] font-light leading-none text-white">‹</span></span>
          <div className="flex items-center gap-[7px]">
            {ORDER.map((_, i) => <span key={i} className={`rounded-full ${i === idx ? 'bg-white/90' : 'bg-white/40'}`} style={{ height: 5, width: i === idx ? 24 : 5 }} />)}
          </div>
          <span className="flex h-11 w-11 items-center justify-center" style={{ opacity: idx === 4 ? 0.2 : 0.6 }}><span className="text-[26px] font-light leading-none text-white">›</span></span>
        </div>
      </div>
      {children}
    </div>
  );
};
