import React from 'react';

/** Tulip bouquet in wrapping paper (vector, brand palette). */
export const Bouquet: React.FC<{ width?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ width = 420, style, children }) => {
  const h = width * 1.25;
  const tulip = (x: number, y: number, c1: string, c2: string, rot = 0, s = 1) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 150 L0 40" stroke="#3f8f5a" strokeWidth="7" strokeLinecap="round" />
      <path d="M-4 120 C -40 100 -44 70 -30 56 C -16 76 -8 96 -4 120Z" fill="#4fa36b" />
      <path d="M4 110 C 36 92 44 64 30 52 C 18 72 8 90 4 110Z" fill="#3f8f5a" />
      <path d="M-34 40 C -40 -10 -14 -30 0 -10 C 14 -30 40 -10 34 40 C 30 62 -30 62 -34 40Z" fill={c1} />
      <path d="M-12 44 C -16 4 -4 -14 0 -10 C 4 -14 16 4 12 44Z" fill={c2} opacity="0.9" />
      <path d="M-34 40 C -28 28 -20 24 -14 44Z" fill={c2} opacity="0.5" />
    </g>
  );
  return (
    <div style={{ position: 'relative', width, height: h, ...style }}>
      <svg width={width} height={h} viewBox="0 0 400 500">
        <defs>
          <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fdf2f8" /><stop offset="1" stopColor="#f3e8ff" /></linearGradient>
          <linearGradient id="paper2" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#fce7f3" /></linearGradient>
        </defs>
        {tulip(130, 150, '#F84888', '#ff7fb1', -14, 1.05)}
        {tulip(200, 120, '#7850F0', '#a98cff', 0, 1.1)}
        {tulip(270, 150, '#fb7185', '#fda4af', 14, 1.05)}
        {tulip(165, 190, '#ec4899', '#f9a8d4', -6, 0.9)}
        {tulip(240, 190, '#c084fc', '#e9d5ff', 6, 0.9)}
        {/* paper */}
        <path d="M70 250 L200 420 L330 250 L300 480 L100 480 Z" fill="url(#paper)" stroke="#f5d0e6" strokeWidth="2" />
        <path d="M100 250 L200 400 L300 250 L280 480 L120 480 Z" fill="url(#paper2)" opacity="0.9" />
        <path d="M200 400 L200 480" stroke="#f0cfe4" strokeWidth="2" />
        {/* ribbon */}
        <path d="M150 362 C 200 340 200 340 250 362" stroke="#F84888" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="200" cy="356" r="9" fill="#F84888" />
      </svg>
      {children}
    </div>
  );
};

/** Small printed card with a QR (used inside the bouquet). */
export const QrCard: React.FC<{ qr: string; width?: number; style?: React.CSSProperties; label?: string }> = ({ qr, width = 170, style, label = 'Отсканируй меня 🤍' }) => (
  <div style={{ width, padding: width * 0.07, borderRadius: width * 0.1, background: '#fff', boxShadow: '0 16px 34px rgba(0,0,0,0.25)', textAlign: 'center', ...style }}>
    <img src={qr} alt="QR" style={{ width: '100%', display: 'block', borderRadius: width * 0.05 }} />
    <div className="font-ui" style={{ marginTop: width * 0.05, fontSize: width * 0.085, fontWeight: 600, color: '#171717' }}>{label}</div>
    <div style={{ marginTop: width * 0.02, fontSize: width * 0.065, color: '#737373', letterSpacing: 1 }}>LoveLink</div>
  </div>
);

export const GiftBox: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 160, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <rect x="12" y="42" width="76" height="48" rx="8" fill="#7850F0" />
    <rect x="8" y="30" width="84" height="18" rx="6" fill="#8d6cff" />
    <rect x="44" y="30" width="12" height="60" fill="#F84888" />
    <path d="M50 30 C 30 10 20 24 36 32 Z" fill="#F84888" /><path d="M50 30 C 70 10 80 24 64 32 Z" fill="#F84888" />
  </svg>
);

export const EnvelopeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3.5 7.5 12 13l8.5-5.5" /></svg>
);

export const LockIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><circle cx="12" cy="15.5" r="1.3" fill={color} /></svg>
);

export const LinkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.1 0l2.8-2.8a5 5 0 0 0-7.1-7.1L11.5 4.4" /><path d="M14 11a5 5 0 0 0-7.1 0l-2.8 2.8a5 5 0 0 0 7.1 7.1l1.3-1.3" /></svg>
);

export const QrIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 14h3v3h-3zM19 14h2M14 19h2M19 19h2v2" /></svg>
);

export const PlayIcon: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: '50%', background: 'rgba(0,0,0,0.8)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
    <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 24 24" fill="#fff"><path d="M9 7.5v9l8-4.5-8-4.5Z" /></svg>
  </span>
);
