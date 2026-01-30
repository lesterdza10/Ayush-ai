'use client';

import { useRouter } from 'next/navigation';
import { MultiStepProfileForm, ProfileData } from '@/components/forms/MultiStepProfileForm';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const isSubmitting = useRef(false);

  const handleSubmit = async (data: ProfileData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    // --- CRITICAL SYNC FIX ---
    // We save to local storage IMMEDIATELY so the dashboard can see it 
    // before the database even finishes writing.
    localStorage.setItem('userProfile', JSON.stringify(data));
    localStorage.setItem('tempProfileData', JSON.stringify(data));

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });

      // Move to the visual dashboard immediately
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving:', error);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950">
      <MultiStepProfileForm onSubmit={handleSubmit} />
    </div>
  );
}