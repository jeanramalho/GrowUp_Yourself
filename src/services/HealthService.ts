import { HealthRepository } from '../repositories/HealthRepository';
import { HealthProfile, HealthMetric, ChatMessage } from '../models/health';
import { database } from '../repositories/Repository';

export class HealthService {
    private _repo: HealthRepository | null = null;

    private get repo(): HealthRepository {
        if (!this._repo) {
            this._repo = new HealthRepository(database.getDb());
        }
        return this._repo;
    }

    async getProfile(): Promise<HealthProfile | null> {
        return this.repo.getProfile();
    }

    async saveProfile(profile: HealthProfile): Promise<HealthProfile> {
        return this.repo.saveProfile(profile);
    }

    async addMetric(metric: Omit<HealthMetric, 'created_at'>): Promise<HealthMetric> {
        const newMetric: HealthMetric = {
            ...metric,
            created_at: new Date().toISOString()
        };
        return this.repo.addMetric(newMetric);
    }

    async getMetrics(type: string): Promise<HealthMetric[]> {
        return this.repo.getMetrics(type);
    }

    // --- Calculations ---

    calculateBMI(weight: number, heightCm: number): number {
        const heightM = heightCm / 100;
        if (heightM === 0) return 0;
        return parseFloat((weight / (heightM * heightM)).toFixed(1));
    }

    getBMICategory(bmi: number): string {
        if (bmi < 18.5) return 'Abaixo do peso';
        if (bmi < 24.9) return 'Peso normal';
        if (bmi < 29.9) return 'Sobrepeso';
        return 'Obesidade';
    }

    calculateBMR(weight: number, heightCm: number, age: number, gender: 'male' | 'female' | 'other'): number {
        // Harris-Benedict Equation
        if (gender === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age);
        } else {
            return 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);
        }
    }

    calculateWaterGoal(weight: number): number {
        // approx 35ml per kg
        return Math.round(weight * 35);
    }

    // --- Chat ---

    async saveMessage(text: string, sender: 'user' | 'ai', type: 'text' | 'action' = 'text', metadata?: any): Promise<ChatMessage> {
        const message: ChatMessage = {
            id: Date.now().toString(), // Simple ID for now
            text,
            sender,
            timestamp: new Date().toISOString(),
            type,
            metadata
        };
        return this.repo.saveMessage(message);
    }

    async getChatHistory(): Promise<ChatMessage[]> {
        return this.repo.getChatHistory();
    }

    async clearChat(): Promise<void> {
        return this.repo.clearChat();
    }
}

export const healthService = new HealthService();
