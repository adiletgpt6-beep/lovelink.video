import React from 'react';

const ROWS = ['йцукенгшщзх', 'фывапролджэ', 'ячсмитьбю'];

/** Generic dark messenger screen used for the "drafts" scene (not a specific product). */
export const MessengerScreen: React.FC<{ typed: string; name?: string; draftLabel?: boolean; pressedKey?: string | null }> = ({ typed, name = 'Мама', draftLabel = false, pressedKey = null }) => (
  <div className="font-ui relative h-full w-full overflow-hidden" style={{ background: '#000', color: '#fff' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 108, background: 'rgba(28,28,30,0.92)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: 'linear-gradient(135deg,#F84888,#7850F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18 }}>{name[0]}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>{name} ›</div>
      </div>
      <div style={{ position: 'absolute', left: 14, bottom: 14, color: '#4c8dff', fontSize: 17 }}>‹ Назад</div>
    </div>
    <div style={{ position: 'absolute', top: 128, left: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ alignSelf: 'center', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Сегодня 21:14</div>
      <div style={{ alignSelf: 'flex-start', maxWidth: '78%', background: '#26262a', padding: '9px 13px', borderRadius: 18, borderBottomLeftRadius: 6, fontSize: 16, lineHeight: 1.3 }}>Как дела, доченька? Давно не слышала тебя</div>
      <div style={{ alignSelf: 'flex-start', maxWidth: '78%', background: '#26262a', padding: '9px 13px', borderRadius: 18, borderBottomLeftRadius: 6, fontSize: 16 }}>Скучаю ❤️</div>
      <div style={{ alignSelf: 'flex-end', maxWidth: '78%', background: '#2f6bff', padding: '9px 13px', borderRadius: 18, borderBottomRightRadius: 6, fontSize: 16 }}>Всё хорошо, мам. Работа 🙃</div>
      {draftLabel && <div style={{ alignSelf: 'flex-end', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 10 }}>Черновик не отправлен</div>}
    </div>
    {/* composer */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 300, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 16, background: '#26262a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#aaa' }}>+</div>
      <div style={{ flex: 1, minHeight: 38, borderRadius: 19, border: '1px solid rgba(255,255,255,0.18)', padding: '8px 14px', fontSize: 16, color: typed ? '#fff' : 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center' }}>
        {typed || 'Сообщение'}<span style={{ marginLeft: 1, color: '#4c8dff', opacity: 0.9 }}>|</span>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: 16, background: typed ? '#2f6bff' : '#26262a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>↑</div>
    </div>
    {/* keyboard */}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 292, background: '#1c1c1e', padding: '10px 4px 0' }}>
      {ROWS.map((r, ri) => (
        <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 10, paddingLeft: ri === 2 ? 20 : 0, paddingRight: ri === 2 ? 20 : 0 }}>
          {ri === 2 && <div style={{ width: 42, height: 42, borderRadius: 6, background: '#3a3a3c' }} />}
          {r.split('').map((k) => <div key={k} style={{ width: 30, height: 42, borderRadius: 6, background: pressedKey === k ? '#6b6b70' : '#4a4a4e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 1px 0 #111' }}>{k}</div>)}
          {ri === 2 && <div style={{ width: 42, height: 42, borderRadius: 6, background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⌫</div>}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        <div style={{ width: 86, height: 42, borderRadius: 6, background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>123</div>
        <div style={{ width: 190, height: 42, borderRadius: 6, background: '#4a4a4e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>пробел</div>
        <div style={{ width: 86, height: 42, borderRadius: 6, background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>ввод</div>
      </div>
    </div>
  </div>
);
