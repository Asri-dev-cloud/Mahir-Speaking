import React from 'react';
import { Sparkles, Heart, ArrowUpRight, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { setActiveTab } = useAuth();

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 pt-16 pb-28 md:pb-14 border-t-2 border-slate-800 relative overflow-hidden">
      
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* Col 1: Brand Info (5 cols) */}
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

            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              Platform ekosistem pembelajaran Bahasa Inggris terdepan yang dirancang untuk melatih kelancaran percakapan alami, kurikulum 4 level CEFR, dan bimbingan interaktif.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-lime pt-1">
              <ShieldCheck className="w-4 h-4 text-lime" />
              <span>Kurikulum Teruji & 100% Modul Orisinal</span>
            </div>
          </div>

          {/* Col 2: Navigasi Utama (3 cols) */}
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
                  <span>Branding & Metodologi</span>
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

          {/* Col 3: Level CEFR Kurikulum (4 cols) */}
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
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/90 text-center md:flex md:items-center md:justify-between text-xs text-slate-500 font-semibold space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} Mahir Speaking EdTech Inc. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center justify-center gap-1.5">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk seluruh pejuang kelancaran Bahasa Inggris.
          </p>
        </div>

      </div>
    </footer>
  );
}
