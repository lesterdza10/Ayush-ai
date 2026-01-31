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
            text: `System: You are AYUSH AI Sage. Context: ${context}. 
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