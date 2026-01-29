'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { Button } from '@/components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Download, Activity, LogOut } from 'lucide-react'; // Added LogOut icon

export default function ProfileViewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFromDB = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) { 
        router.push('/'); // Redirect to landing if no session
        return; 
      }

      try {
        const res = await fetch(`/api/users/profile?userId=${userId}`);
        const dbData = await res.json();
        
        if (res.ok) {
          setProfile(dbData);
        }
      } catch (err) {
        console.error("Database Connection Error");
      } finally {
        setLoading(false);
      }
    };
    fetchFromDB();
  }, [router]);

  // SIGN OUT FUNCTION
  const handleSignOut = () => {
    localStorage.clear(); // Clears userId and temp data
    router.push('/');
  };

  const downloadReport = () => {
    if (!profile) return;
    const reportData = JSON.stringify(profile, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name}_Health_Report.json`;
    link.click();
  };

  const chartData = [
    { label: 'Sleep', score: (profile?.sleepQuality || 0) * 10 },
    { label: 'Stress', score: (profile?.stressLevel || 0) * 10 },
    { label: 'Hydration', score: (profile?.waterIntake || 0) * 10 },
    { label: 'Overall', score: 75 }
  ];

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-medium">Connecting to Database...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 pt-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push('/home')} className="flex gap-2 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
              <Home className="w-4 h-4" /> Home
            </Button>
            <Button variant="primary" onClick={downloadReport} className="flex gap-2 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-900/20">
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>

          {/* NEW SIGN OUT BUTTON */}
          <Button 
            variant="secondary" 
            onClick={handleSignOut} 
            className="flex gap-2 text-red-400 border-red-500/20 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity Card */}
          <GlassmorphismCard className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold mb-4 shadow-xl border-2 border-white/10">
              {profile?.name?.[0] || 'U'}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{profile?.name || 'User'}</h2>
            <p className="text-gray-500 text-sm mb-4 font-medium">{profile?.email || 'Syncing...'}</p>
            <div className="w-full border-t border-white/5 pt-4 mt-2">
               <p className="text-cyan-500 font-bold uppercase text-[10px] tracking-widest mb-1">Current Body Type</p>
               <p className="text-xl capitalize font-semibold">{profile?.bodyType || '---'}</p>
            </div>
          </GlassmorphismCard>

          {/* Graph Card */}
          <GlassmorphismCard className="md:col-span-2 p-8 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-8">
              <Activity className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-bold">Health Metrics Visualization</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="label" stroke="#475569" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }} 
                    cursor={{ stroke: '#06b6d4', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#06b6d4" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassmorphismCard>
        </div>
      </div>
    </div>
  );
}