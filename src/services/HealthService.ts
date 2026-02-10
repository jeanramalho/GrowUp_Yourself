import { HealthRepository } from '../repositories/HealthRepository';
import { UserRepository } from '../repositories/UserRepository';
import { HealthMetric, ChatMessage } from '../models/health';
import { UserProfile } from '../models'; // Import UserProfile from generic models
import { database } from '../repositories/Repository';

export class HealthService {
    private _repo: HealthRepository | null = null;
    private _userRepo: UserRepository | null = null;

    private get repo(): HealthRepository {
        if (!this._repo) {
            this._repo = new HealthRepository(database.getDb());
        }
        return this._repo;
    }

    private get userRepo(): UserRepository {
        if (!this._userRepo) {
            this._userRepo = new UserRepository(database.getDb());
        }
        return this._userRepo;
    }

    /**
     * Get the unified user profile (acting as health profile too)
     */
    async getProfile(): Promise<UserProfile | null> {
        return this.userRepo.getProfile();
    }

    /**
     * Save/Update user profile
     */
    async saveProfile(profile: UserProfile): Promise<UserProfile> {
        return this.userRepo.saveProfile(profile);
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

    calculateBMR(weight: number, heightCm: number, age: number, gender: 'male' | 'female' | 'other' | null): number {
        // Harris-Benedict Equation
        // Default to male if null/unknown for now or handle appropriately
        if (gender === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);
        } else {
            return 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age);
        }
    }

    calculateWaterGoal(weight: number): number {
        // approx 35ml per kg
        return Math.round(weight * 35);
    }

    // --- Chat ---

    async saveMessage(text: string, sender: 'user' | 'ai', type: 'text' | 'action' = 'text', metadata?: any): Promise<ChatMessage> {
        const message: ChatMessage = {
            id: Date.now().toString(),
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

    /**
     * Check for stale/mock messages and clear them if found.
     * This creates a clean slate for the new AI.
     */
    async sanitizeHistory(): Promise<boolean> {
        const history = await this.getChatHistory();
        // Look for signature of stale/mock data 
        const hasStaleData = history.some(msg =>
            msg.text.includes('Recebi: "Dica de dieta"') ||
            msg.text.includes('1.78m') ||
            (msg.sender === 'ai' && msg.text.includes('fake')) // generic safeguard
        );

        if (hasStaleData) {
            console.log('Sanitizing stale chat history...');
            await this.clearChat();

            // Add a "System Upgrade" message
            await this.saveMessage(
                'Atualizei meu sistema para uma nova versão de Inteligência Artificial. Agora sou mais inteligente e proativo! Como posso te ajudar hoje?',
                'ai'
            );
            return true;
        }
        return false;
    }
}

export const healthService = new HealthService();
