// AI service interface and fallback stub
export type AiService = {
  calculateIMC: (weightKg: number, heightM: number) => number;
  calculateTMB: (weightKg: number, heightM: number, age: number, sex: 'M'|'F') => number;
  analyzeExame: (text: string) => string;
  suggestGoals: (profile: any) => any[];
};

export const AiFallback: AiService = {
  calculateIMC: (w, h) => {
    return Number((w / (h * h)).toFixed(2));
  },
  calculateTMB: (w, h, age, sex) => {
    // Mifflin-St Jeor approximation (simplified)
    const s = sex === 'M' ? 5 : -161;
    return Math.round(10 * w + 6.25 * (h*100) - 5 * age + s);
  },
  analyzeExame: (text) => `Resumo: ${text.substring(0, 120)}`,
  suggestGoals: (profile) => []
};

export default AiFallback;
