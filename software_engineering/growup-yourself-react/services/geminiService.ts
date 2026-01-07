
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getHealthAdvice = async (userInput: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: "Você é um assistente de saúde humano e empático do app GrowUp Yourself. Sua meta é dar conselhos rápidos, baseados em ciência, sobre treinos, sono e nutrição. Seja encorajador. Assine como Assistente GrowUp.",
      },
    });

    return response.text || "Desculpe, tive um problema ao processar seu pedido. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro de conexão com a inteligência de saúde.";
  }
};
