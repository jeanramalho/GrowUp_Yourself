/**
 * Meta Use Cases
 * Business logic layer for meta management
 *
 * SPEC-002: CRUD de Metas por Pilar
 *
 * Principles:
 * - Encapsulates business logic independent of UI/DB
 * - Handles validation and error cases
 * - Uses dependency injection for DAO
 * - Pure functions where possible
 */

import { Meta, PilarType, ExecutionStatus, Execucao } from '@domain/models';
import * as metaDAO from '@data/metaDAO';
import * as execucaoDAO from '@data/execucaoDAO';
import { ValidationError, NotFoundError, AppError } from '@utils/errors';

/**
 * Create a new meta
 */
export async function createMeta(
  pilarId: PilarType,
  title: string,
  daysWeek: number[],
  durationMinutes: number,
  options?: {
    description?: string;
    suggestedTime?: string;
    notifyBeforeMinutes?: number;
    recurring?: boolean;
    weightImportance?: number;
  },
): Promise<Meta> {
  const meta = await metaDAO.createMeta({
    pilarId,
    title,
    daysWeek,
    durationMinutes,
    ...options,
  });

  return meta;
}

/**
 * Get all metas for a pillar
 */
export async function getMetasByPilar(pilarId: PilarType): Promise<Meta[]> {
  return metaDAO.getMetasByPilar(pilarId);
}

/**
 * Get a specific meta by ID
 */
export async function getMetaById(metaId: string): Promise<Meta> {
  return metaDAO.getMetaById(metaId);
}

/**
 * Update a meta
 */
export async function updateMeta(
  metaId: string,
  updates: Partial<Omit<Meta, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Meta> {
  return metaDAO.updateMeta(metaId, updates);
}

/**
 * Delete a meta and its related executions
 */
export async function deleteMeta(metaId: string): Promise<void> {
  await metaDAO.deleteMeta(metaId);
}

/**
 * Start a meta execution
 */
export async function startMetaExecution(metaId: string): Promise<Execucao> {
  try {
    // Verify meta exists
    await metaDAO.getMetaById(metaId);

    // Get current date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get current time
    const now = new Date();
    const horariosInicio = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Create execution record
    const execucao = await execucaoDAO.createExecution({
      metaId,
      executionDate: today,
      horariosInicio,
      status: 'pending',
    });

    return execucao;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'unknown',
      'Failed to start meta execution',
      500,
      { originalError: String(error) },
    );
  }
}

/**
 * Complete a meta execution
 */
export async function completeMetaExecution(
  executionId: string,
  actualDurationMinutes?: number,
  observacao?: string,
): Promise<Execucao> {
  try {
    const now = new Date();
    const horarioFim = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return execucaoDAO.updateExecution(executionId, {
      status: 'concluida',
      horarioFim,
      durationRealMinutes: actualDurationMinutes,
      observacao,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'unknown',
      'Failed to complete meta execution',
      500,
      { originalError: String(error) },
    );
  }
}

/**
 * Mark meta as failed
 */
export async function failMetaExecution(
  executionId: string,
  observacao?: string,
): Promise<Execucao> {
  return execucaoDAO.updateExecution(executionId, {
    status: 'falhou',
    observacao,
  });
}

/**
 * Skip meta execution
 */
export async function skipMetaExecution(
  executionId: string,
  observacao?: string,
): Promise<Execucao> {
  return execucaoDAO.updateExecution(executionId, {
    status: 'pulou',
    observacao,
  });
}

/**
 * Mark a meta retroactively (user forgot to mark, but did complete)
 * @param metaId - The meta ID
 * @param executionDate - Date when meta was actually completed (YYYY-MM-DD)
 * @param horariosInicio - Time when meta was started (HH:MM)
 * @param actualDurationMinutes - Time actually spent
 */
export async function markMetaRetroactive(
  metaId: string,
  executionDate: string,
  horariosInicio: string,
  actualDurationMinutes?: number,
): Promise<Execucao> {
  try {
    // Verify meta exists
    await metaDAO.getMetaById(metaId);

    // Calculate end time
    const [hours, minutes] = horariosInicio.split(':').map(Number);
    const duration = actualDurationMinutes ?? 30; // Default 30 mins if not specified

    const endMinutes = minutes + duration;
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;

    const horarioFim = `${String(endHours % 24).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;

    // Check if execution already exists for this date
    const existing = await execucaoDAO.getExecutionsByMetaAndDate(metaId, executionDate);

    if (existing.length > 0) {
      // Update existing
      return execucaoDAO.updateExecution(existing[0].id, {
        status: 'concluida',
        horariosInicio,
        horarioFim,
        durationRealMinutes: actualDurationMinutes,
      });
    }

    // Create new execution
    return execucaoDAO.createExecution({
      metaId,
      executionDate,
      horariosInicio,
      horarioFim,
      durationRealMinutes: actualDurationMinutes,
      status: 'concluida',
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'unknown',
      'Failed to mark meta retroactively',
      500,
      { originalError: String(error) },
    );
  }
}

/**
 * Get executions for a meta in a specific month
 */
export async function getMetaExecutionsByMonth(
  metaId: string,
  year: number,
  month: number,
): Promise<Execucao[]> {
  return execucaoDAO.getExecutionsByMetaAndMonth(metaId, year, month);
}

/**
 * Get weekly stats for a meta
 */
export async function getMetaWeeklyStats(
  metaId: string,
  weekStart: string,
): Promise<{
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  percentage: number;
}> {
  const executions = await execucaoDAO.getExecutionsByMetaAndWeek(metaId, weekStart);

  const stats = {
    total: executions.length,
    completed: executions.filter((e) => e.status === 'concluida').length,
    failed: executions.filter((e) => e.status === 'falhou').length,
    skipped: executions.filter((e) => e.status === 'pulou').length,
    percentage: 0,
  };

  if (stats.total > 0) {
    stats.percentage = Math.round((stats.completed / stats.total) * 100);
  }

  return stats;
}

export default {
  createMeta,
  getMetasByPilar,
  getMetaById,
  updateMeta,
  deleteMeta,
  startMetaExecution,
  completeMetaExecution,
  failMetaExecution,
  skipMetaExecution,
  markMetaRetroactive,
  getMetaExecutionsByMonth,
  getMetaWeeklyStats,
};
