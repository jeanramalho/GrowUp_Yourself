import { healthService } from './HealthService';
import { ChatMessage, HealthProfile } from '../models/health';
import nlp from 'compromise';

/**
 * HealthAIService
 * An Offline NLP AI Engine for health assistance using 'compromise'.
 */
export class HealthAIService {

    /**
     * Proactive check: If profile is missing data, ask for it.
     * Also handle monthly check-in.
     */
    async checkIn(): Promise<ChatMessage | null> {
        const profile = await healthService.getProfile();

        // 1. Initial Profile Data Check
        if (!profile || !profile.peso || !profile.altura) {
            const history = await healthService.getChatHistory();
            const lastMsg = history[history.length - 1];
            if (lastMsg && lastMsg.sender === 'ai' && lastMsg.text.includes('?')) return null;

            const text = "Olá! Notei que ainda não tenho seus dados de peso e altura. Para que eu possa calcular seu IMC e metas de água, por favor me informe. Exemplo: 'tenho 70kg e 175cm'.";
            return await healthService.saveMessage(text, 'ai', 'text');
        }

        // 2. Monthly Check-in
        const lastCheckin = profile.last_monthly_checkin ? new Date(profile.last_monthly_checkin) : null;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        if (!lastCheckin || lastCheckin < oneMonthAgo) {
            const text = "Olá! Já faz um tempo desde nossa última atualização. Mudou alguma coisa no seu peso, altura ou nível de atividade física?";
            return await healthService.saveMessage(text, 'ai', 'text', {
                actionType: 'monthly_checkin',
                options: [
                    { label: 'Sim', value: 'yes' },
                    { label: 'Não', value: 'no' }
                ]
            });
        }

        return null;
    }

    async processMessage(userText: string): Promise<ChatMessage> {
        // 1. Initial setup
        await healthService.saveMessage(userText, 'user', 'text');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial thinking delay

        const lowerText = userText.toLowerCase().trim();
        const history = await healthService.getChatHistory();
        const lastAiMsg = [...history].reverse().find(m => m.sender === 'ai');
        const lastActionType = lastAiMsg?.metadata?.actionType;
        const profile = await healthService.getProfile();

        let responseText = '';
        let actionType: any = 'text';
        let metadata: any = {};

        // --- Multi-step Flow Handling ---
        
        // 1. Monthly Check-in Response
        if (lastActionType === 'monthly_checkin') {
            if (lowerText.match(/(n[ãa]o|not|no)/)) {
                responseText = "Entendido! Vamos continuar com seus dados atuais. Como posso te ajudar hoje?";
                if (profile) {
                    await healthService.saveProfile({ 
                        ...profile, 
                        last_monthly_checkin: new Date().toISOString() 
                    });
                }
            } else {
                responseText = "Tudo bem! O que mudou? Pode me falar seu novo peso, altura ou nível de atividade.";
                // Flow continues via natural intent detection below if they provided data
            }
        }

        // 2. Exercise Report Follow-up
        else if (lastActionType === 'exercise_report' && lastAiMsg?.text.toLowerCase().includes('quais exercícios')) {
            const durationMatch = lowerText.match(/(\d+)\s*(min|m|hora|h)/);
            const duration = durationMatch ? parseInt(durationMatch[1]) : 30;
            const weight = profile?.peso || 75;
            const calories = healthService.calculateCalories(userText, duration, weight);
            const suggestion = healthService.generateWorkoutSuggestion();

            await healthService.saveExerciseReport({
                exercises: userText,
                duration,
                calories,
                date: new Date().toISOString().split('T')[0]
            });

            if (profile && (!profile.activityLevel || profile.activityLevel === 'sedentary')) {
                metadata = { actionType: 'suggest_activity_update' };
                responseText = `Excelente! Você queimou aproximadamente **${calories} calorias**. No seu próximo treino, sugiro focar em: **${suggestion}**.\n\nNotei que você está se exercitando! Quer que eu atualize seu nível de atividade física para calcular suas metas com mais precisão?`;
            } else {
                responseText = `Excelente! Você queimou aproximadamente **${calories} calorias**. No seu próximo treino, sugiro focar em: **${suggestion}**.`;
            }
        }

        // 3. Weekly Diet Follow-up
        else if (lastActionType === 'weekly_diet' && lastAiMsg?.text.toLowerCase().includes('o que você tem em casa')) {
            if (profile && profile.peso && profile.altura) {
                let age = 30;
                if (profile.data_nascimento) {
                    const birthDate = new Date(profile.data_nascimento);
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                }

                const bmr = healthService.calculateBMR(profile.peso, profile.altura, age, (profile.sexo as any) || 'male');
                const tdee = healthService.calculateTDEE(bmr, profile.activityLevel || 'moderate');
                const targetKcal = Math.max(1200, tdee - 500); 
                const protein = profile.peso * 2;
                const fat = Math.round(profile.peso * 0.8);
                const carb = Math.max(50, Math.round((targetKcal - (protein * 4) - (fat * 9)) / 4));

                responseText = healthService.generateWeeklyDiet({
                    macros: { protein, fat, carb },
                    tdee: targetKcal,
                    goal: 'loss',
                    inventory: userText
                });
            } else {
                responseText = "Para gerar sua dieta, preciso antes atualizar suas métricas. Me informe seu peso e altura.";
            }
        }

        // --- Intent Detection ---
        if (!responseText) {
            const doc = nlp(userText);

            if (doc.match('(oi|olá|hello|hi|bom dia|boa tarde|boa noite)').found) {
                responseText = this.getRandomResponse('greeting');
            }
            else if (doc.match('(relatório|exercício|treino|fiz|malhei|corri|pedalei|treinei)').found || this.isExerciseContext(lowerText)) {
                const duration = this.extractDuration(lowerText);
                const hasExercises = doc.match('(corrida|caminhada|musculação|academia|treino|futebol|natação|pedal|bicicleta)').found || lowerText.length > 20;

                if (duration && hasExercises) {
                    const weight = profile?.peso || 75;
                    const calories = healthService.calculateCalories(userText, duration, weight);
                    const suggestion = healthService.generateWorkoutSuggestion();

                    await healthService.saveExerciseReport({
                        exercises: userText,
                        duration,
                        calories,
                        date: new Date().toISOString().split('T')[0]
                    });

                    responseText = `Registro feito! Você queimou cerca de **${calories} calorias**. No seu próximo treino, sugiro: **${suggestion}**.`;

                    if (profile && (!profile.activityLevel || profile.activityLevel === 'sedentary')) {
                        responseText += `\n\nQuer que eu ajuste seu nível de atividade física no perfil?`;
                        metadata = { actionType: 'suggest_activity_update' };
                    }
                } else {
                    responseText = "Que bom que você treinou! Quais exercícios você fez e por quanto tempo aproximadamente?";
                    metadata = { actionType: 'exercise_report' };
                }
            }
            else if (lowerText.includes('métricas de saúde') || doc.match('(métricas|status|meu corpo|calorias|macros)').found) {
                if (profile && profile.peso && profile.altura) {
                    let age = 30;
                    if (profile.data_nascimento) {
                        const birthDate = new Date(profile.data_nascimento);
                        const today = new Date();
                        age = today.getFullYear() - birthDate.getFullYear();
                        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
                    }

                    const bmr = healthService.calculateBMR(profile.peso, profile.altura, age, (profile.sexo as any) || 'male');
                    const tdee = healthService.calculateTDEE(bmr, profile.activityLevel || 'moderate');
                    const bmi = healthService.calculateBMI(profile.peso, profile.altura);
                    const category = healthService.getBMICategory(bmi);
                    const targetKcal = Math.max(1200, tdee - 500);
                    const protein = profile.peso * 2;
                    const fat = Math.round(profile.peso * 0.8);
                    const carb = Math.max(50, Math.round((targetKcal - (protein * 4) - (fat * 9)) / 4));
                    const sugar = Math.round((targetKcal * 0.05) / 4);

                    responseText = `Suas métricas atuais:\n\n` +
                        `- **IMC:** ${bmi} (${category})\n` +
                        `- **TMB:** ${bmr} kcal\n` +
                        `- **TDEE:** ${tdee} kcal\n` +
                        `- **Meta (Deficit):** ${targetKcal} kcal\n\n` +
                        `Sugestão diária:\n` +
                        `- **Água:** ${healthService.calculateWaterGoal(profile.peso)}ml\n` +
                        `- **Proteína:** ${protein}g\n` +
                        `- **Carboidratos:** ${carb}g\n` +
                        `- **Gordura:** ${fat}g\n` +
                        `- **Açúcar Máximo:** ${sugar}g`;
                    metadata = { actionType: 'health_metrics' };
                } else {
                    responseText = "Para calcular suas métricas, preciso saber seu peso e altura. Pode me informar?";
                }
            }
            else if (lowerText.includes('dieta semanal') || doc.match('(dieta|comer|cardápio|alimentação)').found) {
                responseText = "Com certeza! Para eu montar sua dieta, o que você tem em casa hoje e o que pode comprar para a semana?";
                metadata = { actionType: 'weekly_diet' };
            }
            else if (lowerText.includes('analisar exame') || doc.match('(exame|laboratório|resultado|sangue)').found) {
                responseText = "Por favor, anexe seu exame em PDF. Vou analisar os dados para você.";
                metadata = { actionType: 'analyze_exam' };
            }
            else if (this.containsProfileData(lowerText)) {
                responseText = await this.handleProfileUpdate(lowerText);
            }
            else if (!this.isHealthRelated(userText)) {
                responseText = "Sou uma IA focada em saúde e bem-estar. Como posso te apoiar hoje?";
            }
            else {
                responseText = this.getRandomResponse('fallback');
            }
        }

        return await healthService.saveMessage(responseText, 'ai', actionType, metadata);
    }

    private isHealthRelated(text: string): boolean {
        const keywords = ['peso', 'altura', 'imc', 'dieta', 'treino', 'exercício', 'água', 'comer', 'saúde', 'dor', 'exame', 'médico', 'caloria', 'fome', 'sono', 'descanso', 'bem estar', 'hidratação', 'atleta', 'musculação', 'corrida', 'caminhada', 'vida', 'corpo', 'mente', 'ansiedade', 'stress', 'estresse'];
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k)) || nlp(text).match('(saúde|corpo|vida|bem|mal|doente|médico|remédio|treino|comer|fome)').found;
    }

    private containsProfileData(text: string): boolean {
        return this.extractWeight(text) !== null || this.extractHeight(text) !== null || this.detectActivityLevel(text) !== null;
    }

    private detectActivityLevel(text: string): HealthProfile['activityLevel'] | null {
        const lower = text.toLowerCase();
        if (lower.match(/(todo dia|todos os dias|6 vezes|7 vezes|pesado|atleta|extremamente|diariamente|treino muito)/)) return 'very_active';
        if (lower.match(/(4 vezes|5 vezes|frequente|ativo|intensamente|quase todo)/)) return 'active';
        if (lower.match(/(3 vezes|moderado|regularmente|academia|musculação)/)) return 'moderate';
        if (lower.match(/(1 vez|2 vezes|caminhada|leve|pouco|às vezes|de vez em quando)/)) return 'light';
        if (lower.match(/(sedentário|sedentario|não faço|nunca|escritório|sentado|parado|nenhum)/)) return 'sedentary';
        return null;
    }

    private extractWeight(text: string): number | null {
        const lower = text.toLowerCase();
        const withUnit = lower.match(/(?:peso\s+)?(\d+([.,]\d+)?)\s*(kg|kilos|quilos)/);
        if (withUnit) return parseFloat(withUnit[1].replace(',', '.'));
        if (lower.includes('peso') || lower.includes('pesando')) {
            const contextMatch = lower.match(/(?:peso|pesando)(?:.*?)\s+(\d+([.,]\d+)?)/);
            if (contextMatch) {
                const value = parseFloat(contextMatch[1].replace(',', '.'));
                if (value > 30 && value < 200) return value;
            }
        }
        return null;
    }

    private extractHeight(text: string): number | null {
        const lower = text.toLowerCase();
        const spoken = lower.match(/(?:1|um)\s*(?:metro[s]?)?\s*e\s*(\d{2})/);
        if (spoken) return 100 + parseInt(spoken[1]);
        const unitMatch = lower.match(/(\d+([.,]\d+)?)\s*(cm|cent[ií]metros|metros|m\b)/);
        if (unitMatch) {
            const val = parseFloat(unitMatch[1].replace(',', '.'));
            return val < 3 ? Math.round(val * 100) : Math.round(val);
        }
        if (lower.includes('altura')) {
            const numbers = lower.match(/\b(\d{3})\b/);
            if (numbers) {
                const val = parseInt(numbers[1]);
                if (val > 100 && val < 250) return val;
            }
        }
        return null;
    }

    private extractDuration(text: string): number | null {
        const lower = text.toLowerCase();
        const match = lower.match(/(\d+)\s*(minutos?|min|horas?|h\b)/);
        if (match) {
            const val = parseInt(match[1]);
            return (lower.includes('hora') || lower.includes(' h')) ? val * 60 : val;
        }
        return null;
    }

    private isExerciseContext(text: string): boolean {
        const keywords = ['trein', 'academia', 'musculação', 'corri', 'esteira', 'bicicleta', 'crossfit', 'natação', 'malh', 'exercíci', 'exercici'];
        return keywords.some(k => text.toLowerCase().includes(k));
    }

    private async handleProfileUpdate(text: string): Promise<string> {
        let profile = await healthService.getProfile();
        if (!profile) {
            profile = { id: 'current_user', updated_at: new Date().toISOString() } as HealthProfile;
        }

        const updates: string[] = [];
        const weightValue = this.extractWeight(text);
        const heightValue = this.extractHeight(text);
        const extractedActivity = this.detectActivityLevel(text);

        if (weightValue !== null) {
            profile.peso = weightValue;
            updates.push(`peso (${weightValue}kg)`);
            await healthService.addMetric({ id: crypto.randomUUID(), type: 'weight', value: weightValue, unit: 'kg', date: new Date().toISOString().split('T')[0] });
        }
        if (heightValue !== null) {
            profile.altura = heightValue;
            updates.push(`altura (${heightValue}cm)`);
        }
        if (extractedActivity) {
            profile.activityLevel = extractedActivity;
            updates.push(`nível de atividade (${healthService.getActivityLevelLabel(extractedActivity)})`);
        }

        if (updates.length > 0) {
            await healthService.saveProfile(profile);
            return `Entendido! Atualizei seu ${updates.join(', ')}. Isso me ajuda a ser mais preciso nas suas metas.`;
        }
        return "Consegui identificar que você enviou dados, mas não entendi exatamente o que atualizar.";
    }

    private getRandomResponse(type: 'greeting' | 'fallback'): string {
        const responses = {
            greeting: [
                'Olá! Como posso ajudar na sua saúde hoje?',
                'Oi! Pronto para cuidar do seu bem-estar?',
                'Olá! Vamos atingir suas metas de saúde juntos?'
            ],
            fallback: [
                'Não tenho certeza se entendi. Posso ajudar com seu peso, IMC, dieta ou treinos.',
                'Ainda estou aprendendo sobre isso. Tente me perguntar sobre exercícios ou métricas de saúde.',
                'Interessante! Lembre-se que sou especialista em saúde e bem-estar. Em que posso focar agora?'
            ]
        };
        const list = responses[type];
        return list[Math.floor(Math.random() * list.length)];
    }
}

export const healthAIService = new HealthAIService();
