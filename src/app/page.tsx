'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

const featureHighlights = [
  {
    label: 'Personalized Ayurvedic profiling',
    emoji: '🧬',
  },
  {
    label: 'AI-guided recommendations',
    emoji: '🤖',
  },
  {
    label: 'Holistic health dashboard',
    emoji: '📊',
  },
];

export default function Home() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900/30 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-cyan-400 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900/30 overflow-hidden transition-colors duration-300">
      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      <div className="relative z-10 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-4xl w-full grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100/70 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-cyan-700 dark:text-cyan-300">
              <span>🌿</span>
              AYUSH Health Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              Log in to unlock your personalized Ayurvedic journey
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Sign in with Google to access holistic assessments, AI-powered recommendations, and a live dashboard tailored to your constitution.
            </p>
            <ul className="space-y-2">
              {featureHighlights.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                  <span className="text-xl">{feature.emoji}</span>
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <GlassmorphismCard className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Welcome back
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Continue with your Google account to sync your profile, insights, and chat history securely in the cloud.
                </p>
              </div>

              <Button
                size="lg"
                variant="primary"
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="w-full"
              >
                <span className="text-xl">🔐</span>
                Sign in with Google
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                By continuing you agree to store your health data on secured MongoDB servers scoped to your account only.
              </p>
            </GlassmorphismCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
