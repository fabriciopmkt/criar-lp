# Domínio próprio

Recomendação: use um **subdomínio só pras LPs**, como `lp.suamarca.com.br`. O site principal fica intocado e todas as LPs ficam em `lp.suamarca.com.br/<slug>/`.

## Se o domínio já está na Cloudflare (DNS gerenciado lá)

1. Painel > Workers & Pages > o projeto > Custom domains > Set up a custom domain.
2. Digite `lp.suamarca.com.br` e confirme. A Cloudflare cria o registro DNS e o certificado sozinha.
3. Em alguns minutos o endereço responde com HTTPS.

## Se o DNS está em outro lugar (Registro.br, GoDaddy, Hostinger, Locaweb...)

1. Faça o passo 1 e 2 acima. O painel vai mostrar um registro **CNAME** pra criar: nome `lp`, valor `<projeto>.pages.dev`.
2. A pessoa cria esse CNAME no painel onde o DNS está hoje.
3. Volte no painel da Pages e espere o status virar "Active" (de minutos a algumas horas).

Não aponte o domínio raiz (`suamarca.com.br`) pra Pages se o site principal mora em outro lugar.

## Depois de ativar

- Teste `https://lp.suamarca.com.br/<slug>/` (200) e `https://lp.suamarca.com.br/CLAUDE.md` (301).
- Atualize o link onde ele aparecer (anúncios, bio, e-mails).
- Anote o domínio no `CLAUDE.md` do projeto.

## Raiz do subdomínio

Quem abre `lp.suamarca.com.br/` sem slug cai num 404. Duas saídas:
- uma linha no `_redirects`: `/  https://suamarca.com.br/  302` (manda pro site);
- ou uma página `index.html` na raiz com a vitrine das LPs ativas.
