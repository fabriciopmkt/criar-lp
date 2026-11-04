# LPs da <marca>

Memória do projeto. Leia antes de mexer e atualize depois de cada publicação.

## Projeto

- Cloudflare Pages: `<projeto>` · endereço: `https://<projeto>.pages.dev` (domínio próprio: `<lp.suamarca.com.br>`)
- Deploy (de dentro desta pasta): `npx wrangler pages deploy . --project-name=<projeto> --branch=main --commit-dirty=true`
- Prévia: mesmo comando com `--branch=previa` (formulário travado lá)
- Banco D1: `<lps-leads>` (binding `DB`)

## Regras

- O deploy publica a pasta inteira. Nunca coloque segredo aqui; arquivo novo na raiz ganha bloqueio no `_redirects`.
- Secrets (só o nome): `LEAD_WEBHOOK_URL`. Secret novo só vale depois de um deploy.
- Publicar só com o "pode publicar" do responsável.

## LPs no ar

| Slug | Produto | Destino do botão | Desde |
|---|---|---|---|
| `minha-lp` | <produto> | formulário → obrigado | <data> |

## Histórico

- <data>: <o que mudou> (deploy `<id>`)
