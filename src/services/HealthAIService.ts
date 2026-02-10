import { HealthService, healthService } from './HealthService';
import { ChatMessage } from '../models/health';

/**
 * HealthAIService
 * A Rule-Based AI Engine for offline health assistance.
 * It parses user input for keywords/patterns and executes logic.
 */
export class HealthAIService {

    async processMessage(userText: string): Promise<ChatMessage> {
        // 1. Save user message
        await healthService.saveMessage(userText, 'user', 'text');

        // 2. Analyze intent
        const lowerText = userText.toLowerCase().trim();
        let responseText = '';
        let actionType: 'text' | 'action' = 'text';
        let metadata: any = {};

        // --- Intent: Greeting ---
        if (lowerText.match(/^(oi|olá|hello|hi|bom dia|boa tarde|boa noite)/)) {
            responseText = 'Olá! Sou seu assistente de saúde. Posso ajudar a calcular seu IMC, TMB, registrar seu peso ou dar dicas de água.';
        }

        // --- Intent: Calculate BMI (IMC) ---
        else if (lowerText.includes('imc') || (lowerText.includes('indice') && lowerText.includes('massa'))) {
            const profile = await healthService.getProfile();
            if (profile && profile.weight && profile.height) {
                const bmi = healthService.calculateBMI(profile.weight, profile.height);
                const category = healthService.getBMICategory(bmi);
                responseText = `Seu IMC é **${bmi}** (${category}).`;
            } else {
                responseText = 'Para calcular o IMC, preciso do seu peso e altura. Por favor, atualize seus dados digitando: "tenho 70kg e 175cm".';
            }
        }

        // --- Intent: Update Weight/Height (Regex) ---
        // Matches: "tenho 70kg", "peso 70 kg", "minha altura é 170cm", "1.75m"
        else if (lowerText.match(/(\d+([\.,]\d+)?)\s*(kg|kilos|cm|centimetros|metros|m)/)) {
            const weightMatch = lowerText.match(/(\d+([\.,]\d+)?)\s*(kg|kilos)/);
            const heightMatch = lowerText.match(/(\d+([\.,]\d+)?)\s*(cm|centimetros|metros|m)/);

            let profile = await healthService.getProfile();
            // Create default profile if not exists
            if (!profile) {
                profile = {
                    id: 'default',
                    weight: 0,
                    height: 0,
                    gender: 'other', // Ask later
                    activityLevel: 'moderate',
                    waterGoal: 2000,
                    updated_at: new Date().toISOString()
                };
            }

            let updates: string[] = [];

            if (weightMatch) {
                const weight = parseFloat(weightMatch[1].replace(',', '.'));
                profile.weight = weight;
                updates.push(`peso para ${weight}kg`);

                // Log metric
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
                // Convert meters to cm if needed
                if (heightMatch[3].startsWith('m')) {
                    height = height * 100;
                }
                profile.height = height;
                updates.push(`altura para ${height}cm`);
            }

            await healthService.saveProfile(profile);
            responseText = `Atualizei seu ${updates.join(' e ')}.`;

            // Trigger recalculations if we have both
            if (profile.weight > 0 && profile.height > 0) {
                const bmi = healthService.calculateBMI(profile.weight, profile.height);
                responseText += ` Seu novo IMC é ${bmi}.`;
            }
        }

        // --- Intent: Water ---
        else if (lowerText.includes('água') || lowerText.includes('agua') || lowerText.includes('bebi')) {
            if (lowerText.includes('meta')) {
                const profile = await healthService.getProfile();
                if (profile && profile.weight) {
                    const goal = healthService.calculateWaterGoal(profile.weight);
                    responseText = `Sua meta diária de água deve ser aproximadamente **${goal}ml** (baseado no seu peso).`;
                } else {
                    responseText = 'Para calcular sua meta de água, preciso saber seu peso. Digite seu peso (ex: "tenho 70kg").';
                }
            } else {
                responseText = 'Lembre-se de beber água regularmente! A hidratação é fundamental para o funcionamento do corpo. Posso calcular sua meta se você perguntar "qual minha meta de água?".';
            }
        }

        // --- Fallback ---
        else {
            responseText = 'Desculpe, ainda estou aprendendo. Posso ajudar com IMC, registrar seu peso/altura ou metas de água. Tente dizer "calcular IMC" ou "registrar peso 70kg".';
        }

        // 3. Save and return AI response
        return await healthService.saveMessage(responseText, 'ai', actionType, metadata);
    }
}

export const healthAIService = new HealthAIService();
