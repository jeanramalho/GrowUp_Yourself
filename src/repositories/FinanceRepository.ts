import { Repository } from './Repository';
import { LancamentoFinanceiro, Investimento, Conta, CartaoCredito } from '../models';
import { SQLiteDatabase } from 'expo-sqlite';

export class LancamentoRepository extends Repository<LancamentoFinanceiro> {
    constructor(db: SQLiteDatabase) {
        super(db, 'lancamento_financeiro');
    }

    async getByDateRange(startDate: string, endDate: string): Promise<LancamentoFinanceiro[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE data BETWEEN ? AND ? ORDER BY data DESC`;
        return this.executeQuery<LancamentoFinanceiro>(sql, [startDate, endDate]);
    }

    async getPlannedByMonth(monthYear: string): Promise<LancamentoFinanceiro[]> {
        // monthYear format YYYY-MM
        const sql = `SELECT * FROM ${this.tableName} WHERE data LIKE ? AND planejado = 1`;
        return this.executeQuery<LancamentoFinanceiro>(sql, [`${monthYear}%`]);
    }

    async getRealByMonth(monthYear: string): Promise<LancamentoFinanceiro[]> {
        const sql = `SELECT * FROM ${this.tableName} WHERE data LIKE ? AND planejado = 0`;
        return this.executeQuery<LancamentoFinanceiro>(sql, [`${monthYear}%`]);
    }
}

export class InvestimentoRepository extends Repository<Investimento> {
    constructor(db: SQLiteDatabase) {
        super(db, 'investimento');
    }
}

export class ContaRepository extends Repository<Conta> {
    constructor(db: SQLiteDatabase) {
        super(db, 'conta');
    }
}

export class CartaoRepository extends Repository<CartaoCredito> {
    constructor(db: SQLiteDatabase) {
        super(db, 'cartao_credito');
    }
}

export class PlanningCategoryRepository extends Repository<any> {
    constructor(db: SQLiteDatabase) {
        super(db, 'categoria_planejamento');
    }
}
