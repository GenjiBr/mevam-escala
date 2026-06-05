// MEVAM Escala — telas (Login, Escala, Disponibilidade, Membros, Admin)

const { useState, useMemo, useRef, useEffect } = React;

// ════════════════════════════════════════════════════════════
// Logo MEVAM — texto flutuante sem fundo
// Substituiu o <img> com mixBlendMode:screen que mostrava o
// retângulo branco do PNG (screen mantém branco, esconde escuro).
// ════════════════════════════════════════════════════════════
function MevamLogo({ small = false }) {
  const s = small ? 0.62 : 1;
  const px = (n) => Math.round(n * s);
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      filter: `drop-shadow(0 ${px(6)}px ${px(28)}px rgba(91,127,255,0.6))`,
    }}>
      {/* ── BRASÍLIA ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: px(7), marginBottom: px(3) }}>
        <div style={{ width: px(18), height: 1, background: 'rgba(255,255,255,0.32)', borderRadius: 1 }} />
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 700,
          fontSize: px(10), letterSpacing: px(4),
          color: 'rgba(200,215,255,0.78)', textTransform: 'uppercase',
        }}>BRASÍLIA</span>
        <div style={{ width: px(18), height: 1, background: 'rgba(255,255,255,0.32)', borderRadius: 1 }} />
      </div>

      {/* ── MEVAM ── */}
      <div style={{
        fontFamily: '"Bricolage Grotesque", Manrope, sans-serif',
        fontWeight: 800, fontSize: px(52), letterSpacing: px(2),
        color: '#FFFFFF', lineHeight: 1,
      }}>MEVAM</div>

      {/* ── CEILÂNDIA | DF ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: px(7), marginTop: px(3) }}>
        <div style={{ width: px(14), height: 1, background: 'rgba(255,255,255,0.32)', borderRadius: 1 }} />
        <span style={{
          fontFamily: 'Manrope, sans-serif', fontWeight: 700,
          fontSize: px(10), letterSpacing: px(3),
          color: 'rgba(200,215,255,0.78)', textTransform: 'uppercase',
        }}>CEILÂNDIA | DF</span>
        <div style={{ width: px(14), height: 1, background: 'rgba(255,255,255,0.32)', borderRadius: 1 }} />
      </div>
    </div>
  );
}

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
  const [mostrarEsqueci, setMostrarEsqueci] = useState(false);

  const handleEntrar = async () => {
    if (!email.trim()) { setErr('Informe seu e-mail'); return; }
    if (!senha) { setErr('Informe a senha'); return; }
    setLoading(true); setErr('');
    try {
      const { error } = await SB.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha });
      if (error) {
        const msgs = {
          'Invalid login credentials': 'E-mail ou senha incorretos.',
          'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
          'Too many requests': 'Muitas tentativas. Aguarde alguns minutos.',
        };
        setErr(msgs[error.message] || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCriar = async () => {
    if (nome.trim().length < 3) { setErr('Nome completo deve ter ao menos 3 caracteres'); return; }
    if (!email.trim()) { setErr('Informe seu e-mail'); return; }
    if (senha.length < 6) { setErr('Senha mínima de 6 caracteres'); return; }
    setLoading(true); setErr('');
    try {
      const { error } = await SB.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: { data: { full_name: nome.trim() } },
      });
      if (error) {
        setErr(error.message);
      } else {
        setInfo('Conta criada! Verifique seu e-mail para confirmar. Se não chegou, cheque a pasta de spam.');
        setModo('entrar');
        setSenha('');
      }
    } finally {
      setLoading(false);
    }
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
        <MevamLogo />
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

        {mostrarEsqueci && <EsqueciSenhaModal onClose={() => setMostrarEsqueci(false)} />}

        <Card glow accent={MEVAM_COLORS.accent} style={{ padding: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {modo === 'criar' && (
              <Field label="Nome completo">
                <input value={nome} onChange={(e) => { setNome(e.target.value); setErr(''); }}
                  placeholder="Ex: João Silva" style={inputStyle} autoComplete="name" />
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

            {/* ── Link "Esqueci minha senha" — só no modo entrar ── */}
            {modo === 'entrar' && (
              <div style={{ textAlign: 'right', marginTop: -4 }}>
                <button
                  onClick={() => setMostrarEsqueci(true)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    color: MEVAM_COLORS.accent, fontSize: 12.5,
                    fontFamily: 'Manrope', fontWeight: 600,
                    cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
                    opacity: 0.85,
                  }}
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

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

// ════════════════════════════════════════════════════════════
// MODAL — Esqueci minha senha (portal para escapar do backdrop-filter)
// ════════════════════════════════════════════════════════════
function EsqueciSenhaModal({ onClose }) {
  const [emailR, setEmailR] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const handleEnviar = async () => {
    if (!emailR.trim()) { setErr('Informe seu e-mail'); return; }
    setLoading(true); setErr('');
    const { error } = await SB.auth.resetPasswordForEmail(emailR.trim().toLowerCase(), {
      redirectTo: window.location.href,
    });
    setLoading(false);
    if (error) {
      setErr('Erro ao enviar. Verifique o e-mail e tente novamente.');
    } else {
      setOk(true);
    }
  };

  const conteudo = (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(2,5,12,0.88)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 380,
        background: '#0D1526',
        borderRadius: 22,
        border: '1.5px solid rgba(91,127,255,0.25)',
        padding: 24,
        animation: 'slideUp .22s ease-out',
      }}>
        {/* cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{
            fontFamily: '"Bricolage Grotesque", Manrope, sans-serif',
            fontWeight: 700, fontSize: 18, color: MEVAM_COLORS.text,
          }}>
            Recuperar senha
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: MEVAM_COLORS.muted,
            cursor: 'pointer', padding: 4, borderRadius: 8,
          }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {ok ? (
          /* ── estado de sucesso ── */
          <div>
            <div style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              padding: '12px 14px', borderRadius: 12,
              background: MEVAM_COLORS.ok + '18', border: `1px solid ${MEVAM_COLORS.ok}44`,
              marginBottom: 18,
            }}>
              <Icon name="check" size={16} />
              <div style={{ color: MEVAM_COLORS.ok, fontSize: 13, fontFamily: 'Manrope', lineHeight: 1.5 }}>
                Link enviado para <strong>{emailR}</strong>. Verifique sua caixa de entrada e pasta de spam.
              </div>
            </div>
            <Btn variant="ghost" full onClick={onClose}>Fechar</Btn>
          </div>
        ) : (
          /* ── formulário ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ margin: 0, color: MEVAM_COLORS.muted, fontSize: 13, fontFamily: 'Manrope', lineHeight: 1.5 }}>
              Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.
            </p>
            <Field label="E-mail">
              <input
                value={emailR}
                onChange={(e) => { setEmailR(e.target.value); setErr(''); }}
                placeholder="seu@email.com"
                type="email"
                inputMode="email"
                style={inputStyle}
                autoCapitalize="none"
                autoComplete="email"
                onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
              />
            </Field>
            {err && (
              <div style={{ color: MEVAM_COLORS.danger, fontSize: 12.5, fontFamily: 'Manrope', lineHeight: 1.4 }}>{err}</div>
            )}
            <Btn variant="accent" full onClick={handleEnviar} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </Btn>
            <Btn variant="ghost" full onClick={onClose}>Cancelar</Btn>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(conteudo, document.body);
}

// ════════════════════════════════════════════════════════════
// TELA — Redefinir senha (exibida após clicar no link do e-mail)
// ════════════════════════════════════════════════════════════
function RedefinirSenhaScreen({ onConcluido, onToast }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSalvar = async () => {
    if (novaSenha.length < 6) { setErr('A senha precisa ter no mínimo 6 caracteres'); return; }
    if (novaSenha !== confirmSenha) { setErr('As senhas não coincidem'); return; }
    setLoading(true); setErr('');
    const { error } = await SB.auth.updateUser({ password: novaSenha });
    setLoading(false);
    if (error) {
      setErr(error.message || 'Erro ao atualizar a senha. Tente novamente.');
    } else {
      onToast('Senha atualizada com sucesso!', 'ok');
      await SB.auth.signOut();
      onConcluido();
    }
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      padding: '60px 22px calc(24px + env(safe-area-inset-bottom))',
      position: 'relative',
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
        <MevamLogo />
      </div>

      {/* form */}
      <div style={{ marginTop: 36, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(91,127,255,0.14)', border: '1px solid rgba(91,127,255,0.35)',
            fontFamily: 'Manrope', fontSize: 11.5, fontWeight: 600, color: '#A8BBFF',
            letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 14,
          }}>
            <Icon name="shield" size={13} /> Nova senha
          </div>
          <h2 style={{
            margin: '0 0 8px',
            fontFamily: '"Bricolage Grotesque", Manrope, sans-serif',
            fontWeight: 700, fontSize: 26, color: MEVAM_COLORS.text, letterSpacing: -0.5,
          }}>Redefinir senha</h2>
          <p style={{ margin: 0, color: MEVAM_COLORS.muted, fontSize: 14, fontFamily: 'Manrope', lineHeight: 1.5 }}>
            Escolha uma nova senha para a sua conta.
          </p>
        </div>

        <Card glow accent={MEVAM_COLORS.accent} style={{ padding: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Nova senha">
              <input
                value={novaSenha}
                onChange={(e) => { setNovaSenha(e.target.value); setErr(''); }}
                placeholder="Mínimo 6 caracteres"
                type="password"
                style={inputStyle}
                autoComplete="new-password"
              />
            </Field>
            <Field label="Confirmar nova senha">
              <input
                value={confirmSenha}
                onChange={(e) => { setConfirmSenha(e.target.value); setErr(''); }}
                placeholder="Repita a nova senha"
                type="password"
                style={inputStyle}
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
              />
            </Field>
            {err && (
              <div style={{ color: MEVAM_COLORS.danger, fontSize: 12.5, fontFamily: 'Manrope', lineHeight: 1.4 }}>{err}</div>
            )}
            <Btn variant="accent" full onClick={handleSalvar} disabled={loading} style={{ marginTop: 2 }}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
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
// SETUP (criar ou entrar em uma equipe)
// ════════════════════════════════════════════════════════════
function SetupScreen({ onCriar, onEntrar, usuario, onToast, onLogout }) {
  const [modo, setModo] = useState(null); // null | 'criar' | 'entrar'
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const primeiroNome = (usuario.nome || '').split(' ')[0];

  const handleCriar = async () => {
    if (!nome.trim()) { setErr('Dê um nome para a equipe'); return; }
    setLoading(true); setErr('');
    try { await onCriar(nome.trim()); }
    catch (e) { setErr(e.message || 'Erro ao criar'); }
    finally { setLoading(false); }
  };

  const handleEntrar = async () => {
    if (codigo.trim().length < 4) { setErr('Código muito curto'); return; }
    setLoading(true); setErr('');
    try { await onEntrar(codigo.trim()); }
    catch (e) { setErr(e.message || 'Código inválido'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      padding: '50px 22px calc(40px + env(safe-area-inset-bottom))',
      background: `radial-gradient(120% 70% at 50% 0%, rgba(91,127,255,0.22) 0%, rgba(4,8,26,0) 55%), ${MEVAM_COLORS.bgDeep}`,
      position: 'relative',
    }}>
      {/* glow */}
      <div style={{
        position: 'absolute', top: -100, left: -80, right: -80, height: 360,
        background: 'radial-gradient(50% 60% at 50% 50%, rgba(91,127,255,0.4) 0%, rgba(4,8,26,0) 70%)',
        filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* botão sair — canto superior direito */}
      <button
        onClick={onLogout}
        style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
          color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 500,
          padding: '6px 10px', borderRadius: 10,
          transition: 'color .15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = MEVAM_COLORS.text}
        onMouseLeave={(e) => e.currentTarget.style.color = MEVAM_COLORS.muted}
      >
        <Icon name="logout" size={14} />
        Sair
      </button>

      {/* logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
        <MevamLogo small />
      </div>

      <div style={{ position: 'relative' }}>
        <h2 style={{ margin: '0 0 6px', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 28, color: MEVAM_COLORS.text, letterSpacing: -0.6, lineHeight: 1.1 }}>
          Olá, {primeiroNome}!
        </h2>
        <p style={{ margin: '0 0 28px', color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 14, lineHeight: 1.55 }}>
          Para começar, crie uma nova escala ou<br/>entre em uma equipe já existente.
        </p>

        {modo === null && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Criar escala */}
            <button onClick={() => setModo('criar')} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
              borderRadius: 18, cursor: 'pointer', textAlign: 'left', width: '100%',
              background: `linear-gradient(135deg, rgba(91,127,255,0.18), rgba(91,127,255,0.08))`,
              border: `1px solid ${MEVAM_COLORS.accent}55`, transition: 'all .15s',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
                <Icon name="sparkles" size={22} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: MEVAM_COLORS.text }}>Criar nova Escala</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.muted, marginTop: 3 }}>Você vira admin e convida a equipe</div>
              </div>
              <span style={{ color: MEVAM_COLORS.mutedSoft, flexShrink: 0 }}><Icon name="chevron" size={16}/></span>
            </button>

            {/* Entrar com código */}
            <button onClick={() => setModo('entrar')} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
              borderRadius: 18, cursor: 'pointer', textAlign: 'left', width: '100%',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${MEVAM_COLORS.border}`,
              transition: 'all .15s',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: `1px solid ${MEVAM_COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MEVAM_COLORS.muted, flexShrink: 0 }}>
                <Icon name="person" size={22} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: MEVAM_COLORS.text }}>Entrar com código</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.muted, marginTop: 3 }}>Recebi um código de convite</div>
              </div>
              <span style={{ color: MEVAM_COLORS.mutedSoft, flexShrink: 0 }}><Icon name="chevron" size={16}/></span>
            </button>
          </div>
        )}

        {modo === 'criar' && (
          <Card glow accent={MEVAM_COLORS.accent} style={{ padding: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => { setModo(null); setErr(''); }} style={{ background: 'none', border: 'none', color: MEVAM_COLORS.muted, cursor: 'pointer', padding: '4px 6px', borderRadius: 8, display: 'flex', alignItems: 'center' }}>
                  ‹
                </button>
                <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: MEVAM_COLORS.text }}>Nova Escala</span>
              </div>
              <Field label="Nome da equipe / ministério">
                <input value={nome} onChange={(e) => { setNome(e.target.value); setErr(''); }}
                  placeholder="Ex: MEVAM Ceilândia" style={inputStyle} autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCriar()} />
              </Field>
              {err && <div style={{ color: MEVAM_COLORS.danger, fontSize: 12.5, fontFamily: 'Manrope' }}>{err}</div>}
              <Btn variant="accent" full icon={<Icon name="sparkles" size={14}/>} onClick={handleCriar} disabled={loading}>
                {loading ? 'Criando...' : 'Criar Escala'}
              </Btn>
            </div>
          </Card>
        )}

        {modo === 'entrar' && (
          <Card style={{ padding: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => { setModo(null); setErr(''); }} style={{ background: 'none', border: 'none', color: MEVAM_COLORS.muted, cursor: 'pointer', padding: '4px 6px', borderRadius: 8, display: 'flex', alignItems: 'center' }}>
                  ‹
                </button>
                <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: MEVAM_COLORS.text }}>Entrar na Equipe</span>
              </div>
              <Field label="Código de convite">
                <input value={codigo} onChange={(e) => { setCodigo(e.target.value.toUpperCase()); setErr(''); }}
                  placeholder="XXXXXX" maxLength={8} autoFocus
                  style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 6, textAlign: 'center', fontSize: 22, fontWeight: 700 }}
                  onKeyDown={(e) => e.key === 'Enter' && handleEntrar()} />
              </Field>
              {err && <div style={{ color: MEVAM_COLORS.danger, fontSize: 12.5, fontFamily: 'Manrope' }}>{err}</div>}
              <Btn variant="accent" full icon={<Icon name="check" size={14}/>} onClick={handleEntrar} disabled={loading}>
                {loading ? 'Verificando...' : 'Entrar na equipe'}
              </Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MODAL — código de convite
// ════════════════════════════════════════════════════════════
function CodigoModal({ equipe, state, dispatch, usuario, onToast, onClose, onExcluirEquipe, onSairEquipe }) {
  const [copiado, setCopiado] = useState(false);
  const [confirmando, setConfirmando] = useState(null); // null | 'sair' | 'excluir'
  const [processando, setProcessando] = useState(false);

  if (!equipe) return null;

  const membroAtual = state.membros.find((m) => m.id === usuario?.id);
  const isAdmin = membroAtual?.perfil === 'admin' || usuario?.perfil === 'admin';
  const isCriador = !!(equipe.criado_por && usuario?.id && String(equipe.criado_por) === String(usuario.id));
  const temEquipeId = !!(membroAtual?.equipe_id);
  const mostrarSairEscala = temEquipeId && !isCriador;

  console.log('[MEVAM] CodigoModal diag →', {
    usuarioId: usuario?.id,
    criadoPor: equipe.criado_por,
    isCriador,
    isAdmin,
    membroEquipeId: membroAtual?.equipe_id,
    temEquipeId,
    mostrarSairEscala,
  });

  const handleSairEscala = async () => {
    if (processando) return;
    setProcessando(true);
    try {
      await onSairEquipe();
      onClose();
    } catch (e) {
      onToast('Erro ao sair: ' + (e.message || 'tente novamente'), 'err');
    } finally { setProcessando(false); }
  };

  const handleExcluirEscala = async () => {
    if (processando) return;
    setProcessando(true);
    try {
      await onExcluirEquipe();
      onClose();
    } catch (e) {
      onToast('Erro ao excluir: ' + (e.message || 'tente novamente'), 'err');
    } finally { setProcessando(false); }
  };

  const copiar = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(equipe.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const compartilhar = () => {
    const texto = `Você foi convidado para a equipe *${equipe.nome}* no MEVAM Escala!\n\nCódigo de convite: *${equipe.codigo}*\n\nAbra o app → "Criar Escala" → "Entrar com código".`;
    if (navigator.share) {
      navigator.share({ title: 'Convite MEVAM Escala', text: texto }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const conteudo = (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .2s',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, margin: '0 auto',
        background: '#0A1326', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 22px 32px',
        border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none',
        animation: 'slideUp .3s cubic-bezier(.2,.9,.3,1.1)',
      }}>
        {/* handle */}
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 18px' }} />

        {/* título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: MEVAM_COLORS.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
            <Icon name="person" size={18}/>
          </div>
          <div>
            <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 17, color: MEVAM_COLORS.text, letterSpacing: -0.3 }}>Convidar para a equipe</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 12, color: MEVAM_COLORS.muted, marginTop: 2 }}>{equipe.nome}</div>
          </div>
        </div>

        {/* ── tela principal: código + copiar/compartilhar + ações ── */}
        {confirmando === null && (
          <div>
            {/* bloco código */}
            <div style={{
              borderRadius: 16, padding: '16px 14px 14px',
              background: `linear-gradient(135deg, rgba(91,127,255,0.16), rgba(91,127,255,0.06))`,
              border: `1px solid ${MEVAM_COLORS.accent}44`, textAlign: 'center', marginBottom: 12,
            }}>
              <div style={{ fontFamily: 'Manrope', fontSize: 10, fontWeight: 700, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>
                Código de convite
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
                {equipe.codigo.split('').map((ch, i) => (
                  <div key={i} style={{
                    width: 40, height: 48, borderRadius: 10,
                    background: 'rgba(0,0,0,0.45)', border: `1.5px solid ${MEVAM_COLORS.accent}66`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, fontSize: 22, color: '#A8BBFF',
                  }}>{ch}</div>
                ))}
              </div>
              <div style={{ fontFamily: 'Manrope', fontSize: 11, color: MEVAM_COLORS.mutedSoft, lineHeight: 1.5 }}>
                Eles acessam o app → <strong style={{ color: MEVAM_COLORS.muted }}>Criar Escala</strong> → <strong style={{ color: MEVAM_COLORS.muted }}>Entrar com código</strong>.
              </div>
            </div>

            {/* copiar / compartilhar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <Btn variant="ghost" full onClick={copiar} icon={<Icon name={copiado ? 'check' : 'edit'} size={14}/>}>
                {copiado ? 'Copiado!' : 'Copiar código'}
              </Btn>
              <Btn variant="accent" full onClick={compartilhar} icon={<Icon name="share" size={14}/>}>
                Compartilhar
              </Btn>
            </div>

            {/* separador */}
            <div style={{ height: 1, background: MEVAM_COLORS.border, marginBottom: 14 }} />

            {/* ações de saída */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* membros com equipe_id que não sejam o criador */}
              {mostrarSairEscala && (
                <Btn variant="danger" full
                  icon={<span style={{ fontSize: 15 }}>🚪</span>}
                  onClick={() => setConfirmando('sair')}>
                  Sair da Escala
                </Btn>
              )}
              {/* apenas admins podem excluir */}
              {isAdmin && (
                <Btn variant="danger" full
                  icon={<Icon name="trash" size={14}/>}
                  onClick={() => setConfirmando('excluir')}
                  style={{ opacity: 0.85 }}>
                  Excluir Escala
                </Btn>
              )}
            </div>
          </div>
        )}

        {/* confirmação: sair */}
        {confirmando === 'sair' && (
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.28)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🚪</span>
              <div>
                <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: MEVAM_COLORS.text, fontWeight: 700, marginBottom: 4 }}>Sair da Escala?</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.muted, lineHeight: 1.55 }}>
                  Você será removido de todos os cultos futuros. Você continua cadastrado no sistema.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" full onClick={() => setConfirmando(null)}>Cancelar</Btn>
              <Btn variant="danger" full onClick={handleSairEscala} disabled={processando}>
                {processando ? 'Saindo…' : 'Confirmar'}
              </Btn>
            </div>
          </div>
        )}

        {/* confirmação: excluir */}
        {confirmando === 'excluir' && (
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.4)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
              <div>
                <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: MEVAM_COLORS.danger, fontWeight: 700, marginBottom: 4 }}>Atenção! Ação irreversível</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.muted, lineHeight: 1.55 }}>
                  Todos os cultos e escalações serão <span style={{ color: MEVAM_COLORS.danger, fontWeight: 600 }}>permanentemente apagados</span>. Essa ação não pode ser desfeita.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" full onClick={() => setConfirmando(null)}>Cancelar</Btn>
              <Btn variant="danger" full icon={<Icon name="trash" size={13}/>} onClick={handleExcluirEscala} disabled={processando}>
                {processando ? 'Excluindo…' : 'Excluir tudo'}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Portal → renderiza no document.body, fora do stacking context zIndex:1 do app
  // (mesmo motivo do SlotPickerModal — tab bar zIndex:70 > container zIndex:1)
  return ReactDOM.createPortal(conteudo, document.body);
}

// ════════════════════════════════════════════════════════════
// MODAL — calendário de cultos (Ver Escala)
// ════════════════════════════════════════════════════════════
function CalendarEscalaModal({ state, onClose }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [diaSel, setDiaSel] = useState(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const startDow = first.getDay();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dows  = ['D','S','T','Q','Q','S','S'];

  const cultosNoMes = useMemo(() => {
    const map = {};
    state.cultos.forEach((c) => {
      const [y, m, d] = c.data.split('-').map(Number);
      if (y === year && m - 1 === month) {
        if (!map[d]) map[d] = [];
        map[d].push(c);
      }
    });
    return map;
  }, [state.cultos, year, month]);

  const cultosNoDia = diaSel ? state.cultos.filter((c) => c.data === diaSel) : [];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
      zIndex: 90, display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .2s',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 480, margin: '0 auto',
        background: '#0A1326', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '20px 18px calc(110px + env(safe-area-inset-bottom))',
        border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none',
        animation: 'slideUp .3s cubic-bezier(.2,.9,.3,1.1)',
        maxHeight: '88dvh', overflowY: 'auto',
      }}>
        {/* handle */}
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 18px' }} />

        {/* título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: MEVAM_COLORS.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
            <Icon name="calendar" size={17}/>
          </div>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 18, color: MEVAM_COLORS.text, letterSpacing: -0.3 }}>
            Calendário de Cultos
          </div>
        </div>

        {/* nav mês */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={{ ...navBtnStyle, transform: 'scaleX(-1)' }}>
            <Icon name="chevron" size={14}/>
          </button>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 16, color: MEVAM_COLORS.text, textTransform: 'capitalize', letterSpacing: -0.2 }}>
            {meses[month]} {year}
          </div>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={navBtnStyle}>
            <Icon name="chevron" size={14}/>
          </button>
        </div>

        {/* cabeçalho dias */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {dows.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontWeight: 600, letterSpacing: 0.4 }}>{d}</div>
          ))}
        </div>

        {/* células */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (d === null) return <div key={i} style={{ aspectRatio: '1' }} />;
            const iso = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const isSel   = diaSel === iso;
            const isToday = iso === HOJE_ISO;
            const cultosAqui = cultosNoMes[d] || [];
            const temCulto = cultosAqui.length > 0;
            return (
              <button key={i} onClick={() => setDiaSel(isSel ? null : iso)} style={{
                aspectRatio: '1', borderRadius: 10,
                background: isSel ? MEVAM_COLORS.accent : isToday ? MEVAM_COLORS.accentSoft : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSel ? MEVAM_COLORS.accent : isToday ? MEVAM_COLORS.accent + '88' : MEVAM_COLORS.border}`,
                color: isSel ? '#fff' : MEVAM_COLORS.text,
                fontFamily: 'Manrope', fontWeight: isToday ? 700 : 500, fontSize: 12.5,
                cursor: temCulto ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0,
              }}>
                {d}
                {temCulto && (
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                    {cultosAqui.slice(0, 3).map((c, k) => (
                      <div key={k} style={{ width: 4, height: 4, borderRadius: 999, background: isSel ? 'rgba(255,255,255,0.8)' : c.cor || MEVAM_COLORS.accent }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* cultos do dia selecionado */}
        {diaSel && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
              {(() => { const d = formatBRDate(diaSel); return `${d.diaSemana}, ${d.dia} de ${d.mes}`; })()}
            </div>
            {cultosNoDia.length === 0 ? (
              <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13, padding: '12px 0', textAlign: 'center' }}>
                Nenhum culto neste dia
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cultosNoDia.map((c) => {
                  const escaladosIds = Object.values(c.escalados).flat().filter(Boolean);
                  return (
                    <div key={c.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '13px 14px', borderRadius: 14,
                      background: c.cor + '12', border: `1px solid ${c.cor}44`,
                    }}>
                      <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 999, background: c.cor, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13.5, color: MEVAM_COLORS.text }}>{c.titulo}</div>
                        <div style={{ fontSize: 12, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon name="clock" size={11}/> {c.horario} · {escaladosIds.length} escalados
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = { width: 30, height: 30, borderRadius: 8, background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, color: MEVAM_COLORS.text, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

// ════════════════════════════════════════════════════════════
// MÚSICAS — utilitários
// ════════════════════════════════════════════════════════════
const TONS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'Bb', 'B'];

// Suporta legado string[] e novo formato {id, tom}[]
function normMusicas(musicas) {
  return (musicas || []).map(item =>
    typeof item === 'string' ? { id: item, tom: null } : item
  );
}

function extractYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:v=|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

const MUSIC_GRADIENTS = [
  'linear-gradient(135deg, #5B7FFF, #8B5CF6)',
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #EC4899, #8B5CF6)',
  'linear-gradient(135deg, #F97316, #EF4444)',
  'linear-gradient(135deg, #06B6D4, #3B82F6)',
];
function musicGradient(nome) {
  const sum = (nome || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return MUSIC_GRADIENTS[sum % MUSIC_GRADIENTS.length];
}

// ── Ícone YouTube SVG inline ──
function YTIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.5 6.5s-.25-1.75-1-2.5c-.97-1.02-2.06-1.02-2.56-1.08C16.44 2.75 12 2.75 12 2.75s-4.44 0-6.94.17c-.5.06-1.59.06-2.56 1.08C1.75 4.75 1.5 6.5 1.5 6.5S1.25 8.53 1.25 10.56v1.88c0 2.03.25 4.06.25 4.06s.25 1.75 1 2.5c.97 1.02 2.25.98 2.81 1.09C7.25 20.25 12 20.25 12 20.25s4.44 0 6.94-.18c.5-.06 1.59-.06 2.56-1.08.75-.75 1-2.5 1-2.5s.25-2.03.25-4.06v-1.88C22.75 8.53 22.5 6.5 22.5 6.5zM9.75 14.5v-7l6.5 3.5-6.5 3.5z" fill="#FF0000"/>
    </svg>
  );
}

// ── Seletor de tons (bottom sheet portal) ──
function TomPicker({ tomAtual, tomOriginalMusica, onSelect, onClose }) {
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400 }} />
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, zIndex: 401, background: '#0A1326', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '20px 20px 40px', border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none', animation: 'slideUp .25s cubic-bezier(.2,.9,.3,1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 16, color: MEVAM_COLORS.text, marginBottom: 14, letterSpacing: -0.3 }}>Selecionar tom</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TONS.map(t => {
            const isAtual = t === tomAtual;
            const isOrig  = t === tomOriginalMusica;
            return (
              <button key={t} onClick={() => { onSelect(t); onClose(); }} style={{ width: 56, padding: '8px 0', borderRadius: 10, fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, textAlign: 'center', cursor: 'pointer', background: isAtual ? MEVAM_COLORS.accent : isOrig ? 'rgba(243,156,18,0.14)' : MEVAM_COLORS.card, border: `1px solid ${isAtual ? MEVAM_COLORS.accent : isOrig ? '#F39C12' : MEVAM_COLORS.border}`, color: isAtual ? '#fff' : isOrig ? '#F39C12' : MEVAM_COLORS.muted }}>
                {t}{isOrig ? ' ⭐' : ''}
              </button>
            );
          })}
        </div>
        <button onClick={() => { onSelect(null); onClose(); }} style={{ marginTop: 14, width: '100%', padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${MEVAM_COLORS.border}`, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Restaurar original
        </button>
      </div>
    </>,
    document.body
  );
}

// ── Card de música no repertório ──
function MusicaCard({ musica, isAdmin, onEdit, onDelete, compact = false, tomCulto, onTomChange }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [showTomPicker, setShowTomPicker] = useState(false);
  const ytId = extractYouTubeId(musica.url_youtube);
  const grad = musicGradient(musica.nome);

  const temOverride = compact && tomCulto !== null && tomCulto !== undefined;
  const canEdit = isAdmin && !!onTomChange;
  const badgeStyle = (cor, bg) => ({ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: cor, background: bg, padding: '1px 6px', borderRadius: 4, border: 'none', cursor: canEdit ? 'pointer' : 'default' });

  if (compact) {
    const openPicker = canEdit ? (e) => { e.stopPropagation(); setShowTomPicker(true); } : undefined;
    const pencil = canEdit ? <span style={{ fontSize: 9 }}> ✏️</span> : null;
    const badgeTom = temOverride
      ? <button onClick={openPicker} style={badgeStyle(MEVAM_COLORS.accent, MEVAM_COLORS.accentSoft)}>Tom: {tomCulto}{pencil}</button>
      : musica.tom_original
        ? <button onClick={openPicker} style={badgeStyle('#F39C12', 'rgba(243,156,18,0.12)')}>Tom Original{pencil}</button>
        : musica.tom
          ? <button onClick={openPicker} style={badgeStyle(MEVAM_COLORS.accent, MEVAM_COLORS.accentSoft)}>• {musica.tom}{pencil}</button>
          : null;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 7, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>♪</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 600, color: MEVAM_COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{musica.nome}</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>{badgeTom}</div>
        </div>
        {ytId && <a href={`https://youtu.be/${ytId}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}><YTIcon size={16}/></a>}
        {showTomPicker && <TomPicker tomAtual={temOverride ? tomCulto : musica.tom} tomOriginalMusica={musica.tom} onSelect={onTomChange} onClose={() => setShowTomPicker(false)} />}
      </div>
    );
  }

  // ── full card (repertório) ──
  const openPickerFull = canEdit ? (e) => { e.stopPropagation(); setShowTomPicker(true); } : undefined;
  const pencilFull = canEdit ? <span style={{ fontSize: 9 }}> ✏️</span> : null;
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, padding: '12px 14px', background: MEVAM_COLORS.card, border: `1px solid ${confirmDel ? 'rgba(239,68,68,0.4)' : MEVAM_COLORS.border}`, borderRadius: confirmDel ? '14px 14px 0 0' : 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 8, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>♪</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 13.5, fontWeight: 600, color: MEVAM_COLORS.text, lineHeight: 1.3 }}>{musica.nome}</div>
          <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
            {musica.tom && (
              <button onClick={openPickerFull} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.accent, background: MEVAM_COLORS.accentSoft, padding: '2px 8px', borderRadius: 5, border: 'none', cursor: canEdit ? 'pointer' : 'default' }}>
                • {musica.tom}{pencilFull}
              </button>
            )}
            {musica.tom_original && !musica.tom && (
              <button onClick={!musica.tom ? openPickerFull : undefined} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontFamily: 'Manrope', fontWeight: 700, color: '#F39C12', background: 'rgba(243,156,18,0.12)', padding: '2px 8px', borderRadius: 5, border: 'none', cursor: (!musica.tom && canEdit) ? 'pointer' : 'default' }}>
                Tom Original{!musica.tom && pencilFull}
              </button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {ytId && (
            <a href={`https://youtu.be/${ytId}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', padding: 4 }}>
              <YTIcon size={20}/>
            </a>
          )}
          {!confirmDel && (
            <>
              <button onClick={onEdit} style={{ background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}44`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#A8BBFF', display: 'flex', alignItems: 'center' }}>
                <Icon name="edit" size={13}/>
              </button>
              <button onClick={() => setConfirmDel(true)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: MEVAM_COLORS.danger, display: 'flex', alignItems: 'center' }}>
                <Icon name="trash" size={13}/>
              </button>
            </>
          )}
          {confirmDel && (
            <button onClick={() => setConfirmDel(false)} style={{ background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: MEVAM_COLORS.muted, display: 'flex', alignItems: 'center' }}>
              <Icon name="x" size={13}/>
            </button>
          )}
        </div>
      </div>
      {confirmDel && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)', borderTop: 'none', borderRadius: '0 0 14px 14px' }}>
          <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.muted, marginBottom: 8 }}>Remover <strong style={{ color: MEVAM_COLORS.text }}>"{musica.nome}"</strong> do repertório?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" full onClick={() => setConfirmDel(false)}>Cancelar</Btn>
            <Btn variant="danger" full icon={<Icon name="trash" size={12}/>} onClick={onDelete}>Remover</Btn>
          </div>
        </div>
      )}
      {showTomPicker && <TomPicker tomAtual={musica.tom} tomOriginalMusica={null} onSelect={onTomChange} onClose={() => setShowTomPicker(false)} />}
    </div>
  );
}

// ── Modal adicionar / editar música ──
function AddMusicaModal({ musica, musicas = [], equipe, usuario, dispatch, onToast, onClose, onSaved }) {
  const isEdit = !!musica;
  const [url, setUrl]             = useState(musica?.url_youtube || '');
  const [nome, setNome]           = useState(musica?.nome || '');
  const [tom, setTom]             = useState(musica?.tom || '');
  const [tomOriginal, setTomOrig] = useState(musica?.tom_original || false);
  const [buscando, setBuscando]   = useState(false);
  const [salvando, setSalvando]   = useState(false);
  const [duplicadaAlert, setDuplicadaAlert] = useState(null); // { nome } da música duplicada

  const buscarTitulo = async () => {
    const u = url.trim();
    if (!u) return;
    setBuscando(true);
    try {
      const res = await fetch(`/api/youtube-title?url=${encodeURIComponent(u)}`);
      if (!res.ok) throw new Error('Vídeo não encontrado');
      const d = await res.json();
      setNome(d.title);
    } catch (e) {
      onToast('Não foi possível buscar o título: ' + e.message, 'err');
    } finally { setBuscando(false); }
  };

  const handleSalvar = async () => {
    if (!nome.trim()) { onToast('Informe o nome da música.', 'err'); return; }
    const urlTrimmed = url.trim();
    if (urlTrimmed) {
      const novoId = extractYouTubeId(urlTrimmed);
      if (novoId) {
        const duplicada = musicas.find((m) => m.id !== musica?.id && extractYouTubeId(m.url_youtube) === novoId);
        if (duplicada) { setDuplicadaAlert(duplicada); return; }
      }
    }
    setSalvando(true);
    // Fail-safe: desbloqueia o botão após 20s mesmo que o async trave
    const safety = setTimeout(() => {
      setSalvando(false);
      onToast('Operação demorou demais. Tente novamente.', 'err');
    }, 20000);
    try {
      const payload = { nome: nome.trim(), url_youtube: url.trim() || null, tom: tom || null, tom_original: tomOriginal };
      if (isEdit) {
        await dispatch({ type: 'update_musica', id: musica.id, updates: payload });
        onToast('Música atualizada!', 'ok');
      } else {
        const musicaCriada = await Promise.race([
          sbInsertMusica({ ...payload, equipe_id: null, adicionado_por: usuario?.id || null }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao salvar. Verifique sua conexão.')), 8000)),
        ]);
        await dispatch({ type: 'add_musica', musica: musicaCriada || { ...payload, equipe_id: null, adicionado_por: usuario?.id || null } });
        onToast('Música adicionada ao repertório!', 'ok');
      }
      isEdit ? onClose() : (onSaved ? onSaved() : onClose());
    } catch (e) {
      console.error('[MEVAM] handleSalvar música:', e);
      onToast('Erro: ' + (e.message || 'tente novamente'), 'err');
    } finally {
      clearTimeout(safety);
      setSalvando(false);
    }
  };

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .15s' }}>

      {/* ── Popup: URL duplicada ── */}
      {duplicadaAlert && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#0D1830', border: `1px solid rgba(239,68,68,0.45)`, borderRadius: 20, padding: '24px 22px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', animation: 'fadeIn .15s' }}>
            <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
            <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, fontSize: 16, color: MEVAM_COLORS.text, textAlign: 'center', marginBottom: 8 }}>
              Música já no repertório
            </div>
            <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: MEVAM_COLORS.muted, textAlign: 'center', lineHeight: 1.5, marginBottom: 22 }}>
              Esta URL já está cadastrada como<br/>
              <strong style={{ color: MEVAM_COLORS.text }}>"{duplicadaAlert.nome}"</strong>
            </div>
            <button onClick={() => setDuplicadaAlert(null)} style={{ width: '100%', padding: '13px 0', borderRadius: 14, background: `linear-gradient(135deg, ${MEVAM_COLORS.accent}, #3D5FE0)`, border: 'none', color: '#fff', fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Entendi
            </button>
          </div>
        </div>
      )}

      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#0A1326', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: '20px 20px 32px', border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none', animation: 'slideUp .3s cubic-bezier(.2,.9,.3,1.1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 18px' }} />
        <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 18, color: MEVAM_COLORS.text, marginBottom: 18, letterSpacing: -0.3 }}>
          {isEdit ? 'Editar música' : 'Adicionar música'}
        </div>

        {/* URL + Buscar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Manrope', marginBottom: 6 }}>Link do YouTube</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={buscarTitulo} disabled={buscando || !url.trim()} style={{ padding: '0 14px', borderRadius: 12, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}55`, color: '#A8BBFF', fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, opacity: (!url.trim() || buscando) ? 0.5 : 1 }}>
              {buscando ? '...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Nome */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Manrope', marginBottom: 6 }}>Nome da música</div>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da música" style={inputStyle} />
        </div>

        {/* Tom */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Manrope', marginBottom: 8 }}>Tom</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {TONS.map((t) => (
              <button key={t} onClick={() => setTom(tom === t ? '' : t)} style={{ padding: '6px 12px', borderRadius: 8, fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: tom === t ? MEVAM_COLORS.accentSoft : 'rgba(255,255,255,0.04)', border: `1px solid ${tom === t ? MEVAM_COLORS.accent + '99' : MEVAM_COLORS.border}`, color: tom === t ? '#A8BBFF' : MEVAM_COLORS.muted, transition: 'all .12s' }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Tom original toggle */}
        <button onClick={() => setTomOrig((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 14px', background: tomOriginal ? 'rgba(243,156,18,0.08)' : MEVAM_COLORS.card, border: `1px solid ${tomOriginal ? 'rgba(243,156,18,0.4)' : MEVAM_COLORS.border}`, borderRadius: 12, cursor: 'pointer', marginBottom: 18, transition: 'all .15s' }}>
          <div style={{ width: 36, height: 20, borderRadius: 999, background: tomOriginal ? '#F39C12' : MEVAM_COLORS.border, position: 'relative', transition: 'background .15s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 2, left: tomOriginal ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#fff', transition: 'left .15s' }} />
          </div>
          <span style={{ fontFamily: 'Manrope', fontSize: 13.5, fontWeight: 600, color: tomOriginal ? '#F39C12' : MEVAM_COLORS.muted }}>Tom original</span>
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" full onClick={onClose}>Cancelar</Btn>
          <Btn variant="accent" full onClick={handleSalvar} disabled={salvando || !nome.trim()}>
            {salvando ? 'Salvando…' : isEdit ? 'Salvar' : 'Adicionar'}
          </Btn>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Sheet completo do repertório ──
function MusicasSheet({ state, dispatch, usuario, equipe, onToast, onClose }) {
  const [busca, setBusca]         = useState('');
  const [showAdd, setShowAdd] = useState(
  () => window.location.hash === '#addmusica'
);
  const [addKey, setAddKey]       = useState(0);
  const [editMusica, setEditMusica] = useState(null);
  const isAdmin = usuario?.perfil === 'admin';

  useEffect(() => {
    if (!equipe?.id) return;
    sbGetMusicas().then((musicas) => dispatch({ type: 'merge_musicas', musicas }));
  }, [equipe?.id]);

  const musicas = useMemo(() =>
    (state.musicas || []),
    [state.musicas]
  );
  const filtradas = useMemo(() => {
    const q = busca.toLowerCase();
    if (!q) return musicas;
    return musicas.filter((m) => m.nome.toLowerCase().includes(q) || (m.tom || '').toLowerCase().includes(q));
  }, [musicas, busca]);

  const handleTomChangeRep = async (musicaId, novoTom) => {
    try {
      await dispatch({ type: 'update_musica', id: musicaId, updates: { tom: novoTom || null } });
    } catch (e) { onToast('Erro: ' + e.message, 'err'); }
  };

  const handleDelete = async (m) => {
    try {
      await dispatch({ type: 'remove_musica', id: m.id });
      onToast(`"${m.nome}" removida.`, 'ok');
    } catch (e) { onToast('Erro: ' + e.message, 'err'); }
  };

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: MEVAM_COLORS.bgDeep, display: 'flex', flexDirection: 'column', animation: 'fadeIn .18s' }}>
      {/* header */}
      <div style={{ padding: '52px 18px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${MEVAM_COLORS.border}`, flexShrink: 0, background: `linear-gradient(180deg, rgba(91,127,255,0.1) 0%, transparent 100%)` }}>
        <button onClick={onClose} style={{ background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 10, padding: '8px 10px', cursor: 'pointer', color: MEVAM_COLORS.muted, display: 'flex', alignItems: 'center', transform: 'rotate(180deg)' }}>
          <Icon name="chevron" size={16}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 20, color: MEVAM_COLORS.text, letterSpacing: -0.4 }}>Repertório</div>
          <div style={{ fontSize: 12, color: MEVAM_COLORS.muted, fontFamily: 'Manrope' }}>{musicas.length} música{musicas.length !== 1 ? 's' : ''}</div>
        </div>
        <Btn variant="accent" icon={<Icon name="plus" size={13}/>} onClick={() => { setAddKey(k => k + 1); setShowAdd(true); }} style={{ padding: '8px 14px', fontSize: 12.5 }}>
          Adicionar
        </Btn>
      </div>

      {/* busca */}
      <div style={{ padding: '12px 18px 8px', flexShrink: 0 }}>
        <input
          value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou tom..."
          style={{ ...inputStyle, paddingLeft: 14 }}
        />
      </div>

      {/* lista */}
      <div className="mevam-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: MEVAM_COLORS.mutedSoft }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎵</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 14, fontWeight: 600, color: MEVAM_COLORS.muted }}>
              {busca ? 'Nenhuma música encontrada' : 'Repertório vazio'}
            </div>
            <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
              {busca ? 'Tente outros termos.' : 'Clique em "Adicionar" para incluir músicas.'}
            </div>
          </div>
        )}
        {filtradas.map((m) => (
          <MusicaCard
            key={m.id} musica={m} isAdmin={isAdmin}
            onEdit={() => setEditMusica(m)}
            onDelete={() => handleDelete(m)}
            onTomChange={isAdmin ? (t) => handleTomChangeRep(m.id, t) : undefined}
          />
        ))}
      </div>

      {showAdd && <AddMusicaModal key={addKey} musicas={musicas} equipe={equipe} usuario={usuario} dispatch={dispatch} onToast={onToast} onClose={() => setShowAdd(false)} onSaved={() => { setAddKey(k => k + 1); setShowAdd(true); }} />}
      {editMusica && <AddMusicaModal key={'edit-' + editMusica.id} musica={editMusica} musicas={musicas} equipe={equipe} usuario={usuario} dispatch={dispatch} onToast={onToast} onClose={() => setEditMusica(null)} />}
    </div>,
    document.body
  );
}

// ── Sheet de músicas por culto (admin seleciona do repertório) ──
function CultoMusicasSheet({ culto, state, equipe, usuario, dispatch, onToast, onClose }) {
  const [busca, setBusca]       = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [addKey, setAddKey]     = useState(0);
  const [salvando, setSalvando] = useState(false);

  const isAdmin = usuario?.perfil === 'admin';

  // Garante que state.musicas está populado ao abrir — necessário para membros comuns
  useEffect(() => {
    if (!equipe?.id) return;
    sbGetMusicas(equipe.id).then((ms) => dispatch({ type: 'merge_musicas', musicas: ms }));
  }, []);

  const meta = useMemo(() => normMusicas(culto.musicas), [culto.musicas]);

  const cultoMusicas = useMemo(() =>
    meta.map(item => {
      const m = (state.musicas || []).find(m => m.id === item.id);
      return m ? { musica: m, tomCulto: item.tom } : null;
    }).filter(Boolean),
    [meta, state.musicas]
  );

  const repertorio = useMemo(() => {
    const q = busca.toLowerCase();
    const naEscala = new Set(meta.map(item => item.id));
    return (state.musicas || [])
      .filter((m) => !naEscala.has(m.id))
      .filter((m) => !q || m.nome.toLowerCase().includes(q) || (m.tom || '').toLowerCase().includes(q));
  }, [state.musicas, equipe?.id, meta, busca]);

  const addToCulto = async (musica) => {
    if (meta.length >= 5) { onToast('Máximo de 5 músicas por culto.', 'err'); return; }
    if (salvando) return;
    setSalvando(true);
    const novas = [...meta, { id: musica.id, tom: null }];
    try {
      await dispatch({ type: 'update_culto_musicas', cultoId: culto.id, musicas: novas });
      setBusca('');
    } catch (e) { onToast('Erro: ' + e.message, 'err'); }
    finally { setSalvando(false); }
  };

  const removeFromCulto = async (musicaId) => {
    const novas = meta.filter(item => item.id !== musicaId);
    try {
      await dispatch({ type: 'update_culto_musicas', cultoId: culto.id, musicas: novas });
    } catch (e) { onToast('Erro: ' + e.message, 'err'); }
  };

  const handleTomChange = async (musicaId, novoTom) => {
    const novas = meta.map(item => item.id === musicaId ? { ...item, tom: novoTom } : item);
    try {
      await dispatch({ type: 'update_culto_musicas', cultoId: culto.id, musicas: novas });
    } catch (e) { onToast('Erro: ' + e.message, 'err'); }
  };

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .2s' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#0A1326', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: '20px 18px 32px', border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none', maxHeight: '80dvh', display: 'flex', flexDirection: 'column', animation: 'slideUp .3s cubic-bezier(.2,.9,.3,1.1)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 17, color: MEVAM_COLORS.text, marginBottom: 4, letterSpacing: -0.3 }}>Músicas do culto</div>
        <div style={{ fontSize: 12, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginBottom: 14 }}>{culto.titulo} · até 5 músicas</div>

        <div className="mevam-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* músicas já no culto */}
          {cultoMusicas.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Manrope', marginBottom: 6 }}>
                No culto ({cultoMusicas.length}/5)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cultoMusicas.map(({ musica: m, tomCulto }) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <MusicaCard musica={m} isAdmin={isAdmin} compact
                        tomCulto={tomCulto}
                        onTomChange={isAdmin ? (t) => handleTomChange(m.id, t) : undefined}
                      />
                    </div>
                    {isAdmin && (
                      <button onClick={() => removeFromCulto(m.id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: MEVAM_COLORS.danger, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        <Icon name="x" size={13}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* busca no repertório */}
          {isAdmin && meta.length < 5 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: MEVAM_COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: 'Manrope', marginBottom: 6 }}>
                Adicionar do repertório
              </div>
              <input
                value={busca} onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar música..."
                style={{ ...inputStyle, marginBottom: 8 }}
              />
              {repertorio.slice(0, 8).map((m) => (
                <button key={m.id} onClick={() => addToCulto(m)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 12, cursor: 'pointer', marginBottom: 6, textAlign: 'left' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Manrope', fontSize: 13, fontWeight: 600, color: MEVAM_COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.nome}</div>
                    {m.tom && <span style={{ fontSize: 10, color: MEVAM_COLORS.accent }}>{m.tom}</span>}
                  </div>
                  <Icon name="plus" size={14} color={MEVAM_COLORS.accent} />
                </button>
              ))}
              {repertorio.length === 0 && busca && (
                <div style={{ textAlign: 'center', padding: '12px 0', color: MEVAM_COLORS.mutedSoft, fontSize: 12.5, fontFamily: 'Manrope' }}>
                  Não encontrada.
                  <button onClick={() => { setBusca(''); setAddKey(k => k + 1); setShowAdd(true); }} style={{ display: 'block', margin: '8px auto 0', color: MEVAM_COLORS.accent, background: 'none', border: 'none', fontFamily: 'Manrope', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                    + Adicionar ao repertório
                  </button>
                </div>
              )}
              {repertorio.length === 0 && !busca && (
                <div style={{ textAlign: 'center', padding: '12px 0', color: MEVAM_COLORS.mutedSoft, fontSize: 12.5, fontFamily: 'Manrope' }}>Todas as músicas já estão no culto.</div>
              )}
            </div>
          )}
        </div>
  
          <Btn variant="ghost" full onClick={onClose} style={{ marginTop: 14 }}>Fechar</Btn>
      </div>
      {showAdd && <AddMusicaModal key={addKey} musicas={state.musicas || []} equipe={equipe} usuario={usuario} dispatch={dispatch} onToast={onToast} onClose={() => { setShowAdd(false); window.location.hash = 'repertorio'; window.location.reload(); }} />}
    </div>,
    document.body
  );
}

Object.assign(window, { LoginScreen, SetupScreen });