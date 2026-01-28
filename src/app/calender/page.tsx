'use client';

import React from 'react';
import { HealthCalendar } from '@/components/ui/HealthCalendar'; 
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import {useRouter} from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function CalendarPage() {
    const router = useRouter();
  // Mock data for now to test the UI
  const mockActivity = [
    { date: '2026-01-27', consistencyScore: 90 },
    { date: '2026-01-28', consistencyScore: 40 },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <Button
          variant='primary'
          size='sm'
          onClick={() => router.push('/')}
        >← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          My Wellness Consistency
        </h1>
        <HealthCalendar activityData={mockActivity} />
        
        <GlassmorphismCard className="mt-8 p-6">
          <h3 className="text-lg font-bold mb-2">Consistency Tip 🌿</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Following your Dinacharya (daily routine) between 6:00 AM and 10:00 AM 
            maximizes your energy for the day.
          </p>
        </GlassmorphismCard>
      </div>
    </div>
  );
}