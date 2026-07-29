import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Home, Sparkles, Bot, Bookmark, User } from 'lucide-react';

export default function MobileNav() {
  const { user, activeTab, setActiveTab } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2 px-3">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'tutor' ? 'tutor-dashboard' : 'student-dashboard') : 'home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 transition-all cursor-pointer group ${
            ['home', 'student-dashboard', 'tutor-dashboard', 'admin-dashboard'].includes(activeTab)
              ? 'text-emerald-600 font-black scale-105'
              : 'text-slate-500 hover:text-emerald-600 font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['home', 'student-dashboard', 'tutor-dashboard', 'admin-dashboard'].includes(activeTab)
              ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-300'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-emerald-600'
          }`}>
            <Home className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Tab 2: LMS */}
        <button
          onClick={() => setActiveTab('lms')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 transition-all cursor-pointer group ${
            ['lms', 'learning-path', 'lesson-view'].includes(activeTab)
              ? 'text-emerald-600 font-black scale-105'
              : 'text-slate-500 hover:text-emerald-600 font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['lms', 'learning-path', 'lesson-view'].includes(activeTab)
              ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-300'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-emerald-600'
          }`}>
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">LMS</span>
        </button>

        {/* Tab 3: AI Coach */}
        <button
          onClick={() => setActiveTab(user ? 'ai-chat' : 'auth')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 transition-all cursor-pointer group ${
            activeTab === 'ai-chat' 
              ? 'text-emerald-600 font-black scale-105' 
              : 'text-slate-500 hover:text-emerald-600 font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors relative ${
            activeTab === 'ai-chat'
              ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-300'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-emerald-600'
          }`}>
            <Bot className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          </div>
          <span className="text-[10px] tracking-tight">AI Coach</span>
        </button>

        {/* Tab 4: Branding */}
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 transition-all cursor-pointer group ${
            activeTab === 'branding' 
              ? 'text-emerald-600 font-black scale-105' 
              : 'text-slate-500 hover:text-emerald-600 font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            activeTab === 'branding'
              ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-300'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-emerald-600'
          }`}>
            <Bookmark className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">Branding</span>
        </button>

        {/* Tab 5: Akun / Masuk */}
        <button
          onClick={() => setActiveTab(user ? 'profile' : 'auth')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 transition-all cursor-pointer group ${
            ['profile', 'auth', 'login', 'register'].includes(activeTab)
              ? 'text-emerald-600 font-black scale-105'
              : 'text-slate-500 hover:text-emerald-600 font-semibold'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            ['profile', 'auth', 'login', 'register'].includes(activeTab)
              ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-300'
              : 'group-hover:bg-slate-100 text-slate-600 group-hover:text-emerald-600'
          }`}>
            <User className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight">{user ? 'Akun' : 'Masuk'}</span>
        </button>

      </div>
    </nav>
  );
}
