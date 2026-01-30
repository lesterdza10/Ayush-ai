'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { HealthScoreCard } from '@/components/ui/HealthScoreCard';
import { RiskIndicatorCard } from '@/components/ui/RiskIndicatorCard';
import { Button } from '@/components/ui/Button';
import { Home, Download } from 'lucide-react';

const COLORS = ['#06b6d4', '#f59e0b', '#10b981'];

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Check Database, but fallback to LocalStorage for instant sync
    const loadData = async () => {
      try {
        const res = await fetch(`/api/users/profile?userId=${userId}`);
        const dbData = await res.json();
        
        if (dbData.bodyType) {
          setProfile(dbData);
        } else {
          const local = localStorage.getItem('userProfile') || localStorage.getItem('tempProfileData');
          if (local) setProfile(JSON.parse(local));
        }
      } catch (e) {
        const local = localStorage.getItem('userProfile');
        if (local) setProfile(JSON.parse(local));
      }
    };
    loadData();
  }, []);

  // Visual Calculations
  const metrics = useMemo(() => {
    if (!profile) return null;
    return {
      digestion: profile.digestion === 'excellent' ? 92 : profile.digestion === 'normal' ? 70 : 45,
      sleep: (profile.sleepQuality || 5) * 10,
      stress: (11 - (profile.stressLevel || 5)) * 10,
      fitness: profile.exercise === 'daily' ? 88 : 50,
      vata: profile.bodyType === 'slim' ? 50 : 25,
      pitta: profile.bodyType === 'athletic' ? 50 : 25,
      kapha: profile.bodyType === 'curvy' ? 50 : 25,
    };
  }, [profile]);

  if (!profile || !metrics) return <div className="p-20 text-center text-white">Syncing...</div>;

  const doshaData = [
    { name: 'Vata', value: metrics.vata },
    { name: 'Pitta', value: metrics.pitta },
    { name: 'Kapha', value: metrics.kapha },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={() => router.push('/home')} className="flex gap-2">
            <Home className="w-4 h-4" /> Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Health Dashboard</h1>
        </div>

        {/* PIE CHART VISUAL */}
        <GlassmorphismCard className="p-8">
          <h2 className="text-xl font-bold mb-6">Ayurvedic Dosha Constitution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={doshaData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" animationBegin={0} animationDuration={1000}>
                    {doshaData.map((_, index) => <Cell key={index} fill={COLORS[index]} stroke="none" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
               {doshaData.map((d, i) => (
                 <div key={d.name} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                   <span className="font-bold" style={{ color: COLORS[i] }}>{d.name}</span>
                   <span className="text-xl font-bold">{d.value}%</span>
                 </div>
               ))}
            </div>
          </div>
        </GlassmorphismCard>

        {/* HEALTH SCORE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <HealthScoreCard title="Digestion" score={metrics.digestion} icon="🔥" label="Agni" />
          <HealthScoreCard title="Sleep" score={metrics.sleep} icon="😴" label="Ojas" />
          <HealthScoreCard title="Stress" score={metrics.stress} icon="🧘" label="Prana" />
          <HealthScoreCard title="Fitness" score={metrics.fitness} icon="💪" label="Bala" />
        </div>

        <Button onClick={() => window.print()} variant="primary" className="w-full bg-cyan-600 h-14 text-lg">
          <Download className="mr-2 w-5 h-5" /> Download PDF Report
        </Button>
      </div>
    </div>
  );
}