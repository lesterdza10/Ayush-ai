import { Collection, Document, ObjectId } from 'mongodb';
import { getDb } from '@/lib/db/connection';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  name?: string | null;
  image?: string | null;
  providerAccounts: Array<{
    provider: string;
    providerAccountId: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileDocument {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  location: string;
  bodyType: string;
  appetite: string;
  digestion: string;
  sleepQuality: number;
  stressLevel: number;
  wakeUpTime: string;
  sleepTime: string;
  exercise: string;
  foodType: string;
  junkFoodFreq: string;
  waterIntake: number;
  doshaAnswers: boolean[];
  dosha: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthMetricDocument {
  _id?: ObjectId;
  userId: ObjectId;
  digestScore: number;
  sleepScore: number;
  stressScore: number;
  fitnessScore: number;
  gastricRisk: RiskLevel;
  obesityRisk: RiskLevel;
  diabetesRisk: RiskLevel;
  recordedAt: Date;
  updatedAt: Date;
}

export interface RecommendationDocument {
  _id?: ObjectId;
  userId: ObjectId;
  content: string;
  source: 'gemini-ai' | 'fallback-local';
  createdAt: Date;
}

export interface ChatMessageDocument {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatSessionDocument {
  _id?: ObjectId;
  userId: ObjectId;
  messages: ChatMessageDocument[];
  profileSnapshot?: ProfileDocument;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export function getUsersCollection() {
  return getCollection<UserDocument>('users');
}

export function getProfilesCollection() {
  return getCollection<ProfileDocument>('profiles');
}

export function getHealthMetricsCollection() {
  return getCollection<HealthMetricDocument>('healthMetrics');
}

export function getRecommendationsCollection() {
  return getCollection<RecommendationDocument>('recommendations');
}

export function getChatSessionsCollection() {
  return getCollection<ChatSessionDocument>('chatSessions');
}
