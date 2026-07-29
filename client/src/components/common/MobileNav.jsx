import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Sparkles, Bot, Trophy, User } from 'lucide-react';

export default function MobileNav() {
  const { user, activeTab, setActiveTab } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-brand/20 shadow-2xl py-2 px-2">
      <div className="flex items-center justify-around">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab(user ? 'student-dashboard' : 'home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            ['home', 'student-dashboard', 'tutor-dashboard', 'admin-dashboard'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Tab 2: Branding */}
        <button
          onClick={() => setActiveTab(user ? 'learning-path' : 'branding')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            ['branding', 'learning-path', 'lesson-view'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-5 h-5 stroke-[2.5] text-brand" />
          <span className="text-[10px] font-bold">{user ? 'Path' : 'Branding'}</span>
        </button>

        {/* Tab 3: AI Chat */}
        <button
          onClick={() => setActiveTab(user ? 'ai-chat' : 'auth')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'ai-chat' ? 'text-brand font-black scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amberIcon stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-lime rounded-full animate-ping"></span>
          </div>
          <span className="text-[10px] font-bold">AI Coach</span>
        </button>

        {/* Tab 4: Leaderboard */}
        <button
          onClick={() => setActiveTab(user ? 'leaderboard' : 'leaderboard-public')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            ['leaderboard', 'leaderboard-public'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] font-bold">Rank</span>
        </button>

        {/* Tab 5: Profile / Auth */}
        <button
          onClick={() => setActiveTab(user ? 'profile' : 'auth')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            ['profile', 'auth', 'login', 'register'].includes(activeTab)
              ? 'text-brand font-black scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] font-bold">{user ? 'Akun' : 'Masuk'}</span>
        </button>

      </div>
    </div>
  );
}
