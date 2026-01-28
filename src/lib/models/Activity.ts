import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: String, // Format: "YYYY-MM-DD" for easy calendar matching
    required: true 
  },
  tasks: [{
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    category: { type: String, enum: ['Diet', 'Yoga', 'Meditation', 'Sleep'] }
  }],
  consistencyScore: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100 
  }
});

// Compound index to ensure a user has only one activity entry per day
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);