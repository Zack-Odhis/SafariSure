import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TripCategory } from "../types";

// Initialize Gemini API
// NOTE: In a real production app, calls should be proxied through a backend to hide the API KEY.
// For this frontend demo, we use the env var directly as per instructions.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getTripSafetyAdvice = async (category: TripCategory, destination: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a helpful safety assistant for a Kenyan driver app called SafariSure.
      The user is about to take a ${category}.
      Destination/Route notes: "${destination}".
      
      Provide a short, 2-sentence safety tip specific to driving in Kenya for this distance. 
      Mention common hazards (matatus, potholes, weather) if relevant.
      Keep it friendly and encouraging.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Drive safely and ensure your seatbelt is fastened at all times.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Remember to keep a safe distance from other vehicles and obey speed limits.";
  }
};

export const analyzeClaimImage = async (base64Image: string, description: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: base64Image
            }
          },
          {
            text: `You are an insurance claim adjuster assistant. Analyze this image of a car accident. 
            User description: "${description}".
            1. Confirm if the image appears to show vehicle damage.
            2. Briefly describe the visible damage (e.g., dented bumper, broken glass).
            3. Rate severity on a scale of Low/Medium/High.
            Format the output as a short paragraph.`
          }
        ]
      }
    });

    return response.text || "Image analysis complete. Proceeding with manual review.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Could not analyze image automatically. Please proceed with submission.";
  }
};

export const getChatResponse = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [
                {
                    role: 'user',
                    parts: [{ text: "You are SafariSure Support, a helpful assistant for a Kenyan insurance app. Keep answers short and helpful." }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Jambo! I am SafariSure Support. How can I help you today?" }]
                },
                ...history
            ]
        });
        
        const result = await chat.sendMessage({ message });
        return result.text || "I'm having trouble connecting. Please try again.";
    } catch (e) {
        console.error(e);
        return "Service unavailable momentarily.";
    }
}