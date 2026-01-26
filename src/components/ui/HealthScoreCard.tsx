import React from 'react';
import { motion } from 'framer-motion';

interface HealthScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  label: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ title, score, icon, label }) => {
  const getColor = () => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="backdrop-blur-md bg-white/20 dark:bg-slate-800/30 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-lg p-6 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="text-3xl">{icon}</div>
      </div>

      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(200,200,200,0.2)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 - (score / 100) * 2 * Math.PI * 45}`}
            stroke="url(#gradient)"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 - (score / 100) * 2 * Math.PI * 45 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(6, 182, 212)" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.span
            className="text-3xl font-bold text-cyan-700 dark:text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-700 dark:text-gray-400">out of 100</span>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-gray-900 dark:text-gray-200">{label}</p>
    </motion.div>
  );
};
