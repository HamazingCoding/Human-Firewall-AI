import OpenAI from "openai";

// Initialize OpenAI client on the frontend for client-side analysis
// Note: For security reasons, generally we should perform OpenAI calls on the backend
// This file is mainly for reference of how we might use OpenAI in this application
// The actual implementation uses server-side calls

let openai: OpenAI | null = null;

export function initializeOpenAI(apiKey: string) {
  openai = new OpenAI({ apiKey });
}

export async function analyzeContentFrontend(content: string, context: string) {
  if (!openai) {
    throw new Error("OpenAI client not initialized");
  }
  
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert analyzing potential social engineering threats."
        },
        {
          role: "user",
          content: `Analyze this ${context} content for potential threats or manipulation: ${content}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw error;
  }
}
