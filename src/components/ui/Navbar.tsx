'use client';
import { useRouter } from 'next/navigation';

export const Navbar = ({ user }: { user: { name: string } }) => {
  const router = useRouter();
  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 sticky top-0 z-50">
      <div className="text-2xl font-bold text-cyan-600">🌿 AYUSH</div>
      
      <button 
        onClick={() => router.push('/profile')}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform"
      >
        {initial}
      </button>
    </nav>
  );
};