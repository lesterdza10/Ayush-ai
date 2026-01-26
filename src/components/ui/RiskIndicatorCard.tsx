import React from 'react';
import { motion } from 'framer-motion';

interface RiskIndicatorCardProps {
  title: string;
  risk: 'low' | 'medium' | 'high';
  percentage: number;
  icon: React.ReactNode;
}

export const RiskIndicatorCard: React.FC<RiskIndicatorCardProps> = ({
  title,
  risk,
  percentage,
  icon,
}) => {
  const getRiskColor = () => {
    switch (risk) {
      case 'low':
        return 'bg-green-100/50 dark:bg-green-900/30 border-green-300/50 dark:border-green-700/50 text-green-700 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100/50 dark:bg-yellow-900/30 border-yellow-300/50 dark:border-yellow-700/50 text-yellow-700 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100/50 dark:bg-red-900/30 border-red-300/50 dark:border-red-700/50 text-red-700 dark:text-red-400';
    }
  };

  const getBarColor = () => {
    switch (risk) {
      case 'low':
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500';
      case 'high':
        return 'bg-gradient-to-r from-red-400 to-rose-500';
    }
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

      <div className={`rounded-lg p-3 mb-4 border-2 ${getRiskColor()}`}>
        <p className="font-bold text-sm capitalize">{risk} Risk</p>
        <p className="text-xs opacity-75">{percentage}% chance</p>
      </div>

      <div className="w-full h-2 bg-gray-300 dark:bg-slate-600 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};
