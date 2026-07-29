import React from 'react';
import { Mic, Globe, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { setActiveTab } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-electric">
                <Mic className="w-5 h-5" />
              </div>
              <span className="font-stinger font-extrabold text-2xl text-white">
                MAHIR<span className="text-amberIcon ml-1 font-normal">SPEAKING</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering global learners to speak English with authentic fluency, natural pronunciation, and AI-powered personalized coaching.
            </p>
            <div className="flex items-center gap-3 text-xs text-amberIcon font-semibold pt-2">
              <Sparkles className="w-4 h-4" /> 100% Original Learning Materials
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-stinger font-bold text-white mb-4 text-base tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amberIcon transition-colors">Home</button></li>
              <li><button onClick={() => setActiveTab('portfolio')} className="hover:text-amberIcon transition-colors">Portfolio & Showcase</button></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-amberIcon transition-colors">Pricing Packages</button></li>
              <li><button onClick={() => setActiveTab('leaderboard-public')} className="hover:text-amberIcon transition-colors">Global Leaderboard</button></li>
            </ul>
          </div>

          {/* Col 3: Learning Paths */}
          <div>
            <h4 className="font-stinger font-bold text-white mb-4 text-base tracking-wider uppercase">Speaking Paths</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-slate-400">A1 - Everyday Conversation</li>
              <li className="text-slate-400">B1 - Business English & Pitching</li>
              <li className="text-slate-400">B2 - IELTS Speaking 7.0+</li>
              <li className="text-slate-400">C1 - Confident Public Speaking</li>
            </ul>
          </div>


        </div>

        <div className="pt-8 border-t border-slate-800/80 text-center md:flex md:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Mahir Speaking EdTech Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center justify-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for passionate English learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
