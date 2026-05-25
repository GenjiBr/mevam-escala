# MEVAM Escala

Sistema de escala semanal/mensal para equipe de louvor e pregação da MEVAM Brasília — Ceilândia/DF.

Protótipo interativo mobile-first construído em React (via Babel standalone) + HTML/CSS, sem build step.

## ✨ Funcionalidades

- **Login** com Admin / Membro + PIN de 4 dígitos (localStorage)
- **Escala**: cards de cultos com cobertura de função, detecção de conflitos e expansão para detalhes
- **Disponibilidade**: calendário toggle para o membro bloquear datas
- **Equipe**: listagem com filtro por função, busca e bottom-sheet de detalhes
- **Painel Admin**: stats, gerador automático de escala respeitando indisponibilidades, lista de conflitos
- **Compartilhar**: copia resumo textual da escala formatado para WhatsApp
- **Persistência**: tudo em `localStorage`
- **Tweaks**: troca de cor de acento + reset de dados

## 🎨 Design

- Paleta navy + electric blue (inspirado em "Fundo Azul")
- Cores funcionais do briefing preservadas como acentos (vermelho pregador, dourado ministro, etc.)
- Tipografia: Bricolage Grotesque (display) + Manrope (corpo)
- Frame de iPhone com aurora e estrelas sutis no fundo

## 🚀 Como usar

### Local
```bash
# clone o repositório
git clone https://github.com/SEU-USUARIO/mevam-escala.git
cd mevam-escala

# sirva os arquivos com qualquer servidor http
python3 -m http.server 8000
# ou
npx serve .
```

Acesse `http://localhost:8000`.

### GitHub Pages
1. Configurações do repositório → **Pages**
2. Source: **Deploy from a branch** → `main` / `root`
3. O arquivo `index.html` será servido automaticamente.

## 👥 Usuários de demonstração

- **Lucas Andrade · PIN 1234 · Admin** — acesso completo (painel admin, gerar escala)
- **Bruno Vieira · PIN 0000 · Membro** — visualiza escala e informa indisponibilidade

## 📂 Estrutura

```
.
├── index.html           # entry point
├── data.js              # membros, funções, cultos iniciais (mock)
├── ui.jsx               # átomos: Avatar, FuncBadge, Card, Btn, Chip, Toast, Icon
├── screens.jsx          # Login, Escala, Disponibilidade, Membros, Admin
├── app.jsx              # shell + tab bar + reducer + Tweaks
├── ios-frame.jsx        # frame do iPhone (status bar, dynamic island)
├── tweaks-panel.jsx     # painel de tweaks
└── assets/
    └── mevam-logo.png
```

## 🛠️ Funções e cores

| Função | Cor | Ícone |
|---|---|---|
| Pregador | #C0392B | 🎤 |
| Vocal Principal | #9B59B6 | 🎙️ |
| Vocal / Backing | #8E44AD | 🎵 |
| Ministro de Louvor | #F39C12 | ⭐ |
| Guitarra | #E67E22 | 🎸 |
| Violão | #27AE60 | 🎸 |
| Baixo | #3B6FB5 | 🎸 |
| Bateria | #E74C3C | 🥁 |
| Teclado / Piano | #2980B9 | 🎹 |
| Sonoplasta | #1ABC9C | 🎚️ |
| Projeção | #9AA4B0 | 📽️ |

## 📝 Licença

Uso interno MEVAM Brasília — Ceilândia/DF.
