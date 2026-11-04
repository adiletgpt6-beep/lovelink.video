import React from 'react';
import { Img, staticFile } from 'remotion';
import { font } from '../lib/theme';

/** Phone camera viewfinder pointed at a LoveLink card — QR gets recognised. 390×844 logical px. */
export const ScanScreen: React.FC<{ t: number; recognized?: boolean; cardScale?: number }> = ({ t, recognized = false, cardScale = 1 }) => {
  const scanY = 0.5 + 0.5 * Math.sin(t * 3.2);
  return (
    <div className="font-ui relative h-full w-full overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 40%, #3a2230 0%, #15090f 70%)', color: '#fff' }}>
      {/* the card seen through the camera (slightly tilted, soft focus edges) */}
      <div style={{ position: 'absolute', left: '50%', top: '47%', transform: `translate(-50%,-50%) perspective(900px) rotateX(${10 + Math.sin(t) * 2}deg) rotateZ(${-6 + Math.cos(t * 0.7)}deg) scale(${0.58 * cardScale})`, width: 600, height: 400, borderRadius: 26, background: 'linear-gradient(160deg,#fffaf5 0%,#fff2ea 55%,#ffe9e2 100%)', boxShadow: '0 40px 60px rgba(0,0,0,0.5)' }}>
        <Img src={staticFile('brand/logo.png')} style={{ position: 'absolute', left: 34, top: 28, height: 34 }} />
        <div style={{ position: 'absolute', right: 34, top: 30, fontFamily: font.display, fontStyle: 'italic', fontSize: 30, color: '#F84888' }}>Для тебя 🤍</div>
        <div style={{ position: 'absolute', left: 34, top: 86, width: 190, height: 190, borderRadius: 18, background: '#fff', padding: 12 }}><Img src={staticFile('brand/qr-password.png')} style={{ width: '100%', height: '100%' }} /></div>
        <div style={{ position: 'absolute', left: 250, top: 100, fontFamily: font.caption, fontWeight: 700, fontSize: 15, letterSpacing: 3, color: '#9b7f8d' }}>СЕКРЕТНЫЙ КОД</div>
        <div style={{ position: 'absolute', left: 250, top: 128, display: 'flex', gap: 8 }}>{Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ width: 44, height: 58, borderRadius: 12, background: '#fff', border: '1.5px solid rgba(248,72,136,0.35)' }} />)}</div>
      </div>
      {/* viewfinder frame */}
      <div style={{ position: 'absolute', left: 60, top: 250, width: 270, height: 270 }}>
        {[['0', '0', '0 0 0 3px / 3px 0 0 0'], ['auto', '0', ''], ['0', 'auto', ''], ['auto', 'auto', '']].map((_, i) => null)}
        {[[0, 0, 'borderTop', 'borderLeft'], [1, 0, 'borderTop', 'borderRight'], [0, 1, 'borderBottom', 'borderLeft'], [1, 1, 'borderBottom', 'borderRight']].map(([x, y, a, b], i) => (
          <div key={i} style={{ position: 'absolute', [x ? 'right' : 'left']: 0, [y ? 'bottom' : 'top']: 0, width: 46, height: 46, [a as string]: `4px solid ${recognized ? '#34d399' : '#fff'}`, [b as string]: `4px solid ${recognized ? '#34d399' : '#fff'}`, borderRadius: 6 } as React.CSSProperties} />
        ))}
        {!recognized && <div style={{ position: 'absolute', left: 8, right: 8, top: `${scanY * 100}%`, height: 3, background: 'linear-gradient(90deg,transparent,#F84888,transparent)', boxShadow: '0 0 18px #F84888' }} />}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '10px 18px', borderRadius: 999, background: recognized ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.12)', border: `1px solid ${recognized ? 'rgba(52,211,153,0.6)' : 'rgba(255,255,255,0.2)'}`, fontSize: 13, fontWeight: 600, color: recognized ? '#6ee7b7' : 'rgba(255,255,255,0.8)' }}>{recognized ? '✓ password.lovelink.my' : 'Наведите камеру на QR-код'}</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, display: 'flex', justifyContent: 'center' }}><div style={{ width: 70, height: 70, borderRadius: 35, border: '4px solid #fff', background: 'rgba(255,255,255,0.2)' }} /></div>
    </div>
  );
};
