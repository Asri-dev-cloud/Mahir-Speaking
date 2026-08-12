// Halaman Home: Halaman utama platform pembelajaran Mahir Speaking, menampilkan penawaran program unggulan, tes penempatan gratis, keunggulan asisten AI, testimony siswa, dan FAQ.
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PlacementTestModal from "../../components/modals/PlacementTestModal";
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

const st30Clusters = [
  {
    code: "H",
    name: "Headman",
    desc: "Aktivitas berinteraksi dengan orang lain dalam rangka mengendalikan, memengaruhi, ataupun mengawasi.",
    theme: "blue",
  },
  {
    code: "N",
    name: "Networking",
    desc: "Aktivitas berinteraksi dengan orang lain dalam rangka bekerja sama, membimbing, melatih, atau mewakili.",
    theme: "blue",
  },
  {
    code: "S",
    name: "Servicing",
    desc: "Aktivitas berinteraksi dengan orang lain dalam rangka merawat, melayani, atau menolong.",
    theme: "blue",
  },
  {
    code: "Gi",
    name: "Generating Idea",
    desc: "Aktivitas individual menggunakan pemikiran terkait intuisi, ide, dan kreativitas.",
    theme: "green",
  },
  {
    code: "T",
    name: "Thinking",
    desc: "Aktivitas individual menggunakan pemikiran logika, fakta, ataupun terkait dengan analisa terhadap angka dan data.",
    theme: "green",
  },
  {
    code: "R",
    name: "Reasoning",
    desc: "Aktivitas individual menggunakan logika untuk mencari atau membuktikan sesuatu.",
    theme: "green",
  },
  {
    code: "E",
    name: "Elementary",
    desc: "Aktivitas individual yang tidak banyak melibatkan olah pikir, namun memerlukan ketekunan, ketelitian, dan biasanya berada di dalam ruangan.",
    theme: "yellow",
  },
  {
    code: "Te",
    name: "Technical",
    desc: "Aktivitas individual yang tidak banyak melibatkan olah pikir, namun memerlukan ketekunan, ketelitian, kegigihan, dan biasanya berada di luar ruangan.",
    theme: "yellow",
  }
];

const themeStyles = {
  blue: {
    bg: "bg-blue-50/40",
    border: "border-slate-100 hover:border-blue-500",
    badgeBg: "bg-blue-100 text-blue-700",
    glow: "hover:shadow-[0_15px_30px_rgba(59,130,246,0.12)]",
    lineColor: "bg-blue-500",
    textGradient: "from-blue-600 to-indigo-600",
  },
  green: {
    bg: "bg-emerald-50/40",
    border: "border-slate-100 hover:border-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-700",
    glow: "hover:shadow-[0_15px_30px_rgba(16,185,129,0.12)]",
    lineColor: "bg-emerald-500",
    textGradient: "from-emerald-600 to-teal-600",
  },
  yellow: {
    bg: "bg-amber-50/40",
    border: "border-slate-100 hover:border-amber-500",
    badgeBg: "bg-amber-100 text-amber-700",
    glow: "hover:shadow-[0_15px_30px_rgba(245,158,11,0.12)]",
    lineColor: "bg-amber-500",
    textGradient: "from-amber-600 to-yellow-600",
  }
};

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
    setLeadsCount(prev => prev + 1);
    setPlacementStep(2);
  };

  const handleFinishPlacement = () => {
    let score = 0;
    if (quizAnswers.q1 === 'b') score += 1;
    if (quizAnswers.q2 === 'c') score += 1;
    if (quizAnswers.q3 === 'a') score += 1;

    let levelRec = 'Basic Level';
    if (score === 3) levelRec = 'Advanced Level';
    else if (score === 2) levelRec = 'Intermediate Level';

    setRecommendedLevel(levelRec);
    setPlacementStep(3);
    setLeadSubmitted(true);

    // Save lead to localStorage for Admin Dashboard retrieval
    const cleanWa = leadFormData.noWa ? leadFormData.noWa.replace(/[^0-9]/g, '') : '';
    const existingLeads = JSON.parse(localStorage.getItem('mahir_leads') || '[]');
    const newLead = {
      id: Date.now(),
      nama: leadFormData.nama,
      noWa: cleanWa,
      levelTarget: leadFormData.levelTarget || 'Basic',
      jadwalTrial: leadFormData.jadwalTrial || 'Sabtu (10.00 WIB)',
      recommendedLevel: levelRec,
      score: `${score}/3`,
      catatan: leadFormData.catatan || 'Tidak ada catatan khusus',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Belum Dihubungi'
    };

    const filtered = existingLeads.filter(l => l.noWa !== cleanWa);
    localStorage.setItem('mahir_leads', JSON.stringify([newLead, ...filtered]));
  };

  const curriculumData = {
    basic: {
      title: "Level Basic (Beginner Level)",
      badge: "Fondasi Utama & Keberanian Bicara",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      target: "Berani berbicara Bahasa Inggris tanpa rasa canggung, menguasai frasa harian dasar, serta pengucapan yang jelas.",
      duration: "8  Sesi Interaktif (@90 Menit)",
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

  const renderClusterCard = (cluster, index) => {
    const themes = ['blue', 'green', 'yellow'];
    const theme = themes[index % themes.length];
    const style = themeStyles[theme];
    return (
      <div 
        key={cluster.code}
        className={`group relative bg-white border-2 ${style.border} ${style.glow} rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-start transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-sm h-full`}
      >
        {/* Top Accent Line */}
        <div className={`absolute top-0 inset-x-0 h-1.5 ${style.lineColor}`} />
        
        {/* Corner Ambient Glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 ${style.bg} rounded-bl-full pointer-events-none transition-all duration-500 group-hover:scale-110`} />

        <div className="relative z-10 w-full flex flex-col items-start">
          {/* Emblem Badge */}
          <div className={`w-12 h-12 rounded-2xl ${style.badgeBg} flex items-center justify-center font-black text-xl mb-4 border border-white/50 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
            {cluster.code}
          </div>

          {/* Title */}
          <h3 className="font-sans font-black text-lg sm:text-xl text-slate-900 mb-3 tracking-wide uppercase leading-tight">
            {cluster.name}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
            {cluster.desc}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-12 overflow-hidden bg-gradient-to-b from-[#87CEFA] via-white to-white">

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
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-700 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span>Pendaftaran Trial Class Dibuka</span>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-6 md:gap-8 items-center pt-4 sm:pt-6 pb-0 min-h-[400px] sm:min-h-[500px] relative z-10">

            {/* LEFT COLUMN: HERO TITLE & DUAL CTA */}
            <div className="col-span-12 md:col-span-7 lg:col-span-6 space-y-5 text-left z-20">

              <div className="space-y-2">
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
                  href="https://wa.me/6281572120190?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20untuk%20konsultasi%20dan%20daftar%20Trial%20Class%20Gratis."
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-xs sm:text-sm border-2 border-slate-300 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  <span>Konsultasi WhatsApp</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: STUDENT IMAGE */}
            <div className="col-span-12 md:col-span-5 lg:col-span-6 flex justify-center md:justify-end items-end h-full relative z-20 pt-4 md:pt-0 pb-0 -mb-4 sm:-mb-8 lg:-mb-12">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-emerald-300/80 pointer-events-none z-0"></div>

              <img
                src="/mashira orang.png"
                alt="Student Mahir Speaking"
                className="w-auto max-h-[340px] xs:max-h-[400px] sm:max-h-[520px] lg:max-h-[560px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] block align-bottom pointer-events-none z-20 relative -mb-4 sm:-mb-8 lg:-mb-12"
              />
            </div>

          </div>

          {/* TICKER RIBBON (PITA MAHIR SPEAKING) */}
          <div className="relative z-10 -mx-4 sm:-mx-8 lg:-mx-12 -mb-4 sm:-mb-8 lg:-mb-12 mt-4 sm:mt-6 bg-lime border-t-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md">
            <div className="inline-flex items-center gap-6 font-stinger font-black text-xs sm:text-lg text-dark tracking-widest uppercase animate-pulse">
              <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
              <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
            </div>
          </div>
        </div>
      </section>

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
                  src="/mashira chibi.png"
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

      {/* Partner logos pelita.png, bms.png & p3.png */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-8 md:gap-12 lg:gap-16 py-2 sm:py-3 !mt-3 sm:!mt-6 max-w-7xl mx-auto px-4 relative z-20 pointer-events-none select-none">
        <img
          src="/pelita.png"
          alt="Pelita Batara Media"
          className="h-16 sm:h-36 md:h-48 lg:h-60 w-auto max-w-[30%] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105 pointer-events-auto"
        />
        <img
          src="/bms.png"
          alt="Mahir Speaking"
          className="h-16 sm:h-36 md:h-48 lg:h-60 w-auto max-w-[30%] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105 pointer-events-auto"
        />
        <img
          src="/p3.png"
          alt="Pelita Potensi Project"
          className="h-16 sm:h-36 md:h-48 lg:h-60 w-auto max-w-[30%] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105 pointer-events-auto"
        />
      </div>

      {/* 🤝 SECTION 1C: TENTANG MAHIR SPEAKING X P3 */}
      <section className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 !mt-3 sm:!mt-6">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand-600 text-xs font-black px-4 py-1.5 rounded-full uppercase border border-brand-200 shadow-sm">
            <Users className="w-4 h-4" />
            <span>KOLABORASI EKSKLUSIF</span>
          </div>
          <h2 className="font-stinger text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Tentang <span className="bg-gradient-to-r from-emerald-600 to-brand-600 bg-clip-text text-transparent">Mahir Speaking x P3</span>
          </h2>
          <p className="text-brand-600 font-extrabold text-sm sm:text-base uppercase tracking-wider">
            Bukan Sekadar Kursus: Temukan Potensimu, Kuasai Bahasa Inggrisnya
          </p>
          <p className="text-slate-600 text-sm sm:text-lg font-semibold leading-relaxed max-w-2xl mx-auto">
            Bahasa Inggris bukan cuma buat lulus ujian, tapi alat buat buka peluang dan komunikasi global. 
            <strong className="text-slate-900 font-extrabold"> MS × P3</strong> gabungin keberanian bicara (<span className="text-brand-600 font-bold">Mahir Speaking</span>) sama pemetaan kekuatan diri (<span className="text-emerald-600 font-bold">Pelita Potensi Project</span>).
          </p>
        </div>

        {/* Card Grid / 3 Kolom Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Card 1: Masalahnya */}
          <div className="group relative bg-white border-2 border-slate-200 hover:border-red-500 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-popout flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-500 font-bold shrink-0">
                  <X className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="font-mono text-xs font-black tracking-widest text-red-500 uppercase">
                  1. Masalahnya
                </span>
              </div>
              
              <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                Belajar Kaku & Salah Arah
              </h3>
              
              <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
                Capek belajar pakai cara teoritis yang sama buat semua orang? Wajar kalau kamu sering bingung, takut salah bicara, dan hilang arah karier.
              </p>
            </div>
          </div>

          {/* Card 2: Solusinya */}
          <div className="group relative bg-slate-950 border-2 border-slate-800 hover:border-lime rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-limeGlow flex flex-col justify-between overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-lime/10 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-lime/20 border border-lime/30 flex items-center justify-center text-lime font-bold shrink-0">
                  <Lightbulb className="w-5 h-5 text-lime fill-lime/10" />
                </div>
                <span className="font-mono text-xs font-black tracking-widest text-lime uppercase">
                  2. Solusinya
                </span>
              </div>
              
              <h3 className="font-sans font-black text-xl sm:text-2xl text-white leading-tight">
                Pendekatan 8 Cluster ST30
              </h3>
              
              <p className="text-slate-300 text-xs sm:text-sm font-semibold leading-relaxed">
                Kami bantu kenali gaya belajar alamimu berbasis karakter kognitif & afektif. Kamu belajar speaking praktis yang pas dengan tipe bakat unikmu.
              </p>
            </div>
          </div>

          {/* Card 3: Dampaknya */}
          <div className="group relative bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-popout flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-mono text-xs font-black tracking-widest text-emerald-600 uppercase">
                  3. Dampaknya
                </span>
              </div>
              
              <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-900 leading-tight">
                Masa Depan Lebih Jelas
              </h3>
              
              <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
                Nggak cuma bikin kamu "Berani Bicara, Siap Berkarya," tapi juga mendampingi sampai kamu nemuin arah karier terbaik: "Find Your Career with Your Strengths."
              </p>
            </div>
          </div>
        </div>

              <div className="relative bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-glow border-2 border-brand-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,245,0,0.15),transparent_50%)] pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2 shrink-0">
              <span className="font-mono text-xs font-black tracking-widest text-lime uppercase bg-slate-950/40 px-3 py-1.5 rounded-full border border-lime/30 flex items-center gap-1.5 w-fit">
                <Trophy className="w-3.5 h-3.5 text-lime" />
                <span>RESULTS ORIENTED</span>
              </span>
              <h3 className="font-sans font-black text-2xl sm:text-3xl text-white">
                3 Hasil Utama yang <br className="hidden sm:inline" />
                Bakal Kamu Dapat:
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Hasil 1 */}
              <div className="flex gap-4 items-start bg-slate-950/30 hover:bg-slate-950/40 border border-white/10 hover:border-white/20 p-5 rounded-2xl transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-lime text-dark flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-dark stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-lime uppercase tracking-wider">
                    Percaya Diri
                  </h4>
                  <p className="text-slate-100 text-xs font-semibold leading-relaxed">
                    Lancar speaking dalam situasi sehari-hari & kerja.
                  </p>
                </div>
              </div>
 
              {/* Hasil 2 */}
              <div className="flex gap-4 items-start bg-slate-950/30 hover:bg-slate-950/40 border border-white/10 hover:border-white/20 p-5 rounded-2xl transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-lime text-dark flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-dark stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-lime uppercase tracking-wider">
                    Kenal Potensi
                  </h4>
                  <p className="text-slate-100 text-xs font-semibold leading-relaxed">
                    Paham bakat dominan lewat Talents Mapping.
                  </p>
                </div>
              </div>
 
              {/* Hasil 3 */}
              <div className="flex gap-4 items-start bg-slate-950/30 hover:bg-slate-950/40 border border-white/10 hover:border-white/20 p-5 rounded-2xl transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-lime text-dark flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-dark stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-lime uppercase tracking-wider">
                    Career Action Plan
                  </h4>
                  <p className="text-slate-100 text-xs font-semibold leading-relaxed">
                    Punya panduan langkah karier yang jelas (termasuk remote work).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔮 SECTION 1D: DAFTAR 8 CLUSTER BESAR ST-30 */}
      <section className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand-600 text-xs font-black px-4 py-1.5 rounded-full uppercase border border-brand-200 shadow-sm">
            <Target className="w-4 h-4 text-brand-600" />
            <span>TALENTS MAPPING MAP</span>
          </div>
          <h2 className="font-stinger text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
            Daftar 8 Cluster Besar <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">ST-30</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-lg font-semibold leading-relaxed max-w-2xl mx-auto">
            Temukan karakter unikmu dan gaya belajar alamimu berbasis kognitif & afektif untuk melejitkan karier dan kemampuan bicaramu.
          </p>
        </div>

        {/* Bento Card Grid (Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pb-8">
          {st30Clusters.map((cluster, index) => renderClusterCard(cluster, index))}
        </div>

        {/* CTA Berkesan "Yuk, Kenali Dirimu Lebih Dalam" */}
        <div className="mt-8 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-end gap-6 text-center md:text-right w-full">
          <div className="space-y-1">
            <span className="text-brand font-black text-xs uppercase tracking-wider flex items-center gap-1.5 justify-center md:justify-end">
              <Target className="w-3.5 h-3.5 text-brand" />
              <span>EVALUASI BAKAT & POTENSI</span>
            </span>
            <h3 className="font-sans font-black text-xl sm:text-2xl text-slate-900 leading-tight">
              Yuk, Kenali Dirimu Lebih Dalam!
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-xl mx-auto md:ml-auto md:mr-0">
              Temukan secara lengkap 30 potensi kekuatan (ST-30) dan rancang peta karier masa depanmu yang terbaik.
            </p>
          </div>
          
          <a
            href="https://talentsmapping.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 rounded-2xl bg-[#FFFF00] text-slate-950 font-black text-xs sm:text-sm border-2 border-dark shadow-md hover:scale-105 hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full md:w-auto text-center"
          >
            <span>Mulai Talents Mapping</span>
            <ArrowUpRight className="w-4.5 h-4.5 stroke-[3]" />
          </a>
        </div>

      </section>

      {/* TICKER RIBBON (PITA MAHIR SPEAKING) - FULL VIEWPORT WIDTH */}
      <div className="relative z-10 w-full bg-lime border-y-4 border-dark py-3.5 overflow-hidden whitespace-nowrap shadow-md mt-12 sm:mt-16">
        <div className="inline-flex items-center gap-6 font-stinger font-black text-xs sm:text-lg text-dark tracking-widest uppercase animate-pulse">
          <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
          <span>MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦ MAHIR SPEAKING ✦</span>
        </div>
      </div>

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
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${activeLevelTab === 'basic'
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'text-slate-700 hover:bg-white'
              }`}
          >
            Level Basic
          </button>

          <button
            onClick={() => setActiveLevelTab('intermediate')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${activeLevelTab === 'intermediate'
              ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
              : 'text-slate-700 hover:bg-white'
              }`}
          >
            Level Intermediate
          </button>

          <button
            onClick={() => setActiveLevelTab('advanced')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer ${activeLevelTab === 'advanced'
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
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 📝 MODAL FORMULIR PLACEMENT TEST / LEADS CAPTURE */}
      <PlacementTestModal
        isOpen={showPlacementModal}
        onClose={() => setShowPlacementModal(false)}
      />

    </div>
  );
}