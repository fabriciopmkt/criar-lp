-- Tabela de leads do formulário (functions/lead.js).
-- Rodar uma vez: npx wrangler d1 execute <banco> --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  criado_em TEXT NOT NULL,
  lp TEXT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  pagina TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_criado ON leads (criado_em);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
