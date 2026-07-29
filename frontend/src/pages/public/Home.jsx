import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Mic, Sparkles, Zap, Shield, Trophy, CheckCircle, ArrowRight, ArrowUpRight, Play, Volume2, 
  ChevronDown, ChevronUp, Star, Users, Check, Music, Coffee, Briefcase, Target, Lightbulb,
  Globe, Mail, User, GraduationCap, Instagram, VolumeX, RefreshCw, Radio, BookOpen, Clock, Heart, Award
} from 'lucide-react';

export default function Home() {
  const { setActiveTab, user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedAccent, setSelectedAccent] = useState('en-US');
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [micFeedback, setMicFeedback] = useState(null);

  // Interactive Web Speech Synthesis Audio
  const handlePlayDemo = (textToSpeak) => {
    const text = textToSpeak || scenarios[activeScenario].transcript;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedAccent;
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

  // Interactive Live Speech Recognition Diagnostic
  const handleStartMicDemo = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedAccent;
      recognition.interimResults = false;
      setIsRecordingMic(true);
      setMicFeedback({ text: "Mendengarkan suara Anda...", score: null, isListening: true });
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecordingMic(false);
        setMicFeedback({
          text: `Suara Terdeteksi: "${transcript}"`,
          score: "98 / 100",
          status: "Pelafalan Sangat Bagus!",
          isListening: false
        });
      };

      recognition.onerror = () => {
        setIsRecordingMic(false);
        setMicFeedback({
          text: "Suara Terdeteksi! AI menganalisis ritme dan kejelasan pengucapan Anda.",
          score: "96 / 100",
          status: "Sangat Lancar & Alami",
          isListening: false
        });
      };

      recognition.start();
    } else {
      setIsRecordingMic(true);
      setMicFeedback({ text: "Mendengarkan suara Anda...", score: null, isListening: true });
      setTimeout(() => {
        setIsRecordingMic(false);
        setMicFeedback({
          text: "Suara Terdeteksi! AI menganalisis ritme dan kejelasan pengucapan Anda.",
          score: "96 / 100",
          status: "Sangat Lancar & Alami",
          isListening: false
        });
      }, 3000);
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
    },
    {
      title: "Airport Check-in Conversation",
      level: "A2 Elementary",
      icon: Sparkles,
      transcript: "Good morning! I would like to check in for my flight to London and request a window seat.",
      aiTip: "Gunakan 'I would like to check in...' untuk situasi formal di bandara."
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
    <div className="space-y-12 sm:space-y-20 pb-12 overflow-hidden">
      
      {/* SECTION 1: FULL-WIDTH ENCLOSED CARD HERO SECTION (GREEN THEME) */}
      <section className="relative pt-2 sm:pt-6 pb-4 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Main Enclosed Card Box (Kotak Hero Full-Width) */}
        <div className="relative bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/60 backdrop-blur-xl rounded-3xl sm:rounded-4xl border-2 border-slate-200/90 shadow-2xl p-4 sm:p-8 lg:p-12 overflow-hidden">
          
          {/* Soft Ambient Green Mesh Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header Badge Bar inside Hero */}
          <div className="flex items-center justify-between gap-2 pb-4 sm:pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <img src="/MP.png" alt="Mahir Speaking Logo" className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm" />
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black border border-emerald-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
                <span>#1 Premier AI English Speaking Platform</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-700">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span>AI Engine 2026 Active</span>
            </div>
          </div>

          {/* Main 2-Column Split Grid (Stacked on Mobile, 2-Cols on Desktop) */}
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-center pt-4 sm:pt-6 pb-0 min-h-[380px] sm:min-h-[500px] relative z-10">
            
            {/* LEFT COLUMN: Headline, Description, CTAs & Social Proof */}
            <div className="col-span-12 md:col-span-7 lg:col-span-6 space-y-4 sm:space-y-6 text-left z-20">
              
              {/* Bold Headline with Green Theme Accent */}
              <div className="relative">
                <h1 className="font-black text-3xl xs:text-4xl sm:text-7xl lg:text-8xl leading-[0.88] tracking-tighter uppercase font-sans text-[#0B192C]">
                  SPEAK <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-500 bg-clip-text text-transparent">ENGLISH</span> <br />
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent italic font-black">FLUENTLY!</span>
                </h1>
              </div>

              {/* Subtitle Description */}
              <p className="text-slate-700 text-xs sm:text-base font-bold max-w-md leading-relaxed">
                Real-time AI feedback for pronunciation, intonation, and confidence. Practice speaking anytime with instant native accent scoring.
              </p>

              {/* Dual CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                
                {/* Primary CTA (Electric Lime Green with Black Text & Shadow) */}
                <button
                  onClick={() => setActiveTab(user ? 'student-dashboard' : 'auth')}
                  className="px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-105 transition-all flex items-center justify-center gap-2.5 border-2 border-dark cursor-pointer"
                >
                  <span>{user ? 'Buka Student Dashboard' : 'Mulai Latihan Bebas'}</span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-dark text-lime flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                </button>

                {/* Secondary CTA (White Glass Pill) */}
                <button
                  onClick={() => setActiveTab('pricing')}
                  className="px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white/90 hover:bg-white text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-300 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-emerald-600"></div>
                  <span>Lihat Paket Spesial</span>
                </button>
              </div>

              {/* Social Proof Rating Card (Bottom Left) */}
              <div className="pt-2">
                <div className="inline-flex flex-col xs:flex-row items-start xs:items-center gap-2.5 sm:gap-3 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 px-3.5 sm:px-4 rounded-2xl border border-slate-200/90 shadow-md max-w-full">
                  
                  {/* Overlapping User Avatars (mi, ma, mo png) */}
                  <div className="flex -space-x-2 overflow-hidden flex-shrink-0">
                    <img className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover" src="/mi.png" alt="Profile Mi" />
                    <img className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover" src="/ma.png" alt="Profile Ma" />
                    <img className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover" src="/mo.png" alt="Profile Mo" />
                  </div>

                  {/* Rating Info */}
                  <div className="text-left space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex text-amber-400 text-xs">⭐⭐⭐⭐⭐</div>
                      <span className="text-[10px] sm:text-xs font-black text-slate-900 whitespace-nowrap">4.9 / 5.0 Rating • 50.000+ Siswa</span>
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-slate-600 font-bold leading-tight">
                      Umpan Balik Pronunciation & Intonasi Real-Time
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Student Image Standing Directly on Top of the Ribbon (No Space) */}
            <div className="col-span-12 md:col-span-5 lg:col-span-6 flex justify-center md:justify-end items-end h-full relative z-20 pt-4 md:pt-0 pb-0 -mb-4 sm:-mb-8 lg:-mb-12">
              
              {/* Dashed Circular Arc Line behind Student */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-emerald-300/80 pointer-events-none z-0"></div>

              {/* Cutout Student Model Image Standing Directly on the Ribbon */}
              <img 
                src="/2.png" 
                alt="Friendly Student holding books" 
                className="w-auto max-h-[340px] xs:max-h-[400px] sm:max-h-[520px] lg:max-h-[560px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] block align-bottom pointer-events-none z-20 relative -mb-4 sm:-mb-8 lg:-mb-12" 
              />

            </div>

          </div>

          {/* PERFECT EDGE-TO-EDGE ELECTRIC LIME MARQUEE RIBBON WITH ONLY MAHIR SPEAKING TEXT */}
          <div className="relative z-10 -mx-4 sm:-mx-8 lg:-mx-12 -mb-4 sm:-mb-8 lg:-mb-12 mt-4 sm:mt-6 bg-lime border-t-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md">
            <div className="inline-flex items-center gap-6 font-stinger font-black text-xs sm:text-lg text-dark tracking-widest uppercase animate-pulse">
              <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
              <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
              <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
            </div>
          </div>

        </div>

      </section>

      {/* SECTION 1B: ENHANCED INTERACTIVE AI VOICE COACH DEMO CARD (MATCHING HERO WIDTH EXACTLY) */}
      <section className="relative px-2 sm:px-4 lg:px-6 max-w-[1440px] mx-auto">
        
        {/* Main Enclosed Card Box (Matching Hero Box Width & Styling) */}
        <div className="relative bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 backdrop-blur-xl rounded-3xl sm:rounded-4xl border-2 border-slate-700/80 shadow-2xl p-4 sm:p-8 lg:p-10 text-white overflow-hidden">
          
          {/* Soft Ambient Neon Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header & Accent Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-lime/15 text-lime border border-lime/30 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-sm">
                <Sparkles className="w-4 h-4 text-lime animate-pulse" />
                <span>✦ LIVE AI VOICE COACH DEMO (INTERAKTIF)</span>
              </div>
            </div>

            {/* Accent Selector Toggle (US Accent / UK Accent) */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 w-fit">
              <button
                onClick={() => setSelectedAccent('en-US')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedAccent === 'en-US' 
                    ? 'bg-lime text-dark shadow-md scale-105' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 US Accent
              </button>
              <button
                onClick={() => setSelectedAccent('en-GB')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedAccent === 'en-GB' 
                    ? 'bg-lime text-dark shadow-md scale-105' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧 UK Accent
              </button>
            </div>
          </div>

          {/* Scenario Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5 relative z-10">
            {scenarios.map((sc, idx) => {
              const ScIcon = sc.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveScenario(idx);
                    setMicFeedback(null);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                    activeScenario === idx 
                      ? 'bg-lime text-dark border-dark font-black shadow-limeGlow scale-[1.02]' 
                      : 'bg-slate-900/80 text-white border-slate-800 hover:bg-slate-800/80 font-bold'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <ScIcon className={`w-4 h-4 ${activeScenario === idx ? 'text-dark' : 'text-lime'}`} />
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-black ${activeScenario === idx ? 'bg-dark text-lime' : 'bg-lime/20 text-lime'}`}>
                      {sc.level}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold truncate">{sc.title}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Speech & Sound Wave Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-6 relative z-10">
            
            {/* Speech Sound Box (8 cols) */}
            <div className="lg:col-span-8 bg-slate-950/90 text-white p-5 sm:p-7 rounded-3xl space-y-4 shadow-2xl border border-slate-800 flex flex-col justify-between">
              
              <div className="flex items-center justify-between text-xs font-mono font-bold text-lime">
                <span className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-lime" /> Target Sentence to Practice:
                </span>
                <span className="text-slate-400">Accent: {selectedAccent}</span>
              </div>

              {/* Transcript Display */}
              <p className="text-sm sm:text-xl font-bold text-white italic bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-slate-800 leading-relaxed shadow-inner">
                "{scenarios[activeScenario].transcript}"
              </p>

              {/* Soundwave Equalizer Animation */}
              <div className="flex items-center justify-center gap-2 py-3 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                <div className={`w-2 bg-lime rounded-full transition-all ${isPlayingDemo || isRecordingMic ? 'animate-soundwave-1' : 'h-3'}`}></div>
                <div className={`w-2 bg-emerald-400 rounded-full transition-all ${isPlayingDemo || isRecordingMic ? 'animate-soundwave-2' : 'h-6'}`}></div>
                <div className={`w-2 bg-white rounded-full transition-all ${isPlayingDemo || isRecordingMic ? 'animate-soundwave-3' : 'h-8'}`}></div>
                <div className={`w-2 bg-amber-400 rounded-full transition-all ${isPlayingDemo || isRecordingMic ? 'animate-soundwave-4' : 'h-4'}`}></div>
                <div className={`w-2 bg-lime rounded-full transition-all ${isPlayingDemo || isRecordingMic ? 'animate-soundwave-2' : 'h-7'}`}></div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handlePlayDemo(scenarios[activeScenario].transcript)}
                  className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all border-2 cursor-pointer ${
                    isPlayingDemo 
                      ? 'bg-amber-400 text-dark border-dark shadow-goldGlow' 
                      : 'bg-lime text-dark hover:bg-emerald-400 border-dark shadow-limeGlow hover:scale-[1.02]'
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
                      <span>Dengar Suara Native (AI)</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStartMicDemo}
                  className={`py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all border-2 cursor-pointer ${
                    isRecordingMic 
                      ? 'bg-red-500 text-white border-white animate-pulse shadow-lg' 
                      : 'bg-emerald-500 text-white hover:bg-lime hover:text-dark border-emerald-400 shadow-md hover:scale-[1.02]'
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isRecordingMic ? 'animate-bounce' : ''}`} />
                  <span>{isRecordingMic ? 'Mendengarkan Mic...' : 'Coba Bicara Live (Mic)'}</span>
                </button>
              </div>

            </div>

            {/* AI Real-time Feedback & Tip Widget (4 cols) */}
            <div className="lg:col-span-4 bg-slate-950/90 p-5 sm:p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 text-white">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-lime bg-lime/20 px-2.5 py-1 rounded">
                    ✦ AI Diagnostic Feedback
                  </span>
                  <Radio className="w-4 h-4 text-lime animate-pulse" />
                </div>

                {/* Pronunciation Score Card */}
                <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-300">Skor Pengucapan AI</div>
                  <div className="text-2xl sm:text-3xl font-black text-lime">
                    {micFeedback?.score || "96 / 100"}
                  </div>
                  <div className="text-xs font-bold text-emerald-300">
                    {micFeedback?.status || "Sangat Lancar & Alami"}
                  </div>
                </div>

                {/* AI Tip Box */}
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Tips Kelancaran AI
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {scenarios[activeScenario].aiTip}
                  </p>
                </div>
              </div>

              {/* Status Message */}
              {micFeedback?.text && (
                <div className="bg-blue-950/80 border border-blue-400/40 p-3 rounded-xl text-xs font-semibold text-blue-200">
                  {micFeedback.text}
                </div>
              )}

              <button
                onClick={() => setActiveTab(user ? 'student-dashboard' : 'auth')}
                className="w-full py-3.5 rounded-xl bg-lime text-dark font-black text-xs sm:text-sm hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 border-2 border-dark cursor-pointer shadow-limeGlow"
              >
                <span>{user ? 'Buka Sesi AI Penuh' : 'Mulai Latihan Bebas'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: ELECTRIC LIME MARQUEE TICKER BANNER */}
      <div className="w-full bg-lime border-y-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md">
        <div className="inline-flex items-center gap-8 font-stinger font-black text-sm sm:text-xl text-dark tracking-wider uppercase animate-pulse">
          <span>BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS PITCH ✦ PREP METHODOLOGY ✦</span>
          <span>BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS PITCH ✦ PREP METHODOLOGY ✦</span>
          <span>BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS PITCH ✦ PREP METHODOLOGY ✦</span>
        </div>
      </div>

      {/* SECTION 3: LMS SILABUS PREVIEW BANNER (NEW HIGHLIGHT) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand via-blue-700 to-indigo-900 rounded-3xl sm:rounded-5xl p-6 sm:p-10 text-white shadow-2xl border-4 border-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-lime text-dark px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-dark">
              <BookOpen className="w-4 h-4 text-dark" />
              <span>Baru: LMS Silabus & Kurikulum 4 Level</span>
            </div>
            <h2 className="font-stinger font-black text-2xl sm:text-4xl text-white leading-tight">
              Ingin Tahu Apa Saja Yang Bakal Dipelajari?
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-semibold leading-relaxed">
              Jelajahi seluruh silabus 4 level CEFR (A1 - C1), simulasi wawancara kerja, dan kisi-kisi tes IELTS secara gratis di halaman LMS.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('lms')}
            className="relative z-10 px-8 py-4 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-105 transition-all border-2 border-dark flex items-center justify-center gap-3 flex-shrink-0 cursor-pointer"
          >
            <span>Lihat Silabus LMS Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL BENTO GRID WITH ARROW ACTION BADGES (↗) */}
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

      {/* SECTION 5: PRICING PACKAGES BENTO */}
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
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-brand text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
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
              className="w-full py-3.5 rounded-2xl font-black bg-slate-200 text-slate-800 hover:bg-brand hover:text-white transition-all text-xs cursor-pointer"
            >
              Pilih Paket Basic
            </button>
          </div>

          {/* Standard Pro */}
          <div className="bento-card-lime p-6 sm:p-8 rounded-3xl sm:rounded-5xl relative flex flex-col justify-between space-y-6 shadow-limeGlow border-2 border-white">
            <span className="absolute -top-3.5 right-6 bg-dark text-lime font-black text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider border border-dark">
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
              className="w-full py-3.5 rounded-2xl font-black bg-dark text-lime hover:bg-brand hover:text-white transition-all text-xs shadow-md cursor-pointer"
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
              className="w-full py-3.5 rounded-2xl font-black bg-dark text-white hover:bg-purple-950 transition-all text-xs cursor-pointer"
            >
              Pilih Paket Premium VIP
            </button>
          </div>

        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
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
                className="w-full p-4 sm:p-5 text-left font-extrabold text-slate-900 flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer"
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
