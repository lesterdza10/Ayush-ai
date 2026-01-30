import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authOptions } from '@/lib/auth/options';
import { createChatSession, getProfileByUserId } from '@/lib/models/services';
import { ChatMessageDocument } from '@/lib/models';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  profileData?: {
    name: string;
    age: number;
    gender: string;
    vata: number;
    pitta: number;
    kapha: number;
    sleepQuality: number;
    stressLevel: number;
    digestion: string;
  };
}

const SYSTEM_PROMPT = `You are a friendly and knowledgeable Ayurvedic health consultant. You help users understand their Ayurvedic constitution (dosha), provide personalized wellness advice, and answer questions about Ayurvedic practices.

If the user has provided their health profile, use that information to give personalized recommendations. Be conversational, supportive, and practical. Provide specific advice based on their dominant dosha when relevant.`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { messages, profileData } = (await request.json()) as ChatRequest;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build system prompt with profile context if available
    let systemPromptWithContext = SYSTEM_PROMPT;
    if (profileData) {
      systemPromptWithContext += `\n\nUser Profile:
- Name: ${profileData.name}
- Age: ${profileData.age} years
- Gender: ${profileData.gender}
- Dosha Constitution: Vata ${profileData.vata}%, Pitta ${profileData.pitta}%, Kapha ${profileData.kapha}%
- Sleep Quality: ${profileData.sleepQuality}/10
- Stress Level: ${profileData.stressLevel}/10
- Digestion: ${profileData.digestion}`;
    }

    // Convert messages to Gemini format (Gemini uses 'user' and 'model' roles)
    const conversationHistory = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await model.generateContent({
      contents: conversationHistory,
      systemInstruction: systemPromptWithContext,
    });

    const assistantMessage = response.response.text();

    const messagesWithAssistant: ChatMessage[] = [
      ...messages,
      { role: 'assistant', content: assistantMessage },
    ];

    const messagesToPersist: ChatMessageDocument[] = messagesWithAssistant.map((msg) => ({
      role: msg.role,
      content: msg.content,
      createdAt: new Date(),
    }));

    const profileSnapshot = await getProfileByUserId(session.user.id);

    await createChatSession(session.user.id, messagesToPersist, profileSnapshot ?? undefined);

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate chat response',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
