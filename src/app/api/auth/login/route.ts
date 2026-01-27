import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define the User Schema (so Mongoose knows what to look for)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// 2. Create the Model (using 'models' check to prevent re-compilation errors)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(req: Request) {
  try {
    // A. Connect to MongoDB
    await connectToDatabase();

    // B. Get the data from the frontend
    const { email, password } = await req.json();

    // C. Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // D. Find the user in MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 401 }
      );
    }

    // E. Compare the entered password with the hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // F. Success Response
    // (Note: In a production app, you would generate a JWT or Session here)
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: { email: user.email, name: user.name } 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('LOGIN_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}