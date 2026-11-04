# Preparar a Cloudflare (uma vez só)

Cada passo que depende da pessoa vai como um comando por vez, pronto pra colar. No Windows (PowerShell), troque `npx` por `npx.cmd` e comece com `cd` no caminho absoluto da pasta do projeto.

## 1. Node

Confira com `node -v`. Precisa da versão 20 ou mais nova. Se não tiver, a pessoa instala a versão LTS em nodejs.org e reabre o terminal.

## 2. Conta Cloudflare

A pessoa cria em dash.cloudflare.com (o plano gratuito basta). Não precisa cartão.

## 3. Login do wrangler

O wrangler é a ferramenta de linha de comando da Cloudflare. Rode via `npx`, sem instalar nada global:

```bash
npx wrangler login
```

Abre o navegador pra pessoa autorizar. Depois confira:

```bash
npx wrangler whoami
```

Anote o **Account ID** que aparece. Se a pessoa tiver mais de uma conta, os comandos seguintes precisam dele:
- macOS/Linux: `CLOUDFLARE_ACCOUNT_ID=<id> npx wrangler ...`
- PowerShell: `$env:CLOUDFLARE_ACCOUNT_ID="<id>"; npx.cmd wrangler ...`

O Account ID não é segredo, mas não precisa ir pro texto de nenhuma página.

## 4. Criar o projeto Pages

Escolha um nome curto (vira `<nome>.pages.dev`), por exemplo `lps-suamarca`:

```bash
npx wrangler pages project create lps-suamarca --production-branch=main
```

Atualize `name` no `wrangler.toml` do projeto com o mesmo nome.

## 5. Primeiro deploy

De dentro da pasta do projeto:

```bash
npx wrangler pages deploy . --project-name=lps-suamarca --branch=main --commit-dirty=true
```

A LP fica em `https://lps-suamarca.pages.dev/<slug>/`. O `--commit-dirty=true` só silencia o aviso de arquivos sem commit no git.

## Sem terminal?

Dá pra arrastar a pasta em Workers & Pages > Create > Pages > Upload assets no painel. Funciona pra LP simples, mas **não publica a pasta `functions/`** (o formulário do caminho 3 não roda). Prefira o wrangler.

## Deploy automático pelo GitHub (opcional)

Se o projeto estiver num repositório, o painel da Pages pode publicar a cada push (Settings > Builds > Connect to Git, build command vazio, output directory `/`). Vantagem: histórico e desfazer fácil. Desvantagem: qualquer push vai pro ar. Pra quem está começando, o deploy manual pelo wrangler dá mais controle.
