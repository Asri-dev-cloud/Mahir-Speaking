import React, { useEffect, useMemo, useRef, useState } from "react";
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
  UserCheck,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { courseService, userService } from "../../services/api";

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
    title: "Sesi 1: Self Introduction & Confidence Drill (Coldplay - Viva La Vida MV)",
    tutor: "Ms. Era Purike",
    duration: "90 Menit",
    level: "Basic Level",
    videoUrl: "https://www.youtube.com/embed/dvgZkm1xWPE",
    thumbnail: "https://img.youtube.com/vi/dvgZkm1xWPE/hqdefault.jpg",
    provider: "youtube",
    date: "12 Juli 2026"
  },
  {
    id: 2,
    title: "Sesi 2: Daily Conversation & Roleplay (Maroon 5 - Sugar MV)",
    tutor: "Ms. Deasy Puspawati",
    duration: "90 Menit",
    level: "Basic Level",
    videoUrl: "https://www.youtube.com/embed/09R8_2nJtjg",
    thumbnail: "https://img.youtube.com/vi/09R8_2nJtjg/hqdefault.jpg",
    provider: "youtube",
    date: "19 Juli 2026"
  },
  {
    id: 3,
    title: "Sesi 3: Public Speaking Masterclass (Ed Sheeran - Shape of You MV)",
    tutor: "Ms. Ade Ihdinayah",
    duration: "90 Menit",
    level: "Intermediate Level",
    videoUrl: "https://www.youtube.com/embed/JGwWNGJdvx8",
    thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg",
    provider: "youtube",
    date: "26 Juli 2026"
  },
  {
    id: 4,
    title: "Sesi 4: Native Speaker Meeting Session (OneRepublic - Counting Stars MV)",
    tutor: "Native Speaker (Mr. James)",
    duration: "90 Menit",
    level: "All Levels",
    videoUrl: "https://www.youtube.com/embed/hT_nvWreIhg",
    thumbnail: "https://img.youtube.com/vi/hT_nvWreIhg/hqdefault.jpg",
    provider: "youtube",
    date: "2 Agustus 2026"
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
  const { user, setActiveTab, updateUserProfile } = useAuth();
  const [liveUser, setLiveUser] = useState(user);
  const [filter, setFilter] = useState("ALL");
  const [activeHubTab, setActiveHubTab] = useState("path"); // path | downloads | recordings
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedIds, setCompletedIds] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('mahir_user') || 'null');
    if (savedUser && savedUser.completed_units && Array.isArray(savedUser.completed_units) && savedUser.completed_units.length > 0) {
      return savedUser.completed_units;
    }
    if (savedUser && (savedUser.has_completed_quiz || savedUser.quiz_completed || (savedUser.quizzes_completed > 0))) {
      return [1];
    }
    return [];
  });

  useEffect(() => {
    if (user) {
      if (user.completed_units && Array.isArray(user.completed_units) && user.completed_units.length > 0) {
        setCompletedIds(user.completed_units);
      } else if (user.has_completed_quiz || user.quiz_completed || (user.quizzes_completed > 0)) {
        setCompletedIds(prev => prev.length === 0 ? [1] : prev);
      }
    } else {
      setCompletedIds([]);
    }
  }, [user]);

  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [quizChoice, setQuizChoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingResult, setRecordingResult] = useState("");
  const [showAllUnits, setShowAllUnits] = useState(false);
  const [activeRecordedVideo, setActiveRecordedVideo] = useState(null);
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [customDownloads, setCustomDownloads] = useState([]);
  const [customRecordings, setCustomRecordings] = useState([]);

  // Sinkronkan XP, streak, points, dan progres dengan database saat LMS dibuka.
  useEffect(() => {
    let active = true;

    const loadLatestUser = async () => {
      if (!user) return;
      try {
        const profileRes = await userService.getProfile();
        if (!active || !profileRes.success || !profileRes.user) return;

        setLiveUser(profileRes.user);
        updateUserProfile(profileRes.user);
      } catch (err) {
        console.error('Gagal mengambil data LMS terbaru:', err);
      }
    };

    loadLatestUser();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (user) setLiveUser(user);
  }, [user]);

  useEffect(() => {
    const savedMods = localStorage.getItem('mahir_custom_modules');
    if (savedMods) {
      try {
        const parsed = JSON.parse(savedMods);
        if (Array.isArray(parsed)) setCustomDownloads(parsed);
      } catch (e) { }
    }
    const savedVids = localStorage.getItem('mahir_custom_recordings');
    if (savedVids) {
      try {
        const parsed = JSON.parse(savedVids);
        if (Array.isArray(parsed)) setCustomRecordings(parsed);
      } catch (e) { }
    }
  }, []);

  const allDownloads = useMemo(() => {
    return [...customDownloads, ...studentDownloads];
  }, [customDownloads]);

  const allRecordings = useMemo(() => {
    return [...customRecordings, ...recordedSessions];
  }, [customRecordings]);

  const filteredLessons = useMemo(() => {
    if (filter === "ALL") return lessons;
    return lessons.filter(
      (lesson) => lesson.level === filter || lesson.phase === filter,
    );
  }, [filter]);

  const progress = user ? Math.round((completedIds.length / lessons.length) * 100) : 0;
  const displayCompletedCount = user ? completedIds.length : 0;
  const displayStreak = liveUser ? (liveUser.streak || 0) : 0;
  const displayXp = liveUser ? (liveUser.xp || 0) : 0;

  const currentLesson =
    lessons.find((lesson) => !completedIds.includes(lesson.id)) ||
    lessons[lessons.length - 1];
  const visibleLessons = showAllUnits
    ? filteredLessons
    : filteredLessons.slice(0, 8);

  const handleDownload = (item) => {
    if (!user) {
      setDownloadNotice(`🔒 Akses Terbatas: Silakan Login terlebih dahulu untuk mengunduh modul "${item.title}"!`);
      setShowAuthModal(true);
      return;
    }
    setDownloadNotice(`Mengunduh ${item.title}...`);
    setTimeout(() => {
      setDownloadNotice(`✅ ${item.title} berhasil diunduh ke perangkat Anda!`);
      if (item.fileUrl && item.fileUrl !== '#') {
        if (item.fileUrl.startsWith('data:')) {
          const link = document.createElement('a');
          link.href = item.fileUrl;
          let ext = 'pdf';
          if (item.type?.includes('Word')) ext = 'docx';
          else if (item.type?.includes('PowerPoint')) ext = 'pptx';
          else if (item.type?.includes('Audio') || item.type?.includes('Pack')) ext = 'zip';
          link.download = `${item.title}.${ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          window.open(item.fileUrl, '_blank');
        }
      }
      setTimeout(() => setDownloadNotice(null), 4000);
    }, 1200);
  };

  const videoPlayerRef = useRef(null);

  const handlePlayVideo = (session) => {
    if (!user) {
      setDownloadNotice(`🔒 Akses Terbatas: Silakan Login terlebih dahulu untuk memutar rekaman sesi kelas "${session.title}"!`);
      setShowAuthModal(true);
      return;
    }
    setActiveRecordedVideo(session);

    setTimeout(() => {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 320, behavior: 'smooth' });
      }
    }, 120);
  };

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lessonTab, setLessonTab] = useState("overview");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const openLesson = (lesson) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedLesson(lesson);
    setLessonTab("overview");
    setQuizIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizChoice(null);
    setRecordingResult("");
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const closeLesson = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setSelectedLesson(null);
    setQuizSubmitted(false);
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

  const finishLesson = async (customXp, quizScore) => {
    if (!selectedLesson) return;

    const nextCompleted = Array.from(new Set([...completedIds, selectedLesson.id]));
    setCompletedIds(nextCompleted);

    // Tandai user telah mengerjakan quiz & kumpulkan XP
    if (user) {
      const addedXp = customXp !== undefined ? customXp : (selectedLesson.xp || 100);
      const score = quizScore !== undefined ? quizScore : 100;

      const updatedUser = {
        ...(liveUser || user),
        has_completed_quiz: true,
        quiz_completed: true,
        quizzes_completed: ((liveUser || user).quizzes_completed || 0) + 1,
        completed_units: nextCompleted
      };

      if (typeof updateUserProfile === 'function') {
        updateUserProfile(updatedUser);
      }

      localStorage.setItem('mahir_user', JSON.stringify(updatedUser));
      try {
        const registered = JSON.parse(localStorage.getItem('mahir_registered_users') || '[]');
        const idx = registered.findIndex(u => (user.email && u.email?.toLowerCase() === user.email?.toLowerCase()) || (user.id && u.id === user.id));
        if (idx !== -1) {
          registered[idx] = { ...registered[idx], ...updatedUser };
        } else {
          registered.push(updatedUser);
        }
        localStorage.setItem('mahir_registered_users', JSON.stringify(registered));
      } catch (e) { }

      // Save to backend database
      try {
        console.log('⚡ [LMS debug] Mengirim penyelesaian kuis ke backend:', {
          lesson_id: selectedLesson.id,
          score: score,
          xp_earned: addedXp
        });
        const res = await courseService.completeLesson({
          lesson_id: selectedLesson.id,
          score: score,
          xp_earned: addedXp
        });
        console.log('⚡ [LMS debug] Respon completeLesson:', res);
        if (res.success) {
          // Fetch updated profile to sync latest XP, points, and streak
          const profileRes = await userService.getProfile();
          console.log('⚡ [LMS debug] Respon getProfile:', profileRes);
          if (profileRes.success && profileRes.user) {
            setLiveUser(profileRes.user);
            updateUserProfile(profileRes.user);
          }
        }
      } catch (err) {
        console.error('⚡ [LMS debug] Gagal menyimpan progres ke database:', err);
      }
    }

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

              {user ? (
                <div className="mt-5 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFFF00] text-[#0362C0] font-black text-lg flex items-center justify-center border-2 border-white shadow-md uppercase">
                      {user.full_name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                        <span>Selamat Belajar, {user.full_name}!</span>
                        <GraduationCap className="w-5 h-5 text-[#FFFF00]" />
                      </h2>
                      <p className="text-xs text-blue-200">
                        {user.package_name || 'Standard Pro Member'} • {user.role === 'admin' ? 'Akses Admin LMS' : 'Siswa Aktif'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#FFFF00] bg-black/30 px-3 py-1.5 rounded-xl border border-[#FFFF00]/30 inline-flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-[#FFFF00]" />
                      <span>{displayXp} XP</span>
                    </span>
                    <span className="text-xs font-black text-orange-300 bg-black/30 px-3 py-1.5 rounded-xl border border-orange-400/30 inline-flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      <span>{displayStreak} Hari Streak</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-amber-400/20 border border-amber-300/40 rounded-2xl flex items-center justify-between text-xs text-amber-200">
                  <span className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-300" />
                    Anda sedang mengakses mode tamu. Login untuk menyimpan riwayat belajar!
                  </span>
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="px-3 py-1.5 bg-[#FFFF00] text-dark font-black rounded-xl text-[11px] cursor-pointer hover:bg-yellow-300 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Login Siswa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Main Tab Controls in LMS */}
              <div className="mt-7 flex flex-wrap gap-2.5 sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => setActiveHubTab("path")}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md border-2 ${activeHubTab === 'path'
                      ? 'bg-[#FFFF00] text-slate-950 border-dark ring-2 ring-[#FFFF00]/50 scale-[1.02]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-yellow-50 hover:border-[#FFFF00]'
                    }`}
                >
                  <BookOpen className="h-4 w-4 stroke-[2.5]" />
                  <span>Misi Learning Path</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveHubTab("downloads")}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md border-2 ${activeHubTab === 'downloads'
                      ? 'bg-[#FFFF00] text-slate-950 border-dark ring-2 ring-[#FFFF00]/50 scale-[1.02]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-yellow-50 hover:border-[#FFFF00]'
                    }`}
                >
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  <span>Download E-Book & Modul</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveHubTab("recordings")}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md border-2 ${activeHubTab === 'recordings'
                      ? 'bg-[#FFFF00] text-slate-950 border-dark ring-2 ring-[#FFFF00]/50 scale-[1.02]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-yellow-50 hover:border-[#FFFF00]'
                    }`}
                >
                  <Video className="h-4 w-4 stroke-[2.5]" />
                  <span>Rekaman Sesi Kelas</span>
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
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-blue-200">
                  STUDENT RESOURCES
                </span>
                <h2 className="font-stinger font-black text-2xl sm:text-4xl text-slate-900 mt-2">
                  Download E-Book & Modul Pembelajaran
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  Unduh seluruh modul PDF, Word, PowerPoint, dan frasa percakapan harian.
                </p>
              </div>

              {!user && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Login diperlukan untuk mengunduh</span>
                </div>
              )}
            </div>

            {downloadNotice && (
              <div className={`p-4 rounded-2xl font-black text-xs shadow-md animate-pulse ${downloadNotice.includes('🔒') ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                }`}>
                {downloadNotice}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allDownloads.map((item) => (
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
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">{item.desc || 'Modul pembelajaran terstruktur Mahir Speaking.'}</p>
                    {item.type && (
                      <span className="inline-block text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(item)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 border-dark flex items-center justify-center gap-2 cursor-pointer shadow-md ${user
                        ? 'bg-[#FFFF00] text-slate-950 hover:bg-yellow-300 hover:scale-[1.01]'
                        : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      }`}
                  >
                    {user ? <Download className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-4 h-4 text-amber-600" />}
                    <span>{user ? `Download ${item.type || 'Modul'}` : 'Download (Wajib Login)'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 📹 TAB 2: REKAMAN MATERI (RECORDED CLASS SESSIONS) */}
      {activeHubTab === "recordings" && (
        <section ref={videoPlayerRef} className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
          <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-4xl border-4 border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="bg-[#FFFF00] text-[#08203C] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  RECORDED CLASS LIBRARY
                </span>
                <h2 className="font-stinger font-black text-2xl sm:text-4xl text-white mt-2">
                  Rekaman Sesi Kelas Tatap Muka
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
                  Putar kembali sesi live bersama Mentor Senior & Native Speaker (YouTube / Google Drive).
                </p>
              </div>

              {!user && (
                <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs font-bold">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Login diperlukan untuk memutar video</span>
                </div>
              )}
            </div>

            {downloadNotice && downloadNotice.includes('🔒') && (
              <div className="p-4 bg-amber-500 text-slate-950 rounded-2xl font-black text-xs shadow-md animate-pulse">
                {downloadNotice}
              </div>
            )}

            {/* Video Player Modal/Active Player */}
            {activeRecordedVideo ? (
              <div className="space-y-4 bg-slate-950 p-6 rounded-3xl border border-slate-700">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-emerald-400">Sedang Memutar: {activeRecordedVideo.title}</span>
                  <button
                    onClick={() => setActiveRecordedVideo(null)}
                    className="text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Tutup Player ✕
                  </button>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <iframe
                    src={activeRecordedVideo.videoUrl}
                    title={activeRecordedVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allRecordings.map((session) => (
                <div key={session.id} className="bg-slate-800 border border-slate-700 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-[#FFFF00] transition-all overflow-hidden">

                  {/* THUMBNAIL PREVIEW (HANYA 1 TOMBOL PLAY DI TENGAH TERSEDIA) */}
                  {session.thumbnail && (
                    <div
                      onClick={() => handlePlayVideo(session)}
                      className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 -mt-2 -mx-2 cursor-pointer group"
                      title="Klik untuk memutar video"
                    >
                      <img
                        src={session.thumbnail}
                        alt={session.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#FFFF00] text-[#08203C] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-2 border-slate-900">
                          <Play className="w-7 h-7 fill-current ml-1" />
                        </div>
                      </div>
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 text-[10px] font-black text-lime uppercase border border-slate-700">
                        {session.provider === 'youtube' ? 'YouTube' : session.provider === 'gdrive' ? 'Google Drive' : 'Live Class'}
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span className="bg-slate-700 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-md">
                        {session.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{session.date}</span>
                      </span>
                    </div>
                    <h3 className="font-black text-lg text-white">{session.title}</h3>
                    <p className="text-xs text-slate-300 font-semibold flex items-center gap-3">
                      <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-blue-400" /> {session.tutor}</span>
                      <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5 text-amber-400" /> {session.duration}</span>
                    </p>
                  </div>
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
                          Halo, {user?.full_name || "Tamu Mahir"}!
                        </h2>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#0362C0]">
                        {displayCompletedCount}/{lessons.length} unit selesai
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
                    {displayStreak}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Day streak
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <Zap className="h-5 w-5 text-[#FFFF00]" />
                  <div className="mt-3 text-2xl font-black">
                    {displayXp}
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
                            <div className="text-[10px] font-black uppercase tracking-widest text-[#0362C0] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                              QUIZ UNIT {String(lesson.id).padStart(2, "0")} • 20 SOAL
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                              <HelpCircle className="h-3.5 w-3.5 text-amber-500 fill-amber-100" />
                              20 Soal Kuis • +100 XP
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
                          Kerjakan Kuis (20 Soal) ➔
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

      {/* LESSON & 20-SOAL QUIZ MODAL OVERLAY */}
      {selectedLesson && (() => {
        // Bank 20 Soal Kuis untuk Unit yang dipilih
        const questionsList = [
          { id: 1, q: "Complete the sentence: 'Good morning! My name ___ Sarah.'", opts: ["is", "am", "are", "be"], ans: 0, exp: "Gunakan 'is' untuk subjek 'My name'." },
          { id: 2, q: "Choose the correct greeting for 9:00 AM:", opts: ["Good evening", "Good afternoon", "Good morning", "Good night"], ans: 2, exp: "'Good morning' digunakan untuk pagi hari." },
          { id: 3, q: "How do you politely respond to 'Nice to meet you'?", opts: ["Nice to meet you too!", "I am fine.", "Goodbye!", "No problem."], ans: 0, exp: "'Nice to meet you too!' adalah respon sopan." },
          { id: 4, q: "Complete the sentence: 'I ___ from Jakarta, Indonesia.'", opts: ["is", "are", "am", "be"], ans: 2, exp: "Gunakan 'am' setelah subjek 'I'." },
          { id: 5, q: "What is the polite way to ask someone's name?", opts: ["Who are you?", "What is your name?", "Tell me your name!", "Hey you!"], ans: 1, exp: "'What is your name?' adalah cara umum yang sopan." },
          { id: 6, q: "Complete the sentence: 'She ___ a dedicated student.'", opts: ["are", "am", "is", "were"], ans: 2, exp: "Subjek 'She' berpasangan dengan 'is'." },
          { id: 7, q: "How do you say goodbye in a professional meeting?", opts: ["Goodbye, have a great day!", "Whatever", "Bye bye kid", "Catch ya later"], ans: 0, exp: "'Goodbye, have a great day!' adalah penutup formal." },
          { id: 8, q: "Complete the sentence: 'They ___ my new classmates.'", opts: ["is", "are", "am", "was"], ans: 1, exp: "Subjek jamak 'They' menggunakan 'are'." },
          { id: 9, q: "Which contraction stands for 'I am'?", opts: ["I's", "I'm", "I're", "I've"], ans: 1, exp: "I am disingkat menjadi I'm." },
          { id: 10, q: "Choose the correct question: 'Where ___ you work?'", opts: ["does", "do", "is", "are"], ans: 1, exp: "Gunakan kata bantu 'do' untuk subjek 'you'." },
          { id: 11, q: "Complete: 'Nice to meet you, Mr. Alex. I ___ Budi.'", opts: ["is", "are", "am", "be"], ans: 2, exp: "Gunakan 'am' setelah subjek 'I'." },
          { id: 12, q: "What does 'What do you do?' mean?", opts: ["Apa pekerjaanmu/kesibukanmu?", "Apa yang sedang kamu makan?", "Ke mana kamu pergi?", "Siapa nama temanmu?"], ans: 0, exp: "'What do you do?' menanyakan pekerjaan atau profesi." },
          { id: 13, q: "Complete: 'He ___ an engineer at a software firm.'", opts: ["am", "are", "is", "be"], ans: 2, exp: "Subjek 'He' berpasangan dengan 'is'." },
          { id: 14, q: "Which response is polite when introduced to a colleague?", opts: ["Pleased to meet you", "Get away", "No thanks", "Who cares"], ans: 0, exp: "'Pleased to meet you' sangat sopan." },
          { id: 15, q: "Complete: 'We ___ excited to join the speaking class.'", opts: ["is", "are", "am", "was"], ans: 1, exp: "Subjek 'We' menggunakan to-be 'are'." },
          { id: 16, q: "Choose the correct short answer to 'Are you ready?'", opts: ["Yes, I am.", "Yes, I is.", "Yes, I be.", "Yes, I are."], ans: 0, exp: "Jawaban singkat positif untuk 'Are you...?' adalah 'Yes, I am.'" },
          { id: 17, q: "Complete: 'This ___ my friend, Amanda.'", opts: ["are", "am", "is", "be"], ans: 2, exp: "'This' sebagai kata ganti menggunakan 'is'." },
          { id: 18, q: "Choose the correct spelling:", opts: ["Introdution", "Introduction", "Introducshon", "Introsuction"], ans: 1, exp: "Ejaan yang tepat adalah 'Introduction'." },
          { id: 19, q: "Complete: 'How ___ you today?'", opts: ["is", "am", "are", "be"], ans: 2, exp: "Gunakan 'are' untuk menanyakan kabar 'you'." },
          { id: 20, q: "Choose the best closing phrase for an introduction:", opts: ["Thank you for your time.", "Shut up.", "I don't care.", "Bye bye."], ans: 0, exp: "'Thank you for your time' adalah ucapan penutup yang sangat baik." }
        ];

        const currentQ = questionsList[quizIndex];
        const answeredCount = Object.keys(quizAnswers).length;
        let correctCount = 0;
        questionsList.forEach((q, idx) => {
          if (quizAnswers[idx] === q.ans) correctCount++;
        });
        const calculatedScore = Math.round((correctCount / questionsList.length) * 100);
        const earnedXp = Math.max(5, correctCount * 5);

        const handleSelectAnswer = (optionIdx) => {
          if (quizSubmitted) return;
          setQuizAnswers(prev => ({ ...prev, [quizIndex]: optionIdx }));
        };

        const handleSubmitQuiz = () => {
          setQuizSubmitted(true);
          finishLesson(earnedXp, calculatedScore);
        };

        return (
          <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[99999] overflow-y-auto bg-slate-950/85 p-2 sm:p-6 backdrop-blur-md flex items-center justify-center custom-scrollbar">
            <div className="mx-auto w-full max-w-4xl max-h-[92vh] flex flex-col justify-between overflow-y-auto rounded-[24px] sm:rounded-[32px] bg-white shadow-2xl border-2 sm:border-4 border-slate-900 custom-scrollbar">

              {/* Header Modal Kuis Responsif Mobile */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-[#0362C0] to-blue-700 p-3.5 sm:px-8 text-white gap-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={closeLesson}
                    className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#FFFF00] bg-black/30 px-2 py-0.5 rounded-full border border-[#FFFF00]/30 inline-block truncate max-w-full">
                      QUIZ 20 SOAL • UNIT {selectedLesson.id}
                    </span>
                    <h2 className="text-xs sm:text-lg font-black text-white mt-0.5 truncate">
                      {selectedLesson.title}
                    </h2>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] sm:text-xs font-black bg-[#FFFF00] text-[#0362C0] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-md whitespace-nowrap">
                    {answeredCount}/20 Terjawab
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-8 space-y-5 flex-1 overflow-y-auto custom-scrollbar">

                {/* 🔢 NAVIGATOR 20 NOMOR SOAL (GRID 5 KOLOM PAS DI MOBILE) */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-black text-slate-700">
                    <span>NOMOR SOAL (1 - 20):</span>
                    <span className="text-blue-600">Soal {quizIndex + 1} dari 20</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 sm:gap-2">
                    {questionsList.map((q, idx) => {
                      const userAns = quizAnswers[idx];
                      const isAnswered = userAns !== undefined;
                      const isCorrect = isAnswered && userAns === q.ans;
                      const isCurrent = idx === quizIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => setQuizIndex(idx)}
                          className={`h-8 sm:h-9 rounded-xl font-black text-xs transition-all cursor-pointer border flex items-center justify-center ${isCurrent
                              ? 'ring-4 ring-blue-500 scale-105 shadow-md border-slate-900 bg-white text-slate-900'
                              : isAnswered
                                ? isCorrect
                                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                  : 'bg-rose-500 text-white border-rose-600 shadow-sm'
                                : 'bg-white text-slate-700 hover:bg-slate-200 border-slate-300'
                            }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🏆 JIKA SUDAH SUBMIT: TAMPILKAN RINGKASAN SKOR */}
                {quizSubmitted ? (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 p-5 sm:p-8 rounded-3xl text-center space-y-4 shadow-lg animate-scaleUp">
                    <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                      <Award className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-stinger font-black text-xl sm:text-3xl text-slate-900 uppercase">
                        Selamat! Kuis Unit {selectedLesson.id} Selesai!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-md mx-auto">
                        Anda menjawab <span className="text-emerald-600 font-black">{correctCount} dari 20 soal benar</span> ({calculatedScore}%) dan memperoleh <span className="text-blue-600 font-black">+{earnedXp} XP</span>! Peringkat Anda di Leaderboard kini telah diperbarui.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
                      <span className="text-xs sm:text-sm font-black text-emerald-700">
                        Skor: {calculatedScore}/100 ({correctCount}/20 Benar)
                      </span>
                      <span className="text-xs font-black bg-[#FFFF00] text-[#0362C0] px-3 py-1 rounded-xl">
                        +{earnedXp} XP Diberikan
                      </span>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          closeLesson();
                          setActiveTab('leaderboard');
                        }}
                        className="px-6 py-3.5 rounded-2xl bg-[#0362C0] text-[#FFFF00] font-black text-xs sm:text-sm hover:bg-blue-800 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                      >
                        <span>Lihat Peringkat Leaderboard</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ❓ TAMPILAN PERTANYAAN KUIS */
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-[#0362C0] tracking-wider">
                        PERTANYAAN NO. {quizIndex + 1}
                      </span>
                      <h3 className="text-sm sm:text-lg font-black text-slate-900 leading-snug">
                        {currentQ.q}
                      </h3>
                    </div>

                    {/* 4 PILIHAN JAWABAN (A, B, C, D) TANPA EMOJI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {currentQ.opts.map((opt, optIdx) => {
                        const selectedAns = quizAnswers[quizIndex];
                        const hasAnswered = selectedAns !== undefined;
                        const isChosen = selectedAns === optIdx;
                        const isRightAnswer = optIdx === currentQ.ans;
                        const label = ['A', 'B', 'C', 'D'][optIdx];

                        let btnStyle = 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400';
                        let badgeStyle = 'bg-slate-100 text-slate-700';

                        if (hasAnswered) {
                          if (isChosen && isRightAnswer) {
                            btnStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300';
                            badgeStyle = 'bg-[#FFFF00] text-[#0362C0]';
                          } else if (isChosen && !isRightAnswer) {
                            btnStyle = 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300 animate-shake';
                            badgeStyle = 'bg-white text-rose-700';
                          } else if (!isChosen && isRightAnswer) {
                            btnStyle = 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
                            badgeStyle = 'bg-emerald-500 text-white';
                          } else {
                            btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-50';
                            badgeStyle = 'bg-slate-200 text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(optIdx)}
                            className={`p-3.5 sm:p-4 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all border-2 flex items-center justify-between gap-2.5 cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${badgeStyle}`}>
                                {label}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </div>

                            {hasAnswered && isChosen && (
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shrink-0 border border-white/20">
                                {isRightAnswer ? 'BENAR' : 'SALAH'}
                              </span>
                            )}
                            {hasAnswered && !isChosen && isRightAnswer && (
                              <span className="text-[9px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase shrink-0">
                                Kunci Jawaban
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* PENJELASAN SAAT JAWABAN DIPILIH (TANPA EMOJI) */}
                    {quizAnswers[quizIndex] !== undefined && (
                      <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${quizAnswers[quizIndex] === currentQ.ans
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                        }`}>
                        {quizAnswers[quizIndex] === currentQ.ans ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-black text-xs sm:text-sm">
                            {quizAnswers[quizIndex] === currentQ.ans
                              ? 'Jawaban Anda Benar!'
                              : `Jawaban Anda Belum Tepat! (Kunci: Pilihan ${['A', 'B', 'C', 'D'][currentQ.ans]})`}
                          </p>
                          <p className="mt-1 leading-relaxed"><strong>Penjelasan:</strong> {currentQ.exp}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* TOMBOL NAVIGASI SOAL STICKY DI MOBILE (SELALU KELIHATAN) */}
              {!quizSubmitted && (
                <div className="sticky bottom-0 bg-white pt-3 pb-3 border-t-2 border-slate-200 flex items-center justify-between gap-3 z-30 px-4 sm:px-8 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] rounded-b-[24px] sm:rounded-b-[32px] shrink-0">
                  <button
                    disabled={quizIndex === 0}
                    onClick={() => setQuizIndex(prev => Math.max(0, prev - 1))}
                    className="px-3.5 sm:px-5 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs text-slate-800 disabled:opacity-30 cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 shrink-0 bg-white shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    <span>Sebelumnya</span>
                  </button>

                  {quizIndex < 19 ? (
                    <button
                      onClick={() => setQuizIndex(prev => Math.min(19, prev + 1))}
                      className="px-5 sm:px-7 py-3 rounded-xl bg-[#0362C0] text-white font-black text-xs sm:text-sm hover:bg-slate-900 cursor-pointer shadow-lg flex items-center gap-1.5 shrink-0 border border-blue-800"
                    >
                      <span>Soal Selanjutnya</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-5 sm:px-7 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm hover:bg-emerald-700 cursor-pointer shadow-xl flex items-center gap-1.5 shrink-0 border border-emerald-800"
                    >
                      <span>Selesaikan & Kirim Kuis</span>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 🔒 AUTH REQUIRED MODAL UNTUK QUIZ & LESSON */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-black text-lg w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-inner border-2 border-amber-300">
              🔒
            </div>

            <div className="space-y-2">
              <h3 className="font-stinger font-black text-2xl text-slate-900 uppercase tracking-tight">
                Login Terlebih Dahulu 🎓
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed max-w-xs mx-auto">
                Fitur kuis interaktif, perolehan XP, dan peringkat Leaderboard hanya dapat diakses oleh siswa terdaftar. Silakan masuk atau buat akun gratis!
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setActiveTab('auth');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#0362C0] text-[#FFFF00] font-black text-xs sm:text-sm hover:bg-blue-800 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>Masuk / Login Akun</span> ➔
              </button>

              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setActiveTab('register');
                }}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm hover:bg-emerald-700 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Daftar Akun Siswa Baru</span> ✨
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}