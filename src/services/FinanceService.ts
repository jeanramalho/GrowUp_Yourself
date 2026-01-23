import { LancamentoFinanceiro, Investimento, Conta, CartaoCredito, CategoriaFinanceira } from '../models';
import { LancamentoRepository, InvestimentoRepository, ContaRepository, CartaoRepository, FinanceCategoryRepository } from '../repositories/FinanceRepository';
import { database } from '../repositories/Repository';

export class FinanceService {
    private _lancamentoRepo: LancamentoRepository | null = null;
    private _investimentoRepo: InvestimentoRepository | null = null;
    private _contaRepo: ContaRepository | null = null;
    private _cartaoRepo: CartaoRepository | null = null;
    // private _planningCategoryRepo: PlanningCategoryRepository | null = null; // Removed

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

    private _financeCategoryRepo: FinanceCategoryRepository | null = null;

    private get financeCategoryRepo(): FinanceCategoryRepository {
        if (!this._financeCategoryRepo) {
            this._financeCategoryRepo = new FinanceCategoryRepository(database.getDb());
        }
        return this._financeCategoryRepo;
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

    async getAccountsWithBalance(): Promise<(Conta & { saldo_atual: number })[]> {
        const accounts = await this.contaRepo.list();
        const allTransactions = await this.lancamentoRepo.list();

        return accounts.map(account => {
            const txs = allTransactions.filter(t => t.conta_id === account.id && !t.planejado);
            const balanceChange = txs.reduce((sum, t) => {
                return t.tipo === 'receita' ? sum + Number(t.valor) : sum - Number(t.valor);
            }, 0);

            return {
                ...account,
                saldo_atual: Number(account.saldo_inicial) + balanceChange
            };
        });
    }

    async createAccount(conta: Omit<Conta, 'id' | 'created_at'>): Promise<Conta> {
        return await this.contaRepo.create({
            ...conta,
            id: this.generateId(),
            created_at: new Date().toISOString()
        });
    }

    async updateAccount(id: string, conta: Partial<Conta>): Promise<Conta> {
        return await this.contaRepo.update(id, conta);
    }

    async deleteAccount(id: string): Promise<boolean> {
        // Also delete related transactions or handle them?
        // For simplicity, we might want to unlink them or delete them.
        // Usually accounts are critical, maybe just prevent delete if has transactions?
        // User request "excluir os cartões, vales e fontes de renda", implying a soft or hard delete.
        // Let's assume hard delete of account and unlink transactions for safety, or delete them?
        // Let's unlink them (set conta_id = null) to preserve history but remove connection.

        const allTxs = await this.lancamentoRepo.list();
        const related = allTxs.filter(t => t.conta_id === id);

        for (const tx of related) {
            await this.lancamentoRepo.update(tx.id, {
                conta_id: null, // Type definition might need to allow null, let's check models. 
                nota: (tx.nota || '') + ' (Conta Excluída)'
            } as any);
        }

        return await this.contaRepo.delete(id);
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

    async updateCard(id: string, card: Partial<CartaoCredito>): Promise<CartaoCredito> {
        return await this.cartaoRepo.update(id, card);
    }

    async deleteCard(id: string): Promise<boolean> {
        const card = await this.cartaoRepo.read(id);
        if (!card) return false;

        const allTxs = await this.lancamentoRepo.list();

        // Logic: Delete Future/Current (Open Invoice onwards), Unlink Past (Closed Invoices)

        // Determine "Open Invoice" start date
        const today = new Date();
        let targetMonth = today.getMonth();
        let targetYear = today.getFullYear();

        // If today >= closing, the open invoice is NEXT month.
        if (today.getDate() >= card.dia_fechamento) {
            targetMonth++;
            if (targetMonth > 11) {
                targetMonth = 0;
                targetYear++;
            }
        }

        // Start of Open Invoice Cycle:
        // Previous Month relative to target, Day = Closing
        const openInvoiceStart = new Date(targetYear, targetMonth - 1, card.dia_fechamento);
        // Reset time to start of day
        openInvoiceStart.setHours(0, 0, 0, 0);

        const cardTxs = allTxs.filter(t => t.cartao_id === id);

        for (const tx of cardTxs) {
            const txDate = new Date(tx.data);
            // If tx date is ON or AFTER the open invoce start -> DELETE
            if (txDate >= openInvoiceStart) {
                await this.lancamentoRepo.delete(tx.id);
            } else {
                // Older tx -> UNLINK
                await this.lancamentoRepo.update(tx.id, {
                    cartao_id: null,
                    nota: (tx.nota || '') + ' (Cartão Excluído)'
                } as any);
            }
        }

        return await this.cartaoRepo.delete(id);
    }

    // Transactions
    async createTransaction(transaction: Omit<LancamentoFinanceiro, 'id' | 'created_at'>): Promise<LancamentoFinanceiro[]> {
        const results: LancamentoFinanceiro[] = [];
        const groupId = (transaction.parcelas_total || 1) > 1 ? this.generateId() : null;

        const parcels = Number(transaction.parcelas_total) || 1;
        // Logic update: received value IS the installment value calculated by UI
        const installmentValue = Number(transaction.valor);

        for (let i = 0; i < parcels; i++) {
            const date = new Date(transaction.data);
            date.setMonth(date.getMonth() + i);

            const newTransaction: LancamentoFinanceiro = {
                ...transaction,
                id: this.generateId(),
                created_at: new Date().toISOString(),
                data: date.toISOString().split('T')[0],
                valor: installmentValue,
                parcela_atual: i + 1,
                id_grupo_parcela: groupId,
                parcelas_total: parcels
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
        const transactions = await this.getCardTransactions(cardId, monthDate);
        return transactions.reduce((sum, t) => {
            if (t.tipo === 'despesa') return sum + t.valor;
            if (t.tipo === 'receita') return sum - t.valor;
            // Negative 'despesa' or positive 'receita'? Actually invoice is amount to pay.
            // Expense increases invoice. Revenue (payment) decreases it.
            return sum;
        }, 0);
    }

    async getCardTransactions(cardId: string, monthDate: Date): Promise<LancamentoFinanceiro[]> {
        const card = await this.cartaoRepo.read(cardId);
        if (!card) return [];

        let targetMonth = monthDate.getMonth();
        let targetYear = monthDate.getFullYear();

        // Check if we are past the closing date of the current month
        // If today is 23rd and closing is 10th, we are already in NEXT month's invoice cycle (Open)
        if (monthDate.getDate() >= card.dia_fechamento) {
            targetMonth++;
            if (targetMonth > 11) {
                targetMonth = 0;
                targetYear++;
            }
        }
        // If today is 5th and closing is 10th, we are in THIS month's invoice cycle (Dec 10 - Jan 9)

        // Calculate cycle range for the TARGET invoice
        // Cycle starts on PreviousMonth Day=Closing
        // Cycle ends on TargetMonth Day=Closing-1

        // Start Date: Month-1 (relative to target), Day: Closing
        const startCycle = new Date(targetYear, targetMonth - 1, card.dia_fechamento);
        // End Date: Month (relative to target), Day: Closing - 1
        const endCycle = new Date(targetYear, targetMonth, card.dia_fechamento - 1);

        // Adjust for end of day
        endCycle.setHours(23, 59, 59, 999);

        const all = await this.lancamentoRepo.list();
        return all.filter(t =>
            t.cartao_id === cardId &&
            !t.planejado &&
            new Date(t.data) >= startCycle &&
            new Date(t.data) <= endCycle
        ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    }

    async payInvoice(cardId: string, accountId: string, value: number) {
        const today = new Date().toISOString().split('T')[0];

        // 1. Create an expense in the wallet (money leaving the account)
        await this.createTransaction({
            tipo: 'despesa',
            valor: value,
            categoria: 'Pagamento Cartão',
            data: today,
            nota: `Fatura Cartão ID: ${cardId}`,
            planejado: false,
            conta_id: accountId
        });

        // 2. Create a revenue (payment) on the card to zero the invoice
        // This acts as a credit to the card balance
        await this.createTransaction({
            tipo: 'receita',
            valor: value,
            categoria: 'Pagamento de Fatura',
            data: today,
            nota: 'Pagamento de Fatura',
            planejado: false,
            cartao_id: cardId
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
    // Categories
    async getCategories(): Promise<CategoriaFinanceira[]> {
        return await this.financeCategoryRepo.list();
    }

    async getActiveCategories(monthDate: Date): Promise<CategoriaFinanceira[]> {
        // Return valid categories for the month (Permanent + Monthly ones for specific month)
        // For "Monthly" logic, we might need to filter by creation date or specific metadata.
        // Requirement: "quando não é a categoria só servirá para o mes atual"
        // We can use created_at to check if it matches the month if not permanent.
        const all = await this.financeCategoryRepo.list();
        const startMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const endMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        endMonth.setHours(23, 59, 59, 999);

        return all.filter(c => {
            if (c.arquivada) return false;
            if (c.is_permanente) return true;

            const created = new Date(c.created_at);
            return created >= startMonth && created <= endMonth;
        });
    }

    async createCategory(category: Omit<CategoriaFinanceira, 'id' | 'created_at' | 'arquivada'>): Promise<CategoriaFinanceira> {
        return await this.financeCategoryRepo.create({
            ...category,
            id: this.generateId(),
            arquivada: false,
            created_at: new Date().toISOString()
        });
    }

    async updateCategory(id: string, category: Partial<CategoriaFinanceira>): Promise<CategoriaFinanceira> {
        return await this.financeCategoryRepo.update(id, category);
    }

    async deleteCategory(id: string): Promise<boolean> {
        // Soft delete
        return await this.financeCategoryRepo.update(id, { arquivada: true } as any);
    }

    // Planning Items
    async createPlannedItem(item: Omit<LancamentoFinanceiro, 'id' | 'created_at' | 'planejado'> & { recorrente?: boolean }): Promise<LancamentoFinanceiro[]> {
        const results: LancamentoFinanceiro[] = [];
        const isRecurrent = item.recorrente;
        const recurrenceId = isRecurrent ? this.generateId() : null;

        // How many months to generate? Let's say 12 if recurrent, or 1 if not.
        const count = isRecurrent ? 12 : 1;

        for (let i = 0; i < count; i++) {
            const date = new Date(item.data);
            date.setMonth(date.getMonth() + i);

            const newItem: LancamentoFinanceiro = {
                ...item,
                id: this.generateId(),
                created_at: new Date().toISOString(),
                data: date.toISOString().split('T')[0],
                planejado: true,
                status: 'pendente',
                recorrencia_id: recurrenceId
            };
            // Remove 'recorrente' property as it's not in the model
            delete (newItem as any).recorrente;

            results.push(await this.lancamentoRepo.create(newItem));
        }
        return results;
    }

    async getUpcomingPayments(limit: number = 3): Promise<LancamentoFinanceiro[]> {
        return await this.lancamentoRepo.getUpcomingPayments(limit);
    }

    async payPlannedItem(plannedId: string, accountId: string, date: string): Promise<void> {
        const planned = await this.lancamentoRepo.read(plannedId);
        if (!planned) throw new Error("Planning item not found");

        // 1. Create real transaction
        await this.createTransaction({
            tipo: planned.tipo,
            valor: planned.valor,
            categoria_id: planned.categoria_id,
            // Fallback for legacy items without category_id
            categoria: planned.categoria,
            data: date,
            nota: planned.nota,
            planejado: false,
            conta_id: accountId
        });

        // 2. Mark planned as paid
        await this.lancamentoRepo.update(plannedId, { status: 'pago' } as any);
    }
}

export const financeService = new FinanceService();
