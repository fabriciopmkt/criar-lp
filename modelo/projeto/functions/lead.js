// POST /lead : recebe o formulário das LPs.
//
// Entrega em até 2 destinos, opcionais e independentes (um falhar não derruba o outro):
//   1. D1 (binding DB no wrangler.toml): cópia de segurança de todo lead.
//   2. Webhook (secret LEAD_WEBHOOK_URL): CRM, Make, Zapier, n8n, planilha.
//
// Segredo nunca entra neste arquivo: `npx wrangler pages secret put NOME --project-name=<projeto>`
// e um novo deploy depois.

const LIMITES = { nome: 120, email: 160, telefone: 30, lp: 80, pagina: 500 };

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return json({ ok: false, error: 'metodo' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'json_invalido' }, 400);
  }

  // Antispam: campo escondido que só robô preenche. Finge sucesso e descarta.
  if (body.site) return json({ ok: true }, 200);

  const nome = limpar(body.nome, LIMITES.nome);
  const email = limpar(body.email, LIMITES.email).toLowerCase();
  const telefone = limpar(body.telefone, LIMITES.telefone).replace(/[^\d+]/g, '');
  if (!nome || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: 'campos_obrigatorios' }, 400);
  }

  const lead = {
    nome,
    email,
    telefone,
    lp: limpar(body.lp, LIMITES.lp),
    pagina: limpar(body.pagina, LIMITES.pagina),
    criado_em: new Date().toISOString(),
  };

  const entregas = {};
  const tarefas = [];

  if (env.DB) {
    tarefas.push(
      env.DB.prepare(
        'INSERT INTO leads (criado_em, lp, nome, email, telefone, pagina) VALUES (?, ?, ?, ?, ?, ?)'
      )
        .bind(lead.criado_em, lead.lp, lead.nome, lead.email, lead.telefone, lead.pagina)
        .run()
        .then(() => { entregas.d1 = 'ok'; })
        .catch((e) => { entregas.d1 = 'erro'; console.error('lead d1:', e.message); })
    );
  }

  if (env.LEAD_WEBHOOK_URL) {
    tarefas.push(
      comTempo(fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }), 8000)
        .then((r) => { entregas.webhook = r.ok ? 'ok' : 'http_' + r.status; })
        .catch((e) => { entregas.webhook = 'erro'; console.error('lead webhook:', e.message); })
    );
  }

  await Promise.all(tarefas);
  return json({ ok: true, entregas }, 200);
}

function limpar(v, max) {
  return String(v ?? '').trim().slice(0, max);
}

function comTempo(promessa, ms) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error('tempo esgotado')), ms)),
  ]);
}

function json(dados, status) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
