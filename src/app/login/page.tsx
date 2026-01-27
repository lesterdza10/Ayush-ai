'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { FormInput } from '@/components/ui/FormInput'; 
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Added for better UX
  const router = useRouter();

  // Change: Standardized the submit handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // This is crucial
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Invalid email or password");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <GlassmorphismCard className="p-8 border-cyan-200/50">
          <div className="text-center mb-8">
            <span className="text-4xl">🌿</span>
            <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400">Continue your wellness journey</p>
          </div>

          {/* Display error message if login fails */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(val) => setEmail(val as string)}
              placeholder="name@example.com"
              // required is already true inside your FormInput component
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(val) => setPassword(val as string)}
              placeholder="••••••••"
            />
            
            {/* Change: Removed onClick, added type="submit" */}
            <button
              className="w-full py-4 text-lg bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login to Platform'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? 
            <button 
              type="button" // Prevents this button from submitting the form
              onClick={() => router.push('/signup')} 
              className="ml-1 text-cyan-600 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </GlassmorphismCard>
      </motion.div>
    </div>
  );
}