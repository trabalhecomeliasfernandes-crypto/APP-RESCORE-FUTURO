import { GoogleGenAI } from "@google/genai";
import { Salesperson, CalculatedMetrics } from '../types';

// Pega a chave de API do ambiente da Netlify.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Verifica se a chave foi encontrada.
if (!apiKey) {
  throw new Error("Chave de API não configurada na Netlify! Verifique as variáveis de ambiente.");
}

const ai = new GoogleGenAI(apiKey);

export const getPerformanceSummary = async (salesperson: Salesperson, metrics: CalculatedMetrics): Promise<string> => {
  const model = 'gemini-1.5-flash';
  
  const prompt = `
    Analyze the following sales data for a salesperson named ${salesperson.name} and provide a concise performance summary in Portuguese.
    The summary should be easy to read, using markdown for formatting (bolding, lists).
    Highlight their strengths, potential weaknesses, and suggest one key area for improvement.

    Key Metrics:
    - Total New Leads: ${metrics.totalLeads}
    - Sales Qualified Leads (SQL): ${metrics.totalSql}
    - Total Contracts Closed: ${metrics.totalContratosFechados}
    - Total Contract Value: R$ ${metrics.valorTotalContratos.toFixed(2)}
    - Total Paid Value: R$ ${metrics.totalPago.toFixed(2)}
    - Conversion Rate (SQL to Closed): ${(metrics.taxaConversao * 100).toFixed(2)}%
    - CPA (Cost per Acquisition - Leads / Signed Contracts): R$ ${metrics.cpa.toFixed(2)}
  `;

  try {
    const result = await ai.getGenerativeModel({ model }).generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao gerar o resumo da IA. Verifique o console para detalhes.";
  }
};
