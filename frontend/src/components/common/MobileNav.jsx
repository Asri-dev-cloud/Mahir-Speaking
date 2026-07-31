import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Sparkles, Layers, Trophy, User } from 'lucide-react';

// 📱 Navigasi Bawah Layar HP: Si Mungil Penyelamat Pengguna Mobile~ 🤳
export default function MobileNav() {
  const { user, activeTab, setActiveTab } = useAuth();

  // 🚀 Pindah tab plus auto-scroll ke paling atas biar jempol gak pegel bestie!
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    const forceScroll = () => {
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const root = document.getElementById('root');
      if (root) root.scrollTop = 0;
      const main = document.querySelector('main');
      if (main) main.scrollTop = 0;
    };
    forceScroll();
    requestAnimationFrame(forceScroll);
    setTimeout(forceScroll, 10);
    setTimeout(forceScroll, 100);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1.5 px-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 🏠 Tab 1: Home Utama */}
        <button
          onClick={() => handleTabClick(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'tutor' ? 'tutor-dashboard' : 'student-dashboard') : 'home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all cursor-pointer group ${
            ['home', 'student-dashboard', 'tutor-dashboard', 'admin-dashboard'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-brand font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['home', 'student-dashboard', 'tutor-dashboard', 'admin-dashboard'].includes(activeTab)
              ? 'bg-brand text-lime shadow-sm'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-brand'
          }`}>
            <Home className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 🎨 Tab 2: Showcase Branding */}
        <button
          onClick={() => handleTabClick('branding')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all cursor-pointer group ${
            activeTab === 'branding' 
              ? 'text-brand font-black scale-105' 
              : 'text-slate-500 hover:text-brand font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            activeTab === 'branding'
              ? 'bg-brand text-lime shadow-sm'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-brand'
          }`}>
            <Layers className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Branding</span>
        </button>

        {/* ✨ Tab 3: Pusat Belajar LMS */}
        <button
          onClick={() => handleTabClick('lms')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all cursor-pointer group ${
            ['lms', 'learning-path', 'lesson-view'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-brand font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['lms', 'learning-path', 'lesson-view'].includes(activeTab)
              ? 'bg-brand text-lime shadow-sm'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-brand'
          }`}>
            <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">LMS</span>
        </button>

        {/* 🏆 Tab 4: Papan Juara Leaderboard */}
        <button
          onClick={() => handleTabClick(user ? 'leaderboard' : 'leaderboard-public')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all cursor-pointer group ${
            ['leaderboard', 'leaderboard-public'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-brand font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['leaderboard', 'leaderboard-public'].includes(activeTab)
              ? 'bg-brand text-lime shadow-sm'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-brand'
          }`}>
            <Trophy className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Rank</span>
        </button>

        {/* 👤 Tab 5: Profil Akun Pengguna / Pintu Masuk */}
        <button
          onClick={() => handleTabClick(user ? 'profile' : 'auth')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 transition-all cursor-pointer group ${
            ['profile', 'auth', 'login', 'register'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-brand font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['profile', 'auth', 'login', 'register'].includes(activeTab)
              ? 'bg-brand text-lime shadow-sm'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-brand'
          }`}>
            <User className="w-4.5 h-4.5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">{user ? 'Akun' : 'Masuk'}</span>
        </button>

      </div>
    </nav>
  );
}
