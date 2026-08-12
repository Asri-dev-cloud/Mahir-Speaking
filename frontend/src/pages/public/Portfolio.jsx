// Halaman Portfolio: Menyajikan portofolio keberhasilan alumni, cerita sukses, diagnosis suara, dan tingkat perkembangan kemampuan berbicara bahasa Inggris.
import React from 'react';
import { Award, Volume2, Star, CheckCircle2, Mic, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Portfolio() {
  const { setActiveTab } = useAuth();

  // Daftar cerita sukses (success stories) siswa alumni untuk memberikan inspirasi dan pembuktian performa.
  const successStories = [
    {
      name: "Rian Pratama",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      fromScore: "A2 Elementary",
      toScore: "C1 Advanced",
      quote: "Before Mahir Speaking, I froze whenever I had to present to global clients. The daily AI voice diagnostics and PREP method gave me the confidence to land an international remote job!",
      recordingSample: "Hello everyone, today I want to share how active English practice transformed my engineering career."
    },
    {
      name: "Nadia Putri",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250",
      fromScore: "IELTS 5.5",
      toScore: "IELTS 7.5 Speaking",
      quote: "The IELTS Speaking Intensive module was a total game-changer. The 1-on-1 native tutor feedback corrected my intonation flaws that I never noticed before.",
      recordingSample: "In my perspective, effective digital marketing requires deep cultural understanding and fluent communication."
    },
    {
      name: "Budi Santoso",
      role: "University Student",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
      fromScore: "Beginner",
      toScore: "B2 Intermediate",
      quote: "I love the gamified XP leaderboard and daily streak system. Practicing 15 minutes every morning with the AI Chat assistant felt like playing a game!",
      recordingSample: "I am excited to continue my journey towards fluent English public speaking."
    }
  ];

  // Memutar contoh sampel rekaman suara bahasa Inggris siswa dengan Web Speech API.
  const playVoiceSample = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
          <Award className="w-4 h-4 text-amberIcon" /> Student Transformations Showcase
        </div>
        <h1 className="font-stinger text-4xl sm:text-5xl font-black text-brand">
          Real Results from Real Learners
        </h1>
        <p className="text-slate-700 text-base sm:text-lg">
          Listen to authentic audio transformations achieved by Mahir Speaking students across Indonesia.
        </p>
      </div>

      {/* Success Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {successStories.map((story, index) => (
          <div key={index} className="glass-panel p-8 rounded-3xl border border-white flex flex-col justify-between space-y-6 shadow-sm hover:shadow-glow transition-all">
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-brand" />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{story.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{story.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-brand/10 p-2.5 rounded-xl text-xs font-extrabold text-brand justify-between">
                <span>Before: {story.fromScore}</span>
                <span>➜</span>
                <span className="text-emerald-700">After: {story.toScore}</span>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed italic">
                "{story.quote}"
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Audio Transformation Sample</span>
                <div className="flex text-amberIcon"><Star className="w-3.5 h-3.5 fill-amberIcon" /><Star className="w-3.5 h-3.5 fill-amberIcon" /><Star className="w-3.5 h-3.5 fill-amberIcon" /><Star className="w-3.5 h-3.5 fill-amberIcon" /><Star className="w-3.5 h-3.5 fill-amberIcon" /></div>
              </div>

              <button
                onClick={() => playVoiceSample(story.recordingSample)}
                className="w-full py-2.5 rounded-xl bg-brand text-electric font-bold text-xs flex items-center justify-center gap-2 hover:bg-brand-600 transition-all shadow-sm"
              >
                <Volume2 className="w-4 h-4" /> Listen to Audio Sample
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white text-center space-y-6">
        <h2 className="font-stinger text-3xl font-extrabold text-brand">Want to be our next success story?</h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Start your personalized speaking journey with instant voice diagnostics and AI coaching.
        </p>
        <button
          onClick={() => setActiveTab('register')}
          className="px-8 py-3.5 rounded-2xl bg-brand text-electric font-black text-base shadow-glow hover:scale-105 transition-transform"
        >
          Join Mahir Speaking Today
        </button>
      </div>

    </div>
  );
}
