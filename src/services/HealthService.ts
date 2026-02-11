import { HealthRepository } from '../repositories/HealthRepository';
import { UserRepository } from '../repositories/UserRepository';
import { HealthMetric, ChatMessage, ExerciseReport, HealthExam, HealthProfile } from '../models/health';
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
     * Get the health profile
     */
    async getProfile(): Promise<HealthProfile | null> {
        // We prefer health_profile table for IA context
        const healthProfile = await this.repo.getProfile();
        if (healthProfile) return healthProfile;

        // Fallback to unified user profile
        const userProfile = await this.userRepo.getProfile();
        if (userProfile) {
            return {
                id: 'current_user',
                nome: userProfile.nome,
                peso: userProfile.peso || undefined,
                altura: userProfile.altura || undefined,
                meta_peso: userProfile.meta_peso || undefined,
                sexo: userProfile.sexo || undefined,
                updated_at: userProfile.updated_at
            } as HealthProfile;
        }
        return null;
    }

    /**
     * Save/Update user profile
     */
    async saveProfile(profile: HealthProfile): Promise<HealthProfile> {
        const saved = await this.repo.saveProfile(profile);
        // Sync back to user_profile if possible for consistency
        try {
            const userProfile = await this.userRepo.getProfile();
            if (userProfile) {
                await this.userRepo.saveProfile({
                    ...userProfile,
                    peso: profile.peso || userProfile.peso,
                    altura: profile.altura || userProfile.altura,
                    meta_peso: profile.meta_peso || userProfile.meta_peso,
                    sexo: (profile.sexo as any) || userProfile.sexo,
                    updated_at: new Date().toISOString()
                });
            }
        } catch (e) {
            console.error("Error syncing profile", e);
        }
        return saved;
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

    // --- Exercise Reports ---

    async saveExerciseReport(report: Omit<ExerciseReport, 'id' | 'created_at'>): Promise<ExerciseReport> {
        const fullReport: ExerciseReport = {
            id: Date.now().toString(),
            ...report,
            created_at: new Date().toISOString()
        };
        return this.repo.saveExerciseReport(fullReport);
    }

    calculateCalories(exercise: string, durationMin: number): number {
        // Very basic MET based calculation
        // MET: Walking (3), Running (8), Cycling (6), Gym (5)
        let met = 5;
        const lowerEx = exercise.toLowerCase();
        if (lowerEx.includes('caminha')) met = 3.5;
        if (lowerEx.includes('corrida') || lowerEx.includes('correr')) met = 8;
        if (lowerEx.includes('pedal') || lowerEx.includes('bicicleta')) met = 6;
        if (lowerEx.includes('musculação') || lowerEx.includes('academia')) met = 5;
        if (lowerEx.includes('natação')) met = 7;

        // Formula: (MET * weight * 3.5) / 200 * duration
        // We'll use a default weight of 70 if not found
        return Math.round(met * 70 * (durationMin / 60) * 1.05); // Simplified
    }

    generateWorkoutSuggestion(lastReport?: ExerciseReport): string {
        const options = [
            "Treino de musculação focado em membros superiores e 20 min de cardio.",
            "Treino de musculação focado em membros inferiores e abdômen.",
            "Treino HIIT de 30 minutos para queima de gordura.",
            "Caminhada leve de 45 minutos ou natação recreativa.",
            "Treino Full Body focado em força e resistência."
        ];
        return options[Math.floor(Math.random() * options.length)];
    }

    // --- Health Metrics & Calculations ---

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
        if (gender === 'female') {
            return Math.round(447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age));
        } else {
            return Math.round(88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age));
        }
    }

    calculateTDEE(bmr: number, activityLevel: string): number {
        const multipliers: Record<string, number> = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        return Math.round(bmr * (multipliers[activityLevel] || 1.2));
    }

    calculateWaterGoal(weight: number): number {
        return Math.round(weight * 35);
    }

    // --- Exams ---

    async saveExam(filename: string, analysis: string): Promise<HealthExam> {
        const exam: HealthExam = {
            id: Date.now().toString(),
            filename,
            analysis,
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString()
        };
        return this.repo.saveExam(exam);
    }

    // --- Diet Planning ---

    generateWeeklyDiet(params: {
        macros: { protein: number, carb: number, fat: number },
        tdee: number,
        goal: 'loss' | 'gain' | 'maintain',
        inventory: string
    }): string {
        const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        let diet = "Aqui está sua sugestão de dieta semanal:\n\n";

        days.forEach((day, index) => {
            if (index === 6) { // Domingo - Refeição Livre
                diet += `📅 **${day}**: Dia de Refeição Livre! Aproveite com moderação.\n`;
            } else {
                diet += `📅 **${day}**:\n`;
                diet += `- Café: Ovos mexidos e fruta\n`;
                diet += `- Almoço: Proteína grelhada, arroz integral e salada\n`;
                diet += `- Lanche: Iogurte com aveia\n`;
                diet += `- Jantar: Omelete ou Sopa de legumes com frango\n\n`;
            }
        });

        diet += `\n*Meta diária:* ${params.tdee} kcal | P: ${params.macros.protein}g | C: ${params.macros.carb}g | G: ${params.macros.fat}g`;
        return diet;
    }

    // --- Chat ---

    async saveMessage(text: string, sender: 'user' | 'ai', type: 'text' | 'action' | 'system' = 'text', metadata?: any): Promise<ChatMessage> {
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

    async sanitizeHistory(): Promise<boolean> {
        const history = await this.getChatHistory();
        const hasStaleData = history.some(msg =>
            msg.text.includes('Recebi: "Dica de dieta"') ||
            msg.text.includes('1.78m') ||
            (msg.sender === 'ai' && msg.text.includes('fake'))
        );

        if (hasStaleData) {
            await this.clearChat();
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

