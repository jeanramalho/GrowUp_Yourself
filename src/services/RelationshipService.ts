import { Compromisso } from '../models';
import { CompromissoRepository } from '../repositories/CompromissoRepository';
import { database } from '../repositories/Repository';

export class RelationshipService {
    private _compromissoRepo: CompromissoRepository | null = null;

    private get compromissoRepo(): CompromissoRepository {
        if (!this._compromissoRepo) {
            this._compromissoRepo = new CompromissoRepository(database.getDb());
        }
        return this._compromissoRepo;
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async getCompromissos(): Promise<Compromisso[]> {
        return await this.compromissoRepo.list();
    }

    async getCompromissosByDate(date: string): Promise<Compromisso[]> {
        return await this.compromissoRepo.getByDate(date);
    }

    async createCompromisso(compromisso: Omit<Compromisso, 'id'>): Promise<Compromisso> {
        return await this.compromissoRepo.create({
            ...compromisso,
            id: this.generateId(),
            status: compromisso.status || 'pendente'
        });
    }

    async updateCompromisso(id: string, compromisso: Partial<Compromisso>): Promise<Compromisso> {
        return await this.compromissoRepo.update(id, compromisso);
    }

    async deleteCompromisso(id: string): Promise<boolean> {
        return await this.compromissoRepo.delete(id);
    }

    /**
     * Helper to get upcoming commitments
     */
    async getUpcomingCompromissos(limit: number = 3): Promise<Compromisso[]> {
        const now = new Date().toISOString();
        const sql = `SELECT * FROM compromisso WHERE data_hora >= ? ORDER BY data_hora ASC LIMIT ?`;
        // We use repository internal method to execute query for specific logic
        // But since we want to keep it simple, let's just use list and filter if needed or add to repo
        const all = await this.getCompromissos();
        return all
            .filter(c => c.data_hora >= now)
            .sort((a, b) => a.data_hora.localeCompare(b.data_hora))
            .slice(0, limit);
    }
}

export const relationshipService = new RelationshipService();
