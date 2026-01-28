'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Zap, Brain, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

export default function Home() {
  const router = useRouter();

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
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-900/30 overflow-hidden transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50 flex gap-4 items-center">
        <DarkModeToggle />
        <Button
          variant='secondary'
          onClick={() => router.push("/calender")}>
          Calendar
        </Button>
      </div>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            top: ['0%', '100%'],
            left: ['0%', '100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            top: ['100%', '0%'],
            right: ['0%', '100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">
        {/* Hero Section */}
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
            AI-Powered AYUSH Health Platform
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Discover your unique health profile through ancient Ayurvedic wisdom combined with modern AI intelligence.
            Get personalized health insights, risk assessments, and actionable recommendations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="primary"
              onClick={() => router.push('/profile')}
            >
              Start My Health Profile →
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
            >
              View Sample Dashboard
            </Button>
            <Button
              size="lg"
              variant="third"
              onClick={() => router.push('/login')}
              >
                Login
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <GlassmorphismCard hover className="p-8 h-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-cyan-500 mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Profile Creation', desc: '4-step personalized assessment' },
              { step: '2', title: 'AI Analysis', desc: 'Instant dosha classification' },
              { step: '3', title: 'Health Insights', desc: 'Comprehensive health scores' },
              { step: '4', title: 'Recommendations', desc: 'Personalized action plan' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <GlassmorphismCard className="p-6 text-center">
                  <div className="text-4xl font-bold text-cyan-500 mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">{item.desc}</p>
                </GlassmorphismCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <GlassmorphismCard className="p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to discover your health potential?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Create your personalized profile and receive instant AI-powered health insights based on your unique constitution.
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={() => router.push('/profile')}
              className="inline-block"
            >
              Get Started Now →
            </Button>

          </GlassmorphismCard>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 pt-12 border-t border-white/20 dark:border-slate-700/50 text-center text-gray-700 dark:text-gray-400 text-sm"
        >
          <p>
            © 2026 AYUSH Health Platform. Combining ancient wisdom with modern AI intelligence.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
