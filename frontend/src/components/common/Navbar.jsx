import React from 'react'; // import library react
import { useAuth } from '../../context/AuthContext'; // import hook useAuth dari context AuthContext
import { User, LogOut, BookOpen, Shield } from 'lucide-react'; // import icon dari lucide-react

// Komponen Navigasi Utama: Menyediakan menu navigasi atas untuk berpindah halaman secara interaktif.
export default function Navbar() { //deklarasi Komponen Fungsi
  const { user, logout, activeTab, setActiveTab } = useAuth(); //object destructuring

  return ( //Mengembalikan JSX yang bakal jadi tampilan HTML di browser.
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-200/80 shadow-sm transition-all"> {/* tag header sebagai elemen paling atas dan akan selalu berada di posisi atas saat di scroll*/}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2"> {/* tag div untuk mengatur lebar dan jarak padding*/}
        <div className="flex items-center justify-between h-11 sm:h-13 gap-3"> {/* tag div untuk mengatur flexbox*/}

          {/* Kiri: Logo dan Nama Mahir Speaking */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => setActiveTab('home')}
            title="Ke Halaman Utama Mahir Speaking"
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

          {/* Tengah: Tombol Menu Navigasi */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-2 text-sm font-black text-slate-700">
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
                  Galeri
                </button>

                <button
                  onClick={() => setActiveTab('lms')}
                  className={`px-4 sm:px-5 py-2 rounded-full transition-all ${activeTab === 'lms'
                    ? 'bg-brand text-lime shadow-glow font-black scale-105'
                    : 'hover:text-brand hover:bg-white text-slate-700 font-bold'
                    }`}
                >
                  LMS & Quiz
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
                  Galeri
                </button>

                <button
                  onClick={() => setActiveTab('lms')}
                  className={`px-4 py-2 rounded-full transition-all ${['lms', 'learning-path', 'lesson-view'].includes(activeTab)
                    ? 'bg-brand text-lime shadow-glow font-black'
                    : 'hover:text-brand hover:bg-white'
                    }`}
                >
                  LMS & Quiz
                </button>

                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-4 py-2 rounded-full transition-all ${activeTab === 'leaderboard' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                    }`}
                >
                  Leaderboard
                </button>

                {user.role === 'student' && (
                  <>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className={`px-4 py-2 rounded-full transition-all ${activeTab === 'pricing' ? 'bg-brand text-lime shadow-glow font-black' : 'hover:text-brand hover:bg-white'
                        }`}
                    >
                      Pricing
                    </button>
                  </>
                )}

                {(user.role === 'admin' || user.email?.toLowerCase() === 'hartiniasri32@gmail.com' || user.admin_type) && (
                  <button
                    onClick={() => setActiveTab('admin-portal')}
                    className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'admin-portal' || activeTab === 'admin'
                        ? 'bg-slate-900 text-emerald-400 shadow-md font-black'
                        : 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white font-extrabold border border-emerald-500/30'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Admin Portal</span>
                  </button>
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
              </div>
            )}
          </nav>

          {/* Kanan: Profile Avatar & Actions */}
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
                {/* Tombol Admin Portal Khusus Mobile */}
                {(user.role === 'admin' || user.email?.toLowerCase() === 'hartiniasri32@gmail.com' || user.admin_type) && (
                  <button
                    onClick={() => setActiveTab('admin-portal')}
                    className={`lg:hidden p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer border ${
                      activeTab === 'admin-portal' || activeTab === 'admin'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Admin Portal"
                  >
                    <Shield className="w-4.5 h-4.5" />
                  </button>
                )}

                <div
                  onClick={() => setActiveTab('profile')}
                  title="Lihat & Edit Profil Saya"
                  className="flex items-center gap-2 bg-slate-100 p-1 sm:pr-3 rounded-full border border-brand/30 cursor-pointer hover:border-brand hover:bg-white transition-all shadow-sm group"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-brand"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand text-lime font-black text-xs flex items-center justify-center border-2 border-white uppercase shadow-sm">
                      {user.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="font-extrabold text-sm text-slate-900 hidden sm:inline group-hover:text-brand transition-colors">
                    {user.full_name}
                  </span>
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
