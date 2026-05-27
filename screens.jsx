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
    catch (e) { setErr(e.message || 'Erro ao criar'); setLoading(false); }
  };

  const handleEntrar = async () => {
    if (codigo.trim().length < 4) { setErr('Código muito curto'); return; }
    setLoading(true); setErr('');
    try { await onEntrar(codigo.trim()); }
    catch (e) { setErr(e.message || 'Código inválido'); setLoading(false); }
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
// ESCALA (home)
// ════════════════════════════════════════════════════════════
function EscalaScreen({ state, dispatch, usuario, equipe, onToast, onPerfilClick, onExcluirEquipe, onSairEquipe }) {
  const [showCodigo, setShowCodigo] = useState(false);
  const [showCalendario, setShowCalendario] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const membro = state.membros.find((m) => m.id === usuario.id);

  // próxima vez que o usuário está escalado (qualquer semana)
  const meuProximo = useMemo(() => {
    return [...state.cultos]
      .sort((a, b) => a.data.localeCompare(b.data))
      .find((c) => Object.values(c.escalados).flat().includes(usuario.id));
  }, [state.cultos, usuario.id]);

  // semana visível + cultos filtrados
  const { semanaLabel, isoInicio, isoFim, cultosNaSemana } = useMemo(() => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const fmtL = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay() + weekOffset * 7); // domingo
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6); // sábado
    const iI = fmtL(inicio);
    const iF = fmtL(fim);
    const dI = formatBRDate(iI);
    const dF = formatBRDate(iF);
    const label = dI.mes === dF.mes
      ? `${dI.dia} – ${dF.dia} de ${dF.mes}`
      : `${dI.dia} ${dI.mes} – ${dF.dia} ${dF.mes}`;
    const filtered = [...state.cultos]
      .filter((c) => c.data >= iI && c.data <= iF)
      .sort((a, b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario));
    return { semanaLabel: label, isoInicio: iI, isoFim: iF, cultosNaSemana: filtered };
  }, [state.cultos, weekOffset]);

  return (
    <div style={screenWrap}>
      <Header membro={membro} usuario={usuario} onPerfilClick={onPerfilClick}>
        <div style={{ display: 'flex', gap: 6 }}>
          <Btn variant="ghost" icon={<Icon name="calendar" size={13}/>} onClick={() => setShowCalendario(true)} style={{ padding: '7px 10px', fontSize: 11.5 }}>Calendário</Btn>
          {equipe && (
            <Btn variant="ghost" icon={<Icon name="sparkles" size={13}/>} onClick={() => setShowCodigo(true)} style={{ padding: '7px 10px', fontSize: 11.5 }}>Criar Escala</Btn>
          )}
        </div>
      </Header>

      {/* Lembrete da próxima escala do usuário */}
      {meuProximo && (
        <div style={{ padding: '10px 18px 0' }}>
          <LembreteEscala culto={meuProximo} usuarioId={usuario.id} state={state} />
        </div>
      )}

      {/* Navegação por semana */}
      <div style={{ padding: '20px 18px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 22, color: MEVAM_COLORS.text, letterSpacing: -0.4 }}>
            Próximos cultos
          </div>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)} style={{
              fontSize: 10.5, fontFamily: 'Manrope', fontWeight: 700,
              color: MEVAM_COLORS.accent, background: MEVAM_COLORS.accentSoft,
              border: `1px solid ${MEVAM_COLORS.accent}44`,
              padding: '3px 10px', borderRadius: 999, cursor: 'pointer',
            }}>Hoje</button>
          )}
        </div>

        {/* Barra de semana com setas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setWeekOffset((v) => v - 1)}
            style={{
              background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`,
              borderRadius: 10, padding: '7px 11px', cursor: 'pointer',
              color: MEVAM_COLORS.muted, display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
              <Icon name="chevron" size={15}/>
            </span>
          </button>

          <div style={{
            flex: 1, textAlign: 'center', padding: '7px 0',
            background: MEVAM_COLORS.card, border: `1px solid ${weekOffset === 0 ? MEVAM_COLORS.accent + '66' : MEVAM_COLORS.border}`,
            borderRadius: 10,
          }}>
            <div style={{ fontFamily: 'Manrope', fontSize: 12, fontWeight: 700, color: weekOffset === 0 ? MEVAM_COLORS.accent : MEVAM_COLORS.text }}>
              {weekOffset === 0 ? '📅 Semana atual' : semanaLabel}
            </div>
            {weekOffset !== 0 && (
              <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: MEVAM_COLORS.muted, marginTop: 1 }}>
                {semanaLabel}
              </div>
            )}
            {weekOffset === 0 && (
              <div style={{ fontFamily: 'Manrope', fontSize: 10.5, color: MEVAM_COLORS.muted, marginTop: 1 }}>
                {semanaLabel}
              </div>
            )}
          </div>

          <button
            onClick={() => setWeekOffset((v) => v + 1)}
            style={{
              background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`,
              borderRadius: 10, padding: '7px 11px', cursor: 'pointer',
              color: MEVAM_COLORS.muted, display: 'flex', alignItems: 'center', flexShrink: 0,
            }}
          >
            <Icon name="chevron" size={15}/>
          </button>
        </div>
      </div>

      {/* Lista de cultos da semana */}
      <div style={{ padding: '4px 18px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cultosNaSemana.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🗓️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: MEVAM_COLORS.muted }}>Nenhum culto nessa semana</div>
            <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>
              Use as setas para navegar ou clique em{' '}
              <span style={{ color: MEVAM_COLORS.accent }}>Hoje</span> para voltar.
            </div>
          </div>
        ) : (
          cultosNaSemana.map((c) => (
            <CultoCard key={c.id} culto={c} state={state} usuarioId={usuario.id} usuario={usuario} dispatch={dispatch} onToast={onToast} equipe={equipe} />
          ))
        )}
      </div>

      {showCodigo && <CodigoModal equipe={equipe} state={state} dispatch={dispatch} usuario={usuario} onToast={onToast} onClose={() => setShowCodigo(false)} onExcluirEquipe={onExcluirEquipe} onSairEquipe={onSairEquipe} />}
      {showCalendario && <CalendarEscalaModal state={state} onClose={() => setShowCalendario(false)} />}
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

// ────────────────────────────────────────────────────────────
// Modal de seleção de membro — centralizado, via ReactDOM.createPortal
//
// POR QUE PORTAL?
// O Card pai tem backdrop-filter: blur(), que cria um novo containing
// block para position:fixed, fazendo o modal aparecer relativo ao Card
// (fora da tela) em vez da viewport. O portal renderiza direto no
// document.body, fora de qualquer ancestral com backdrop-filter.
// ────────────────────────────────────────────────────────────
function SlotPickerModal({ funcId, culto, state, equipe, onSelect, onClose }) {
  const FUNCOES = window.FUNCOES || {};
  const f = FUNCOES[funcId] || {};
  const funcColor = f.color || MEVAM_COLORS.accent;

  // ── filtros ──────────────────────────────────────────────
  const indispoIds = (state.indispo[culto.data] || []).map((i) => i.membroId);
  const membroAtual = culto.escalados[funcId] || null;

  const candidatos = state.membros.filter((m) =>
    m.status === 'ativo' &&
    m.equipe_id === equipe?.id &&
    (m.func === funcId || (m.secundarias || []).includes(funcId)) &&
    !indispoIds.includes(m.id)
  );

  console.log('[MEVAM] SlotPickerModal → funcId:', funcId, '| label:', f.label,
    '| candidatos:', candidatos.map((m) => m.nome),
    '| indisponveis:', indispoIds,
    '| membroAtual:', membroAtual);
  // ─────────────────────────────────────────────────────────

  const conteudo = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(2,5,12,0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
        animation: 'fadeIn .18s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 400,
          background: '#0D1526',
          borderRadius: 22,
          border: `1.5px solid ${funcColor}55`,
          boxShadow: `0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${funcColor}20`,
          maxHeight: '78dvh', overflowY: 'auto',
          animation: 'slideUp .22s cubic-bezier(.2,.9,.3,1.1)',
        }}
      >
        {/* ── cabeçalho ── */}
        <div style={{ padding: '18px 18px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <FuncBadge funcId={funcId} size="md" />
          <span style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 18, color: MEVAM_COLORS.text, flex: 1, letterSpacing: -0.3 }}>
            Selecionar {f.label || funcId}
          </span>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.07)', border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 9, width: 30, height: 30, cursor: 'pointer', color: MEVAM_COLORS.mutedSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, touchAction: 'manipulation' }}
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        <div style={{ padding: '6px 18px 10px', fontSize: 12.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope' }}>
          {candidatos.length === 0
            ? 'Nenhum membro disponível para esta função nessa data'
            : `${candidatos.length} membro${candidatos.length !== 1 ? 's' : ''} disponível${candidatos.length !== 1 ? 'is' : ''}`}
        </div>

        {/* ── lista ── */}
        <div style={{ padding: '0 12px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>

          {/* remover slot preenchido */}
          {membroAtual && (
            <button
              onClick={() => { console.log('[MEVAM] slot removido'); onSelect(null); onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 12, marginBottom: 4,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.28)',
                cursor: 'pointer', color: MEVAM_COLORS.danger,
                fontFamily: 'Manrope', fontSize: 13, fontWeight: 600,
                touchAction: 'manipulation',
              }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 999, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="x" size={13} />
              </div>
              Remover do slot
            </button>
          )}

          {/* candidatos */}
          {candidatos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '22px 12px', color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13 }}>
              😔 Nenhum membro disponível para esta função nessa data.
            </div>
          ) : (
            candidatos.map((m) => {
              const isAtual = m.id === membroAtual;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    console.log('[MEVAM] membro selecionado:', m.nome, '| funcId:', funcId);
                    onSelect(m.id);
                    onClose();
                  }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 14,
                    background: isAtual ? MEVAM_COLORS.accentSoft : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isAtual ? MEVAM_COLORS.accent : MEVAM_COLORS.border}`,
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit',
                    touchAction: 'manipulation',
                    transition: 'background .12s',
                  }}
                >
                  <Avatar iniciais={m.iniciais} tom={m.tom} size={36} foto={m.foto} ring={isAtual} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: MEVAM_COLORS.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {m.nome}
                      {isAtual && <span style={{ fontSize: 10, color: MEVAM_COLORS.accent, fontWeight: 700 }}>• atual</span>}
                    </div>
                    <div style={{ marginTop: 3 }}><FuncBadge funcId={m.func} /></div>
                  </div>
                  {isAtual && <Icon name="check" size={16} />}
                </button>
              );
            })
          )}
        </div>

        {/* ── botão cancelar ── */}
        <div style={{ padding: '4px 12px 14px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${MEVAM_COLORS.border}`,
              color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontSize: 13.5, fontWeight: 600,
              cursor: 'pointer', touchAction: 'manipulation',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  // Portal → renderiza no document.body, fora de qualquer backdrop-filter
  return ReactDOM.createPortal(conteudo, document.body);
}

// ────────────────────────────────────────────────────────────
// Card de culto
// ────────────────────────────────────────────────────────────
function CultoCard({ culto, state, usuarioId, usuario, dispatch, onToast, equipe }) {
  const [open, setOpen] = useState(false);
  const [slotPicker, setSlotPicker] = useState(null); // { funcId } | null
  const [salvando, setSalvando] = useState(false);

  const isAdmin = usuario?.perfil === 'admin';
  const data = formatBRDate(culto.data);
  const indispoIds = (state.indispo[culto.data] || []).map((i) => i.membroId);

  // coberturas + conflitos
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

  // salva escalado no estado local + Supabase
  const handleSave = async (funcId, membroId) => {
    if (salvando) return;
    setSalvando(true);
    const novoEscalados = { ...culto.escalados, [funcId]: membroId || null };
    const cultosNovos = state.cultos.map((c) => c.id === culto.id ? { ...c, escalados: novoEscalados } : c);
    dispatch({ type: 'set_cultos', cultos: cultosNovos });
    try {
      await sbUpsertCulto({ ...culto, escalados: novoEscalados });
      onToast && onToast(membroId ? 'Membro escalado! ✓' : 'Slot liberado', 'ok');
    } catch (e) {
      onToast && onToast('Erro ao salvar no banco', 'err');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Card accent={culto.cor} style={{ padding: 0 }}>
      {/* cabeçalho clicável */}
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

      {/* lista expandida de slots */}
      {open && (
        <div style={{ borderTop: `1px solid ${MEVAM_COLORS.border}`, padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cobertura.map((x, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

              {/* ── botão principal do slot ── */}
              <button
                onClick={() => {
                  console.log('[MEVAM] SLOT CLICADO — funcId:', x.funcId, '| membro:', x.membro?.nome || 'vazio', '| isAdmin:', isAdmin, '| membros no state:', state.membros.length);
                  if (!isAdmin) { console.warn('[MEVAM] bloqueado: não é admin'); return; }
                  setSlotPicker({ funcId: x.funcId });
                }}
                style={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 12,
                  background: !x.membro ? 'rgba(91,127,255,0.05)' : 'transparent',
                  border: !x.membro ? `1px dashed ${MEVAM_COLORS.accent}55` : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              >
                {x.membro ? (
                  <Avatar iniciais={x.membro.iniciais} tom={x.membro.tom} size={30} foto={x.membro.foto} />
                ) : (
                  <div style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0, background: 'rgba(91,127,255,0.10)', border: `1px dashed ${MEVAM_COLORS.accent}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MEVAM_COLORS.accent }}>
                    <Icon name="plus" size={13}/>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Manrope', fontSize: 13, color: x.membro ? MEVAM_COLORS.text : MEVAM_COLORS.muted, fontWeight: x.membro ? 600 : 500 }}>
                      {x.membro ? x.membro.nome : 'Slot vazio'}
                    </span>
                    {x.indispo && <Icon name="ban" size={11}/>}
                  </div>
                  <div style={{ marginTop: 2 }}><FuncBadge funcId={x.funcId}/></div>
                </div>
                {x.indispo && (
                  <span style={{ fontSize: 9.5, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.danger, background: MEVAM_COLORS.dangerSoft, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.6, flexShrink: 0 }}>
                    Conflito
                  </span>
                )}
              </button>

              {/* ── × remover (sibling, não aninhado) ── */}
              {isAdmin && x.membro && (
                <button
                  onClick={() => handleSave(x.funcId, null)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 8, padding: '5px 6px', cursor: 'pointer', color: MEVAM_COLORS.mutedSoft, display: 'flex', alignItems: 'center', flexShrink: 0, touchAction: 'manipulation' }}
                  title="Remover do slot"
                >
                  <Icon name="x" size={13}/>
                </button>
              )}
            </div>
          ))}

          {isAdmin && slotsVazios > 0 && (
            <div style={{ marginTop: 4, fontSize: 11, color: MEVAM_COLORS.accent, fontFamily: 'Manrope', textAlign: 'center', opacity: 0.7 }}>
              Toque em um slot para escalar um membro
            </div>
          )}
        </div>
      )}

      {/* modal de seleção (portal → document.body) */}
      {slotPicker && (
        <SlotPickerModal
          funcId={slotPicker.funcId}
          culto={culto}
          state={state}
          equipe={equipe}
          onSelect={(membroId) => handleSave(slotPicker.funcId, membroId)}
          onClose={() => setSlotPicker(null)}
        />
      )}
    </Card>
  );
}

// ════════════════════════════════════════════════════════════
// DISPONIBILIDADE
// ════════════════════════════════════════════════════════════
function DisponibilidadeScreen({ state, dispatch, usuario, onToast, equipe }) {
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
  return <AdminDisponibilidadeView state={state} dispatch={dispatch} usuario={usuario} onToast={onToast} equipe={equipe} />;
}

function AdminDisponibilidadeView({ state, dispatch, usuario, onToast, equipe }) {
  const [membroSel, setMembroSel] = useState(null);
  const [datas, setDatas] = useState(new Set());
  const [motivo, setMotivo] = useState('');
  const [limpando, setLimpando] = useState(false);
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  const membrosAtivos = state.membros.filter((m) => m.status === 'ativo' && m.equipe_id === equipe?.id);

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
    dispatch({ type: 'add_indispo', usuarioId: membroSel, datas: [...datas], motivo });
    const m = state.membros.find((x) => x.id === membroSel);
    const nome = m?.nome?.split(' ')[0] || 'Membro';
    onToast(`${datas.size} data(s) registrada(s) para ${nome}`, 'ok');
    setDatas(new Set()); setMotivo('');
  };

  const handleLimpar = async () => {
    if (!membroSel) { setDatas(new Set()); setMotivo(''); return; }
    if (limpando) return;
    setLimpando(true);
    try {
      await dispatch({ type: 'clear_indispo_membro', usuarioId: membroSel });
      const m = state.membros.find((x) => x.id === membroSel);
      onToast(`Todas as datas de ${m?.nome?.split(' ')[0] || 'Membro'} foram removidas`, 'ok');
    } catch (e) {
      onToast('Erro ao limpar: ' + (e.message || 'tente novamente'), 'err');
    } finally {
      setDatas(new Set()); setMotivo('');
      setLimpando(false);
    }
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

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="ghost" onClick={handleLimpar} disabled={limpando}>
            {limpando ? 'Limpando…' : 'Limpar'}
          </Btn>
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
function MembrosScreen({ state, dispatch, usuario, equipe, onToast }) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);

  const membrosEquipe = state.membros.filter((m) => m.equipe_id === equipe?.id);

  const filtrados = membrosEquipe.filter((m) => {
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
          {membrosEquipe.filter((m) => m.status === 'ativo').length} ativos · {membrosEquipe.length} no total
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
// ════════════════════════════════════════════════════════════
// MODAL — Adicionar culto manual (sexta / sábado)
// ════════════════════════════════════════════════════════════
function AddCultoModal({ onClose, onConfirm }) {
  const [data, setData] = React.useState('');
  const [horario, setHorario] = React.useState('20:00');
  const [titulo, setTitulo] = React.useState('');

  const opcoesData = React.useMemo(() => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const fmt = (d) => d.toISOString().slice(0, 10);
    const result = [];
    for (let i = 1; i <= 56; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      const dow = d.getDay();
      if (dow === 5 || dow === 6) result.push({ iso: fmt(d), dow });
    }
    return result.slice(0, 14);
  }, []);

  const canConfirm = data && horario && titulo.trim();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,5,12,0.82)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#0D1526', borderRadius: '24px 24px 0 0',
        border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none',
        padding: '0 0 calc(110px + env(safe-area-inset-bottom))',
        animation: 'slideUp .3s ease',
        maxHeight: '85dvh', overflowY: 'auto',
      }} onClick={(e) => e.stopPropagation()}>

        {/* handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: MEVAM_COLORS.border }} />
        </div>

        <div style={{ padding: '0 18px 20px' }}>
          <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 20, color: MEVAM_COLORS.text, marginBottom: 4 }}>
            + Adicionar culto eventual
          </div>
          <div style={{ fontSize: 12, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginBottom: 20, lineHeight: 1.5 }}>
            Apenas sextas e sábados. A escala será montada manualmente pelo admin.
          </div>

          {/* Data */}
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
            Data
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {opcoesData.map((op) => {
              const d = formatBRDate(op.iso);
              const isSab = op.dow === 6;
              const active = data === op.iso;
              return (
                <button key={op.iso} onClick={() => setData(op.iso)} style={{
                  padding: '8px 12px', borderRadius: 12,
                  background: active ? MEVAM_COLORS.accent : MEVAM_COLORS.card,
                  border: `1px solid ${active ? MEVAM_COLORS.accent : MEVAM_COLORS.border}`,
                  color: active ? '#fff' : MEVAM_COLORS.text,
                  fontFamily: 'Manrope', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 58,
                  transition: 'all .15s',
                }}>
                  <span style={{ fontSize: 10, opacity: 0.7, color: isSab ? '#10B981' : '#F59E0B' }}>{isSab ? 'Sáb' : 'Sex'}</span>
                  <span>{d.dia} {d.mes}</span>
                </button>
              );
            })}
          </div>

          {/* Horário */}
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
            Horário
          </div>
          <input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`,
              color: MEVAM_COLORS.text, fontFamily: 'Manrope', fontSize: 15,
              marginBottom: 16, outline: 'none',
            }}
          />

          {/* Título */}
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
            Título do culto
          </div>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Congresso, Seminário, Culto Especial…"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`,
              color: MEVAM_COLORS.text, fontFamily: 'Manrope', fontSize: 15,
              marginBottom: 20, outline: 'none',
            }}
          />

          <Btn variant="accent" full
            onClick={() => { if (canConfirm) { onConfirm({ data, horario, titulo: titulo.trim() }); onClose(); } }}
            style={{ opacity: canConfirm ? 1 : 0.45 }}>
            Adicionar culto
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MODAL — Gerenciar Administradores
// ════════════════════════════════════════════════════════════
function GerenciarAdminsModal({ state, dispatch, equipe, usuario, onToast, onClose }) {
  const [busca, setBusca] = React.useState('');
  const [confirmando, setConfirmando] = React.useState(null);
  const [salvando, setSalvando] = React.useState(false);

  const adminPrincipalId = equipe?.criado_por;
  const admins = state.membros.filter((m) => m.perfil === 'admin' && m.equipe_id === equipe?.id);
  const membrosNaoAdmin = state.membros.filter((m) => {
    if (m.perfil === 'admin') return false;
    if (m.equipe_id !== equipe?.id) return false;
    if (m.status !== 'ativo') return false;
    if (!busca.trim()) return true;
    return m.nome.toLowerCase().includes(busca.trim().toLowerCase());
  });

  const promoverAdmin = async (membro) => {
    if (salvando) return;
    setSalvando(true);
    try {
      await dispatch({ type: 'update_membro', id: membro.id, updates: { perfil: 'admin' } });
      onToast(`${membro.nome} agora é administrador!`, 'ok');
      setConfirmando(null);
    } catch (e) {
      onToast('Erro ao promover: ' + (e.message || 'tente novamente'), 'err');
    } finally { setSalvando(false); }
  };

  const removerAdmin = async (membro) => {
    if (membro.id === adminPrincipalId || salvando) return;
    setSalvando(true);
    try {
      await dispatch({ type: 'update_membro', id: membro.id, updates: { perfil: 'membro' } });
      onToast(`${membro.nome} removido de administrador.`, 'ok');
    } catch (e) {
      onToast('Erro ao remover: ' + (e.message || 'tente novamente'), 'err');
    } finally { setSalvando(false); }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(2,5,12,0.88)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          background: '#0D1526', borderRadius: '24px 24px 0 0',
          border: `1px solid ${MEVAM_COLORS.borderHi}`, borderBottom: 'none',
          padding: '0 0 calc(110px + env(safe-area-inset-bottom))',
          animation: 'slideUp .25s ease', maxHeight: '84dvh', overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: MEVAM_COLORS.border }} />
        </div>

        <div style={{ padding: '0 18px 20px' }}>
          {/* cabeçalho */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
              <Icon name="shield" size={18}/>
            </div>
            <div>
              <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 20, color: MEVAM_COLORS.text }}>
                Gerenciar Administradores
              </div>
              <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2 }}>
                {admins.length} admin{admins.length !== 1 ? 's' : ''} na equipe
              </div>
            </div>
          </div>

          {/* confirmação inline de promoção */}
          {confirmando && (
            <div style={{ padding: 14, borderRadius: 14, background: 'rgba(91,127,255,0.08)', border: `1px solid ${MEVAM_COLORS.accent}44`, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Avatar iniciais={confirmando.iniciais} tom={confirmando.tom} size={32} foto={confirmando.foto} />
                <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 600, lineHeight: 1.4 }}>
                  Tornar <span style={{ color: MEVAM_COLORS.accent }}>{confirmando.nome}</span> administrador?
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn variant="ghost" full onClick={() => setConfirmando(null)}>Cancelar</Btn>
                <Btn variant="accent" full onClick={() => promoverAdmin(confirmando)}>
                  {salvando ? 'Salvando…' : 'Confirmar'}
                </Btn>
              </div>
            </div>
          )}

          {/* lista de admins atuais */}
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
            Administradores atuais
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
            {admins.length === 0 && (
              <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 12.5, textAlign: 'center', padding: '10px 0' }}>Nenhum admin ainda.</div>
            )}
            {admins.map((m) => {
              const isPrincipal = m.id === adminPrincipalId;
              const isSelf = m.id === usuario.id;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 13, background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}` }}>
                  <Avatar iniciais={m.iniciais} tom={m.tom} size={34} foto={m.foto} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 600 }}>
                      {m.nome}{isSelf ? ' (você)' : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginTop: 3 }}>
                      <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.accent, background: MEVAM_COLORS.accentSoft, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Admin</span>
                      {isPrincipal && <span style={{ fontSize: 10, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope' }}>· criador</span>}
                    </div>
                  </div>
                  {!isPrincipal && !isSelf && (
                    <button
                      onClick={() => !salvando && removerAdmin(m)}
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '7px 9px', cursor: 'pointer', color: MEVAM_COLORS.danger, display: 'flex', alignItems: 'center' }}
                      title="Remover admin"
                    >
                      <Icon name="trash" size={14}/>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* busca + promoção */}
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
            Promover membro a Admin
          </div>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: MEVAM_COLORS.muted, pointerEvents: 'none' }}>
              <Icon name="search" size={14}/>
            </div>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar membro pelo nome…"
              style={{
                width: '100%', padding: '10px 14px 10px 36px', borderRadius: 12,
                background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`,
                color: MEVAM_COLORS.text, fontFamily: 'Manrope', fontSize: 14, outline: 'none',
              }}
            />
          </div>

          {membrosNaoAdmin.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '14px 0', color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 12.5 }}>
              {busca.trim() ? 'Nenhum membro encontrado.' : 'Todos os membros ativos já são administradores.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {membrosNaoAdmin.map((m) => (
                <button
                  key={m.id}
                  onClick={() => !confirmando && setConfirmando(m)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 13,
                    background: confirmando?.id === m.id ? MEVAM_COLORS.accentSoft : MEVAM_COLORS.card,
                    border: `1px solid ${confirmando?.id === m.id ? MEVAM_COLORS.accent + '66' : MEVAM_COLORS.border}`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
                  }}
                >
                  <Avatar iniciais={m.iniciais} tom={m.tom} size={34} foto={m.foto} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 600 }}>{m.nome}</div>
                    <div style={{ marginTop: 3 }}><FuncBadge funcId={m.func} /></div>
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.accent, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, padding: '4px 10px', borderRadius: 999, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}44` }}>
                    <Icon name="plus" size={11}/> Admin
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ADMIN SCREEN
// ════════════════════════════════════════════════════════════
function AdminScreen({ state, dispatch, usuario, equipe, onToast, onGerarEscala, onAddCultoManual }) {
  const isAdmin = usuario.perfil === 'admin';
  const [showAddCulto, setShowAddCulto] = React.useState(false);
  const [showAdmins, setShowAdmins] = React.useState(false);
  const [showGerarConfirm, setShowGerarConfirm] = React.useState(false);
  const [removendoId, setRemovendoId] = React.useState(null);
  const [removendoLoad, setRemovendoLoad] = React.useState(false);
  const [periodoKey, setPeriodoKey] = React.useState('4'); // semanas padrão (1 mês)

  const PERIODOS = [
    { key: '4',  label: '1 mês'   },
    { key: '13', label: '3 meses' },
    { key: '26', label: '6 meses' },
    { key: '52', label: '1 ano'   },
  ];
  const semanas = parseInt(periodoKey, 10);

  // verifica se há escala com membros já distribuídos
  const temEscalaVigente = React.useMemo(() => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const fmtL = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const inicio = new Date(hoje); inicio.setDate(hoje.getDate() - hoje.getDay());
    const fim = new Date(inicio); fim.setDate(inicio.getDate() + 6);
    const iI = fmtL(inicio); const iF = fmtL(fim);
    return state.cultos.some((c) =>
      c.data >= iI && c.data <= iF &&
      Object.values(c.escalados).some((v) => v !== null)
    );
  }, [state.cultos]);

  const handleGerarClick = () => {
    if (temEscalaVigente) {
      setShowGerarConfirm(true);
    } else {
      onGerarEscala && onGerarEscala(semanas);
    }
  };

  const confirmarRemocaoAdmin = async (membro) => {
    if (removendoLoad) return;
    setRemovendoLoad(true);
    try {
      await dispatch({ type: 'remove_membro', id: membro.id });
      onToast(`${membro.nome} removido da equipe.`, 'ok');
      setRemovendoId(null);
    } catch (e) {
      onToast('Erro ao remover: ' + (e.message || 'tente novamente'), 'err');
    } finally {
      setRemovendoLoad(false);
    }
  };

  // métricas (apenas membros da equipe atual)
  const membrosEquipe = state.membros.filter((m) => m.equipe_id === equipe?.id);
  const equipeIds = new Set(membrosEquipe.map((m) => m.id));
  const ativos = membrosEquipe.filter((m) => m.status === 'ativo').length;
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
          <Icon name="shield" size={12}/> {isAdmin ? 'Painel do administrador' : 'Visão geral'}
        </div>
        <h2 style={{ margin: '12px 0 4px', fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 600, fontSize: 26, color: MEVAM_COLORS.text, letterSpacing: -0.6 }}>
          {isAdmin ? 'Painel admin' : 'Visão geral'}
        </h2>
      </div>

      {/* stats grid */}
      <div style={{ padding: '14px 18px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Stat label="Membros ativos" value={ativos} accent={MEVAM_COLORS.accent} sub={`${membrosEquipe.length} total`} />
        <Stat label="Cultos agendados" value={state.cultos.filter((c) => c.data >= new Date().toISOString().slice(0,10)).length} accent="#7C5CFF" sub="a partir de hoje" />
        <Stat label="Conflitos" value={conflitos} accent={conflitos > 0 ? MEVAM_COLORS.danger : MEVAM_COLORS.ok} sub={conflitos > 0 ? 'requer revisão' : 'tudo limpo'} />
        <Stat label="Slots vazios" value={vazios} accent={vazios > 0 ? '#F39C12' : MEVAM_COLORS.ok} sub={vazios > 0 ? 'precisam cobertura' : 'completo'} />
      </div>

      {/* auto-gerador — somente admin / info para membros */}
      {isAdmin ? (
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{
            position: 'relative', borderRadius: 18,
            /* overflow:hidden removido — impedia o border-radius dos botões internos */
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
                  Respeita funções, indisponibilidades e distribui a carga entre os membros.
                </div>
              </div>
            </div>

            {/* ── Seletor de período ── */}
            {!showGerarConfirm && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>
                  Período
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {PERIODOS.map((p) => (
                    <button key={p.key} onClick={() => setPeriodoKey(p.key)} style={{
                      flex: 1, padding: '8px 4px', borderRadius: 10,
                      fontFamily: 'Manrope', fontSize: 12, fontWeight: 600,
                      background: periodoKey === p.key ? MEVAM_COLORS.accentSoft : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${periodoKey === p.key ? MEVAM_COLORS.accent + '99' : MEVAM_COLORS.border}`,
                      color: periodoKey === p.key ? '#A8BBFF' : MEVAM_COLORS.muted,
                      cursor: 'pointer', transition: 'all .15s',
                    }}>{p.label}</button>
                  ))}
                </div>
              </div>
            )}

            {showGerarConfirm ? (
              <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div style={{ fontFamily: 'Manrope', fontSize: 13, color: MEVAM_COLORS.text, fontWeight: 600, lineHeight: 1.5, marginBottom: 12 }}>
                  Já existe uma escala para este período. Deseja substituí-la?{' '}
                  <span style={{ color: MEVAM_COLORS.danger, fontWeight: 500 }}>Os dados atuais serão perdidos.</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="ghost" style={{ flex: 1 }} onClick={() => setShowGerarConfirm(false)}>Cancelar</Btn>
                  <Btn variant="danger" style={{ flex: 1, whiteSpace: 'nowrap' }} icon={<Icon name="sparkles" size={13}/>} onClick={() => { setShowGerarConfirm(false); onGerarEscala && onGerarEscala(semanas); }}>
                    Sim, substituir
                  </Btn>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Btn variant="accent" full icon={<Icon name="sparkles" size={14}/>} onClick={handleGerarClick}>Gerar agora</Btn>
                <Btn variant="ghost" icon={<Icon name="shield" size={14}/>} style={{ borderColor: `${MEVAM_COLORS.accent}55`, color: '#A8BBFF', flexShrink: 0 }} onClick={() => setShowAdmins(true)}>Admin +</Btn>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: '18px 18px 0' }}>
          <Card style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8BBFF', flexShrink: 0 }}>
                <Icon name="shield" size={16}/>
              </div>
              <div>
                <div style={{ fontSize: 13, fontFamily: 'Manrope', color: MEVAM_COLORS.text, fontWeight: 600 }}>Modo visualização</div>
                <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2, lineHeight: 1.45 }}>Apenas administradores podem gerar e editar a escala.</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* cultos eventuais (sex/sáb) */}
      {isAdmin && (
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="calendar" size={12}/> Cultos eventuais
            </div>
            <button onClick={() => setShowAddCulto(true)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: MEVAM_COLORS.accentSoft, border: `1px solid ${MEVAM_COLORS.accent}55`,
              color: '#A8BBFF', fontFamily: 'Manrope', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <Icon name="plus" size={13}/> Adicionar
            </button>
          </div>
          {(() => {
            const eventuais = state.cultos
              .filter((c) => { const dow = new Date(c.data + 'T00:00:00').getDay(); return dow === 5 || dow === 6; })
              .sort((a, b) => a.data.localeCompare(b.data));
            if (eventuais.length === 0) {
              return (
                <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13, textAlign: 'center', padding: '14px 0 4px' }}>
                  Nenhum culto eventual agendado.
                </div>
              );
            }
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {eventuais.map((c) => {
                  const d = formatBRDate(c.data);
                  const dow = new Date(c.data + 'T00:00:00').getDay();
                  const tagColor = dow === 6 ? '#10B981' : '#F59E0B';
                  return (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}` }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: tagColor + '22', border: `1px solid ${tagColor}44`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: tagColor, fontFamily: 'Manrope' }}>{dow === 6 ? 'Sáb' : 'Sex'}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: MEVAM_COLORS.text, fontFamily: 'Manrope', lineHeight: 1 }}>{d.dia}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: MEVAM_COLORS.text, fontWeight: 600 }}>{c.titulo}</div>
                        <div style={{ fontSize: 11.5, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', marginTop: 2 }}>{d.diaSemana}, {d.dia} {d.mes} · {c.horario}</div>
                      </div>
                      <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, background: tagColor + '22', color: tagColor, fontFamily: 'Manrope', fontWeight: 700 }}>Manual</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* membros da equipe — remoção */}
      {isAdmin && (
        <div style={{ padding: '18px 18px 0' }}>
          <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="users" size={12}/> Membros da equipe ({state.membros.filter((m) => m.equipe_id === equipe?.id).length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.membros.filter((m) => m.equipe_id === equipe?.id).map((m) => {
              const isPrincipal = m.id === equipe?.criado_por;
              const isSelf = m.id === usuario.id;
              const podeRemover = !isPrincipal && !isSelf;
              const isRemovendoEste = removendoId === m.id;
              return (
                <div key={m.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: MEVAM_COLORS.card, border: `1px solid ${isRemovendoEste ? 'rgba(239,68,68,0.35)' : MEVAM_COLORS.border}`, borderRadius: isRemovendoEste ? '14px 14px 0 0' : 14 }}>
                    <Avatar iniciais={m.iniciais} tom={m.tom} size={36} foto={m.foto} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 13.5, color: MEVAM_COLORS.text, fontWeight: 600 }}>
                        {m.nome}{isSelf ? ' (você)' : ''}
                      </div>
                      <div style={{ display: 'flex', gap: 5, marginTop: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                        <FuncBadge funcId={m.func} />
                        {m.perfil === 'admin' && <span style={{ fontSize: 10, fontFamily: 'Manrope', fontWeight: 700, color: MEVAM_COLORS.accent, background: MEVAM_COLORS.accentSoft, padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Admin</span>}
                        {isPrincipal && <span style={{ fontSize: 10, color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope' }}>· criador</span>}
                      </div>
                    </div>
                    {podeRemover && !isRemovendoEste && (
                      <button
                        onClick={() => setRemovendoId(m.id)}
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, padding: '7px 9px', cursor: 'pointer', color: MEVAM_COLORS.danger, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                        title="Remover da equipe"
                      >
                        <Icon name="trash" size={14}/>
                      </button>
                    )}
                    {podeRemover && isRemovendoEste && (
                      <button
                        onClick={() => setRemovendoId(null)}
                        style={{ background: MEVAM_COLORS.card, border: `1px solid ${MEVAM_COLORS.border}`, borderRadius: 9, padding: '7px 9px', cursor: 'pointer', color: MEVAM_COLORS.muted, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                      >
                        <Icon name="x" size={14}/>
                      </button>
                    )}
                  </div>
                  {isRemovendoEste && (
                    <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderTop: 'none', borderRadius: '0 0 14px 14px' }}>
                      <div style={{ fontFamily: 'Manrope', fontSize: 12.5, color: MEVAM_COLORS.text, lineHeight: 1.5, marginBottom: 10 }}>
                        Remover <span style={{ color: MEVAM_COLORS.danger, fontWeight: 700 }}>{m.nome}</span> da equipe? Essa ação não pode ser desfeita.
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn variant="ghost" full onClick={() => setRemovendoId(null)}>Cancelar</Btn>
                        <Btn variant="danger" full icon={<Icon name="trash" size={13}/>} onClick={() => confirmarRemocaoAdmin(m)}>
                          {removendoLoad ? 'Removendo…' : 'Confirmar'}
                        </Btn>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* conflitos — somente admin */}
      {isAdmin && conflitosLista.length > 0 && (
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

      {/* lembretes ativos — somente admin */}
      {isAdmin && (() => {
        const lembretes = Object.entries(state.indispo).sort().flatMap(([iso, entries]) =>
          entries.filter((e) => e.lembrete && equipeIds.has(e.membroId)).map((e) => ({ iso, ...e }))
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

      {/* modal adicionar culto */}
      {showAddCulto && (
        <AddCultoModal
          onClose={() => setShowAddCulto(false)}
          onConfirm={(payload) => { onAddCultoManual && onAddCultoManual(payload); }}
        />
      )}

      {/* modal gerenciar admins */}
      {showAdmins && (
        <GerenciarAdminsModal
          state={state}
          dispatch={dispatch}
          equipe={equipe}
          usuario={usuario}
          onToast={onToast}
          onClose={() => setShowAdmins(false)}
        />
      )}

      {/* indisponibilidades registradas — somente admin */}
      {isAdmin && <div style={{ padding: '18px 18px 28px' }}>
        <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
          Indisponibilidades registradas
        </div>
        {Object.keys(state.indispo).length === 0 ? (
          <div style={{ color: MEVAM_COLORS.mutedSoft, fontFamily: 'Manrope', fontSize: 13, textAlign: 'center', padding: 20 }}>
            Nenhuma indisponibilidade ainda.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(state.indispo).sort().slice(0, 8).flatMap(([iso, entries]) => entries.filter((e) => equipeIds.has(e.membroId)).map((e, j) => {
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
      </div>}

    </div>
  );
}

// ════════════════════════════════════════════════════════════
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
  const [uploadando, setUploadando] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const fotoInputRef = useRef(null);

  // ── Carrega foto ao abrir perfil e sincroniza quando state.membros muda ──
  useEffect(() => {
    if (membro.nome) setNome(membro.nome);
    if (membro.func) setFuncPrincipal(membro.func);
    if (membro.secundarias) setFuncsSecundarias(membro.secundarias);
    if (membro.tom) setTomSel(membro.tom);
    if (membro.foto !== undefined) setFoto(membro.foto || null);
  }, [membro.id]);

  // ── Upload direto do File — sem base64, sem crop, funciona em iOS/Android ──
  const handleFotoChange = async (e) => {
    const arquivo = e.target.files[0];
    e.target.value = ''; // permite reselecionar o mesmo arquivo
    if (!arquivo) return;
    if (arquivo.size > 15 * 1024 * 1024) { onToast('Imagem muito grande (máx 15 MB)', 'warn'); return; }

    setUploadando(true);
    try {
      console.log('[MEVAM] Arquivo selecionado:', arquivo.name, `(${(arquivo.size/1024).toFixed(1)} KB, ${arquivo.type})`);

      // 1. Upload para Supabase Storage
      const urlPublica = await sbUploadAvatar(usuario.id, arquivo);

      // 2. Salvar URL no banco
      const { error: dbErr } = await SB.from('membros').update({ foto: urlPublica }).eq('id', usuario.id);
      if (dbErr) { console.error('[MEVAM] Erro banco:', dbErr); throw dbErr; }

      // 3. Confirmar que foi salvo
      const { data: conf } = await SB.from('membros').select('foto').eq('id', usuario.id).single();
      console.log('[MEVAM] Banco confirmado:', conf?.foto);

      // 4. Atualizar tela imediatamente
      const urlFinal = conf?.foto || urlPublica;
      setFoto(urlFinal);
      dispatch({ type: 'update_membro', id: usuario.id, updates: { foto: urlFinal } });
      onToast('Foto atualizada com sucesso!', 'ok');
    } catch (err) {
      console.error('[MEVAM] Erro completo upload:', err);
      onToast('Erro: ' + (err.message || 'Tente novamente'), 'err');
    } finally {
      setUploadando(false);
    }
  };

  const handleRemoverFoto = async () => {
    if (!window.confirm('Deseja remover sua foto de perfil?')) return;
    try {
      // Apaga o arquivo do Storage (extrai path do bucket a partir da URL)
      if (foto) {
        const path = foto.split('/avatars/')[1]?.split('?')[0];
        if (path) {
          const { error: storErr } = await SB.storage.from('avatars').remove([path]);
          if (storErr) console.warn('[MEVAM] Storage remove:', storErr.message);
        }
      }
      await SB.from('membros').update({ foto: null }).eq('id', usuario.id);
      setFoto(null);
      dispatch({ type: 'update_membro', id: usuario.id, updates: { foto: null } });
      onToast('Foto removida', 'ok');
    } catch (err) {
      console.error('[MEVAM] Erro ao remover foto:', err);
      onToast('Erro ao remover foto', 'err');
    }
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
    if (saveState === 'saving') return;
    const ini = iniciais(nome);
    const secundariasLimpas = funcsSecundarias.filter((f) => f !== funcPrincipal);
    setSaveState('saving');
    try {
      await dispatch({ type: 'update_membro', id: usuario.id, updates: { nome: nome.trim(), iniciais: ini, func: funcPrincipal, secundarias: secundariasLimpas, tom: tomSel, foto } });
      onUpdateUsuario({ nome: nome.trim() });
      onToast('Perfil atualizado com sucesso!', 'ok');
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (e) {
      onToast('Erro ao salvar: ' + (e.message || 'tente novamente'), 'err');
      setSaveState('idle');
    }
  };

  return (
    <div style={{ ...screenWrap, padding: '0 0 120px' }}>

      {/* hero do perfil */}
      <div style={{ padding: '32px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, background: `radial-gradient(80% 50% at 50% 0%, ${tomSel}22 0%, transparent 70%)`, position: 'relative' }}>

        {/* input oculto — acionado via ref (funciona em iOS/Android/Desktop) */}
        <input
          ref={fotoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFotoChange}
        />

        <div style={{ position: 'relative' }}>
          {/* avatar clicável — button + ref.click() funciona em todos os browsers mobile */}
          <button
            onClick={() => fotoInputRef.current?.click()}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: 999, display: 'block' }}>
            <Avatar iniciais={iniciais(nome) || '?'} tom={tomSel} size={90} ring foto={foto} />
            {/* overlay câmera / spinner */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: uploadando ? 1 : 0, transition: 'opacity .2s' }}
              onMouseEnter={(e) => { if (!uploadando) e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { if (!uploadando) e.currentTarget.style.opacity = '0'; }}>
              {uploadando
                ? <div style={{ width: 24, height: 24, borderRadius: 999, border: '2.5px solid rgba(255,255,255,0.85)', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
                : <Icon name="camera" size={22} />}
            </div>
          </button>

          {/* badge 📷 câmera — esquerda (ou centralizado se não tiver foto) */}
          <button
            onClick={(e) => { e.stopPropagation(); fotoInputRef.current?.click(); }}
            style={{
              position: 'absolute', bottom: 0,
              ...(foto ? { left: 0 } : { left: '50%', transform: 'translateX(-50%)' }),
              width: 30, height: 30, borderRadius: 999,
              background: tomSel, border: '2.5px solid #04081A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
            <Icon name="camera" size={13} />
          </button>

          {/* badge 🗑️ lixeira — direita, só aparece se tiver foto */}
          {foto && !uploadando && (
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoverFoto(); }}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 30, height: 30, borderRadius: 999,
                background: 'rgba(4,8,26,0.88)',
                border: `2.5px solid ${MEVAM_COLORS.danger}88`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: MEVAM_COLORS.danger,
              }}>
              <Icon name="trash" size={13} />
            </button>
          )}
        </div>

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
                placeholder="Seu nome completo" style={inputStyle} />
            </Field>
            <div>
              <div style={{ fontSize: 11, color: MEVAM_COLORS.muted, fontFamily: 'Manrope', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Cor do avatar</div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
                {cores.map((c) => (
                  <button key={c} onClick={() => setTomSel(c)} style={{
                    width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                    background: c, cursor: 'pointer', transition: 'all .15s',
                    border: tomSel === c ? `2.5px solid #fff` : '2px solid transparent',
                    boxShadow: tomSel === c ? `0 0 0 1.5px ${c}, 0 0 8px ${c}88` : 'none',
                    transform: tomSel === c ? 'scale(1.2)' : 'scale(1)',
                  }} />
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
        <Btn variant="accent" full
          icon={saveState === 'idle' ? <Icon name="check" size={15}/> : null}
          onClick={salvar}
          disabled={saveState === 'saving'}
          style={{ padding: '14px 18px', fontSize: 15, borderRadius: 16 }}>
          {saveState === 'saving' ? 'Salvando...' : saveState === 'saved' ? '✓ Salvo!' : 'Salvar alterações'}
        </Btn>

        {/* ── Sair ── */}
        <div style={{ borderTop: `1px solid ${MEVAM_COLORS.border}`, paddingTop: 18 }}>
          <Btn variant="danger" full icon={<Icon name="logout" size={15}/>}
            onClick={() => { if (window.confirm('Deseja mesmo sair da conta?')) onLogout(); }}
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

Object.assign(window, { LoginScreen, SetupScreen, EscalaScreen, DisponibilidadeScreen, MembrosScreen, AdminScreen, PerfilScreen });
