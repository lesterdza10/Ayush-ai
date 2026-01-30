'use client';

import { useRouter } from 'next/navigation';
import { MultiStepProfileForm, ProfileData } from '@/components/forms/MultiStepProfileForm';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { AuthHeader } from '@/components/ui/AuthHeader';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status } = useSession();

  const extractErrorMessage = async (response: Response) => {
    try {
      const data = await response.clone().json();
      if (typeof data === 'string') {
        return data;
      }
      const fieldErrors = data?.details?.fieldErrors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const messages = Object.entries(fieldErrors)
          .flatMap(([field, errors]) =>
            Array.isArray(errors) ? errors.map((err) => `${field}: ${err}`) : []
          )
          .filter(Boolean);
        if (messages.length) {
          const summary = messages.join(', ');
          return data?.error ? `${data.error} - ${summary}` : summary;
        }
      }
      return data?.error || data?.message || response.statusText;
    } catch {
      try {
        const text = await response.clone().text();
        return text || response.statusText;
      } catch {
        return response.statusText;
      }
    }
  };

  if (status === 'unauthenticated') {
    router.replace('/');
    return null;
  }

  if (status === 'loading') {
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

  const handleSubmit = async (data: ProfileData) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        throw new Error(message || 'Failed to save profile');
      }

      const recommendationResponse = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!recommendationResponse.ok) {
        const message = await extractErrorMessage(recommendationResponse);
        console.warn('Failed to persist recommendations:', message);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting profile:', error);
      const message = error instanceof Error ? error.message : 'Error submitting profile. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <AuthHeader />

      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
          <div className="rounded-xl bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-200 shadow-lg">
            {error}
          </div>
        </div>
      )}

      <MultiStepProfileForm onSubmit={handleSubmit} />
    </div>
  );
}
