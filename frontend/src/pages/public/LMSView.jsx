import React, { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coffee,
  Compass,
  Flame,
  GraduationCap,
  Headphones,
  HeartPulse,
  HelpCircle,
  Lock,
  Map,
  MessageCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UsersRound,
  Volume2,
  X,
  Zap,
  Download,
  Video,
  FileText,
  ShieldAlert,
  UserCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const lessons = [
  {
    id: 1,
    level: "A1",
    phase: "Survive",
    title: "Hello! Let’s Introduce Ourselves",
    shortTitle: "Self Introduction",
    icon: UserRound,
    duration: 25,
    xp: 80,
    color: "from-blue-600 to-blue-800",
    mission: "Memperkenalkan diri selama 30–45 detik dengan percaya diri.",
    description:
      "Mulai percakapan, menyebutkan nama, asal, kesibukan, dan menanggapi perkenalan secara alami.",
    objectives: [
      "Menyapa secara formal dan santai",
      "Menyebutkan nama, asal, dan kesibukan",
      "Menanyakan informasi dasar dengan sopan",
    ],
    vocabulary: [
      ["Good morning", "Selamat pagi", "Good morning, everyone."],
      ["My name is…", "Nama saya…", "My name is Fajar."],
      ["I’m from…", "Saya berasal dari…", "I’m from Cianjur."],
      ["What do you do?", "Apa kesibukanmu?", "What do you do, Rina?"],
      ["Nice to meet you", "Senang bertemu denganmu", "Nice to meet you too."],
    ],
    expressions: [
      "Hi, I’m ___.",
      "I’m from ___.",
      "I’m a student / fresh graduate / job seeker.",
      "In my free time, I like ___.",
      "Nice to meet you.",
    ],
    grammar: {
      title: "To be: am, is, are",
      points: [
        "I am / I’m Dinda.",
        "She is / She’s a student.",
        "You are / You’re very friendly.",
        "Are you a student? Is she from Bandung?",
      ],
    },
    pronunciation:
      "Latih contractions agar terdengar alami: I am → I’m, you are → you’re, she is → she’s.",
    dialogue: [
      ["Alya", "Hi! My name is Alya. What’s your name?"],
      ["Raka", "Hello, Alya. I’m Raka. Nice to meet you."],
      ["Alya", "Nice to meet you too. Where are you from?"],
      ["Raka", "I’m from Bandung. I’m a university student."],
    ],
    quiz: {
      question: "Complete the sentence: “I ___ from Bandung.”",
      options: ["am", "is", "are"],
      answer: 0,
      explanation: "Gunakan “am” setelah subjek I.",
    },
  },
  {
    id: 2,
    level: "A1",
    phase: "Survive",
    title: "My Daily Routine",
    shortTitle: "Daily Routine",
    icon: Clock3,
    duration: 25,
    xp: 80,
    color: "from-sky-500 to-blue-700",
    mission: "Menceritakan rutinitas harian dari pagi sampai malam.",
    description:
      "Gunakan aktivitas harian, jam, dan frequency words untuk menceritakan kebiasaanmu.",
    objectives: [
      "Menyebutkan aktivitas sehari-hari",
      "Menggunakan penanda waktu",
      "Menanyakan kebiasaan orang lain",
    ],
    vocabulary: [
      ["wake up", "bangun tidur", "I wake up at five."],
      ["have breakfast", "sarapan", "We have breakfast together."],
      ["go to school/work", "pergi sekolah/kerja", "She goes to work at eight."],
      ["study", "belajar", "I study English every day."],
      ["go to bed", "tidur", "I go to bed before eleven."],
    ],
    expressions: [
      "I usually wake up at ___.",
      "After that, I ___.",
      "I go to ___ at ___.",
      "In the evening, I ___.",
      "I go to bed at ___.",
    ],
    grammar: {
      title: "Simple Present",
      points: [
        "I/You/We/They study every day.",
        "He/She studies every day.",
        "Do you work? Does she study?",
        "Frequency: always, usually, often, sometimes, never.",
      ],
    },
    pronunciation:
      "Final -s dapat berbunyi /s/ pada works, /z/ pada plays, dan /ɪz/ pada watches.",
    dialogue: [
      ["Nisa", "What time do you usually wake up?"],
      ["Bimo", "I usually wake up at five thirty. How about you?"],
      ["Nisa", "I wake up at six. Then I take a shower and have breakfast."],
      ["Bimo", "Do you study English every day?"],
    ],
    quiz: {
      question: "Choose the correct sentence.",
      options: [
        "She study English every day.",
        "She studies English every day.",
        "She studying English every day.",
      ],
      answer: 1,
      explanation: "Gunakan akhiran -es pada kata kerja untuk subjek He/She/It.",
    },
  },
  {
    id: 3,
    level: "A1",
    phase: "Survive",
    title: "Family & People in My Life",
    shortTitle: "Family & People",
    icon: UsersRound,
    duration: 30,
    xp: 90,
    color: "from-indigo-500 to-blue-700",
    mission: "Menceritakan tentang keluarga atau teman terdekat.",
    description:
      "Gunakan kata sifat kepribadian dan kosakata keluarga untuk mendeskripsikan orang terdekat.",
    objectives: [
      "Menyebutkan anggota keluarga",
      "Menggunakan possessive adjectives",
      "Mendeskripsikan sifat seseorang",
    ],
    vocabulary: [
      ["older brother", "kakak laki-laki", "My older brother is an engineer."],
      ["younger sister", "adik perempuan", "Her younger sister likes singing."],
      ["kind / friendly", "baik / ramah", "He is very friendly."],
      ["hard-working", "pekerja keras", "My mother is hard-working."],
      ["close friend", "teman dekat", "Rian is my close friend."],
    ],
    expressions: [
      "This is my ___.",
      "He/She is ___.",
      "His/Her name is ___.",
      "He/She likes ___.",
      "We often ___ together.",
    ],
    grammar: {
      title: "Possessive Adjectives",
      points: [
        "my, your, his, her, our, their",
        "This is my brother. His name is Maya.",
        "Her sister lives in Jakarta.",
        "Our family loves travelling.",
      ],
    },
    pronunciation:
      "Latih bunyi /ð/ pada this, mother, dan brother dengan ujung lidah ringan di antara gigi.",
    dialogue: [
      ["Dita", "Do you have any brothers or sisters?"],
      ["Reno", "Yes. I have one older sister. Her name is Maya."],
      ["Dita", "What is she like?"],
      ["Reno", "She is friendly, patient, and very hard-working."],
    ],
    quiz: {
      question: "Maya is my sister. ___ hobby is reading.",
      options: ["His", "Her", "Their"],
      answer: 1,
      explanation: "Gunakan “her” untuk kepemilikan perempuan.",
    },
  }
];

const recordedSessions = [
  {
    id: 1,
    title: "Sesi 1: Self Introduction & Confidence Drill",
    tutor: "Ms. Era Purike",
    duration: "90 Menit",
    level: "Basic Level",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    date: "12 Juli 2025"
  },
  {
    id: 2,
    title: "Sesi 2: Daily Conversation & Restaurant Roleplay",
    tutor: "Ms. Deasy Puspawati",
    duration: "90 Menit",
    level: "Basic Level",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    date: "19 Juli 2025"
  },
  {
    id: 3,
    title: "Sesi 3: Storytelling & Public Speaking Foundation",
    tutor: "Ms. Ade Ihdinayah",
    duration: "90 Menit",
    level: "Intermediate Level",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    date: "26 Juli 2025"
  },
  {
    id: 4,
    title: "Sesi 4: Native Speaker Meeting Session",
    tutor: "Native Speaker (Mr. James)",
    duration: "90 Menit",
    level: "All Levels",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    date: "2 Agustus 2025"
  }
];

const studentDownloads = [
  {
    id: 1,
    title: "E-Book Speaking Master (Complete 4 Level)",
    size: "14.5 MB",
    type: "PDF Document",
    desc: "Panduan lengkap modul 4 level CEFR dengan ratusan frasa & rumus percakapan.",
    badge: "Official Modul"
  },
  {
    id: 2,
    title: "Vocabulary & Daily Expression Pack 500+",
    size: "8.2 MB",
    type: "PDF & MP3 Bundle",
    desc: "Kumpulan 500+ kosakata penting disertai audio contoh pelafalan native.",
    badge: "Audio Included"
  },
  {
    id: 3,
    title: "Job Interview & Business English Cheat-Sheet",
    size: "5.1 MB",
    type: "PDF Document",
    desc: "Template jawaban wawancara kerja metode STAR & panduan negosiasi.",
    badge: "Career Prep"
  }
];

const sectionTabs = [
  ["overview", "Overview", Map],
  ["vocabulary", "Vocabulary", BookOpen],
  ["conversation", "Conversation", MessageCircle],
  ["practice", "Practice", Mic],
  ["quiz", "Quick Quiz", HelpCircle],
];

export default function LMSView() {
  const { user, setActiveTab } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [activeHubTab, setActiveHubTab] = useState("path"); // path | downloads | recordings
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonTab, setLessonTab] = useState("overview");
  const [completedIds, setCompletedIds] = useState([1, 2]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [quizChoice, setQuizChoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState("");
  const [showAllUnits, setShowAllUnits] = useState(false);
  const [activeRecordedVideo, setActiveRecordedVideo] = useState(null);
  const [downloadNotice, setDownloadNotice] = useState(null);

  const filteredLessons = useMemo(() => {
    if (filter === "ALL") return lessons;
    return lessons.filter(
      (lesson) => lesson.level === filter || lesson.phase === filter,
    );
  }, [filter]);

  const progress = Math.round((completedIds.length / lessons.length) * 100);
  const currentLesson =
    lessons.find((lesson) => !completedIds.includes(lesson.id)) ||
    lessons[lessons.length - 1];
  const visibleLessons = showAllUnits
    ? filteredLessons
    : filteredLessons.slice(0, 8);

  const handleDownload = (item) => {
    setDownloadNotice(`Mengunduh ${item.title}...`);
    setTimeout(() => {
      setDownloadNotice(`✅ ${item.title} berhasil diunduh ke perangkat Anda!`);
      setTimeout(() => setDownloadNotice(null), 4000);
    }, 1500);
  };

  const openLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonTab("overview");
    setQuizChoice(null);
    setRecordingResult("");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const closeLesson = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setSelectedLesson(null);
  };

  const playText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.88;
    speech.onend = () => setIsSpeaking(false);
    speech.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(speech);
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecordingResult(
        "Gunakan Chrome dan aktifkan izin mikrofon untuk mencoba fitur ini.",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingResult("Mendengarkan...");
    };
    recognition.onresult = (event) => {
      setRecordingResult(`Terdengar: “${event.results[0][0].transcript}”`);
    };
    recognition.onerror = () => {
      setRecordingResult(
        "Suara belum terbaca. Coba bicara lebih dekat ke mikrofon.",
      );
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const finishLesson = () => {
    if (!selectedLesson || completedIds.includes(selectedLesson.id)) return;
    setCompletedIds((ids) => [...ids, selectedLesson.id]);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.72 },
      colors: ["#0362C0", "#FFFF00", "#FFA715", "#87CEFA"],
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#EAF6FF] text-slate-950 pb-16">
      
      {/* 🌟 HERO BANNER & STUDENT AREA CONTROLS */}
      <section className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0362C0] via-blue-700 to-slate-950 p-5 text-white shadow-2xl sm:rounded-[40px] sm:p-9 lg:p-12 border border-white/20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#87CEFA]/25 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFFF00] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0362C0] sm:text-xs">
                <Sparkles className="h-4 w-4" />
                LMS STUDENT AREA • MAHIR SPEAKING
              </div>
              <h1 className="mt-5 max-w-4xl font-stinger text-4xl font-black uppercase leading-[0.94] sm:text-6xl lg:text-7xl">
                Akses Materi & <span className="block text-[#FFFF00]">Ruang Belajar Siswa</span>
              </h1>
              <p className="mt-5 max-w-2xl font-poppins text-sm leading-7 text-blue-100 sm:text-base">
                Unduh E-Book & Vocabulary Pack, putar ulang rekaman sesi kelas tatap muka, dan ikuti unit latihan interaktif 24/7.
              </p>

              {!user && (
                <div className="mt-4 p-3 bg-amber-400/20 border border-amber-300/40 rounded-2xl flex items-center justify-between text-xs text-amber-200">
                  <span className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-300" />
                    Anda sedang mengakses mode tamu. Login untuk menyimpan riwayat belajar!
                  </span>
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="px-3 py-1.5 bg-[#FFFF00] text-dark font-black rounded-xl text-[11px]"
                  >
                    Login Siswa ➔
                  </button>
                </div>
              )}

              {/* Main Tab Controls in LMS */}
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveHubTab("path")}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition cursor-pointer ${
                    activeHubTab === 'path' ? 'bg-[#FFFF00] text-[#0362C0] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Misi Learning Path
                </button>

                <button
                  type="button"
                  onClick={() => setActiveHubTab("downloads")}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition cursor-pointer ${
                    activeHubTab === 'downloads' ? 'bg-[#FFFF00] text-[#0362C0] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  Download E-Book & Vocab Pack
                </button>

                <button
                  type="button"
                  onClick={() => setActiveHubTab("recordings")}
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition cursor-pointer ${
                    activeHubTab === 'recordings' ? 'bg-[#FFFF00] text-[#0362C0] shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Rekaman Sesi Kelas
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[260px] lg:block">
              <img
                src="/4.png"
                alt="Mashira, AI speaking companion"
                className="absolute bottom-0 left-1/2 h-[320px] w-auto -translate-x-1/2 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 📥 TAB 1: DOWNLOAD CENTER (E-BOOK & VOCAB PACK) */}
      {activeHubTab === "downloads" && (
        <section className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-4xl border-2 border-slate-200 shadow-xl space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-blue-200">
                STUDENT RESOURCES
              </span>
              <h2 className="font-stinger font-black text-2xl sm:text-4xl text-slate-900 mt-2">
                Download E-Book & Vocabulary Pack
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                Unduh seluruh modul resmi PDF dan daftar frasa percakapan harian untuk belajar mandiri secara offline.
              </p>
            </div>

            {downloadNotice && (
              <div className="p-4 bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-md animate-pulse">
                {downloadNotice}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studentDownloads.map((item) => (
                <div key={item.id} className="bg-slate-50 border-2 border-slate-200 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-brand transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-brand/10 text-brand text-[10px] font-black px-2.5 py-1 rounded-md border border-brand/20">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{item.size}</span>
                    </div>
                    <FileText className="w-8 h-8 text-brand" />
                    <h3 className="font-black text-base text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(item)}
                    className="w-full py-3 rounded-2xl bg-brand text-lime font-black text-xs hover:bg-dark transition-all border border-dark flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {item.type}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 📹 TAB 2: REKAMAN MATERI (RECORDED CLASS SESSIONS) */}
      {activeHubTab === "recordings" && (
        <section className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-4xl border-4 border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="bg-[#FFFF00] text-[#08203C] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                RECORDED CLASS LIBRARY
              </span>
              <h2 className="font-stinger font-black text-2xl sm:text-4xl text-white mt-2">
                Rekaman Sesi Kelas Tatap Muka
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
                Putar kembali sesi live bersama Mentor Senior & Native Speaker jika Anda ingin mengulang materi.
              </p>
            </div>

            {/* Video Player Modal/Active Player */}
            {activeRecordedVideo ? (
              <div className="space-y-4 bg-slate-950 p-6 rounded-3xl border border-slate-700">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-emerald-400">Sedang Memutar: {activeRecordedVideo.title}</span>
                  <button
                    onClick={() => setActiveRecordedVideo(null)}
                    className="text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
                  >
                    Tutup Player ✕
                  </button>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <div className="text-center space-y-2 p-4">
                    <Video className="w-12 h-12 text-[#FFFF00] mx-auto animate-pulse" />
                    <p className="font-black text-sm text-white">{activeRecordedVideo.title}</p>
                    <p className="text-xs text-slate-400 font-semibold">Dipandu oleh {activeRecordedVideo.tutor} • Durasi {activeRecordedVideo.duration}</p>
                    <a
                      href={activeRecordedVideo.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-2 px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl"
                    >
                      Buka Di Tab Baru ➔
                    </a>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recordedSessions.map((session) => (
                <div key={session.id} className="bg-slate-800 border border-slate-700 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-[#FFFF00] transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span className="bg-slate-700 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-md">
                        {session.level}
                      </span>
                      <span>Tanggal: {session.date}</span>
                    </div>
                    <h3 className="font-black text-lg text-white">{session.title}</h3>
                    <p className="text-xs text-slate-300 font-semibold">Tutor: {session.tutor} | Durasi: {session.duration}</p>
                  </div>
                  <button
                    onClick={() => setActiveRecordedVideo(session)}
                    className="w-full py-3 rounded-2xl bg-[#FFFF00] text-[#08203C] font-black text-xs hover:bg-emerald-400 transition-all border border-dark flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Tonton Rekaman Sesi ➔</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🎒 TAB 3: MISSION LEARNING PATH & PROGRESS */}
      {activeHubTab === "path" && (
        <>
          <section className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
            <div className="grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
              <div className="rounded-[26px] border border-white bg-white p-5 shadow-lg shadow-blue-700/5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full bg-blue-50">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#0362C0 ${progress * 3.6}deg, #DBEAFE 0deg)`,
                      }}
                    />
                    <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white text-sm font-black text-[#0362C0]">
                      {progress}%
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0362C0]">
                          Progress belajar
                        </div>
                        <h2 className="mt-1 font-helios text-xl font-black sm:text-2xl">
                          Halo, {user?.full_name || "Learner"}!
                        </h2>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#0362C0]">
                        {completedIds.length}/{lessons.length} unit selesai
                      </span>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0362C0] to-[#87CEFA] transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-[26px] bg-slate-950 p-4 text-white shadow-xl">
                <div className="rounded-2xl bg-white/5 p-4">
                  <Flame className="h-5 w-5 text-[#FFA715]" />
                  <div className="mt-3 text-2xl font-black">
                    {user?.streak || 7}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Day streak
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <Zap className="h-5 w-5 text-[#FFFF00]" />
                  <div className="mt-3 text-2xl font-black">
                    {user?.xp || completedIds.reduce((sum, id) => sum + lessons[id - 1].xp, 0)}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Total XP
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-8 max-w-[1440px] px-3 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleLessons.map((lesson) => {
                const Icon = lesson.icon;
                const completed = completedIds.includes(lesson.id);
                const bookmarked = bookmarkedIds.includes(lesson.id);

                return (
                  <article
                    key={lesson.id}
                    className="group relative overflow-hidden rounded-[26px] border border-white bg-white shadow-lg shadow-blue-900/5 transition hover:-translate-y-1.5 hover:shadow-2xl"
                  >
                    <div className={`h-2 bg-gradient-to-r ${lesson.color}`} />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${lesson.color} text-white shadow-lg`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#0362C0]">
                              Unit {String(lesson.id).padStart(2, "0")} • {lesson.level}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                              <Clock3 className="h-3.5 w-3.5" />
                              {lesson.duration} menit • +{lesson.xp} XP
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="mt-4 text-xl font-black leading-snug">
                        {lesson.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-500">
                        {lesson.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => openLesson(lesson)}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0362C0] px-4 text-xs font-black text-white shadow-md hover:bg-slate-900 transition-all cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Mulai Unit Sesi
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* LESSON MODAL OVERLAY */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeLesson}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <div className="text-[10px] font-black uppercase text-[#0362C0]">
                    Unit {selectedLesson.id} • {selectedLesson.level}
                  </div>
                  <h2 className="text-base font-black sm:text-xl">
                    {selectedLesson.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-sm text-slate-700 font-semibold">{selectedLesson.description}</p>
              <div className="p-4 bg-blue-50 rounded-2xl">
                <h4 className="font-black text-xs text-[#0362C0] uppercase">Misi Utama:</h4>
                <p className="text-xs text-slate-800 font-bold mt-1">{selectedLesson.mission}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}