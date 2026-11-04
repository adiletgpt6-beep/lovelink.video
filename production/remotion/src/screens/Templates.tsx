import React from 'react';
import { ArtPhoto, ArtVariant } from '../ui/ArtPhoto';
import { FOR_WHOM_CHIPS, TEMPLATES } from '../lib/content';
import { PageShell } from './AppChrome';

type TemplateCardProps = { title: string; badge: string; variant: ArtVariant; seed: number; slide?: number; total?: number; highlight?: number; pressed?: number };

/** TemplateCard + TemplateCardPreview (compact variant) from the front-end. */
export const TemplateCard: React.FC<TemplateCardProps> = ({ title, badge, variant, seed, slide = 0, total = 3, highlight = 0, pressed = 0 }) => (
  <div
    className="group block overflow-hidden rounded-[1.15rem] border border-white/90 bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfd_100%)] shadow-[0_8px_18px_rgba(15,23,42,0.05),0_16px_28px_rgba(15,23,42,0.03)] ring-1 ring-black/[0.02]"
    style={{ transform: `scale(${1 - pressed * 0.03})`, boxShadow: highlight ? `0 0 0 ${3 * highlight}px rgba(120,80,240,${0.9 * highlight}), 0 16px 40px rgba(120,80,240,${0.35 * highlight})` : undefined }}
  >
    <div className="relative">
      <div className="absolute inset-x-2 -top-1.5 h-6 rounded-full bg-black/8 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,#f8f8fb_0%,#f3f3f7_100%)]">
        <div className="relative aspect-[4/4.9] w-full overflow-hidden rounded-[1rem] bg-neutral-100">
          <ArtPhoto variant={variant} seed={seed} style={{ position: 'absolute', inset: 0 }} bokehCount={10} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-black/[0.03] to-transparent" />
          <div className="pointer-events-none absolute left-1.5 top-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/65 bg-white/82 px-1.5 py-0.5 text-[8px] font-semibold text-neutral-700 shadow-[0_8px_18px_rgba(15,23,42,0.10)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              {badge}
            </span>
          </div>
          <div className="pointer-events-none absolute right-1.5 top-1.5">
            <span className="inline-flex items-center rounded-full border border-white/65 bg-white/82 px-1.5 py-0.5 text-[8px] font-semibold text-neutral-600 shadow-[0_2px_8px_rgba(15,23,42,0.12)] backdrop-blur-md">{slide + 1} / {total}</span>
          </div>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={`block rounded-full ${i === slide ? 'h-1 w-2.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)]' : 'h-1 w-1 bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-1 px-2 pb-1 pt-1.5">
      <h2 className="line-clamp-2 min-h-[2rem] text-[12px] font-semibold leading-4 tracking-tight text-neutral-950">{title}</h2>
    </div>
  </div>
);

export const TemplatesGrid: React.FC<{ items?: typeof TEMPLATES; highlightIndex?: number; highlightAmt?: number; pressedIndex?: number; pressedAmt?: number; slideOffsets?: number[] }> = ({ items = TEMPLATES.slice(0, 4), highlightIndex = -1, highlightAmt = 0, pressedIndex = -1, pressedAmt = 0, slideOffsets }) => (
  <section className="grid grid-cols-2 gap-2">
    {items.map((t, i) => (
      <TemplateCard key={i} {...t} slide={slideOffsets?.[i] ?? 0} highlight={i === highlightIndex ? highlightAmt : 0} pressed={i === pressedIndex ? pressedAmt : 0} />
    ))}
  </section>
);

/** lovelink.my home page (page.tsx + TemplateModelSection). */
export const HomeScreen: React.FC<{ scroll?: number; highlightIndex?: number; highlightAmt?: number; pressedIndex?: number; pressedAmt?: number; slideOffsets?: number[]; authed?: boolean }> = (p) => (
  <PageShell scroll={p.scroll} authed={p.authed}>
    <section className="space-y-4">
      <div className="space-y-1 px-1"><h2 className="text-[22px] font-semibold tracking-tight text-neutral-950">FeelLink</h2></div>
      <TemplatesGrid highlightIndex={p.highlightIndex} highlightAmt={p.highlightAmt} pressedIndex={p.pressedIndex} pressedAmt={p.pressedAmt} slideOffsets={p.slideOffsets} />
      <div className="block w-full rounded-[1rem] border border-neutral-200 bg-white px-4 py-3 text-center text-[13px] font-semibold text-neutral-900 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">Смотреть все</div>
    </section>
  </PageShell>
);

/** /templates/[model] page: search + "Для кого" chips + grid (TemplateSearchSection). */
export const TemplatesPageScreen: React.FC<{ scroll?: number; activeChip?: number; sheetOpen?: number; items?: typeof TEMPLATES; highlightIndex?: number; highlightAmt?: number; pressedIndex?: number; pressedAmt?: number }> = ({ scroll = 0, activeChip = 0, sheetOpen = 0, items = TEMPLATES.slice(0, 6), highlightIndex, highlightAmt, pressedIndex, pressedAmt }) => (
  <PageShell scroll={scroll}>
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="6" /><path d="M17 17l-4-4" /></svg>
          <div className="w-full rounded-full border border-black/[0.09] bg-white py-3 pl-10 pr-4 text-[13px] text-neutral-400 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">Поиск шаблона...</div>
        </div>
        <div className={`relative flex items-center gap-2 rounded-full border px-4 text-[13px] font-medium shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${activeChip > 0 ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-black/[0.09] bg-white text-neutral-700'}`}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="14" x2="17" y2="14" /><circle cx="8" cy="6" r="2.2" fill="currentColor" stroke="none" /><circle cx="12" cy="14" r="2.2" fill="currentColor" stroke="none" /></svg>
          Фильтры
          {activeChip > 0 && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-neutral-950">1</span>}
        </div>
      </div>
      <TemplatesGrid items={items} highlightIndex={highlightIndex} highlightAmt={highlightAmt} pressedIndex={pressedIndex} pressedAmt={pressedAmt} />
    </div>
    {/* mobile bottom sheet with chips */}
    {sheetOpen > 0 && (
      <>
        <div className="absolute inset-0 bg-black/25" style={{ opacity: sheetOpen, top: -300, height: 2000 }} />
        <div className="absolute left-0 right-0 rounded-t-[24px] bg-white px-5 pb-8 pt-4 shadow-[0_-8px_40px_rgba(0,0,0,0.16)]" style={{ top: 420 + (1 - sheetOpen) * 300 }}>
          <div className="mx-auto mb-4 h-1 w-8 rounded-full bg-neutral-200" />
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Для кого</p>
          <div className="flex flex-wrap gap-1.5">
            {FOR_WHOM_CHIPS.map((c, i) => (
              <span key={c} className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${i === activeChip ? 'bg-neutral-950 text-white shadow-sm' : 'bg-neutral-100 text-neutral-700'}`}>{c}</span>
            ))}
          </div>
          <div className="mt-4 border-t border-black/[0.06] pt-3"><div className="w-full rounded-full border border-black/[0.08] py-2 text-center text-[13px] font-medium text-neutral-600">Сбросить</div></div>
        </div>
      </>
    )}
  </PageShell>
);
