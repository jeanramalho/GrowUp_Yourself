# data-model.md — Data model & DB schemas (Phase 1)

## Purpose
Describe entities, TypeScript interfaces and suggested SQLite table schemas for the MVP.

## Entities (TypeScript interfaces)

```ts
// user profile
export interface UserProfile {
  id: string; // uuid
  nome: string;
  foto_path?: string | null;
  sexo?: 'male' | 'female' | 'other' | null;
  peso?: number | null; // kg
  altura?: number | null; // meters
  meta_peso?: number | null;
  preferencias?: Record<string, any> | null;
  updated_at: string; // ISO timestamp
}

export interface Pilar { id: string; nome: string; icone?: string | null; ordem: number }

export interface Meta {
  id: string;
  pilar_id: string;
  titulo: string;
  descricao?: string | null;
  dias_semana: number; // bitmask 0-127
  duracao_minutos: number;
  horario_sugerido?: string | null; // HH:MM
  notificacao_minutos_antes?: number | null;
  recorrente: boolean;
  peso?: number;
  created_at: string;
  updated_at: string;
}

export type ExecucaoStatus = 'concluida' | 'falhou' | 'pulou';
export interface Execucao {
  id: string;
  meta_id: string;
  data: string; // ISO date (day)
  horario_inicio_real?: string | null; // ISO timestamp
  duracao_real?: number | null; // minutes
  status: ExecucaoStatus;
  observacao?: string | null;
  created_at: string;
}

export interface LancamentoFinanceiro {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria?: string | null;
  valor: number;
  data: string; // ISO date
  nota?: string | null;
  planejado: boolean;
  created_at: string;
}

export interface Investimento { id: string; nome: string; principal: number; taxa_juros_ano?: number; data_inicio?: string; notas?: string }

export interface Compromisso {
  id: string;
  titulo: string;
  com_quem?: string | null;
  data_hora: string; // ISO timestamp for occurrence
  recorrencia_rule?: string | null; // iCal RRULE or simple enum
  preparacao?: string | null; // JSON checklist text
  lembretes?: string | null; // JSON
  status?: string;
}
```

## Suggested SQLite table schemas

Create tables with simple indices on `pilar_id`, `meta_id`, and date columns for performance.

```sql
CREATE TABLE user_profile (id TEXT PRIMARY KEY, nome TEXT, foto_path TEXT, sexo TEXT, peso REAL, altura REAL, meta_peso REAL, preferencias TEXT, updated_at TEXT);
CREATE TABLE pilar (id TEXT PRIMARY KEY, nome TEXT, icone TEXT, ordem INTEGER);
CREATE TABLE meta (id TEXT PRIMARY KEY, pilar_id TEXT, titulo TEXT, descricao TEXT, dias_semana INTEGER, duracao_minutos INTEGER, horario_sugerido TEXT, notificacao_minutos_antes INTEGER, recorrente INTEGER, peso INTEGER, created_at TEXT, updated_at TEXT);
CREATE INDEX idx_meta_pilar ON meta(pilar_id);
CREATE TABLE execucao (id TEXT PRIMARY KEY, meta_id TEXT, data TEXT, horario_inicio_real TEXT, duracao_real INTEGER, status TEXT, observacao TEXT, created_at TEXT);
CREATE INDEX idx_execucao_meta ON execucao(meta_id);
CREATE TABLE lancamento_financeiro (id TEXT PRIMARY KEY, tipo TEXT, categoria TEXT, valor REAL, data TEXT, nota TEXT, planejado INTEGER, created_at TEXT);
CREATE TABLE investimento (id TEXT PRIMARY KEY, nome TEXT, principal REAL, taxa_juros_ano REAL, data_inicio TEXT, notas TEXT);
CREATE TABLE compromisso (id TEXT PRIMARY KEY, titulo TEXT, com_quem TEXT, data_hora TEXT, recorrencia_rule TEXT, preparacao_text TEXT, lembretes TEXT, status TEXT);
CREATE TABLE audit_log (id TEXT PRIMARY KEY, entidade TEXT, acao TEXT, payload TEXT, created_at TEXT);
```

## Validation rules / Domain invariants

- `meta.duracao_minutos` > 0
- `meta.dias_semana` bitmask maps to at least one weekday for recurring weekly metas
- `execucao.status` in {concluida, falhou, pulou}
- Financial `lancamento_financeiro.valor` must be non-negative for `receita` (positive) and positive for `despesa` (positive)

## Example mock data (short)

- UserProfile: Jean, peso 78, altura 1.78, meta 75
- Meta: Leitura (pilar Espiritualidade) — dias seg/qua/sex (bitmask), duracao 30, horario_sugerido 06:00
