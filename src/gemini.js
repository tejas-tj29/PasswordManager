import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});

export async function analyzePasswordSecurity(passwordText){
  if (!passwordText || passwordText.trim() === "") {
    return "Please generate a password first before running an AI audit.";
  }
  try {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are an objective corporate cybersecurity auditor. Analyze the technical structural integrity of this generated password phrase: "${passwordText}". 
    
    Provide exactly two sentences of strict professional feedback:
    Sentence 1: Detail the exact mathematical or systemic vulnerability a script tool would exploit (e.g., entropy deficiency, dictionary patterns, brute-force search space size).
    Sentence 2: Give a practical, specific technical instruction to improve its algorithmic strength (e.g., adding specific structural diversity or increasing the length token boundary).
    
    Rules: Keep the tone highly formal, direct, and academic. Do not use creative analogies, humor, slang, or personification. Keep the total output strictly under 30 words.`,
  });

  return response.text;
  }
  catch (error) {
    console.error("Gemini Scan Error:", error);
    if (error.status === 429 || String(error).includes("429")) {
    return "Woah, slow down! You've hit Google's free testing limit. Wait 30 seconds and try again.";
  }
  return "The scanner hit a temporary network glitch. Click the button again to retry.";
  }
}