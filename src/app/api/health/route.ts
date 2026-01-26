import { NextRequest, NextResponse } from 'next/server';

// Mock health metrics calculation - MongoDB integration can be added later
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      doshaVata,
      doshaPitta,
      doshaKapha,
      digestScore,
      sleepScore,
      stressScore,
      fitnessScore,
      gastricRisk,
      obesityRisk,
      diabetesRisk,
    } = body;

    // Validate required fields
    if (
      !userId ||
      doshaVata === undefined ||
      doshaPitta === undefined ||
      doshaKapha === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock response - in production, save to MongoDB
    const mockMetrics = {
      userId,
      doshaVata,
      doshaPitta,
      doshaKapha,
      digestScore,
      sleepScore,
      stressScore,
      fitnessScore,
      gastricRisk,
      obesityRisk,
      diabetesRisk,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Health metrics saved successfully',
        data: mockMetrics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving health metrics:', error);
    return NextResponse.json(
      { error: 'Failed to save health metrics' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Mock response - in production, fetch from MongoDB
    const mockMetrics = {
      userId,
      doshaVata: 35,
      doshaPitta: 40,
      doshaKapha: 25,
      digestScore: 75,
      sleepScore: 65,
      stressScore: 70,
      fitnessScore: 80,
      gastricRisk: 'low',
      obesityRisk: 'medium',
      diabetesRisk: 'low',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockMetrics, { status: 200 });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health metrics' },
      { status: 500 }
    );
  }
}
