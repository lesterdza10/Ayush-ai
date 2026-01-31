import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize with your key from .env.local
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function POST(req: Request) {
  try {
    const { message, context, history } = await req.json();

    // The logic you requested
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      // We combine the history, your Sage instructions, and the user message
      contents: [
        {
          role: "user",
          parts: [{ 
            text: ` 
      You are AYUSH AI Sage. Your expertise is Ayurveda and Yoga.
      Current Context: ${context}
      
      RULES:
      1. Always relate your answer back to the current Yoga pose.
      2. If asked about general health, explain how this pose helps with it.
      3. If asked about other exercises, briefly answer but suggest checking out the other modules for detailed guidance.
      4. Keep the tone wise, warm, and helpful.
                   Conversation history: ${JSON.stringify(history)}. 
                   User Question: ${message}` 
          }],
        },
      ],
    });

    return NextResponse.json({ text: response.text });

  } catch (error: any) {
    console.error("SAGE API ERROR:", error.message);
    return NextResponse.json({ 
      error: "The Sage is currently unavailable. Please check API settings." 
    }, { status: 500 });
  }
}