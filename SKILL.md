---
name: criar-lp
description: "Cria uma landing page (LP) do zero no Claude Code e publica na Cloudflare Pages, de graça e sem servidor: estrutura do projeto, texto tirado só da fonte, layout que funciona no celular, prévia local e online, publicação, domínio próprio, formulário que captura lead (banco D1 e/ou webhook pra CRM, Make, planilha), página de obrigado e aposentadoria de LP com 301. Use sempre que pedirem pra criar, montar, publicar, subir, duplicar ou ajustar uma landing page, página de vendas, página de captura, página de inscrição ou página de obrigado, ou colocar um formulário numa página, mesmo sem a palavra 'LP'."
---

# Criar uma LP com Claude Code e Cloudflare Pages

Roteiro pra sair de "preciso de uma página" até a LP no ar e recebendo lead. A hospedagem é a Cloudflare Pages: grátis, rápida, com HTTPS automático e funções no servidor (Pages Functions) pra receber o formulário sem servidor próprio.

A skill serve pra quem não é dev. Você (Claude) faz o trabalho no terminal e explica cada passo em linguagem simples. Quando um passo exige a pessoa (login, painel, DNS), entregue **um comando por vez**, pronto pra colar.

Rastreio de anúncio (pixel, Conversions API, GA4, tags do Google Ads) fica fora desta skill. Se pedirem, monte à parte depois que a LP estiver no ar.

## Como trabalhar com a pessoa

- **Plano antes de escrever.** Mostre as seções da LP com o texto de cada uma e a origem do texto. Só monte depois do "ok".
- **Texto só da fonte.** Preço, data, carga horária, nome de professor, garantia, bônus: tudo vem do material que a pessoa deu (briefing, site, PDF, conversa). Nunca invente número nem promessa. Faltou dado, pergunte.
- **Recomende, não liste.** Quando houver escolha (caminho, layout, domínio), diga qual você faria e por quê.
- **Nada vai pra produção sem pedido.** Prévia pode. Publicar no endereço oficial ou trocar DNS, só com o "pode publicar" da pessoa.
- **Windows:** no PowerShell, use `npx.cmd` no lugar de `npx` e comece cada comando com `cd` no caminho absoluto da pasta do projeto.

## 0. Descobrir o caminho

Pergunte (ou deduza do pedido) o que a LP precisa. Cada caminho soma ao anterior:

| Caminho | O que entrega | Leia |
|---|---|---|
| **1. LP simples** | Página no ar em `<projeto>.pages.dev`, botão levando pra checkout, WhatsApp ou outro site | este arquivo |
| **2. Domínio próprio** | `lp.suamarca.com.br/<slug>/` | `references/dominio.md` |
| **3. Formulário com lead** | Formulário que grava o lead (D1) e entrega pro CRM por webhook, mais página de obrigado | `references/formulario.md` |

Colete também:
- **Fonte do texto:** briefing, site, PDF, ementa, LP antiga.
- **Identidade:** cores, fonte, logo (arquivo), fotos (arquivos, com direito de uso).
- **Destino do botão:** checkout, WhatsApp (`https://wa.me/55DDDNUMERO?text=...`) ou formulário.
- **Slug:** curto, minúsculo, com hífen (`curso-x`, `masterclass-y`). Vira o caminho da URL.

## 1. Preparar a máquina (uma vez só)

Siga `references/cloudflare-setup.md`: Node instalado, conta Cloudflare, `wrangler login` (a pessoa faz no navegador) e criação do projeto Pages. Confira com `npx wrangler whoami` antes de seguir.

## 2. Montar o projeto

Uma pasta de projeto guarda **todas** as LPs da marca, uma subpasta por LP. Um deploy publica tudo de uma vez.

```
minhas-lps/
  _redirects        (bloqueios e LPs aposentadas)
  _headers          (cabeçalhos de segurança)
  wrangler.toml     (nome do projeto e banco)
  schema.sql        (tabela de leads, caminho 3)
  CLAUDE.md         (memória do projeto: decisões, o que está no ar)
  functions/
    lead.js         (recebe o formulário, caminho 3)
  obrigado/
    index.html      (página pós-formulário, caminho 3)
  <slug>/
    index.html      (a LP)
    img/            (fotos e logos otimizados)
```

Comece copiando a pasta `modelo/projeto/` desta skill pro lugar onde a pessoa quer o projeto e renomeie `minha-lp/` pro slug. O modelo já vem com formulário, trava de prévia e bloqueios. Se o projeto já existe, só crie a subpasta nova copiando `modelo/projeto/minha-lp/`. LP sem formulário (caminho 1): troque o bloco do formulário por botões com o link de destino e apague `functions/`, `obrigado/` e `schema.sql`.

**Regra de ouro: o deploy publica a pasta inteira.** Qualquer arquivo ali fica acessível na internet (`.claude/`, `CLAUDE.md`, planilhas, notas). Por isso:
- nunca coloque senha, token ou URL de webhook em arquivo da pasta (segredo vai em `wrangler pages secret put`, ver `references/formulario.md`);
- o `_redirects` do modelo já bloqueia `CLAUDE.md`, `.claude/*`, `wrangler.toml`, `schema.sql` e `package*.json`. Arquivo novo na raiz: ou pode ser público, ou ganha linha de bloqueio antes do deploy.

## 3. Escrever a LP

1. **Plano de seções** com o texto de cada uma. Ordem que costuma converter:
   1. Topo: promessa clara, pra quem é, data e formato, botão.
   2. Prova: quem ensina ou quem já usou (foto real, credencial, número verificável).
   3. O que a pessoa leva: 3 a 6 benefícios concretos.
   4. Pra quem é (e pra quem não é).
   5. Conteúdo ou programa: resumo à vista, detalhe em `<details>` que abre no clique.
   6. Oferta: preço, condição, o que inclui, garantia (só se existir).
   7. Perguntas frequentes (em `<details>`).
   8. Botão final e rodapé (marca, contato, política de privacidade se coletar dado).
2. **Celular primeiro.** A maior parte do tráfego vem do celular. Escreva o CSS pensando em 375 px e amplie pra telas maiores. Texto escaneável: frases curtas, título por bloco, nada de parede de texto.
3. **Botão sempre à vista** no topo e repetido depois de cada bloco de decisão.
4. **Imagens leves:** JPG ou WebP, até ~200 KB cada, `width` e `height` no `<img>`, `loading="lazy"` em tudo que não é o topo. Foto do topo com `fetchpriority="high"`.
5. **Metadados:** `<title>`, `description`, `og:image` (1200×630) e favicon. É o que aparece quando alguém compartilha o link no WhatsApp.
6. **Sem dependência pesada.** HTML, CSS e JS puros resolvem LP. Fonte do Google com `display=swap` no máximo.

As cores e fontes do modelo moram em variáveis no topo do `<style>` (`:root`). Troque ali pra aplicar a identidade da marca de uma vez.

## 4. Prévia local

```bash
npx wrangler pages dev .
```

Abre em `http://localhost:8788/<slug>/` com as Functions funcionando. Confira no navegador em 375 px e 1280 px: textos, imagens, botões, formulário e console sem erro. Se tiver navegador embutido no app, use ele e mande print pra pessoa.

## 5. Prévia online (pra aprovação)

```bash
npx wrangler pages deploy . --project-name=<projeto> --branch=previa --commit-dirty=true
```

Sai num endereço `previa.<projeto>.pages.dev`, separado da produção. Mande o link pra pessoa aprovar no celular. O modelo trava o formulário nesse endereço (não gera lead falso no CRM).

## 6. Publicar

Só com o "pode publicar":

```bash
npx wrangler pages deploy . --project-name=<projeto> --branch=main --commit-dirty=true
```

Depois confira:
- a LP responde 200 no endereço oficial (`curl -sI https://<endereço>/<slug>/`);
- os arquivos bloqueados respondem 301 (`/CLAUDE.md`, `/wrangler.toml`);
- se tiver formulário, um lead de teste chega no destino (caminho 3).

O checklist completo está em `references/checklist.md`.

## 7. Registrar

Atualize o `CLAUDE.md` do projeto com: LP nova (slug, produto, data), destino do botão, secrets cadastrados (só o NOME, nunca o valor) e o id do deploy. É o que a próxima conversa vai ler pra não quebrar nada. Se o projeto usa git, faça o commit só com os arquivos da LP.

## Mudanças depois

- **Texto ou preço:** edite, prévia, publique. Troque a mesma informação em todos os lugares (topo, oferta, FAQ, obrigado, metadados).
- **Duas LPs do mesmo produto** (ex.: uma por origem de tráfego): mantenha o conteúdo idêntico e mude as duas no mesmo deploy. Anote no `CLAUDE.md` o que pode diferir entre elas.
- **Aposentar uma LP:** não apague a pasta às pressas. Adicione no `_redirects` uma linha `301` pro substituto (`/slug-velho  /slug-novo/  301` e `/slug-velho/*  /slug-novo/  301`). Anúncio antigo, link em bio e e-mail continuam funcionando.
- **Secret novo ou trocado:** só vale depois de um novo deploy.

## Pegadinhas conhecidas

- **Arquivo esquecido na pasta vira público.** Já aconteceu de um arquivo de configuração com chave de acesso ficar aberto na internet. O `.assetsignore` não é respeitado pelo `wrangler pages deploy`: use o bloqueio no `_redirects`.
- **Secret cadastrado e nada mudou:** falta o deploy depois do `secret put`.
- **Secret com só um pedaço do valor:** webhook cadastrado sem `https://` ou só com a chave dá `Invalid URL`. Cadastre a URL completa.
- **Nome com acento chegando como `%C3%A9`:** decodifique os parâmetros na página de obrigado (`decodeURIComponent`). O modelo já faz isso.
- **Formulário que "não faz nada" na prévia online:** é a trava de prévia agindo. Teste em `localhost` ou em produção.
