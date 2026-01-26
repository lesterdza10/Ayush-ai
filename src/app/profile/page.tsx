'use client';

import { useRouter } from 'next/navigation';
import { MultiStepProfileForm, ProfileData } from '@/components/forms/MultiStepProfileForm';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProfileData) => {
    setIsLoading(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('userProfile', JSON.stringify(data));
      
      // In production, this would be an API call
      // const response = await fetch('/api/users/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Error submitting profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <DarkModeToggle />
      </div>

      {/* Back to Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => router.push('/')}
        >
          ← Home
        </Button>
      </div>
      
      <MultiStepProfileForm onSubmit={handleSubmit} />
    </div>
  );
}
