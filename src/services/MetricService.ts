import { habitService } from './HabitService';
import { financeService } from './FinanceService';
import { relationshipService } from './RelationshipService';
import { DeviceEventEmitter } from 'react-native';



interface PillarMetrics {
    'pilar-1': number;
    'pilar-2': number;
    'pilar-3': number;
    'pilar-4': number;
}

class MetricService {
    /**
     * Calcula as métricas mensais para todos os 4 pilares.
     * @param date Data de referência para o mês desejado
     * @returns Objeto contendo a porcentagem (0-100) para cada pilar.
     */
    async getMonthlyMetrics(date: Date): Promise<PillarMetrics> {
        try {
            // Helper to sanitize progress
            const sanitize = (val: number) => {
                if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return 0;
                return Math.max(0, Math.min(100, Math.round(val)));
            };

            // Pilar 1: Espiritualidade (Metas de Hábitos)
            const p1 = sanitize(await habitService.getMonthlyProgress('pilar-1', date));

            // Pilar 2: Saúde (Metas de Hábitos)
            const p2 = sanitize(await habitService.getMonthlyProgress('pilar-2', date));

            // Pilar 3: Finanças (Gastos vs Planejado)
            const financeSummary = await financeService.getMonthSummary(date);
            const p3 = sanitize(financeSummary.expenseUsagePercent);

            // Pilar 4: Relacionamentos (Compromissos Cumpridos no Mês)
            const p4 = sanitize(await this.calculateRelationshipsProgress(date));

            return {
                'pilar-1': p1,
                'pilar-2': p2,
                'pilar-3': p3,
                'pilar-4': p4,
            };
        } catch (error) {
            console.error("Error calculating monthly metrics:", error);
            return {
                'pilar-1': 0,
                'pilar-2': 0,
                'pilar-3': 0,
                'pilar-4': 0,
            };
        }
    }

    private async calculateRelationshipsProgress(date: Date): Promise<number> {
        const allCompromissos = await relationshipService.getCompromissos();

        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const monthCompromissos = allCompromissos.filter(c => {
            const cDate = new Date(c.data_hora);
            return cDate >= startOfMonth && cDate <= endOfMonth;
        });

        if (monthCompromissos.length === 0) return 0;

        const completed = monthCompromissos.filter(c => c.status === 'concluida').length;
        return Math.round((completed / monthCompromissos.length) * 100);
    }

    notifyMetricsChanged() {
        DeviceEventEmitter.emit('metrics_updated');
    }
}

export const metricService = new MetricService();
