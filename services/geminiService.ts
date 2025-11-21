import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateForestStory = async (transactions: Transaction[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Connect your spirit to the network to hear the forest speak.";

  const totalTrees = transactions.length;
  const totalCarbon = transactions.reduce((acc, curr) => acc + curr.carbonOffsetKg, 0);
  const species = Array.from(new Set(transactions.map(t => t.treeSpecies))).join(", ");

  const prompt = `
    You are the spirit of the Heru Falcon.
    The user has planted ${totalTrees} trees, sequestering ${totalCarbon}kg of CO2.
    The species include: ${species}.
    
    Write a very short, poetic, Afrofuturist 2-sentence message about how their financial transfers are physically healing the African continent. 
    Use words like "roots", "gold", "legacy", "ancestors", "future".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "The roots grow deep where your wealth flows.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your legacy grows with every transaction.";
  }
};

export const analyzeTransactionImpact = async (tx: Transaction): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Impact data syncing...";

    const prompt = `
      Describe the ecological impact of planting a ${tx.treeSpecies} tree in Africa. 
      Keep it under 20 words. Inspiring and scientific.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "Restoring biodiversity and soil health.";
    } catch (e) {
        return "Capturing carbon, restoring life.";
    }
}