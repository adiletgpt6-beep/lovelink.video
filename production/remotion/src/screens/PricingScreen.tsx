import React from 'react';
import { PageShell } from './AppChrome';

const PLANS = [
  { name: 'Start', price: '$10', tagline: 'Для онлайн-подарков близким', dark: false, badge: null, features: ['До 30 страниц-подарков', 'Тариф активен 1 год', 'Страницы хранятся 30 лет'] },
  { name: 'Business', price: '$50', tagline: 'Для магазинов подарков и цветочных салонов', dark: true, badge: 'Популярный', features: ['До 300 страниц-подарков', 'Тариф активен 2 года', 'Страницы хранятся 30 лет'] },
  { name: 'Pro', price: '$100', tagline: 'Для сети точек и высокого объёма заказов', dark: false, badge: null, features: ['До 1000 страниц-подарков', 'Тариф активен 3 года', 'Страницы хранятся 30 лет'] },
];

export const BENEFITS = ['Все шаблоны LoveLink', 'Безлимитные готовые ссылки на шаблоны', 'Редактор текста подарка', 'ИИ-помощник для текста', 'Клонирование подарков'];

const Check = () => <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5l3 3 7-7" /></svg>;

export const PlanCard: React.FC<{ plan: typeof PLANS[number]; highlight?: number }> = ({ plan, highlight = 0 }) => {
  const dark = plan.dark;
  return (
    <div className={dark ? 'relative overflow-hidden rounded-[28px] bg-neutral-950 p-5 shadow-[0_20px_34px_rgba(0,0,0,0.28)]' : 'relative rounded-[28px] border border-black/10 bg-white/85 p-5 shadow-[0_18px_34px_rgba(0,0,0,0.06)]'} style={highlight ? { boxShadow: `0 0 0 ${3 * highlight}px rgba(120,80,240,0.8), 0 20px 34px rgba(120,80,240,0.3)` } : undefined}>
      {dark && <div className="pointer-events-none absolute inset-0 rounded-[28px]" style={{ background: 'radial-gradient(circle at 70% 0%, rgba(167,139,250,0.12) 0%, transparent 60%)' }} />}
      <div className="relative">
        {plan.badge && <div className="mb-3 flex gap-2"><span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? 'bg-white/10 text-white/55' : 'bg-neutral-100 text-neutral-400'}`}>{plan.badge}</span></div>}
        <p className={`text-[11px] font-medium uppercase tracking-[0.24em] ${dark ? 'text-white/40' : 'text-neutral-500'}`}>{plan.name}</p>
        <div className="mt-1.5"><span className={`text-[42px] font-bold leading-none tracking-tight ${dark ? 'text-white' : 'text-neutral-950'}`}>{plan.price}</span></div>
        <p className={`mt-1.5 text-sm leading-5 ${dark ? 'text-white/45' : 'text-neutral-500'}`}>{plan.tagline}</p>
        <div className={`my-4 h-px ${dark ? 'bg-white/[0.07]' : 'bg-black/[0.07]'}`} />
        <ul className="space-y-2.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5"><span className={dark ? 'text-white/35' : 'text-neutral-400'}><Check /></span><span className={`flex-1 text-sm leading-5 ${dark ? 'text-white/70' : 'text-neutral-700'}`}>{f}</span><span className={`text-[12px] ${dark ? 'text-white/20' : 'text-neutral-300'}`}>ⓘ</span></li>
          ))}
        </ul>
        <div className={`mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl text-sm font-medium ${dark ? 'bg-white text-neutral-950' : 'border border-black/10 bg-neutral-950 text-white'}`}>Оплатить тариф</div>
      </div>
    </div>
  );
};

export const PricingScreen: React.FC<{ scroll?: number; highlight?: number; highlightAmt?: number }> = ({ scroll = 0, highlight = -1, highlightAmt = 0 }) => (
  <PageShell scroll={scroll}>
    <div className="px-1 pb-10 pt-2">
      <div className="mb-7 px-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-400">тарифы</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">Выберите подходящий план</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">Делитесь тёплыми эмоциями через ссылку или QR-код с паролем</p>
      </div>
      <div className="mb-6 rounded-[20px] border border-black/[0.06] bg-neutral-50/70 px-4 py-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">Во все платные тарифы входит</p>
        <ul className="mt-3 grid grid-cols-1 gap-2">
          {BENEFITS.map((b, i) => <li key={b} className="flex items-center gap-2.5"><span className="text-violet-500">{i === 3 ? '✦' : <Check />}</span><span className="flex-1 text-[13px] leading-5 text-neutral-700">{b}</span><span className="text-[12px] text-neutral-300">ⓘ</span></li>)}
        </ul>
      </div>
      <div className="space-y-3">{PLANS.map((p, i) => <PlanCard key={p.name} plan={p} highlight={i === highlight ? highlightAmt : 0} />)}</div>
    </div>
  </PageShell>
);
