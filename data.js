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
  iluminacao:    { label: 'Iluminação', color:      '#F59E0B', icon: '💡',  short: 'IL' },
  convidado:     { label: 'Convidado',  color:      '#6B7280', icon: '🤝',  short: 'CV' },
};

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
  bateria: null, teclado: null, violao: null, telao: null, live: null, story: null, camera_fixa: null,iluminacao: null, convidado: null, };

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
