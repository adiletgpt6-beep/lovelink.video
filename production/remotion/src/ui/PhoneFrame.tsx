import React from 'react';

export const PHONE_W = 390;
export const PHONE_H = 844;
const BEZEL = 13;
const RADIUS = 62;

type Props = {
  children: React.ReactNode;
  scale?: number;
  style?: React.CSSProperties;
  /** Colour of the status-bar glyphs. */
  statusColor?: string;
  showStatus?: boolean;
  time?: string;
  /** Extra glow colour behind the device. */
  glow?: string;
};

/** iPhone-style device frame. Children are laid out at 390×844 logical px and scaled. */
export const PhoneFrame: React.FC<Props> = ({ children, scale = 1.8, style, statusColor = '#111', showStatus = true, time = '9:41', glow }) => {
  const W = PHONE_W + BEZEL * 2;
  const H = PHONE_H + BEZEL * 2;
  return (
    <div style={{ width: W * scale, height: H * scale, position: 'relative', ...style }}>
      {glow && (
        <div
          style={{
            position: 'absolute', inset: -60 * scale, borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 50%, ${glow} 0%, transparent 65%)`, filter: 'blur(40px)', opacity: 0.8,
          }}
        />
      )}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        {/* body */}
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: RADIUS,
            background: 'linear-gradient(145deg,#3a3a40 0%,#141416 45%,#0a0a0b 100%)',
            boxShadow: '0 40px 90px rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.10)',
          }}
        />
        {/* side buttons */}
        <div style={{ position: 'absolute', left: -3, top: 150, width: 3, height: 34, borderRadius: 2, background: '#2a2a2e' }} />
        <div style={{ position: 'absolute', left: -3, top: 205, width: 3, height: 62, borderRadius: 2, background: '#2a2a2e' }} />
        <div style={{ position: 'absolute', left: -3, top: 280, width: 3, height: 62, borderRadius: 2, background: '#2a2a2e' }} />
        <div style={{ position: 'absolute', right: -3, top: 230, width: 3, height: 96, borderRadius: 2, background: '#2a2a2e' }} />
        {/* screen */}
        <div
          style={{
            position: 'absolute', left: BEZEL, top: BEZEL, width: PHONE_W, height: PHONE_H, borderRadius: RADIUS - BEZEL + 2,
            overflow: 'hidden', background: '#000', isolation: 'isolate',
          }}
        >
          <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
          {/* dynamic island */}
          <div style={{ position: 'absolute', zIndex: 1000, top: 11, left: '50%', transform: 'translateX(-50%)', width: 122, height: 36, borderRadius: 20, background: '#000' }} />
          {showStatus && (
            <div className="font-ui" style={{ position: 'absolute', zIndex: 1000, top: 14, left: 0, right: 0, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px 0 36px', color: statusColor, fontSize: 15.5, fontWeight: 600, letterSpacing: -0.2 }}>
              <span>{time}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="18" height="12" viewBox="0 0 18 12" fill={statusColor}><rect x="0" y="8" width="3" height="4" rx="0.8" /><rect x="5" y="5.5" width="3" height="6.5" rx="0.8" /><rect x="10" y="3" width="3" height="9" rx="0.8" /><rect x="15" y="0" width="3" height="12" rx="0.8" /></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={statusColor} strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" /><path d="M4 7a6 6 0 0 1 8 0" /><circle cx="8" cy="10" r="1.2" fill={statusColor} stroke="none" /></svg>
                <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke={statusColor} strokeOpacity="0.5" /><rect x="2" y="2" width="19" height="9" rx="2" fill={statusColor} /><rect x="24" y="4.5" width="2" height="4" rx="1" fill={statusColor} fillOpacity="0.5" /></svg>
              </span>
            </div>
          )}
          {/* glass reflection */}
          <div style={{ position: 'absolute', zIndex: 1001, inset: 0, pointerEvents: 'none', background: 'linear-gradient(115deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%)' }} />
        </div>
      </div>
    </div>
  );
};
