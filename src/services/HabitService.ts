import { Meta, Execucao } from '../models';
import { MetaRepository, ExecucaoRepository } from '../repositories/HabitRepository';
import { database } from '../repositories/Repository';
import { DeviceEventEmitter } from 'react-native';
import { generateUUID } from '../utils/uuid';

class HabitService {
    private _metaRepo: MetaRepository | null = null;
    private _execRepo: ExecucaoRepository | null = null;

    private get metaRepo(): MetaRepository {
        if (!this._metaRepo) {
            this._metaRepo = new MetaRepository(database.getDb());
        }
        return this._metaRepo;
    }

    private get execRepo(): ExecucaoRepository {
        if (!this._execRepo) {
            this._execRepo = new ExecucaoRepository(database.getDb());
        }
        return this._execRepo;
    }

    private generateId(): string {
        return generateUUID();
    }

    /**
     * Create a new habit (meta)
     */
    async createHabit(meta: Omit<Meta, 'id' | 'created_at' | 'updated_at'>): Promise<Meta> {
        const now = new Date().toISOString();
        const newMeta: Meta = {
            ...meta,
            id: this.generateId(),
            created_at: now,
            updated_at: now,
        };
        return await this.metaRepo.create(newMeta);
    }

    /**
     * Update an existing habit (meta)
     */
    async updateHabit(id: string, meta: Partial<Meta>): Promise<Meta> {
        const updatedMeta = {
            ...meta,
            updated_at: new Date().toISOString(),
        };
        return await this.metaRepo.update(id, updatedMeta);
    }

    /**
     * Get habits for a specific pillar
     */
    async getHabitsByPilar(pilarId: string): Promise<Meta[]> {
        return await this.metaRepo.getByPilar(pilarId);
    }

    /**
     * Get habits scheduled for a specific date
     */
    async getHabitsForDate(date: Date, pilarId?: string): Promise<(Meta & { completed: boolean; executionId?: string })[]> {
        const dayOfWeek = date.getDay(); // 0-6 (Sun-Sat)
        const bitmask = 1 << dayOfWeek;
        const dateString = date.toISOString().split('T')[0];

        let allMetas: Meta[];
        if (pilarId) {
            allMetas = await this.metaRepo.getByPilar(pilarId);
        } else {
            allMetas = await this.metaRepo.list();
        }

        const scheduledMetas = allMetas.filter(m => (m.dias_semana & bitmask) !== 0);

        // Fetch all relevant executions in one go
        const metaIds = scheduledMetas.map(m => m.id);
        if (metaIds.length === 0) return [];

        const executions = await this.execRepo.getByDate(dateString);
        
        return scheduledMetas.map(meta => {
            const execution = executions.find(e => e.meta_id === meta.id);
            return {
                ...meta,
                completed: !!execution && execution.status === 'concluida',
                executionId: execution?.id
            };
        });
    }

    /**
     * Toggle habit completion for a specific date
     */
    async toggleCompletion(metaId: string, date: Date): Promise<void> {
        const dateString = date.toISOString().split('T')[0];
        const existing = await this.execRepo.getByMetaAndDate(metaId, dateString);

        if (existing) {
            await this.execRepo.delete(existing.id);
        } else {
            const exec: Execucao = {
                id: this.generateId(),
                meta_id: metaId,
                data: dateString,
                status: 'concluida',
                created_at: new Date().toISOString()
            };
            await this.execRepo.create(exec);
        }
        DeviceEventEmitter.emit('metrics_updated');
    }

    /**
     * Calculate monthly progress for a pillar
     */
    async getMonthlyProgress(pilarId: string, monthDate: Date): Promise<number> {
        const metas = await this.metaRepo.getByPilar(pilarId);
        if (metas.length === 0) return 0;

        const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

        const executions = await this.execRepo.getByDateRange(
            startOfMonth.toISOString().split('T')[0],
            endOfMonth.toISOString().split('T')[0]
        );

        let totalScheduledDays = 0;
        let totalCompletedDays = 0;

        const completionMap = new Set(executions.filter(e => e.status === 'concluida').map(e => `${e.meta_id}_${e.data}`));

        for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            const bitmask = 1 << dayOfWeek;
            const dateStr = d.toISOString().split('T')[0];

            for (const meta of metas) {
                if ((meta.dias_semana & bitmask) !== 0) {
                    totalScheduledDays++;
                    if (completionMap.has(`${meta.id}_${dateStr}`)) {
                        totalCompletedDays++;
                    }
                }
            }
        }

        if (totalScheduledDays === 0) return 0;
        return Math.round((totalCompletedDays / totalScheduledDays) * 100);
    }

    /**
     * Delete a habit and its executions
     */
    async deleteHabit(id: string): Promise<boolean> {
        await this.execRepo.deleteByMeta(id);
        return await this.metaRepo.delete(id);
    }

    /**
     * Delete all habits for a specific pillar
     */
    async deleteAllHabits(pilarId: string): Promise<void> {
        const metas = await this.metaRepo.getByPilar(pilarId);
        for (const meta of metas) {
            await this.deleteHabit(meta.id);
        }
    }

    /**
     * Delete habits that were completed on a specific date
     */
    async deleteCompletedHabitsForDate(pilarId: string, date: Date): Promise<void> {
        const habits = await this.getHabitsForDate(date, pilarId);
        const completedHabits = habits.filter(h => h.completed);

        for (const habit of completedHabits) {
            await this.deleteHabit(habit.id);
        }
    }
}

export const habitService = new HabitService();
