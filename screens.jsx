// MEVAM Escala — telas (Login, Escala, Disponibilidade, Membros, Admin)

const { useState, useMemo, useRef, useEffect } = React;

// ════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [nome, setNome] = useState('');
  const [pin, setPin] = useState('');
  const [perfil, setPerfil] = useState('admin');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!nome.trim()) { setErr('Informe seu nome'); return; }
    if (pin.length !== 4) { setErr('PIN de 4 dígitos'); return; }
    onLogin({ nome: nome.trim(), perfil });
  };

  const fill = (n, p, perf) => { setNome(n); setPin(p); setPerfil(perf); setErr(''); };

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
          width: 168,
          mixBlendMode: 'screen',
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
          <Icon name="sparkles" size={13} /> Sistema de Escalas · Louvor
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
        <Card glow accent={MEVAM_COLORS.accent} style={{ padding: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Nome">
              <input value={nome} onChange={(e) => { setNome(e.target.value); setErr(''); }}
                placeholder="Seu nome ou apelido"
                style={inputStyle} />
            </Field>
            <Field label="PIN (4 dígitos)">
              <input value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0,4)); setErr(''); }}
                placeholder="• • • •" inputMode="numeric" maxLength={4}
                style={{ ...inputStyle, letterSpacing: 8, fontWeight: 700 }} />
            </Field>
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
              <SegBtn active={perfil === 'admin'}  onClick={() => setPerfil('admin')}  icon={<Icon name="shield" size={14}/>}>Admin</SegBtn>
              <SegBtn active={perfil === 'membro'} onClick={() => setPerfil('membro')} icon={<Icon name="mic" size={14}/>}>Membro</SegBtn>
            </div>
            {err && <div style={{ color: MEVAM_COLORS.danger, fontSize: 12, fontFamily: 'Manrope' }}>{err}</div>}
            <Btn variant="accent" full onClick={submit}>Entrar</Btn>
          </div>
        </Card>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
            Demo · toque para preencher
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <DemoChip onClick={() => fill('Lucas Andrade', '1234', 'admin')}>Lucas · Admin</DemoChip>
            <DemoChip onClick={() => fill('Bruno Vieira', '0000', 'membro')}>Bruno · Membro</DemoChip>
          </div>
        </div>
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
function EscalaScreen({ state, dispatch, usuario, onShare, onToast }) {
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth());
  const cultos = useMemo(() => {
    return [...state.cultos].sort((a, b) => a.data.localeCompare(b.data));
  }, [state.cultos]);

  const proximoCulto = cultos[0];
  const meuProximo = useMemo(() => {
    return cultos.find((c) => Object.values(c.escalados).flat().includes(usuario.id));
  }, [cultos, usuario.id]);

  return (
    <div style={screenWrap}>
      <Header usuario={usuario}>
        <Btn variant="ghost" icon={<Icon name="share" size={14}/>} onClick={onShare} style={{ padding: '8px 12px', fontSize: 12 }}>Compartilhar</Btn>
      </Header>

      {/* Hero: próximo culto do usuário */}
      {meuProximo && (
        <div style={{ padding: '8px 18px 0' }}>
          <div style={{ fontSize: 11, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            Sua próxima escala
          </div>
          <CultoHeroCard culto={meuProximo} usuarioId={usuario.id} state={state} />
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

function Header({ usuario, children }) {
  return (
    <div style={{
      padding: '14px 18px 4px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: '#0A1224', border: `1px solid ${MEVAM_COLORS.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <span style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: -0.5 }}>M</span>
        </div>
        <div>
          <div style={{ fontSize: 10.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', lineHeight: 1 }}>Olá,</div>
          <div style={{ fontSize: 14, color: MEVAM_COLORS.text, fontFamily: 'Manrope', fontWeight: 600, marginTop: 2 }}>{usuario.nome.split(' ')[0]}</div>
        </div>
      </div>
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
                <Avatar iniciais={x.membro.iniciais} tom={x.membro.tom} size={30} />
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
  const [datas, setDatas] = useState(new Set());
  const [motivo, setMotivo] = useState('');
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  // datas já bloqueadas pelo usuário
  const minhasBloqueadas = useMemo(() => {
    const s = new Set();
    for (const [iso, list] of Object.entries(state.indispo)) {
      if (list.some((i) => i.membroId === usuario.id)) s.add(iso);
    }
    return s;
  }, [state.indispo, usuario.id]);

  const toggle = (iso) => {
    const s = new Set(datas);
    if (s.has(iso)) s.delete(iso); else s.add(iso);
    setDatas(s);
  };

  const salvar = () => {
    if (datas.size === 0) { onToast('Selecione ao menos uma data', 'warn'); return; }
    dispatch({ type: 'add_indispo', usuarioId: usuario.id, datas: [...datas], motivo });
    setDatas(new Set()); setMotivo('');
    onToast(`${datas.size} ${datas.size === 1 ? 'data informada' : 'datas informadas'}`, 'ok');
  };

  return (
    <div style={screenWrap}>
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', padding: '5px 10px', borderRadius: 999, background: MEVAM_COLORS.dangerSoft, border: `1px solid ${MEVAM_COLORS.danger}33`, fontSize: 11, color: MEVAM_COLORS.danger, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          <Icon name="ban" size={12}/> Indisponibilidade
        </div>
        <h2 style={{ margin: '14px 0 6px', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 26, color: MEVAM_COLORS.text, letterSpacing: -0.6, lineHeight: 1.1 }}>
          Quais datas você <span style={{ color: '#FF8585' }}>não pode</span> servir?
        </h2>
        <p style={{ margin: 0, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13, lineHeight: 1.5 }}>
          Toque nos dias para bloquear. Sua equipe respeitará essas datas na escala.
        </p>
      </div>

      <div style={{ padding: '18px 18px 0' }}>
        <Calendar
          cursor={cursor} setCursor={setCursor}
          selected={datas}
          onToggle={toggle}
          alreadyBlocked={minhasBloqueadas}
          state={state}
        />
      </div>

      <div style={{ padding: '16px 18px 28px' }}>
        <Field label="Motivo (opcional)">
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: viagem, trabalho, formatura..."
            rows={2}
            style={{ ...inputStyle, resize: 'none', fontFamily: 'Manrope' }} />
        </Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <Btn variant="ghost" onClick={() => { setDatas(new Set()); setMotivo(''); }}>Limpar</Btn>
          <Btn variant="accent" full onClick={salvar} icon={<Icon name="check" size={14}/>}>
            Informar {datas.size > 0 && `(${datas.size})`}
          </Btn>
        </div>

        {minhasBloqueadas.size > 0 && (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
              Suas datas bloqueadas ({minhasBloqueadas.size})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...minhasBloqueadas].sort().map((iso) => {
                const d = formatBRDate(iso);
                const entry = state.indispo[iso].find((i) => i.membroId === usuario.id);
                return (
                  <div key={iso} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12,
                    background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`,
                  }}>
                    <div style={{ width: 36, textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600 }}>{d.diaSemana.toUpperCase()}</div>
                      <div style={{ fontSize: 18, color: MEVAM_COLORS.text, fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, lineHeight: 1 }}>{d.dia}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontFamily: 'Manrope', color: MEVAM_COLORS.text, fontWeight: 600 }}>{d.diaSemana}, {d.dia} de {d.mes}</div>
                      <div style={{ fontSize: 11, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope' }}>{entry?.motivo || 'Sem motivo informado'}</div>
                    </div>
                    <button onClick={() => dispatch({ type: 'remove_indispo', usuarioId: usuario.id, iso })}
                      style={{ background: 'transparent', border: 'none', color: MEVAM_COLORS.mutedSoft, cursor: 'pointer', padding: 6 }}>
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
function MembrosScreen({ state, usuario, onToast }) {
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
          <MembroCard key={m.id} membro={m} state={state} onClick={() => setSelecionado(m)} self={m.id === usuario.id} />
        ))}
        {filtrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 12px', color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13 }}>
            Nenhum membro encontrado.
          </div>
        )}
      </div>

      {selecionado && <MembroDetail membro={selecionado} state={state} onClose={() => setSelecionado(null)} />}
    </div>
  );
}

function MembroCard({ membro, state, onClick, self }) {
  const totalCultos = state.cultos.filter((c) => Object.values(c.escalados).flat().includes(membro.id)).length;
  return (
    <Card accent={membro.tom} onClick={onClick} style={{ padding: 14 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Avatar iniciais={membro.iniciais} tom={membro.tom} size={44} />
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
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 18, color: MEVAM_COLORS.text, lineHeight: 1 }}>{totalCultos}</div>
          <div style={{ fontSize: 9.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase' }}>cultos</div>
        </div>
      </div>
    </Card>
  );
}

function MembroDetail({ membro, state, onClose }) {
  const cultos = state.cultos.filter((c) => Object.values(c.escalados).flat().includes(membro.id));
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
      zIndex: 90, display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn .2s',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: '#0A1326', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 20px 40px', border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none',
        animation: 'slideUp .3s cubic-bezier(.2,.9,.3,1.1)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar iniciais={membro.iniciais} tom={membro.tom} size={60} ring />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 22, color: MEVAM_COLORS.text, letterSpacing: -0.3 }}>{membro.nome}</div>
            <div style={{ marginTop: 6 }}><FuncBadge funcId={membro.func} size="md"/></div>
          </div>
        </div>
        {membro.secundarias.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 10.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Funções secundárias</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {membro.secundarias.map((f) => <FuncBadge key={f} funcId={f}/>)}
            </div>
          </div>
        )}
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
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════════════════════════
function AdminScreen({ state, dispatch, usuario, onToast }) {
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
              dispatch({ type: 'gerar_escala' });
              onToast('Escala gerada para as próximas 2 semanas', 'ok');
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
                    <Avatar iniciais={cf.membro?.iniciais || '?'} tom={cf.membro?.tom || '#666'} size={32} />
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

      {/* aprovar indispos */}
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
            {Object.entries(state.indispo).sort().slice(0, 6).flatMap(([iso, entries]) => entries.map((e, j) => {
              const m = state.membros.find((x) => x.id === e.membroId);
              const d = formatBRDate(iso);
              return (
                <div key={iso+j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: MEVAM_COLORS.card, borderRadius: 10 }}>
                  <Avatar iniciais={m?.iniciais || '?'} tom={m?.tom} size={28}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.text, fontWeight: 600 }}>{m?.nome}</div>
                    <div style={{ fontSize: 10.5, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope' }}>{d.diaSemana} · {d.dia} {d.mes} · {e.motivo || 'sem motivo'}</div>
                  </div>
                </div>
              );
            }))}
          </div>
        )}
      </div>
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

Object.assign(window, { LoginScreen, EscalaScreen, DisponibilidadeScreen, MembrosScreen, AdminScreen });
