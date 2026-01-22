import { GoogleGenAI } from "@google/genai";
import { ProjectState } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not defined in the environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProjectInsights = async (projectData: ProjectState): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "API Key missing. Cannot generate insights.";

  const prompt = `
    Analyze the following construction project data and provide a concise executive summary and risk assessment.
    
    Project Name: ${projectData.name}
    Contract Value: ${projectData.contractValue}
    
    BOQ Summary (Top 3 items):
    ${projectData.boq.slice(0, 3).map(i => `- ${i.description}: ${i.executedQty}/${i.plannedQty} ${i.unit}`).join('\n')}
    
    Financials:
    - Bills: ${projectData.bills.length} records
    - Liabilities: ${projectData.liabilities.length} records showing pending payments and retentions.
    
    Please provide:
    1. Overall Health Score (0-100%)
    2. Key Financial Risks (focus on retention and unbilled liabilities)
    3. Progress Bottlenecks based on BOQ execution vs Plan.
    4. A strategic recommendation for the Project Manager.

    Keep it professional, concise, and formatted in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Failed to generate insights. Please check API configuration.";
  }
};
