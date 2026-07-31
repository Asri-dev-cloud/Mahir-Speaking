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
  MessageCircle,
  Send,
  X,
  FileText,
  UserCheck
} from "lucide-react";

export default function Home() {
  const { setActiveTab, user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeLevelTab, setActiveLevelTab] = useState('basic'); // basic | intermediate | advanced
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [placementStep, setPlacementStep] = useState(1); // 1: lead form | 2: mini quiz | 3: result

  // Lead capture state (Target 50 leads/bulan)
  const [leadsCount, setLeadsCount] = useState(38);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState({
    nama: '',
    noWa: '',
    levelTarget: 'basic',
    catatan: '',
    jadwalTrial: 'Sabtu (10.00 WIB)'
  });

  // Mini quiz answers for instant level recommendation
  const [quizAnswers, setQuizAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [recommendedLevel, setRecommendedLevel] = useState('Basic Level');

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadFormData.nama || !leadFormData.noWa) return;

    // Save lead locally
    const existingLeads = JSON.parse(localStorage.getItem('mahir_leads') || '[]');
    const newLead = { ...leadFormData, date: new Date().toISOString() };
    localStorage.setItem('mahir_leads', JSON.stringify([newLead, ...existingLeads]));

    setLeadsCount(prev => prev + 1);
    setPlacementStep(2);
  };

  const handleFinishPlacement = () => {
    let score = 0;
    if (quizAnswers.q1 === 'b') score += 1;
    if (quizAnswers.q2 === 'c') score += 1;
    if (quizAnswers.q3 === 'a') score += 1;

    if (score === 3) setRecommendedLevel('Advanced Level');
    else if (score === 2) setRecommendedLevel('Intermediate Level');
    else setRecommendedLevel('Basic Level');

    setPlacementStep(3);
    setLeadSubmitted(true);
  };

  const curriculumData = {
    basic: {
      title: "Level Basic (Beginner Level)",
      badge: "Fondasi Utama & Keberanian Bicara",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      target: "Berani berbicara Bahasa Inggris tanpa rasa canggung, menguasai frasa harian dasar, serta pengucapan yang jelas.",
      duration: "8 – 10 Sesi Interaktif (@90 Menit)",
      focusItems: [
        { title: "Perkenalan Diri (Self Introduction)", desc: "Menyebutkan nama, asal, latar belakang, dan hobi dengan percaya diri & sopan." },
        { title: "Percakapan Harian (Daily Conversation)", desc: "Dialog sehari-hari di kafe, belanja, menyapa teman, dan menanyakan lokasi." },
        { title: "Kosakata Dasar (Vocabulary Expansion)", desc: "Penguasaan 300+ kata kunci penting untuk aktivitas harian." },
        { title: "Pelafalan & Akses (Pronunciation & Intonation)", desc: "Latihan pemenggalan kata, penekanan (stressing), dan fonetik dasar." },
        { title: "Grammar for Speaking: Simple Present", desc: "Menggunakan tata bahasa dasar tanpa perlu bingung rumus rumit." },
        { title: "Asking & Answering Questions", desc: "Teknik mengajukan dan menjawab pertanyaan secara spontan." }
      ]
    },
    intermediate: {
      title: "Level Intermediate (Independent Speaker)",
      badge: "Kelancaran Beropini & Public Speaking",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      target: "Lancar menyampaikan ide, cerita panjang, presentasi terstruktur, serta aktif berdiskusi dalam kelompok.",
      duration: "10 Sesi Interaktif (@90 Menit)",
      focusItems: [
        { title: "Storytelling & Expressing Ideas", desc: "Menceritakan pengalaman masa lalu, narasi seru, dan menyampaikan opini personal." },
        { title: "Group Discussion & Debating", desc: "Berdiskusi topik populer, menyampaikan pro-kontra, dan merespons lawan bicara." },
        { title: "Grammar for Speaking Advanced", desc: "Variasi tenses (Past, Present Perfect, Future) untuk dinamika bicara." },
        { title: "Presentation Skills", desc: "Menyusun slide presentasi, opening hook, body content, dan closing memikat." },
        { title: "Public Speaking Dasar", desc: "Mengatasi gerigi panggung, bahasa tubuh, ekspresi wajah, dan intonasi bervariasi." }
      ]
    },
    advanced: {
      title: "Level Advanced (Professional Speaker)",
      badge: "Business English & Career Excellence",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      target: "Menguasai komunikasi profesional tingkat tinggi, wawancara kerja internasional, debat bisnis, & presentasi eksekutif.",
      duration: "12 Sesi Interaktif (@90 Menit)",
      focusItems: [
        { title: "Job Interview Preparation", desc: "Simulasi wawancara kerja profesional, jawaban STAR method, & negosiasi gaji." },
        { title: "Business English & Negotiation", desc: "Kosakata bisnis, penyusunan email profesional, dan negosiasi kerja sama." },
        { title: "Debate & Argumentation Mastery", desc: "Seni mempertahankan argumen dengan data, logika, dan persuasi berbobot." },
        { title: "Public Speaking & Keynote Speech", desc: "Teknik pidato memukau, pidato impromptu, dan membawakan acara (MC)." },
        { title: "Professional Communication", desc: "Komunikasi lintas budaya (cross-cultural) & diplomasi profesional." }
      ]
    }
  };

  const faqs = [
    {
      q: "Apa tagline resmi Mahir Speaking?",
      a: "Tagline resmi kami adalah 'Berani Bicara, Siap Berkarya.' Kami percaya kelancaran bicara Bahasa Inggris adalah kunci utama membuka peluang karir dan berkarya secara global.",
    },
    {
      q: "Bagaimana cara mendaftar Trial Class Gratis?",
      a: "Anda dapat mengeklik tombol 'Daftar Trial Class Gratis' di halaman ini, mengisi formulir Placement Test singkat, lalu tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi jadwal trial.",
    },
    {
      q: "Apakah ada tes awal kemampuan (Placement Test)?",
      a: "Ya! Kami menyediakan Placement Test & Diagnostic Diagnostic gratis untuk memetakan level awal Anda (Basic, Intermediate, atau Advanced) sehingga kelas yang Anda ikuti tepat sasaran.",
    },
    {
      q: "Berapa target pendaftaran siswa per bulan?",
      a: "Mahir Speaking menargetkan 50 leads/siswa baru per bulan dengan pelayanan intensif dan kualitas mentoring kelas kecil yang terjaga.",
    },
    {
      q: "Apakah ada nomor WhatsApp Business resmi?",
      a: "Ya, nomor WhatsApp Business resmi Mahir Speaking adalah 0858-6117-1129 yang dapat Anda hubungi 24/7 melalui tombol melayang di pojok kanan bawah.",
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-12 overflow-hidden">
      
      {/* 🚀 SECTION 1: HERO SECTION WITH TAGLINE RESMI & DUAL CTA */}
      <section className="relative pt-2 sm:pt-6 pb-0 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="relative bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/70 backdrop-blur-xl rounded-3xl sm:rounded-4xl border-2 border-slate-200 shadow-2xl p-4 sm:p-8 lg:p-12 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Header Badge Bar */}
          <div className="flex items-center justify-between gap-2 pb-4 sm:pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src="/MP.png"
                alt="Mahir Speaking Logo"
                className="h-8 sm:h-11 w-auto object-contain drop-shadow-sm"
              />
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black border border-emerald-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
                <span>#1 Premier English Speaking Course</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-700 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span>Pendaftaran Trial Class Dibuka</span>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-center pt-4 sm:pt-6 pb-0 min-h-[400px] sm:min-h-[500px] relative z-10">
            
            {/* LEFT COLUMN: TAGLINE RESMI & DUAL CTA */}
            <div className="col-span-12 md:col-span-7 lg:col-span-6 space-y-5 text-left z-20">
              
              {/* TAGLINE RESMI DISERTAKAN PROMINENTLY */}
              <div className="space-y-2">
                <span className="bg-dark text-lime text-[11px] font-black uppercase px-3.5 py-1 rounded-full border border-dark tracking-wider inline-block">
                  ✦ TAGLINE RESMI MAHIR SPEAKING
                </span>
                <h1 className="font-black text-3xl xs:text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tighter uppercase font-sans text-slate-900">
                  BERANI BICARA, <br />
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-500 bg-clip-text text-transparent">
                    SIAP BERKARYA!
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-slate-700 text-xs sm:text-base font-bold max-w-md leading-relaxed">
                Platform bimbingan Bahasa Inggris terpadu bersama Mentor Senior & Native Speaker. Bangun keberanian bicaramu dari nol sampai siap bersaing secara internasional.
              </p>

              {/* DUAL CALL TO ACTION (CTA) UTAMA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                {/* CTA 1: DAFTAR TRIAL CLASS GRATIS */}
                <button
                  onClick={() => setShowPlacementModal(true)}
                  className="px-6 py-4 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-105 transition-all flex items-center justify-center gap-2.5 border-2 border-dark cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-dark animate-spin" />
                  <span>Daftar Trial Class Gratis</span>
                  <div className="w-6 h-6 rounded-full bg-dark text-lime flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>

                {/* CTA 2: KONSULTASI WHATSAPP */}
                <a
                  href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20untuk%20konsultasi%20dan%20daftar%20Trial%20Class%20Gratis."
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-300 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  <span>Konsultasi WhatsApp</span>
                </a>
              </div>

              {/* LEADS PROGRESS COUNTER (TARGET 50 LEADS/BULAN) */}
              <div className="pt-2">
                <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-md max-w-md space-y-2">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      Target Kuota Leads Bulan Ini
                    </span>
                    <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {leadsCount} / 50 Leads
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime transition-all duration-500"
                      style={{ width: `${(leadsCount / 50) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">
                    🔥 Sisa {50 - leadsCount} slot Trial Class Gratis bulan ini. Amankan tempatmu sekarang!
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: STUDENT IMAGE */}
            <div className="col-span-12 md:col-span-5 lg:col-span-6 flex justify-center md:justify-end items-end h-full relative z-20 pt-4 md:pt-0 pb-0 -mb-4 sm:-mb-8 lg:-mb-12">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-emerald-300/80 pointer-events-none z-0"></div>

              <img
                src="/2.png"
                alt="Student Mahir Speaking"
                className="w-auto max-h-[340px] xs:max-h-[400px] sm:max-h-[520px] lg:max-h-[560px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] block align-bottom pointer-events-none z-20 relative -mb-4 sm:-mb-8 lg:-mb-12"
              />
            </div>

          </div>

          {/* TICKER RIBBON */}
          <div className="relative z-10 -mx-4 sm:-mx-8 lg:-mx-12 -mb-4 sm:-mb-8 lg:-mb-12 mt-4 sm:mt-6 bg-lime border-t-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md">
            <div className="inline-flex items-center gap-6 font-stinger font-black text-xs sm:text-lg text-dark tracking-widest uppercase animate-pulse">
              <span>BERANI BICARA, SIAP BERKARYA ✦ MAHIR SPEAKING ✦ TRIAL CLASS GRATIS ✦ NATIVE SPEAKER MEETING ✦ 50 LEADS TARGET ✦</span>
              <span>BERANI BICARA, SIAP BERKARYA ✦ MAHIR SPEAKING ✦ TRIAL CLASS GRATIS ✦ NATIVE SPEAKER MEETING ✦ 50 LEADS TARGET ✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partner logos 5.png & 6.png */}
      <div className="flex flex-row items-center justify-center gap-6 sm:gap-12 md:gap-16 py-0 !-mt-1 sm:!-mt-2 lg:!-mt-3 !-mb-14 sm:!-mb-22 lg:!-mb-26 max-w-7xl mx-auto px-4 relative z-20 pointer-events-none select-none">
        <img
          src="/5.png"
          alt="Pelita Batara Media"
          className="h-32 sm:h-52 md:h-64 lg:h-76 w-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105 pointer-events-auto"
        />
        <img
          src="/6.png"
          alt="Mahir Speaking"
          className="h-32 sm:h-52 md:h-64 lg:h-76 w-auto object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105 pointer-events-auto"
        />
      </div>

      {/* 🎭 SECTION 1B: PERKENALAN KARAKTER MASHIRA */}
      <section className="relative mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6">
        <div className="relative bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 backdrop-blur-xl rounded-3xl sm:rounded-4xl border-2 border-slate-700/80 shadow-2xl p-6 sm:p-10 lg:p-14 text-white overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
            {/* LEFT COLUMN: MASHIRA CHARACTER AVATAR SHOWCASE */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative text-center">
              <div className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-black text-emerald-400 mb-2 shadow-lg backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ONLINE 24/7 • MASHIRA AI</span>
              </div>

              <div className="relative my-2 flex justify-center items-center w-full">
                <div className="absolute inset-0 bg-lime/25 rounded-full blur-3xl pointer-events-none transform scale-90"></div>
                <img
                  src="/4.png"
                  alt="Mashira - AI Speaking Companion"
                  className="h-80 sm:h-[430px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] relative z-10 hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1 z-10 pt-2">
                <h3 className="font-stinger font-black text-3xl sm:text-4xl text-white tracking-widest uppercase drop-shadow-md">
                  MASHIRA
                </h3>
                <p className="text-xs font-mono font-extrabold text-lime tracking-wider uppercase">
                  Official AI Speaking Companion
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: EDITORIAL CHARACTER STORY & INTRODUCTION */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-lime/15 text-lime border border-lime/30 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
                  <Sparkles className="w-4 h-4 text-lime" />
                  <span>TEMAN LATIHAN BICARA KAPAN SAJA</span>
                </div>

                <h2 className="font-stinger font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-tight">
                  Halo! Aku{" "}
                  <span className="text-lime underline decoration-lime/50 decoration-wavy">
                    Mashira
                  </span>
                </h2>
              </div>

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

      {/* 📘 SECTION 2: HALAMAN PROGRAM / CURRICULUMS (DETAIL LEVEL) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand text-lime text-xs font-black px-4 py-1.5 rounded-full uppercase border border-dark shadow-sm">
            <BookOpen className="w-4 h-4 text-lime" />
            <span>RINCIAN MATERI PER LEVEL • CEFR COMPLIANT</span>
          </div>
          <h2 className="font-stinger text-3xl sm:text-5xl font-black text-slate-900">
            Kurikulum & Target Belajar Per Level
          </h2>
          <p className="text-slate-600 text-xs sm:text-base font-bold">
            Setiap level dirancang secara sistematis dari pemula hingga profesional.
          </p>
        </div>

        {/* Level Tabs (Basic | Intermediate | Advanced) */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 bg-slate-100 p-2 rounded-3xl border border-slate-200 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveLevelTab('basic')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeLevelTab === 'basic'
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            Level Basic
          </button>

          <button
            onClick={() => setActiveLevelTab('intermediate')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeLevelTab === 'intermediate'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            Level Intermediate
          </button>

          <button
            onClick={() => setActiveLevelTab('advanced')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeLevelTab === 'advanced'
                ? 'bg-purple-600 text-white shadow-md scale-105'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            Level Advanced
          </button>
        </div>

        {/* Active Curriculum Details Card */}
        <div className="bg-white p-6 sm:p-10 rounded-4xl border-2 border-slate-200 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className={`inline-block text-[11px] font-black uppercase px-3 py-1 rounded-full border mb-2 ${curriculumData[activeLevelTab].badgeColor}`}>
                {curriculumData[activeLevelTab].badge}
              </span>
              <h3 className="font-stinger font-black text-2xl sm:text-3xl text-slate-900">
                {curriculumData[activeLevelTab].title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-2xl mt-1">
                Target Capaian: {curriculumData[activeLevelTab].target}
              </p>
            </div>
            <div className="bg-slate-100 border border-slate-200 p-3 px-4 rounded-2xl text-xs font-black text-slate-800 flex items-center gap-2 flex-shrink-0">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{curriculumData[activeLevelTab].duration}</span>
            </div>
          </div>

          {/* Focus Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumData[activeLevelTab].focusItems.map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-2 hover:border-emerald-500 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-300">
                  0{index + 1}
                </div>
                <h4 className="font-black text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-extrabold text-slate-600">
              Ingin konsultasi pemilihan level mana yang paling cocok untuk Anda?
            </p>
            <button
              onClick={() => setShowPlacementModal(true)}
              className="px-6 py-3 rounded-2xl bg-brand text-lime font-black text-xs hover:bg-dark transition-all border border-dark"
            >
              Ikuti Placement Test Gratis ➔
            </button>
          </div>
        </div>
      </section>

      {/* ❓ SECTION 4: FAQ ACCORDION */}
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
              className="rounded-2xl overflow-hidden transition-all bg-white border border-slate-200 shadow-sm"
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

      {/* 📝 MODAL FORMULIR PLACEMENT TEST / LEADS CAPTURE */}
      {showPlacementModal && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowPlacementModal(false)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-4xl border-4 border-dark shadow-2xl p-6 sm:p-8 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPlacementModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {placementStep === 1 && (
              <form onSubmit={handleLeadSubmit} className="space-y-5">
                <div className="space-y-2 text-center">
                  <span className="bg-lime text-dark text-[10px] font-black px-3 py-1 rounded-full uppercase border border-dark">
                    Formulir Trial Class Gratis
                  </span>
                  <h3 className="font-stinger font-black text-2xl text-slate-900">
                    Placement Test & Pendaftaran Leads
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    Isi data diri Anda untuk mengamankan slot Trial Class & mengejar target 50 leads/bulan.
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama lengkap Anda"
                      value={leadFormData.nama}
                      onChange={(e) => setLeadFormData({ ...leadFormData, nama: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold focus:border-brand outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Nomor WhatsApp Active *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 085861171129"
                      value={leadFormData.noWa}
                      onChange={(e) => setLeadFormData({ ...leadFormData, noWa: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold focus:border-brand outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">Target Level Belajar</label>
                      <select
                        value={leadFormData.levelTarget}
                        onChange={(e) => setLeadFormData({ ...leadFormData, levelTarget: e.target.value })}
                        className="w-full px-3 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold focus:border-brand outline-none bg-white"
                      >
                        <option value="basic">Basic (Beginner)</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">Pilihan Jadwal Trial</label>
                      <select
                        value={leadFormData.jadwalTrial}
                        onChange={(e) => setLeadFormData({ ...leadFormData, jadwalTrial: e.target.value })}
                        className="w-full px-3 py-3 rounded-2xl border-2 border-slate-200 text-xs font-bold focus:border-brand outline-none bg-white"
                      >
                        <option value="Sabtu (10.00 WIB)">Sabtu (10.00 WIB)</option>
                        <option value="Minggu (14.00 WIB)">Minggu (14.00 WIB)</option>
                        <option value="Weekday (19.00 WIB)">Weekday (19.00 WIB)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Catatan / Target Belajar (Opsional)</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Ingin lancar wawancara kerja & presentasi"
                      value={leadFormData.catatan}
                      onChange={(e) => setLeadFormData({ ...leadFormData, catatan: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 text-xs font-bold focus:border-brand outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-lime text-dark font-black text-xs shadow-limeGlow border-2 border-dark cursor-pointer hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <span>Lanjut Ke Mini Placement Quiz ➔</span>
                </button>
              </form>
            )}

            {placementStep === 2 && (
              <div className="space-y-6 text-left">
                <div className="space-y-1 text-center">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    Langkah 2 dari 2: Tes Diagnosis Singkat
                  </span>
                  <h3 className="font-stinger font-black text-2xl text-slate-900">
                    Mini Diagnostic Test
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-900">1. Bagaimana Anda menyapa seseorang dalam konteks formal?</p>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-100">
                        <input type="radio" name="q1" value="a" onChange={() => setQuizAnswers({ ...quizAnswers, q1: 'a' })} />
                        <span>A. What's up bro?</span>
                      </label>
                      <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-100">
                        <input type="radio" name="q1" value="b" onChange={() => setQuizAnswers({ ...quizAnswers, q1: 'b' })} />
                        <span>B. Good morning, pleased to meet you.</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-900">2. Kalimat mana yang menyatakan pengalaman masa lalu?</p>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-100">
                        <input type="radio" name="q2" value="c" onChange={() => setQuizAnswers({ ...quizAnswers, q2: 'c' })} />
                        <span>A. I have worked in tech for 3 years.</span>
                      </label>
                      <label className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border cursor-pointer hover:bg-slate-100">
                        <input type="radio" name="q2" value="d" onChange={() => setQuizAnswers({ ...quizAnswers, q2: 'd' })} />
                        <span>B. I go to work tomorrow.</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinishPlacement}
                  className="w-full py-3.5 rounded-2xl bg-brand text-lime font-black text-xs border-2 border-dark cursor-pointer hover:scale-[1.02] transition-all"
                >
                  Lihat Rekomendasi Level Saya ➔
                </button>
              </div>
            )}

            {placementStep === 3 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <span className="bg-lime text-[#08203C] text-[10px] font-black px-3 py-1 rounded-full uppercase border border-dark">
                    Pendaftaran Lead Berhasil
                  </span>
                  <h3 className="font-stinger font-black text-2xl text-slate-900">
                    Hasil Rekomendasi: <span className="text-brand">{recommendedLevel}</span>
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                    Terima kasih <strong>{leadFormData.nama}</strong>! Data Anda telah terdaftar untuk Trial Class <strong>{leadFormData.jadwalTrial}</strong>.
                  </p>
                </div>

                <a
                  href={`https://wa.me/6285861171129?text=${encodeURIComponent(`Halo Mahir Speaking! Saya ${leadFormData.nama} (WA: ${leadFormData.noWa}) telah mendaftar Placement Test dengan rekomendasi ${recommendedLevel} untuk Trial Class ${leadFormData.jadwalTrial}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 border-2 border-emerald-700"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Konfirmasi Jadwal Ke WhatsApp Business (0858-6117-1129)</span>
                </a>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}