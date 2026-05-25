// MEVAM Escala — átomos UI
// Carrega antes do app principal. Exporta para window.

const C = window.MEVAM_COLORS = {
  bgDeep: '#04081A',
  bgSurface: '#0A1224',
  card: 'rgba(255,255,255,0.04)',
  cardHi: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.14)',
  text: '#F2F5FB',
  muted: 'rgba(242,245,251,0.58)',
  mutedSoft: 'rgba(242,245,251,0.38)',
  accent: '#5B7FFF',
  accentSoft: 'rgba(91,127,255,0.16)',
  accentGlow: 'rgba(91,127,255,0.45)',
  danger: '#FF6B6B',
  dangerSoft: 'rgba(255,107,107,0.14)',
  ok: '#4ADE9B',
};

// ──────────────────────────────────────────────────────────
// Avatar (iniciais ou foto do perfil)
// ──────────────────────────────────────────────────────────
function Avatar({ iniciais, tom = '#5B7FFF', size = 38, ring = false, foto = null }) {
  const shadow = ring ? `0 0 0 2.5px ${tom}, 0 0 0 4.5px ${C.bgDeep}` : `0 2px 8px ${tom}33`;
  if (foto) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 999, overflow: 'hidden', flexShrink: 0,
        boxShadow: shadow, border: ring ? `2px solid ${tom}` : 'none',
      }}>
        <img src={foto} alt={iniciais} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `linear-gradient(135deg, ${tom}DD 0%, ${tom}88 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.36,
      letterSpacing: 0.4, fontFamily: 'Manrope, sans-serif',
      boxShadow: shadow, flexShrink: 0,
    }}>
      {iniciais}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Função badge (chip colorido)
// ──────────────────────────────────────────────────────────
function FuncBadge({ funcId, size = 'sm' }) {
  const f = window.FUNCOES[funcId];
  if (!f) return null;
  const tall = size === 'md';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: tall ? '5px 10px' : '3px 8px',
      borderRadius: 999,
      background: f.color + '22',
      border: `1px solid ${f.color}55`,
      color: f.color,
      fontSize: tall ? 12 : 10.5,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: 0.2,
      whiteSpace: 'nowrap',
      fontFamily: 'Manrope, sans-serif',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
      {f.label}
    </span>
  );
}

function FuncDot({ funcId, size = 8 }) {
  const f = window.FUNCOES[funcId];
  if (!f) return null;
  return <span style={{ width: size, height: size, borderRadius: 999, background: f.color, boxShadow: `0 0 6px ${f.color}AA`, display: 'inline-block', flexShrink: 0 }} />;
}

// ──────────────────────────────────────────────────────────
// Card glassy (com borda lateral colorida opcional)
// ──────────────────────────────────────────────────────────
function Card({ children, accent, glow, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: 'relative',
      background: glow
        ? `linear-gradient(140deg, ${accent || C.accent}22 0%, ${C.cardHi} 60%)`
        : C.card,
      border: `1px solid ${glow ? (accent || C.accent) + '55' : C.border}`,
      borderRadius: 18,
      padding: 16,
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      ...style,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: accent,
          boxShadow: glow ? `0 0 24px ${accent}` : 'none',
        }} />
      )}
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Botão primário/secundário
// ──────────────────────────────────────────────────────────
function Btn({ children, variant = 'primary', onClick, full, icon, style = {}, disabled }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px 18px', borderRadius: 14,
    fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: '1px solid transparent',
    transition: 'transform .15s, background .15s',
    width: full ? '100%' : 'auto',
    letterSpacing: 0.1,
  };
  const variants = {
    primary: { background: `linear-gradient(180deg, #FFFFFF 0%, #DCE4F5 100%)`, color: '#0A1224', boxShadow: '0 8px 24px rgba(91,127,255,0.35), inset 0 1px 0 rgba(255,255,255,0.5)' },
    accent:  { background: `linear-gradient(180deg, ${C.accent} 0%, #3D5FE0 100%)`, color: '#fff', boxShadow: `0 8px 24px ${C.accentGlow}` },
    ghost:   { background: C.card, color: C.text, border: `1px solid ${C.border}` },
    danger:  { background: C.dangerSoft, color: C.danger, border: `1px solid ${C.danger}44` },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform='scale(.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform='scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform='scale(1)')}
    >
      {icon}{children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// Pill / Chip (filtro)
// ──────────────────────────────────────────────────────────
function Chip({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 12px', borderRadius: 999,
      background: active ? (color ? color + '22' : C.accentSoft) : 'transparent',
      border: `1px solid ${active ? (color ? color + '88' : C.accent) : C.border}`,
      color: active ? (color || C.accent) : C.muted,
      fontSize: 12, fontWeight: 600,
      cursor: 'pointer', whiteSpace: 'nowrap',
      fontFamily: 'Manrope, sans-serif',
      letterSpacing: 0.2,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────
// Toast
// ──────────────────────────────────────────────────────────
function Toast({ msg, kind = 'ok', onClose }) {
  React.useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [msg]);
  if (!msg) return null;
  const tones = { ok: C.ok, info: C.accent, warn: '#F39C12', err: C.danger };
  const tone = tones[kind] || C.accent;
  return (
    <div style={{
      position: 'fixed', left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 448, bottom: 96, zIndex: 80,
      background: `linear-gradient(180deg, rgba(15,25,55,0.92), rgba(8,15,35,0.92))`,
      border: `1px solid ${tone}66`,
      borderRadius: 16, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      color: C.text, fontFamily: 'Manrope, sans-serif', fontSize: 13.5, fontWeight: 500,
      boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${tone}33`,
      backdropFilter: 'blur(14px)',
      animation: 'toastIn .35s cubic-bezier(.2,.9,.3,1.2)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: 999, background: tone, boxShadow: `0 0 10px ${tone}` }} />
      {msg}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Ícone (linha simples, herda currentColor)
// ──────────────────────────────────────────────────────────
function Icon({ name, size = 18 }) {
  const s = size;
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'calendar': return (<svg width={s} height={s} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" {...stroke}/><path d="M3 9h18M8 3v4M16 3v4" {...stroke}/></svg>);
    case 'ban':      return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...stroke}/><path d="M5.5 5.5l13 13" {...stroke}/></svg>);
    case 'users':    return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2" {...stroke}/><path d="M3.5 19c.7-3 3-4.7 5.5-4.7s4.8 1.7 5.5 4.7" {...stroke}/><circle cx="17" cy="9" r="2.5" {...stroke}/><path d="M15.5 14.3c2.4-.2 4.4 1 5 3.7" {...stroke}/></svg>);
    case 'shield':   return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z" {...stroke}/><path d="M9 12l2 2 4-4" {...stroke}/></svg>);
    case 'plus':     return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" {...stroke}/></svg>);
    case 'share':    return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" {...stroke}/></svg>);
    case 'sparkles': return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" {...stroke}/></svg>);
    case 'chevron':  return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" {...stroke}/></svg>);
    case 'alert':    return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3L2 20h20L12 3z" {...stroke}/><path d="M12 10v4M12 17.5v.1" {...stroke}/></svg>);
    case 'check':    return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" {...stroke}/></svg>);
    case 'search':   return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" {...stroke}/><path d="M16 16l4 4" {...stroke}/></svg>);
    case 'logout':   return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l-5-5 5-5M5 12h12" {...stroke}/></svg>);
    case 'edit':     return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 20h4l10-10-4-4L4 16v4z" {...stroke}/><path d="M14 6l4 4" {...stroke}/></svg>);
    case 'clock':    return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...stroke}/><path d="M12 7v5l3 2" {...stroke}/></svg>);
    case 'mic':      return (<svg width={s} height={s} viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" {...stroke}/><path d="M5 11a7 7 0 0014 0M12 18v3" {...stroke}/></svg>);
    case 'person':   return (<svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" {...stroke}/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" {...stroke}/></svg>);
    case 'camera':   return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" {...stroke}/><circle cx="12" cy="13" r="4" {...stroke}/></svg>);
    case 'wand':     return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M4 20L16 8l2 2L6 22 4 20zM17 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" {...stroke}/></svg>);
    case 'pin':      return (<svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 21s-7-6-7-12a7 7 0 0114 0c0 6-7 12-7 12z" {...stroke}/><circle cx="12" cy="9" r="2.5" {...stroke}/></svg>);
    default: return null;
  }
}

Object.assign(window, { Avatar, FuncBadge, FuncDot, Card, Btn, Chip, Toast, Icon });
