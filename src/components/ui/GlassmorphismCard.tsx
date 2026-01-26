import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  return (
    <div
      className={`
        backdrop-blur-md bg-white/20 dark:bg-slate-800/30 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-lg dark:shadow-slate-900/50
        ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
