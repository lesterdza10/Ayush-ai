'use client';

import { useState, useEffect } from 'react';
import { yogaExercises } from '@/types/yoga';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { Button } from '@/components/ui/Button';
import { Bell, Clock, Info } from 'lucide-react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

export default function YogaDashboard() {
  const [reminderTime, setReminderTime] = useState('');
  const [isNotified, setIsNotified] = useState(false);
  const router = useRouter();
  // Request Notification Permission on Load
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Check time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (currentTime === reminderTime && !isNotified) {
        sendNotification();
        setIsNotified(true); // Prevent repeat notifications in the same minute
      } else if (currentTime !== reminderTime) {
        setIsNotified(false);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [reminderTime, isNotified]);

  const sendNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Yoga Time! 🌿", {
        body: "Your daily yoga session is due. Time to find your balance.",
        icon: "/leaf-icon.png" // Replace with your logo
      });
    }
  };

  return (
    <div className="space-y-12">
      {/* Reminder Section */}
      <GlassmorphismCard className="p-8 border-cyan-500/20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-full text-cyan-400">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Yoga Reminders</h3>
              <p className="text-gray-400 text-sm">Schedule your daily session for better consistency.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
            <Clock className="w-5 h-5 text-cyan-400 ml-2" />
            <input 
              type="time" 
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-transparent text-white border-none focus:ring-0 px-2 font-mono"
            />
            <Button size="sm" onClick={() => alert(`Reminder set for ${reminderTime}`)}>Set Time</Button>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Yoga Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {yogaExercises.map((yoga) => (
          <GlassmorphismCard key={yoga.id} hover className="flex flex-col overflow-hidden">
            <div className="relative h-48 w-full">
              <img src={yoga.image} alt={yoga.name} className="object-cover w-full h-full" />
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-cyan-400 border border-cyan-400/30">
                {yoga.dosha}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-white mb-1">{yoga.name}</h4>
              <p className="text-xs text-cyan-500/80 italic mb-3">{yoga.sanskritName}</p>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{yoga.description}</p>
              
              <div className="space-y-2 mb-6">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Key Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {yoga.benefits.map((benefit, idx) => (
                    <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                      • {benefit}
                    </span>
                  ))}
                </div>
              </div>
        <Button 
        variant="secondary" 
        size="sm" 
        className="w-full mt-auto"
        onClick={() => router.push(`/yoga/${yoga.id}`)} // This must match the folder name
>
  View Full Details
</Button>
            </div>
          </GlassmorphismCard>
        ))}
      </div>
    </div>
  );
}