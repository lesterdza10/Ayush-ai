'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import { GlassmorphismCard } from './GlassmorphismCard';

export const HealthCalendar = ({ activityData }: { activityData: any[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <GlassmorphismCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-cyan-500/10 rounded-lg">←</button>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-cyan-500/10 rounded-lg">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 uppercase">{day}</div>
        ))}
        
        {days.map((day, idx) => {
          // Check if user was consistent on this day
          const dayData = activityData.find(d => isSameDay(new Date(d.date), day));
          const isConsistent = dayData && dayData.consistencyScore > 80;

          return (
            <motion.div
              key={day.toString()}
              whileHover={{ scale: 1.1 }}
              className={`
                h-12 flex flex-col items-center justify-center rounded-xl border transition-all
                ${isToday(day) ? 'border-cyan-500 bg-cyan-500/10' : 'border-transparent'}
                ${isConsistent ? 'bg-green-500/20 border-green-500/50' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
              `}
            >
              <span className={`text-sm ${isConsistent ? 'text-green-600 font-bold' : 'dark:text-gray-300'}`}>
                {format(day, 'd')}
              </span>
              {isConsistent && <div className="w-1 h-1 bg-green-500 rounded-full mt-1" />}
            </motion.div>
          );
        })}
      </div>
    </GlassmorphismCard>
  );
};