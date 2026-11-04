# Formulário que captura lead

O formulário da LP manda os dados pra `/lead`, uma Pages Function (`functions/lead.js` no modelo). Ela valida, grava e entrega. Depois a pessoa vai pra `/obrigado/`.

```
LP (formulário) ──POST /lead──> functions/lead.js ──> D1 (banco, cópia de segurança)
                                                 └─> webhook (CRM, Make, planilha)
               ──redirect──> /obrigado/?nome=...
```

Os dois destinos são opcionais e independentes: se um falhar, o outro segue e o lead não se perde.

## 1. Banco D1 (recomendado)

Guarda todo lead, mesmo se o CRM estiver fora do ar. É grátis até volumes bem altos.

Criar:

```bash
npx wrangler d1 create lps-leads
```

O comando devolve um `database_id`. Cole no `wrangler.toml` do projeto (bloco `[[d1_databases]]`, já comentado no modelo) e descomente.

Criar a tabela (o arquivo está no modelo):

```bash
npx wrangler d1 execute lps-leads --remote --file=schema.sql
```

Ver os últimos leads:

```bash
npx wrangler d1 execute lps-leads --remote --command "SELECT id, criado_em, lp, nome, email, telefone FROM leads ORDER BY id DESC LIMIT 10"
```

## 2. Webhook pro CRM (opcional)

Qualquer ferramenta que receba um POST com JSON serve: RD Station (via Make ou integração), HubSpot, Pipedrive, Make, Zapier, n8n, Google Sheets por Apps Script.

A URL do webhook é **segredo** (quem tiver ela injeta lead falso). Nunca em arquivo da pasta:

```bash
npx wrangler pages secret put LEAD_WEBHOOK_URL --project-name=<projeto>
```

O wrangler pede o valor. Cole a **URL completa**, com `https://`. **O secret só vale depois de um novo deploy.**

Corpo enviado (JSON):

```json
{ "nome": "", "email": "", "telefone": "", "lp": "slug",
  "pagina": "https://...", "criado_em": "2026-01-01T12:00:00.000Z" }
```

Precisa de um formato diferente pro CRM? Ajuste o objeto `lead` no `functions/lead.js` ou faça a tradução no Make/Zapier.

## 3. Campos e validação

- O modelo pede nome, e-mail e WhatsApp. Menos campos, mais conversão: só peça o que o time de vendas usa.
- Campo extra (cidade, profissão): adicione o `<input name="...">` no HTML, mande no `fetch` do script, leia em `lead.js` e crie a coluna (`ALTER TABLE leads ADD COLUMN profissao TEXT`, roda uma vez só).
- Antispam: o modelo tem um campo escondido (`site`). Robô preenche, gente não; a Function finge sucesso e descarta.
- Consentimento (LGPD): o modelo traz uma linha avisando o uso dos dados com link pra política de privacidade. Mantenha se a marca tem política publicada.

## 4. Página de obrigado

`/obrigado/` recebe `nome` pela URL. Ela:
- cumprimenta pelo primeiro nome (decodificado, pra acento não virar `%C3%A9`);
- diz o próximo passo concreto (ex.: "você vai receber uma mensagem no WhatsApp em até 1 hora");
- pode oferecer um botão de WhatsApp com mensagem pronta (`https://wa.me/55DDDNUMERO?text=...`), já previsto no modelo.

## 5. Trava de prévia

O script da LP não envia o formulário em endereços de prévia (`<branch>.<projeto>.pages.dev`). Assim a pessoa pode aprovar a página sem gerar lead falso no CRM. No endereço de produção (`<projeto>.pages.dev` ou domínio próprio) e em `localhost`, envia normal.

## 6. Testar

1. Na prévia local (`npx wrangler pages dev .`), envie com e-mail de teste.
2. Em produção, envie um lead com `teste` no nome e confira: linha no D1, chegada no CRM, redirecionamento pro obrigado.
3. Apague o lead de teste no CRM depois.

Se não chegou no webhook, olhe os logs ao vivo enquanto envia:

```bash
npx wrangler pages deployment tail --project-name=<projeto>
```

A resposta do `/lead` também diz o que aconteceu com cada destino (`"entregas": {"d1": "ok", "webhook": "http_404"}`): dá pra ver na aba Rede do navegador.
