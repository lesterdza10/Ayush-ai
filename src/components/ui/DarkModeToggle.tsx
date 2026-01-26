'use client';

import React from 'react';
import { useDarkMode } from '@/providers/DarkModeProvider';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const DarkModeToggle: React.FC = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`
        p-3 rounded-xl transition-all duration-300
        ${
          isDark
            ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
        }
        border-2
        ${isDark ? 'border-slate-700' : 'border-slate-200'}
        shadow-lg hover:shadow-xl
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
};
