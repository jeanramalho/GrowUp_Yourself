import { LancamentoFinanceiro, Investimento } from '../models';
import { LancamentoRepository, InvestimentoRepository } from '../repositories/FinanceRepository';
import { database } from '../repositories/Repository';

export class FinanceService {
    private _lancamentoRepo: LancamentoRepository | null = null;
    private _investimentoRepo: InvestimentoRepository | null = null;

    private get lancamentoRepo(): LancamentoRepository {
        if (!this._lancamentoRepo) {
            this._lancamentoRepo = new LancamentoRepository(database.getDb());
        }
        return this._lancamentoRepo;
    }

    private get investimentoRepo(): InvestimentoRepository {
        if (!this._investimentoRepo) {
            this._investimentoRepo = new InvestimentoRepository(database.getDb());
        }
        return this._investimentoRepo;
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async createTransaction(transaction: Omit<LancamentoFinanceiro, 'id' | 'created_at'>): Promise<LancamentoFinanceiro> {
        const newTransaction: LancamentoFinanceiro = {
            ...transaction,
            id: this.generateId(),
            created_at: new Date().toISOString(),
        };
        return await this.lancamentoRepo.create(newTransaction);
    }

    async updateTransaction(id: string, transaction: Partial<LancamentoFinanceiro>): Promise<LancamentoFinanceiro> {
        return await this.lancamentoRepo.update(id, transaction);
    }

    async deleteTransaction(id: string): Promise<boolean> {
        return await this.lancamentoRepo.delete(id);
    }

    async getTransactionsByMonth(date: Date): Promise<LancamentoFinanceiro[]> {
        const monthStr = date.toISOString().substring(0, 7); // YYYY-MM
        return await this.lancamentoRepo.getRealByMonth(monthStr);
    }

    async getPlannedByMonth(date: Date): Promise<LancamentoFinanceiro[]> {
        const monthStr = date.toISOString().substring(0, 7);
        return await this.lancamentoRepo.getPlannedByMonth(monthStr);
    }

    async getMonthSummary(date: Date) {
        const real = await this.getTransactionsByMonth(date);
        const planned = await this.getPlannedByMonth(date);

        const income = real.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
        const expenses = real.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);

        const plannedIncome = planned.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
        const plannedExpenses = planned.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);

        return {
            income,
            expenses,
            plannedIncome,
            plannedExpenses,
            balance: income - expenses,
            expenseUsagePercent: plannedExpenses > 0 ? (expenses / plannedExpenses) * 100 : 0
        };
    }

    async getDailySpending(date: Date) {
        // Last 7 days
        const endDate = new Date(date);
        const startDate = new Date(date);
        startDate.setDate(startDate.getDate() - 6);

        const transactions = await this.lancamentoRepo.getByDateRange(
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
        );

        const realTransactions = transactions.filter(t => !t.planejado && t.tipo === 'despesa');

        const dailyData = [];
        const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const dayValue = realTransactions
                .filter(t => t.data === dateStr)
                .reduce((sum, t) => sum + t.valor, 0);

            dailyData.push({
                name: weekdays[d.getDay()],
                val: dayValue,
                date: dateStr
            });
        }

        const maxVal = Math.max(...dailyData.map(d => d.val), 1);
        return dailyData.map(d => ({
            ...d,
            height: (d.val / maxVal) * 100
        }));
    }

    // Investments
    async createInvestment(investment: Omit<Investimento, 'id'>): Promise<Investimento> {
        return await this.investimentoRepo.create({
            ...investment,
            id: this.generateId()
        });
    }

    async getInvestments(): Promise<Investimento[]> {
        return await this.investimentoRepo.list();
    }

    async updateInvestment(id: string, investment: Partial<Investimento>): Promise<Investimento> {
        return await this.investimentoRepo.update(id, investment);
    }

    async deleteInvestment(id: string): Promise<boolean> {
        return await this.investimentoRepo.delete(id);
    }

    calculateReturns(investment: Investimento) {
        if (!investment.data_inicio || !investment.taxa_juros_ano) return 0;

        const start = new Date(investment.data_inicio);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Simple daily compound interest for demonstration
        const dailyRate = investment.taxa_juros_ano / 100 / 365;
        const currentVal = investment.principal * Math.pow(1 + dailyRate, diffDays);

        return currentVal - investment.principal;
    }
}

export const financeService = new FinanceService();
