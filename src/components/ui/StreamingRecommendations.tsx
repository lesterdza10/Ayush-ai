'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StreamingRecommendationsProps {
  profileData: any;
  onComplete?: (recommendations: string) => void;
}

export function StreamingRecommendations({
  profileData,
  onComplete,
}: StreamingRecommendationsProps) {
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: `HTTP ${response.status}` };
          }
          throw new Error(
            errorData.details || errorData.error || 'Failed to generate recommendations'
          );
        }

        const data = await response.json();
        setRecommendations(data.recommendations);

        if (onComplete) {
          onComplete(data.recommendations);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error generating recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [profileData, onComplete]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4"
      >
        <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
          Error Generating Recommendations
        </h3>
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        <p className="text-xs text-red-600 dark:text-red-500 mt-2">
          Make sure you have added your Gemini API key to .env.local:
          <br />
          <code className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded">
            GEMINI_API_KEY=your-gemini-api-key
          </code>
          <br />
          Get your key at: <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline">https://aistudio.google.com/apikey</a>
        </p>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: 0,
              }}
              className="w-2 h-2 bg-cyan-500 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: 0.15,
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: 0.3,
              }}
              className="w-2 h-2 bg-cyan-500 rounded-full"
            />
          </div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Analyzing your health profile with AI...
          </span>
        </div>
        {/* Skeleton loaders */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border border-cyan-200 dark:border-cyan-500/30 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-2xl">✨</span>
          Your Personalized AI Health Insights
        </h2>

        <div className="prose dark:prose-invert prose-sm max-w-none">
          <div className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap leading-relaxed text-sm">
            {recommendations
              .split('\n')
              .map((line, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`${
                    line.startsWith('#') ? 'font-bold text-base mt-4 mb-2' : ''
                  } ${
                    line.startsWith('**')
                      ? 'font-semibold text-cyan-600 dark:text-cyan-400 mt-3 mb-1'
                      : ''
                  } ${line.startsWith('-') ? 'ml-4' : ''}`}
                >
                  {line}
                </motion.p>
              ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 pt-2"
      >
        <button
          onClick={() => window.location.reload()}
          className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-300/30 hover:bg-cyan-500/20 transition-colors text-sm font-medium"
        >
          Regenerate Analysis
        </button>
        <button
          onClick={() => {
            // Copy to clipboard
            navigator.clipboard.writeText(recommendations);
            alert('Recommendations copied to clipboard!');
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-300/30 hover:bg-cyan-500/20 transition-colors text-sm font-medium"
        >
          Copy Report
        </button>
      </motion.div>
    </motion.div>
  );
}
