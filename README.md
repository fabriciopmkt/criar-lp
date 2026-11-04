# criar-lp

Skill pro [Claude Code](https://claude.com/claude-code) que cria uma landing page do zero e publica na **Cloudflare Pages**: de graça, com HTTPS e sem servidor próprio. Pensada pra quem não é dev: o Claude faz o trabalho no terminal e explica cada passo.

## O que ela faz

- Monta o projeto (uma pasta por LP, um deploy publica todas).
- Escreve a LP com texto tirado só do seu material (briefing, site, PDF), com plano de seções antes de montar.
- Layout pensado primeiro pro celular, com um modelo pronto pra adaptar à sua marca.
- Prévia local, prévia online pra aprovação e publicação.
- Domínio próprio (`lp.suamarca.com.br`).
- Formulário que grava o lead num banco (Cloudflare D1) e entrega pro seu CRM por webhook (RD Station, HubSpot, Make, Zapier, n8n, planilha), com página de obrigado e botão de WhatsApp.
- Aposentadoria de LP com redirecionamento 301, sem quebrar link antigo.
- Proteções contra os erros mais comuns: arquivo de trabalho publicado sem querer, segredo dentro da pasta, formulário gerando lead falso na prévia.

## Instalar

Precisa do Claude Code e do Node 20+ instalados.

macOS / Linux:

```bash
git clone https://github.com/fabriciopmkt/criar-lp.git ~/.claude/skills/criar-lp
```

Windows (PowerShell):

```powershell
git clone https://github.com/fabriciopmkt/criar-lp.git "$env:USERPROFILE\.claude\skills\criar-lp"
```

Sem git: baixe o ZIP pelo botão **Code > Download ZIP** e descompacte em `~/.claude/skills/criar-lp/` (a pasta precisa ter o `SKILL.md` direto dentro dela).

## Usar

Abra o Claude Code na pasta onde quer o projeto das LPs e peça, por exemplo:

> Cria uma LP pro meu curso de [tema], com formulário que manda o lead pro meu CRM.

Ou chame direto com `/criar-lp`. A skill pergunta o que faltar (texto, fotos, destino do botão) e mostra o plano antes de montar.

## Estrutura

```
SKILL.md                    roteiro que o Claude segue
references/
  cloudflare-setup.md       conta, login do wrangler, projeto Pages, primeiro deploy
  dominio.md                domínio próprio
  formulario.md             banco D1, webhook pro CRM, obrigado, testes
  checklist.md              conferência antes e depois de publicar
modelo/projeto/             projeto-base pra copiar
  minha-lp/index.html       LP modelo (troque o que está entre [colchetes])
  obrigado/index.html       página de obrigado
  functions/lead.js         recebe o formulário
  schema.sql                tabela de leads
  _redirects, _headers      bloqueios e segurança
  wrangler.toml             configuração do projeto
  CLAUDE.md                 memória do projeto pro Claude
```

## Fora do escopo

Rastreio de anúncio (Meta Pixel, Conversions API, GA4, tags do Google Ads) não faz parte desta skill.

## Licença

MIT. Use, adapte e compartilhe.
