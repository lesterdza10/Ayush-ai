'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Droplets, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

// --- SUB-COMPONENT: STREAK COUNTER ---
export function StreakCounter({ activities = [] }: { activities: any[] }) {
  const calculateStreak = () => {
    if (!activities.length) return 0;
    let streak = 0;
    const sorted = [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].consistencyScore === 100) streak++;
      else break;
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 p-6 rounded-[2.5rem] flex items-center justify-between shadow-lg mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-orange-500 p-3 rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
          <Flame className="text-white fill-white" size={24} />
        </div>
        <div>
          <p className="text-xs font-black uppercase text-orange-400 tracking-tighter">Current Streak</p>
          <h2 className="text-3xl font-black text-white">{streak} Days</h2>
        </div>
      </div>
      <div className="text-right">
        {streak >= 7 ? <Trophy className="text-yellow-500" size={24} /> : <p className="text-[10px] text-gray-500">Keep it up!</p>}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT: VITALS TRACKER ---
export default function VitalsTracker({ userId, activities = [] }: { userId: string, activities: any[] }) {
  const [water, setWater] = useState(2);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleAction = async (actionType: 'generate' | 'complete') => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: actionType, 
          userId, 
          waterDrank: water, 
          date: today,
          exercises: ["Yoga Practice"] 
        })
      });

      const data = await res.json();
      if (actionType === 'generate') {
        setAdvice(data.advice);
        setSchedule(data.schedule || []);
      } else {
        setIsDone(true);
        window.location.reload(); // Refresh to update the green calendar
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Streak shows up at the top of the tracker section */}
      <StreakCounter activities={activities} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        {/* Input Side */}
        <div className="space-y-6 p-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <Droplets className="text-cyan-400"/> Daily Vitals
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
              <span>Water Intake</span>
              <span className="text-cyan-400">{water}L</span>
            </div>
            <input 
              type="range" min="0" max="5" step="0.5" 
              value={water} 
              onChange={(e) => setWater(Number(e.target.value))} 
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
            />
          </div>
          <button 
            onClick={() => handleAction('generate')}
            disabled={loading}
            className="w-full py-4 bg-cyan-600 rounded-2xl font-bold hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
            Ask Sage for Schedule
          </button>
        </div>

        {/* AI Output Side */}
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 relative">
          <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Sage Wisdom</p>
          <p className="text-sm italic text-gray-300 mb-6 leading-relaxed">
            {advice ? `"${advice}"` : "Input your vitals to receive tomorrow's Ayurvedic path."}
          </p>
          
          <div className="space-y-3">
            {schedule.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                <span className="text-sm text-white">
                  <span className="text-cyan-500 font-bold mr-2">{item.time}</span> {item.task}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-bold">{item.duration}</span>
              </div>
            ))}
          </div>

          {schedule.length > 0 && (
            <button 
              onClick={() => handleAction('complete')}
              className={`w-full mt-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg
                ${isDone ? 'bg-green-600 text-white' : 'bg-white text-slate-900 hover:bg-gray-200'}`}
            >
              <CheckCircle2 size={18}/> {isDone ? "Goal Met!" : "Mark All Done"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}