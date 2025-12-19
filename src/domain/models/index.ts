/**
 * Domain Models - Core entities for GrowUp Yourself
 * These models represent business logic, independent of persistence
 */

/**
 * User Profile Model
 * Represents user biographical and preference data
 */
export interface UserProfile {
  id: string; // Default: 'user_001' (single user per device)
  name?: string;
  photoPath?: string;
  sex?: 'masculino' | 'feminino' | 'outro' | 'nao_informado';
  weight?: number; // kg
  height?: number; // cm
  targetWeight?: number; // kg
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

/**
 * Pilar (Pillar) - One of four main life categories
 */
export type PilarType = 'espiritualidade' | 'saude' | 'financas' | 'relacionamentos';

export interface Pilar {
  id: PilarType;
  name: string;
  iconName: string; // Icon identifier (e.g., 'prayer-hands', 'heart', 'wallet', 'users')
  sortOrder: number;
  createdAt: number;
}

/**
 * Meta (Goal/Habit) Model
 * Represents a weekly goal under a pillar
 *
 * Example:
 * {
 *   id: 'meta-001',
 *   pilarId: 'saude',
 *   title: 'Leitura',
 *   daysWeek: [1, 3, 5], // Monday, Wednesday, Friday
 *   durationMinutes: 30,
 *   suggestedTime: '06:00'
 * }
 */
export interface Meta {
  id: string;
  pilarId: PilarType;
  title: string;
  description?: string;
  daysWeek: number[]; // 0-6, where 0=Sunday, 6=Saturday
  durationMinutes: number;
  suggestedTime?: string; // HH:MM format
  notifyBeforeMinutes?: number; // Default: 10
  recurring: boolean;
  weightImportance?: number; // 1-5, for weighted calculations
  createdAt: number;
  updatedAt: number;
}

/**
 * Execution Model
 * Represents a single execution/attempt of a meta
 *
 * Status Values:
 * - pending: Not started or in progress
 * - concluida: Successfully completed
 * - falhou: Failed to complete
 * - pulou: Skipped intentionally
 */
export type ExecutionStatus = 'pending' | 'concluida' | 'falhou' | 'pulou';

export interface Execucao {
  id: string;
  metaId: string;
  executionDate: string; // ISO format: YYYY-MM-DD
  horariosInicio?: string; // HH:MM - when user actually started
  horarioFim?: string; // HH:MM - when user finished (if applicable)
  durationRealMinutes?: number; // Actual time spent
  status: ExecutionStatus;
  observacao?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Financial Entry Model
 * Represents income or expense transaction
 */
export type EntryType = 'receita' | 'despesa';

export interface LancamentoFinanceiro {
  id: string;
  tipo: EntryType;
  categoria?: string;
  valor: number;
  dataLancamento: string; // YYYY-MM-DD
  nota?: string;
  planejado: boolean; // Part of monthly budget
  createdAt: number;
}

/**
 * Financial Planning Model
 * Monthly budget allocation
 */
export interface PlanejamentoFinanceiro {
  id: string;
  mesAno: string; // YYYY-MM
  valorPlanejado: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Investment Model
 * Tracks investments and calculated returns
 */
export interface Investimento {
  id: string;
  nome: string;
  principal: number;
  taxaJurosAno?: number; // Annual interest rate (%)
  dataInicio: string; // YYYY-MM-DD
  observacoes?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Commitment Model (Relacionamentos)
 * Represents scheduled commitments/appointments
 */
export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'yearly';

export interface Compromisso {
  id: string;
  titulo: string;
  comQuem?: string;
  dataHora: string; // ISO format
  recorrencia?: RecurrenceType;
  preparacaoChecklist?: string[]; // JSON array
  lembretes?: number[]; // Days before: [2, 1, 0] means 2 days, 1 day, day of
  status: 'pending' | 'concluida';
  createdAt: number;
  updatedAt: number;
}

/**
 * Audit Log Model
 * For tracking data modifications (optional)
 */
export interface AuditLog {
  id: string;
  entidade: string; // 'Meta', 'Execucao', 'LancamentoFinanceiro', etc.
  acao: string; // 'CREATE', 'UPDATE', 'DELETE'
  payload: string; // JSON stringified object
  createdAt: number;
}

/**
 * Progress Metric (calculated, not persisted)
 * Used for dashboard calculations
 */
export interface ProgressMetric {
  pilarId: PilarType;
  weekNumber: number;
  month: number;
  year: number;
  weeklyScore: number; // 0-100
  monthlyScore?: number; // 0-100, average of all weeks in month
  daysCompleted: number;
  daysScheduled: number;
}

/**
 * Type guard helpers
 */
export function isValidPilar(value: any): value is PilarType {
  return ['espiritualidade', 'saude', 'financas', 'relacionamentos'].includes(value);
}

export function isValidExecutionStatus(value: any): value is ExecutionStatus {
  return ['pending', 'concluida', 'falhou', 'pulou'].includes(value);
}

export function isValidEntryType(value: any): value is EntryType {
  return ['receita', 'despesa'].includes(value);
}
