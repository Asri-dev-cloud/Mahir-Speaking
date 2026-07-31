import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Mic,
  Sparkles,
  Zap,
  Shield,
  Trophy,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  Play,
  Volume2,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Check,
  Music,
  Coffee,
  Briefcase,
  Target,
  Lightbulb,
  Globe,
  Mail,
  User,
  GraduationCap,
  Instagram,
  VolumeX,
  RefreshCw,
  Radio,
  BookOpen,
  Clock,
  Heart,
  Award,
  Bot,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  const { setActiveTab, user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedAccent, setSelectedAccent] = useState("en-US");
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [micFeedback, setMicFeedback] = useState(null);

  // Interactive Web Speech Synthesis Audio
  const handlePlayDemo = (textToSpeak) => {
    const text = textToSpeak || scenarios[activeScenario].transcript;
    if ("speechSynthesis" in window) {
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
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = selectedAccent;
      recognition.interimResults = false;
      setIsRecordingMic(true);
      setMicFeedback({
        text: "Mendengarkan suara Anda...",
        score: null,
        isListening: true,
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecordingMic(false);
        setMicFeedback({
          text: `Suara Terdeteksi: "${transcript}"`,
          score: "98 / 100",
          status: "Pelafalan Sangat Bagus!",
          isListening: false,
        });
      };

      recognition.onerror = () => {
        setIsRecordingMic(false);
        setMicFeedback({
          text: "Suara Terdeteksi! AI menganalisis ritme dan kejelasan pengucapan Anda.",
          score: "96 / 100",
          status: "Sangat Lancar & Alami",
          isListening: false,
        });
      };

      recognition.start();
    } else {
      setIsRecordingMic(true);
      setMicFeedback({
        text: "Mendengarkan suara Anda...",
        score: null,
        isListening: true,
      });
      setTimeout(() => {
        setIsRecordingMic(false);
        setMicFeedback({
          text: "Suara Terdeteksi! AI menganalisis ritme dan kejelasan pengucapan Anda.",
          score: "96 / 100",
          status: "Sangat Lancar & Alami",
          isListening: false,
        });
      }, 3000);
    }
  };

  const scenarios = [
    {
      title: "Ordering Coffee at a Cafe",
      level: "A1 Beginner",
      icon: Coffee,
      transcript:
        "Hi, could I please get an iced oat milk latte with an extra shot of espresso?",
      aiTip:
        "Gunakan 'Could I please get...' untuk percakapan alami dan sopan.",
    },
    {
      title: "Job Interview Pitch",
      level: "B1 Intermediate",
      icon: Briefcase,
      transcript:
        "I have over 4 years of experience leading software development teams and driving scalable impact.",
      aiTip: "Tunjukkan pencapaian utama Anda menggunakan metode PREP.",
    },
    {
      title: "IELTS Cue Card Monologue",
      level: "B2 Upper Intermediate",
      icon: Target,
      transcript:
        "I would like to describe a memorable journey I took to Bali last summer, which profoundly shaped my perspective.",
      aiTip:
        "Gunakan kata sifat kaya seperti 'profoundly' dan 'memorable' untuk skor Band 7.5+.",
    },
    {
      title: "Airport Check-in Conversation",
      level: "A2 Elementary",
      icon: Sparkles,
      transcript:
        "Good morning! I would like to check in for my flight to London and request a window seat.",
      aiTip:
        "Gunakan 'I would like to check in...' untuk situasi formal di bandara.",
    },
  ];

  const faqs = [
    {
      q: "Apa yang membuat Mahir Speaking sangat efektif?",
      a: "Mahir Speaking menggabungkan latihan suara interaktif (Web Speech AI), player audio bergaya bento, tutor native 1-on-1, dan sistem gamifikasi XP yang membuat belajar terasa menyenangkan.",
    },
    {
      q: "Bagaimana AI Coach membantu saya berbicara lebih lancar?",
      a: "AI Coach bertindak sebagai partner bicara 24/7. AI mengoreksi tata bahasa secara otomatis, memperdengarkan suara native, dan memberikan rekomendasi frasa alami.",
    },
    {
      q: "Apakah platform ini responsif di HP?",
      a: "Sangat responsif! Tampilan dirancang khusus Mobile-First dengan navigasi bawah interaktif dan kontrol perekam suara sekali tekan.",
    },
    {
      q: "Apa keunggulan Paket Premium VIP?",
      a: "Akses AI Chat & Voice TANPA BATAS 24/7, 8 sesi privat tutor native per bulan, simulasi tes IELTS/TOEFL, serta badge terverifikasi di leaderboard.",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-12 overflow-hidden">
      {/* SECTION 1: FULL-WIDTH ENCLOSED CARD HERO SECTION (GREEN THEME) */}
      <section className="relative pt-2 sm:pt-6 pb-0 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        {/* Main Enclosed Card Box (Kotak Hero Full-Width) */}
        <div className="relative bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/60 backdrop-blur-xl rounded-3xl sm:rounded-4xl border-2 border-slate-200/90 shadow-2xl p-4 sm:p-8 lg:p-12 overflow-hidden">
          {/* Soft Ambient Green Mesh Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header Badge Bar inside Hero */}
          <div className="flex items-center justify-between gap-2 pb-4 sm:pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src="/MP.png"
                alt="Mahir Speaking Logo"
                className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm"
              />
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
                <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-tighter uppercase font-sans text-[#0B192C]">
                  BERANI <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-500 bg-clip-text text-transparent">
                    BICARA,
                  </span>{" "}
                  <br />
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent italic font-black">
                    SIAP BERKARYA!
                  </span>
                </h1>
              </div>

              {/* Subtitle Description */}
              <p className="text-slate-700 text-xs sm:text-base font-bold max-w-md leading-relaxed">
                Real-time AI feedback for pronunciation, intonation, and
                confidence. Practice speaking anytime with instant native accent
                scoring.
              </p>

              {/* Dual CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                {/* Primary CTA (Electric Lime Green with Black Text & Shadow) */}
                <button
                  onClick={() =>
                    setActiveTab(user ? "student-dashboard" : "auth")
                  }
                  className="px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-105 transition-all flex items-center justify-center gap-2.5 border-2 border-dark cursor-pointer"
                >
                  <span>
                    {user ? "Buka Student Dashboard" : "Mulai Latihan Bebas"}
                  </span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-dark text-lime flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                </button>

                {/* Secondary CTA (White Glass Pill) */}
                <button
                  onClick={() => setActiveTab("pricing")}
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
                    <img
                      className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover"
                      src="/mi.png"
                      alt="Profile Mi"
                    />
                    <img
                      className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover"
                      src="/ma.png"
                      alt="Profile Ma"
                    />
                    <img
                      className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover"
                      src="/mo.png"
                      alt="Profile Mo"
                    />
                  </div>

                  {/* Rating Info */}
                  <div className="text-left space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex text-amber-400 text-xs">
                        ⭐⭐⭐⭐⭐
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-slate-900 whitespace-nowrap">
                        4.9 / 5.0 Rating • 50.000+ Siswa
                      </span>
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
              <span>
                MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR
                SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦
              </span>
              <span>
                MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR
                SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦
              </span>
              <span>
                MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR
                SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦
              </span>
            </div>
          </div>
        </div>

        {/* Partner logos */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-10 md:gap-14 py-0 -mt-6 sm:-mt-10 lg:-mt-12 -mb-6 sm:-mb-10 lg:-mb-12">
          <img
            src="/5.png"
            alt="Pelita Batara Media"
            className="h-28 sm:h-44 md:h-56 lg:h-64 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
          <img
            src="/6.png"
            alt="Mahir Speaking"
            className="h-28 sm:h-44 md:h-56 lg:h-64 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
        </div>
      </section>

      {/* SECTION 1B: PERKENALAN KARAKTER MASHIRA (EDITORIAL CHARACTER SHOWCASE) */}
      <section className="relative !-mt-4 sm:!-mt-10 lg:!-mt-12 mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6">
        {/* Main Character Showcase Box */}
        <div className="relative bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 backdrop-blur-xl rounded-3xl sm:rounded-4xl border-2 border-slate-700/80 shadow-2xl p-6 sm:p-10 lg:p-14 text-white overflow-hidden">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
            {/* LEFT COLUMN: MASHIRA CHARACTER AVATAR SHOWCASE (5 cols - BORDERLESS WITHOUT BOX) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative text-center">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-black text-emerald-400 mb-2 shadow-lg backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ONLINE 24/7 • MASHIRA AI</span>
              </div>

              {/* Borderless Mashira Character Image */}
              <div className="relative my-2 flex justify-center items-center w-full">
                <div className="absolute inset-0 bg-lime/25 rounded-full blur-3xl pointer-events-none transform scale-90"></div>
                <img
                  src="/4.png"
                  alt="Mashira - AI Speaking Companion"
                  className="h-80 sm:h-[430px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] relative z-10 hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Clean Character Title */}
              <div className="space-y-1 z-10 pt-2">
                <h3 className="font-stinger font-black text-3xl sm:text-4xl text-white tracking-widest uppercase drop-shadow-md">
                  MASHIRA
                </h3>
                <p className="text-xs font-mono font-extrabold text-lime tracking-wider uppercase">
                  Official AI Speaking Companion
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: EDITORIAL CHARACTER STORY & INTRODUCTION (7 cols) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Header Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-lime/15 text-lime border border-lime/30 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
                  <Sparkles className="w-4 h-4 text-lime" />
                  <span>MEET YOUR AI COMPANION</span>
                </div>

                <h2 className="font-stinger font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-tight">
                  Halo! Aku{" "}
                  <span className="text-lime underline decoration-lime/50 decoration-wavy">
                    Mashira
                  </span>
                </h2>
              </div>

              {/* Mashira Greeting Speech Quote Box */}
              <div className="relative bg-slate-950/90 border-l-4 border-lime p-6 sm:p-7 rounded-2xl sm:rounded-3xl border-y border-r border-slate-800 space-y-3 shadow-2xl">
                <div className="flex items-center gap-2 text-xs font-black text-lime uppercase tracking-widest font-mono">
                  <MessageSquare className="w-4 h-4 text-lime" />
                  <span>Pesan Dari Mashira</span>
                </div>
                <p className="text-slate-100 text-sm sm:text-lg font-semibold leading-relaxed italic">
                  "Di sini aku bakal siap nemenin kamu latihan percakapan Bahasa
                  Inggris kapan saja tanpa rasa takut atau canggung. Bersama
                  aku, kamu bisa bebas mengekspresikan diri dan mengasah
                  kelancaran bicara dengan santai!"
                </p>
              </div>

              {/* Character Role Highlights (Clean Editorial List - NO PILLS, NO EMOJIS) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-900/60 transition-colors">
                  <div className="p-2.5 rounded-xl bg-lime/10 text-lime border border-lime/20 flex-shrink-0 mt-0.5">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-white uppercase tracking-wider">
                      Teman Percakapan 24/7
                    </h4>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Siap diajak ngobrol kapan pun kamu mau latihan percakapan
                      Bahasa Inggris tanpa batasan waktu atau janji temu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-900/60 transition-colors">
                  <div className="p-2.5 rounded-xl bg-lime/10 text-lime border border-lime/20 flex-shrink-0 mt-0.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-white uppercase tracking-wider">
                      Suasana Bebas Canggung
                    </h4>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Ruang aman dan ramah untuk berlatih bicara tanpa khawatir
                      dihakimi atau merasa malu saat melakukan kesalahan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-900/60 transition-colors">
                  <div className="p-2.5 rounded-xl bg-lime/10 text-lime border border-lime/20 flex-shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm text-white uppercase tracking-wider">
                      Responsif & Adaptif
                    </h4>
                    <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                      Menyesuaikan topik percakapan dan ritme komunikasi sesuai
                      dengan tingkat kelancaran dan kebutuhan kamu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ELECTRIC LIME MARQUEE TICKER BANNER */}
      <div className="w-full bg-lime border-y-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md">
        <div className="inline-flex items-center gap-8 font-stinger font-black text-sm sm:text-xl text-dark tracking-wider uppercase animate-pulse">
          <span>
            BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS
            PITCH ✦ PREP METHODOLOGY ✦
          </span>
          <span>
            BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS
            PITCH ✦ PREP METHODOLOGY ✦
          </span>
          <span>
            BRANDING ✦ NATIVE VOICE AI ✦ ACTIVE SPEAKING ✦ IELTS 7.0+ ✦ BUSINESS
            PITCH ✦ PREP METHODOLOGY ✦
          </span>
        </div>
      </div>

      {/* SECTION 3: LMS SILABUS & FREE QUIZZES BANNER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: LMS Silabus */}
        <div className="lg:col-span-7 bg-gradient-to-r from-brand via-blue-700 to-indigo-900 rounded-3xl sm:rounded-4xl p-6 sm:p-8 text-white shadow-2xl border-4 border-white flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-lime text-dark px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-dark">
              <BookOpen className="w-4 h-4 text-dark" />
              <span>Silabus Kurikulum 4 Level</span>
            </div>
            <h2 className="font-stinger font-black text-2xl sm:text-3xl text-white leading-tight">
              Ingin Tahu Apa Saja Yang Bakal Dipelajari?
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-semibold leading-relaxed">
              Jelajahi seluruh silabus 4 level CEFR (A1 - C1), modul latihan
              suara AI, simulasi wawancara kerja, dan persiapan IELTS di halaman
              LMS.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("lms")}
            className="relative z-10 px-6 py-3.5 rounded-2xl bg-white text-brand font-black text-xs sm:text-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5 cursor-pointer w-fit"
          >
            <span>Lihat Silabus LMS Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right 5 cols: 100% FREE QUIZ CTA */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-dark rounded-3xl sm:rounded-4xl p-6 sm:p-8 text-white shadow-2xl border-4 border-lime flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-lime text-dark px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-dark animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-dark" />
              <span>100% GRATIS UNTUK SIAPA SAJA</span>
            </div>
            <h2 className="font-stinger font-black text-2xl sm:text-3xl text-white leading-tight">
              Uji Kemampuan{" "}
              <span className="text-lime">Speaking & Grammar</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-semibold leading-relaxed">
              Ikuti Kuis Interaktif Level A1-C1 sekarang. Gratis untuk umum
              tanpa perlu bayar atau berlangganan!
            </p>
          </div>

          <button
            onClick={() => setActiveTab("lms")}
            className="relative z-10 px-6 py-3.5 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-[1.02] transition-all border-2 border-dark flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-dark" />
            <span>Mulai Quiz Interaktif Gratis ➔</span>
          </button>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL BENTO GRID WITH ARROW ACTION BADGES (↗) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-slate-900 pb-4">
          <div>
            <span className="text-xs font-black text-brand uppercase tracking-widest">
              ✦ CREATIVE LEARNING MODULES
            </span>
            <h2 className="font-helios text-3xl sm:text-5xl font-black text-slate-900 uppercase">
              DESIGNED FOR SEAMLESS FLUENCY.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bento-card p-6 sm:p-8 rounded-3xl sm:rounded-5xl space-y-6 border-4 border-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400">
                  01 / FEATURE
                </span>
                <div className="w-10 h-10 rounded-full bg-brand text-lime flex items-center justify-center font-black group-hover:bg-lime group-hover:text-dark transition-colors">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <h3 className="font-helios font-black text-2xl text-slate-900 uppercase">
                DIAGNOSTIK SUARA AI
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                Analisis otomatis untuk pengucapan, intonasi, ritme bicara, dan
                tata bahasa setiap kali Anda berlatih suara.
              </p>
            </div>
          </div>

          <div className="bento-card-lime p-6 sm:p-8 rounded-3xl sm:rounded-5xl space-y-6 border-4 border-dark flex flex-col justify-between shadow-limeGlow group">
            <div className="space-y-4 text-dark">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-dark/70">
                  02 / NATIVE MENTOR
                </span>
                <div className="w-10 h-10 rounded-full bg-dark text-lime flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <h3 className="font-helios font-black text-2xl uppercase">
                TUTOR NATIVE 1-ON-1
              </h3>
              <p className="text-dark/90 text-xs sm:text-sm leading-relaxed font-extrabold">
                Sesi privat langsung dengan tutor native tersertifikasi untuk
                latihan wawancara kerja, ujian IELTS, dan negosiasi bisnis.
              </p>
            </div>
          </div>

          <div className="bento-card p-6 sm:p-8 rounded-3xl sm:rounded-5xl space-y-6 border-4 border-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400">
                  03 / GAMIFICATION
                </span>
                <div className="w-10 h-10 rounded-full bg-amberIcon text-white flex items-center justify-center font-black group-hover:bg-brand transition-colors">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
              <h3 className="font-helios font-black text-2xl text-slate-900 uppercase">
                GAMIFIKASI XP & STREAK
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                Kumpulkan poin XP, pertahankan streak belajar harian, buka badge
                unik, dan naik ke podium teratas siswa dunia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING PACKAGES BENTO */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-lime text-dark text-xs font-black px-4 py-1 rounded-full uppercase border border-dark shadow-sm">
            <Sparkles className="w-4 h-4 text-dark" />
            <span>ENGLISH SPEAKING PARTNER • OPEN FOR 2025</span>
          </div>
          <h2 className="font-helios text-3xl sm:text-5xl font-black text-brand uppercase">
            Pilihan Paket Langganan
          </h2>
          <p className="text-slate-700 font-bold text-xs sm:text-base">
            Pilih paket yang paling sesuai dengan target belajar Anda.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Group Speaking Kursus */}
          <div className="bento-card p-6 rounded-3xl border-2 border-slate-200 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all bg-white">
            <div className="space-y-4">
              <span className="bg-slate-200 text-slate-800 text-[11px] font-black px-3 py-1 rounded-full uppercase">
                Paket Kursus
              </span>
              <h3 className="font-stinger font-black text-xl text-slate-900">
                Group Speaking Kursus
              </h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Program belajar kelompok interaktif dibimbing instruktur untuk
                membangun keberanian bicara.
              </p>

              <div className="pt-2 border-t border-slate-200">
                <div className="font-stinger text-2xl font-black text-slate-900">
                  Konsultasi Spesial
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  Tersedia Skema Hemat Berkelompok
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Integrated Modul Pembelajaran
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Daily Learning & Interactive Drill
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Leaderboard Komunitas Siswa
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Akses Kuis Interaktif LMS
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20untuk%20informasi%20pendaftaran%20dan%20konsultasi%20program%20Group%20Speaking%20Kursus."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl font-black bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white transition-all text-xs border border-slate-300 text-center block cursor-pointer"
            >
              Tanya Paket Kursus
            </a>
          </div>

          {/* Card 2: English Speaking Partner (Bayar Tunai / Cash) */}
          <div className="bento-card-lime p-6 rounded-3xl border-4 border-dark flex flex-col justify-between space-y-6 shadow-limeGlow relative overflow-hidden transform lg:-translate-y-2">
            <span className="absolute top-0 right-0 bg-dark text-lime font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl border-b border-l border-dark">
              DISKON SPECIAL
            </span>

            <div className="space-y-4">
              <span className="bg-dark text-lime text-[11px] font-black px-3 py-1 rounded-full uppercase">
                Bayar Tunai / Cash
              </span>
              <h3 className="font-stinger font-black text-xl text-dark">
                English Speaking Partner (Cash)
              </h3>
              <p className="text-xs text-dark/90 font-bold leading-relaxed">
                Hemat 50% bayar lunas langsung. Pembimbing tutor, modul
                terintegrasi, & native.
              </p>

              <div className="pt-2 border-t border-dark/20 space-y-0.5">
                <div className="text-xs text-dark/70 font-extrabold line-through">
                  Biaya Normal: Rp 1.500.000 / 3 Bulan
                </div>
                <div className="font-stinger text-3xl font-black text-dark">
                  Rp 750.000
                </div>
                <div className="text-[10px] font-black text-dark bg-white/80 px-2 py-0.5 rounded inline-block">
                  Potongan Harga Jadi Rp 750.000 (Bayar Langsung)
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-dark pt-4 border-t border-dark/20 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-dark stroke-[3]" /> Experienced
                  Tutor Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-dark stroke-[3]" /> Integrated
                  Modul Lengkap
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-dark stroke-[3]" /> One on One
                  Speaking Practice
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-dark stroke-[3]" /> Daily
                  Learning & Diagnostic Drill
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-dark stroke-[3]" /> Native
                  Speaker Meeting Session
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab(user ? "my-package" : "auth")}
              className="w-full py-3.5 rounded-2xl font-black bg-dark text-lime hover:bg-brand hover:text-white transition-all text-xs shadow-md border-2 border-dark cursor-pointer"
            >
              Daftar Cash (Rp 750.000)
            </button>
          </div>

          {/* Card 3: English Speaking Partner (Skema Cicilan 3x) */}
          <div className="bento-card p-6 rounded-3xl border-2 border-brand flex flex-col justify-between space-y-6 bg-white shadow-xl">
            <div className="space-y-4">
              <span className="bg-brand text-lime text-[11px] font-black px-3 py-1 rounded-full uppercase">
                Skema Cicilan 3x
              </span>
              <h3 className="font-stinger font-black text-xl text-brand">
                English Speaking Partner (Cicilan)
              </h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Pembayaran diangsur 3 kali dengan skema persentase 70%, 15%, dan
                15%.
              </p>

              <div className="pt-2 border-t border-slate-200 space-y-0.5">
                <div className="text-xs text-slate-400 font-bold">
                  Total Biaya Program: Rp 1.500.000
                </div>
                <div className="font-stinger text-2xl font-black text-brand">
                  70% • 15% • 15%
                </div>
                <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                  DP Cicilan 1: Rp 1.050.000 (70%)
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Angsuran 1 (70%): Rp 1.050.000
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Angsuran 2 (15%): Rp 225.000
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Angsuran 3 (15%): Rp 225.000
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Mentorship Tutor & Modul Lengkap
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />{" "}
                  Native Speaker Meeting Session
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab(user ? "my-package" : "auth")}
              className="w-full py-3.5 rounded-2xl font-black bg-brand text-lime hover:scale-[1.02] transition-all text-xs border border-dark cursor-pointer shadow-md"
            >
              Daftar Skema Cicilan 3x
            </button>
          </div>

          {/* Card 4: Private 1-on-1 VIP */}
          <div className="bento-card p-6 rounded-3xl border-2 border-slate-200 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all bg-white">
            <div className="space-y-4">
              <span className="bg-purple-100 text-purple-900 text-[11px] font-black px-3 py-1 rounded-full uppercase">
                Paket Private VIP
              </span>
              <h3 className="font-stinger font-black text-xl text-slate-900">
                Private 1-on-1 Intensive
              </h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Bimbingan 1-on-1 privat intensif jadwal menyesuaikan (Ms. Era,
                Ms. Deasy, Ms. Ade).
              </p>

              <div className="pt-2 border-t border-slate-200">
                <div className="font-stinger text-2xl font-black text-purple-950">
                  Konsultasi Intensif
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  Pendampingan Khusus Instruktur Senior
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-bold">
                <li className="flex items-center gap-2 text-purple-950">
                  <Check className="w-4 h-4 text-purple-600 stroke-[3]" /> Full
                  Private 1-on-1 Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 stroke-[3]" /> Bebas
                  Atur Jadwal Belajar
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 stroke-[3]" />{" "}
                  Native Speaker Meeting Prives
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 stroke-[3]" />{" "}
                  Evaluasi & Diagnostic Test Gratis
                </li>
              </ul>
            </div>

            <a
              href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20untuk%20informasi%20pendaftaran%20dan%20konsultasi%20program%20Private%201-on-1%20VIP."
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl font-black bg-slate-900 text-white hover:bg-purple-950 transition-all text-xs text-center block cursor-pointer"
            >
              Tanya Paket Private VIP
            </a>
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