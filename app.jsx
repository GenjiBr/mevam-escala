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

    case 'set_admin_logs':
      return { ...state, adminLogs: action.logs || [] };

    case 'add_admin_log':
      return { ...state, adminLogs: [action.log, ...(state.adminLogs || [])].filter(Boolean).slice(0, 50) };

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

    case 'clear_indispo_membro': {
      const next = { ...state.indispo };
      for (const iso of Object.keys(next)) {
        next[iso] = next[iso].filter((x) => x.membroId !== action.usuarioId);
        if (next[iso].length === 0) delete next[iso];
      }
      return { ...state, indispo: next };
    }

    case 'update_membro':
      return { ...state, membros: state.membros.map((m) => m.id === action.id ? { ...m, ...action.updates } : m) };

    case 'remove_membro':
      return { ...state, membros: state.membros.filter((m) => m.id !== action.id) };

    case 'sair_escala': {
      const hoje = new Date().toISOString().slice(0, 10);
      const cultos = state.cultos.map((c) => {
        if (c.data < hoje) return c;
        const novos = {};
        for (const [fid, val] of Object.entries(c.escalados || {})) {
          if (Array.isArray(val)) novos[fid] = val.filter((id) => id !== action.usuarioId);
          else if (val === action.usuarioId) novos[fid] = null;
          else novos[fid] = val;
        }
        return { ...c, escalados: novos };
      });
      return { ...state, cultos };
    }

    case 'excluir_escala':
      return { ...state, cultos: [], musicas: [] };

    case 'set_loading':
      return { ...state, carregando: action.value };

    case 'set_musicas':
      return { ...state, musicas: action.musicas };

    case 'merge_musicas': {
      const byId = new Map((state.musicas || []).filter((m) => m?.id).map((m) => [m.id, m]));
      for (const musica of (action.musicas || [])) {
        if (musica?.id) byId.set(musica.id, { ...(byId.get(musica.id) || {}), ...musica });
      }
      return { ...state, musicas: Array.from(byId.values()) };
    }

    case 'add_musica':
      if (action.musica?.id && (state.musicas || []).some((m) => m.id === action.musica.id)) return state;
      return { ...state, musicas: [...(state.musicas || []), action.musica] };

    case 'remove_musica':
      return { ...state, musicas: (state.musicas || []).filter((m) => m.id !== action.id) };

    case 'update_musica':
      return { ...state, musicas: (state.musicas || []).map((m) => m.id === action.id ? { ...m, ...action.updates } : m) };

    case 'update_culto_musicas': {
      const cultos = state.cultos.map((c) => c.id === action.cultoId ? { ...c, musicas: action.musicas } : c);
      return { ...state, cultos };
    }

    default: return state;
  }
}

/* ─────────────────────────────────────────────────
   Tab bar
───────────────────────────────────────────────── */
function TabBar({ tab, setTab, perfil }) {
  const tabs = [
    { id: 'escala',          label: 'Escala',   icon: 'clef'     },
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
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '9px 6px 8px', borderRadius: 16,
            background: active ? `linear-gradient(180deg, ${MEVAM_COLORS.accent}, #3D5FE0)` : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? '#fff' : MEVAM_COLORS.muted,
            fontFamily: 'Manrope', fontSize: 10, fontWeight: 600,
            transition: 'background .2s',
            opacity: 1,
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
  const [tab, setTab] = useStateApp(() => {
  const hash = window.location.hash.replace('#', '');
  return ['escala', 'disponibilidade', 'membros', 'admin', 'perfil'].includes(hash) ? hash : 'escala';
});
useEffectApp(() => {
  if (window.location.hash !== '#repertorio') {
    window.location.hash = tab;
  }
}, [tab]);
  const [state, _dispatch] = useReducer(reducer, { membros: [], cultos: [], indispo: {}, musicas: [], adminLogs: [], carregando: true });
  const [toast, setToast] = useStateApp({ msg: '', kind: 'ok' });
  const [authLoading, setAuthLoading] = useStateApp(true);
  const [equipe, setEquipe] = useStateApp(null);
  const [recuperandoSenha, setRecuperandoSenha] = useStateApp(false);

  const showToast = (msg, kind = 'ok') => setToast({ msg, kind });

  const registrarAdminLog = useCallbackApp(async (acao, alvo, detalhes = {}) => {
    if (!equipe?.id || usuario?.perfil !== 'admin') return;
    try {
      const log = await sbAddAdminLog({
        equipe_id: equipe.id,
        admin_id: usuario.id,
        admin_nome: usuario.nome,
        acao,
        alvo_id: alvo?.id || null,
        alvo_nome: alvo?.nome || null,
        detalhes,
      });
      _dispatch({ type: 'add_admin_log', log });
    } catch (e) {
      console.warn('[MEVAM] registrarAdminLog:', e.message);
    }
  }, [equipe?.id, usuario?.id, usuario?.nome, usuario?.perfil]);

  /* ── Dispatch com persistência no Supabase ── */
  const dispatch = useCallbackApp(async (action) => {
    const alvoId = action.usuarioId || action.id;
    const alvo = state.membros.find((m) => m.id === alvoId);
    const countIndispoAlvo = action.type === 'clear_indispo_membro'
      ? Object.values(state.indispo || {}).reduce((total, list) => total + (list || []).filter((i) => i.membroId === action.usuarioId).length, 0)
      : 0;
    _dispatch(action);
    switch (action.type) {
      case 'add_indispo':
        for (const iso of action.datas)
          await sbAddIndispo({ membroId: action.usuarioId, data: iso, motivo: action.motivo, lembrete: action.lembrete });
        await registrarAdminLog('add_indispo', alvo, { datas: action.datas, motivo: action.motivo || '', lembrete: !!action.lembrete });
        break;
      case 'remove_indispo':
        await sbRemoveIndispo({ membroId: action.usuarioId, data: action.iso });
        await registrarAdminLog('remove_indispo', alvo, { data: action.iso });
        break;
      case 'clear_indispo_membro':
        await sbRemoveAllIndispoMembro(action.usuarioId);
        await registrarAdminLog('clear_indispo_membro', alvo, { quantidade: countIndispoAlvo });
        break;
      case 'update_membro':
        await sbUpdateMembro(action.id, action.updates);
        break;
      case 'remove_membro':
        await sbDeleteMembro(action.id);
        await registrarAdminLog('remove_membro', alvo, { func: alvo?.func || null, email: alvo?.email || null });
        break;
      case 'sair_escala':
        await sbSairDaEscala(action.usuarioId);
        break;
      case 'excluir_escala':
        await sbExcluirTodaEscala();
        break;
      case 'remove_musica':
        await sbDeleteMusica(action.id);
        break;
      case 'update_musica':
        await sbUpdateMusica(action.id, action.updates);
        break;
      case 'update_culto_musicas':
        await sbUpdateCultoMusicas(action.cultoId, action.musicas);
        break;
    }
  }, [equipe, registrarAdminLog, state.indispo, state.membros]);

  /* ── Gerar escala automática ──────────────────────────────────────────────
     semanas: número de semanas a cobrir (4=1mês, 13=3m, 26=6m, 52=1ano)

     REGRAS RÍGIDAS:
       1. Cultos futuros são ZERADOS antes de redistribuir (evita dados ruins legados)
       2. Slot só recebe membro se ele tem aquela func como principal OU secundária
       3. Mesmo membro não pode aparecer duas vezes no mesmo culto
       4. Candidato com menor carga acumulada tem prioridade (load balancing)
       5. Sem candidatos qualificados → slot fica VAZIO (nunca aloca errado)
  ─────────────────────────────────────────────────────────────────────────── */
  const handleGerarEscala = useCallbackApp(async (semanas = 8) => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const hojeISO = hoje.toISOString().slice(0, 10);
    const fmtISO = (d) => d.toISOString().slice(0, 10);
    const funcKeys = Object.keys(window.FUNCOES || {});
    const escaladosVazios = () => Object.fromEntries(funcKeys.map((k) => [k, null]));
    const isSegundoDomingo = (iso) => { const d = parseInt(iso.split('-')[2], 10); return d >= 8 && d <= 14; };

    const membrosAtivos = state.membros.filter((m) => m.status === 'ativo' && m.equipe_id === equipe?.id);
    console.log('[MEVAM] ══ Gerando escala ══ semanas:', semanas, '| membros ativos:', membrosAtivos.length);
    console.log('[MEVAM] Perfis:', membrosAtivos.map((m) => `${m.nome} [func:${m.func}] [sec:${(m.secundarias||[]).join(',')}]`));

    // 1. Apagar TODOS os cultos futuros de qui/dom → clean slate para o período escolhido
    //    (preserva passado intacto e sex/sáb que são sempre manuais)
    const parasApagar = state.cultos.filter((c) => {
      if (c.data < hojeISO) return false;       // passado: intocável
      const dow = new Date(c.data + 'T00:00:00').getDay();
      if (dow === 5 || dow === 6) return false;  // sex/sáb: sempre manual
      return true;                               // qui + dom futuros: apagar tudo
    });
    for (const c of parasApagar) await sbDeleteCulto(c.id);

    // 2. Base: cultos que sobrevivem
    let existentes = state.cultos.filter((c) => !parasApagar.find((x) => x.id === c.id));

    // 3. Corrigir nomes de domingos existentes (Culto da Família ↔ Ceia)
    existentes = existentes.map((c) => {
      const dow = new Date(c.data + 'T00:00:00').getDay();
      if (dow !== 0) return c;
      const correto = isSegundoDomingo(c.data) ? 'Ceia' : 'Culto da Família';
      return c.titulo !== correto ? { ...c, titulo: correto } : c;
    });

    // 4. Gerar qui + dom para o período selecionado
    for (let w = 0; w < semanas; w++) {
      const thu = new Date(hoje);
      thu.setDate(hoje.getDate() + (((4 - hoje.getDay()) + 7) % 7 || 7) + w * 7);
      const thuISO = fmtISO(thu);
      if (!existentes.find((c) => c.data === thuISO)) {
        existentes.push({ id: `qui_${thuISO}`, data: thuISO, horario: '20:00', titulo: 'Culto Profético', cor: '#7C5CFF', escalados: escaladosVazios() });
      }
      const sun = new Date(hoje);
      sun.setDate(hoje.getDate() + (((0 - hoje.getDay()) + 7) % 7 || 7) + w * 7);
      const sunISO = fmtISO(sun);
      if (!existentes.find((c) => c.data === sunISO)) {
        const titulo = isSegundoDomingo(sunISO) ? 'Ceia' : 'Culto da Família';
        existentes.push({ id: `dom_${sunISO}`, data: sunISO, horario: '19:00', titulo, cor: '#3B82F6', escalados: escaladosVazios() });
      }
    }

    // 5. ZERAR escalados de todos os cultos FUTUROS (não-manuais) antes de redistribuir
    //    Isso elimina qualquer dado corrompido salvo anteriormente
    existentes = existentes.map((c) => {
      const dow = new Date(c.data + 'T00:00:00').getDay();
      if (dow === 5 || dow === 6) return c;  // sex/sáb: 100% manual — não toca
      if (c.data < hojeISO) return c;         // passado: preserva intacto
      return { ...c, escalados: escaladosVazios() }; // futuro: rebuild limpo
    });

    // 6. Contador por função: quantas vezes cada membro serviu em cada função específica
    //    + última data em que serviu naquela função (usado como desempate no rodízio de secundárias)
    //    (somente cultos passados contam como histórico)
    const contagemFuncao = {};
    const ultimaVezFuncao = {};
    for (const m of membrosAtivos) { contagemFuncao[m.id] = {}; ultimaVezFuncao[m.id] = {}; }
    for (const c of existentes) {
      if (c.data >= hojeISO) continue;
      for (const [fid, val] of Object.entries(c.escalados)) {
        const ids = Array.isArray(val) ? val : (val ? [val] : []);
        for (const id of ids) {
          if (!contagemFuncao[id]) contagemFuncao[id] = {};
          if (!ultimaVezFuncao[id]) ultimaVezFuncao[id] = {};
          contagemFuncao[id][fid] = (contagemFuncao[id][fid] || 0) + 1;
          if (!ultimaVezFuncao[id][fid] || c.data > ultimaVezFuncao[id][fid]) ultimaVezFuncao[id][fid] = c.data;
        }
      }
    }

    // 7. Distribuição — processa cultos futuros em ordem cronológica
    const novosCultos = [...existentes]
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((c) => {
        const dow = new Date(c.data + 'T00:00:00').getDay();
        if (dow === 5 || dow === 6) return c;  // manual
        if (c.data < hojeISO) return c;         // passado: intocável

        const indispoIds = (state.indispo[c.data] || []).map((i) => i.membroId);
        const esc = { ...c.escalados };
        const jaEscaladosNesteCulto = new Set();

        for (const fid of Object.keys(esc)) {
          if (Array.isArray(esc[fid])) continue; // multi-membro: manual

          const disponivel = (m) => !indispoIds.includes(m.id) && !jaEscaladosNesteCulto.has(m.id);

          // Regra 1: prioridade absoluta para quem tem essa como FUNÇÃO PRINCIPAL
          const primarios = membrosAtivos.filter((m) => m.func === fid && disponivel(m));

          // Regra 3: só usa secundária se nenhum membro principal está disponível
          //   Para membros com múltiplas secundárias, rodízio por função menos servida;
          //   em empate de contagem, prefere a função NÃO usada mais recentemente.
          //   Se nenhum candidato "devido" disponível, aceita qualquer (nunca deixa vazio sem motivo).
          const candidatos = (() => {
            if (primarios.length > 0) return primarios;
            const secsAll = membrosAtivos.filter((m) => (m.secundarias || []).includes(fid) && disponivel(m));
            const secsDue = secsAll.filter((m) => {
              const secs = m.secundarias || [];
              if (secs.length <= 1) return true;
              const countFid = contagemFuncao[m.id]?.[fid] || 0;
              const minCount = Math.min(...secs.map((s) => contagemFuncao[m.id]?.[s] || 0));
              if (countFid > minCount) return false;
              // Empate de contagem: incluir `fid` só se não foi a mais recente entre as empatadas
              const tiedSecs = secs.filter((s) => (contagemFuncao[m.id]?.[s] || 0) === minCount);
              const lastFid = ultimaVezFuncao[m.id]?.[fid] || '';
              const maxLastAmongTied = Math.max(...tiedSecs.map((s) => ultimaVezFuncao[m.id]?.[s] || ''));
              return lastFid < maxLastAmongTied || tiedSecs.every((s) => (ultimaVezFuncao[m.id]?.[s] || '') === lastFid);
            });
            return secsDue.length > 0 ? secsDue : secsAll;
          })();

          console.log(`[MEVAM] ${c.data} | slot "${fid}" | primários: [${primarios.map((m) => m.nome).join(', ') || 'NENHUM'}] | usando ${primarios.length > 0 ? 'principal' : 'secundária'}`);

          if (candidatos.length === 0) {
            console.log(`[MEVAM]  → VAZIO`);
            continue;
          }

          // Regra 2: rodízio — quem serviu nessa função menos vezes tem prioridade
          candidatos.sort((a, b) => (contagemFuncao[a.id]?.[fid] || 0) - (contagemFuncao[b.id]?.[fid] || 0));
          const escolhido = candidatos[0];

          esc[fid] = escolhido.id;
          jaEscaladosNesteCulto.add(escolhido.id);
          if (!contagemFuncao[escolhido.id]) contagemFuncao[escolhido.id] = {};
          if (!ultimaVezFuncao[escolhido.id]) ultimaVezFuncao[escolhido.id] = {};
          contagemFuncao[escolhido.id][fid] = (contagemFuncao[escolhido.id][fid] || 0) + 1;
          ultimaVezFuncao[escolhido.id][fid] = c.data;
          console.log(`[MEVAM]  → ${escolhido.nome} (vezes nessa função: ${contagemFuncao[escolhido.id][fid]})`);
        }

        return { ...c, escalados: esc };
      });

    _dispatch({ type: 'set_cultos', cultos: novosCultos });
    for (const c of novosCultos) await sbUpsertCulto(c);
    const gerados = novosCultos.filter((c) => {
      if (c.data < hojeISO) return false;
      const dow = new Date(c.data + 'T00:00:00').getDay();
      return dow !== 5 && dow !== 6;
    }).length;
    const label = semanas <= 4 ? '1 mês' : semanas <= 13 ? '3 meses' : semanas <= 26 ? '6 meses' : '1 ano';
    showToast(`Escala gerada (${label}) — ${gerados} cultos!`, 'ok');
  }, [state.cultos, state.membros, state.indispo, equipe]);

  /* ── Adicionar culto manual (sex/sáb) ── */
  const handleAddCultoManual = useCallbackApp(async ({ data, horario, titulo }) => {
    const dow = new Date(data + 'T00:00:00').getDay();
    const prefixo = dow === 5 ? 'sex' : 'sab';
    const id = `${prefixo}_${data}_${Date.now()}`;
    const funcKeys = Object.keys(window.FUNCOES || {});
    const escalados = Object.fromEntries(funcKeys.map((k) => [k, null]));
    const cor = dow === 5 ? '#F59E0B' : '#10B981';
    const novoCulto = { id, data, horario, titulo, cor, escalados };
    const novosCultos = [...state.cultos, novoCulto];
    _dispatch({ type: 'set_cultos', cultos: novosCultos });
    await sbUpsertCulto(novoCulto);
    showToast(`Culto "${titulo}" adicionado!`, 'ok');
  }, [state.cultos]);

  const withTimeout = (promise, ms, label) => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} demorou para responder`)), ms)),
  ]);

  const carregarUsuarioDaSessao = useCallbackApp(async (session) => {
    if (!session?.user) {
      setUsuario(null);
      return;
    }

    const emailUsuario = session.user.email;
    const fullName = session.user.user_metadata?.full_name || '';
    const nomeAuto = fullName.trim() ||
      (emailUsuario || '').split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ')
        .trim();
    const idFallback = 'u_' + session.user.id.replace(/-/g, '').slice(0, 10);

    let membro = null;
    for (let i = 0; i < 3 && !membro; i++) {
      if (i > 0) await new Promise((r) => setTimeout(r, 900));
      const { data, error } = await withTimeout(
        SB.from('membros').select('*').eq('email', emailUsuario).maybeSingle(),
        8000,
        'Consulta de membro'
      );
      if (error) throw error;
      membro = data;
    }

    if (!membro) {
      const novoMembro = {
        id: idFallback, nome: nomeAuto, email: emailUsuario,
        iniciais: nomeAuto.split(' ').map((x) => x[0]).filter(Boolean).join('').toUpperCase().slice(0, 2),
        func: 'vocal_backing', secundarias: [], status: 'ativo', tom: '#5B7FFF', perfil: 'membro',
      };
      await withTimeout(sbInsertMembro(novoMembro), 8000, 'Cadastro de membro');
      membro = novoMembro;
    }

    setUsuario({ id: membro.id, nome: membro.nome, perfil: membro.perfil || 'membro' });
  }, []);

  useEffectApp(() => {
    let ativo = true;
    withTimeout(SB.auth.getSession(), 5000, 'Verificacao de sessao')
      .then(async ({ data }) => {
        await carregarUsuarioDaSessao(data?.session);
      })
      .catch((e) => {
        console.error('[MEVAM] getSession:', e);
        setUsuario(null);
      })
      .finally(() => {
        if (ativo) setAuthLoading(false);
      });
    return () => { ativo = false; };
  }, [carregarUsuarioDaSessao]);

  /* ── Auth: escuta mudanças de sessão ── */
  useEffectApp(() => {
    const { data: { subscription } } = SB.auth.onAuthStateChange(async (event, session) => {
      // Usuário clicou no link de recuperação de senha
      if (event === 'PASSWORD_RECOVERY') {
        setRecuperandoSenha(true);
        setAuthLoading(false);
        return;
      }
      if (session?.user) {
        const emailUsuario = session.user.email;
        const fullName = session.user.user_metadata?.full_name || '';
        const nomeAuto = fullName.trim() ||
          (emailUsuario || '').split('@')[0]
            .replace(/[._-]/g, ' ')
            .split(' ')
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(' ')
            .trim();
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
      // Carrega equipe do membro atual
      const membroAtual = membros.find((m) => m.id === usuario.id);
      if (membroAtual?.equipe_id) {
        const eq = await sbGetEquipe(membroAtual.equipe_id);
        if (eq) setEquipe(eq);
      }
      // Sincroniza perfil do banco (pode ter mudado)
      if (membroAtual?.perfil && membroAtual.perfil !== usuario.perfil) {
        setUsuario((u) => ({ ...u, perfil: membroAtual.perfil }));
      }
    })();
  }, [usuario?.id]);

  /* ── Carrega repertório quando a equipe muda ── */
  useEffectApp(() => {
    if (!equipe?.id) { _dispatch({ type: 'set_musicas', musicas: [] }); return; }
    sbGetMusicas(equipe.id).then((musicas) => _dispatch({ type: 'merge_musicas', musicas }));
  }, [equipe?.id]);

  /* ── Carrega historico administrativo ── */
  useEffectApp(() => {
    if (!equipe?.id) { _dispatch({ type: 'set_admin_logs', logs: [] }); return; }
    sbGetAdminLogs(equipe.id).then((logs) => _dispatch({ type: 'set_admin_logs', logs }));
  }, [equipe?.id]);

  /* ── Toast de boas-vindas ── */
  useEffectApp(() => {
    if (!usuario || state.carregando) return;
    const meu = state.cultos.find((c) => Object.values(c.escalados).flat().includes(usuario.id));
    if (meu) {
      const d = formatBRDate(meu.data);
      setTimeout(() => setToast({ msg: `Você está escalado para ${d.diaSemana}, ${d.dia} ${d.mes}`, kind: 'info' }), 800);
    }
  }, [state.carregando]);

  /* ── Criar / entrar em equipe ── */
  const handleCriarEquipe = async (nome) => {
    try {
      const eq = await sbCriarEquipe(nome, usuario.id);
      setEquipe(eq);
      setUsuario((u) => ({ ...u, perfil: 'admin' }));
      _dispatch({ type: 'update_membro', id: usuario.id, updates: { equipe_id: eq.id, perfil: 'admin' } });
      showToast(`Escala "${eq.nome}" criada! Código: ${eq.codigo}`, 'ok');
    } catch (e) {
      showToast('Erro ao criar: ' + (e.message || 'tente novamente'), 'err');
      throw e;
    }
  };

  const handleEntrarEquipe = async (codigo) => {
    try {
      const eq = await sbEntrarEquipe(codigo, usuario.id);
      setEquipe(eq);
      _dispatch({ type: 'update_membro', id: usuario.id, updates: { equipe_id: eq.id } });
      showToast(`Você entrou na equipe "${eq.nome}"!`, 'ok');
    } catch (e) {
      showToast(e.message || 'Erro ao entrar na equipe', 'err');
      throw e;
    }
  };

  const handleSairEquipe = async () => {
    await sbSairDaEscala(usuario.id);
    await sbUpdateMembro(usuario.id, { equipe_id: null });
    _dispatch({ type: 'sair_escala', usuarioId: usuario.id });
    _dispatch({ type: 'update_membro', id: usuario.id, updates: { equipe_id: null } });
    setEquipe(null);
    showToast('Você saiu da escala com sucesso', 'ok');
  };

  const handleExcluirEquipe = async () => {
    await sbExcluirTodaEscala();
    if (equipe?.id) await sbExcluirEquipe(equipe.id);
    _dispatch({ type: 'excluir_escala' });
    (state.membros || []).forEach((m) => {
      if (m.equipe_id === equipe?.id) {
        _dispatch({ type: 'update_membro', id: m.id, updates: { equipe_id: null, perfil: 'membro' } });
      }
    });
    setEquipe(null);
    showToast('Escala excluída. Todos os membros foram removidos.', 'ok');
  };

  const handleLogout = async () => {
    try { await SB.auth.signOut(); } catch (e) { console.warn('signOut:', e.message); }
    setEquipe(null);
    setUsuario(null);
    setTab('escala');
    window.location.hash = '';
  };

  const handleUpdateUsuario = (updates) => setUsuario((u) => ({ ...u, ...updates }));

  /* ── Renders condicionais ── */
  if (authLoading) return <SplashScreen msg="Verificando sessão..." />;
  if (recuperandoSenha) return (
    <RedefinirSenhaScreen
      onToast={showToast}
      onConcluido={() => { setRecuperandoSenha(false); setUsuario(null); }}
    />
  );
  if (!usuario)   return <LoginScreen />;
  if (state.carregando) return <SplashScreen msg="Carregando dados..." />;
  if (!equipe) return <SetupScreen onCriar={handleCriarEquipe} onEntrar={handleEntrarEquipe} usuario={usuario} onToast={showToast} onLogout={handleLogout} />;

  const screens = {
    escala:          <EscalaScreen state={state} dispatch={dispatch} usuario={usuario} equipe={equipe} onToast={showToast} onPerfilClick={() => setTab('perfil')} onExcluirEquipe={handleExcluirEquipe} onSairEquipe={handleSairEquipe} />,
    disponibilidade: <DisponibilidadeScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} equipe={equipe} />,
    membros:         <MembrosScreen state={state} dispatch={dispatch} usuario={usuario} equipe={equipe} onToast={showToast} />,
    perfil:          <PerfilScreen state={state} dispatch={dispatch} usuario={usuario} onToast={showToast} onLogout={handleLogout} onUpdateUsuario={handleUpdateUsuario} />,
    admin:           <AdminScreen state={state} dispatch={dispatch} usuario={usuario} equipe={equipe} onToast={showToast} onGerarEscala={handleGerarEscala} onAddCultoManual={handleAddCultoManual} />,
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
