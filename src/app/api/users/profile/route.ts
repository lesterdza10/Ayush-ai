import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'Valid ID required' }, { status: 400 });

    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Combine top-level fields (name, email) with the nested profile fields
    return NextResponse.json({
      name: user.name,
      email: user.email,
      ...(user.profile || {}) 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

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