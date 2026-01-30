'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Zap, Brain, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [userInitial, setInitial] = useState('U');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getInitial = async () => {
      const userId = localStorage.getItem('userId'); 
      if (!userId) {
        setIsLoggedIn(false);
        router.push('/'); 
        return;
      }

      setIsLoggedIn(true);
      try {
        const res = await fetch(`/api/users/profile?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          // PRIORITIZE NAME: Use the first letter of the signup name
          if (data.name) {
            setInitial(data.name.charAt(0).toUpperCase());
          } else if (data.email) {
            setInitial(data.email.charAt(0).toUpperCase());
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setInitial('U');
      }
    };
    getInitial();
  }, [router]);

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: 'Ancient Wisdom',
      description: 'Personalized health insights based on Ayurvedic principles',
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Smart Analysis',
      description: 'AI-powered assessment of your unique constitution',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Health Scores',
      description: 'Track your digestion, sleep, stress, and fitness',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Personalized Tips',
      description: 'Actionable recommendations tailored just for you',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900/30 overflow-hidden transition-colors duration-300">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="fixed top-6 right-6 z-50 flex gap-4 items-center">
        <DarkModeToggle />
        
        <Button
          variant='secondary'
          size="sm"
          onClick={() => router.push("/calender")}
          className="flex gap-2 items-center"
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </Button>

        {/* Profile Icon Button */}
        <button
          onClick={() => router.push('/profile-view')}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg hover:ring-2 ring-cyan-400 transition-all border-2 border-white/20"
          title="View Profile"
        >
          {userInitial}
        </button>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ top: ['0%', '100%'], left: ['0%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <span className="text-6xl">🌿</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-green-600 dark:from-cyan-400 dark:via-blue-400 dark:to-green-400 bg-clip-text text-transparent mb-6">
            Your AYUSH Health Hub
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Welcome back! Monitor your progress, manage your Ayurvedic schedule, and explore new insights.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="primary"
              onClick={() => router.push('/profile')}
            >
              Update Health Profile →
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassmorphismCard hover className="p-8 h-full">
                <div className="text-cyan-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </motion.div>

        <footer className="mt-20 pt-12 border-t border-white/20 dark:border-slate-700/50 text-center text-gray-700 dark:text-gray-400 text-sm">
          <p>© 2026 AYUSH Health Platform. Combining ancient wisdom with modern AI intelligence.</p>
        </footer>
      </div>
    </div>
  );
}