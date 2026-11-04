import React from 'react';
import { staticFile } from 'remotion';
import { DEMO_GIFT, QR_STYLES } from '../lib/content';

const InfoDot = () => <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[11px] text-white/60 ring-1 ring-white/10">i</span>;

type Props = { open: number; qr?: number; copied?: 'url' | 'code' | null; scroll?: number; editCode?: boolean; highlight?: 'link' | 'code' | 'qr' | 'edit' | null };

/** PublishResultsModal.jsx — "Ваша страница готова". */
export const PublishModal: React.FC<Props> = ({ open, qr = 0, copied = null, scroll = 0, editCode = true, highlight = null }) => {
  if (open <= 0) return null;
  const hl = (k: string) => (highlight === k ? { boxShadow: '0 0 0 2px rgba(248,72,136,0.9), 0 0 30px rgba(248,72,136,0.35)', borderRadius: 14 } : {});
  return (
    <div className="font-ui absolute inset-0 z-[200] flex items-center justify-center px-4 py-3" style={{ opacity: open }}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative flex w-full flex-col rounded-[28px] bg-[#05070b] p-px shadow-[0_20px_34px_rgba(0,0,0,0.7)]" style={{ maxWidth: 360, height: 680, transform: `translateY(${(1 - open) * 20}px) scale(${0.97 + 0.03 * open})` }}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[27px] ring-1 ring-white/[0.08]" style={{ background: 'linear-gradient(180deg,#06080d,#070a10,#080b12)' }}>
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4"><span className="text-[11px] uppercase tracking-[0.22em] text-white/55">Ваша страница готова</span><span className="flex h-11 w-11 items-center justify-center rounded-full text-[12px] text-white/35">✕</span></div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="flex flex-col gap-4 px-5 py-4" style={{ transform: `translateY(${-scroll}px)` }}>
              {/* Link */}
              <div className="flex flex-col gap-1.5" style={hl('link')}>
                <div className="flex items-center justify-between px-0.5"><span className="text-[11px] font-medium text-white/45">Ссылка</span><InfoDot /></div>
                <div className="flex items-center gap-2 rounded-xl bg-black/25 py-1.5 pl-3 pr-1.5 ring-1 ring-white/[0.08]">
                  <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-white/65">{DEMO_GIFT.url}</span>
                  <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] ${copied === 'url' ? 'bg-white/[0.08] text-white/70' : 'text-white/40'}`}>{copied === 'url' ? '✓ Скопировано' : 'Копировать'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] py-2.5 text-[12px] text-white/50 ring-1 ring-white/[0.07]">Открыть ссылку <span>→</span></div>
              </div>
              {/* Code */}
              <div className="flex flex-col gap-1.5" style={hl('code')}>
                <div className="flex items-center justify-between px-0.5"><span className="text-[11px] font-medium text-white/45">Пароль</span><InfoDot /></div>
                <div className="flex items-center gap-2 rounded-xl bg-black/25 py-1.5 pl-3 pr-1.5 ring-1 ring-white/[0.08]">
                  <span className="min-w-0 flex-1 font-mono text-[15px] tracking-[0.2em] text-white/80">{DEMO_GIFT.code}</span>
                  <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] ${copied === 'code' ? 'bg-white/[0.08] text-white/70' : 'text-white/40'}`}>{copied === 'code' ? '✓ Скопировано' : 'Копировать'}</span>
                </div>
              </div>
              {/* Edit access code */}
              {editCode && (
                <div className="flex flex-col gap-1.5" style={hl('edit')}>
                  <div className="flex items-center justify-between px-0.5"><span className="text-[11px] font-medium text-white/45">Код для редактирования</span><InfoDot /></div>
                  <div className="flex items-center gap-2 rounded-xl bg-black/25 py-1.5 pl-3 pr-1.5 ring-1 ring-white/[0.08]">
                    <span className="min-w-0 flex-1 font-mono text-[15px] font-bold tracking-[0.2em] text-white/90">{DEMO_GIFT.editCode}</span>
                    <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-[11px] text-white/40">Копировать</span>
                  </div>
                  <p className="px-0.5 text-[11px] text-white/30">Клиент может ввести код на edit.lovelink.my/access, чтобы открыть редактор.</p>
                </div>
              )}
              {/* QR */}
              <div className="flex flex-col gap-3" style={hl('qr')}>
                <div className="flex items-center justify-between px-0.5"><span className="text-[11px] font-medium text-white/45">QR-код</span><InfoDot /></div>
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-2xl bg-white/[0.03] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.08]">
                    <img src={staticFile(`brand/${QR_STYLES[qr].key}.png`)} alt="QR-код" width={160} height={160} className="block aspect-square object-contain" />
                  </div>
                </div>
                <div className="flex gap-2 overflow-hidden pb-0.5">
                  {QR_STYLES.map((s, i) => (
                    <span key={s.key} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] whitespace-nowrap ${i === qr ? 'bg-white/[0.13] text-white/90 ring-1 ring-white/25' : 'text-white/40'}`}>{s.label}</span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] py-2.5 text-[12px] text-white/50 ring-1 ring-white/[0.07]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Скачать QR
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-0.5"><span className="text-[11px] font-medium text-white/45">Редактировать подарок</span><InfoDot /></div>
                <div className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.07] py-2.5 text-[12px] text-white/75 ring-1 ring-white/[0.12]">Редактировать подарок</div>
                <p className="px-0.5 text-[11px] text-white/30">Безлимитное редактирование</p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6" style={{ background: 'linear-gradient(to top,#07090e,transparent)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
