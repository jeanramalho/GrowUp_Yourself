/**
 * Meta Data Access Object (DAO)
 * Handles all database operations for Meta entities
 *
 * SPEC-002: CRUD de Metas por Pilar e persistência SQLite
 *
 * Principles:
 * - Repository pattern: abstract database details
 * - Consistent error handling via AppError
 * - Type-safe database operations
 * - Proper transaction support
 */

import { Meta, PilarType } from '@domain/models';
import {
  executeQuery,
  executeUpdate,
  executeTransaction,
  DatabaseError,
} from '@data/sqliteRepository';
import { AppError, ErrorType, NotFoundError, ValidationError } from '@utils/errors';

/**
 * Create a new meta
 */
export async function createMeta(meta: Omit<Meta, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meta> {
  try {
    validateMeta(meta);

    const id = generateMetaId();
    const now = Math.floor(Date.now() / 1000);

    const daysWeekJson = JSON.stringify(meta.daysWeek);

    const query = `
      INSERT INTO meta (id, pilar_id, title, description, days_week, duration_minutes, 
                        suggested_time, notify_before_minutes, recurring, weight_importance, 
                        created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      meta.pilarId,
      meta.title,
      meta.description || null,
      daysWeekJson,
      meta.durationMinutes,
      meta.suggestedTime || null,
      meta.notifyBeforeMinutes ?? 10,
      meta.recurring ? 1 : 0,
      meta.weightImportance ?? 1,
      now,
      now,
    ];

    await executeUpdate(query, params);

    return {
      id,
      ...meta,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to create meta', error as Error);
  }
}

/**
 * Get all metas for a specific pillar
 */
export async function getMetasByPilar(pilarId: PilarType): Promise<Meta[]> {
  try {
    const query = `
      SELECT * FROM meta WHERE pilar_id = ? ORDER BY created_at DESC
    `;

    const results = await executeQuery<any[]>(query, [pilarId]);

    return (results || []).map(parseMeta);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to fetch metas for pilar ${pilarId}`, error as Error);
  }
}

/**
 * Get a specific meta by ID
 */
export async function getMetaById(metaId: string): Promise<Meta> {
  try {
    const query = `SELECT * FROM meta WHERE id = ?`;

    const result = await executeQuery<any>(query, [metaId]);

    if (!result) {
      throw new NotFoundError('Meta', metaId);
    }

    return parseMeta(result);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to fetch meta ${metaId}`, error as Error);
  }
}

/**
 * Get all metas
 */
export async function getAllMetas(): Promise<Meta[]> {
  try {
    const query = `SELECT * FROM meta ORDER BY pilar_id, created_at DESC`;

    const results = await executeQuery<any[]>(query);

    return (results || []).map(parseMeta);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError('Failed to fetch all metas', error as Error);
  }
}

/**
 * Update an existing meta
 */
export async function updateMeta(
  metaId: string,
  updates: Partial<Omit<Meta, 'id' | 'createdAt' | 'updatedAt'>>,
): Promise<Meta> {
  try {
    // Get existing meta
    const existing = await getMetaById(metaId);

    // Validate updates
    const updated = { ...existing, ...updates };
    validateMeta(updated);

    const now = Math.floor(Date.now() / 1000);
    const daysWeekJson = updates.daysWeek ? JSON.stringify(updates.daysWeek) : null;

    const query = `
      UPDATE meta SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        days_week = COALESCE(?, days_week),
        duration_minutes = COALESCE(?, duration_minutes),
        suggested_time = COALESCE(?, suggested_time),
        notify_before_minutes = COALESCE(?, notify_before_minutes),
        recurring = COALESCE(?, recurring),
        weight_importance = COALESCE(?, weight_importance),
        updated_at = ?
      WHERE id = ?
    `;

    const params = [
      updates.title ?? null,
      updates.description ?? null,
      daysWeekJson,
      updates.durationMinutes ?? null,
      updates.suggestedTime ?? null,
      updates.notifyBeforeMinutes ?? null,
      updates.recurring !== undefined ? (updates.recurring ? 1 : 0) : null,
      updates.weightImportance ?? null,
      now,
      metaId,
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
    throw new DatabaseError(`Failed to update meta ${metaId}`, error as Error);
  }
}

/**
 * Delete a meta
 */
export async function deleteMeta(metaId: string): Promise<void> {
  try {
    await executeTransaction(async () => {
      // Delete related executions
      await executeUpdate('DELETE FROM execucao WHERE meta_id = ?', [metaId]);

      // Delete meta
      await executeUpdate('DELETE FROM meta WHERE id = ?', [metaId]);
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new DatabaseError(`Failed to delete meta ${metaId}`, error as Error);
  }
}

/**
 * Validate meta data
 */
function validateMeta(meta: any): void {
  if (!meta.title || meta.title.trim().length === 0) {
    throw new ValidationError('Meta title is required');
  }

  if (meta.title.length > 255) {
    throw new ValidationError('Meta title must be less than 255 characters');
  }

  if (!Array.isArray(meta.daysWeek) || meta.daysWeek.length === 0) {
    throw new ValidationError('Meta must have at least one day of the week');
  }

  if (meta.daysWeek.some((day: number) => day < 0 || day > 6)) {
    throw new ValidationError('Days of week must be between 0-6');
  }

  if (meta.durationMinutes <= 0) {
    throw new ValidationError('Duration must be greater than 0');
  }

  if (meta.durationMinutes > 1440) {
    // 24 hours
    throw new ValidationError('Duration cannot exceed 1440 minutes (24 hours)');
  }
}

/**
 * Parse database row to Meta object
 */
function parseMeta(row: any): Meta {
  return {
    id: row.id,
    pilarId: row.pilar_id,
    title: row.title,
    description: row.description,
    daysWeek: JSON.parse(row.days_week),
    durationMinutes: row.duration_minutes,
    suggestedTime: row.suggested_time,
    notifyBeforeMinutes: row.notify_before_minutes,
    recurring: row.recurring === 1,
    weightImportance: row.weight_importance,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Generate unique meta ID
 */
function generateMetaId(): string {
  return `meta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  createMeta,
  getMetasByPilar,
  getMetaById,
  getAllMetas,
  updateMeta,
  deleteMeta,
};
