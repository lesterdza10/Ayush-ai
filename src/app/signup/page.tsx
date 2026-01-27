'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassmorphismCard } from '@/components/ui/GlassmorphismCard';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login?message=Account created successfully');
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassmorphismCard className="p-8 border-green-200/50">
          <div className="text-center mb-6">
            <span className="text-4xl">🌱</span>
            <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Join the AYUSH Health community</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <FormInput
              label="Full Name"
              value={formData.name}
              onChange={(val) => setFormData({...formData, name: val as string})}
              placeholder="John Doe"
            />
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(val) => setFormData({...formData, email: val as string})}
              placeholder="john@example.com"
            />
            <FormInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(val) => setFormData({...formData, password: val as string})}
              placeholder="••••••••"
            />
            <FormInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(val) => setFormData({...formData, confirmPassword: val as string})}
              placeholder="••••••••"
              error={error}
            />
            
            <button 
              className="w-full py-4 mt-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up Now'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account? 
            <button onClick={() => router.push('/login')} className="ml-1 text-cyan-600 font-semibold hover:underline">
              Login here
            </button>
          </p>
        </GlassmorphismCard>
      </motion.div>
    </div>
  );
}