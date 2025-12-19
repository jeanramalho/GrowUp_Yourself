-- Migration 0001: Create core tables for GrowUp Yourself MVP
-- Created: 2025-12-19

CREATE TABLE IF NOT EXISTS user_profile (
  id TEXT PRIMARY KEY DEFAULT 'user_001',
  name TEXT,
  photo_path TEXT,
  sex TEXT,
  weight REAL,
  height REAL,
  target_weight REAL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS pilar (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_name TEXT,
  sort_order INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS meta (
  id TEXT PRIMARY KEY,
  pilar_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  days_week TEXT NOT NULL, -- JSON array: [1,3,5]
  duration_minutes INTEGER NOT NULL,
  suggested_time TEXT, -- HH:MM
  notify_before_minutes INTEGER DEFAULT 10,
  recurring BOOLEAN DEFAULT 0,
  weight_importance INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (pilar_id) REFERENCES pilar(id)
);

CREATE TABLE IF NOT EXISTS execucao (
  id TEXT PRIMARY KEY,
  meta_id TEXT NOT NULL,
  execution_date INTEGER, -- ISO date string YYYY-MM-DD
  horario_inicio_real TEXT, -- HH:MM when user started
  horario_fim_real TEXT, -- HH:MM when user finished (optional)
  duration_real_minutes INTEGER,
  status TEXT DEFAULT 'pending', -- pending, concluida, falhou, pulou
  observacao TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (meta_id) REFERENCES meta(id)
);

CREATE TABLE IF NOT EXISTS lancamento_financeiro (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL, -- receita, despesa
  categoria TEXT,
  valor REAL NOT NULL,
  data_lancamento TEXT, -- YYYY-MM-DD
  nota TEXT,
  planejado BOOLEAN DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS planejamento_financeiro (
  id TEXT PRIMARY KEY,
  mes_ano TEXT NOT NULL, -- YYYY-MM
  valor_planejado REAL NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS investimento (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  principal REAL NOT NULL,
  taxa_juros_ano REAL,
  data_inicio TEXT, -- YYYY-MM-DD
  observacoes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS compromisso (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  com_quem TEXT,
  data_hora TEXT NOT NULL, -- ISO format
  recorrencia_rule TEXT, -- ex: 'weekly:TH'
  preparacao_checklist TEXT, -- JSON array
  lembretes TEXT, -- JSON array: [2, 1, 0] (dias antes)
  status TEXT DEFAULT 'pending', -- pending, concluida
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  entidade TEXT,
  acao TEXT,
  payload TEXT, -- JSON
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_meta_pilar ON meta(pilar_id);
CREATE INDEX IF NOT EXISTS idx_execucao_meta ON execucao(meta_id);
CREATE INDEX IF NOT EXISTS idx_execucao_date ON execucao(execution_date);
CREATE INDEX IF NOT EXISTS idx_lancamento_data ON lancamento_financeiro(data_lancamento);
CREATE INDEX IF NOT EXISTS idx_planejamento_mes ON planejamento_financeiro(mes_ano);
