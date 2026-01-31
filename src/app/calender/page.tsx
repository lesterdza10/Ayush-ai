'use client';

import { useEffect, useState } from 'react';
import HealthCalendar from '@/components/ui/HealthCalendar';

export default function CalendarPage() {
  const [data, setData] = useState({ activities: [], userId: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      // Fetch user profile/activities from your existing API
      fetch(`/api/users/profile?userId=${id}`)
        .then(res => res.json())
        .then(resData => {
          setData({ 
            activities: resData.activities || [], 
            userId: id 
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-bold animate-pulse">Consulting the Akashic Records...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <HealthCalendar activities={data.activities} userId={data.userId} />
      </div>
    </main>
  );
}