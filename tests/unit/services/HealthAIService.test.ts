jest.mock('../../../src/services/HealthService', () => {
  const mockHealthService = {
    saveMessage: jest.fn(),
    getChatHistory: jest.fn(),
    getProfile: jest.fn(),
    saveProfile: jest.fn(),
    saveExerciseReport: jest.fn(),
    calculateCalories: jest.fn((exerciseText: string, durationMin: number, userWeight?: number) => {
      return Math.round(((5 * (userWeight || 75) * 3.5) / 200) * durationMin);
    }),
    generateWorkoutSuggestion: jest.fn(() => 'Treino de força leve'),
    calculateBMR: jest.fn(() => 1600),
    calculateTDEE: jest.fn(() => 2200),
    calculateBMI: jest.fn(() => 24.2),
    getBMICategory: jest.fn(() => 'Peso normal'),
    calculateWaterGoal: jest.fn((weight: number) => Math.round(weight * 35)),
    getActivityLevelLabel: jest.fn(() => 'Moderado'),
    clearChat: jest.fn(),
    sanitizeHistory: jest.fn(),
  };

  return {
    healthService: mockHealthService,
  };
});

jest.mock('compromise', () => {
  return {
    __esModule: true,
    default: (text: string) => ({
      match: (pattern: string) => ({
        found: false,
      }),
    }),
  };
});

import { healthService } from '../../../src/services/HealthService';
import { healthAIService } from '../../../src/services/HealthAIService';

describe('HealthAIService', () => {
  const mockHealthService = healthService as jest.Mocked<typeof healthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHealthService.getChatHistory.mockResolvedValue([] as any);
    mockHealthService.getProfile.mockResolvedValue(null as any);
    mockHealthService.saveMessage.mockImplementation(async (text: any, sender: any, type: any, metadata: any) => ({
      id: `${sender}-${String(text).slice(0, 8)}`,
      text,
      sender,
      type,
      timestamp: new Date().toISOString(),
      metadata,
    } as any));
  });

  it('responds with guided health advice for an open training question', async () => {
    const response = await healthAIService.processMessage('Qual treino é melhor para emagrecer?');

    expect(response.text).toContain('Posso sugerir um treino');
    expect(response.metadata?.actionType).toBeUndefined();
    expect(mockHealthService.saveMessage).toHaveBeenCalledWith(
      'Qual treino é melhor para emagrecer?',
      'user',
      'text'
    );
  });

  it('keeps exercise reporting behavior for explicit workout logs', async () => {
    mockHealthService.getProfile.mockResolvedValue({
      id: 'current_user',
      peso: 80,
      altura: 180,
      updated_at: new Date().toISOString(),
    } as any);

    const response = await healthAIService.processMessage('Fiz 40 min de caminhada hoje');

    expect(response.text).toContain('calorias');
    expect(mockHealthService.saveExerciseReport).toHaveBeenCalled();
  });

  it('recognizes accentuated health metric queries', async () => {
    mockHealthService.getProfile.mockResolvedValue({
      id: 'current_user',
      peso: 70,
      altura: 175,
      sexo: 'male',
      updated_at: new Date().toISOString(),
    } as any);

    const response = await healthAIService.processMessage('Métricas de saúde');

    expect(response.text).toContain('IMC');
    expect(response.text).toContain('TMB');
  });
});
