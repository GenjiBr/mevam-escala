// MEVAM Escala — Supabase client + helpers
// ⚙️  Preencha as duas constantes abaixo:
//     Supabase → Project Settings → API
// ─────────────────────────────────────────

const SUPABASE_URL  = 'https://jjjzrfpwrxhbndjtugyk.supabase.co';  // ✓
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqanpyZnB3cnhoYm5kanR1Z3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MzkyOTcsImV4cCI6MjA5NTMxNTI5N30.S5ey-183J9QuBlyrHqduySYTOA7tcbfvjC-AZrBGipk'; // ✓

window.SB = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

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
  }));
};

window.sbGetCultos = async () => {
  const { data, error } = await SB.from('cultos').select('*').order('data').order('horario');
  if (error) { console.error('sbGetCultos:', error.message); return []; }
  return (data || []).map((c) => ({ ...c, escalados: c.escalados || {} }));
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

/* semeia os cultos iniciais (chamado pelo admin na primeira execução) */
window.sbSeedCultos = async () => {
  for (const c of (window.CULTOS_INICIAIS || [])) {
    await sbUpsertCulto(c);
  }
};
