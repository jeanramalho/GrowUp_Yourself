import { HealthService, healthService } from './HealthService';
import { ChatMessage } from '../models/health';
import { UserProfile } from '../models';
import nlp from 'compromise';

/**
 * HealthAIService
 * An Offline NLP AI Engine for health assistance using 'compromise'.
 */
export class HealthAIService {

    /**
     * Proactive check: If profile is missing data, ask for it.
     */
    async checkIn(): Promise<ChatMessage | null> {
        const profile = await healthService.getProfile();

        // If no profile or missing key stats, initiate conversation
        if (!profile || !profile.peso || !profile.altura) {
            // Check if we recently asked
            const history = await healthService.getChatHistory();
            const lastMsg = history[history.length - 1];
            // Avoid looping if AI just asked a question
            if (lastMsg && lastMsg.sender === 'ai' && lastMsg.text.includes('?')) {
                return null;
            }

            const text = "Olá! Notei que ainda não tenho seus dados de peso e altura. Para que eu possa calcular seu IMC e metas de água, por favor me informe. Exemplo: 'tenho 70kg e 175cm'.";
            return await healthService.saveMessage(text, 'ai', 'text');
        }
        return null;
    }

    async processMessage(userText: string): Promise<ChatMessage> {
        // 1. Save user message
        await healthService.saveMessage(userText, 'user', 'text');

        // 2. Artificial Delay (Thinking...) - 1.5s
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 3. Analyze intent with NLP
        const doc = nlp(userText);
        const lowerText = userText.toLowerCase();

        let responseText = '';
        let actionType: 'text' | 'action' = 'text';
        let metadata: any = {};

        // Extract entities
        const values = doc.values().toNumber().out('array');
        // Simple extraction for units since compromise might not separate them perfectly in all languages without plugin
        // We will fallback to regex for specific value extraction if needed, but use NLP for intent

        // --- Intent Detection ---

        // GREETING
        if (doc.match('(oi|olá|hello|hi|bom dia|boa tarde|boa noite)').found) {
            responseText = this.getRandomResponse('greeting');
        }

        // CALCULATE IMC
        else if (doc.match('(imc|indice|massa|peso ideal)').found) {
            const profile = await healthService.getProfile();
            if (profile && profile.peso && profile.altura) {
                const bmi = healthService.calculateBMI(profile.peso, profile.altura);
                const category = healthService.getBMICategory(bmi);
                responseText = `Seu IMC atual é **${bmi}** (${category}).`;
            } else {
                responseText = 'Para calcular o IMC, preciso atualizar seu cadastro. Por favor, me diga seu peso e altura (ex: "tenho 70kg e 1.75m").';
            }
        }

        // WATER GOAL
        else if (doc.match('(agua|água|beber|hidratação)').found) {
            if (doc.match('(meta|quanto|devo)').found) {
                const profile = await healthService.getProfile();
                if (profile && profile.peso) {
                    const goal = healthService.calculateWaterGoal(profile.peso);
                    responseText = `Baseado no seu peso de ${profile.peso}kg, sua meta diária de água é de aproximadamente **${goal}ml**.`;
                } else {
                    responseText = 'Para calcular sua meta de água personalizada, preciso saber seu peso. Qual seu peso atual?';
                }
            } else {
                responseText = 'Manter-se hidratado é crucial para energia e foco! Tente beber um copo d\'água agora.';
            }
        }

        // UPDATE PROFILE (Weight/Height)
        // Compromise is great at finding numbers. We look for context words near numbers.
        else if (doc.match('#Value').found && doc.match('(kg|kilos|quilos|cm|centimetros|metros|m|peso|altura)').found) {
            // Fallback to strict regex for precise extraction in Portuguese
            // (Compromise is English-centric for units, but good for general parsing)

            let profile = await healthService.getProfile();
            if (!profile) {
                profile = {
                    id: 'current_user',
                    nome: 'Usuário',
                    updated_at: new Date().toISOString()
                } as UserProfile;
            }

            let updates: string[] = [];

            // Regex for safety in data entry
            const weightMatch = lowerText.match(/(\d+([.,]\d+)?)\s*(kg|kilos|quilos)/);
            const heightMatch = lowerText.match(/(\d+([.,]\d+)?)\s*(cm|centimetros|metros|m)/);

            if (weightMatch) {
                const weight = parseFloat(weightMatch[1].replace(',', '.'));
                profile.peso = weight;
                updates.push(`peso para ${weight}kg`);

                await healthService.addMetric({
                    id: Date.now().toString(),
                    type: 'weight',
                    value: weight,
                    unit: 'kg',
                    date: new Date().toISOString().split('T')[0]
                });
            }

            if (heightMatch) {
                let height = parseFloat(heightMatch[1].replace(',', '.'));
                let unit = heightMatch[3];
                if (unit.startsWith('m') && height < 3) {
                    height = height * 100;
                }
                profile.altura = Math.round(height);
                updates.push(`altura para ${profile.altura}cm`);
            }

            if (updates.length > 0) {
                await healthService.saveProfile(profile);
                responseText = `Entendido. Atualizei seu ${updates.join(' e ')}.`;

                // Instant value-add
                if (profile.peso && profile.altura) {
                    const bmi = healthService.calculateBMI(profile.peso, profile.altura);
                    responseText += ` Seu novo IMC é **${bmi}**.`;
                }
            } else {
                responseText = "Entendi que você mencionou medidas, mas não consegui identificar se é peso ou altura. Tente dizer 'peso 70kg' ou 'altura 175cm'.";
            }
        }

        // HELP
        else if (doc.match('(ajuda|help|fazer|funciona)').found) {
            responseText = 'Sou uma IA treinada para ajudar na sua saúde. Posso:\n👉 Calcular seu IMC\n👉 Definir metas de água\n👉 Registrar seu peso e altura\n👉 Dar dicas de treino e dieta (em breve)';
        }

        // DICA DE SAUDE (Health Tip)
        else if (doc.match('(dica|conselho|sugestão)').found) {
            responseText = this.getRandomResponse('tip');
        }

        // FALLBACK
        else {
            responseText = this.getRandomResponse('fallback');
        }

        // 4. Save and return AI response
        return await healthService.saveMessage(responseText, 'ai', actionType, metadata);
    }

    private getRandomResponse(type: 'greeting' | 'tip' | 'fallback'): string {
        const responses = {
            greeting: [
                'Olá! Como posso ajudar na sua jornada de saúde hoje?',
                'Oi! Estou pronto para ajudar você a atingir suas metas.',
                'Olá! Vamos cuidar da sua saúde? Me diga o que precisa.'
            ],
            tip: [
                'Tente dormir de 7 a 8 horas por noite para recuperação muscular e mental.',
                'Incluir proteínas em todas as refeições ajuda na saciedade e manutenção muscular.',
                'Caminhar 30 minutos por dia já traz enormes benefícios cardiovasculares.',
                'Evite telas (celular/TV) 1 hora antes de dormir para melhorar a qualidade do sono.'
            ],
            fallback: [
                'Ainda estou aprendendo sobre isso. Tente me perguntar sobre seu IMC ou meta de água.',
                'Não tenho certeza se entendi. Pode reformular? Posso ajudar com peso, altura e IMC.',
                'Interessante, mas minha especialidade por enquanto é monitorar seus dados vitais (peso, altura, IMC).'
            ]
        };
        const list = responses[type];
        return list[Math.floor(Math.random() * list.length)];
    }
}

export const healthAIService = new HealthAIService();
