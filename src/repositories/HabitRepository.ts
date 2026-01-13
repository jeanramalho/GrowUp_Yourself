import { Repository } from './Repository';
import { Meta, Execucao } from '../models';
import { SQLiteDatabase } from 'expo-sqlite';

export class MetaRepository extends Repository<Meta> {
    constructor(db: SQLiteDatabase) {
        super(db, 'meta');
    }

    async getByPilar(pilarId: string): Promise<Meta[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE pilar_id = ?`;
        return this.executeQuery<Meta>(sql, [pilarId]);
    }
}

export class ExecucaoRepository extends Repository<Execucao> {
    constructor(db: SQLiteDatabase) {
        super(db, 'execucao');
    }

    async getByMeta(metaId: string): Promise<Execucao[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE meta_id = ?`;
        return this.executeQuery<Execucao>(sql, [metaId]);
    }

    async getByDateRange(startDate: string, endDate: string): Promise<Execucao[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE data BETWEEN ? AND ?`;
        return this.executeQuery<Execucao>(sql, [startDate, endDate]);
    }

    async getByMetaAndDate(metaId: string, date: string): Promise<Execucao | null> {
        const sql = `SELECT * FROM ${this.tableName} WHERE meta_id = ? AND data = ?`;
        const results = await this.executeQuery<Execucao>(sql, [metaId, date]);
        return results.length > 0 ? results[0] : null;
    }
}
