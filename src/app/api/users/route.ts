import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/options';
import {
  getProfileByUserId,
  upsertHealthMetrics,
  upsertProfile,
  type HealthMetricsPayload,
  type ProfilePayload,
} from '@/lib/models/services';

const profileSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(1),
  gender: z.string().min(1),
  height: z.number().positive(),
  weight: z.number().positive(),
  location: z.string().min(1),
  bodyType: z.string().min(1),
  appetite: z.string().min(1),
  digestion: z.string().min(1),
  sleepQuality: z.number().int().min(1).max(10),
  stressLevel: z.number().int().min(1).max(10),
  wakeUpTime: z.string().min(1),
  sleepTime: z.string().min(1),
  exercise: z.string().min(1),
  foodType: z.string().min(1),
  junkFoodFreq: z.string().min(1),
  waterIntake: z.number().positive(),
  doshaAnswers: z.array(z.boolean()).length(12),
});

const vataIndexes = [0, 1, 4, 5, 10];
const pittaIndexes = [2, 3, 8, 11];
const kaphaIndexes = [1, 5, 6, 7, 9];

function calculateDosha(answers: boolean[]) {
  const scores = {
    vata: vataIndexes.filter((index) => answers[index]).length,
    pitta: pittaIndexes.filter((index) => answers[index]).length,
    kapha: kaphaIndexes.filter((index) => answers[index]).length,
  };

  const total = scores.vata + scores.pitta + scores.kapha || 1;

  const vataPercent = Math.round((scores.vata / total) * 100);
  const pittaPercent = Math.round((scores.pitta / total) * 100);
  const kaphaPercent = Math.max(0, 100 - vataPercent - pittaPercent);

  return {
    vata: vataPercent,
    pitta: pittaPercent,
    kapha: kaphaPercent,
  };
}

function calculateHealthMetrics(profile: z.infer<typeof profileSchema>): HealthMetricsPayload {
  const digestScore = Math.min(100, Math.max(40, 70 + (10 - profile.stressLevel) * 2));
  const sleepScore = Math.min(100, Math.max(30, profile.sleepQuality * 10));
  const stressScore = Math.min(100, Math.max(20, (10 - profile.stressLevel) * 8));

  let fitnessScore = 60;
  switch (profile.exercise) {
    case 'daily':
      fitnessScore = 90;
      break;
    case '4x/week':
      fitnessScore = 75;
      break;
    case '2x/week':
      fitnessScore = 65;
      break;
    case 'none':
      fitnessScore = 50;
      break;
    default:
      fitnessScore = 60;
  }

  const gastricRisk = (profile.digestion === 'excellent' ? 'low' : profile.digestion === 'normal' ? 'medium' : 'high');
  const obesityRisk = (profile.bodyType === 'slim' ? 'low' : profile.bodyType === 'athletic' ? 'medium' : 'high');
  const diabetesRisk = (profile.exercise === 'daily' ? 'low' : profile.exercise === 'none' ? 'high' : 'medium');

  return {
    digestScore,
    sleepScore,
    stressScore,
    fitnessScore,
    gastricRisk: gastricRisk as HealthMetricsPayload['gastricRisk'],
    obesityRisk: obesityRisk as HealthMetricsPayload['obesityRisk'],
    diabetesRisk: diabetesRisk as HealthMetricsPayload['diabetesRisk'],
  };
}

function serializeProfile(profile: Awaited<ReturnType<typeof upsertProfile>>) {
  return {
    ...profile,
    _id: profile._id?.toString(),
    userId: profile.userId.toString(),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const dosha = calculateDosha(parsed.data.doshaAnswers);

    const profilePayload: ProfilePayload = {
      ...parsed.data,
      dosha,
    };

    const profile = await upsertProfile(session.user.id, profilePayload);

    const metricsPayload = calculateHealthMetrics(parsed.data);
    const metrics = await upsertHealthMetrics(session.user.id, metricsPayload);

    return NextResponse.json({
      success: true,
      data: {
        profile: serializeProfile(profile),
        metrics: {
          ...metricsPayload,
          recordedAt: metrics.recordedAt.toISOString(),
          updatedAt: metrics.updatedAt.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
    return NextResponse.json(
      { error: 'Failed to save profile', message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfileByUserId(session.user.id);

    if (!profile) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: serializeProfile(profile) });
  } catch (error) {
    console.error('Error fetching profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
    return NextResponse.json(
      { error: 'Failed to fetch profile', message: errorMessage },
      { status: 500 }
    );
  }
}
