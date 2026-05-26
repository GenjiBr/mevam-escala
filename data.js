// MEVAM Escala — dados mockados
// Sistema de funções do louvor + pregação
window.FUNCOES = {
  ministro:      { label: 'Min. de Louvor',  color: '#F39C12', icon: '⭐',  short: 'ML' },
  vocal_backing: { label: 'Vocal / Backing', color: '#8E44AD', icon: '🎵',  short: 'VB' },
  guitarra:      { label: 'Guitarra',        color: '#E67E22', icon: '🎸',  short: 'GT' },
  baixo:         { label: 'Baixo',           color: '#3B6FB5', icon: '🎸',  short: 'BX' },
  bateria:       { label: 'Bateria',         color: '#E74C3C', icon: '🥁',  short: 'BT' },
  teclado:       { label: 'Teclado',         color: '#2980B9', icon: '🎹',  short: 'TC' },
  violao:        { label: 'Violão',          color: '#27AE60', icon: '🎸',  short: 'VL' },
  telao:         { label: 'Telão',           color: '#6366F1', icon: '🖥️',  short: 'TL' },
  live:          { label: 'Live',            color: '#EF4444', icon: '📡',  short: 'LV' },
  story:         { label: 'Story',           color: '#EC4899', icon: '📱',  short: 'ST' },
  camera_fixa:   { label: 'Câmera Fixa',     color: '#10B981', icon: '🎥',  short: 'CF' },
};

window.MEMBROS_INICIAIS = [
  { id: 'm1',  nome: 'Lucas Andrade',   iniciais: 'LA', func: 'ministro',      secundarias: ['vocal_backing','violao'], status: 'ativo',     tom: '#F39C12' },
  { id: 'm2',  nome: 'Daniel Costa',    iniciais: 'DC', func: 'ministro',      secundarias: ['violao'],                status: 'ativo',     tom: '#F39C12' },
  { id: 'm3',  nome: 'Maria Helena',    iniciais: 'MH', func: 'vocal_backing', secundarias: [],                        status: 'ativo',     tom: '#8E44AD' },
  { id: 'm4',  nome: 'Bruno Vieira',    iniciais: 'BV', func: 'guitarra',      secundarias: ['violao'],                status: 'ativo',     tom: '#E67E22' },
  { id: 'm5',  nome: 'Rafael Lima',     iniciais: 'RL', func: 'baixo',         secundarias: [],                        status: 'ativo',     tom: '#3B6FB5' },
  { id: 'm6',  nome: 'Tiago Mendes',    iniciais: 'TM', func: 'bateria',       secundarias: [],                        status: 'ativo',     tom: '#E74C3C' },
  { id: 'm7',  nome: 'Ana Carolina',    iniciais: 'AC', func: 'teclado',       secundarias: ['vocal_backing'],         status: 'ativo',     tom: '#2980B9' },
  { id: 'm8',  nome: 'Pedro Henrique',  iniciais: 'PH', func: 'violao',        secundarias: ['vocal_backing'],         status: 'ativo',     tom: '#27AE60' },
  { id: 'm9',  nome: 'Camila Rocha',    iniciais: 'CR', func: 'vocal_backing', secundarias: [],                        status: 'ativo',     tom: '#8E44AD' },
  { id: 'm10', nome: 'Marcos Silva',    iniciais: 'MS', func: 'ministro',      secundarias: [],                        status: 'ativo',     tom: '#F39C12' },
  { id: 'm11', nome: 'Davi Souza',      iniciais: 'DS', func: 'live',          secundarias: ['camera_fixa'],           status: 'ativo',     tom: '#EF4444' },
  { id: 'm12', nome: 'Letícia Borges',  iniciais: 'LB', func: 'telao',         secundarias: ['story'],                 status: 'ativo',     tom: '#6366F1' },
  { id: 'm13', nome: 'João Vitor',      iniciais: 'JV', func: 'vocal_backing', secundarias: ['violao'],                status: 'visitante', tom: '#8E44AD' },
  { id: 'm14', nome: 'Beatriz Nunes',   iniciais: 'BN', func: 'story',         secundarias: [],                        status: 'inativo',   tom: '#EC4899' },
];

const HOJE = new Date(); HOJE.setHours(0,0,0,0);
const fmt = (d) => d.toISOString().slice(0, 10);

window.HOJE_ISO = fmt(HOJE);

// Retorna as próximas N ocorrências de um dia da semana (0=dom … 6=sáb)
function getNextOccurrences(weekday, count) {
  const dates = [];
  const d = new Date(HOJE);
  const diff = ((weekday - d.getDay()) + 7) % 7 || 7; // sempre a PRÓXIMA, nunca hoje
  d.setDate(d.getDate() + diff);
  for (let i = 0; i < count; i++) {
    dates.push(fmt(new Date(d)));
    d.setDate(d.getDate() + 7);
  }
  return dates;
}

// Escalados vazios (preenchidos pelo admin depois)
const ESC_VAZIO = { ministro: null, vocal_backing: null, guitarra: null, baixo: null,
  bateria: null, teclado: null, violao: null, telao: null, live: null, story: null, camera_fixa: null };

// 2º domingo do mês: dia entre 8 e 14
const isSegundoDomingo = (iso) => { const d = parseInt(iso.split('-')[2], 10); return d >= 8 && d <= 14; };

window.CULTOS_INICIAIS = [
  // Quintas-feiras — Culto Profético (fixo)
  ...getNextOccurrences(4, 4).map((data) => ({
    id: `qui_${data}`, data, horario: '20:00', titulo: 'Culto Profético',
    cor: '#7C5CFF', escalados: { ...ESC_VAZIO },
  })),
  // Domingos — Culto da Família ou Ceia (2º domingo)
  ...getNextOccurrences(0, 4).map((data) => ({
    id: `dom_${data}`, data, horario: '19:00',
    titulo: isSegundoDomingo(data) ? 'Ceia' : 'Culto da Família',
    cor: '#3B82F6', escalados: { ...ESC_VAZIO },
  })),
  // Sexta e sábado NÃO são gerados automaticamente — adicionados pelo admin
];

// indisponibilidades iniciais (vazio — dados reais vêm do Supabase)
window.INDISPO_INICIAIS = {};

window.USUARIO_PADRAO = { id: 'm1', nome: 'Lucas Andrade', perfil: 'admin' };

// helpers globais
window.formatBRDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return { dia: d, mes: meses[m-1], diaSemana: dias[dt.getDay()], ano: y };
};
