import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Mic, Sparkles, Zap, Shield, Trophy, CheckCircle, ArrowRight, ArrowUpRight, Play, Volume2, 
  ChevronDown, ChevronUp, Star, Users, Check, Music, Coffee, Briefcase, Target, Lightbulb
} from 'lucide-react';

export default function Home() {
  const { setActiveTab, user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Interactive Audio Synthesis
  const handlePlayDemo = (textToSpeak) => {
    const text = textToSpeak || "Welcome to Mahir Speaking! Start practicing your English speaking confidence today with AI coach and native tutors.";
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      setIsPlayingDemo(true);
      utterance.onend = () => setIsPlayingDemo(false);
      utterance.onerror = () => setIsPlayingDemo(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingDemo(true);
      setTimeout(() => setIsPlayingDemo(false), 4000);
    }
  };

  const scenarios = [
    {
      title: "Ordering Coffee at a Cafe",
      level: "A1 Beginner",
      icon: Coffee,
      transcript: "Hi, could I please get an iced oat milk latte with an extra shot of espresso?",
      aiTip: "Gunakan 'Could I please get...' untuk percakapan alami dan sopan."
    },
    {
      title: "Job Interview Pitch",
      level: "B1 Intermediate",
      icon: Briefcase,
      transcript: "I have over 4 years of experience leading software development teams and driving scalable impact.",
      aiTip: "Tunjukkan pencapaian utama Anda menggunakan metode PREP."
    },
    {
      title: "IELTS Cue Card Monologue",
      level: "B2 Upper Intermediate",
      icon: Target,
      transcript: "I would like to describe a memorable journey I took to Bali last summer, which profoundly shaped my perspective.",
      aiTip: "Gunakan kata sifat kaya seperti 'profoundly' dan 'memorable' untuk skor Band 7.5+."
    }
  ];

  const faqs = [
    {
      q: "Apa yang membuat Mahir Speaking sangat efektif?",
      a: "Mahir Speaking menggabungkan latihan suara interaktif (Web Speech AI), player audio bergaya bento, tutor native 1-on-1, dan sistem gamifikasi XP yang membuat belajar terasa menyenangkan."
    },
    {
      q: "Bagaimana AI Coach membantu saya berbicara lebih lancar?",
      a: "AI Coach bertindak sebagai partner bicara 24/7. AI mengoreksi tata bahasa secara otomatis, memperdengarkan suara native, dan memberikan rekomendasi frasa alami."
    },
    {
      q: "Apakah platform ini responsif di HP?",
      a: "Sangat responsif! Tampilan dirancang khusus Mobile-First dengan navigasi bawah interaktif dan kontrol perekam suara sekali tekan."
    },
    {
      q: "Apa keunggulan Paket Premium VIP?",
      a: "Akses AI Chat & Voice TANPA BATAS 24/7, 8 sesi privat tutor native per bulan, simulasi tes IELTS/TOEFL, serta badge terverifikasi di leaderboard."
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12 overflow-hidden">
      
      {/* SECTION 1: EDITORIAL HIGH-IMPACT HERO (INSPIRED BY REFERENCE DESIGN) */}
      <section className="relative pt-4 sm:pt-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Creative Hero Box (7 cols) - Giant Bold Electric Typography */}
          <div className="lg:col-span-7 bento-card-royal p-6 sm:p-12 rounded-3xl sm:rounded-5xl relative overflow-hidden flex flex-col justify-between space-y-6 border-4 border-white shadow-popout">
            
            {/* Top Starburst Badge & Subhead */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 bg-lime text-dark px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-dark">
                <span>✦ Premier English EdTech</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 text-lime flex items-center justify-center font-black border border-white/20">
                ✦
              </div>
            </div>

            {/* Giant Bold Headline (Like Creative Agency Reference) */}
            <div className="space-y-2 py-2">
              <h1 className="font-helios text-4xl sm:text-7xl font-black text-white leading-[0.95] tracking-tight uppercase">
                SPEAK <br />
                <span className="text-lime font-black tracking-normal">ENGLISH</span> <br />
                <span className="text-electric font-black italic">FLUENTLY!</span>
              </h1>

              <p className="text-slate-200 text-xs sm:text-lg font-semibold max-w-xl leading-relaxed pt-2">
                Kuasai percakapan bahasa Inggris percaya diri dengan umpan balik AI suara otomatis, tutor native, dan latihan bento interaktif.
              </p>
            </div>

            {/* Embedded Hero Image Showcase (hero1.png) */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-lime/60 shadow-2xl group my-2">
              <img 
                src="/hero1.png" 
                alt="Mahir Speaking Showcase" 
                className="w-full h-44 sm:h-56 object-cover object-center group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab(user ? 'student-dashboard' : 'auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-105 transition-all flex items-center justify-center gap-3 border-2 border-dark"
              >
                <span>{user ? 'Buka Student Dashboard' : 'Mulai Latihan Bebas'}</span>
                <div className="w-6 h-6 rounded-full bg-dark text-lime flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 text-white font-black text-xs sm:text-sm border-2 border-white/30 hover:bg-white/20 transition-all text-center"
              >
                Lihat Paket Spesial
              </button>
            </div>

            {/* Bottom Stats Row */}
            <div className="pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-center sm:text-left text-white">
              <div>
                <div className="font-stinger font-black text-lg sm:text-3xl text-lime">50.000+</div>
                <div className="text-[9px] sm:text-xs text-slate-300 font-extrabold uppercase tracking-wider">Siswa Aktif</div>
              </div>
              <div>
                <div className="font-stinger font-black text-lg sm:text-3xl text-electric">4.9 / 5.0</div>
                <div className="text-[9px] sm:text-xs text-slate-300 font-extrabold uppercase tracking-wider">Rating Kepuasan</div>
              </div>
              <div>
                <div className="font-stinger font-black text-lg sm:text-3xl text-lime">98%</div>
                <div className="text-[9px] sm:text-xs text-slate-300 font-extrabold uppercase tracking-wider">Kenaikan Kelancaran</div>
              </div>
            </div>

          </div>

          {/* Side Interactive AI Voice Demo Card (5 cols) - RAW 1.PNG BACKGROUND */}
          <div 
            className="lg:col-span-5 p-6 sm:p-8 rounded-3xl sm:rounded-5xl border-4 border-white flex flex-col justify-between space-y-6 shadow-popout relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-[480px]"
            style={{ backgroundImage: "url('/1.png')" }}
          >
            <div className="space-y-4 relative z-10">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-dark/90 px-3 py-1 rounded-full border border-white/30 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime animate-ping"></span>
                  <span className="text-xs font-black uppercase text-white tracking-wider">AI Voice Coach Demo</span>
                </div>
                <span className="bg-amberIcon text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase shadow-md">
                  Interaktif
                </span>
              </div>

              {/* Speech Sound Box */}
              <div className="bg-dark/90 text-white p-4 sm:p-5 rounded-3xl space-y-3 shadow-2xl border border-white/30 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono text-lime font-bold">
                  <span className="flex items-center gap-1.5"><Music className="w-4 h-4 text-lime" /> Live Speaking Drill</span>
                  <span className="bg-lime/20 text-lime px-2 py-0.5 rounded text-[10px]">{scenarios[activeScenario].level}</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-100 italic bg-slate-950/85 p-3.5 rounded-2xl border border-slate-800 leading-relaxed">
                  "{scenarios[activeScenario].transcript}"
                </p>
                
                {/* Audio Wave Visualizer */}
                <div className="flex items-center justify-center gap-1.5 py-1.5">
                  <div className={`w-1.5 bg-lime rounded-full ${isPlayingDemo ? 'animate-soundwave-1' : 'h-3'}`}></div>
                  <div className={`w-1.5 bg-electric rounded-full ${isPlayingDemo ? 'animate-soundwave-2' : 'h-6'}`}></div>
                  <div className={`w-1.5 bg-white rounded-full ${isPlayingDemo ? 'animate-soundwave-3' : 'h-8'}`}></div>
                  <div className={`w-1.5 bg-amberIcon rounded-full ${isPlayingDemo ? 'animate-soundwave-4' : 'h-4'}`}></div>
                  <div className={`w-1.5 bg-lime rounded-full ${isPlayingDemo ? 'animate-soundwave-2' : 'h-7'}`}></div>
                </div>
              </div>

              <button
                onClick={() => handlePlayDemo(scenarios[activeScenario].transcript)}
                className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2.5 transition-all border-2 border-dark/40 ${
                  isPlayingDemo ? 'bg-amberIcon text-dark shadow-goldGlow' : 'bg-lime text-dark hover:bg-electric shadow-limeGlow'
                }`}
              >
                {isPlayingDemo ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-spin" />
                    <span>AI Coach Sedang Bicara...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-dark" />
                    <span>Klik Untuk Dengar Suara Native</span>
                  </>
                )}
              </button>
            </div>

            {/* Pronunciation Score */}
            <div className="bg-emerald-950/90 border border-emerald-400/50 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between text-white relative z-10 backdrop-blur-md shadow-xl">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-lime flex-shrink-0" />
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-300">Skor Pengucapan AI</div>
                  <div className="text-xs font-black text-lime">96 / 100 (Sangat Lancar)</div>
                </div>
              </div>
              <span className="text-[10px] font-black bg-lime text-dark px-2 py-0.5 rounded">Lulus</span>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: HIGH-ENERGY MARQUEE TICKER BANNER (INSPIRED BY REFERENCE DESIGN) */}
      <div className="w-full bg-lime border-y-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md">
        <div className="inline-flex items-center gap-8 font-stinger font-black text-sm sm:text-xl text-dark tracking-wider uppercase animate-pulse">
          <span>BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS PITCH ✦ PREP METHODOLOGY ✦</span>
          <span>BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS PITCH ✦ PREP METHODOLOGY ✦</span>
        </div>
      </div>

      {/* SECTION 3: EDITORIAL BENTO GRID WITH ARROW ACTION BADGES (↗) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-900 pb-4">
          <div>
            <span className="text-xs font-black text-brand uppercase tracking-widest">✦ CREATIVE LEARNING MODULES</span>
            <h2 className="font-helios text-3xl sm:text-5xl font-black text-slate-900 uppercase">
              DESIGNED FOR SEAMLESS FLUENCY.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bento-card p-6 sm:p-8 rounded-3xl sm:rounded-5xl space-y-6 border-4 border-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400">01 / FEATURE</span>
                <div className="w-10 h-10 rounded-full bg-brand text-lime flex items-center justify-center font-black group-hover:bg-lime group-hover:text-dark transition-colors">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <h3 className="font-helios font-black text-2xl text-slate-900 uppercase">DIAGNOSTIK SUARA AI</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                Analisis otomatis untuk pengucapan, intonasi, ritme bicara, dan tata bahasa setiap kali Anda berlatih suara.
              </p>
            </div>
          </div>

          <div className="bento-card-lime p-6 sm:p-8 rounded-3xl sm:rounded-5xl space-y-6 border-4 border-dark flex flex-col justify-between shadow-limeGlow group">
            <div className="space-y-4 text-dark">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-dark/70">02 / NATIVE MENTOR</span>
                <div className="w-10 h-10 rounded-full bg-dark text-lime flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <h3 className="font-helios font-black text-2xl uppercase">TUTOR NATIVE 1-ON-1</h3>
              <p className="text-dark/90 text-xs sm:text-sm leading-relaxed font-extrabold">
                Sesi privat langsung dengan tutor native tersertifikasi untuk latihan wawancara kerja, ujian IELTS, dan negosiasi bisnis.
              </p>
            </div>
          </div>

          <div className="bento-card p-6 sm:p-8 rounded-3xl sm:rounded-5xl space-y-6 border-4 border-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400">03 / GAMIFICATION</span>
                <div className="w-10 h-10 rounded-full bg-amberIcon text-white flex items-center justify-center font-black group-hover:bg-brand transition-colors">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <h3 className="font-helios font-black text-2xl text-slate-900 uppercase">GAMIFIKASI XP & STREAK</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                Kumpulkan poin XP, pertahankan streak belajar harian, buka badge unik, dan naik ke podium teratas siswa dunia.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: PRICING PACKAGES BENTO */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <h2 className="font-helios text-3xl sm:text-5xl font-black text-brand uppercase">
            Pilihan Paket Langganan
          </h2>
          <p className="text-slate-700 font-bold text-xs sm:text-base">
            Pilih paket yang paling sesuai dengan target belajar Anda.
          </p>

          <div className="inline-flex items-center bg-white p-1.5 rounded-full border border-slate-200 shadow-sm mt-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${
                billingCycle === 'monthly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1 ${
                billingCycle === 'yearly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              <span>Tahunan</span>
              <span className="bg-lime text-dark text-[9px] font-black px-1 py-0.2 rounded">HEMAT 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Basic */}
          <div className="bento-card p-6 sm:p-8 rounded-3xl sm:rounded-5xl flex flex-col justify-between space-y-6 border-2 border-white">
            <div className="space-y-4">
              <span className="bg-slate-200 text-slate-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Basic</span>
              <h3 className="font-stinger font-black text-2xl text-slate-900">Basic Starter</h3>
              <div className="pt-2">
                <span className="font-stinger text-3xl sm:text-4xl font-black text-brand">
                  {billingCycle === 'yearly' ? 'Rp 79.000' : 'Rp 99.000'}
                </span>
                <span className="text-xs text-slate-500 font-bold"> / bulan</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t font-semibold">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Akses Modul Dasar A1</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 10 Pesan AI Chat / Hari</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Leaderboard Komunitas</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab(user ? 'my-package' : 'auth')}
              className="w-full py-3.5 rounded-2xl font-black bg-slate-200 text-slate-800 hover:bg-brand hover:text-white transition-all text-xs"
            >
              Pilih Paket Basic
            </button>
          </div>

          {/* Standard Pro */}
          <div className="bento-card-lime p-6 sm:p-8 rounded-3xl sm:rounded-5xl relative flex flex-col justify-between space-y-6 shadow-limeGlow border-2 border-white">
            <span className="absolute -top-3.5 right-6 bg-dark text-lime font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider">
              PALING POPULER
            </span>
            <div className="space-y-4">
              <span className="bg-dark/10 text-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Pro Speaker</span>
              <h3 className="font-stinger font-black text-2xl text-dark">Standard Pro</h3>
              <div className="pt-2">
                <span className="font-stinger text-3xl sm:text-4xl font-black text-dark">
                  {billingCycle === 'yearly' ? 'Rp 159.000' : 'Rp 199.000'}
                </span>
                <span className="text-xs text-dark/80 font-bold"> / bulan</span>
              </div>
              <ul className="space-y-2.5 text-xs text-dark pt-4 border-t border-dark/20 font-bold">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-dark stroke-[3]" /> Akses Modul A1 - B1</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-dark stroke-[3]" /> 50 Pesan AI Chat / Hari</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-dark stroke-[3]" /> 2 Sesi Tutor Native / Bln</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-dark stroke-[3]" /> Sertifikat Kelulusan Resmi</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab(user ? 'my-package' : 'auth')}
              className="w-full py-3.5 rounded-2xl font-black bg-dark text-lime hover:bg-brand hover:text-white transition-all text-xs shadow-md"
            >
              Pilih Paket Standard Pro
            </button>
          </div>

          {/* Premium VIP */}
          <div className="bento-card p-6 sm:p-8 rounded-3xl sm:rounded-5xl flex flex-col justify-between space-y-6 border-2 border-white">
            <div className="space-y-4">
              <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">VIP Master</span>
              <h3 className="font-stinger font-black text-2xl text-purple-950">Premium VIP</h3>
              <div className="pt-2">
                <span className="font-stinger text-3xl sm:text-4xl font-black text-purple-950">
                  {billingCycle === 'yearly' ? 'Rp 279.000' : 'Rp 349.000'}
                </span>
                <span className="text-xs text-slate-500 font-bold"> / bulan</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t font-semibold">
                <li className="flex items-center gap-2 font-bold text-amber-800"><Check className="w-4 h-4 text-amberIcon stroke-[3]" /> AI Chat & Voice TANPA BATAS 24/7</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> 8 Sesi Privat Tutor Native/bln</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Simulasi Tes IELTS/TOEFL</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab(user ? 'my-package' : 'auth')}
              className="w-full py-3.5 rounded-2xl font-black bg-dark text-white hover:bg-purple-950 transition-all text-xs"
            >
              Pilih Paket Premium VIP
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 5: FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-8">
          <h2 className="font-stinger text-2xl sm:text-4xl font-black text-brand">
            Pertanyaan Yang Sering Diajukan (FAQ)
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bento-card rounded-2xl overflow-hidden transition-all bg-white border border-white"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-4 sm:p-5 text-left font-extrabold text-slate-900 flex items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <span>{faq.q}</span>
                {activeFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-brand flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
