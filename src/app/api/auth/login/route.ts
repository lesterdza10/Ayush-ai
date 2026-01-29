import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: Object, default: {} }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // SUCCESS: We must return the userId string
    return NextResponse.json({ 
      message: 'Login successful',
      userId: user._id.toString(), 
      user: { email: user.email, name: user.name } 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}