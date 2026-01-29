'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('userId')) {
      router.push('/home'); // Auto-skip if already logged in
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <span className="text-7xl mb-6">🌿</span>
      <h1 className="text-6xl font-black mb-6">AYUSH AI</h1>
      <p className="text-xl mb-10">Ancient Wisdom, Modern Intelligence.</p>
      <Button size="lg" onClick={() => router.push('/login')}>
        Enter the Platform
      </Button>
    </div>
  );
}