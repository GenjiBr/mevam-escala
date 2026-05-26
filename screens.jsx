// MEVAM Escala — telas (Login, Escala, Disponibilidade, Membros, Admin)

const { useState, useMemo, useRef, useEffect } = React;

// ════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════
function LoginScreen() {
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'criar'
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');

  const handleEntrar = async () => {
    if (!email.trim()) { setErr('Informe seu e-mail'); return; }
    if (!senha) { setErr('Informe a senha'); return; }
    setLoading(true); setErr('');
    const { error } = await SB.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha });
    if (error) {
      const msgs = {
        'Invalid login credentials': 'E-mail ou senha incorretos.',
        'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
        'Too many requests': 'Muitas tentativas. Aguarde alguns minutos.',
      };
      setErr(msgs[error.message] || error.message);
    }
    setLoading(false);
  };

  const handleCriar = async () => {
    if (!nome.trim()) { setErr('Informe seu nome completo'); return; }
    if (!email.trim()) { setErr('Informe seu e-mail'); return; }
    if (senha.length < 6) { setErr('Senha mínima de 6 caracteres'); return; }
    setLoading(true); setErr('');
    const { error } = await SB.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: { data: { nome: nome.trim() } },
    });
    if (error) {
      setErr(error.message);
    } else {
      setInfo('Conta criada! Verifique seu e-mail para confirmar. Se não chegou, cheque a pasta de spam.');
      setModo('entrar');
      setSenha('');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      padding: '60px 22px calc(24px + env(safe-area-inset-bottom))', position: 'relative',
      background: `radial-gradient(120% 70% at 50% 0%, rgba(91,127,255,0.22) 0%, rgba(4,8,26,0) 55%), ${MEVAM_COLORS.bgDeep}`,
    }}>
      {/* aurora glow */}
      <div style={{
        position: 'absolute', top: -120, left: -80, right: -80, height: 360,
        background: 'radial-gradient(50% 60% at 50% 50%, rgba(91,127,255,0.45) 0%, rgba(4,8,26,0) 70%)',
        filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 10, position: 'relative' }}>
        <img src="assets/mevam-logo.png" alt="MEVAM" style={{
          width: 168, mixBlendMode: 'screen',
          filter: 'drop-shadow(0 6px 24px rgba(91,127,255,0.5))',
        }} />
      </div>

      {/* hero */}
      <div style={{ marginTop: 26, textAlign: 'center', position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: 'rgba(91,127,255,0.14)', border: '1px solid rgba(91,127,255,0.35)',
          fontFamily: 'Manrope', fontSize: 11.5, fontWeight: 600, color: '#A8BBFF',
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>
          <Icon name="sparkles" size={13} /> Escala de Louvor e Mídia
        </div>
        <h1 style={{
          margin: '20px 0 10px',
          fontFamily: '"Bricolage Grotesque", "Manrope", sans-serif',
          fontWeight: 600, fontSize: 36, lineHeight: 1.02,
          color: MEVAM_COLORS.text, letterSpacing: -1,
        }}>
          Amar, servir, <span style={{
            background: 'linear-gradient(90deg, #FFFFFF, #8FA8FF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>edificar</span>
        </h1>
        <p style={{ margin: 0, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 14, lineHeight: 1.5 }}>
          Organize a equipe, evite conflitos<br/>e prepare cada culto com clareza.
        </p>
      </div>

      {/* form */}
      <div style={{ marginTop: 28, position: 'relative' }}>

        {/* toggle entrar / criar conta */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <SegBtn active={modo === 'entrar'} onClick={() => { setModo('entrar'); setErr(''); setInfo(''); }} icon={<Icon name="person" size={14}/>}>Entrar</SegBtn>
          <SegBtn active={modo === 'criar'}  onClick={() => { setModo('criar');  setErr(''); setInfo(''); }} icon={<Icon name="plus"   size={14}/>}>Criar conta</SegBtn>
        </div>

        <Card glow accent={MEVAM_COLORS.accent} style={{ padding: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {modo === 'criar' && (
              <Field label="Nome completo">
                <input value={nome} onChange={(e) => { setNome(e.target.value); setErr(''); }}
                  placeholder="Seu nome completo" style={inputStyle} autoComplete="name" />
              </Field>
            )}

            <Field label="E-mail">
              <input value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }}
                placeholder="seu@email.com" type="email" inputMode="email"
                style={inputStyle} autoCapitalize="none" autoComplete="email" />
            </Field>

            <Field label="Senha">
              <input value={senha} onChange={(e) => { setSenha(e.target.value); setErr(''); }}
                placeholder={modo === 'criar' ? 'Mínimo 6 caracteres' : '••••••••'}
                type="password" style={inputStyle}
                autoComplete={modo === 'criar' ? 'new-password' : 'current-password'}
                onKeyDown={(e) => e.key === 'Enter' && (modo === 'entrar' ? handleEntrar() : handleCriar())} />
            </Field>

            {err  && <div style={{ color: MEVAM_COLORS.danger, fontSize: 12.5, fontFamily: 'Manrope', lineHeight: 1.4 }}>{err}</div>}
            {info && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: MEVAM_COLORS.ok + '18', border: `1px solid ${MEVAM_COLORS.ok}44` }}>
                <Icon name="check" size={14} />
                <div style={{ color: MEVAM_COLORS.ok, fontSize: 12.5, fontFamily: 'Manrope', lineHeight: 1.4 }}>{info}</div>
              </div>
            )}

            <Btn variant="accent" full
              onClick={modo === 'entrar' ? handleEntrar : handleCriar}
              disabled={loading}
              style={{ marginTop: 2 }}>
              {loading ? 'Aguarde...' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px', borderRadius: 12,
  background: 'rgba(0,0,0,0.35)', border: `1px solid ${MEVAM_COLORS.border}`,
  color: MEVAM_COLORS.text, fontFamily: 'Manrope', fontSize: 16, fontWeight: 500,
  outline: 'none',
  /* fontSize 16px previne zoom automático no iOS */
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Manrope' }}>{label}</span>
      {children}
    </label>
  );
}
function SegBtn({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px 8px', borderRadius: 10,
      background: active ? MEVAM_COLORS.accentSoft : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? MEVAM_COLORS.accent + '88' : MEVAM_COLORS.border}`,
      color: active ? '#A8BBFF' : MEVAM_COLORS.muted,
      fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      cursor: 'pointer',
    }}>{icon}{children}</button>
  );
}
function DemoChip({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 10px', borderRadius: 10,
      background: 'rgba(255,255,255,0.03)', border: `1px dashed ${MEVAM_COLORS.border}`,
      color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 11.5, fontWeight: 500,
      cursor: 'pointer',
    }}>{children}</button>
  );
}

// ════════════════════════════════════════════════════════════
// ESCALA (home)
// ════════════════════════════════════════════════════════════
function EscalaScreen({ state, dispatch, usuario, onShare, onToast, onPerfilClick }) {
  const cultos = useMemo(() => {
    return [...state.cultos].sort((a, b) => a.data.localeCompare(b.data));
  }, [state.cultos]);

  const meuProximo = useMemo(() => {
    return cultos.find((c) => Object.values(c.escalados).flat().includes(usuario.id));
  }, [cultos, usuario.id]);

  const membro = state.membros.find((m) => m.id === usuario.id);

  return (
    <div style={screenWrap}>
      <Header membro={membro} usuario={usuario} onPerfilClick={onPerfilClick}>
        <Btn variant="ghost" icon={<Icon name="share" size={14}/>} onClick={onShare} style={{ padding: '8px 12px', fontSize: 12 }}>Compartilhar</Btn>
      </Header>

      {/* Lembrete da próxima escala do usuário */}
      {meuProximo && (
        <div style={{ padding: '10px 18px 0' }}>
          <LembreteEscala culto={meuProximo} usuarioId={usuario.id} state={state} />
        </div>
      )}

      {/* Filtro mês + stat */}
      <div style={{ padding: '20px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 22, color: MEVAM_COLORS.text, letterSpacing: -0.4 }}>
          Próximos cultos
        </div>
        <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 500 }}>
          {cultos.length} agendados
        </div>
      </div>

      {/* Lista de cultos */}
      <div style={{ padding: '4px 18px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cultos.map((c) => (
          <CultoCard key={c.id} culto={c} state={state} usuarioId={usuario.id} />
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Lembrete da próxima escala do membro
// ────────────────────────────────────────────────────────────
function LembreteEscala({ culto, usuarioId, state }) {
  // dias até o culto
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const [y, mo, d] = culto.data.split('-').map(Number);
  const dataServico = new Date(y, mo - 1, d);
  const diff = Math.round((dataServico - hoje) / (1000 * 60 * 60 * 24));

  // funções do usuário neste culto
  const minhasFuncoes = [];
  for (const [fid, val] of Object.entries(culto.escalados)) {
    if (Array.isArray(val)) { if (val.includes(usuarioId)) minhasFuncoes.push(fid); }
    else if (val === usuarioId) minhasFuncoes.push(fid);
  }

  const data = formatBRDate(culto.data);

  // urgência → cor e texto
  let cor, textoTopo, emoji;
  if (diff === 0)        { cor = '#EF4444'; textoTopo = 'Hoje é o dia!'; emoji = '🔥'; }
  else if (diff === 1)   { cor = '#F39C12'; textoTopo = 'Amanhã você serve!'; emoji = '⚡'; }
  else if (diff <= 3)    { cor = '#F39C12'; textoTopo = `Faltam ${diff} dias`; emoji = '⏰'; }
  else if (diff <= 7)    { cor = '#5B7FFF'; textoTopo = `Faltam ${diff} dias`; emoji = '🔔'; }
  else                   { cor = '#5B7FFF'; textoTopo = `Em ${diff} dias`; emoji = '📅'; }

  return (
    <div style={{
      borderRadius: 18,
      background: `linear-gradient(135deg, ${cor}1A 0%, ${cor}08 100%)`,
      border: `1px solid ${cor}55`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* barra lateral colorida */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: cor, boxShadow: `0 0 18px ${cor}88` }} />

      <div style={{ padding: '14px 16px 14px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>

        {/* ícone contagem regressiva */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: cor + '22', border: `1px solid ${cor}44`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 0,
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
          {diff > 1 && (
            <>
              <span style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, fontSize: 15, color: cor, lineHeight: 1.1 }}>{diff}</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 8.5, color: cor + 'CC', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>dias</span>
            </>
          )}
        </div>

        {/* conteúdo */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 10.5, fontWeight: 700, color: cor, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 3 }}>
            🔔 Lembrete · {textoTopo}
          </div>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 16, color: MEVAM_COLORS.text, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {culto.titulo}
          </div>
          <div style={{ fontFamily: 'Manrope', fontSize: 12, color: MEVAM_COLORS.muted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="calendar" size={11}/> {data.diaSemana}, {data.dia} {data.mes} · {culto.horario}
            </span>
          </div>
          {minhasFuncoes.length > 0 && (
            <div style={{ marginTop: 6, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {minhasFuncoes.map((fid) => <FuncBadge key={fid} funcId={fid} size="sm" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Header({ membro, usuario, onPerfilClick, children }) {
  // nome real do perfil salvo; fallback para o nome de login
  const primeiroNome = (membro?.nome || usuario.nome || '').split(' ')[0];
  const iniciais = (membro?.nome || usuario.nome || '??').trim().split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{
      padding: '14px 18px 4px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* avatar clicável → aba Perfil */}
      <button onClick={onPerfilClick} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', padding: 0,
        cursor: onPerfilClick ? 'pointer' : 'default', textAlign: 'left',
      }}>
        <Avatar iniciais={iniciais} tom={membro?.tom || MEVAM_COLORS.accent} size={38} foto={membro?.foto} />
        <div>
          <div style={{ fontSize: 10.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', lineHeight: 1 }}>Olá,</div>
          <div style={{ fontSize: 14, color: MEVAM_COLORS.text, fontFamily: 'Manrope', fontWeight: 700, marginTop: 2 }}>{primeiroNome}</div>
        </div>
      </button>
      {children}
    </div>
  );
}

function CultoHeroCard({ culto, usuarioId, state }) {
  const data = formatBRDate(culto.data);
  const minhasFuncoes = [];
  for (const [fid, val] of Object.entries(culto.escalados)) {
    if (Array.isArray(val)) { if (val.includes(usuarioId)) minhasFuncoes.push(fid); }
    else if (val === usuarioId) minhasFuncoes.push(fid);
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* glow */}
      <div style={{
        position: 'absolute', inset: -2, borderRadius: 22,
        background: `linear-gradient(135deg, ${culto.cor}55, transparent 60%)`,
        filter: 'blur(20px)', opacity: 0.7, zIndex: 0,
      }} />
      <Card accent={culto.cor} glow style={{ position: 'relative', zIndex: 1, padding: 18 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 60, padding: '8px 0', borderRadius: 12,
            background: 'rgba(0,0,0,0.35)', border: `1px solid ${MEVAM_COLORS.border}`,
            textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: 10, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{data.diaSemana}</div>
            <div style={{ fontSize: 26, color: MEVAM_COLORS.text, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, lineHeight: 1 }}>{data.dia}</div>
            <div style={{ fontSize: 10, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{data.mes}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 18, color: MEVAM_COLORS.text, lineHeight: 1.15, letterSpacing: -0.3 }}>
              {culto.titulo}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 12 }}>
              <Icon name="clock" size={12} /> {culto.horario}
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {minhasFuncoes.map((f) => <FuncBadge key={f} funcId={f} size="md" />)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CultoCard({ culto, state, usuarioId }) {
  const [open, setOpen] = useState(false);
  const data = formatBRDate(culto.data);
  const indispoIds = (state.indispo[culto.data] || []).map((i) => i.membroId);

  // verificar coberturas + conflitos
  const cobertura = [];
  let conflitos = 0;
  for (const [fid, val] of Object.entries(culto.escalados)) {
    const ids = Array.isArray(val) ? val : (val ? [val] : []);
    for (const id of ids) {
      const m = state.membros.find((x) => x.id === id);
      if (!m) continue;
      const indispo = indispoIds.includes(id);
      if (indispo) conflitos++;
      cobertura.push({ funcId: fid, membro: m, indispo });
    }
    if (ids.length === 0) cobertura.push({ funcId: fid, membro: null, indispo: false });
  }

  const slotsVazios = cobertura.filter((x) => !x.membro).length;
  const meu = cobertura.some((x) => x.membro && x.membro.id === usuarioId);

  return (
    <Card accent={culto.cor} style={{ padding: 0 }}>
      <div onClick={() => setOpen((v) => !v)} style={{ padding: 16, cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{
          width: 48, padding: '6px 0', borderRadius: 10,
          background: 'rgba(0,0,0,0.35)', border: `1px solid ${MEVAM_COLORS.border}`,
          textAlign: 'center', flexShrink: 0,
        }}>
          <div style={{ fontSize: 9, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase' }}>{data.diaSemana}</div>
          <div style={{ fontSize: 20, color: MEVAM_COLORS.text, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, lineHeight: 1 }}>{data.dia}</div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: MEVAM_COLORS.text }}>{culto.titulo}</span>
            {meu && <span style={{ fontSize: 9.5, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.accent, background: MEVAM_COLORS.accentSoft, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>Você</span>}
          </div>
          <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2 }}>{culto.horario} · {cobertura.filter(x => x.membro).length} escalados</div>
          {/* dots de funções */}
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cobertura.filter(x => x.membro).slice(0, 11).map((x, i) => (
              <FuncDot key={i} funcId={x.funcId} size={7} />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {conflitos > 0 && (
            <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.danger, background: MEVAM_COLORS.dangerSoft, padding: '3px 7px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="alert" size={10}/> {conflitos}
            </span>
          )}
          {slotsVazios > 0 && conflitos === 0 && (
            <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: '#F39C12', background: 'rgba(243,156,18,0.14)', padding: '3px 7px', borderRadius: 6 }}>{slotsVazios} vazio</span>
          )}
          <span style={{ color: MEVAM_COLORS.mutedSoft, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }}>
            <Icon name="chevron" size={14}/>
          </span>
        </div>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${MEVAM_COLORS.border}`, padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cobertura.map((x, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {x.membro ? (
                <Avatar iniciais={x.membro.iniciais} tom={x.membro.tom} size={30} foto={x.membro.foto} />
              ) : (
                <div style={{ width: 30, height: 30, borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px dashed ${MEVAM_COLORS.borderHi}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MEVAM_COLORS.mutedSoft }}>
                  <Icon name="plus" size={14}/>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Manrope', fontSize: 13, color: x.membro ? MEVAM_COLORS.text : MEVAM_COLORS.mutedSoft, fontWeight: 600 }}>
                    {x.membro ? x.membro.nome : 'Slot vazio'}
                  </span>
                  {x.indispo && <Icon name="ban" size={12}/>}
                </div>
                <div style={{ marginTop: 2 }}><FuncBadge funcId={x.funcId}/></div>
              </div>
              {x.indispo && (
                <span style={{ fontSize: 9.5, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.danger, background: MEVAM_COLORS.dangerSoft, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>Conflito</span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════
// DISPONIBILIDADE
// ════════════════════════════════════════════════════════════
function DisponibilidadeScreen({ state, dispatch, usuario, onToast }) {
  const isAdmin = usuario.perfil === 'admin';

  // ── Visão membro (somente leitura) ──────────────────────
  if (!isAdmin) {
    const minhasBloqueadas = Object.entries(state.indispo)
      .filter(([, list]) => list.some((i) => i.membroId === usuario.id))
      .map(([iso]) => iso).sort();
    return (
      <div style={screenWrap}>
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '5px 10px', borderRadius: 999, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}33`, fontSize: 11, color: '#A8BBFF', fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            <Icon name="ban" size={12}/> Indisponibilidade
          </div>
          <h2 style={{ margin: '14px 0 6px', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 24, color: MEVAM_COLORS.text, letterSpacing: -0.5, lineHeight: 1.15 }}>
            Suas datas bloqueadas
          </h2>
          <Card style={{ padding: 14, marginTop: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: MEVAM_COLORS.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
                <Icon name="shield" size={17}/>
              </div>
              <div>
                <div style={{ fontSize: 13, fontFamily: 'Manrope', color: MEVAM_COLORS.text, fontWeight: 600 }}>Gerenciado pelo administrador</div>
                <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2 }}>Fale com o admin para registrar ou alterar indisponibilidades.</div>
              </div>
            </div>
          </Card>
        </div>
        <div style={{ padding: '18px 18px 28px' }}>
          {minhasBloqueadas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 12px', color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13 }}>Nenhuma data bloqueada para você.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {minhasBloqueadas.map((iso) => {
                const d = formatBRDate(iso);
                const entry = state.indispo[iso].find((i) => i.membroId === usuario.id);
                return (
                  <div key={iso} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}` }}>
                    <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 9, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase' }}>{d.diaSemana}</div>
                      <div style={{ fontSize: 20, color: MEVAM_COLORS.text, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, lineHeight: 1 }}>{d.dia}</div>
                      <div style={{ fontSize: 9, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase' }}>{d.mes}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontFamily: 'Manrope', color: MEVAM_COLORS.text, fontWeight: 600 }}>{d.diaSemana}, {d.dia} de {d.mes}</div>
                      <div style={{ fontSize: 11.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', marginTop: 2 }}>{entry?.motivo || 'Sem motivo'}</div>
                    </div>
                    {entry?.lembrete && (
                      <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: '#F39C12', background: 'rgba(243,156,18,0.14)', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>🔔 Lembrete</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Visão admin ──────────────────────────────────────────
  return <AdminDisponibilidadeView state={state} dispatch={dispatch} usuario={usuario} onToast={onToast} />;
}

function AdminDisponibilidadeView({ state, dispatch, usuario, onToast }) {
  const [membroSel, setMembroSel] = useState(null);
  const [datas, setDatas] = useState(new Set());
  const [motivo, setMotivo] = useState('');
  const [lembrete, setLembrete] = useState(false);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  const membrosAtivos = state.membros.filter((m) => m.status === 'ativo');

  const bloqueadasMembro = useMemo(() => {
    if (!membroSel) return new Set();
    const s = new Set();
    for (const [iso, list] of Object.entries(state.indispo)) {
      if (list.some((i) => i.membroId === membroSel)) s.add(iso);
    }
    return s;
  }, [state.indispo, membroSel]);

  const toggle = (iso) => {
    if (!membroSel) { onToast('Selecione um membro primeiro', 'warn'); return; }
    const s = new Set(datas);
    if (s.has(iso)) s.delete(iso); else s.add(iso);
    setDatas(s);
  };

  const salvar = () => {
    if (!membroSel) { onToast('Selecione um membro', 'warn'); return; }
    if (datas.size === 0) { onToast('Selecione ao menos uma data', 'warn'); return; }
    dispatch({ type: 'add_indispo', usuarioId: membroSel, datas: [...datas], motivo, lembrete });
    const m = state.membros.find((x) => x.id === membroSel);
    const nome = m?.nome?.split(' ')[0] || 'Membro';
    onToast(`${datas.size} data(s) registrada(s) para ${nome}${lembrete ? ' · 🔔 lembrete criado' : ''}`, 'ok');
    setDatas(new Set()); setMotivo(''); setLembrete(false);
  };

  const mSel = state.membros.find((x) => x.id === membroSel);

  return (
    <div style={screenWrap}>
      {/* cabeçalho */}
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '5px 10px', borderRadius: 999, background: MEVAM_COLORS.dangerSoft, border: `1px solid ${MEVAM_COLORS.danger}33`, fontSize: 11, color: MEVAM_COLORS.danger, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          <Icon name="ban" size={12}/> Indisponibilidade
        </div>
        <h2 style={{ margin: '12px 0 4px', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 24, color: MEVAM_COLORS.text, letterSpacing: -0.5, lineHeight: 1.15 }}>
          Registrar indisponibilidade
        </h2>
        <p style={{ margin: 0, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13, lineHeight: 1.5 }}>
          Selecione o membro e os dias em que não poderá servir.
        </p>
      </div>

      {/* seletor de membro */}
      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Membro</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {membrosAtivos.map((m) => {
            const ativo = membroSel === m.id;
            return (
              <button key={m.id} onClick={() => { setMembroSel(m.id); setDatas(new Set()); }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 12px', borderRadius: 14, flexShrink: 0, cursor: 'pointer', background: ativo ? m.tom + '22' : MEVAM_COLORS.card, border: `1.5px solid ${ativo ? m.tom : MEVAM_COLORS.border}`, transition: 'all .15s', minWidth: 64 }}>
                <Avatar iniciais={m.iniciais} tom={m.tom} size={36} ring={ativo} foto={m.foto} />
                <span style={{ fontSize: 10.5, fontFamily: 'Manrope', fontWeight: 600, color: ativo ? m.tom : MEVAM_COLORS.muted, whiteSpace: 'nowrap' }}>{m.nome.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* calendário */}
      <div style={{ padding: '16px 18px 0' }}>
        {!membroSel ? (
          <Card style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13 }}>👆 Selecione um membro acima para ver o calendário</div>
          </Card>
        ) : (
          <Calendar cursor={cursor} setCursor={setCursor} selected={datas} onToggle={toggle} alreadyBlocked={bloqueadasMembro} state={state} />
        )}
      </div>

      {/* campos + lembrete */}
      <div style={{ padding: '16px 18px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Motivo (opcional)">
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: viagem, trabalho, formatura..."
            rows={2}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'Manrope' }} />
        </Field>

        {/* toggle lembrete */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, background: lembrete ? 'rgba(243,156,18,0.1)' : MEVAM_COLORS.card, border: `1px solid ${lembrete ? 'rgba(243,156,18,0.4)' : MEVAM_COLORS.border}`, transition: 'all .2s' }}>
          <div>
            <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              🔔 Criar lembrete
            </div>
            <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2 }}>
              {mSel ? `Alerta: ${mSel.nome.split(' ')[0]} não poderá servir` : 'Alerta visível para toda a equipe'}
            </div>
          </div>
          <button type="button" onClick={() => setLembrete((v) => !v)}
            style={{ appearance: 'none', width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, background: lembrete ? '#F39C12' : 'rgba(255,255,255,0.15)', transition: 'background .15s', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 3, left: lembrete ? 21 : 3, width: 20, height: 20, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left .15s' }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" onClick={() => { setDatas(new Set()); setMotivo(''); setLembrete(false); }}>Limpar</Btn>
          <Btn variant="accent" full onClick={salvar} icon={<Icon name="check" size={14}/>}>
            Salvar {datas.size > 0 && `(${datas.size})`}
          </Btn>
        </div>

        {/* datas bloqueadas do membro selecionado */}
        {membroSel && bloqueadasMembro.size > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
              Bloqueadas para {mSel?.nome?.split(' ')[0]} ({bloqueadasMembro.size})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...bloqueadasMembro].sort().map((iso) => {
                const d = formatBRDate(iso);
                const entry = state.indispo[iso]?.find((i) => i.membroId === membroSel);
                return (
                  <div key={iso} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}` }}>
                    <div style={{ width: 38, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 9, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase' }}>{d.diaSemana}</div>
                      <div style={{ fontSize: 19, color: MEVAM_COLORS.text, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, lineHeight: 1 }}>{d.dia}</div>
                      <div style={{ fontSize: 9, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase' }}>{d.mes}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontFamily: 'Manrope', color: MEVAM_COLORS.text, fontWeight: 600 }}>{d.diaSemana}, {d.dia} de {d.mes}</div>
                      <div style={{ fontSize: 11, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', marginTop: 1 }}>{entry?.motivo || 'Sem motivo'}</div>
                    </div>
                    {entry?.lembrete && (
                      <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: '#F39C12', background: 'rgba(243,156,18,0.14)', padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>🔔</span>
                    )}
                    <button onClick={() => dispatch({ type: 'remove_indispo', usuarioId: membroSel, iso })}
                      style={{ background: 'transparent', border: 'none', color: MEVAM_COLORS.mutedSoft, cursor: 'pointer', padding: 6, flexShrink: 0 }}>
                      <Icon name="ban" size={14}/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Calendar({ cursor, setCursor, selected, onToggle, alreadyBlocked, state }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = first.getDay();
  const days = last.getDate();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dows = ['D','S','T','Q','Q','S','S'];

  // cultos do mês para mostrar dot
  const cultosNoMes = useMemo(() => {
    const map = {};
    state.cultos.forEach((c) => {
      const [y, m, d] = c.data.split('-').map(Number);
      if (y === year && m - 1 === month) {
        if (!map[d]) map[d] = [];
        Object.entries(c.escalados).forEach(([fid, val]) => {
          if (Array.isArray(val)) val.forEach((id) => id && map[d].push(fid));
          else if (val) map[d].push(fid);
        });
      }
    });
    return map;
  }, [state.cultos, year, month]);

  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={{ ...navBtn, transform: 'scaleX(-1)' }}>
          <Icon name="chevron" size={14} />
        </button>
        <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 16, color: MEVAM_COLORS.text, textTransform: 'capitalize', letterSpacing: -0.2 }}>
          {meses[month]} {year}
        </div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={navBtn}>
          <Icon name="chevron" size={14} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {dows.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.4 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} style={{ aspectRatio: '1', }} />;
          const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isSel = selected && selected.has(iso);
          const isBlocked = alreadyBlocked && alreadyBlocked.has(iso);
          const today = iso === HOJE_ISO;
          const culto = cultosNoMes[d];

          return (
            <button key={i} onClick={() => onToggle && onToggle(iso)} style={{
              aspectRatio: '1', borderRadius: 10,
              background: isSel ? MEVAM_COLORS.danger : isBlocked ? MEVAM_COLORS.dangerSoft : 'rgba(255,255,255,0.02)',
              border: `1px solid ${today ? MEVAM_COLORS.accent : isSel ? MEVAM_COLORS.danger : isBlocked ? MEVAM_COLORS.danger+'66' : MEVAM_COLORS.border}`,
              color: isSel ? '#fff' : isBlocked ? '#FF8585' : MEVAM_COLORS.text,
              fontFamily: 'Manrope', fontWeight: today ? 700 : 500, fontSize: 12.5,
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 0, position: 'relative',
            }}>
              {d}
              {culto && !isSel && !isBlocked && (
                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  {[...new Set(culto)].slice(0, 3).map((fid, k) => <FuncDot key={k} funcId={fid} size={4} />)}
                </div>
              )}
              {(isSel || isBlocked) && <Icon name="ban" size={10}/>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

const navBtn = { width: 30, height: 30, borderRadius: 8, background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, color: MEVAM_COLORS.text, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

// ════════════════════════════════════════════════════════════
// MEMBROS
// ════════════════════════════════════════════════════════════
function MembrosScreen({ state, dispatch, usuario, onToast }) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);

  const filtrados = state.membros.filter((m) => {
    if (filtro !== 'todos' && m.func !== filtro && !m.secundarias.includes(filtro)) return false;
    if (busca && !m.nome.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={screenWrap}>
      <div style={{ padding: '14px 18px 0' }}>
        <h2 style={{ margin: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 26, color: MEVAM_COLORS.text, letterSpacing: -0.6 }}>
          Equipe
        </h2>
        <div style={{ color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13, marginTop: 2 }}>
          {state.membros.filter((m) => m.status === 'ativo').length} ativos · {state.membros.length} no total
        </div>
      </div>

      {/* busca */}
      <div style={{ padding: '14px 18px 0', position: 'relative' }}>
        <span style={{ position: 'absolute', left: 30, top: '50%', transform: 'translateY(-50%)', color: MEVAM_COLORS.mutedSoft }}>
          <Icon name="search" size={15}/>
        </span>
        <input value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar nome..."
          style={{ ...inputStyle, paddingLeft: 38 }} />
      </div>

      {/* filtros funções */}
      <div style={{ padding: '12px 18px 0', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <Chip active={filtro === 'todos'} onClick={() => setFiltro('todos')}>Todos</Chip>
        {Object.entries(window.FUNCOES).map(([fid, f]) => (
          <Chip key={fid} active={filtro === fid} onClick={() => setFiltro(fid)} color={f.color}>
            <FuncDot funcId={fid} size={6}/> {f.label}
          </Chip>
        ))}
      </div>

      {/* lista */}
      <div style={{ padding: '14px 18px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtrados.map((m) => (
          <MembroCard key={m.id} membro={m} state={state} onClick={() => setSelecionado(m)} self={m.id === usuario.id} isAdmin={usuario.perfil === 'admin'} />
        ))}
        {filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 12px', color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13 }}>
            Nenhum membro encontrado.
          </div>
        )}
      </div>

      {selecionado && <MembroDetail membro={selecionado} state={state} dispatch={dispatch} usuario={usuario} onToast={onToast} onClose={() => setSelecionado(null)} />}
    </div>
  );
}

function MembroCard({ membro, state, onClick, self, isAdmin }) {
  const totalCultos = state.cultos.filter((c) => Object.values(c.escalados).flat().includes(membro.id)).length;
  return (
    <Card accent={membro.tom} onClick={onClick} style={{ padding: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Avatar iniciais={membro.iniciais} tom={membro.tom} size={44} foto={membro.foto} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14.5, color: MEVAM_COLORS.text }}>{membro.nome}</span>
            {self && <span style={{ fontSize: 9.5, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.accent, background: MEVAM_COLORS.accentSoft, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>Eu</span>}
            {membro.status !== 'ativo' && (
              <span style={{ fontSize: 9.5, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.mutedSoft, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>{membro.status}</span>
            )}
          </div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <FuncBadge funcId={membro.func} />
            {membro.secundarias.slice(0, 2).map((f) => <FuncBadge key={f} funcId={f} />)}
          </div>
        </div>
        {isAdmin && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 18, color: MEVAM_COLORS.text, lineHeight: 1 }}>{totalCultos}</div>
            <div style={{ fontSize: 9.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>cultos</div>
          </div>
        )}
      </div>
    </Card>
  );
}

function MembroDetail({ membro, state, dispatch, usuario, onToast, onClose }) {
  const isOwn = membro.id === usuario.id;
  const [editando, setEditando] = useState(false);
  const [funcPrincipal, setFuncPrincipal] = useState(membro.func);
  const [funcsSecundarias, setFuncsSecundarias] = useState(membro.secundarias || []);

  const cultos = state.cultos.filter((c) => Object.values(c.escalados).flat().includes(membro.id));
  const todasFuncoes = Object.entries(window.FUNCOES);

  const toggleSecundaria = (fid) => {
    if (fid === funcPrincipal) return;
    setFuncsSecundarias((prev) =>
      prev.includes(fid) ? prev.filter((f) => f !== fid) : [...prev, fid]
    );
  };

  const salvar = () => {
    const secundariasLimpas = funcsSecundarias.filter((f) => f !== funcPrincipal);
    dispatch({ type: 'update_membro', id: membro.id, updates: { func: funcPrincipal, secundarias: secundariasLimpas } });
    onToast('Funções atualizadas!', 'ok');
    setEditando(false);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
      zIndex: 90, display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn .2s',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, margin: '0 auto',
        background: '#0A1326', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 20px 40px', border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none',
        animation: 'slideUp .3s cubic-bezier(.2,.9,.3,1.1)',
        maxHeight: '90dvh', overflowY: 'auto',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />

        {/* cabeçalho */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar iniciais={membro.iniciais} tom={membro.tom} size={60} ring foto={membro.foto} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 22, color: MEVAM_COLORS.text, letterSpacing: -0.3 }}>{membro.nome}</div>
            <div style={{ marginTop: 6 }}><FuncBadge funcId={membro.func} size="md"/></div>
          </div>
          {isOwn && !editando && (
            <button onClick={() => setEditando(true)} style={{ background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}55`, color: '#A8BBFF', borderRadius: 10, padding: '8px 14px', fontFamily: 'Manrope', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="edit" size={13}/> Editar
            </button>
          )}
        </div>

        {/* editor de funções */}
        {isOwn && editando ? (
          <div style={{ marginTop: 22 }}>
            {/* função principal */}
            <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
              Função principal <span style={{ color: MEVAM_COLORS.accent }}>(selecione uma)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {todasFuncoes.map(([fid, f]) => {
                const ativo = funcPrincipal === fid;
                return (
                  <button key={fid} onClick={() => { setFuncPrincipal(fid); setFuncsSecundarias((s) => s.filter((x) => x !== fid)); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Manrope', fontSize: 12, fontWeight: 600, transition: 'all .15s', background: ativo ? f.color + '28' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${ativo ? f.color : MEVAM_COLORS.border}`, color: ativo ? f.color : MEVAM_COLORS.muted }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: ativo ? f.color : MEVAM_COLORS.border, boxShadow: ativo ? `0 0 6px ${f.color}` : 'none', flexShrink: 0 }} />
                    {f.label}
                    {ativo && <span style={{ fontSize: 10 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* funções secundárias */}
            <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
              Funções secundárias <span style={{ color: MEVAM_COLORS.mutedSoft, textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(pode marcar várias)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {todasFuncoes.filter(([fid]) => fid !== funcPrincipal).map(([fid, f]) => {
                const ativo = funcsSecundarias.includes(fid);
                return (
                  <button key={fid} onClick={() => toggleSecundaria(fid)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Manrope', fontSize: 12, fontWeight: 600, transition: 'all .15s', background: ativo ? f.color + '20' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${ativo ? f.color + 'AA' : MEVAM_COLORS.border}`, color: ativo ? f.color : MEVAM_COLORS.muted }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: ativo ? f.color : MEVAM_COLORS.border, flexShrink: 0 }} />
                    {f.label}
                    {ativo && <span style={{ fontSize: 10 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="ghost" onClick={() => { setEditando(false); setFuncPrincipal(membro.func); setFuncsSecundarias(membro.secundarias || []); }}>Cancelar</Btn>
              <Btn variant="accent" full icon={<Icon name="check" size={14}/>} onClick={salvar}>Salvar funções</Btn>
            </div>
          </div>
        ) : (
          <>
            {/* funções secundárias (leitura) */}
            {membro.secundarias.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ fontSize: 10.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Funções secundárias</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {membro.secundarias.map((f) => <FuncBadge key={f} funcId={f}/>)}
                </div>
              </div>
            )}

            {/* próximas escalas */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 10.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Próximas escalas ({cultos.length})</div>
              {cultos.length === 0 ? (
                <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13, padding: '12px 0' }}>Não há escalas registradas.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cultos.map((c) => {
                    const d = formatBRDate(c.data);
                    return (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: MEVAM_COLORS.card, borderRadius: 10, fontFamily: 'Manrope', fontSize: 13 }}>
                        <span style={{ color: MEVAM_COLORS.text, fontWeight: 600 }}>{c.titulo}</span>
                        <span style={{ color: MEVAM_COLORS.muted }}>{d.diaSemana}, {d.dia} {d.mes}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════════════════════════
function AdminScreen({ state, dispatch, usuario, onToast, onGerarEscala }) {
  if (usuario.perfil !== 'admin') {
    return (
      <div style={screenWrap}>
        <div style={{ padding: '60px 30px', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999, margin: '0 auto 18px',
            background: MEVAM_COLORS.dangerSoft, border: `1px solid ${MEVAM_COLORS.danger}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: MEVAM_COLORS.danger,
          }}>
            <Icon name="shield" size={24}/>
          </div>
          <h3 style={{ margin: 0, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 20, color: MEVAM_COLORS.text }}>Acesso restrito</h3>
          <p style={{ color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13, marginTop: 6 }}>
            Apenas administradores podem acessar o painel.
          </p>
        </div>
      </div>
    );
  }

  // métricas
  const ativos = state.membros.filter((m) => m.status === 'ativo').length;
  let conflitos = 0; let vazios = 0;
  state.cultos.forEach((c) => {
    const indispoIds = (state.indispo[c.data] || []).map((i) => i.membroId);
    Object.entries(c.escalados).forEach(([_, val]) => {
      const ids = Array.isArray(val) ? val : (val ? [val] : []);
      if (ids.length === 0) vazios++;
      ids.forEach((id) => { if (indispoIds.includes(id)) conflitos++; });
    });
  });

  const conflitosLista = [];
  state.cultos.forEach((c) => {
    const indispoIds = (state.indispo[c.data] || []).map((i) => i.membroId);
    Object.entries(c.escalados).forEach(([fid, val]) => {
      const ids = Array.isArray(val) ? val : (val ? [val] : []);
      ids.forEach((id) => {
        if (indispoIds.includes(id)) {
          const m = state.membros.find((x) => x.id === id);
          conflitosLista.push({ culto: c, membro: m, fid });
        }
      });
    });
  });

  return (
    <div style={screenWrap}>
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '5px 10px', borderRadius: 999, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}44`, fontSize: 11, color: '#A8BBFF', fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          <Icon name="shield" size={12}/> Painel do administrador
        </div>
        <h2 style={{ margin: '12px 0 4px', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 26, color: MEVAM_COLORS.text, letterSpacing: -0.6 }}>
          Visão geral
        </h2>
      </div>

      {/* stats grid */}
      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Stat label="Membros ativos" value={ativos} accent={MEVAM_COLORS.accent} sub={`${state.membros.length} total`} />
        <Stat label="Cultos agendados" value={state.cultos.length} accent="#7C5CFF" sub="próximas 2 semanas" />
        <Stat label="Conflitos" value={conflitos} accent={conflitos > 0 ? MEVAM_COLORS.danger : MEVAM_COLORS.ok} sub={conflitos > 0 ? 'requer revisão' : 'tudo limpo'} />
        <Stat label="Slots vazios" value={vazios} accent={vazios > 0 ? '#F39C12' : MEVAM_COLORS.ok} sub={vazios > 0 ? 'precisam cobertura' : 'completo'} />
      </div>

      {/* auto-gerador */}
      <div style={{ padding: '18px 18px 0' }}>
        <div style={{
          position: 'relative', borderRadius: 18, overflow: 'hidden',
          background: `linear-gradient(135deg, rgba(91,127,255,0.22), rgba(124,92,255,0.18) 60%, rgba(91,127,255,0.05))`,
          border: `1px solid ${MEVAM_COLORS.accent}55`, padding: 16,
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160,
            background: 'radial-gradient(circle, rgba(91,127,255,0.5), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(0,0,0,0.4)', border: `1px solid ${MEVAM_COLORS.accent}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF',
            }}>
              <Icon name="wand" size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 17, color: MEVAM_COLORS.text, letterSpacing: -0.3 }}>
                Gerar escala automática
              </div>
              <div style={{ color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 12.5, marginTop: 4, lineHeight: 1.45 }}>
                Distribui equilibrada respeitando indisponibilidades e funções obrigatórias.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <Btn variant="accent" full icon={<Icon name="sparkles" size={14}/>} onClick={() => {
              onGerarEscala && onGerarEscala();
            }}>Gerar agora</Btn>
            <Btn variant="ghost" icon={<Icon name="edit" size={14}/>} onClick={() => onToast('Edição manual: arraste membros no detalhe do culto', 'info')}>Editar</Btn>
          </div>
        </div>
      </div>

      {/* conflitos */}
      {conflitosLista.length > 0 && (
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="alert" size={12}/> Conflitos detectados ({conflitosLista.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {conflitosLista.slice(0, 4).map((cf, i) => {
              const d = formatBRDate(cf.culto.data);
              return (
                <Card key={i} accent={MEVAM_COLORS.danger} style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar iniciais={cf.membro?.iniciais || '?'} tom={cf.membro?.tom || '#666'} size={32} foto={cf.membro?.foto} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 600 }}>
                        {cf.membro?.nome} · indisponível
                      </div>
                      <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope' }}>
                        {cf.culto.titulo} · {d.diaSemana}, {d.dia} {d.mes}
                      </div>
                    </div>
                    <FuncBadge funcId={cf.fid}/>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* lembretes ativos */}
      {(() => {
        const lembretes = Object.entries(state.indispo).sort().flatMap(([iso, entries]) =>
          entries.filter((e) => e.lembrete).map((e) => ({ iso, ...e }))
        );
        if (lembretes.length === 0) return null;
        return (
          <div style={{ padding: '18px 18px 0' }}>
            <div style={{ fontSize: 11, color: '#F39C12', fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              🔔 Lembretes ativos ({lembretes.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lembretes.map((e, i) => {
                const m = state.membros.find((x) => x.id === e.membroId);
                const d = formatBRDate(e.iso);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'rgba(243,156,18,0.08)', border: '1px solid rgba(243,156,18,0.35)' }}>
                    <Avatar iniciais={m?.iniciais || '?'} tom={m?.tom} size={36} foto={m?.foto}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 700 }}>
                        {m?.nome} <span style={{ color: MEVAM_COLORS.danger, fontWeight: 600 }}>não poderá servir</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2 }}>
                        {d.diaSemana}, {d.dia} de {d.mes}{e.motivo ? ` · ${e.motivo}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: 18 }}>🔔</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* indisponibilidades registradas */}
      <div style={{ padding: '18px 18px 28px' }}>
        <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
          Indisponibilidades registradas
        </div>
        {Object.keys(state.indispo).length === 0 ? (
          <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13, textAlign: 'center', padding: 20 }}>
            Nenhuma indisponibilidade ainda.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(state.indispo).sort().slice(0, 8).flatMap(([iso, entries]) => entries.map((e, j) => {
              const m = state.membros.find((x) => x.id === e.membroId);
              const d = formatBRDate(iso);
              return (
                <div key={iso+j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: MEVAM_COLORS.card, borderRadius: 12, border: `1px solid ${MEVAM_COLORS.border}` }}>
                  <Avatar iniciais={m?.iniciais || '?'} tom={m?.tom} size={30} foto={m?.foto}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.text, fontWeight: 600 }}>{m?.nome}</div>
                    <div style={{ fontSize: 11, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', marginTop: 1 }}>{d.diaSemana} · {d.dia} {d.mes}{e.motivo ? ` · ${e.motivo}` : ''}</div>
                  </div>
                  {e.lembrete && <span style={{ fontSize: 14 }}>🔔</span>}
                </div>
              );
            }))}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// PERFIL
// ════════════════════════════════════════════════════════════
function PerfilScreen({ state, dispatch, usuario, onToast, onLogout, onUpdateUsuario }) {
  const membro = state.membros.find((m) => m.id === usuario.id) || {};
  const [nome, setNome] = useState(membro.nome || usuario.nome || '');
  const [funcPrincipal, setFuncPrincipal] = useState(membro.func || 'vocal_backing');
  const [funcsSecundarias, setFuncsSecundarias] = useState(membro.secundarias || []);
  const [tomSel, setTomSel] = useState(membro.tom || '#5B7FFF');
  const [foto, setFoto] = useState(membro.foto || null);
  const [salvando, setSalvando] = useState(false);
  const fileRef = useRef(null);

  // sincroniza quando state.membros carrega depois do render inicial
  useEffect(() => {
    if (membro.nome) { setNome(membro.nome); }
    if (membro.func) { setFuncPrincipal(membro.func); }
    if (membro.secundarias) { setFuncsSecundarias(membro.secundarias); }
    if (membro.tom) { setTomSel(membro.tom); }
    if (membro.foto !== undefined) { setFoto(membro.foto); }
  }, [membro.id]);

  // comprime a imagem para ~200x200 JPEG antes de salvar no localStorage
  const comprimirFoto = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const MAX = 240;
          let { width, height } = img;
          if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
          else { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { onToast('Imagem muito grande (máx 5 MB)', 'warn'); return; }
    const base64 = await comprimirFoto(file);
    setFoto(base64);
    dispatch({ type: 'update_membro', id: usuario.id, updates: { foto: base64 } });
    onToast('Foto atualizada!', 'ok');
  };

  const removerFoto = () => {
    setFoto(null);
    dispatch({ type: 'update_membro', id: usuario.id, updates: { foto: null } });
    onToast('Foto removida', 'ok');
  };

  const cores = ['#5B7FFF','#F39C12','#E67E22','#8E44AD','#E74C3C','#27AE60','#2980B9','#1ABC9C','#EC4899','#3B6FB5','#EF4444','#6366F1'];
  const todasFuncoes = Object.entries(window.FUNCOES);

  const iniciais = (n) => n.trim().split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const toggleSecundaria = (fid) => {
    if (fid === funcPrincipal) return;
    setFuncsSecundarias((prev) => prev.includes(fid) ? prev.filter((f) => f !== fid) : [...prev, fid]);
  };

  const salvar = async () => {
    if (!nome.trim()) { onToast('Informe o nome', 'warn'); return; }
    if (!funcPrincipal) { onToast('Selecione uma função principal', 'warn'); return; }
    const ini = iniciais(nome);
    const secundariasLimpas = funcsSecundarias.filter((f) => f !== funcPrincipal);
    setSalvando(true);
    try {
      await dispatch({ type: 'update_membro', id: usuario.id, updates: { nome: nome.trim(), iniciais: ini, func: funcPrincipal, secundarias: secundariasLimpas, tom: tomSel, foto } });
      onUpdateUsuario({ nome: nome.trim() });
      onToast('Perfil atualizado com sucesso!', 'ok');
    } catch (e) {
      onToast('Erro ao salvar: ' + (e.message || 'tente novamente'), 'err');
    } finally {
      setTimeout(() => setSalvando(false), 1000);
    }
  };

  const primeiroNome = nome.split(' ')[0] || 'Você';

  return (
    <div style={{ ...screenWrap, padding: '0 0 120px' }}>

      {/* hero do perfil */}
      <div style={{ padding: '32px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: `radial-gradient(80% 50% at 50% 0%, ${tomSel}22 0%, transparent 70%)`, position: 'relative' }}>

        {/* input de foto oculto */}
        <input ref={fileRef} type="file" accept="image/*" capture="user"
          style={{ display: 'none' }} onChange={handleFotoChange} />

        <div style={{ position: 'relative' }}>
          {/* avatar clicável */}
          <button onClick={() => fileRef.current?.click()}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: 999, display: 'block' }}>
            <Avatar iniciais={iniciais(nome) || '?'} tom={tomSel} size={90} ring foto={foto} />
            {/* overlay câmera */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
              <Icon name="camera" size={22} />
            </div>
          </button>

          {/* badge câmera fixo no canto */}
          <button onClick={() => fileRef.current?.click()}
            style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 999, background: tomSel, border: '2.5px solid #04081A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="camera" size={13} />
          </button>
        </div>

        {/* remover foto */}
        {foto && (
          <button onClick={removerFoto} style={{ background: 'none', border: 'none', color: MEVAM_COLORS.danger, fontFamily: 'Manrope', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, marginTop: -6 }}>
            <Icon name="ban" size={11} /> Remover foto
          </button>
        )}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, fontSize: 24, color: MEVAM_COLORS.text, letterSpacing: -0.5 }}>{nome || 'Seu nome'}</div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 600, color: '#A8BBFF', background: MEVAM_COLORS.accentSoft, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              {usuario.perfil === 'admin' ? '🛡️ Admin' : '👤 Membro'}
            </span>
            {funcPrincipal && <FuncBadge funcId={funcPrincipal} />}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* ── Dados pessoais ── */}
        <div>
          <SectionLabel icon="person">Dados pessoais</SectionLabel>
          <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Nome completo">
              <input value={nome} onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                style={inputStyle} />
            </Field>
            <div>
              <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Cor do avatar</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cores.map((c) => (
                  <button key={c} onClick={() => setTomSel(c)} style={{ width: 32, height: 32, borderRadius: 999, background: c, border: tomSel === c ? `3px solid #fff` : '2px solid transparent', cursor: 'pointer', boxShadow: tomSel === c ? `0 0 10px ${c}` : 'none', transition: 'all .15s' }} />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Função principal ── */}
        <div>
          <SectionLabel icon="wand">Função principal</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {todasFuncoes.map(([fid, f]) => {
              const ativo = funcPrincipal === fid;
              return (
                <button key={fid} onClick={() => { setFuncPrincipal(fid); setFuncsSecundarias((s) => s.filter((x) => x !== fid)); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 600, transition: 'all .15s', background: ativo ? f.color + '28' : MEVAM_COLORS.card, border: `1.5px solid ${ativo ? f.color : MEVAM_COLORS.border}`, color: ativo ? f.color : MEVAM_COLORS.muted }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: ativo ? f.color : MEVAM_COLORS.border, boxShadow: ativo ? `0 0 6px ${f.color}` : 'none', flexShrink: 0 }} />
                  {f.label}
                  {ativo && <span style={{ fontSize: 11 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Funções secundárias ── */}
        <div>
          <SectionLabel icon="sparkles">Funções secundárias <span style={{ fontSize: 10.5, color: MEVAM_COLORS.mutedSoft, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(pode marcar várias)</span></SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {todasFuncoes.filter(([fid]) => fid !== funcPrincipal).map(([fid, f]) => {
              const ativo = funcsSecundarias.includes(fid);
              return (
                <button key={fid} onClick={() => toggleSecundaria(fid)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 600, transition: 'all .15s', background: ativo ? f.color + '20' : MEVAM_COLORS.card, border: `1.5px solid ${ativo ? f.color + 'AA' : MEVAM_COLORS.border}`, color: ativo ? f.color : MEVAM_COLORS.muted }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: ativo ? f.color : MEVAM_COLORS.border, flexShrink: 0 }} />
                  {f.label}
                  {ativo && <span style={{ fontSize: 11 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Botão salvar ── */}
        <Btn variant="accent" full icon={salvando ? null : <Icon name="check" size={15}/>} onClick={salvar}
          style={{ padding: '14px 18px', fontSize: 15, borderRadius: 16 }}>
          {salvando ? '✓ Salvo!' : 'Salvar alterações'}
        </Btn>

        {/* ── Sair ── */}
        <div style={{ borderTop: `1px solid ${MEVAM_COLORS.border}`, paddingTop: 18 }}>
          <Btn variant="danger" full icon={<Icon name="logout" size={15}/>} onClick={onLogout}
            style={{ borderRadius: 16 }}>
            Sair da conta
          </Btn>
        </div>

      </div>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: MEVAM_COLORS.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
        <Icon name={icon} size={14}/>
      </div>
      <span style={{ fontFamily: 'Manrope', fontSize: 12, fontWeight: 700, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8 }}>{children}</span>
    </div>
  );
}

function Stat({ label, value, accent, sub }) {
  return (
    <Card accent={accent} style={{ padding: 14 }}>
      <div style={{ fontSize: 10, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 30, color: MEVAM_COLORS.text, lineHeight: 1, marginTop: 6, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 4 }}>{sub}</div>
    </Card>
  );
}

const screenWrap = {
  paddingBottom: 'calc(100px + env(safe-area-inset-bottom))',
  minHeight: '100dvh',
};

Object.assign(window, { LoginScreen, EscalaScreen, DisponibilidadeScreen, MembrosScreen, AdminScreen, PerfilScreen });
