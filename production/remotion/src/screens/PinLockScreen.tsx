import React from 'react';
import { AuroraBg } from '../ui/Backgrounds';
import { Stars } from '../ui/Fx';

type Props = {
  /** Number of filled dots 0..6 */
  filled: number;
  state?: 'locked' | 'success';
  /** Digit currently pressed (ripple/scale) */
  pressedKey?: string | null;
  pressAmt?: number;
  /** 0..1 progress of the success reveal */
  successProgress?: number;
  giftTitle?: string;
  giftText?: React.ReactNode;
  giftIcon?: string;
  shake?: number;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

/** Reconstruction of PinLock.jsx (lovelink password page) at 390 px. */
export const PinLockScreen: React.FC<Props> = ({ filled, state = 'locked', pressedKey = null, pressAmt = 0, successProgress = 1, giftTitle = 'Мама, спасибо вам за всё 🤍', giftText, giftIcon = '💜', shake = 0 }) => {
  const isSuccess = state === 'success';
  const complete = filled >= 6;
  const sp = successProgress;
  return (
    <div className="font-ui relative h-full w-full overflow-hidden text-white" style={{ background: '#060715' }}>
      <AuroraBg speed={0.8} />
      <Stars count={58} seed={101} />
      <div className="relative z-10 flex flex-col items-center" style={{ padding: 20, paddingTop: 92 }}>
        <div className="w-full" style={{ maxWidth: 500 }}>
          <div
            className="relative rounded-[26px] border border-white/20"
            style={{
              padding: '19.5px 15.6px', transform: `translateX(${Math.sin(shake * Math.PI * 4) * 7 * shake}px)`,
              background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.11) 30%, rgba(255,255,255,0.07) 70%, rgba(255,255,255,0.04) 100%)',
              boxShadow: '0 36px 120px rgba(0,0,0,0.6)',
            }}
          >
            <div className="pointer-events-none absolute inset-px rounded-[25px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.42),inset_0_10px_44px_rgba(0,0,0,0.22)]" />
            <div className="pointer-events-none absolute -top-10 left-10 right-10 h-24 rounded-full bg-white/12 blur-2xl" />
            <div className="relative" style={{ minHeight: 430 }}>
              <div className="text-center">
                <div className="font-semibold tracking-wide text-white/95" style={{ fontSize: 17.2 }}>Введите пароль, чтобы увидеть подарок 🎁</div>
                <div className="tracking-wide text-white/60" style={{ fontSize: 12.9, marginTop: 10, marginBottom: 15 }}>Код из открытки • 6 символов</div>
              </div>

              {/* dots */}
              <div className="relative mt-7" style={{ marginBottom: isSuccess ? 50 : 6 }}>
                <div className="flex justify-center" style={{ gap: 11.7 }}>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const on = filled > i;
                    return (
                      <div key={i} className="relative rounded-full" style={{ width: 11.7, height: 11.7, border: `1px solid rgba(255,255,255,${on ? 0.88 : 0.55})`, background: on ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)', boxShadow: on ? (isSuccess ? '0 0 20px rgba(120,255,180,0.2)' : '0 0 14px rgba(255,255,255,0.32)') : undefined, borderColor: isSuccess ? 'rgba(120,255,180,0.7)' : undefined, transform: on && filled === i + 1 && pressAmt > 0 ? `scale(${1 + 0.15 * Math.sin(pressAmt * Math.PI)})` : undefined }}>
                        {on && <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(210,210,255,0.55) 52%, rgba(255,255,255,0.12) 72%)' }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {!isSuccess && (
                <div className="flex flex-col" style={{ marginTop: 19.5, gap: 17.9 }}>
                  <div className="grid grid-cols-3 justify-items-center" style={{ gap: 15.6 }}>
                    {KEYS.map((k, i) => {
                      if (k === '') return <div key={i} style={{ width: 70.2, height: 70.2 }} />;
                      const isPressed = pressedKey === k && pressAmt > 0;
                      const s = isPressed ? 1 - 0.06 * Math.sin(pressAmt * Math.PI) : 1;
                      return (
                        <div
                          key={i}
                          className="relative flex items-center justify-center overflow-hidden rounded-full text-white/90"
                          style={{
                            width: 70.2, height: 70.2, transform: `scale(${s})`,
                            background: isPressed ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                            boxShadow: '0 18px 40px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)',
                          }}
                        >
                          <div className="pointer-events-none absolute" style={{ inset: '-40%', background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.46), rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 68%)', opacity: 0.9, transform: 'translateY(-6px)' }} />
                          {isPressed && <span className="absolute rounded-full" style={{ left: '50%', top: '50%', width: 110 * pressAmt, height: 110 * pressAmt, transform: 'translate(-50%,-50%)', opacity: 1 - pressAmt, background: 'radial-gradient(circle, rgba(255,255,255,0.42), rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 70%)' }} />}
                          <span className="relative z-10 select-none" style={{ fontSize: k === '⌫' ? 22 : 19.5, fontWeight: 500, opacity: k === '⌫' ? 0.8 : 1 }}>{k}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* CTA — the real button has only a screen-reader label */}
                  <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: 48, background: complete ? 'linear-gradient(90deg, #2aa7ff, #7b3dff, #ff4dcc)' : 'linear-gradient(90deg, rgba(42,167,255,0.26), rgba(123,61,255,0.2), rgba(255,77,204,0.16))', boxShadow: complete ? '0 18px 56px rgba(120,70,255,0.34), 0 0 48px rgba(255,77,204,0.12)' : '0 14px 46px rgba(120,70,255,0.14), 0 0 34px rgba(255,77,204,0.08)' }}>
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[13px] font-medium tracking-wide" style={{ opacity: complete ? 0.95 : 0.35 }}>Открыть подарок</span>
                  </div>
                </div>
              )}

              {isSuccess && (
                <div className="mt-8" style={{ opacity: sp }}>
                  <div className="text-center">
                    <div className="font-semibold tracking-wide" style={{ fontSize: 20.3 }}>Открыто! 🎉</div>
                    <div className="mt-2 text-white/65" style={{ fontSize: 12.9 }}>Подарок внутри</div>
                  </div>
                  <div className="mt-6" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 22, padding: '18px 16px', boxShadow: '0 26px 80px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18)', transform: `translateY(${(1 - sp) * 10}px) scale(${0.92 + 0.08 * sp})` }}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/18 bg-white/12"><span className="text-[18px]">{giftIcon}</span></div>
                      <div className="flex-1">
                        <div className="font-semibold" style={{ fontSize: 15.6 }}>{giftTitle}</div>
                        <div className="mt-1.5 leading-relaxed text-white/75" style={{ fontSize: 12.9 }}>{giftText ?? <>Пусть каждый ваш день будет тёплым и спокойным.<br />Я сделала этот маленький подарок специально для вас.</>}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-5 flex h-7 justify-center" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
