import React from 'react';
import { ArtPhoto, ArtVariant } from '../ui/ArtPhoto';

const InfoDot = () => <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-[11px] text-white/60 ring-1 ring-white/10 backdrop-blur-sm">i</span>;

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between px-1"><span className="text-[11px] font-medium text-white/70">{title}</span><InfoDot /></div>
    {children}
  </div>
);

const Input: React.FC<{ value?: string; placeholder?: string; focused?: boolean }> = ({ value, placeholder, focused }) => (
  <div className={`flex h-10 w-full items-center rounded-xl bg-black/20 px-3 text-[13px] ring-1 ${focused ? 'ring-white/30 bg-black/30' : 'ring-white/10'}`}>
    {value ? <span className="text-white">{value}{focused && <span className="text-white/70">|</span>}</span> : <span className="text-white/35">{placeholder}</span>}
  </div>
);

const Upload: React.FC<{ label: string; fileName?: string }> = ({ label, fileName }) => (
  <>
    <div className="flex h-10 w-full items-center justify-center rounded-xl bg-white/[0.07] text-[13px] text-white/90 ring-1 ring-white/10">{label}</div>
    {fileName && (
      <div className="mt-2 flex items-center justify-between rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/10"><span className="mr-2 flex-1 truncate text-[12px] text-white/80">{fileName}</span><span className="text-[12px] text-white/60">✕</span></div>
    )}
  </>
);

export type EditorPanelKind = 'bg' | 'video' | 'reasons';

type Props = {
  kind: EditorPanelKind;
  /** 0..1 open progress */
  open: number;
  /** Highlighted preset index */
  preset?: number;
  presets?: ArtVariant[];
  titleValue?: string;
  reasonInput?: string;
  reasons?: string[];
  fileName?: string;
  savePressed?: number;
  saved?: boolean;
  focusField?: 'title' | 'reason' | 'none';
  /** Scroll offset inside the panel body */
  scroll?: number;
};

/** HeroBackgroundEditor / FirstSlideEditor / ThirdCardEditor glass panel (edit.lovelink.my). */
export const EditorPanel: React.FC<Props> = ({ kind, open, preset = 0, presets = ['night', 'sunset', 'rose', 'ocean', 'garden', 'gold'], titleValue = '', reasonInput = '', reasons = [], fileName, savePressed = 0, saved = false, focusField = 'none', scroll = 0 }) => {
  if (open <= 0) return null;
  const title = kind === 'bg' ? 'Фон' : kind === 'video' ? 'Видео и обложка' : 'Причины';
  return (
    <>
      <div className="absolute inset-0 z-[39] bg-black/35" style={{ opacity: open }} />
      <div
        className="absolute z-40 flex flex-col overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        style={{ left: 16, right: 16, top: 112, maxHeight: 600, opacity: open, transform: `translateY(${(1 - open) * 10}px) scale(${0.98 + 0.02 * open})`, transformOrigin: 'top right', background: 'linear-gradient(180deg, rgba(0,0,0,0.82), rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.64))' }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md"><span className="text-[11px] uppercase tracking-[0.22em] text-white/85">{title}</span><InfoDot /></div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex flex-col gap-4 px-5 py-4" style={{ transform: `translateY(${-scroll}px)` }}>
            {kind === 'bg' && (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="px-1 text-[11px] font-medium text-white/70">Готовые варианты</span>
                  <div className="flex gap-2 overflow-hidden pb-1">
                    {presets.map((v, i) => (
                      <div key={i} className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-xl ring-1 ${i === preset ? 'ring-white/40 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]' : 'ring-white/10'}`} style={{ transform: i === preset ? 'scale(1.04)' : undefined }}>
                        <ArtPhoto variant={v} seed={40 + i} style={{ position: 'absolute', inset: 0 }} animate={false} bokehCount={6} />
                        {i === preset && <div className="absolute inset-0 bg-white/10" />}
                      </div>
                    ))}
                  </div>
                </div>
                <Section title="Вставь ссылку"><Input placeholder="Например: https://..." /></Section>
                <Section title="Загрузить фото"><Upload label="Выбрать файл" fileName={fileName} /></Section>
              </>
            )}
            {kind === 'video' && (
              <>
                <Section title="Ссылка на видео"><Input placeholder="Вставь ссылку на видео или YouTube" /></Section>
                <Section title="Загрузить видео"><Upload label="Выбрать видео" fileName={fileName} /></Section>
                <Section title="Ссылка на фото"><Input placeholder="Вставь ссылку на фото" /></Section>
                <Section title="Загрузить фото"><Upload label="Выбрать фото" /></Section>
              </>
            )}
            {kind === 'reasons' && (
              <>
                <Section title="Иконка"><Input value="🌸" /></Section>
                <Section title="Заголовок"><Input value={titleValue} placeholder="Введи заголовок" focused={focusField === 'title'} /></Section>
                <Section title="Список причин">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <Input value={reasonInput} placeholder="Напиши причину" focused={focusField === 'reason'} />
                      <div className="flex h-10 shrink-0 items-center rounded-xl bg-white px-4 text-[13px] font-medium text-black ring-1 ring-white/10">Сохранить</div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/20 ring-1 ring-white/10">
                      <div className="flex flex-col gap-2 px-3 py-3">
                        {reasons.length === 0 && <div className="rounded-xl bg-white/[0.02] px-3 py-3 text-[12px] text-white/40">Пока нет причин</div>}
                        {reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.03] px-3 py-2 ring-1 ring-white/[0.06]">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white/80">{i + 1}</div>
                            <p className="flex-1 text-[13px] leading-relaxed text-white/80">{r}</p>
                            <span className="shrink-0 rounded-lg px-2 py-1 text-[12px] text-white/45">✕</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-1"><span className="text-[12px] text-white/45">{reasons.length} из 10</span></div>
                  </div>
                </Section>
                <Section title="Текст кнопки"><Input value="👆 Нажми — продолжим" /></Section>
              </>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2.5 border-t border-white/[0.08] bg-black/30 px-5 py-4 backdrop-blur-md">
          <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-white/[0.04] text-[13px] text-white/60 ring-1 ring-white/[0.08]">Отмена</div>
          <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-white text-[13px] font-medium text-black ring-1 ring-white/10" style={{ transform: `scale(${1 - 0.05 * savePressed})`, boxShadow: savePressed ? `0 0 0 ${6 * savePressed}px rgba(255,255,255,0.25)` : undefined }}>{saved ? 'Сохранено' : 'Сохранить'}</div>
        </div>
      </div>
    </>
  );
};
