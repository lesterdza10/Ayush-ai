import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/options';
import { getHealthMetricsByUserId, upsertHealthMetrics } from '@/lib/models/services';

const healthSchema = z.object({
  digestScore: z.number().min(0).max(100),
  sleepScore: z.number().min(0).max(100),
  stressScore: z.number().min(0).max(100),
  fitnessScore: z.number().min(0).max(100),
  gastricRisk: z.enum(['low', 'medium', 'high']),
  obesityRisk: z.enum(['low', 'medium', 'high']),
  diabetesRisk: z.enum(['low', 'medium', 'high']),
});

function serializeMetrics(metrics: Awaited<ReturnType<typeof upsertHealthMetrics>>) {
  return {
    ...metrics,
    _id: metrics._id?.toString(),
    userId: metrics.userId.toString(),
    recordedAt: metrics.recordedAt.toISOString(),
    updatedAt: metrics.updatedAt.toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = healthSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid health metrics payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const metrics = await upsertHealthMetrics(session.user.id, parsed.data);

    return NextResponse.json({ success: true, data: serializeMetrics(metrics) });
  } catch (error) {
    console.error('Error saving health metrics:', error);
    return NextResponse.json(
      { error: 'Failed to save health metrics' },
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

    const metrics = await getHealthMetricsByUserId(session.user.id);

    if (!metrics) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: serializeMetrics(metrics) });
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health metrics' },
      { status: 500 }
    );
  }
}
