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

// gera datas dinâmicas — próximos cultos a partir de hoje
function nextWeekday(from, weekday /* 0=dom, 3=qua */, addWeeks = 0) {
  const d = new Date(from);
  const diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff + addWeeks * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

const HOJE = new Date(); HOJE.setHours(0,0,0,0);
const fmt = (d) => d.toISOString().slice(0, 10);

window.HOJE_ISO = fmt(HOJE);

window.CULTOS_INICIAIS = [
  { id: 'c1', data: fmt(nextWeekday(HOJE, 0, 0)), titulo: 'Culto Domingo Manhã', horario: '09:00', cor: '#3B82F6',
    escalados: { ministro:'m1', vocal_backing:['m3','m9'], guitarra:'m4', baixo:'m5', bateria:'m6', teclado:'m7', violao:'m8', telao:'m12', live:'m11', story:null, camera_fixa:null } },
  { id: 'c2', data: fmt(nextWeekday(HOJE, 0, 0)), titulo: 'Culto Domingo Noite',  horario: '18:30', cor: '#7C5CFF',
    escalados: { ministro:'m2', vocal_backing:['m9','m13'], guitarra:'m4', baixo:'m5', bateria:'m6', teclado:'m7', violao:null, telao:'m12', live:'m11', story:null, camera_fixa:null } },
  { id: 'c3', data: fmt(nextWeekday(HOJE, 3, 0)), titulo: 'Culto de Quarta',      horario: '20:00', cor: '#4FD1C5',
    escalados: { ministro:'m10', vocal_backing:['m9'], guitarra:null, baixo:'m5', bateria:'m6', teclado:'m7', violao:'m8', telao:'m12', live:'m11', story:null, camera_fixa:null } },
  { id: 'c4', data: fmt(nextWeekday(HOJE, 0, 1)), titulo: 'Culto Domingo Manhã', horario: '09:00', cor: '#3B82F6',
    escalados: { ministro:'m1', vocal_backing:['m3','m9'], guitarra:'m4', baixo:'m5', bateria:'m6', teclado:'m7', violao:'m8', telao:'m12', live:'m11', story:null, camera_fixa:null } },
  { id: 'c5', data: fmt(nextWeekday(HOJE, 0, 1)), titulo: 'Culto Domingo Noite',  horario: '18:30', cor: '#7C5CFF',
    escalados: { ministro:'m2', vocal_backing:['m3','m9'], guitarra:'m4', baixo:'m5', bateria:'m6', teclado:'m7', violao:'m8', telao:'m12', live:'m11', story:null, camera_fixa:null } },
  { id: 'c6', data: fmt(nextWeekday(HOJE, 3, 1)), titulo: 'Culto de Quarta',      horario: '20:00', cor: '#4FD1C5',
    escalados: { ministro:'m1', vocal_backing:['m9'], guitarra:null, baixo:'m5', bateria:'m6', teclado:'m7', violao:'m8', telao:'m12', live:'m11', story:null, camera_fixa:null } },
];

// indisponibilidades exemplo (ISO date → array de membro ids)
window.INDISPO_INICIAIS = {
  [fmt(nextWeekday(HOJE, 0, 1))]: [{ membroId: 'm4', motivo: 'Viagem família' }],
  [fmt(nextWeekday(HOJE, 3, 1))]: [{ membroId: 'm4', motivo: 'Viagem família' }],
};

window.USUARIO_PADRAO = { id: 'm1', nome: 'Lucas Andrade', perfil: 'admin' };

// helpers globais
window.formatBRDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return { dia: d, mes: meses[m-1], diaSemana: dias[dt.getDay()], ano: y };
};
