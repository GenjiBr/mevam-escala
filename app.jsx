// MEVAM Escala — App shell + tab nav + state (Supabase)

const { useReducer, useEffect: useEffectApp, useState: useStateApp, useCallback: useCallbackApp } = React;

/* ─────────────────────────────────────────────────
   Reducer (estado local puro — sem side-effects)
───────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {

    case 'hydrate':
      return { ...state, membros: action.membros, cultos: action.cultos, indispo: action.indispo, carregando: false };

    case 'set_cultos':
      return { ...state, cultos: action.cultos };

    case 'add_indispo': {
      const next = { ...state.indispo };
      for (const iso of action.datas) {
        const arr = next[iso] ? [...next[iso]] : [];
        if (!arr.some((x) => x.membroId === action.usuarioId))
          arr.push({ membroId: action.usuarioId, motivo: action.motivo || '', lembrete: action.lembrete || false });
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

    case 'update_membro':
      return { ...state, membros: state.membros.map((m) => m.id === action.id ? { ...m, ...action.updates } : m) };

    case 'set_loading':
      return { ...state, carregando: action.value };

    default: return state;
  }
}

/* ─────────────────────────────────────────────────
   Tab bar
───────────────────────────────────────────────── */
function TabBar({ tab, setTab, perfil }) {
  const tabs = [
    { id: 'escala',          label: 'Escala',   icon: 'calendar' },
    { id: 'disponibilidade', label: 'Ausência', icon: 'ban'      },
    { id: 'membros',         label: 'Equipe',   icon: 'users'    },
    { id: 'perfil',          label: 'Perfil',   icon: 'person'   },
    { id: 'admin',           label: 'Admin',    icon: 'shield'   },
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
      padding: 6, display: 'flex', gap: 4,
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

/* ─────────────────────────────────────────────────
   Tela de splash / loading
───────────────────────────────────────────────── */
function SplashScreen({ msg = 'Carregando...' }) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(120% 70% at 50% 0%, rgba(91,127,255,0.2), rgba(4,8,26,0) 55%), ${MEVAM_COLORS.bgDeep}`,
    }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <img src="assets/mevam-logo.png" alt="MEVAM" style={{ width: 130, mixBlendMode: 'screen', opacity: 0.85 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13 }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, border: `2px solid ${MEVAM_COLORS.accent}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          {msg}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   App
───────────────────────────────────────────────── */
function App() {
  const [usuario, setUsuario] = useStateApp(null);
  const [tab, setTab] = useStateApp('escala');
  const [state, _dispatch] = useReducer(reducer, { membros: [], cultos: [], indispo: {}, carregando: true });
  const [toast, setToast] = useStateApp({ msg: '', kind: 'ok' });
  const [authLoading, setAuthLoading] = useStateApp(true);

  const showToast = (msg, kind = 'ok') => setToast({ msg, kind });

  /* ── Dispatch com persistência no Supabase ── */
  const dispatch = useCallbackApp(async (action) => {
    _dispatch(action);
    switch (action.type) {
      case 'add_indispo':
        for (const iso of action.datas)
          await sbAddIndispo({ membroId: action.usuarioId, data: iso, motivo: action.motivo, lembrete: action.lembrete });
        break;
      case 'remove_indispo':
        await sbRemoveIndispo({ membroId: action.usuarioId, data: action.iso });
        break;
      case 'update_membro':
        await sbUpdateMembro(action.id, action.updates);
        break;
    }
  }, []);

  /* ── Gerar escala (calcula + persiste cultos) ── */
  const handleGerarEscala = useCallbackApp(async () => {
    const novosCultos = state.cultos.map((c) => {
      const indispoIds = (state.indispo[c.data] || []).map((i) => i.membroId);
      const esc = { ...c.escalados };
      for (const [fid, val] of Object.entries(esc)) {
        if (Array.isArray(val)) continue;
        if (!val) {
          const cand = state.membros.find((m) =>
            m.status === 'ativo' && (m.func === fid || m.secundarias.includes(fid)) && !indispoIds.includes(m.id));
          if (cand) esc[fid] = cand.id;
        } else if (indispoIds.includes(val)) {
          const sub = state.membros.find((m) =>
            m.status === 'ativo' && (m.func === fid || m.secundarias.includes(fid)) && !indispoIds.includes(m.id) && m.id !== val);
          if (sub) esc[fid] = sub.id;
        }
      }
      return { ...c, escalados: esc };
    });
    _dispatch({ type: 'set_cultos', cultos: novosCultos });
    for (const c of novosCultos) await sbUpsertCulto(c);
    showToast('Escala gerada para as próximas semanas', 'ok');
  }, [state.cultos, state.membros, state.indispo]);

  /* ── Auth: escuta mudanças de sessão ── */
  useEffectApp(() => {
    const { data: { subscription } } = SB.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const emailUsuario = session.user.email;
        const partes = (emailUsuario || '').split('@')[0].replace(/[._-]/g, ' ').split(' ');
        const nomeAuto = partes.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ').trim();
        const idFallback = 'u_' + session.user.id.replace(/-/g, '').slice(0, 10);

        // Tenta encontrar o membro (com até 3 tentativas — aguarda trigger do Supabase)
        let membro = null;
        for (let i = 0; i < 3 && !membro; i++) {
          if (i > 0) await new Promise((r) => setTimeout(r, 900));
          const { data } = await SB.from('membros').select('*').eq('email', emailUsuario).maybeSingle();
          membro = data;
        }

        if (!membro) {
          // Trigger não rodou — insere manualmente e usa como fallback
          const novoMembro = {
            id: idFallback, nome: nomeAuto, email: emailUsuario,
            iniciais: nomeAuto.split(' ').map((x) => x[0]).filter(Boolean).join('').toUpperCase().slice(0, 2),
            func: 'vocal_backing', secundarias: [], status: 'ativo', tom: '#5B7FFF', perfil: 'membro',
          };
          await sbInsertMembro(novoMembro);
          membro = novoMembro;
        }

        setUsuario({ id: membro.id, nome: membro.nome, perfil: membro.perfil || 'membro' });
      } else {
        setUsuario(null);
      }
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Carrega dados quando o usuário loga ── */
  useEffectApp(() => {
    if (!usuario) return;
    (async () => {
      _dispatch({ type: 'set_loading', value: true });
      const [membros, cultos, indispo] = await Promise.all([sbGetMembros(), sbGetCultos(), sbGetIndispo()]);
      // Primeira execução como admin: semeia os cultos de exemplo
      if (cultos.length === 0 && usuario.perfil === 'admin') {
        await sbSeedCultos();
        const cultosSeeded = await sbGetCultos();
        _dispatch({ type: 'hydrate', membros, cultos: cultosSeeded, indispo });
        showToast('Cultos de exemplo carregados!', 'info');
      } else {
        _dispatch({ type: 'hydrate', membros, cultos, indispo });
      }
    })();
  }, [usuario?.id]);

  /* ── Toast de boas-vindas ── */
  useEffectApp(() => {
    if (!usuario || state.carregando) return;
    const meu = state.cultos.find((c) => Object.values(c.escalados).flat().includes(usuario.id));
    if (meu) {
      const d = formatBRDate(meu.data);
      setTimeout(() => setToast({ msg: `Você está escalado para ${d.diaSemana}, ${d.dia} ${d.mes}`, kind: 'info' }), 800);
    }
  }, [state.carregando]);

  /* ── Compartilhar ── */
  const handleShare = () => {
    const proximo = [...state.cultos].sort((a, b) => a.data.localeCompare(b.data))[0];
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
    if (navigator.share) {
      navigator.share({ title: `MEVAM Escala · ${proximo.titulo}`, text: texto }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      showToast('Escala copiada — cole onde quiser', 'ok');
    }
  };

  const handleLogout = async () => {
    await SB.auth.signOut();
    setUsuario(null);
    setTab('escala');
  };

  const handleUpdateUsuario = (updates) => setUsuario((u) => ({ ...u, ...updates }));

  /* ── Renders condicionais ── */
  if (authLoading) return <SplashScreen msg="Verificando sessão..." />;
  if (!usuario)   return <LoginScreen />;
  if (state.carregando) return <SplashScreen msg="Carregando dados..." />;

  const screens = {
    escala:          <EscalaScreen state={state} dispatch={dispatch} usuario={usuario} onShare={handleShare} onToast={showToast} onPerfilClick={() => setTab('perfil')} />,
    disponibilidade: <DisponibilidadeScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} />,
    membros:         <MembrosScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} />,
    perfil:          <PerfilScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} onLogout={handleLogout} onUpdateUsuario={handleUpdateUsuario} />,
    admin:           <AdminScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} onGerarEscala={handleGerarEscala} />,
  };

  return (
    <div style={{
      minHeight: '100dvh', position: 'relative',
      background: `radial-gradient(140% 70% at 50% -10%, rgba(91,127,255,0.18), rgba(4,8,26,0) 55%), ${MEVAM_COLORS.bgDeep}`,
      fontFamily: 'Manrope, system-ui, sans-serif',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.4, zIndex: 0,
        backgroundImage: 'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.6) 0%, transparent 50%), radial-gradient(1.5px 1.5px at 78% 12%, rgba(168,187,255,0.55) 0%, transparent 50%), radial-gradient(1px 1px at 42% 78%, rgba(255,255,255,0.45) 0%, transparent 50%), radial-gradient(1px 1px at 88% 62%, rgba(168,187,255,0.5) 0%, transparent 50%), radial-gradient(1.2px 1.2px at 22% 55%, rgba(255,255,255,0.4) 0%, transparent 50%)',
      }} />
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
