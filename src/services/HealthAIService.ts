import { HealthService, healthService } from './HealthService';
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
        const now = new Date();

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
        // 1. Save user message
        const userMsg = await healthService.saveMessage(userText, 'user', 'text');

        // 2. Artificial Delay (Thinking...) - 1s
        await new Promise(resolve => setTimeout(resolve, 1000));

        const lowerText = userText.toLowerCase().trim();
        const history = await healthService.getChatHistory();
        const lastAiMsg = history.reverse().find(m => m.sender === 'ai');
        const lastActionType = lastAiMsg?.metadata?.actionType;

        let responseText = '';
        let actionType: any = 'text';
        let metadata: any = {};

        // --- Multi-step Flow Handling ---
        if (lastActionType === 'monthly_checkin') {
            if (lowerText === 'não' || lowerText === 'nao' || lowerText === 'no') {
                responseText = "Entendido! Vamos continuar com seus dados atuais. Como posso te ajudar hoje?";
                // Save last checkin date
                const profile = await healthService.getProfile();
                if (profile) await healthService.saveProfile({ ...profile, last_monthly_checkin: new Date().toISOString() });
            } else {
                responseText = "Tudo bem! O que mudou? Pode me falar seu novo peso, altura ou nível de atividade.";
                // Reset checkin so it asks again if they don't finish
            }
        }

        else if (lastActionType === 'exercise_report' && lastAiMsg?.text.includes('quais exercícios')) {
            // User is answering the exercise report question
            const durationMatch = lowerText.match(/(\d+)\s*(min|m|hora|h)/);
            const duration = durationMatch ? parseInt(durationMatch[1]) : 30;
            const calories = healthService.calculateCalories(userText, duration);
            const suggestion = healthService.generateWorkoutSuggestion();

            await healthService.saveExerciseReport({
                exercises: userText,
                duration: duration,
                calories: calories,
                date: new Date().toISOString().split('T')[0]
            });

            responseText = `Excelente! Você queimou aproximadamente **${calories} calorias**. No seu próximo treino, sugiro focar em: **${suggestion}**.`;
        }

        else if (lastActionType === 'weekly_diet' && lastAiMsg?.text.includes('o que você tem em casa')) {
            // User is answering the diet inventory question
            const profile = await healthService.getProfile();
            if (profile && profile.peso && profile.altura) {
                const age = 30; // Default or extract from profile if added
                const bmr = healthService.calculateBMR(profile.peso, profile.altura, age, (profile.sexo as any) || 'male');
                const tdee = healthService.calculateTDEE(bmr, profile.activityLevel || 'moderate');
                const macros = { protein: profile.peso * 2, fat: profile.peso * 0.8, carb: (tdee - (profile.peso * 2 * 4) - (profile.peso * 0.8 * 9)) / 4 };

                responseText = healthService.generateWeeklyDiet({
                    macros,
                    tdee: tdee - 500, // Suggesting 500 caloric deficit for weight loss
                    goal: 'loss',
                    inventory: userText
                });
            } else {
                responseText = "Para gerar sua dieta, preciso antes atualizar suas métricas. Me informe seu peso e altura.";
            }
        }

        // --- Intent Detection (nlp-compromise) ---
        else {
            const doc = nlp(userText);

            // GREETING
            if (doc.match('(oi|olá|hello|hi|bom dia|boa tarde|boa noite)').found) {
                responseText = this.getRandomResponse('greeting');
            }

            // EXERCISE REPORT (Predefined message or manual)
            else if (doc.match('(relatório|exercício|treino|fiz|malhei)').found && (doc.match('(exercício|relatório)').found || lowerText.includes('relatório de exercícios'))) {
                responseText = "Que bom que você treinou! Quais exercícios você fez e por quanto tempo aproximadamente?";
                actionType = 'text';
                metadata = { actionType: 'exercise_report' };
            }

            // HEALTH METRICS
            else if (lowerText.includes('métricas de saúde') || doc.match('(métricas|status|meu corpo|calorias|macros)').found) {
                const profile = await healthService.getProfile();
                if (profile && profile.peso && profile.altura) {
                    const age = 30; // Placeholder age
                    const bmr = healthService.calculateBMR(profile.peso, profile.altura, age, (profile.sexo as any) || 'male');
                    const tdee = healthService.calculateTDEE(bmr, profile.activityLevel || 'moderate');
                    const bmi = healthService.calculateBMI(profile.peso, profile.altura);
                    const category = healthService.getBMICategory(bmi);

                    const carb = Math.round(((tdee - 500) - (profile.peso * 2 * 4) - (Math.round(profile.peso * 0.8) * 9)) / 4);
                    const sugar = Math.round(((tdee - 500) * 0.05) / 4); // 5% of TDEE for added sugars

                    responseText = `Suas métricas atuais:\n\n` +
                        `- **IMC:** ${bmi} (${category})\n` +
                        `- **TMB (Calorias em repouso):** ${bmr} kcal\n` +
                        `- **Gasto Diário (TDEE):** ${tdee} kcal\n` +
                        `- **Deficit Sugerido:** ${tdee - 500} kcal\n\n` +
                        `Sugestão de ingestão diária (Meta de Perda de Peso):\n` +
                        `- **Água:** ${healthService.calculateWaterGoal(profile.peso)}ml\n` +
                        `- **Proteína:** ${profile.peso * 2}g\n` +
                        `- **Carboidratos:** ${carb}g\n` +
                        `- **Gordura:** ${Math.round(profile.peso * 0.8)}g\n` +
                        `- **Açúcar Máximo:** ${sugar}g`;

                    actionType = 'text';
                    metadata = { actionType: 'health_metrics' };
                } else {
                    responseText = "Para calcular suas métricas, preciso saber seu peso e altura. Pode me informar?";
                }
            }

            // WEEKLY DIET
            else if (lowerText.includes('dieta semanal') || doc.match('(dieta|comer|cardápio|alimentação)').found) {
                responseText = "Com certeza! Para eu montar sua dieta, o que você tem em casa hoje e o que pode comprar para a semana?";
                actionType = 'text';
                metadata = { actionType: 'weekly_diet' };
            }

            // EXAM ANALYSIS (Simulated interaction for now)
            else if (lowerText.includes('analisar exame') || doc.match('(exame|laboratório|resultado|sangue)').found) {
                responseText = "Por favor, anexe seu exame em PDF clicando no botão de anexo. Vou analisar os dados para você.\n\n*Lembre-se: Minha análise não substitui a de um médico.*";
                actionType = 'text';
                metadata = { actionType: 'analyze_exam' };
            }

            // UPDATE PROFILE (Weight/Height)
            else if (doc.match('#Value').found && doc.match('(kg|kilos|quilos|cm|centimetros|metros|m|peso|altura)').found) {
                responseText = await this.handleProfileUpdate(lowerText);
            }

            // TOPIC CONSTRAINT CHECK
            else if (!this.isHealthRelated(userText)) {
                responseText = "Sou uma IA focada em saúde, bem-estar, exercícios e dieta. Sinto muito, mas só posso ajudar com esses temas. Como posso te apoiar na sua jornada de saúde hoje?";
            }

            // FALLBACK
            else {
                responseText = this.getRandomResponse('fallback');
            }
        }

        // 4. Save and return AI response
        return await healthService.saveMessage(responseText, 'ai', actionType, metadata);
    }

    private isHealthRelated(text: string): boolean {
        const keywords = ['peso', 'altura', 'imc', 'dieta', 'treino', 'exercício', 'água', 'comer', 'saúde', 'dor', 'exame', 'médico', 'caloria', 'fome', 'sono', 'descanso', 'bem estar', 'hidratação'];
        const lower = text.toLowerCase();
        return keywords.some(k => lower.includes(k)) || nlp(text).match('(saúde|corpo|vida|bem|mal|doente|médico|remédio)').found;
    }

    private async handleProfileUpdate(text: string): Promise<string> {
        let profile = await healthService.getProfile();
        if (!profile) {
            profile = {
                id: 'current_user',
                updated_at: new Date().toISOString()
            } as HealthProfile;
        }

        let updates: string[] = [];
        const weightMatch = text.match(/(\d+([.,]\d+)?)\s*(kg|kilos|quilos)/);
        const heightMatch = text.match(/(\d+([.,]\d+)?)\s*(cm|centimetros|metros|m)/);

        if (weightMatch) {
            const weight = parseFloat(weightMatch[1].replace(',', '.'));
            profile.peso = weight;
            updates.push(`peso para ${weight}kg`);
            await healthService.addMetric({ id: Date.now().toString(), type: 'weight', value: weight, unit: 'kg', date: new Date().toISOString().split('T')[0] });
        }

        if (heightMatch) {
            let height = parseFloat(heightMatch[1].replace(',', '.'));
            if (height < 3) height = height * 100;
            profile.altura = Math.round(height);
            updates.push(`altura para ${profile.altura}cm`);
        }

        if (updates.length > 0) {
            await healthService.saveProfile(profile);
            return `Entendido. Atualizei seu ${updates.join(' e ')}.`;
        }
        return "Consegui identificar medidas, mas não entendi se era peso ou altura. Tente: '70kg' ou '175cm'.";
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

