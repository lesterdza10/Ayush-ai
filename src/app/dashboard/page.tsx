'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Home, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { HealthScoreCard } from '@/components/ui/HealthScoreCard';
import { RiskIndicatorCard } from '@/components/ui/RiskIndicatorCard';
import { Button } from '@/components/ui/Button';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

type RiskLevel = 'low' | 'medium' | 'high';

interface ProfileDocument {
  _id?: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  location: string;
  bodyType: string;
  appetite: string;
  digestion: string;
  sleepQuality: number;
  stressLevel: number;
  wakeUpTime: string;
  sleepTime: string;
  exercise: string;
  foodType: string;
  junkFoodFreq: string;
  waterIntake: number;
  doshaAnswers: boolean[];
  dosha: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface HealthMetricsDocument {
  digestScore: number;
  sleepScore: number;
  stressScore: number;
  fitnessScore: number;
  gastricRisk: RiskLevel;
  obesityRisk: RiskLevel;
  diabetesRisk: RiskLevel;
  recordedAt: string;
  updatedAt: string;
}

interface RecommendationDocument {
  content: string;
  source: 'gemini-ai' | 'fallback-local';
  createdAt: string;
}

interface Suggestion {
  icon: string;
  text: string;
  category: string;
}

const doshaColors = {
  Vata: '#06b6d4',
  Pitta: '#f59e0b',
  Kapha: '#10b981',
};

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const [profile, setProfile] = useState<ProfileDocument | null>(null);
  const [metrics, setMetrics] = useState<HealthMetricsDocument | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    let isMounted = true;

    const fetchJson = async <T,>(url: string): Promise<T> => {
      const response = await fetch(url, {
        credentials: 'include',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `Failed to fetch ${url}`);
      }

      return response.json();
    };

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const profilePayload = await fetchJson<{ data: ProfileDocument | null }>('/api/users');

        if (!profilePayload.data) {
          router.replace('/profile');
          return;
        }

        if (!isMounted) {
          return;
        }

        setProfile(profilePayload.data);

        const [metricsPayload, recommendationPayload] = await Promise.all([
          fetchJson<{ data: HealthMetricsDocument | null }>('/api/health'),
          fetchJson<{ data: RecommendationDocument | null }>('/api/recommendations'),
        ]);

        if (!isMounted) {
          return;
        }

        setMetrics(metricsPayload.data ?? null);
        setRecommendation(recommendationPayload.data ?? null);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [status, router]);

  const healthScores = useMemo(() => {
    if (!profile) {
      return {
        digestion: metrics?.digestScore ?? 60,
        sleep: metrics?.sleepScore ?? 60,
        stress: metrics?.stressScore ?? 60,
        fitness: metrics?.fitnessScore ?? 60,
      };
    }

    return {
      digestion: metrics?.digestScore ?? 60,
      sleep: metrics?.sleepScore ?? profile.sleepQuality * 10,
      stress: metrics?.stressScore ?? Math.max(20, (10 - profile.stressLevel) * 8),
      fitness: metrics?.fitnessScore ?? 60,
    };
  }, [profile, metrics]);

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!profile) {
      return [];
    }

    const items: Suggestion[] = [];

    if (healthScores.stress < 50) {
      items.push({
        icon: '🧘',
        text: 'Dedicate 10 minutes daily to calming breathwork for stress balance.',
        category: 'wellness',
      });
    }

    if (profile.exercise === 'none' || healthScores.fitness < 60) {
      items.push({
        icon: '🚴',
        text: 'Add three 30-minute movement sessions this week to rebuild stamina.',
        category: 'fitness',
      });
    }

    if (profile.waterIntake < 6) {
      items.push({
        icon: '💧',
        text: `Increase hydration to at least 2.5L daily (current: ${profile.waterIntake}L).`,
        category: 'hydration',
      });
    }

    if (profile.sleepQuality < 7) {
      items.push({
        icon: '🛌',
        text: 'Wind down by 10 PM with a warm herbal tea to lift sleep score.',
        category: 'sleep',
      });
    }

    if (profile.digestion !== 'excellent') {
      items.push({
        icon: '🥗',
        text: 'Favor warm, lightly spiced meals to strengthen digestion.',
        category: 'nutrition',
      });
    }

    if (!items.length) {
      items.push({
        icon: '✨',
        text: 'Great progress! Maintain your rhythm and check recommendations weekly.',
        category: 'maintenance',
      });
    }

    return items;
  }, [profile, healthScores]);

  if (loading || status === 'unauthenticated') {
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

  if (!profile) {
    return null;
  }

  const doshaData = [
    { name: 'Vata', value: profile.dosha.vata, color: doshaColors.Vata },
    { name: 'Pitta', value: profile.dosha.pitta, color: doshaColors.Pitta },
    { name: 'Kapha', value: profile.dosha.kapha, color: doshaColors.Kapha },
  ];

  const riskIndicators = {
    gastric: {
      level: metrics?.gastricRisk ?? (profile.digestion === 'excellent' ? 'low' : profile.digestion === 'normal' ? 'medium' : 'high'),
      percentage: metrics?.gastricRisk === 'high' ? 70 : metrics?.gastricRisk === 'medium' ? 45 : 20,
    },
    obesity: {
      level: metrics?.obesityRisk ?? (profile.bodyType === 'slim' ? 'low' : profile.bodyType === 'athletic' ? 'medium' : 'high'),
      percentage: metrics?.obesityRisk === 'high' ? 65 : metrics?.obesityRisk === 'medium' ? 35 : 20,
    },
    diabetes: {
      level: metrics?.diabetesRisk ?? (profile.exercise === 'daily' ? 'low' : profile.exercise === 'none' ? 'high' : 'medium'),
      percentage: metrics?.diabetesRisk === 'high' ? 60 : metrics?.diabetesRisk === 'medium' ? 35 : 15,
    },
  };


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

      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-100/80 dark:bg-red-900/40 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

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
            Update Profile
          </Button>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
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

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Health Scores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <HealthScoreCard title="Digestion" score={Math.round(healthScores.digestion)} icon="🔥" label="Digestive Power" />
              <HealthScoreCard title="Sleep" score={Math.round(healthScores.sleep)} icon="😴" label="Sleep Quality" />
              <HealthScoreCard title="Stress" score={Math.round(healthScores.stress)} icon="🧘" label="Mental Calm" />
              <HealthScoreCard title="Fitness" score={Math.round(healthScores.fitness)} icon="💪" label="Physical Strength" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Health Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RiskIndicatorCard title="Gastric Issues" risk={riskIndicators.gastric.level} percentage={riskIndicators.gastric.percentage} icon="🫡" />
              <RiskIndicatorCard title="Obesity Risk" risk={riskIndicators.obesity.level} percentage={riskIndicators.obesity.percentage} icon="⚖️" />
              <RiskIndicatorCard title="Diabetes Risk" risk={riskIndicators.diabetes.level} percentage={riskIndicators.diabetes.percentage} icon="🩺" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Personalized Suggestions</h2>
            <GlassmorphismCard className="p-8">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={`${suggestion.category}-${index}`}
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

          {recommendation && (
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-500" />
                Latest AI Recommendations
              </h2>
              <GlassmorphismCard className="p-8">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Source: {recommendation.source === 'gemini-ai' ? 'Gemini AI' : 'Local Ayurvedic Engine'}</span>
                  <span>{new Date(recommendation.createdAt).toLocaleString()}</span>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{recommendation.content}</pre>
              </GlassmorphismCard>
            </motion.div>
          )}

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

