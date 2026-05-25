// MEVAM Escala — App shell + tab nav + state

const { useReducer, useEffect: useEffectApp, useState: useStateApp } = React;

const STORAGE_KEY = 'mevam_escala_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function initialState() {
  const saved = loadState();
  if (saved && saved.cultos && saved.cultos.length) return saved;
  return {
    membros: window.MEMBROS_INICIAIS,
    cultos: window.CULTOS_INICIAIS,
    indispo: window.INDISPO_INICIAIS,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'add_indispo': {
      const next = { ...state.indispo };
      for (const iso of action.datas) {
        const arr = next[iso] ? [...next[iso]] : [];
        if (!arr.some((x) => x.membroId === action.usuarioId)) {
          arr.push({ membroId: action.usuarioId, motivo: action.motivo || '' });
        }
        next[iso] = arr;
      }
      return { ...state, indispo: next };
    }
    case 'remove_indispo': {
      const next = { ...state.indispo };
      if (next[action.iso]) {
        next[action.iso] = next[action.iso].filter((x) => x.membroId !== action.usuarioId);
        if (next[action.iso].length === 0) delete next[action.iso];
      }
      return { ...state, indispo: next };
    }
    case 'gerar_escala': {
      // simulação: limpa slots vazios atribuindo membros aleatórios disponíveis
      const next = state.cultos.map((c) => {
        const indispoIds = (state.indispo[c.data] || []).map((i) => i.membroId);
        const esc = { ...c.escalados };
        for (const [fid, val] of Object.entries(esc)) {
          if (Array.isArray(val)) continue;
          if (!val) {
            const candidato = state.membros.find((m) =>
              m.status === 'ativo' &&
              (m.func === fid || m.secundarias.includes(fid)) &&
              !indispoIds.includes(m.id)
            );
            if (candidato) esc[fid] = candidato.id;
          } else if (indispoIds.includes(val)) {
            // troca por outro disponível
            const sub = state.membros.find((m) =>
              m.status === 'ativo' &&
              (m.func === fid || m.secundarias.includes(fid)) &&
              !indispoIds.includes(m.id) &&
              m.id !== val
            );
            if (sub) esc[fid] = sub.id;
          }
        }
        return { ...c, escalados: esc };
      });
      return { ...state, cultos: next };
    }
    case 'reset': return initialState();
    default: return state;
  }
}

// ════════════════════════════════════════════════════════════
// Tab bar
// ════════════════════════════════════════════════════════════
function TabBar({ tab, setTab, perfil }) {
  const tabs = [
    { id: 'escala',         label: 'Escala',        icon: 'calendar' },
    { id: 'disponibilidade',label: 'Disponível',    icon: 'ban' },
    { id: 'membros',        label: 'Equipe',        icon: 'users' },
    { id: 'admin',          label: 'Admin',         icon: 'shield' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 18, left: 14, right: 14, zIndex: 70,
      borderRadius: 22,
      background: 'rgba(8,14,30,0.78)',
      border: `1px solid ${MEVAM_COLORS.borderHi}`,
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      padding: 6,
      display: 'flex', gap: 4,
      boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
    }}>
      {tabs.map((t) => {
        const active = tab === t.id;
        const restricted = t.id === 'admin' && perfil !== 'admin';
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '9px 6px 8px', borderRadius: 16,
            background: active ? `linear-gradient(180deg, ${MEVAM_COLORS.accent}, #3D5FE0)` : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? '#fff' : restricted ? MEVAM_COLORS.mutedSoft : MEVAM_COLORS.muted,
            fontFamily: 'Manrope', fontSize: 10, fontWeight: 600,
            transition: 'background .2s',
            opacity: restricted ? 0.5 : 1,
            boxShadow: active ? `0 6px 20px ${MEVAM_COLORS.accentGlow}` : 'none',
          }}>
            <Icon name={t.icon} size={17} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// App
// ════════════════════════════════════════════════════════════
function App() {
  const [usuario, setUsuario] = useStateApp(null);
  const [tab, setTab] = useStateApp('escala');
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const [toast, setToast] = useStateApp({ msg: '', kind: 'ok' });

  useEffectApp(() => { saveState(state); }, [state]);

  // welcome toast no login
  useEffectApp(() => {
    if (usuario) {
      const meu = state.cultos.find((c) => Object.values(c.escalados).flat().includes(usuario.id));
      if (meu) {
        const d = formatBRDate(meu.data);
        setTimeout(() => setToast({ msg: `Você está escalado para ${d.diaSemana}, ${d.dia} ${d.mes}`, kind: 'info' }), 600);
      }
    }
  }, [usuario]);

  const showToast = (msg, kind = 'ok') => setToast({ msg, kind });

  const handleLogin = ({ nome, perfil }) => {
    // se for admin demo, usa Lucas. Senão, criamos um membro do usuário ou usamos Bruno
    let id = 'm1';
    const match = state.membros.find((m) => m.nome.toLowerCase() === nome.toLowerCase());
    if (match) id = match.id;
    else if (perfil === 'membro') id = 'm4';
    setUsuario({ id, nome: match?.nome || nome, perfil });
  };

  const handleShare = () => {
    const proximo = [...state.cultos].sort((a,b)=>a.data.localeCompare(b.data))[0];
    if (!proximo) return;
    const d = formatBRDate(proximo.data);
    const linhas = [`🎵 MEVAM Ceilândia · ${proximo.titulo}`, `📅 ${d.diaSemana}, ${d.dia} ${d.mes} · ${proximo.horario}`, ''];
    for (const [fid, val] of Object.entries(proximo.escalados)) {
      const f = window.FUNCOES[fid];
      const ids = Array.isArray(val) ? val : (val ? [val] : []);
      const nomes = ids.map((id) => state.membros.find((m) => m.id === id)?.nome).filter(Boolean).join(', ');
      if (nomes) linhas.push(`${f.icon} ${f.label}: ${nomes}`);
    }
    const texto = linhas.join('\n');
    if (navigator.clipboard) navigator.clipboard.writeText(texto);
    showToast('Escala copiada — cole no WhatsApp', 'ok');
  };

  if (!usuario) return <LoginScreen onLogin={handleLogin} />;

  const screens = {
    escala:           <EscalaScreen state={state} dispatch={dispatch} usuario={usuario} onShare={handleShare} onToast={showToast} />,
    disponibilidade:  <DisponibilidadeScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} />,
    membros:          <MembrosScreen state={state} usuario={usuario} onToast={showToast} />,
    admin:            <AdminScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} />,
  };

  return (
    <div style={{
      height: '100%', position: 'relative', overflow: 'hidden',
      background: `radial-gradient(140% 70% at 50% -10%, rgba(91,127,255,0.18), rgba(4,8,26,0) 55%), ${MEVAM_COLORS.bgDeep}`,
      fontFamily: 'Manrope, system-ui, sans-serif',
    }}>
      {/* faint stars */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: 'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(1.5px 1.5px at 78% 12%, rgba(168,187,255,0.55) 0%, transparent 50%), radial-gradient(1px 1px at 42% 78%, rgba(255,255,255,0.45) 0%, transparent 50%), radial-gradient(1px 1px at 88% 62%, rgba(168,187,255,0.5) 0%, transparent 50%), radial-gradient(1.2px 1.2px at 22% 55%, rgba(255,255,255,0.4) 0%, transparent 50%)',
      }} />

      <div style={{ height: '100%', overflow: 'auto', paddingTop: 56 }} className="mevam-scroll">
        {screens[tab]}
      </div>

      <TabBar tab={tab} setTab={setTab} perfil={usuario.perfil} />

      <Toast msg={toast.msg} kind={toast.kind} onClose={() => setToast({ msg: '', kind: 'ok' })} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Stage: phone on dark backdrop (igual referência Inhusk)
// ════════════════════════════════════════════════════════════
function Stage() {
  const [tweaks, setTweaks] = useStateApp({
    accent: '#5B7FFF',
    showLabel: true,
  });
  const [showTweaks, setShowTweaks] = useStateApp(false);

  useEffectApp(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // override accent on the fly
  useEffectApp(() => {
    window.MEVAM_COLORS.accent = tweaks.accent;
    window.MEVAM_COLORS.accentSoft = tweaks.accent + '22';
    window.MEVAM_COLORS.accentGlow = tweaks.accent + '70';
  }, [tweaks.accent]);

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: `radial-gradient(80% 60% at 50% 35%, #102047 0%, #07101F 50%, #02050C 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* aurora glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 720, height: 720, borderRadius: 999,
        background: `radial-gradient(circle, ${tweaks.accent}55 0%, transparent 60%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -200, right: -100,
        width: 500, height: 500, borderRadius: 999,
        background: 'radial-gradient(circle, rgba(124,92,255,0.35) 0%, transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none',
      }} />

      {/* corner brand */}
      <div style={{
        position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', gap: 10,
        zIndex: 5,
      }}>
        <img src="assets/mevam-logo.png" alt="MEVAM" style={{ height: 30, opacity: 0.85 }} />
        <div style={{ height: 22, width: 1, background: 'rgba(255,255,255,0.18)' }} />
        <div style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>Escala · Louvor & Pregação</div>
      </div>

      {/* label pill */}
      {tweaks.showLabel && (
        <div style={{
          marginBottom: 18, padding: '7px 16px', borderRadius: 999,
          background: 'rgba(91,127,255,0.18)', border: `1px solid ${tweaks.accent}55`,
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, color: '#E6ECFF',
          letterSpacing: 0.3, position: 'relative', zIndex: 5,
          boxShadow: `0 6px 24px ${tweaks.accent}44`,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: tweaks.accent, boxShadow: `0 0 8px ${tweaks.accent}` }} />
          MEVAM Escala · Interactive Prototype
        </div>
      )}

      {/* phone */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <IOSDevice width={390} height={780} dark>
          <App />
        </IOSDevice>
      </div>

      {/* footer hint */}
      <div style={{
        marginTop: 22, fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.4)',
        letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500, position: 'relative', zIndex: 5,
      }}>
        Toque em qualquer aba · Login: <span style={{ color: 'rgba(255,255,255,0.65)' }}>Lucas · 1234</span> ou <span style={{ color: 'rgba(255,255,255,0.65)' }}>Bruno · 0000</span>
      </div>

      {showTweaks && (
        <TweaksPanel onClose={() => { setShowTweaks(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }} tweaks={tweaks} setTweaks={setTweaks} />
      )}
    </div>
  );
}

function TweaksPanel({ onClose, tweaks, setTweaks }) {
  const set = (k, v) => setTweaks((t) => ({ ...t, [k]: v }));
  const accents = ['#5B7FFF', '#7C5CFF', '#4FD1C5', '#F39C12', '#FF6B9D'];

  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, zIndex: 1000,
      width: 240, padding: 14, borderRadius: 16,
      background: 'rgba(8,14,30,0.95)', border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(20px)', color: '#F2F5FB',
      fontFamily: 'Manrope, sans-serif',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 0.4, textTransform: 'uppercase' }}>Tweaks</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18 }}>×</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Cor de acento</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {accents.map((c) => (
              <button key={c} onClick={() => set('accent', c)} style={{
                width: 32, height: 32, borderRadius: 8, background: c, border: tweaks.accent === c ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', boxShadow: `0 0 12px ${c}88`,
              }} />
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, cursor: 'pointer' }}>
          <input type="checkbox" checked={tweaks.showLabel} onChange={(e) => set('showLabel', e.target.checked)} />
          Mostrar label do protótipo
        </label>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); window.location.reload(); }} style={{
          padding: '10px 12px', borderRadius: 10, background: 'rgba(255,107,107,0.14)', border: '1px solid rgba(255,107,107,0.4)', color: '#FF8585', cursor: 'pointer', fontWeight: 600, fontSize: 12.5,
        }}>Resetar dados</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Stage />);
