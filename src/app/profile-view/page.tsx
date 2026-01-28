'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ProfileViewPage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get data that was saved in your MultiStepProfileForm
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      setProfile(JSON.parse(savedData));
    }
  }, []);

  const consistencyData = [
    { day: 'Mon', score: 70 }, { day: 'Tue', score: 85 },
    { day: 'Wed', score: 90 }, { day: 'Thu', score: 65 },
    { day: 'Fri', score: 95 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 pt-24 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* LEFT: BIG CIRCLE LOGO */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-8xl text-white font-bold shadow-2xl border-8 border-white dark:border-slate-800">
            {profile?.name?.charAt(0) || 'U'}
          </div>
        </motion.div>

        {/* RIGHT: DETAILS & GRAPH */}
        <div className="flex-grow space-y-6">
          <GlassmorphismCard className="p-8">
            <div className="flex justify-between items-start">
              <h2 className="text-3xl font-bold dark:text-white mb-6">User Profile</h2>
              <Button variant="secondary" size="sm" onClick={() => router.push('/profile')}>
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Name</p>
                <p className="text-xl dark:text-gray-200">{profile?.name || 'Not Set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                <p className="text-xl dark:text-gray-200">{profile?.email || 'Not Set'}</p>
              </div>
            </div>
          </GlassmorphismCard>

          <GlassmorphismCard className="p-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Consistency Progress</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consistencyData}>
                  <XAxis dataKey="day" stroke="#888888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={4} dot={{ r: 6, fill: '#0ea5e9' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}