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
          arr.push({ membroId: action.usuarioId, motivo: action.motivo || '', lembrete: action.lembrete || false });
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
    case 'update_membro': {
      return {
        ...state,
        membros: state.membros.map((m) =>
          m.id === action.id ? { ...m, ...action.updates } : m
        ),
      };
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
    { id: 'escala',         label: 'Escala',    icon: 'calendar' },
    { id: 'disponibilidade',label: 'Bloqueio',  icon: 'ban'      },
    { id: 'membros',        label: 'Equipe',    icon: 'users'    },
    { id: 'perfil',         label: 'Perfil',    icon: 'person'   },
    { id: 'admin',          label: 'Admin',     icon: 'shield'   },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 28px)', maxWidth: 452, zIndex: 70,
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
    let id = 'm1';
    const match = state.membros.find((m) => m.nome.toLowerCase() === nome.toLowerCase());
    if (match) id = match.id;
    else if (perfil === 'membro') id = 'm4';
    setUsuario({ id, nome: match?.nome || nome, perfil });
  };

  const handleLogout = () => { setUsuario(null); setTab('escala'); };
  const handleUpdateUsuario = (updates) => setUsuario((u) => ({ ...u, ...updates }));

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
    membros:          <MembrosScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} />,
    perfil:           <PerfilScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} onLogout={handleLogout} onUpdateUsuario={handleUpdateUsuario} />,
    admin:            <AdminScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} />,
  };

  return (
    <div style={{
      minHeight: '100dvh', position: 'relative',
      background: `radial-gradient(140% 70% at 50% -10%, rgba(91,127,255,0.18), rgba(4,8,26,0) 55%), ${MEVAM_COLORS.bgDeep}`,
      fontFamily: 'Manrope, system-ui, sans-serif',
    }}>
      {/* faint stars — fixed para não duplicar ao rolar */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.4, zIndex: 0,
        backgroundImage: 'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(1.5px 1.5px at 78% 12%, rgba(168,187,255,0.55) 0%, transparent 50%), radial-gradient(1px 1px at 42% 78%, rgba(255,255,255,0.45) 0%, transparent 50%), radial-gradient(1px 1px at 88% 62%, rgba(168,187,255,0.5) 0%, transparent 50%), radial-gradient(1.2px 1.2px at 22% 55%, rgba(255,255,255,0.4) 0%, transparent 50%)',
      }} />

      {/* conteúdo rola naturalmente pelo body */}
      <div style={{ position: 'relative', zIndex: 1 }} className="mevam-scroll">
        {screens[tab]}
      </div>

      <TabBar tab={tab} setTab={setTab} perfil={usuario.perfil} />

      <Toast msg={toast.msg} kind={toast.kind} onClose={() => setToast({ msg: '', kind: 'ok' })} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
