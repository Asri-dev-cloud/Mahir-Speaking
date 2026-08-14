import React from 'react';
import { Sparkles, Heart, ArrowUpRight, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Komponen Footer: Menampilkan bagian kaki halaman dengan struktur menu navigasi utama, tingkat kurikulum CEFR, logo, dan hak cipta platform.
export default function Footer() {
  const { setActiveTab } = useAuth();

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 pt-16 pb-28 md:pb-14 border-t-2 border-slate-800 relative overflow-hidden">

      {/* Efek Gradasi Latar Belakang (Ambient Glow) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Tata Letak Kolom Kaki Halaman (Footer Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Kolom 1: Informasi Logo & Deskripsi Brand Singkat */}
          <div className="md:col-span-5 space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer group w-fit"
              onClick={() => setActiveTab('home')}
            >
              <img
                src="/MP.png"
                alt="Mahir Speaking Logo"
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-stinger font-black text-xl text-white tracking-tight">
                Mahir Speaking
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
              Platform pembelajaran Bahasa Inggris yang dirancang untuk melatih kelancaran
              percakapan alami, berbasis kekuatan (potensi) unik personal. Berorientasi untuk
              hasil belajar yang lebih efektif dan menyenangkan, dengan kurikulum 6 level CEFR
              dan bimbingan intensif.
            </p>

          </div>

          {/* Kolom 2: Navigasi Utama */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-stinger font-black text-white text-xs uppercase tracking-widest text-lime">
              Navigasi Utama
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-lime transition-colors flex items-center gap-1.5">
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('branding')} className="hover:text-lime transition-colors flex items-center gap-1.5">
                  <span>Galeri & Metodologi</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lms')} className="hover:text-lime transition-colors flex items-center gap-1.5">
                  <span>LMS Kurikulum & Free Quiz</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('leaderboard-public')} className="hover:text-lime transition-colors flex items-center gap-1.5">
                  <span>Global Leaderboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pricing')} className="hover:text-lime transition-colors flex items-center gap-1.5">
                  <span>Paket Berlangganan (Pricing)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Level CEFR Kurikulum */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-stinger font-black text-white text-xs uppercase tracking-widest text-lime">
              Tingkat Pembelajaran
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>A1 • Everyday Conversation & Icebreakers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                <span>A2 • Daily Socializing & Expressing Opinionss</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>B1 • Business English & Pitching</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>B2 • IELTS Speaking 7.0+ Mastery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>C1 • Confident Stage Public Speaking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span>C2 • Academic Writing & Professional Communication</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/90 text-center md:flex md:items-center md:justify-between text-xs text-slate-500 font-semibold space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} Mahir Speaking</p>
        </div>

      </div>
    </footer>
  );
}
