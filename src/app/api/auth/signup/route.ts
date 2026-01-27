import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the Schema (Use the same one as your login)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create/Access the Model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const { name, email, password } = await req.json();

    // 1. Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Hash the password (DO NOT store plain text!)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user in MongoDB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: newUser._id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("SIGNUP_ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}