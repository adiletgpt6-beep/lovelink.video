import React from 'react';
import { staticFile } from 'remotion';
import { DEMO_GIFT, QR_STYLES } from '../lib/content';
import { PageShell } from './AppChrome';

type Props = { scroll?: number; expanded?: boolean; qr?: number; copied?: boolean; plan?: 'Start' | 'Business' | 'Pro' | null; items?: { title: string; date: string }[] };

/** /gifts — "Мои подарки" cabinet with the dark owned-gift card expanded. */
export const GiftsCabinetScreen: React.FC<Props> = ({ scroll = 0, expanded = true, qr = 0, copied = false, plan = 'Business', items }) => {
  const list = items ?? [
    { title: DEMO_GIFT.title, date: DEMO_GIFT.date },
    { title: '💖 История нашей любви', date: '28 октября 2026' },
    { title: '🤍 Спасибо, что вы с нами', date: '12 октября 2026' },
  ];
  return (
    <PageShell scroll={scroll} authed plan={plan}>
      <div className="space-y-3 px-1">
        <div className="space-y-3 rounded-[20px] border border-black/[0.07] bg-white/80 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl border border-black/[0.09] bg-white px-3.5 py-2.5 text-[13px] text-neutral-400">Поиск по названию, паролю или ссылке</div>
            <div className="shrink-0 rounded-xl border border-black/[0.09] bg-white px-3.5 py-2.5 text-[13px] font-medium text-neutral-700">Фильтры</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-1 text-[12px] text-neutral-500"><span>Созданные вами</span><span className="font-medium text-neutral-900">{list.length}</span></div>
        {list.map((g, i) => {
          const isOpen = expanded && i === 0;
          return (
            <div key={i} className="overflow-hidden rounded-[28px] border border-white/15 bg-neutral-950 shadow-[0_20px_34px_rgba(0,0,0,0.35)]">
              <div className="flex items-stretch">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-left">
                  <div className="min-w-0 flex-1"><p className="truncate text-[14px] font-semibold text-white">{g.title}</p><p className="mt-0.5 text-[11px] text-white/45">{g.date}</p></div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/40" style={{ transform: isOpen ? 'rotate(180deg)' : undefined }}><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="flex min-w-[44px] shrink-0 items-center justify-center px-3 text-white/35"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg></div>
              </div>
              {isOpen && (
                <div>
                  <div className="mx-5 h-px bg-white/[0.08]" />
                  <div className="px-5 pt-5">
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">ссылка</p>
                    <div className="flex items-center gap-1.5 rounded-xl bg-black/25 py-1.5 pl-3 pr-1.5 ring-1 ring-white/[0.08]">
                      <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white/80">{DEMO_GIFT.url}</span>
                      <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] ${copied ? 'bg-white/[0.08] text-white/80' : 'text-white/60'}`}>{copied ? '✓ Скопировано' : 'Копировать'}</span>
                      <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] text-white/60">Открыть →</span>
                    </div>
                  </div>
                  <div className="mx-5 mt-4 h-px bg-white/[0.12]" />
                  <div className="px-5 py-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">пароль</p>
                    <p className="mt-0.5 text-[11px] text-white/45">Альтернативный способ доступа. Вводится после сканирования QR-кода.</p>
                    <p className="mt-2 text-3xl font-bold tracking-widest text-white">{DEMO_GIFT.code}</p>
                  </div>
                  <div className="mx-5 h-px bg-white/[0.12]" />
                  <div className="px-5 py-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">код для редактирования</p>
                    <p className="mt-0.5 text-[11px] text-white/45">Передайте код клиенту — он сможет редактировать только этот подарок.</p>
                    <p className="mt-2 font-mono text-[20px] font-bold tracking-[0.25em] text-white">{DEMO_GIFT.editCode}</p>
                  </div>
                  <div className="mx-5 h-px bg-white/[0.12]" />
                  <div className="flex flex-col gap-3 px-5 py-4">
                    <div><p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">qr-код</p><p className="mt-0.5 text-[11px] text-white/45">Ведёт на экран входа. После сканирования введите пароль — откроется та же страница подарка.</p></div>
                    <div className="flex justify-center"><div className="overflow-hidden rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.08]"><img src={staticFile(`brand/${QR_STYLES[qr].key}.png`)} alt="QR-код" width={160} height={160} className="block" /></div></div>
                    <div className="flex gap-2 overflow-hidden pb-0.5">
                      {QR_STYLES.map((s, i) => <span key={s.key} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] ${i === qr ? 'bg-white/[0.15] text-white ring-1 ring-white/30' : 'text-white/55'}`}>{s.label}</span>)}
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.05] py-2.5 text-[12px] text-white/65 ring-1 ring-white/[0.10]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Скачать QR
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};
