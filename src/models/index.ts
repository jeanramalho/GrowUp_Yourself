/**
 * TypeScript interfaces for GrowUp Yourself MVP
 * These define the data structures used throughout the application
 */

/**
 * User profile information
 */
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

/**
 * Pillar (Pilar) - represents one of the four life areas
 */
export interface Pilar {
  id: string;
  nome: string;
  icone?: string | null;
  ordem: number;
}

/**
 * Goal (Meta) - a weekly target in one of the pillars
 */
export interface Meta {
  id: string;
  pilar_id: string;
  titulo: string;
  descricao?: string | null;
  dias_semana: number; // bitmask: 0=Sun, 1=Mon, 2=Tue, etc.
  duracao_minutos: number;
  horario_sugerido?: string | null; // HH:MM format
  notificacao_minutos_antes?: number | null;
  recorrente: boolean;
  peso?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Execution status types
 */
export type ExecucaoStatus = 'concluida' | 'falhou' | 'pulou';

/**
 * Execution record - tracks when a meta was done and how it went
 */
export interface Execucao {
  id: string;
  meta_id: string;
  data: string; // YYYY-MM-DD format
  horario_inicio_real?: string | null; // HH:MM format
  duracao_real?: number | null;
  status: ExecucaoStatus;
  observacao?: string | null;
  created_at: string;
}

/**
 * Financial transaction
 */
export interface LancamentoFinanceiro {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria?: string | null;
  valor: number;
  data: string; // YYYY-MM-DD format
  nota?: string | null;
  planejado: boolean;
  created_at: string;
}

/**
 * Investment record
 */
export interface Investimento {
  id: string;
  nome: string;
  principal: number;
  taxa_juros_ano?: number;
  data_inicio?: string;
  notas?: string;
}

/**
 * Commitment/Appointment
 */
export interface Compromisso {
  id: string;
  titulo: string;
  com_quem?: string | null;
  data_hora: string; // ISO 8601 format
  recorrencia_rule?: string | null;
  preparacao?: string | null;
  lembretes?: string | null;
  status?: string;
}
