// MEVAM Escala — Supabase client + helpers
// ⚙️  Preencha as duas constantes abaixo:
//     Supabase → Project Settings → API
// ─────────────────────────────────────────

const SUPABASE_URL  = 'https://jjjzrfpwrxhbndjtugyk.supabase.co';  // ✓
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqanpyZnB3cnhoYm5kanR1Z3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkyOTcsImV4cCI6MjA5NTMxNTI5N30.S5ey-183J9QuBlyrHqduySYTOA7tcbfvjC-AZrBGipk'; // ✓

window.SB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    detectSessionInUrl: true,
    flowType: 'implicit',
  },
});

/* ─────────────────────────────────────────────────
   Leitura
───────────────────────────────────────────────── */
window.sbGetMembros = async () => {
  const { data, error } = await SB.from('membros').select('*').order('nome');
  if (error) { console.error('sbGetMembros:', error.message); return []; }
  return (data || []).map((m) => ({
    id: m.id, nome: m.nome,
    iniciais: m.iniciais || (m.nome || '').trim().split(' ').map((x) => x[0]).filter(Boolean).join('').toUpperCase().slice(0, 2),
    func: m.func || 'vocal_backing',
    secundarias: m.secundarias || [],
    status: m.status || 'ativo',
    tom: m.tom || '#5B7FFF',
    foto: m.foto || null,
    perfil: m.perfil || 'membro',
    email: m.email || null,
    equipe_id: m.equipe_id || null,
    background_url: m.background_url || null,
  }));
};

window.sbGetCultos = async () => {
  const { data, error } = await SB.from('cultos').select('*').order('data').order('horario');
  if (error) { console.error('sbGetCultos:', error.message); return []; }
  return (data || []).map((c) => ({
    ...c,
    titulo: c.titulo === 'Culto da Família' ? 'Celebração da Família' : c.titulo,
    escalados: {
      ...Object.fromEntries(Object.keys(window.FUNCOES || {}).map((k) => [k, null])),
      ...(c.escalados || {}),
    },
    observacao: c.observacao || '',
  }));
};

window.sbGetIndispo = async () => {
  const { data, error } = await SB.from('indisponibilidades').select('*');
  if (error) { console.error('sbGetIndispo:', error.message); return {}; }
  const map = {};
  for (const row of (data || [])) {
    const iso = row.data;
    if (!map[iso]) map[iso] = [];
    map[iso].push({ membroId: row.membro_id, motivo: row.motivo || '', lembrete: row.lembrete || false, _id: row.id });
  }
  return map;
};

/* ─────────────────────────────────────────────────
   Escrita
───────────────────────────────────────────────── */
window.sbUpdateMembro = async (id, updates) => {
  const { error, count } = await SB.from('membros').update(updates, { count: 'exact' }).eq('id', id);
  if (error) { console.error('sbUpdateMembro:', error.message); throw new Error(error.message); }
  if (count === 0) {
    // linha não existe — tenta inserir como upsert
    const { error: e2 } = await SB.from('membros').upsert({ id, ...updates }, { onConflict: 'id' });
    if (e2) { console.error('sbUpdateMembro upsert:', e2.message); throw new Error(e2.message); }
  }
};

window.sbInsertMembro = async (membro) => {
  const { error } = await SB.from('membros').insert(membro);
  if (error) console.error('sbInsertMembro:', error.message);
  return !error;
};

window.sbUpsertCulto = async (culto) => {
  const { error } = await SB.from('cultos').upsert(culto, { onConflict: 'id' });
  if (error) console.error('sbUpsertCulto:', error.message);
};

window.sbAddIndispo = async ({ membroId, data, motivo, lembrete }) => {
  const { error } = await SB.from('indisponibilidades')
    .upsert({ membro_id: membroId, data, motivo: motivo || '', lembrete: lembrete || false },
             { onConflict: 'membro_id,data' });
  if (error) console.error('sbAddIndispo:', error.message);
};

window.sbRemoveIndispo = async ({ membroId, data }) => {
  const { error } = await SB.from('indisponibilidades')
    .delete().eq('membro_id', membroId).eq('data', data);
  if (error) console.error('sbRemoveIndispo:', error.message);
};

window.sbRemoveAllIndispoMembro = async (membroId) => {
  const { error } = await SB.from('indisponibilidades')
    .delete().eq('membro_id', membroId);
  if (error) console.error('sbRemoveAllIndispoMembro:', error.message);
};

window.sbDeleteCulto = async (cultoId) => {
  const { error } = await SB.from('cultos').delete().eq('id', cultoId);
  if (error) console.error('sbDeleteCulto:', error.message);
};

window.sbDeleteMembro = async (membroId) => {
  const { error } = await SB.from('membros').delete().eq('id', membroId);
  if (error) { console.error('sbDeleteMembro:', error.message); throw new Error(error.message); }
};

/* Remove o usuário de todos os slots de cultos futuros (sair da escala) */
window.sbSairDaEscala = async (usuarioId) => {
  const hoje = new Date().toISOString().slice(0, 10);
  const { data, error } = await SB.from('cultos').select('id,data,escalados').gte('data', hoje);
  if (error) { console.error('sbSairDaEscala:', error.message); return; }
  for (const culto of (data || [])) {
    const escalados = culto.escalados || {};
    let changed = false;
    const novos = {};
    for (const [fid, val] of Object.entries(escalados)) {
      if (Array.isArray(val)) {
        novos[fid] = val.filter((id) => id !== usuarioId);
        if (novos[fid].length !== val.length) changed = true;
      } else if (val === usuarioId) {
        novos[fid] = null; changed = true;
      } else {
        novos[fid] = val;
      }
    }
    if (changed) {
      await SB.from('cultos').update({ escalados: novos }).eq('id', culto.id);
    }
  }
};

/* Apaga todos os cultos da equipe */
window.sbExcluirTodaEscala = async () => {
  const { error } = await SB.from('cultos').delete().gte('data', '2000-01-01');
  if (error) { console.error('sbExcluirTodaEscala:', error.message); throw new Error(error.message); }
};

/* Remove todos os membros da equipe (equipe_id → null) e apaga o registro da equipe */
window.sbExcluirEquipe = async (equipeId) => {
  const { error: e1 } = await SB.from('membros')
    .update({ equipe_id: null, perfil: 'membro' })
    .eq('equipe_id', equipeId);
  if (e1) console.error('sbExcluirEquipe membros:', e1.message);
  const { error: e2 } = await SB.from('equipes').delete().eq('id', equipeId);
  if (e2) { console.error('sbExcluirEquipe equipe:', e2.message); throw new Error(e2.message); }
};

/* Upload da foto de perfil para Supabase Storage (bucket: avatars)
   Recebe um File object direto do <input type="file"> — sem base64, sem crop.
   Funciona em iOS, Android e Desktop sem conversão intermediária.             */
window.sbUploadAvatar = async (userId, arquivo) => {
  const rawExt  = (arquivo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const ext     = rawExt || 'jpg';
  const nome    = `avatar_${userId}_${Date.now()}.${ext}`;

  // Android Chrome (câmera) frequentemente envia arquivo.type vazio — forçar MIME explícito
  const mimeMap = { png: 'image/png', gif: 'image/gif', webp: 'image/webp', heic: 'image/heic', heif: 'image/heif' };
  const contentType = arquivo.type || mimeMap[ext] || 'image/jpeg';

  console.log('[MEVAM] Upload →', nome, `(${(arquivo.size / 1024).toFixed(1)} KB, contentType: ${contentType})`);

  const { data, error } = await SB.storage
    .from('avatars')
    .upload(nome, arquivo, { upsert: true, contentType });
  console.log('[MEVAM] Storage result:', { data, error });
  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = SB.storage.from('avatars').getPublicUrl(nome);
  const urlComBust = `${publicUrl}?t=${Date.now()}`;
  console.log('[MEVAM] URL pública:', urlComBust);
  return urlComBust;
};

/* semeia os cultos iniciais (chamado pelo admin na primeira execução) */
window.sbSeedCultos = async () => {
  for (const c of (window.CULTOS_INICIAIS || [])) {
    await sbUpsertCulto(c);
  }
};

/* ─────────────────────────────────────────────────
   Equipes (espaços de trabalho com código de convite)
───────────────────────────────────────────────── */
window.sbCriarEquipe = async (nome, membroId) => {
  const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
  const { data, error } = await SB.from('equipes')
    .insert({ nome, codigo, criado_por: membroId })
    .select().single();
  if (error) { console.error('sbCriarEquipe:', error.message); throw new Error(error.message); }
  await sbUpdateMembro(membroId, { equipe_id: data.id, perfil: 'admin' });
  return data;
};

window.sbEntrarEquipe = async (codigo, membroId) => {
  const { data, error } = await SB.from('equipes').select('*')
    .eq('codigo', codigo.trim().toUpperCase()).maybeSingle();
  if (error) { console.error('sbEntrarEquipe:', error.message); throw new Error(error.message); }
  if (!data) throw new Error('Código não encontrado. Verifique e tente novamente.');
  await sbUpdateMembro(membroId, { equipe_id: data.id });
  return data;
};

window.sbGetEquipe = async (id) => {
  const { data } = await SB.from('equipes').select('*').eq('id', id).maybeSingle();
  return data || null;
};

/* ─────────────────────────────────────────────────
   Repertório de músicas
───────────────────────────────────────────────── */
window.sbGetMusicas = async () => {
  const { data, error } = await SB.from('musicas').select('*').order('nome');
  if (error) { console.error('sbGetMusicas:', error.message); return []; }
  return data || [];
};

window.sbInsertMusica = async (musica) => {
  const { data, error } = await SB.from('musicas').insert(musica).select('*').single();
  if (error) {
    console.error('[MEVAM] sbInsertMusica:', error.code, error.message);
    throw new Error(error.message);
  }
  return data;
};

window.sbUpdateMusica = async (id, updates) => {
  const { error } = await SB.from('musicas').update(updates).eq('id', id);
  if (error) { console.error('sbUpdateMusica:', error.message); throw new Error(error.message); }
};

window.sbDeleteMusica = async (id) => {
  const { error } = await SB.from('musicas').delete().eq('id', id);
  if (error) { console.error('sbDeleteMusica:', error.message); throw new Error(error.message); }
};

window.sbUpdateCultoMusicas = async (cultoId, musicas) => {
  const { error } = await SB.from('cultos').update({ musicas }).eq('id', cultoId);
  if (error) { console.error('sbUpdateCultoMusicas:', error.message); throw new Error(error.message); }
};

window.sbUpdateCultoObservacao = async (cultoId, observacao) => {
  const { error } = await SB.from('cultos').update({ observacao: observacao || '' }).eq('id', cultoId);
  if (error) { console.error('sbUpdateCultoObservacao:', error.message); throw new Error(error.message); }
};

window.sbUploadAvatarPessoal = async (userId, arquivo) => {
  const rawExt = (arquivo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const ext = rawExt || 'jpg';
  const mimeMap = { png: 'image/png', gif: 'image/gif', webp: 'image/webp' };
  const contentType = arquivo.type || mimeMap[ext] || 'image/jpeg';
  // Usa auth.uid() para compatibilidade com RLS policies no Storage
  const { data: { user } } = await SB.auth.getUser();
  const authId = user?.id || userId;
  const path = `usuarios/${authId}/avatar.${ext}`;
  const { error } = await SB.storage
    .from('avatars-predefinidos')
    .upload(path, arquivo, { upsert: true, contentType });
  if (error) throw new Error(error.message);
  return `path:${path}`;
};

window.sbListAvataresPredefinidos = async () => {
  const { data, error } = await SB.storage
    .from('avatars-predefinidos')
    .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) { console.error('[MEVAM] sbListAvataresPredefinidos:', error?.message); return []; }
  return data
    .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
    .map((f) => `${SUPABASE_URL}/storage/v1/object/public/avatars-predefinidos/${encodeURIComponent(f.name)}`);
};

// Bucket público "backgrounds" — criar no Supabase Storage com as mesmas
// políticas do bucket "avatars-predefinidos" (public read, autenticado write).
// SQL para adicionar a coluna: ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS background_url TEXT;
window.sbListBackgrounds = async () => {
  const { data, error } = await SB.storage
    .from('backgrounds')
    .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) { console.error('[MEVAM] sbListBackgrounds:', error?.message); return []; }
  return data
    .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
    .map((f) => `${SUPABASE_URL}/storage/v1/object/public/backgrounds/${encodeURIComponent(f.name)}`);
};

/* ─────────────────────────────────────────────────
   Historico administrativo
───────────────────────────────────────────────── */
const adminLogLocalKey = (equipeId) => `mevam_admin_logs_${equipeId || 'sem_equipe'}`;

const readLocalAdminLogs = (equipeId) => {
  try { return JSON.parse(localStorage.getItem(adminLogLocalKey(equipeId)) || '[]'); }
  catch { return []; }
};

const writeLocalAdminLog = (log) => {
  const logs = readLocalAdminLogs(log.equipe_id);
  const novo = {
    id: log.id || (crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`),
    criado_em: log.criado_em || new Date().toISOString(),
    ...log,
  };
  localStorage.setItem(adminLogLocalKey(log.equipe_id), JSON.stringify([novo, ...logs].slice(0, 80)));
  return novo;
};

window.sbGetAdminLogs = async (equipeId) => {
  if (!equipeId) return [];
  const { data, error } = await SB.from('admin_logs')
    .select('*')
    .eq('equipe_id', equipeId)
    .order('criado_em', { ascending: false })
    .limit(50);
  if (error) {
    console.warn('[MEVAM] sbGetAdminLogs fallback local:', error.message);
    return readLocalAdminLogs(equipeId);
  }
  const locais = readLocalAdminLogs(equipeId);
  const byId = new Map([...(data || []), ...locais].filter((l) => l?.id).map((l) => [l.id, l]));
  return Array.from(byId.values()).sort((a, b) => (b.criado_em || '').localeCompare(a.criado_em || '')).slice(0, 50);
};

window.sbAddAdminLog = async (log) => {
  const payload = { criado_em: new Date().toISOString(), ...log };
  const { data, error } = await SB.from('admin_logs').insert(payload).select('*').single();
  if (error) {
    console.warn('[MEVAM] sbAddAdminLog fallback local:', error.message);
    return writeLocalAdminLog(payload);
  }
  return data;
};
