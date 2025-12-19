/**
 * Execução Data Access Object (DAO)
 * Handles database operations for Meta executions
 *
 * SPEC-003: Execução e persistência de metas
 */

import { Execucao, ExecutionStatus } from '@domain/models';
import { executeQuery, executeUpdate, DatabaseError } from '@data/sqliteRepository';
import { AppError, NotFoundError, ValidationError } from '@utils/errors';

/**
 * Create a new execution record
 */
export async function createExecution(
  execution: Omit<Execucao, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Execucao> {
  try {
    validateExecution(execution);

    const id = generateExecutionId();
    const now = Math.floor(Date.now() / 1000);

    const query = `
      INSERT INTO execucao (id, meta_id, execution_date, horarios_inicio, horario_fim, 
                            duration_real_minutes, status, observacao, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      execution.metaId,
      execution.executionDate,
      execution.horariosInicio || null,
      execution.horarioFim || null,
      execution.durationRealMinutes || null,
      execution.status,
      execution.observacao || null,
      now,
      now,
    ];

    await executeUpdate(query, params);

    return {
      id,
      ...execution,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to create execution', error as Error);
  }
}

/**
 * Get execution by ID
 */
export async function getExecutionById(executionId: string): Promise<Execucao> {
  try {
    const query = `SELECT * FROM execucao WHERE id = ?`;
    const result = await executeQuery<any>(query, [executionId]);

    if (!result) {
      throw new NotFoundError('Execução', executionId);
    }

    return parseExecution(result);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to fetch execution ${executionId}`, error as Error);
  }
}

/**
 * Get all executions for a meta
 */
export async function getExecutionsByMeta(metaId: string): Promise<Execucao[]> {
  try {
    const query = `SELECT * FROM execucao WHERE meta_id = ? ORDER BY execution_date DESC`;
    const results = await executeQuery<any[]>(query, [metaId]);

    return (results || []).map(parseExecution);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to fetch executions for meta ${metaId}`, error as Error);
  }
}

/**
 * Get executions by meta and specific date
 */
export async function getExecutionsByMetaAndDate(
  metaId: string,
  executionDate: string,
): Promise<Execucao[]> {
  try {
    const query = `
      SELECT * FROM execucao 
      WHERE meta_id = ? AND execution_date = ?
      ORDER BY created_at DESC
    `;
    const results = await executeQuery<any[]>(query, [metaId, executionDate]);

    return (results || []).map(parseExecution);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to fetch executions for meta ${metaId} on ${executionDate}`,
      error as Error,
    );
  }
}

/**
 * Get executions for a meta in a specific month
 */
export async function getExecutionsByMetaAndMonth(
  metaId: string,
  year: number,
  month: number,
): Promise<Execucao[]> {
  try {
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const monthEnd = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    const query = `
      SELECT * FROM execucao 
      WHERE meta_id = ? AND execution_date >= ? AND execution_date < ?
      ORDER BY execution_date DESC
    `;
    const results = await executeQuery<any[]>(query, [metaId, monthStart, monthEnd]);

    return (results || []).map(parseExecution);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to fetch executions for meta ${metaId} in ${year}-${month}`,
      error as Error,
    );
  }
}

/**
 * Get executions for a meta in a specific week
 */
export async function getExecutionsByMetaAndWeek(
  metaId: string,
  weekStart: string, // ISO format: YYYY-MM-DD
): Promise<Execucao[]> {
  try {
    const weekEnd = getDateAfterDays(weekStart, 7);

    const query = `
      SELECT * FROM execucao 
      WHERE meta_id = ? AND execution_date >= ? AND execution_date < ?
      ORDER BY execution_date DESC
    `;
    const results = await executeQuery<any[]>(query, [metaId, weekStart, weekEnd]);

    return (results || []).map(parseExecution);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to fetch executions for meta ${metaId} in week ${weekStart}`,
      error as Error,
    );
  }
}

/**
 * Update an execution
 */
export async function updateExecution(
  executionId: string,
  updates: Partial<Omit<Execucao, 'id' | 'metaId' | 'executionDate' | 'createdAt'>>,
): Promise<Execucao> {
  try {
    const existing = await getExecutionById(executionId);
    const now = Math.floor(Date.now() / 1000);

    const query = `
      UPDATE execucao SET 
        horarios_inicio = COALESCE(?, horarios_inicio),
        horario_fim = COALESCE(?, horario_fim),
        duration_real_minutes = COALESCE(?, duration_real_minutes),
        status = COALESCE(?, status),
        observacao = COALESCE(?, observacao),
        updated_at = ?
      WHERE id = ?
    `;

    const params = [
      updates.horariosInicio ?? null,
      updates.horarioFim ?? null,
      updates.durationRealMinutes ?? null,
      updates.status ?? null,
      updates.observacao ?? null,
      now,
      executionId,
    ];

    await executeUpdate(query, params);

    return {
      ...existing,
      ...updates,
      updatedAt: now,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to update execution ${executionId}`, error as Error);
  }
}

/**
 * Delete an execution
 */
export async function deleteExecution(executionId: string): Promise<void> {
  try {
    await executeUpdate('DELETE FROM execucao WHERE id = ?', [executionId]);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to delete execution ${executionId}`, error as Error);
  }
}

/**
 * Get execution statistics for a date range
 */
export async function getExecutionStats(
  metaId: string,
  startDate: string,
  endDate: string,
): Promise<{ completed: number; failed: number; skipped: number; total: number }> {
  try {
    const query = `
      SELECT status, COUNT(*) as count
      FROM execucao
      WHERE meta_id = ? AND execution_date >= ? AND execution_date <= ?
      GROUP BY status
    `;

    const results = await executeQuery<any[]>(query, [metaId, startDate, endDate]);

    const stats = {
      completed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
    };

    (results || []).forEach((row) => {
      const status = row.status as ExecutionStatus;
      const count = row.count;

      if (status === 'concluida') stats.completed = count;
      else if (status === 'falhou') stats.failed = count;
      else if (status === 'pulou') stats.skipped = count;

      stats.total += count;
    });

    return stats;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(
      `Failed to get execution stats for meta ${metaId}`,
      error as Error,
    );
  }
}

/**
 * Validate execution data
 */
function validateExecution(execution: any): void {
  if (!execution.metaId) {
    throw new ValidationError('Meta ID is required');
  }

  if (!execution.executionDate) {
    throw new ValidationError('Execution date is required');
  }

  if (!isValidDate(execution.executionDate)) {
    throw new ValidationError('Invalid execution date format (use YYYY-MM-DD)');
  }

  if (!execution.status || !isValidExecutionStatus(execution.status)) {
    throw new ValidationError('Invalid execution status');
  }
}

/**
 * Parse database row to Execução object
 */
function parseExecution(row: any): Execucao {
  return {
    id: row.id,
    metaId: row.meta_id,
    executionDate: row.execution_date,
    horariosInicio: row.horarios_inicio,
    horarioFim: row.horario_fim,
    durationRealMinutes: row.duration_real_minutes,
    status: row.status,
    observacao: row.observacao,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Generate unique execution ID
 */
function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate date format
 */
function isValidDate(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/**
 * Validate execution status
 */
function isValidExecutionStatus(status: any): boolean {
  return ['pending', 'concluida', 'falhou', 'pulou'].includes(status);
}

/**
 * Get date after N days
 */
function getDateAfterDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export default {
  createExecution,
  getExecutionById,
  getExecutionsByMeta,
  getExecutionsByMetaAndDate,
  getExecutionsByMetaAndMonth,
  getExecutionsByMetaAndWeek,
  updateExecution,
  deleteExecution,
  getExecutionStats,
};
