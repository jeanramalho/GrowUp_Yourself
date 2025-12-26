# data-model.md — Data model & DB schemas (Phase 1)

## Purpose
Describe entities, TypeScript interfaces and suggested SQLite table schemas for the MVP.

## Entities (TypeScript interfaces)

```ts
export interface UserProfile {
  id: string;
  nome: string;
  foto_path?: string | null;
  sexo?: 'male' | 'female' | 'other' | null;
  peso?: number | null;
  altura?: number | null;
  meta_peso?: number | null;
  preferencias?: Record<string, any> | null;
  updated_at: string;
}

export interface Pilar {
  id: string;
  nome: string;
  icone?: string | null;
  ordem: number;
}

export interface Meta {
  id: string;
  pilar_id: string;
  titulo: string;
  descricao?: string | null;
  dias_semana: number;
  duracao_minutos: number;
  horario_sugerido?: string | null;
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
  data: string;
  horario_inicio_real?: string | null;
  duracao_real?: number | null;
  status: ExecucaoStatus;
  observacao?: string | null;
  created_at: string;
}

export interface LancamentoFinanceiro {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria?: string | null;
  valor: number;
  data: string;
  nota?: string | null;
  planejado: boolean;
  created_at: string;
}

export interface Investimento {
  id: string;
  nome: string;
  principal: number;
  taxa_juros_ano?: number;
  data_inicio?: string;
  notas?: string;
}

export interface Compromisso {
  id: string;
  titulo: string;
  com_quem?: string | null;
  data_hora: string;
  recorrencia_rule?: string | null;
  preparacao?: string | null;
  lembretes?: string | null;
  status?: string;
}
```

## Suggested SQLite table schemas

```sql
CREATE TABLE user_profile (id TEXT PRIMARY KEY, nome TEXT, foto_path TEXT, sexo TEXT, peso REAL, altura REAL, meta_peso REAL, preferencias TEXT, updated_at TEXT);
CREATE TABLE pilar (id TEXT PRIMARY KEY, nome TEXT, icone TEXT, ordem INTEGER);
CREATE TABLE meta (id TEXT PRIMARY KEY, pilar_id TEXT, titulo TEXT, descricao TEXT, dias_semana INTEGER, duracao_minutos INTEGER, horario_sugerido TEXT, notificacao_minutos_antes INTEGER, recorrente INTEGER, peso INTEGER, created_at TEXT, updated_at TEXT);
CREATE INDEX idx_meta_pilar ON meta(pilar_id);
CREATE TABLE execucao (id TEXT PRIMARY KEY, meta_id TEXT, data TEXT, horario_inicio_real TEXT, duracao_real INTEGER, status TEXT, observacao TEXT, created_at TEXT);
CREATE INDEX idx_execucao_meta ON execucao(meta_id);
CREATE TABLE lancamento_financeiro (id TEXT PRIMARY KEY, tipo TEXT, categoria TEXT, valor REAL, data TEXT, nota TEXT, planejado INTEGER, created_at TEXT);
CREATE TABLE investimento (id TEXT PRIMARY KEY, nome TEXT, principal REAL, taxa_juros_ano REAL, data_inicio TEXT, notas TEXT);
CREATE TABLE compromisso (id TEXT PRIMARY KEY, titulo TEXT, com_quem TEXT, data_hora TEXT, recorrencia_rule TEXT, preparacao TEXT, lembretes TEXT, status TEXT);
```

## Validation rules

- `meta.duracao_minutos` > 0
- `meta.dias_semana` bitmask maps to at least one weekday
- `execucao.status` in {concluida, falhou, pulou}
