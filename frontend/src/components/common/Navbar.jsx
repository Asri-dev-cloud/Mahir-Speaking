import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Shield, BookOpen, Sparkles, Bot, Award, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout, activeTab, setActiveTab } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-1 transition-all">
      {/* Clean Ultra-Pro White Glass Navbar Container */}
      <div className="max-w-7xl mx-auto rounded-full px-4 sm:px-6 py-2 bg-white/95 backdrop-blur-2xl border-2 border-white shadow-popout">
        <div className="flex items-center justify-between h-12 sm:h-14 gap-3">
          
          {/* Left: Clean Logo & Bold Brand Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => setActiveTab(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'tutor' ? 'tutor-dashboard' : 'student-dashboard') : 'home')}
          >
            {/* Clean MP.png Logo Asset */}
            <div className="relative group-hover:scale-105 transition-transform flex-shrink-0">
              <img 
                src="/MP.png" 
                alt="Mahir Speaking Logo" 
                className="h-8 sm:h-10 w-auto object-contain" 
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime border border-dark"></span>
              </span>
            </div>

            {/* Bold Crisp Brand Title */}
            <div className="flex items-center">
              <span className="font-stinger font-black text-lg sm:text-2xl tracking-tight text-brand">
                MAHIR<span className="text-lime bg-dark px-2 py-0.5 rounded-lg ml-1.5 text-xs sm:text-sm font-black tracking-normal">SPEAKING</span>
              </span>
            </div>
          </div>

          {/* Center: Balanced Professional Links */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-2 text-xs font-black text-slate-700">
            {!user ? (
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-5 py-2 rounded-full transition-all ${
                    activeTab === 'home' 
                      ? 'bg-brand text-lime shadow-glow font-black scale-105' 
                      : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`px-5 py-2 rounded-full transition-all ${
                    activeTab === 'branding' 
                      ? 'bg-brand text-lime shadow-glow font-black scale-105' 
                      : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                  }`}
                >
                  Branding
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-5 py-2 rounded-full transition-all ${
                    activeTab === 'pricing' 
                      ? 'bg-brand text-lime shadow-glow font-black scale-105' 
                      : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                  }`}
                >
                  Pricing
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard-public')}
                  className={`px-5 py-2 rounded-full transition-all ${
                    activeTab === 'leaderboard-public' 
                      ? 'bg-brand text-lime shadow-glow font-black scale-105' 
                      : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                  }`}
                >
                  Leaderboard
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
                {user.role === 'student' && (
                  <>
                    <button
                      onClick={() => setActiveTab('student-dashboard')}
                      className={`px-4 py-2 rounded-full transition-all ${
                        activeTab === 'student-dashboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('learning-path')}
                      className={`px-4 py-2 rounded-full transition-all ${
                        activeTab === 'learning-path' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                      }`}
                    >
                      Learning Path
                    </button>
                    <button
                      onClick={() => setActiveTab('ai-chat')}
                      className={`px-4 py-2 rounded-full transition-all ${
                        activeTab === 'ai-chat' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                      }`}
                    >
                      AI Coach
                    </button>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className={`px-4 py-2 rounded-full transition-all ${
                        activeTab === 'leaderboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                      }`}
                    >
                      Leaderboard
                    </button>
                  </>
                )}

                {user.role === 'tutor' && (
                  <button
                    onClick={() => setActiveTab('tutor-dashboard')}
                    className={`px-4 py-2 rounded-full transition-all ${
                      activeTab === 'tutor-dashboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                    }`}
                  >
                    Dashboard
                  </button>
                )}

                {user.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin-dashboard')}
                    className={`px-4 py-2 rounded-full transition-all ${
                      activeTab === 'admin-dashboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                    }`}
                  >
                    Dashboard
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* Right: Direct Profile Icon Button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!user ? (
              <button
                onClick={() => setActiveTab('auth')}
                title="Masuk / Daftar"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-dark text-lime hover:bg-brand hover:text-white transition-all shadow-md flex items-center justify-center border-2 border-white group flex-shrink-0 hover:scale-105"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5] group-hover:scale-110 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 bg-slate-100 p-1 sm:pr-3 rounded-full border border-brand/30 cursor-pointer hover:border-brand transition-all"
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'} 
                    alt={user.full_name} 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-brand"
                  />
                  <span className="font-extrabold text-xs text-slate-900 hidden sm:inline">{user.full_name}</span>
                </div>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
