import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendationsWithGemini, generateAyurvedicRecommendations } from '@/lib/geminiRecommendations';

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    // Attempt to generate recommendations using Gemini AI
    try {
      const recommendations = await generateRecommendationsWithGemini(profileData);

      return NextResponse.json({
        success: true,
        recommendations: recommendations,
        timestamp: new Date().toISOString(),
        source: 'gemini-ai',
      });
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError);
      console.log('Falling back to local recommendations...');

      // Fallback to local recommendations if Gemini fails
      const recommendations = generateAyurvedicRecommendations(profileData);

      return NextResponse.json({
        success: true,
        recommendations: recommendations,
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
