import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || userId === 'undefined') {
      return NextResponse.json({ error: 'Valid userId required' }, { status: 400 });
    }

    // .lean() makes the document a plain JavaScript object
    const user = await User.findById(userId).lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // WE PULL DATA DIRECTLY FROM THE DATABASE
    // This merges user.email + user.name + everything inside user.profile
    const completeProfile = {
      name: user.name || 'User',
      email: user.email || '',
      ...(user.profile || {}) 
    };

    return NextResponse.json(completeProfile, { status: 200 });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // This saves the form data into the database 'profile' object
    await User.findByIdAndUpdate(
      userId,
      { $set: { profile: { ...profileData, updatedAt: new Date() } } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}