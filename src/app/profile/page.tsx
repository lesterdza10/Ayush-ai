'use client';

import { useRouter } from 'next/navigation';
import { MultiStepProfileForm, ProfileData } from '@/components/forms/MultiStepProfileForm';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async (data: ProfileData) => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/login');
        return;
      }

      // Save to local storage immediately for the Profile View graph
      localStorage.setItem('tempProfileData', JSON.stringify(data));

      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });

      if (response.ok) {
        setIsSaved(true); // This tells us the data is safe in the DB
        console.log("Profile Saved to Database");
      }
    } catch (error) {
      console.error('Error saving:', error);
      isSubmitting.current = false;
    }
  };

  const downloadReport = () => {
    const data = localStorage.getItem('tempProfileData');
    if (!data) return;
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AYUSH_Health_Report_${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-slate-950">
      <MultiStepProfileForm onSubmit={handleSubmit} />

      {/* Floating Action Bar - Appears after the form is submitted */}
      {isSaved && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
          <Button variant="secondary" onClick={downloadReport} className="flex gap-2">
            <Download className="w-4 h-4" /> Download Report
          </Button>
          <Button variant="primary" onClick={() => router.push('/profile-view')} className="flex gap-2">
            View My Dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}