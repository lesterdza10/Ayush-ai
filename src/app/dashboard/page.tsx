'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Heart, Moon, Brain, Zap, AlertCircle, Leaf, Droplets, Activity, Home } from 'lucide-react';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { HealthScoreCard } from '@/components/ui/HealthScoreCard';
import { RiskIndicatorCard } from '@/components/ui/RiskIndicatorCard';
import { Button } from '@/components/ui/Button';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { ProfileData } from '@/components/forms/MultiStepProfileForm';

interface DashboardData {
  dosha: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  healthScores: {
    digestion: number;
    sleep: number;
    stress: number;
    fitness: number;
  };
  riskIndicators: {
    gastric: { level: 'low' | 'medium' | 'high'; percentage: number };
    obesity: { level: 'low' | 'medium' | 'high'; percentage: number };
    diabetes: { level: 'low' | 'medium' | 'high'; percentage: number };
  };
  suggestions: Array<{
    icon: string;
    text: string;
    category: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (!storedProfile) {
      router.push('/profile');
      return;
    }

    const profileData = JSON.parse(storedProfile) as ProfileData;
    setProfile(profileData);

    // Mock calculation of health metrics
    const mockDashboardData: DashboardData = {
      dosha: {
        vata: 35,
        pitta: 40,
        kapha: 25,
      },
      healthScores: {
        digestion: Math.min(100, Math.max(40, 70 + (10 - profileData.stressLevel) * 2)),
        sleep: Math.min(100, Math.max(30, profileData.sleepQuality * 10)),
        stress: Math.min(100, Math.max(20, (10 - profileData.stressLevel) * 8)),
        fitness: Math.min(100, Math.max(50, profileData.exercise === 'daily' ? 90 : profileData.exercise === '4x/week' ? 75 : 60)),
      },
      riskIndicators: {
        gastric: {
          level: profileData.digestion === 'excellent' ? 'low' : profileData.digestion === 'normal' ? 'medium' : 'high',
          percentage: profileData.digestion === 'excellent' ? 20 : profileData.digestion === 'normal' ? 45 : 70,
        },
        obesity: {
          level: profileData.bodyType === 'slim' ? 'low' : profileData.bodyType === 'athletic' ? 'low' : 'high',
          percentage: profileData.bodyType === 'slim' ? 15 : profileData.bodyType === 'athletic' ? 25 : 65,
        },
        diabetes: {
          level: profileData.exercise === 'daily' ? 'low' : profileData.exercise === 'none' ? 'high' : 'medium',
          percentage: profileData.exercise === 'daily' ? 10 : profileData.exercise === 'none' ? 60 : 35,
        },
      },
      suggestions: [
        { icon: '🧘', text: 'Practice meditation 10 minutes daily for stress relief', category: 'wellness' },
        { icon: '🚴', text: `Increase exercise frequency - currently ${profileData.exercise || 'none'}`, category: 'fitness' },
        { icon: '💧', text: `Increase water intake - aim for 2-3 liters daily (current: ${profileData.waterIntake}L)`, category: 'hydration' },
        { icon: '🛌', text: 'Maintain consistent sleep schedule - current window 10 PM to 6 AM', category: 'sleep' },
        { icon: '🥗', text: 'Add more leafy greens and whole grains to your diet', category: 'nutrition' },
        { icon: '⏰', text: 'Avoid heavy meals 2 hours before bedtime', category: 'digestion' },
      ],
    };

    setDashboardData(mockDashboardData);
    setLoading(false);
  }, [router]);

  if (loading || !profile || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cyan-400 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  const doshaData = [
    { name: 'Vata', value: dashboardData.dosha.vata, color: '#06b6d4' },
    { name: 'Pitta', value: dashboardData.dosha.pitta, color: '#f59e0b' },
    { name: 'Kapha', value: dashboardData.dosha.kapha, color: '#10b981' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900/30 p-6 md:p-12 transition-colors duration-300">
      {/* Navigation Buttons */}
      <div className="fixed top-6 left-6 z-50">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => router.push('/')}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              Welcome, {profile.name}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">Your personalized AYUSH health insights</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/profile')} size="md">
            Edit Profile
          </Button>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* Dosha Breakdown */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Dosha Constitution</h2>
            <GlassmorphismCard className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={doshaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {doshaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-6">
                  {doshaData.map((dosha) => (
                    <div key={dosha.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">{dosha.name}</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{dosha.value}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-300 dark:bg-slate-600 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: dosha.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${dosha.value}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-400">
                        {dosha.name === 'Vata' && 'Air & Ether - Movement & Communication'}
                        {dosha.name === 'Pitta' && 'Fire & Water - Metabolism & Digestion'}
                        {dosha.name === 'Kapha' && 'Water & Earth - Structure & Stability'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Health Score Cards */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Health Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthScoreCard
                title="Digestion"
                score={dashboardData.healthScores.digestion}
                icon="🔥"
                label="Digestive Power"
              />
              <HealthScoreCard
                title="Sleep"
                score={dashboardData.healthScores.sleep}
                icon="😴"
                label="Sleep Quality"
              />
              <HealthScoreCard
                title="Stress"
                score={dashboardData.healthScores.stress}
                icon="🧘"
                label="Mental Calm"
              />
              <HealthScoreCard
                title="Fitness"
                score={dashboardData.healthScores.fitness}
                icon="💪"
                label="Physical Strength"
              />
            </div>
          </motion.div>

          {/* Risk Indicators */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Health Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RiskIndicatorCard
                title="Gastric Issues"
                risk={dashboardData.riskIndicators.gastric.level}
                percentage={dashboardData.riskIndicators.gastric.percentage}
                icon="🫡"
              />
              <RiskIndicatorCard
                title="Obesity Risk"
                risk={dashboardData.riskIndicators.obesity.level}
                percentage={dashboardData.riskIndicators.obesity.percentage}
                icon="⚖️"
              />
              <RiskIndicatorCard
                title="Diabetes Risk"
                risk={dashboardData.riskIndicators.diabetes.level}
                percentage={dashboardData.riskIndicators.diabetes.percentage}
                icon="🩺"
              />
            </div>
          </motion.div>

          {/* Suggestions Panel */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Personalized Suggestions</h2>
            <GlassmorphismCard className="p-8">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {dashboardData.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-white dark:bg-slate-700 rounded-xl border border-cyan-300 dark:border-cyan-600 hover:bg-cyan-50 dark:hover:bg-slate-600 transition-all"
                  >
                    <span className="text-3xl flex-shrink-0">{suggestion.icon}</span>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{suggestion.text}</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 capitalize mt-1">{suggestion.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Footer Actions */}
          <motion.div variants={itemVariants} className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => router.push('/profile')} size="lg">
              Update Profile
            </Button>
            <Button variant="primary" onClick={() => window.print()} size="lg">
              Download Report
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
