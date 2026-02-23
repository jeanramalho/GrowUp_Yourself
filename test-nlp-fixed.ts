import { healthAIService } from './src/services/HealthAIService';

// Little hack to expose private methods for testing
const service = healthAIService as any;

const tests = [
  "peso 85",
  "meu peso é 70.5",
  "to pesando 90",
  "80kg",
  "peso 100",
  "minha altura é 1.70",
  "tenho 1 metro e 80",
  "altura 185",
  "175cm",
  "1.85m",
  "treino todo dia",
  "trabalho sentado e não faço exercícios",
  "frequento academia 3x",
  "corri por 45 minutos na esteira",
  "malhei por 1 hora",
  "treinei"
];

for (const t of tests) {
  console.log(`\n\n--- Texto: "${t}" ---`);
  console.log("Peso:", service.extractWeight(t));
  console.log("Altura:", service.extractHeight(t));
  console.log("Atividade:", service.detectActivityLevel(t));
  console.log("Tem contexto extra de perfil?:", service.containsProfileData(t));
  console.log("Duração Exercício:", service.extractDuration(t));
  console.log("Contexto de exercício?:", service.isExerciseContext(t));
}
