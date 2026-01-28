import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // This will store all the form data
  profile: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    location: String,
    bodyType: String,
    appetite: String,
    digestion: String,
    sleepQuality: Number,
    stressLevel: Number,
    wakeUpTime: String,
    sleepTime: String,
    exercise: String,
    foodType: String,
    junkFoodFreq: String,
    waterIntake: Number,
    doshaAnswers: Array,
    updatedAt: { type: Date, default: Date.now }
  }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);