import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendationsWithGemini, generateAyurvedicRecommendations } from '@/lib/geminiRecommendations';
import { authOptions } from '@/lib/auth/options';
import { getRecommendationsByUserId, saveRecommendations } from '@/lib/models/services';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profileData = await request.json();

    // Attempt to generate recommendations using Gemini AI
    try {
      const recommendations = await generateRecommendationsWithGemini(profileData);

      await saveRecommendations(session.user.id, recommendations, 'gemini-ai');

      return NextResponse.json({
        success: true,
        data: {
          content: recommendations,
          source: 'gemini-ai',
        },
        timestamp: new Date().toISOString(),
        source: 'gemini-ai',
      });
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      console.log('Falling back to local recommendations...');

      // Fallback to local recommendations if Gemini fails
      const recommendations = generateAyurvedicRecommendations(profileData);

      await saveRecommendations(session.user.id, recommendations, 'fallback-local');

      return NextResponse.json({
        success: true,
        data: {
          content: recommendations,
          source: 'fallback-local',
        },
        timestamp: new Date().toISOString(),
        source: 'fallback-local',
      });
    }
  } catch (error) {
    console.error('Recommendation Generation Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate recommendations',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const latest = await getRecommendationsByUserId(session.user.id);

    if (!latest) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({
      data: {
        content: latest.content,
        source: latest.source,
        createdAt: latest.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Recommendation Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
