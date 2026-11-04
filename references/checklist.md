# Checklist antes e depois de publicar

## Texto

- [ ] Todo preço, data, horário, carga horária e nome conferido com a fonte.
- [ ] A mesma informação igual em todos os lugares (topo, oferta, FAQ, obrigado, `<title>`, `og:description`).
- [ ] Nenhuma promessa que a fonte não sustenta (resultado garantido, "vagas limitadas" sem limite real).
- [ ] Ortografia e acentos revisados.

## Celular (375 px) e computador (1280 px)

- [ ] Topo com promessa e botão visíveis sem rolar.
- [ ] Nada estoura a largura (sem rolagem lateral).
- [ ] Botões com área de toque confortável (44 px de altura ou mais).
- [ ] Imagens carregam e não distorcem.
- [ ] `<details>` abrem e fecham.

## Links e formulário

- [ ] Todo botão abre o destino certo.
- [ ] Link de WhatsApp com número no formato `55DDDNUMERO`.
- [ ] Formulário envia, chega no D1 e no CRM, e leva pro obrigado com o nome certo (inclusive com acento).
- [ ] Na prévia (`previa.<projeto>.pages.dev`) o formulário está travado.

## Segurança

- [ ] Nenhum segredo em arquivo da pasta (busque por `token`, `secret`, `senha`, `key`, `hooks.`, `webhook`).
- [ ] `/CLAUDE.md`, `/wrangler.toml` e `/schema.sql` respondem 301.
- [ ] Secrets cadastrados e deploy feito depois deles.

## Depois do deploy

- [ ] LP responde 200 no endereço oficial.
- [ ] Link compartilhado no WhatsApp mostra título e imagem certos.
- [ ] `CLAUDE.md` do projeto atualizado (LP, destino, secrets por nome, id do deploy).
- [ ] Lead de teste apagado do CRM.
