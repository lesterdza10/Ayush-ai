import { NextRequest, NextResponse } from 'next/server';

// Mock user profile endpoints - MongoDB integration can be added later
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      name,
      age,
      gender,
      height,
      weight,
      location,
      bodyType,
      appetite,
      digestion,
      sleepQuality,
      stressLevel,
      wakeUpTime,
      sleepTime,
      exercise,
      foodType,
      junkFoodFreq,
      waterIntake,
      doshaAnswers,
    } = body;

    // Validate required fields
    if (!userId || !name || !age) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock response - in production, save to MongoDB
    const mockProfile = {
      _id: userId,
      userId,
      name,
      age,
      gender,
      height,
      weight,
      location,
      bodyType,
      appetite,
      digestion,
      sleepQuality,
      stressLevel,
      wakeUpTime,
      sleepTime,
      exercise,
      foodType,
      junkFoodFreq,
      waterIntake,
      doshaAnswers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Profile saved successfully',
        data: mockProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
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
    const mockProfile = {
      _id: userId,
      userId,
      name: 'John Doe',
      age: 28,
      gender: 'male',
      height: 175,
      weight: 75,
      location: 'New York',
      bodyType: 'athletic',
      appetite: 'moderate',
      digestion: 'normal',
      sleepQuality: 7,
      stressLevel: 5,
      wakeUpTime: '06:30',
      sleepTime: '22:00',
      exercise: '4x/week',
      foodType: 'mixed',
      junkFoodFreq: 'weekly',
      waterIntake: 8,
      doshaAnswers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
