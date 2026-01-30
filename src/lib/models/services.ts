import { ObjectId } from 'mongodb';
import {
  ChatMessageDocument,
  ChatSessionDocument,
  HealthMetricDocument,
  ProfileDocument,
  RecommendationDocument,
  RiskLevel,
  UserDocument,
  getChatSessionsCollection,
  getHealthMetricsCollection,
  getProfilesCollection,
  getRecommendationsCollection,
  getUsersCollection,
} from '@/lib/models';

function asObjectId(id: string | ObjectId): ObjectId {
  return typeof id === 'string' ? new ObjectId(id) : id;
}

export interface UpsertUserInput {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId: string;
}

export async function upsertUser(input: UpsertUserInput): Promise<UserDocument> {
  const { email, name, image, provider, providerAccountId } = input;
  const users = await getUsersCollection();

  const now = new Date();
  const providerEntry = {
    provider,
    providerAccountId,
  };

  const existingUser = await users.findOne({ email });

  if (existingUser) {
    await users.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          name: name ?? null,
          image: image ?? null,
          updatedAt: now,
        },
        $addToSet: {
          providerAccounts: providerEntry,
        },
      }
    );

    return {
      ...existingUser,
      name: name ?? existingUser.name ?? null,
      image: image ?? existingUser.image ?? null,
      updatedAt: now,
      providerAccounts: existingUser.providerAccounts.some(
        (account) => account.provider === provider && account.providerAccountId === providerAccountId
      )
        ? existingUser.providerAccounts
        : [...existingUser.providerAccounts, providerEntry],
    };
  }

  const newUser: UserDocument = {
    email,
    name: name ?? null,
    image: image ?? null,
    providerAccounts: [providerEntry],
    createdAt: now,
    updatedAt: now,
  };

  const insertResult = await users.insertOne(newUser);

  return { ...newUser, _id: insertResult.insertedId };
}

export function getUserByEmail(email: string) {
  return getUsersCollection().then((collection) => collection.findOne({ email }));
}

export interface ProfilePayload {
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
}

export async function upsertProfile(userId: string, payload: ProfilePayload): Promise<ProfileDocument> {
  const profiles = await getProfilesCollection();
  const now = new Date();
  const objectId = asObjectId(userId);

  const result = await profiles.findOneAndUpdate(
    { userId: objectId },
    {
      $set: {
        ...payload,
        updatedAt: now,
      },
      $setOnInsert: {
        userId: objectId,
        createdAt: now,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    }
  );

  if (!result) {
    throw new Error('Failed to upsert profile');
  }

  return result;
}

export function getProfileByUserId(userId: string) {
  return getProfilesCollection().then((collection) => collection.findOne({ userId: asObjectId(userId) }));
}

export interface HealthMetricsPayload {
  digestScore: number;
  sleepScore: number;
  stressScore: number;
  fitnessScore: number;
  gastricRisk: RiskLevel;
  obesityRisk: RiskLevel;
  diabetesRisk: RiskLevel;
}

export async function upsertHealthMetrics(userId: string, payload: HealthMetricsPayload): Promise<HealthMetricDocument> {
  const metrics = await getHealthMetricsCollection();
  const now = new Date();
  const objectId = asObjectId(userId);

  const result = await metrics.findOneAndUpdate(
    { userId: objectId },
    {
      $set: {
        ...payload,
        updatedAt: now,
      },
      $setOnInsert: {
        userId: objectId,
        recordedAt: now,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    }
  );

  if (!result) {
    throw new Error('Failed to upsert health metrics');
  }

  return result;
}

export function getHealthMetricsByUserId(userId: string) {
  return getHealthMetricsCollection().then((collection) =>
    collection.findOne({ userId: asObjectId(userId) })
  );
}

export async function saveRecommendations(
  userId: string,
  content: string,
  source: RecommendationDocument['source']
): Promise<RecommendationDocument> {
  const recommendations = await getRecommendationsCollection();
  const now = new Date();
  const objectId = asObjectId(userId);

  const doc: RecommendationDocument = {
    userId: objectId,
    content,
    source,
    createdAt: now,
  };

  const inserted = await recommendations.insertOne(doc);
  return { ...doc, _id: inserted.insertedId };
}

export function getRecommendationsByUserId(userId: string) {
  return getRecommendationsCollection().then((collection) =>
    collection
      .find({ userId: asObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(1)
      .next()
  );
}

export async function createChatSession(
  userId: string,
  messages: ChatMessageDocument[],
  profileSnapshot?: ProfileDocument
): Promise<ChatSessionDocument> {
  const chatSessions = await getChatSessionsCollection();
  const objectId = asObjectId(userId);
  const now = new Date();

  const session: ChatSessionDocument = {
    userId: objectId,
    messages,
    profileSnapshot,
    createdAt: now,
    updatedAt: now,
  };

  const inserted = await chatSessions.insertOne(session);
  return { ...session, _id: inserted.insertedId };
}
