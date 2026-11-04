import React from 'react';
import { Img, staticFile } from 'remotion';

/** Sticky header of lovelink.my (HeaderTemp.tsx). */
export const AppHeader: React.FC<{ authed?: boolean; plan?: 'Start' | 'Business' | 'Pro' | null }> = ({ authed = false, plan = null }) => (
  <header className="font-ui sticky top-0 z-40 w-full border-b border-black/10 bg-white/75 shadow-[0_2px_20px_rgba(0,0,0,0.06)]" style={{ paddingTop: 44 }}>
    <div className="mx-auto px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center">
          {authed ? (
            <Img src={staticFile('brand/logo.png')} style={{ height: 40, width: 'auto', opacity: 0.95 }} />
          ) : (
            <span className="inline-flex h-10 items-center justify-center rounded-xl border border-black/10 bg-neutral-950 px-4 text-sm font-medium text-white">Войти</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {plan && (
            <span className={`inline-flex items-center rounded-lg px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${plan === 'Business' ? 'bg-violet-950 text-violet-200 ring-1 ring-violet-700/50' : plan === 'Pro' ? 'bg-neutral-950 text-white ring-1 ring-yellow-600/25' : 'border border-black/10 bg-white/90 text-neutral-600'}`}>{plan}</span>
          )}
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-neutral-900">
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4.5 rounded-full bg-current" />
              <span className="block h-0.5 w-4.5 rounded-full bg-current" />
              <span className="block h-0.5 w-4.5 rounded-full bg-current" />
            </span>
          </span>
        </div>
      </div>
    </div>
  </header>
);

/** Mobile browser address bar (generic, not a specific brand). */
export const BrowserBar: React.FC<{ url: string; progress?: number; focused?: boolean }> = ({ url, progress = 1, focused = false }) => (
  <div className="font-ui" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: 'rgba(248,248,250,0.96)', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '10px 14px 0', }}>
    <div style={{ height: 44, borderRadius: 14, background: '#fff', boxShadow: focused ? '0 0 0 2px #7850F0' : '0 1px 3px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, position: 'relative', overflow: 'hidden' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
      <span style={{ fontSize: 16, color: '#111', letterSpacing: -0.2 }}>{url}<span style={{ opacity: focused ? 1 : 0, color: '#7850F0' }}>|</span></span>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 3, width: `${progress * 100}%`, background: 'linear-gradient(90deg,#F84888,#7850F0)', opacity: progress < 1 ? 1 : 0 }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8, color: '#8a8a8e' }}>
      {['‹', '›', '⇪', '▢', '☰'].map((c, i) => <span key={i} style={{ fontSize: 18 }}>{c}</span>)}
    </div>
  </div>
);

/** Light page shell with the fixed blur blobs from page.tsx. */
export const PageShell: React.FC<{ children: React.ReactNode; authed?: boolean; plan?: 'Start' | 'Business' | 'Pro' | null; scroll?: number }> = ({ children, authed, plan, scroll = 0 }) => (
  <div className="font-ui relative h-full w-full overflow-hidden text-neutral-900" style={{ background: 'linear-gradient(180deg,#fff 0%,#fff7fb 100%)' }}>
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle closest-side, rgba(251,207,232,0.55) 0%, rgba(251,207,232,0) 100%)' }} />
      <div className="absolute right-0 top-32 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle closest-side, rgba(221,214,254,0.5) 0%, rgba(221,214,254,0) 100%)' }} />
    </div>
    <AppHeader authed={authed} plan={plan} />
    <div className="relative mx-auto w-full px-2 pb-8 pt-4" style={{ transform: `translateY(${-scroll}px)` }}>{children}</div>
  </div>
);
