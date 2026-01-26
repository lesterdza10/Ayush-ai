import { NextRequest, NextResponse } from 'next/server';
import { generateAyurvedicRecommendations } from '@/lib/ayurvedicRecommendations';

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    // Generate recommendations using local Ayurvedic engine (no API needed!)
    const recommendations = generateAyurvedicRecommendations(profileData);

    return NextResponse.json({
      success: true,
      recommendations: recommendations,
      timestamp: new Date().toISOString(),
    });
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
