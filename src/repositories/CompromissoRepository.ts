import { Repository } from './Repository';
import { Compromisso } from '../models';
import { SQLiteDatabase } from 'expo-sqlite';

export class CompromissoRepository extends Repository<Compromisso> {
    constructor(db: SQLiteDatabase) {
        super(db, 'compromisso');
    }

    async getByDateRange(startDate: string, endDate: string): Promise<Compromisso[]> {
        // Since sqlite doesn't have a native date type, we use ISO strings or date-like strings
        // Compromisso uses 'data_hora' (ISO 8601)
        const sql = `SELECT * FROM ${this.tableName} WHERE data_hora BETWEEN ? AND ? ORDER BY data_hora ASC`;
        return this.executeQuery<Compromisso>(sql, [startDate, endDate]);
    }

    async getByDate(date: string): Promise<Compromisso[]> {
        // format: YYYY-MM-DD
        const sql = `SELECT * FROM ${this.tableName} WHERE data_hora LIKE ? ORDER BY data_hora ASC`;
        return this.executeQuery<Compromisso>(sql, [`${date}%`]);
    }
}
