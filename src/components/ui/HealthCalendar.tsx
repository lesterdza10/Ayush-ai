'use client';

import React, { useState } from 'react';
import NextLink from 'next/link'; // Fixed: Use NextLink for navigation
import { 
  format, isToday, startOfMonth, endOfMonth, eachDayOfInterval, 
  startOfWeek, endOfWeek, addMonths, subMonths, parseISO 
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalIcon, Flame, Droplets, Sparkles, CheckCircle2, 
  Loader2, Trophy, ChevronLeft, ChevronRight, X, Activity as ActivityIcon,
  Circle, CheckCircle, ArrowLeft // Link icon removed to avoid conflict
} from 'lucide-react';

export default function HealthCalendar({ activities = [], userId = '' }: { activities?: any[], userId?: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [water, setWater] = useState(2);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const monthStart = startOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(endOfMonth(monthStart));
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const calculateStreak = () => {
    if (!activities?.length) return 0;
    let streak = 0;
    const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].consistencyScore === 100) streak++;
      else break;
    }
    return streak;
  };

  const handleAction = async (actionType: 'generate' | 'complete') => {
    setLoading(true);
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const tasksToSave = schedule.map((item, idx) => ({
      title: item.task,
      completed: completedTasks.includes(idx),
      category: 'Sage Schedule'
    }));

    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType, userId, waterDrank: water, date: dateStr, tasks: tasksToSave })
      });
      const data = await res.json();
      if (actionType === 'generate') {
        setAdvice(data.advice);
        setSchedule(data.schedule || []);
        setCompletedTasks([]);
      } else {
        window.location.reload();
      }
    } catch (err) {
      setAdvice("The Sage is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto space-y-8 p-4 md:p-10 text-white min-h-screen font-sans selection:bg-cyan-500/30">
      
      {/* --- PREMIUM TOP NAVIGATION BAR --- */}
      <div className="flex items-center justify-between mb-4 px-2">
        <NextLink href="/home" className="group flex items-center gap-3 py-2 pr-6 pl-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-xl shadow-xl">
          <div className="bg-cyan-500 p-2 rounded-full group-hover:rotate-[-10deg] transition-transform duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <ArrowLeft size={18} className="text-white"/>
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-slate-300 group-hover:text-cyan-400">Sanctuary</span>
        </NextLink>

        <div className="hidden md:flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"/> Aligned with Purpose
        </div>
      </div>

      {/* --- HERO HEADER: MONTH & STREAK --- */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900/60 p-8 md:p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between lg:justify-start gap-8 z-10">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-slate-400 hover:text-white"><ChevronLeft size={32}/></button>
          <div className="text-center lg:text-left">
            <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Lunar Cycle</p>
            <h2 className="text-5xl font-black tracking-tighter">{format(currentMonth, 'MMMM yyyy')}</h2>
          </div>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-slate-400 hover:text-white"><ChevronRight size={32}/></button>
        </div>
        
        <div className="flex items-center justify-center lg:justify-end gap-6 z-10">
          <div className="h-20 w-[1px] bg-white/10 hidden lg:block mx-4" />
          <div className="flex items-center gap-6 bg-gradient-to-br from-orange-500/20 to-transparent p-6 rounded-[2.5rem] border border-orange-500/20 shadow-inner">
            <div className="bg-orange-600 p-4 rounded-3xl shadow-[0_0_30px_rgba(234,88,12,0.4)]">
              <Flame size={32} className="fill-white text-white"/>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-orange-400 tracking-[0.2em] mb-1">Current Streak</p>
              <span className="text-4xl font-black tracking-tight">{calculateStreak()} Days</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Sparkles size={200}/></div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* --- CALENDAR GRID (Left) --- */}
        <div className="xl:col-span-7 bg-slate-900/40 p-8 md:p-10 rounded-[4rem] border border-white/5 backdrop-blur-md relative">
          <div className="grid grid-cols-7 gap-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayData = activities.find(a => a.date === dateStr);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isDone = dayData?.consistencyScore === 100;

              return (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDay(dayData || { date: dateStr, empty: true })}
                  key={i}
                  className={`relative h-24 md:h-32 rounded-[2rem] border transition-all duration-500 flex flex-col items-center justify-center gap-3
                    ${!isCurrentMonth ? 'opacity-5 grayscale pointer-events-none' : 'opacity-100'}
                    ${isDone ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-slate-950/40 border-white/5'}
                    ${isToday(day) ? 'ring-2 ring-cyan-500/50 border-cyan-500' : ''}
                  `}
                >
                  <span className={`text-2xl font-black ${isDone ? 'text-green-400' : 'text-slate-300'}`}>{format(day, 'd')}</span>
                  {isDone && <CheckCircle size={16} className="text-green-500 animate-in zoom-in" />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* --- TRACKER SIDEBAR (Right) --- */}
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-slate-900/80 p-10 rounded-[4rem] border border-white/10 shadow-3xl backdrop-blur-3xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-cyan-500/20 p-3 rounded-2xl"><Sparkles className="text-cyan-400" size={24}/></div>
              <h3 className="text-2xl font-black tracking-tight">Today's Alignment</h3>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
                  <span>Vayu (Hydration)</span>
                  <span>{water} Liters</span>
                </div>
                <input type="range" min="0" max="5" step="0.5" value={water} onChange={(e)=>setWater(Number(e.target.value))} className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500" />
              </div>
              
              <button 
                onClick={() => handleAction('generate')} 
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform"/>} 
                Generate Sage Schedule
              </button>

              <AnimatePresence>
                {schedule.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                    <div className="bg-cyan-500/5 p-6 rounded-[2rem] border border-cyan-500/10 italic text-sm text-cyan-100/70 text-center leading-relaxed font-medium">
                      "{advice}"
                    </div>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      {schedule.map((item, idx) => (
                        <div 
                          key={idx} onClick={() => setCompletedTasks(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])}
                          className={`flex items-center justify-between p-5 rounded-[2rem] border cursor-pointer transition-all duration-300
                            ${completedTasks.includes(idx) ? 'bg-green-500/10 border-green-500/40' : 'bg-slate-950/60 border-white/5 hover:bg-white/5'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            {completedTasks.includes(idx) ? <CheckCircle className="text-green-500" size={22}/> : <Circle className="text-slate-700" size={22}/>}
                            <span className={`text-sm font-bold ${completedTasks.includes(idx) ? 'text-green-400 line-through' : 'text-slate-300'}`}>{item.task}</span>
                          </div>
                          <span className="text-[10px] font-black text-slate-600 tabular-nums">{item.time}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleAction('complete')}
                      disabled={loading || completedTasks.length === 0}
                      className="w-full py-6 bg-green-600 hover:bg-green-500 rounded-[2.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(34,197,94,0.3)] disabled:opacity-20"
                    >
                      Lock Journey & Update Streak
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DAY VIEW DRAWER */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/60 p-10 rounded-[4rem] border border-white/10 relative overflow-hidden group">
                <button onClick={() => setSelectedDay(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={20}/></button>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">Detailed Log</h4>
                  <h5 className="text-3xl font-black mb-8">{format(parseISO(selectedDay.date), 'MMMM do')}</h5>
                  
                  {selectedDay.empty ? (
                    <div className="flex flex-col items-center py-6 text-slate-500 gap-4">
                      <ActivityIcon size={40} className="opacity-20"/>
                      <p className="italic text-sm">Silence follows the unrecorded path.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl"><Droplets className="text-cyan-400" size={24}/></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hydration</p>
                          <p className="text-xl font-bold">{selectedDay.waterIntake} Liters</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Achieved Milestones</p>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedDay.tasks?.map((t: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-sm font-bold border border-white/5">
                              <CheckCircle2 size={18} className={t.completed ? "text-green-500" : "text-slate-700"}/>
                              {t.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-10 -left-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><CalIcon size={200}/></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}