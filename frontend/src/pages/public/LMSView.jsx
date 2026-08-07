import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import FreeQuizModal, { freeQuestionsByUnit } from "../../components/modals/FreeQuizModal";
import PremiumQuizModal, { premiumQuestionsByUnit } from "../../components/modals/PremiumQuizModal";

const staticLessons = [
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
    color: "from-emerald-500 to-teal-600",
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

const dynamicUnitDetails = {
  4: {
    title: "Hobbies & Free Time Activities",
    description: "Menceritakan hobi, aktivitas favorit di waktu luang, dan seberapa sering melakukannya."
  },
  5: {
    title: "Food, Drinks, and Dining Out",
    description: "Cara memesan makanan di restoran, mendeskripsikan rasa, dan menanyakan rekomendasi menu."
  },
  6: {
    title: "Shopping & Asking for Prices",
    description: "Ungkapan untuk belanja pakaian, menanyakan ukuran/warna, dan menanyakan harga barang."
  },
  7: {
    title: "Talking About the Weather",
    description: "Mendeskripsikan cuaca hari ini, musim favorit, dan pakaian yang cocok dikenakan."
  },
  8: {
    title: "Describing Your Home & Room",
    description: "Menjelaskan ruangan di rumah, tata letak barang, dan tempat favorit untuk bersantai."
  },
  9: {
    title: "Plans for the Weekend",
    description: "Membahas rencana akhir pekan bersama teman dan menanyakan agenda mereka."
  },
  10: {
    title: "Asking for & Giving Directions",
    description: "Cara menanyakan jalan ke tempat umum dan memberikan petunjuk arah sederhana."
  },
  11: {
    title: "Talking About Transportation",
    description: "Membahas rute perjalanan harian, jenis transportasi umum, dan lama perjalanan."
  },
  12: {
    title: "My Town or City",
    description: "Mendeskripsikan kota tempat tinggal, tempat menarik, dan apa yang bisa dilakukan di sana."
  },
  13: {
    title: "Staying Healthy & Simple Illnesses",
    description: "Menceritakan kondisi tubuh, gejala sakit ringan, dan memberikan saran kesehatan."
  },
  14: {
    title: "Shopping at a Traditional Market",
    description: "Bernegosiasi harga, menawar barang, dan berbelanja kebutuhan pokok di pasar tradisional."
  },
  15: {
    title: "Talking About Celebrations & Holidays",
    description: "Menceritakan hari raya, tradisi keluarga saat liburan, dan perayaan ulang tahun."
  },
  16: {
    title: "Life Experiences & Travel Tales",
    description: "Menceritakan liburan terbaik, pengalaman tak terlupakan, dan tempat yang ingin dikunjungi."
  },
  17: {
    title: "Career Ambitions & Dreams",
    description: "Mendeskripsikan pekerjaan impian, rencana karier masa depan, dan keterampilan yang ingin dikembangkan."
  },
  18: {
    title: "Opinions on Technology & Social Media",
    description: "Menyampaikan pandangan tentang dampak media sosial, gadget, dan internet dalam kehidupan."
  },
  19: {
    title: "Managing Stress & Work-Life Balance",
    description: "Membahas cara mengatasi stres kerja, menjaga kesehatan mental, dan hobi yang menenangkan."
  },
  20: {
    title: "Describing Movies, Books, & Music",
    description: "Memberikan review film atau buku favorit, merekomendasikan lagu, dan menjelaskan alasannya."
  },
  21: {
    title: "Environmental Issues & Going Green",
    description: "Berdiskusi tentang perubahan iklim, daur ulang sampah, dan cara menjaga kelestarian alam."
  },
  22: {
    title: "Traditional vs Online Shopping",
    description: "Membandingkan keuntungan belanja online dengan langsung ke toko fisik."
  },
  23: {
    title: "Dreams of Living Abroad",
    description: "Menyampaikan opini tentang tinggal di luar negeri, tantangan budaya, dan persiapannya."
  },
  24: {
    title: "Friendship & Trustworthy People",
    description: "Mendeskripsikan arti sahabat, kualitas teman yang baik, dan cara menjaga hubungan."
  },
  25: {
    title: "Financial Literacy & Saving Money",
    description: "Berdiskusi cara mengelola uang saku, menabung untuk masa depan, dan investasi dasar."
  },
  26: {
    title: "Healthy Lifestyle & Diet Trends",
    description: "Membahas tren makanan sehat, rutinitas olahraga, dan pentingnya pola makan seimbang."
  },
  27: {
    title: "Public Speaking & Presentation Hooks",
    description: "Teknik membuka presentasi dengan menarik perhatian audiens dan menyampaikan poin utama."
  },
  28: {
    title: "Job Interview Simulation (STAR Method)",
    description: "Latihan menjawab pertanyaan wawancara kerja menggunakan metode STAR secara taktis."
  },
  29: {
    title: "Business Negotiations & Deals",
    description: "Simulasi negosiasi kerja sama bisnis, mengajukan penawaran, dan menyepakati kompromi."
  },
  30: {
    title: "Crisis Management & Workplace Problem Solving",
    description: "Menjelaskan masalah kritis di tempat kerja, menganalisis dampak, dan menawarkan solusi."
  },
  31: {
    title: "Professional Networking & Elevator Pitch",
    description: "Menyampaikan pitch singkat tentang keahlian profesional Anda dalam 60 detik secara meyakinkan."
  },
  32: {
    title: "Persuasive Speaking & Pitching Ideas",
    description: "Seni meyakinkan investor atau atasan untuk menyetujui ide proyek baru Anda."
  },
  33: {
    title: "Debate Mastery on Global Issues",
    description: "Berargumen secara logis menggunakan data untuk mendukung opini tentang isu global."
  },
  34: {
    title: "Intercultural Communication & Business Etiquette",
    description: "Navigasi perbedaan budaya dalam komunikasi bisnis internasional dan etika kerja."
  },
  35: {
    title: "Leadership Styles & Team Motivation",
    description: "Membahas cara memimpin tim, mendelegasikan tugas, dan memotivasi anggota kelompok."
  },
  36: {
    title: "Future of Work & Automation (AI)",
    description: "Menganalisis dampak kecerdasan buatan terhadap lapangan kerja dan adaptasi karier."
  },
  37: {
    title: "Marketing Strategy & Brand Positioning",
    description: "Membahas konsep pemetaan target pasar, USP produk, dan promosi kreatif."
  },
  38: {
    title: "Emotional Intelligence in Leadership",
    description: "Pentingnya empati, regulasi emosi, dan resolusi konflik bagi seorang pemimpin."
  },
  39: {
    title: "Final Keynote Speech & Program Closing",
    description: "Menyampaikan pidato penutup program yang inspiratif, merangkum pencapaian, dan tujuan masa depan."
  }
};

const lessons = (() => {
  const allLessonIds = Array.from(new Set([
    ...staticLessons.map(l => l.id),
    ...Object.keys(freeQuestionsByUnit || {}).map(Number),
    ...Object.keys(premiumQuestionsByUnit || {}).map(Number)
  ])).sort((a, b) => a - b);

  return allLessonIds.map(id => {
    const existing = staticLessons.find(l => l.id === id);
    if (existing) return existing;

    const isPremium = id > 2;
    const detail = dynamicUnitDetails[id] || {
      title: `Unit ${id}: English Speaking Practice`,
      description: `Evaluasi komprehensif tata bahasa, kosakata, dan kecakapan berbicara untuk kuis Unit ${id}.`
    };

    return {
      id,
      level: id <= 2 ? "A1" : id <= 15 ? "A2" : id <= 27 ? "B1" : "B2",
      phase: id <= 2 ? "Survive" : id <= 15 ? "Communicate" : id <= 27 ? "Professional" : "Master",
      title: detail.title,
      shortTitle: `Unit ${id} Quiz`,
      icon: BookOpen,
      duration: 25,
      xp: 80,
      color: isPremium
        ? (id <= 15
          ? "from-emerald-500 to-teal-600"
          : id <= 27
            ? "from-amber-500 to-orange-600"
            : "from-indigo-600 to-purple-800")
        : "from-blue-600 to-blue-800",
      mission: `Selesaikan kuis 20 soal Unit ${id} untuk menguji pemahaman dan kefasihan berbicara Anda.`,
      description: detail.description,
      objectives: [
        `Menguasai kuis tata bahasa Unit ${id}`,
        "Memahami kosakata penting dan penggunaannya",
        "Meningkatkan akurasi pemahaman listening & speaking"
      ],
      vocabulary: [
        ["Practice", "Latihan", "Let's practice speaking."],
        ["Fluency", "Kefasihan", "Fluency is important."],
        ["Vocabulary", "Kosakata", "Learn new vocabulary every day."]
      ],
      expressions: [
        "I would like to practice...",
        "Can you explain...",
        "That is correct."
      ],
      grammar: {
        title: `Grammar Focus: Unit ${id}`,
        points: [
          "Latih struktur kalimat dasar secara konsisten.",
          "Gunakan preposisi dan konjungsi yang tepat.",
          "Perhatikan to-be dan kata kerja yang sesuai."
        ]
      },
      pronunciation: "Perhatikan intonasi dan penekanan kata (word stress) saat mengucapkan jawaban.",
      dialogue: [
        ["A", `Welcome to Unit ${id} practice!`],
        ["B", "Thank you, let's start the quiz."]
      ],
      quiz: {
        question: "Choose the correct sentence.",
        options: ["I am a student.", "I are a student.", "I is a student."],
        answer: 0,
        explanation: "Subject I uses to-be 'am'."
      }
    };
  });
})();

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
    title: "E-Book Speaking - Basic Level (A1/A2)",
    size: "12.4 MB",
    type: "PDF E-Book",
    desc: "Modul pembelajaran level Basic untuk melatih kelancaran perkenalan diri dan aktivitas harian.",
    badge: "Basic Level",
    fileUrl: "https://drive.google.com/file/d/1bNcTgCgcyMju80MEamH9EhNx115vI2YM/view?usp=drive_link"
  },
  {
    id: 2,
    title: "E-Book Speaking - Intermediate Level (B1)",
    size: "15.1 MB",
    type: "PDF E-Book",
    desc: "Modul pembelajaran level Intermediate untuk menguasai percakapan profesional dan opini terstruktur.",
    badge: "Intermediate Level",
    fileUrl: "https://drive.google.com/file/d/1atDc0w5W1TJ8AvHu7S_WaxP87lIs3-qA/view?usp=drive_link"
  },
  {
    id: 3,
    title: "E-Book Speaking - Advance Level (B2/C1)",
    size: "18.7 MB",
    type: "PDF E-Book",
    desc: "Modul pembelajaran level Advance untuk persiapan wawancara kerja, negosiasi, dan presentasi bisnis.",
    badge: "Advance Level",
    fileUrl: "https://drive.google.com/file/d/157eH9drAwb6N2teVOJWxKCPiTRuf7it4/view?usp=sharing"
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

        // Map completedLessons dari database ke completed_units agar sinkron penuh!
        const completedUnits = Array.isArray(profileRes.completedLessons)
          ? profileRes.completedLessons.map(l => l.lesson_id)
          : [];

        const dbUser = {
          ...profileRes.user,
          completed_units: completedUnits
        };

        setLiveUser(dbUser);
        updateUserProfile(dbUser);
        setCompletedIds(completedUnits);
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
  const accountUser = liveUser || user;
  const displayStreak = accountUser ? (accountUser.streak || 0) : 0;
  const displayXp = accountUser ? (accountUser.xp || 0) : 0;
  const packageName = String(accountUser?.package_name || '').toLowerCase();
  const packageExpiresAt = accountUser?.package_expires
    ? new Date(accountUser.package_expires).getTime()
    : null;
  const packageIsActiveByExpiry = Number.isFinite(packageExpiresAt) && packageExpiresAt > Date.now();
  const packageStillActive = !packageExpiresAt || packageExpiresAt > Date.now();
  const hasPaidAccess = Boolean(
    accountUser && packageStillActive && (
      accountUser.role === 'admin' ||
      accountUser.role === 'tutor' ||
      packageIsActiveByExpiry ||
      accountUser.is_paid === true ||
      accountUser.subscription_status === 'active' ||
      Number(accountUser.package_id || 0) > 1 ||
      /pro|premium|intensive|enterprise|berbayar/.test(packageName)
    )
  );

  const currentLesson =
    lessons.find((lesson) => !completedIds.includes(lesson.id)) ||
    lessons[lessons.length - 1];
  const freeLessons = filteredLessons.filter((lesson) => lesson.id <= 2);
  const paidLessons = filteredLessons.filter((lesson) => lesson.id > 2);
  const freeVideos = allRecordings.slice(0, 2);
  const paidVideos = allRecordings.slice(2);

  const handleDownload = (item) => {
    if (!user) {
      setDownloadNotice(`🔒 Akses Terbatas: Silakan Login terlebih dahulu untuk mengunduh modul "${item.title}"!`);
      setShowAuthModal(true);
      return;
    }
    if (!hasPaidAccess) {
      setDownloadNotice('🔒 Modul & E-Book hanya tersedia untuk akun langganan.');
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

  const handlePlayVideo = (session, requiresPaidAccess = false) => {
    if (!user) {
      setDownloadNotice(`🔒 Silakan login terlebih dahulu untuk memutar video "${session.title}"!`);
      setShowAuthModal(true);
      return;
    }
    if (requiresPaidAccess && !hasPaidAccess) {
      setDownloadNotice('🔒 Video ini khusus akun langganan. Silakan pilih paket untuk membukanya.');
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

  const openLesson = (lesson, requiresPaidAccess = false) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (requiresPaidAccess && !hasPaidAccess) {
      setDownloadNotice('Kuis ini khusus akun berbayar. Pilih paket belajar untuk membuka seluruh unit.');
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

    const isAlreadyCompleted = completedIds.includes(selectedLesson.id);
    const nextCompleted = Array.from(new Set([...completedIds, selectedLesson.id]));
    setCompletedIds(nextCompleted);

    // Tandai user telah mengerjakan quiz & kumpulkan XP
    if (user) {
      const addedXp = customXp !== undefined ? customXp : (selectedLesson.xp || 100);
      const score = quizScore !== undefined ? quizScore : 100;

      const updatedUser = {
        ...(liveUser || user),
        xp: isAlreadyCompleted
          ? ((liveUser || user).xp || 0)
          : ((liveUser || user).xp || 0) + addedXp,
        points: isAlreadyCompleted
          ? ((liveUser || user).points || 0)
          : ((liveUser || user).points || 0) + Math.floor(addedXp / 2),
        streak: isAlreadyCompleted
          ? ((liveUser || user).streak || 0)
          : ((liveUser || user).streak || 0) + 1,
        has_completed_quiz: true,
        quiz_completed: true,
        quizzes_completed: isAlreadyCompleted
          ? ((liveUser || user).quizzes_completed || 0)
          : ((liveUser || user).quizzes_completed || 0) + 1,
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
          // Sinkronisasi dengan database secara langsung dan presisi
          const dbUser = {
            ...(liveUser || user),
            xp: res.xp !== undefined ? res.xp : updatedUser.xp,
            points: res.points !== undefined ? res.points : updatedUser.points,
            streak: res.streak !== undefined ? res.streak : updatedUser.streak,
            has_completed_quiz: true,
            quiz_completed: true,
            completed_units: nextCompleted
          };
          setLiveUser(dbUser);
          updateUserProfile(dbUser);
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

          {/* Character Mashira Orang sitting exactly on the bottom border/line of the card */}
          <div className="absolute bottom-0 right-[5%] lg:right-[8%] hidden lg:block pointer-events-none z-10">
            <img
              src="/mashira orang.png"
              alt="Mashira, AI speaking companion"
              className="h-[340px] sm:h-[390px] w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFFF00] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0362C0] sm:text-xs">
                <Sparkles className="h-4 w-4" />
                LMS STUDENT AREA • MAHIR SPEAKING
              </div>
              <h1 className="mt-5 max-w-4xl font-stinger text-4xl font-black uppercase leading-[0.94] sm:text-6xl lg:text-7xl">
                Akses Quizz & <span className="block text-[#FFFF00]">Ruang Belajar Siswa</span>
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
                  <span>Kuis & Learning Path</span>
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
                  <span>Video Pembelajaran</span>
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[260px] lg:block">
              {/* Spacer container to keep the right column space occupied */}
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

              {!hasPaidAccess && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Khusus akun langganan</span>
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
                <div key={item.id} className={`relative bg-slate-50 border-2 p-6 rounded-3xl space-y-4 flex flex-col justify-between transition-all ${hasPaidAccess ? 'border-slate-200 hover:border-brand' : 'border-slate-300'}`}>
                  {!hasPaidAccess && (
                    <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-[#FFFF00] shadow-lg">
                      <Lock className="h-4 w-4" />
                    </div>
                  )}
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
                    className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all border-2 border-dark flex items-center justify-center gap-2 cursor-pointer shadow-md ${hasPaidAccess
                      ? 'bg-[#FFFF00] text-slate-950 hover:bg-yellow-300 hover:scale-[1.01]'
                      : 'bg-slate-900 text-white hover:bg-[#0362C0]'
                      }`}
                  >
                    {hasPaidAccess ? <Download className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-4 h-4 text-[#FFFF00]" />}
                    <span>{hasPaidAccess ? `Download ${item.type || 'Modul'}` : 'Terkunci • Lihat Paket'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 📹 TAB 2: VIDEO PEMBELAJARAN */}
      {activeHubTab === "recordings" && (
        <section ref={videoPlayerRef} className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
          <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-4xl border-4 border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="bg-[#FFFF00] text-[#08203C] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  VIDEO LEARNING LIBRARY
                </span>
                <h2 className="font-stinger font-black text-2xl sm:text-4xl text-white mt-2">
                  Video Pembelajaran
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1">
                  Tonton video gratis atau buka koleksi lengkap melalui akun langganan.
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

            {[
              { key: 'free-video', title: 'Video Gratis', items: freeVideos, premium: false },
              { key: 'paid-video', title: 'Video Akun Langganan', items: paidVideos, premium: true }
            ].map((videoSection) => (
              <div key={videoSection.key} className="space-y-4 rounded-3xl border border-slate-700 bg-slate-950/40 p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-white">{videoSection.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {videoSection.premium ? 'Koleksi premium untuk akun dengan paket aktif.' : 'Bisa ditonton oleh semua akun yang sudah login.'}
                    </p>
                  </div>
                  {videoSection.premium && !hasPaidAccess && <Lock className="h-5 w-5 text-[#FFFF00]" />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoSection.items.map((session) => {
                    const videoLocked = videoSection.premium && !hasPaidAccess;
                    return (
                      <div key={session.id} className="bg-slate-800 border border-slate-700 p-6 rounded-3xl space-y-4 flex flex-col justify-between hover:border-[#FFFF00] transition-all overflow-hidden">

                        {/* THUMBNAIL PREVIEW (HANYA 1 TOMBOL PLAY DI TENGAH TERSEDIA) */}
                        {session.thumbnail && (
                          <div
                            onClick={() => handlePlayVideo(session, videoSection.premium)}
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
                                {videoLocked ? <Lock className="w-6 h-6" /> : <Play className="w-7 h-7 fill-current ml-1" />}
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
                    );
                  })}
                </div>
              </div>
            ))}
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

          {downloadNotice && !downloadNotice.includes('Mengunduh') && (
            <section className="mx-auto mt-6 max-w-[1440px] px-3 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold text-amber-900 sm:flex-row sm:items-center sm:justify-between">
                <span>{downloadNotice}</span>
                {user && !hasPaidAccess && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('pricing')}
                    className="rounded-xl bg-[#0362C0] px-4 py-2 text-xs font-black text-white hover:bg-slate-900"
                  >
                    Lihat Paket
                  </button>
                )}
              </div>
            </section>
          )}

          {[
            {
              key: 'free',
              title: 'Quizz Gratis',
              description: 'Mulai belajar tanpa membeli paket. Unit ini terbuka untuk semua akun.',
              items: freeLessons,
              premium: false,
              badge: 'FREE ACCESS',
              headingClass: 'text-[#0362C0]',
              panelClass: 'border-blue-200 bg-gradient-to-br from-white to-blue-50'
            },
            {
              key: 'paid',
              title: 'Quizz Berlangganan',
              description: hasPaidAccess
                ? 'Paket akunmu aktif. Seluruh kuis premium sudah terbuka.'
                : 'Upgrade paket untuk membuka seluruh unit, latihan, dan kuis premium.',
              items: paidLessons,
              premium: true,
              badge: hasPaidAccess ? 'PREMIUM TERBUKA' : 'PREMIUM ACCESS',
              headingClass: 'text-slate-950',
              panelClass: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white'
            }
          ].map((section) => (
            <section key={section.key} className="mx-auto mt-8 max-w-[1440px] px-3 sm:px-6 lg:px-8">
              <div className={`rounded-[30px] border-2 p-5 shadow-lg sm:p-7 ${section.panelClass}`}>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black tracking-wider text-[#FFFF00]">
                      {section.premium && !hasPaidAccess ? <Lock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      {section.badge}
                    </span>
                    <h2 className={`mt-3 font-stinger text-2xl font-black sm:text-4xl ${section.headingClass}`}>
                      {section.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-xs font-semibold leading-relaxed text-slate-600 sm:text-sm">
                      {section.description}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm">
                    {section.items.length} Unit
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {section.items.map((lesson) => {
                    const Icon = lesson.icon;
                    const locked = section.premium && !hasPaidAccess;
                    const completed = completedIds.includes(lesson.id);

                    return (
                      <article
                        key={lesson.id}
                        className={`group relative overflow-hidden rounded-[26px] border bg-white shadow-lg shadow-blue-900/5 transition ${locked
                          ? 'border-slate-200'
                          : 'border-white hover:-translate-y-1.5 hover:shadow-2xl'
                          }`}
                      >
                        <div className={`h-2 bg-gradient-to-r ${locked ? 'from-slate-300 to-slate-400' : lesson.color}`} />
                        <div className={`p-5 sm:p-6 ${locked ? 'opacity-75' : ''}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg ${locked ? 'bg-slate-400' : `bg-gradient-to-br ${lesson.color}`
                                }`}>
                                {locked ? <Lock className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                              </div>
                              <div>
                                <div className="inline-block rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#0362C0]">
                                  UNIT {String(lesson.id).padStart(2, '0')} • {section.premium ? `PREMIUM • ${lesson.id <= 15 ? 'BASIC' : lesson.id <= 27 ? 'INTERMEDIATE' : 'ADVANCE'}` : 'GRATIS'}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                  <HelpCircle className="h-3.5 w-3.5 fill-amber-100 text-amber-500" />
                                  20 Soal Kuis • Maks. 100 XP
                                </div>
                              </div>
                            </div>
                            {completed && !locked && (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            )}
                          </div>

                          <h3 className="mt-4 text-xl font-black leading-snug">{lesson.title}</h3>
                          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-500">
                            {lesson.description}
                          </p>

                          <div className="mt-6 border-t border-slate-100 pt-4">
                            <button
                              type="button"
                              onClick={() => openLesson(lesson, section.premium)}
                              className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-black shadow-md transition-all ${locked
                                ? 'cursor-pointer bg-slate-900 text-white hover:bg-[#0362C0]'
                                : 'cursor-pointer bg-[#0362C0] text-white hover:bg-slate-900'
                                }`}
                            >
                              {locked ? <Lock className="h-4 w-4" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                              {locked ? 'Terkunci • Lihat Paket' : 'Buka Quizz'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
        </>
      )}

      {/* LESSON & 20-SOAL QUIZ MODAL OVERLAY */}
      {selectedLesson && (
        (selectedLesson.id > 2) ? (
          <PremiumQuizModal
            selectedLesson={selectedLesson}
            closeLesson={closeLesson}
            finishLesson={finishLesson}
            setActiveTab={setActiveTab}
          />
        ) : (
          <FreeQuizModal
            selectedLesson={selectedLesson}
            closeLesson={closeLesson}
            finishLesson={finishLesson}
            setActiveTab={setActiveTab}
          />
        )
      )}

      {/* 🔒 AUTH REQUIRED MODAL UNTUK QUIZ & LESSON */}
      {showAuthModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
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
        </div>,
        document.body
      )}

    </div>
  );
}
