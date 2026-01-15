import { LancamentoFinanceiro, Investimento, Conta, CartaoCredito, CategoriaPlanejamento } from '../models';
import { LancamentoRepository, InvestimentoRepository, ContaRepository, CartaoRepository, PlanningCategoryRepository } from '../repositories/FinanceRepository';
import { database } from '../repositories/Repository';

export class FinanceService {
    private _lancamentoRepo: LancamentoRepository | null = null;
    private _investimentoRepo: InvestimentoRepository | null = null;
    private _contaRepo: ContaRepository | null = null;
    private _cartaoRepo: CartaoRepository | null = null;
    private _planningCategoryRepo: PlanningCategoryRepository | null = null;

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

    private get contaRepo(): ContaRepository {
        if (!this._contaRepo) {
            this._contaRepo = new ContaRepository(database.getDb());
        }
        return this._contaRepo;
    }

    private get cartaoRepo(): CartaoRepository {
        if (!this._cartaoRepo) {
            this._cartaoRepo = new CartaoRepository(database.getDb());
        }
        return this._cartaoRepo;
    }

    private get planningCategoryRepo(): PlanningCategoryRepository {
        if (!this._planningCategoryRepo) {
            this._planningCategoryRepo = new PlanningCategoryRepository(database.getDb());
        }
        return this._planningCategoryRepo;
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Accounts
    async getAccounts(): Promise<Conta[]> {
        return await this.contaRepo.list();
    }

    async createAccount(conta: Omit<Conta, 'id' | 'created_at'>): Promise<Conta> {
        return await this.contaRepo.create({
            ...conta,
            id: this.generateId(),
            created_at: new Date().toISOString()
        });
    }

    // Cards
    async getCards(): Promise<CartaoCredito[]> {
        return await this.cartaoRepo.list();
    }

    async createCard(card: Omit<CartaoCredito, 'id' | 'created_at'>): Promise<CartaoCredito> {
        return await this.cartaoRepo.create({
            ...card,
            id: this.generateId(),
            created_at: new Date().toISOString()
        });
    }

    // Transactions
    async createTransaction(transaction: Omit<LancamentoFinanceiro, 'id' | 'created_at'>): Promise<LancamentoFinanceiro[]> {
        const results: LancamentoFinanceiro[] = [];
        const groupId = (transaction.parcelas_total || 1) > 1 ? this.generateId() : null;

        const installmentValue = transaction.valor / (transaction.parcelas_total || 1);

        for (let i = 0; i < (transaction.parcelas_total || 1); i++) {
            const date = new Date(transaction.data);
            date.setMonth(date.getMonth() + i);

            const newTransaction: LancamentoFinanceiro = {
                ...transaction,
                valor: installmentValue, // Use divided value
                id: this.generateId(),
                created_at: new Date().toISOString(),
                data: date.toISOString().split('T')[0],
                parcela_atual: i + 1,
                id_grupo_parcela: groupId
            };
            results.push(await this.lancamentoRepo.create(newTransaction));
        }
        return results;
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
        const accounts = await this.getAccounts();
        const allTransactions = await this.lancamentoRepo.list();

        const income = real.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0);
        const expenses = real.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);

        const plannedExpenses = planned.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0);

        // Wallet Balance (Income - Expense for Wallet type only, explicitly for 'conta-1' as main wallet for now or allow multiple)
        // Requirement: "saldo atual da carteira"
        // Let's iterate all 'carteira' type accounts
        const walletAccounts = accounts.filter(a => a.tipo === 'carteira');

        // Calculate balance for each wallet
        let totalWalletBalance = 0;
        for (const account of walletAccounts) {
            const txs = allTransactions.filter(t => t.conta_id === account.id && !t.planejado);
            const bal = txs.reduce((s, t) => t.tipo === 'receita' ? s + t.valor : s - t.valor, 0);
            totalWalletBalance += (account.saldo_inicial + bal);
        }

        // Vouchers Balance (vale_alimentacao + vale_refeicao)
        const voucherAccounts = accounts.filter(a => ['vale_alimentacao', 'vale_refeicao'].includes(a.tipo));
        let vouchersBalance = 0;
        for (const account of voucherAccounts) {
            const txs = allTransactions.filter(t => t.conta_id === account.id && !t.planejado);
            const bal = txs.reduce((s, t) => t.tipo === 'receita' ? s + t.valor : s - t.valor, 0);
            vouchersBalance += (account.saldo_inicial + bal);
        }

        return {
            income,
            expenses,
            plannedExpenses,
            balance: totalWalletBalance,
            vouchersBalance: vouchersBalance || 0,
            hasVouchers: voucherAccounts.length > 0,
            expenseUsagePercent: plannedExpenses > 0 ? (expenses / plannedExpenses) * 100 : 0
        };
    }

    async getCardInvoice(cardId: string, monthDate: Date): Promise<number> {
        const card = await this.cartaoRepo.read(cardId);
        if (!card) return 0;

        // Simplified logic: transactions within the billing cycle
        // Closing date is card.dia_fechamento
        const month = monthDate.getMonth();
        const year = monthDate.getFullYear();

        // Fatura of Month M:
        // Transactions from Day Fechamento of M-1 to Day Fechamento - 1 of M
        const startCycle = new Date(year, month - 1, card.dia_fechamento);
        const endCycle = new Date(year, month, card.dia_fechamento - 1);

        const all = await this.lancamentoRepo.list();
        const cardTxs = all.filter(t =>
            t.cartao_id === cardId &&
            !t.planejado &&
            new Date(t.data) >= startCycle &&
            new Date(t.data) <= endCycle
        );

        return cardTxs.reduce((sum, t) => sum + t.valor, 0);
    }

    async payInvoice(cardId: string, accountId: string, value: number) {
        // Create an expense in the wallet
        await this.createTransaction({
            tipo: 'despesa',
            valor: value,
            categoria: 'Pagamento Cartão',
            data: new Date().toISOString().split('T')[0],
            nota: `Fatura Cartão ID: ${cardId}`,
            planejado: false,
            conta_id: accountId
        });
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

    // Planning Categories
    async getPlanningCategories(): Promise<CategoriaPlanejamento[]> {
        return await this.planningCategoryRepo.list();
    }

    async createPlanningCategory(category: Omit<CategoriaPlanejamento, 'id' | 'created_at'>): Promise<CategoriaPlanejamento> {
        return await this.planningCategoryRepo.create({
            ...category,
            id: this.generateId(),
            created_at: new Date().toISOString()
        });
    }

    async updatePlanningCategory(id: string, category: Partial<CategoriaPlanejamento>): Promise<CategoriaPlanejamento> {
        return await this.planningCategoryRepo.update(id, category);
    }

    async deletePlanningCategory(id: string): Promise<boolean> {
        return await this.planningCategoryRepo.delete(id);
    }
}

export const financeService = new FinanceService();
