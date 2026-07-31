import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Shield, BookOpen } from 'lucide-react';

// 🧭 Komponen Navigasi Utama: Penunjuk Jalan Menuju Keberhasilan Slay! ✨
export default function Navbar() {
  const { user, logout, activeTab, setActiveTab } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-11 sm:h-13 gap-3">

          {/* 🚀 Kiri: Logo & Nama Mahir Speaking */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => setActiveTab(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'tutor' ? 'tutor-dashboard' : 'student-dashboard') : 'home')}
          >
            <img
              src="/MP.png"
              alt="Mahir Speaking Logo"
              className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
            />
            <span className="font-stinger font-black text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              Mahir Speaking
            </span>
          </div>

          {/* 🎯 Tengah: Tombol Menu Navigasi Super Aesthetic */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-2 text-xs font-black text-slate-700">
            {!user ? (
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 sm:px-5 py-2 rounded-full transition-all ${activeTab === 'home'
                    ? 'bg-brand text-lime shadow-glow font-black scale-105'
                    : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                    }`}
                >
                  Home
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`px-4 sm:px-5 py-2 rounded-full transition-all ${activeTab === 'branding'
                    ? 'bg-brand text-lime shadow-glow font-black scale-105'
                    : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                    }`}
                >
                  Branding
                </button>

                <button
                  onClick={() => setActiveTab('lms')}
                  className={`px-4 sm:px-5 py-2 rounded-full transition-all flex items-center gap-1 ${activeTab === 'lms'
                    ? 'bg-brand text-lime shadow-glow font-black scale-105'
                    : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                    }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>LMS</span>
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard-public')}
                  className={`px-4 sm:px-5 py-2 rounded-full transition-all ${activeTab === 'leaderboard-public'
                    ? 'bg-brand text-lime shadow-glow font-black scale-105'
                    : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                    }`}
                >
                  Leaderboard
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`px-4 sm:px-5 py-2 rounded-full transition-all ${activeTab === 'pricing'
                    ? 'bg-brand text-lime shadow-glow font-black scale-105'
                    : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                    }`}
                >
                  Pricing
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
                {user.role === 'student' && (
                  <>
                    <button
                      onClick={() => setActiveTab('home')}
                      className={`px-4 py-2 rounded-full transition-all ${activeTab === 'home' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                        }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => setActiveTab('branding')}
                      className={`px-4 py-2 rounded-full transition-all ${activeTab === 'branding' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                        }`}
                    >
                      Branding
                    </button>
                    <button
                      onClick={() => setActiveTab('lms')}
                      className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${activeTab === 'lms' || activeTab === 'student-dashboard' || activeTab === 'learning-path' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                        }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>LMS & Progress</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className={`px-4 py-2 rounded-full transition-all ${activeTab === 'leaderboard' || activeTab === 'leaderboard-public' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                        }`}
                    >
                      Leaderboard
                    </button>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className={`px-4 py-2 rounded-full transition-all ${activeTab === 'pricing' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                        }`}
                    >
                      Pricing
                    </button>
                  </>
                )}

                {user.role === 'tutor' && (
                  <button
                    onClick={() => setActiveTab('tutor-dashboard')}
                    className={`px-4 py-2 rounded-full transition-all ${activeTab === 'tutor-dashboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                      }`}
                  >
                    Dashboard
                  </button>
                )}

                {user.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin-dashboard')}
                    className={`px-4 py-2 rounded-full transition-all ${activeTab === 'admin-dashboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                      }`}
                  >
                    Dashboard
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* 👑 Kanan: Tombol Panel Admin + Profile Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* 🛡️ Tombol Rahasia Admin Master */}
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all shadow-md flex items-center justify-center border-2 border-white group flex-shrink-0 hover:scale-105 cursor-pointer ${activeTab === 'admin-dashboard' || activeTab === 'manage-users' || activeTab === 'manage-packages'
                ? 'bg-brand text-lime shadow-glow'
                : 'bg-dark text-lime hover:bg-brand hover:text-white'
                }`}
              title="Panel Admin Master"
            >
              <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5] group-hover:scale-110 transition-transform" />
            </button>

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
