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

            // Potential activity level update if they report consistent exercise
            const profile = await healthService.getProfile();
            if (profile && (!profile.activityLevel || profile.activityLevel === 'sedentary')) {
                // Proactively suggest updating activity level
                metadata = { actionType: 'suggest_activity_update' };
                responseText = `Excelente! Você queimou aproximadamente **${calories} calorias**. No seu próximo treino, sugiro focar em: **${suggestion}**.\n\nNotei que você está se exercitando! Quer que eu atualize seu nível de atividade física para calcular suas metas com mais precisão?`;
            } else {
                responseText = `Excelente! Você queimou aproximadamente **${calories} calorias**. No seu próximo treino, sugiro focar em: **${suggestion}**.`;
            }
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

            // EXERCISE REPORT (One-shot or multi-step)
            else if (doc.match('(relatório|exercício|treino|fiz|malhei|corri|pedalei|treinei)').found) {
                const durationMatch = lowerText.match(/(\d+)\s*(min|m|hora|h)/);
                const hasExercises = doc.match('(corrida|caminhada|musculação|academia|treino|futebol|natação|pedal|bicicleta)').found || lowerText.length > 20;

                if (durationMatch && hasExercises) {
                    const duration = parseInt(durationMatch[1]) * (lowerText.includes('hora') || lowerText.includes(' h') ? 60 : 1);
                    const calories = await this.calculateCalories(userText, duration);
                    const suggestion = healthService.generateWorkoutSuggestion();

                    await healthService.saveExerciseReport({
                        exercises: userText,
                        duration: duration,
                        calories: calories,
                        date: new Date().toISOString().split('T')[0]
                    });

                    responseText = `Registro feito! Você queimou cerca de **${calories} calorias**. No seu próximo treino, sugiro: **${suggestion}**.`;

                    // Also check for activity update
                    const profile = await healthService.getProfile();
                    if (profile && (!profile.activityLevel || profile.activityLevel === 'sedentary')) {
                        responseText += `\n\nNotei que você está se exercitando! Quer que eu considere isso para ajustar seu nível de atividade física?`;
                        metadata = { actionType: 'suggest_activity_update' };
                    }
                } else {
                    responseText = "Que bom que você treinou! Quais exercícios você fez e por quanto tempo aproximadamente?";
                    actionType = 'text';
                    metadata = { actionType: 'exercise_report' };
                }
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

            // UPDATE PROFILE (Weight/Height/Activity)
            else if (this.containsProfileData(lowerText)) {
                responseText = await this.handleProfileUpdate(lowerText);
            }

            // ACTIVITY LEVEL INQUIRY
            else if (doc.match('(nível|nivel|atividade|frequencia|frequência|exercito|treino)').found && doc.match('(física|dia|semana|sedentario|ativo)').found) {
                const level = this.detectActivityLevel(lowerText);
                if (level) {
                    responseText = await this.handleProfileUpdate(lowerText);
                } else {
                    responseText = "Para eu entender melhor seu nível de atividade, me diga: com que frequência você se exercita por semana? (Ex: 3 vezes por semana, todo dia, ou se é sedentário).";
                }
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

    private containsProfileData(text: string): boolean {
        const hasWeight = text.match(/(\d+([.,]\d+)?)\s*(kg|kilos|quilos)/);
        const hasHeight = text.match(/(\d+([.,]\d+)?)\s*(cm|centimetros|metros|m)/);
        const hasActivity = this.detectActivityLevel(text) !== null;
        return !!(hasWeight || hasHeight || hasActivity);
    }

    private detectActivityLevel(text: string): HealthProfile['activityLevel'] | null {
        const lower = text.toLowerCase();

        // Very Active
        if (lower.match(/(todo dia|todos os dias|6 vezes|7 vezes|pesado|atleta|extremamente)/)) return 'very_active';

        // Active
        if (lower.match(/(4 vezes|5 vezes|frequente|ativo|intensamente)/)) return 'active';

        // Moderate
        if (lower.match(/(3 vezes|moderado|regularmente|academia)/)) return 'moderate';

        // Light
        if (lower.match(/(1 vez|2 vezes|caminhada|leve|pouco)/)) return 'light';

        // Sedentary
        if (lower.match(/(sedentário|não faço|nunca|escritório|sentado|parado)/)) return 'sedentary';

        return null;
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
        const extractedActivity = this.detectActivityLevel(text);

        if (weightMatch) {
            const weight = parseFloat(weightMatch[1].replace(',', '.'));
            profile.peso = weight;
            profile.weight = weight;
            updates.push(`peso (${weight}kg)`);
            await healthService.addMetric({ id: Date.now().toString(), type: 'weight', value: weight, unit: 'kg', date: new Date().toISOString().split('T')[0] });
        }

        if (heightMatch) {
            let height = parseFloat(heightMatch[1].replace(',', '.'));
            if (height < 3) height = height * 100;
            profile.altura = Math.round(height);
            profile.height = Math.round(height);
            updates.push(`altura (${profile.altura}cm)`);
        }

        if (extractedActivity) {
            profile.activityLevel = extractedActivity;
            updates.push(`nível de atividade (${healthService.getActivityLevelLabel(extractedActivity)})`);
        }

        if (updates.length > 0) {
            await healthService.saveProfile(profile);
            return `Entendido! Atualizei seu ${updates.join(', ')}. Isso me ajuda a ser mais preciso nas suas metas.`;
        }
        return "Consegui identificar que você enviou dados, mas não entendi exatamente o que atualizar. Tente: 'Meu peso é 70kg' ou 'Treino 3 vezes por semana'.";
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

