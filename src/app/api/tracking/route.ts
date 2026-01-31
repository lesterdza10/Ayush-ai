import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Activity } from '@/lib/models/Activity'; 
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { action, userId, waterDrank, date, tasks } = await req.json();

    if (action === 'complete') {
      await Activity.findOneAndUpdate(
        { userId, date },
        { $set: { consistencyScore: 100, waterIntake: waterDrank, tasks, lastSynced: new Date() } },
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    // ACTION: GENERATE (High-Detail Ayurvedic Prompt)
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        You are a Master Ayurvedic Sage. 
        User Data: Water Intake today is ${waterDrank}L.
        Goal: Create a deep "Dinacharya" (Ayurvedic daily routine) for tomorrow.
        Requirements:
        1. Recommend 5-6 diverse tasks (e.g., specific Yoga asana, Pranayama, herbal tea, focused coding time, or oil pulling).
        2. Personalize advice based on water intake (if low, suggest hydrating foods; if high, suggest cooling herbs).
        3. Return ONLY valid JSON: 
        {
          "advice": "one deep ayurvedic insight", 
          "schedule": [
            {"time": "06:00", "task": "Task Name", "duration": "20m", "reason": "Why this helps"},
            ...
          ]
        }
      `;
      
      const result = await model.generateContent(prompt);
      const resText = result.response.text().replace(/```json|```/g, "").trim();
      return NextResponse.json({ success: true, ...JSON.parse(resText) });
    } catch (apiError) {
      return NextResponse.json({ 
        success: true, 
        advice: "The heavens are cloudy. Stick to the foundational path of water and breath.", 
        schedule: [
          {time: "06:30", task: "Surya Namaskar", duration: "15m", reason: "Awaken solar energy"},
          {time: "08:00", task: "Copper-Vessel Water", duration: "5m", reason: "Alkalize the body"},
          {time: "13:00", task: "Post-Lunch Walk", duration: "10m", reason: "Aid Agni (digestion)"},
          {time: "17:00", task: "Nadi Shodhana", duration: "10m", reason: "Balance nervous system"},
          {time: "21:30", task: "Digital Detox", duration: "30m", reason: "Prepare for Ojas recovery"}
        ] 
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}