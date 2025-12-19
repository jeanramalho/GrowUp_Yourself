-- Migration: create meta table (SQLite)
CREATE TABLE IF NOT EXISTS meta (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  days TEXT NOT NULL, -- store JSON array
  duration_minutes INTEGER NOT NULL,
  suggested_time TEXT,
  notify_before_minutes INTEGER,
  recurring INTEGER DEFAULT 0,
  pillar TEXT
);

CREATE TABLE IF NOT EXISTS execucao (
  id TEXT PRIMARY KEY,
  meta_id TEXT NOT NULL,
  horario_real_inicio INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL
);
