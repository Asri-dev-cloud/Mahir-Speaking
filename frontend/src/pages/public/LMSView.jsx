import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, Lock, Play, Star, Trophy, ArrowRight, BookOpen, ShieldCheck, 
  CheckCircle2, Zap, AlertCircle, X, HelpCircle, Layers, Award, Mic, Users,
  Globe, MessageSquare, Target, Check, Clock, ChevronRight, Video, RotateCcw, XCircle
} from 'lucide-react';

export default function LMSView() {
  const { user, setActiveTab } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Quiz Hub States inside LMS
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);

  const levelsData = [
    {
      code: 'A1',
      name: 'Foundation & Everyday Conversation',
      subtitle: 'Tingkat Pemula • Fondasi Bicara Percaya Diri',
      badge: 'Level A1',
      gradient: 'from-[#0C53CD] via-[#0E5AD6] to-[#0A4BB8]',
      accentColor: 'text-blue-400',
      badgeBg: 'bg-blue-600',
      description: 'Menguasai frasa percakapan sehari-hari, cara berkenalan yang alami, menanyakan arah jalan, serta memesan makanan di kafe tanpa kebingungan.',
      duration: '4 Minggu • 12 Sesi AI Voice',
      skills: ['Icebreaking & Salam', 'Order Cafe & Resto', 'Arah & Navigasi Kota', 'Hobi & Opini Pribadi'],
      lessons: [
        { 
          id: 101, 
          title: 'Modul 1.1: Self Introduction & Icebreakers', 
          type: 'AI Voice Drill', 
          duration: '20 Menit',
          icon: Mic,
          tag: 'Dasar Percakapan',
          desc: 'Teknik memperkenalkan diri secara alami menggunakan struktur PREP tanpa hafalan kaku.',
          takeaways: ['Menyampaikan nama & latar belakang', 'Membuat obrolan santai (small talk)', 'Mengatasi rasa gugup saat awal bicara']
        },
        { 
          id: 102, 
          title: 'Modul 1.2: Ordering Food & Coffee at a Cafe', 
          type: 'Roleplay AI', 
          duration: '25 Menit',
          icon: MessageSquare,
          tag: 'Skenario Realistis',
          desc: 'Simulasi memesan makanan dan minuman dengan ekspresi sopan & ekspresi penutur asli.',
          takeaways: ['Penggunaan frasa "I would like" vs "Can I get"', 'Kustomisasi pesanan & opsi makanan', 'Konfirmasi total pembayaran & ucapan terima kasih']
        },
        { 
          id: 103, 
          title: 'Modul 1.3: Asking & Giving Directions in a New City', 
          type: 'Interactive Scenario', 
          duration: '30 Menit',
          icon: Globe,
          tag: 'Navigasi Percakapan',
          desc: 'Navigasi kota, menanyakan petunjuk jalan, dan mempraktekan kosakata petunjuk lokasi.',
          takeaways: ['Menanyakan patokan tempat & blok jalan', 'Merespons arah "turn left", "straight ahead"', 'Meminta pengulangan instruksi dengan sopan']
        },
        { 
          id: 104, 
          title: 'Modul 1.4: Expressing Hobbies & Personal Preferences', 
          type: 'AI Diagnostic', 
          duration: '25 Menit',
          icon: Target,
          tag: 'Kosakata Ekstensif',
          desc: 'Membahas hobi, minat masa luang, dan hal yang disukai dengan kosakata ekspresif.',
          takeaways: ['Menggunakan kata sifat pendukung emosi', 'Menjelaskan alasan menyukai suatu aktivitas', 'Merangkai kalimat majemuk sederhana']
        }
      ]
    },
    {
      code: 'B1',
      name: 'Business English & Workplace Pitching',
      subtitle: 'Tingkat Menengah • Komunikasi Profesional & Dunia Kerja',
      badge: 'Level B1',
      gradient: 'from-[#D97706] via-[#F59E0B] to-[#B45309]',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-600',
      description: 'Kuasai percakapan dunia kerja: melakukan elevator pitch, berdiskusi di meeting bisnis, serta menjawab pertanyaan wawancara kerja secara meyakinkan.',
      duration: '6 Minggu • 18 Sesi AI + 2 Native Mentor',
      skills: ['Meeting Contributor', 'Wawancara Kerja STAR', 'Elevator Pitch 2 Menit', 'Negosiasi Penawaran'],
      lessons: [
        { 
          id: 201, 
          title: 'Modul 2.1: Professional Meeting Contributions & Debate', 
          type: 'Business Simulation', 
          duration: '35 Menit',
          icon: Users,
          tag: 'Dunia Kerja',
          desc: 'Cara menyampaikan pendapat, menyetujui, dan menyanggah gagasan di meeting resmi.',
          takeaways: ['Frasa profesional "In my perspective..."', 'Menyanggah ide tanpa menyinggung rekan kerja', 'Merangkum poin kesepakatan meeting']
        },
        { 
          id: 202, 
          title: 'Modul 2.2: Job Interview Strategies (STAR Method)', 
          type: 'Mock Interview AI', 
          duration: '40 Menit',
          icon: Award,
          tag: 'Karir & Interview',
          desc: 'Menjawab pertanyaan tantangan wawancara kerja menggunakan metode STAR (Situation, Task, Action, Result).',
          takeaways: ['Struktur cerita pencapaian karir', 'Menjelaskan kelemahan secara positif', 'Menjawab pertanyaan jebalan interviewer']
        },
        { 
          id: 203, 
          title: 'Modul 2.3: Elevator Pitch & Product Presentation', 
          type: 'Presentation Practice', 
          duration: '30 Menit',
          icon: Zap,
          tag: 'Presentasi Bisnis',
          desc: 'Mempresentasikan ide bisnis singkat dalam waktu 2 menit secara meyakinkan & berbobot.',
          takeaways: ['Hook pembuka presentasi yang memikat', 'Menyampaikan masalah & solusi produk', 'Call-to-action penutup yang kuat']
        },
        { 
          id: 204, 
          title: 'Modul 2.4: Email Follow-up & Professional Negotiation', 
          type: 'Roleplay AI', 
          duration: '30 Menit',
          icon: MessageSquare,
          tag: 'Negosiasi',
          desc: 'Negosiasi bisnis sederhana, mendiskusikan tenggat waktu, dan mengomunikasikan penawaran.',
          takeaways: ['Strategi tawar-menawar profesional', 'Penggunaan frasa kompromi win-win', 'Konfirmasi poin kesepakatan tertulis']
        }
      ]
    },
    {
      code: 'B2',
      name: 'IELTS Speaking 7.0+ Intensive Mastery',
      subtitle: 'Tingkat Lanjutan • Spesialisasi Tes IELTS Band 7.0 - 8.5',
      badge: 'Level B2',
      gradient: 'from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]',
      accentColor: 'text-purple-300',
      badgeBg: 'bg-purple-600',
      description: 'Latihan intensif kisi-kisi tes IELTS Speaking. Kuasai monolog cue card Part 2 dan diskusi abstrak Part 3 untuk target skor IELTS Band 7.0+.',
      duration: '8 Minggu • 24 Sesi AI + 4 Mock Test IELTS',
      skills: ['IELTS Part 1 Warm-up', 'Part 2 Cue Card Monologue', 'Part 3 Abstract Analysis', 'Idioms & Lexical Resource'],
      lessons: [
        { 
          id: 301, 
          title: 'Modul 3.1: IELTS Speaking Part 1 Warm-up & Fluency', 
          type: 'IELTS Simulation', 
          duration: '30 Menit',
          icon: Sparkles,
          tag: 'IELTS Mastery',
          desc: 'Strategi menjawab pertanyaan umum Part 1 dengan kelancaran tanpa jeda kebingungan.',
          takeaways: ['Menjawab spontan tanpa hafalan', 'Memvariasikan tata bahasa kompleks', 'Menghindari jawaban "yes/no" pendek']
        },
        { 
          id: 302, 
          title: 'Modul 3.2: Part 2 Cue Card 2-Minute Monologue Strategy', 
          type: 'Monologue Simulator', 
          duration: '45 Menit',
          icon: Video,
          tag: 'Cue Card Monolog',
          desc: 'Menyusun struktur monolog 2 menit menggunakan teknik mind-mapping kilat dalam 1 menit persiapan.',
          takeaways: ['Pemetaan poin 1 menit prep time', 'Menjaga alur bicara konsisten 120 detik', 'Teknik penutup cerita yang mulus']
        },
        { 
          id: 303, 
          title: 'Modul 3.3: Part 3 Abstract Discussion & Opinion Formulations', 
          type: 'Deep Discussion', 
          duration: '40 Menit',
          icon: Target,
          tag: 'Diskusi Kritis',
          desc: 'Analisis topik abstrak, membandingkan masa lalu vs masa depan, dan argumen kritis berbobot.',
          takeaways: ['Menganalisis tren sosial & dampak global', 'Mengemukakan hipotesis masa depan', 'Penggunaan kata penghubung akademis']
        },
        { 
          id: 304, 
          title: 'Modul 3.4: Lexical Resource & Pronunciation Mastery', 
          type: 'Examiner Score Diagnostic', 
          duration: '35 Menit',
          icon: Trophy,
          tag: 'Penilaian Examiner',
          desc: 'Penggunaan idiom alami, collocations, dan intonasi khas penutur asli yang disukai penguji IELTS.',
          takeaways: ['15 Idiom frekuensi tinggi IELTS 7.0+', 'Koreksi penekanan suku kata & word stress', 'Meningkatkan skor kejelasan pengucapan']
        }
      ]
    },
    {
      code: 'C1',
      name: 'C1 Public Speaking & Persuasive Debating',
      subtitle: 'Tingkat Mahir • Retorika Debat & Kelancaran Penutur Asli',
      badge: 'Level C1',
      gradient: 'from-[#0A1128] via-[#1E293B] to-[#020617]',
      accentColor: 'text-lime',
      badgeBg: 'bg-slate-900',
      description: 'Tingkat tertinggi kelancaran bicara bahasa Inggris. Pelajari seni pidato persuasif di atas panggung, modulasi suara publik, dan merespons sanggahan spontan.',
      duration: '6 Minggu • Sesi Native Mentor Exclusives',
      skills: ['Public Keynote Speech', 'Spontaneous Debate', 'Rhetorical Devices', 'Stage Modulation'],
      lessons: [
        { 
          id: 401, 
          title: 'Modul 4.1: Persuasive Keynote Speech & Rhetorical Devices', 
          type: 'Public Speaking', 
          duration: '40 Menit',
          icon: Award,
          tag: 'Pidato Panggung',
          desc: 'Penggunaan gaya bahasa retoris, anekdot memikat, dan penekanan suara panggung yang persuasif.',
          takeaways: ['Teknik modulasi suara & pause dramatis', 'Penggunaan alat retoris (Triad & Anaphora)', 'Menyampaikan pesan yang membekas']
        },
        { 
          id: 402, 
          title: 'Modul 4.2: Spontaneous Debate & Counter-Argument Formulations', 
          type: 'Debate AI', 
          duration: '45 Menit',
          icon: MessageSquare,
          tag: 'Debat Spontan',
          desc: 'Latihan merespons sanggahan secara spontan tanpa naskah dalam kondisi tekanan tinggi.',
          takeaways: ['Menemukan celah logika argumen lawan', 'Menyusun pola sanggahan "Recognize & Refute"', 'Menjaga ketenangan emosi saat debat']
        }
      ]
    }
  ];

  const filteredLevels = selectedLevel === 'ALL' 
    ? levelsData 
    : levelsData.filter(lvl => lvl.code === selectedLevel);

  const quizzesList = [
    {
      code: 'A1',
      title: 'A1 Foundation & Everyday Speaking Quiz',
      level: 'Level A1',
      color: 'from-[#0C53CD] via-[#0E5AD6] to-[#0A4BB8]',
      badgeBg: 'bg-blue-600',
      desc: 'Uji pemahaman dasar frasa percakapan, cara berkenalan, dan memesan makanan di kafe.',
      questions: [
        {
          id: 1,
          question: "How do you politely order coffee in English at a cafe?",
          options: [
            "Give me one iced latte now.",
            "Could I please get an iced oat milk latte?",
            "I want coffee.",
            "Make coffee fast."
          ],
          correctAnswer: 1,
          explanation: "'Could I please get...' is the standard polite expression when ordering at food & beverage places."
        },
        {
          id: 2,
          question: "When someone asks 'How's your day going?', what is a natural friendly response?",
          options: [
            "Yes, I am.",
            "It's going well, thanks! How about yours?",
            "I go home.",
            "Nothing day."
          ],
          correctAnswer: 1,
          explanation: "Friendly small-talk response that acknowledges them and asks in return."
        },
        {
          id: 3,
          question: "Which expression is used to ask for street directions politely?",
          options: [
            "Excuse me, could you tell me how to get to the station?",
            "Hey tell me where is station.",
            "Station where now?",
            "I want go station."
          ],
          correctAnswer: 0,
          explanation: "'Excuse me, could you tell me how to get to...' is polite and natural."
        }
      ]
    },
    {
      code: 'B1',
      title: 'B1 Business English & Workplace Pitching Quiz',
      level: 'Level B1',
      color: 'from-[#D97706] via-[#F59E0B] to-[#B45309]',
      badgeBg: 'bg-amber-600',
      desc: 'Uji kemampuan percakapan profesional, metode STAR wawancara kerja, dan elevator pitch.',
      questions: [
        {
          id: 1,
          question: "In the STAR job interview method, what does the letter 'A' stand for?",
          options: [
            "Attitude",
            "Action",
            "Achievement",
            "Analysis"
          ],
          correctAnswer: 1,
          explanation: "STAR stands for Situation, Task, Action, and Result."
        },
        {
          id: 2,
          question: "Which phrase is best used to politely express a different opinion in a business meeting?",
          options: [
            "You are completely wrong.",
            "I see your point, but have we considered this alternative?",
            "Bad idea, stop talking.",
            "No way."
          ],
          correctAnswer: 1,
          explanation: "Diplomatic disagreement starts with acknowledging their point before offering another perspective."
        },
        {
          id: 3,
          question: "What is the primary goal of a 2-minute Elevator Pitch?",
          options: [
            "To read a 10-page report line by line",
            "To hook the listener and clearly communicate key value",
            "To speak as fast as possible without breathing",
            "To ask for money immediately"
          ],
          correctAnswer: 1,
          explanation: "An elevator pitch delivers high-impact core value in 60-120 seconds."
        }
      ]
    },
    {
      code: 'B2',
      title: 'B2 IELTS Speaking 7.0+ Intensive Mastery Quiz',
      level: 'Level B2',
      color: 'from-[#7C3AED] via-[#6D28D9] to-[#4C1D95]',
      badgeBg: 'bg-purple-600',
      desc: 'Uji kesiapan kisi-kisi tes IELTS Speaking, monolog cue card Part 2, dan idiom.',
      questions: [
        {
          id: 1,
          question: "In IELTS Speaking Part 2 Cue Card, how much preparation time are you given before speaking?",
          options: [
            "10 seconds",
            "1 minute",
            "5 minutes",
            "No prep time at all"
          ],
          correctAnswer: 1,
          explanation: "You receive exactly 1 minute to make quick notes on your cue card topic."
        },
        {
          id: 2,
          question: "Which idiom best describes an event that happens extremely rarely?",
          options: [
            "Once in a blue moon",
            "Piece of cake",
            "Break a leg",
            "Bite the bullet"
          ],
          correctAnswer: 0,
          explanation: "'Once in a blue moon' means an event occurs very rarely."
        },
        {
          id: 3,
          question: "What is the examiner evaluating in the 'Lexical Resource' criterion?",
          options: [
            "How loud your voice is",
            "Range and precision of vocabulary including collocations",
            "How fast you write on paper",
            "Your accent background"
          ],
          correctAnswer: 1,
          explanation: "Lexical Resource assesses vocabulary range, idiom accuracy, and word choice precision."
        }
      ]
    },
    {
      code: 'C1',
      title: 'C1 Public Speaking & Persuasive Debating Quiz',
      level: 'Level C1',
      color: 'from-[#0A1128] via-[#1E293B] to-[#020617]',
      badgeBg: 'bg-slate-900',
      desc: 'Uji penguasaan retorika pidato panggung, modulasi suara, dan debat spontan.',
      questions: [
        {
          id: 1,
          question: "What rhetorical device repeats words at the beginning of successive sentences for dramatic impact?",
          options: [
            "Anaphora",
            "Metaphor",
            "Alliteration",
            "Hyperbole"
          ],
          correctAnswer: 0,
          explanation: "Anaphora repeats a word or phrase at the beginning of successive clauses."
        },
        {
          id: 2,
          question: "In spontaneous debating, what does the 'Recognize & Refute' strategy involve?",
          options: [
            "Ignoring the opponent's argument completely",
            "Acknowledging the opponent's premise before exposing its logical flaw",
            "Screaming louder than the opponent",
            "Admitting defeat right away"
          ],
          correctAnswer: 1,
          explanation: "Recognize & Refute shows active listening while effectively dismantling the opposing claim."
        }
      ]
    }
  ];

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizCompleted(false);
    setShowAnswerFeedback(false);
  };

  const handleSelectQuizOption = (optionIndex) => {
    if (showAnswerFeedback) return;
    setSelectedOption(optionIndex);
    setShowAnswerFeedback(true);
  };

  const handleNextQuizQuestion = () => {
    let currentCorrect = activeQuiz.questions[quizIndex].correctAnswer;
    let isCorrect = selectedOption === currentCorrect;
    let newScore = quizScore + (isCorrect ? 1 : 0);
    if (isCorrect) {
      setQuizScore(newScore);
    }

    if (quizIndex + 1 < activeQuiz.questions.length) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowAnswerFeedback(false);
    } else {
      setQuizCompleted(true);
      try {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* LOGGED IN STUDENT DASHBOARD HEADER & PROGRESS BANNER */}
      {user && (
        <div className="bg-gradient-to-r from-slate-900 via-brand to-slate-950 rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 text-white shadow-2xl border-2 border-slate-700 space-y-6 relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* User Welcome Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-lime text-dark px-3.5 py-1 rounded-full text-xs font-black uppercase border border-dark">
                <Sparkles className="w-3.5 h-3.5" /> Active Package: {user?.package_name || 'Standard Pro'} Plan
              </div>
              <h1 className="font-stinger font-black text-2xl sm:text-4xl text-white">
                Welcome back, {user?.full_name || 'Learner'}! 👋
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-semibold">
                You are currently on a <strong className="text-lime">{user?.streak || 7}-Day Speaking Streak</strong>. Keep up the daily practice!
              </p>
            </div>

            {/* User Gamified Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 min-w-[130px]">
                <div className="w-10 h-10 rounded-xl bg-lime/20 text-lime flex items-center justify-center font-black text-base">
                  ⚡
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total XP</div>
                  <div className="font-stinger font-black text-lg text-lime">{user?.xp || 1450} XP</div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 min-w-[130px]">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
                  🔥
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Streak</div>
                  <div className="font-stinger font-black text-lg text-white">{user?.streak || 7} Days</div>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 min-w-[130px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Points</div>
                  <div className="font-stinger font-black text-lg text-emerald-400">{user?.points || 420} Pts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Active Lesson Quick Action Widget */}
          <div className="bg-slate-950/90 p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-lime/20 text-lime px-2.5 py-0.5 rounded text-[10px] font-black uppercase border border-lime/30">
                  Level A1 • Modul 1.1
                </span>
                <span className="text-[11px] font-bold text-slate-400">Current Speaking Lesson</span>
              </div>
              <h3 className="font-stinger font-black text-lg text-white">Self Introduction & Icebreakers</h3>
              <p className="text-xs text-slate-400 font-medium">Target Vocabulary: Delighted, Profession, Enthusiastic, Casual</p>
              <div className="w-full sm:w-64 bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-lime h-full w-3/4 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('lesson-view')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-lime text-dark font-black text-xs shadow-limeGlow hover:scale-105 transition-transform flex items-center justify-center gap-2 border-2 border-dark cursor-pointer flex-shrink-0"
              >
                <Play className="w-4 h-4 fill-dark" />
                <span>Resume Practice</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-chat')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer flex-shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-lime" />
                <span>AI Coach</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* HERO SECTION BANNER */}
      <div className="relative bg-gradient-to-br from-[#0845B2] via-[#0B52CE] to-[#052C77] rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 text-white shadow-2xl overflow-hidden border border-blue-400/40 space-y-6">
        
        {/* Decorative Vector Light Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Tag Badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 bg-lime text-dark px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md border border-dark">
            <BookOpen className="w-4 h-4 text-dark" />
            <span>LMS Silabus & Kurikulum Pembelajaran</span>
          </div>

          <div className="inline-flex items-center gap-2 bg-dark/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-lime" />
            <span>Pratinjau Bebas Sebelum Berlangganan</span>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="relative z-10 space-y-3 max-w-3xl">
          <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight uppercase drop-shadow-md">
            KURIKULUM & ROADMAP <br />
            <span className="text-[#FFC700]">KELANCARAN SPEAKING</span>
          </h1>
          <p className="text-slate-100 text-xs sm:text-base font-semibold leading-relaxed max-w-2xl drop-shadow-sm">
            Lihat silabus lengkap 4 tingkatan CEFR, modul latihan suara AI, simulasi wawancara kerja, dan persiapan IELTS. Ketahui persis apa yang bakal Anda pelajari sebelum mengaktifkan paket!
          </p>
        </div>

        {/* Stats Summary Bar */}
        <div className="relative z-10 pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="font-black text-xl sm:text-2xl text-lime">4 Level</div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Tingkat CEFR (A1 - C1)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="font-black text-xl sm:text-2xl text-[#FFC700]">14 Modul</div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Latihan Percakapan Interaktif</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="font-black text-xl sm:text-2xl text-lime">24/7 AI</div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">AI Voice Diagnostic</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
            <div className="font-black text-xl sm:text-2xl text-white">Native Mentor</div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Sesi Privat 1-on-1</div>
          </div>
        </div>

      </div>

      {/* FILTER LEVEL TABS (ULTRA-CLEAN NO-SCROLLBAR SUB-NAVBAR) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/95 backdrop-blur-2xl p-2.5 sm:p-3 rounded-3xl border-2 border-slate-200/90 shadow-xl relative z-20">
        
        {/* Horizontal Tabs without scrollbars */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { id: 'ALL', label: 'Modul Mahir Speaking', count: '14 Modul' },
            { id: 'QUIZ', label: '✦ Free Quizzes', isFree: true }
          ].map((tab) => {
            const isActive = selectedLevel === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer border-2 ${
                  isActive 
                    ? 'bg-slate-900 text-white border-dark shadow-xl scale-[1.03]' 
                    : tab.isFree 
                      ? 'bg-lime/20 text-dark border-lime/60 hover:bg-lime hover:scale-105 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.isFree ? (
                  <span className="bg-lime text-dark text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-dark animate-pulse">
                    FREE
                  </span>
                ) : (
                  tab.count && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-lime text-dark font-black' : 'bg-slate-200 text-slate-600 font-extrabold'
                    }`}>
                      {tab.count}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Pricing Quick Button */}
        <button
          onClick={() => setActiveTab('pricing')}
          className="w-full lg:w-auto px-6 py-3 rounded-2xl bg-lime text-dark font-black text-xs border-2 border-dark shadow-limeGlow hover:scale-105 transition-transform flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-dark" />
          <span>Buka Semua Akses (Pricing)</span>
        </button>
      </div>

      {/* INTERACTIVE QUIZZES HUB SECTION (100% FREE FOR ALL LEARNERS) */}
      {selectedLevel === 'QUIZ' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0B192C] to-slate-950 p-6 sm:p-10 rounded-3xl sm:rounded-4xl text-white border-2 border-slate-700 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-lime/15 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-lime text-dark px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-dark shadow-md">
                <Sparkles className="w-4 h-4 text-dark" />
                <span>100% GRATIS UNTUK SEMUA PENGGUNA</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">Tanpa Perlu Berlangganan</span>
            </div>

            <div className="relative z-10 space-y-2 max-w-3xl">
              <h2 className="font-stinger font-black text-3xl sm:text-5xl text-white tracking-wide">
                Uji Kemampuan <span className="text-lime underline decoration-lime/50 decoration-wavy">Speaking & Grammar</span> Kamu
              </h2>
              <p className="text-slate-300 text-xs sm:text-base font-semibold leading-relaxed">
                Pilih kuis interaktif sesuai level CEFR kamu. Dapatkan evaluasi skor instan, jawaban pembahasan mendalam, dan poin XP secara gratis!
              </p>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzesList.map((qz) => (
              <div 
                key={qz.code}
                className="bg-slate-950/90 text-white rounded-3xl p-6 sm:p-8 border-2 border-slate-800 hover:border-lime/60 shadow-xl transition-all space-y-6 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className={`${qz.badgeBg} text-white px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider border border-white/20`}>
                      {qz.level}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="bg-lime/20 text-lime border border-lime/40 text-[10px] font-mono font-black px-2.5 py-0.5 rounded-md">
                        100% FREE
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {qz.questions.length} Soal
                      </span>
                    </div>
                  </div>

                  <h3 className="font-stinger font-black text-xl sm:text-2xl text-white group-hover:text-lime transition-colors leading-snug">
                    {qz.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    {qz.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleStartQuiz(qz)}
                  className="w-full py-4 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2.5 border-2 border-dark cursor-pointer relative z-10"
                >
                  <Play className="w-4 h-4 fill-dark" />
                  <span>Mulai Quiz Gratis ({qz.code})</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ROADMAP SECTIONS DISPLAY */}
      <div className="space-y-12">
        {filteredLevels.map((lvl) => (
          <div key={lvl.code} className="space-y-6">
            
            {/* Level Hero Header Banner Card */}
            <div className={`bg-gradient-to-r ${lvl.gradient} rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-white/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              
              <div className="space-y-2 max-w-3xl relative z-10">
                <div className="flex items-center gap-3">
                  <span className="bg-white text-slate-900 px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                    {lvl.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {lvl.duration}
                  </span>
                </div>

                <h2 className="font-stinger font-black text-2xl sm:text-4xl text-white">
                  {lvl.name}
                </h2>
                <p className="text-slate-100 text-xs sm:text-sm font-semibold leading-relaxed">
                  {lvl.description}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {lvl.skills.map((sk, i) => (
                    <span key={i} className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-white border border-white/20 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-lime" /> {sk}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('pricing')}
                className="relative z-10 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-xs shadow-lg hover:scale-105 transition-all border-2 border-white/40 flex-shrink-0 flex items-center justify-center gap-2"
              >
                <span>Beli Akses {lvl.code}</span>
                <ArrowRight className="w-4 h-4 text-brand" />
              </button>
            </div>

            {/* Bento Grid Lessons Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lvl.lessons.map((les) => {
                const IconComponent = les.icon;
                return (
                  <div
                    key={les.id}
                    onClick={() => handleLessonClick(les, lvl.code)}
                    className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-brand transition-all shadow-sm hover:shadow-xl space-y-4 cursor-pointer relative flex flex-col justify-between"
                  >
                    
                    {/* Top Row: Icon, Tag & Lock Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center font-black group-hover:bg-brand group-hover:text-lime transition-all flex-shrink-0 border border-brand/20">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                            {les.tag}
                          </span>
                          <div className="text-[11px] font-extrabold text-brand pt-0.5">{les.type}</div>
                        </div>
                      </div>

                      <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 border border-amber-300 flex-shrink-0">
                        <Lock className="w-3.5 h-3.5 text-amber-600" /> Terkunci VIP
                      </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="space-y-2">
                      <h3 className="font-stinger font-black text-base sm:text-lg text-slate-900 group-hover:text-brand transition-colors leading-tight">
                        {les.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {les.desc}
                      </p>
                    </div>

                    {/* Bottom Key Takeaways Highlight Box */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                        Bakal Dipelajari & Dikuasai:
                      </div>
                      <ul className="space-y-1 text-xs font-bold text-slate-700">
                        {les.takeaways.map((tk, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0"></div>
                            <span>{tk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Row: Duration & Action Indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Estimasi: {les.duration}</span>
                      </div>

                      <div className="flex items-center gap-1 text-brand font-black group-hover:translate-x-1 transition-transform">
                        <span>Lihat Pratinjau</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* BOTTOM CONVERSION CTA BANNER */}
      <div className="bg-dark text-white p-8 sm:p-12 rounded-3xl sm:rounded-5xl text-center space-y-6 border-4 border-lime shadow-limeGlow relative overflow-hidden">
        <div className="space-y-2 max-w-2xl mx-auto">
          <span className="bg-lime text-dark px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-dark">
            ✦ Siap Menguasai Percakapan Bahasa Inggris?
          </span>
          <h2 className="font-stinger text-3xl sm:text-5xl font-black text-white leading-tight">
            Buka Akses Seluruh Modul LMS & AI Coach Sekarang!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold leading-relaxed">
            Dapatkan umpan balik intonasi real-time, evaluasi tatabahasa otomatis, serta sesi tutor native 1-on-1.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('pricing')}
            className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-lime text-dark font-black text-sm shadow-limeGlow hover:scale-105 transition-transform flex items-center justify-center gap-2 border-2 border-dark cursor-pointer"
          >
            <span>Beli Paket Spesial & Buka Semua Modul</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {!user && (
            <button
              onClick={() => setActiveTab('auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 text-white font-black text-sm border-2 border-white/30 hover:bg-white/20 transition-all cursor-pointer"
            >
              Daftar Akun Gratis
            </button>
          )}
        </div>
      </div>

      {/* PAYMENT LOCK MODAL POPUP */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 max-w-lg w-full space-y-6 border-4 border-brand shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <button 
              onClick={() => setShowLockModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center font-black mx-auto border-2 border-amber-300 shadow-md">
              <Lock className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-3.5 py-1 rounded-full border border-amber-300">
                🔒 Konten Terkunci • Akses VIP Diberlakukan
              </span>
              <h3 className="font-stinger font-black text-xl sm:text-2xl text-slate-900">
                {selectedLesson?.title || 'Materi LMS Terkunci'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
                Anda sedang melihat pratinjau silabus LMS. Untuk membuka modul latihan suara AI interaktif ini dan berlatih bersama tutor native, silakan aktifkan **Paket Premium VIP**.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 text-brand font-black">
                <Zap className="w-4 h-4 text-amberIcon" /> Fitur VIP yang akan terbuka:
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-600">
                <li>Latihan Suara AI & Speech Diagnostic Real-Time 24/7</li>
                <li>Simulasi wawancara kerja & tes IELTS 7.0+</li>
                <li>Sesi privat 1-on-1 bersama tutor native tersertifikasi</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setShowLockModal(false);
                  setActiveTab('pricing');
                }}
                className="w-full py-4 rounded-2xl bg-brand text-lime font-black text-sm shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 border-2 border-dark cursor-pointer"
              >
                <span>Aktifkan Paket Premium VIP (Lihat Pricing)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!user && (
                <button
                  onClick={() => {
                    setShowLockModal(false);
                    setActiveTab('auth');
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 font-extrabold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Sudah Punya Akun? Masuk di Sini
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* INTERACTIVE QUIZ PLAYER MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 max-w-2xl w-full space-y-6 border-4 border-slate-700 shadow-2xl relative my-auto overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-lime/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button 
              onClick={() => setActiveQuiz(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {!quizCompleted ? (
              <div className="space-y-6 relative z-10">
                
                {/* Header Info & Progress Bar */}
                <div className="space-y-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`${activeQuiz.badgeBg} text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm`}>
                        {activeQuiz.level} Quiz
                      </span>
                      <span className="bg-lime/20 text-lime text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border border-lime/30">
                        100% FREE
                      </span>
                    </div>

                    <span className="text-xs font-mono font-extrabold text-lime">
                      Pertanyaan {quizIndex + 1} / {activeQuiz.questions.length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-lime h-full transition-all duration-300 rounded-full shadow-limeGlow"
                      style={{ width: `${((quizIndex + 1) / activeQuiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-5">
                  <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest">
                    PILIH JAWABAN YANG PALING TEPAT:
                  </span>
                  <h3 className="font-stinger font-black text-xl sm:text-2xl text-white leading-snug">
                    {activeQuiz.questions[quizIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {activeQuiz.questions[quizIndex].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === activeQuiz.questions[quizIndex].correctAnswer;
                      const optionLetters = ['A', 'B', 'C', 'D'];

                      let optionStyle = "bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80";
                      let letterStyle = "bg-slate-800 text-slate-300";

                      if (showAnswerFeedback) {
                        if (isCorrect) {
                          optionStyle = "bg-emerald-950/90 border-2 border-emerald-500 text-emerald-100 font-extrabold shadow-lg";
                          letterStyle = "bg-emerald-500 text-slate-950 font-black";
                        } else if (isSelected) {
                          optionStyle = "bg-red-950/90 border-2 border-red-500 text-red-100 font-extrabold shadow-lg";
                          letterStyle = "bg-red-500 text-white font-black";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx)}
                          disabled={showAnswerFeedback}
                          className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${letterStyle}`}>
                              {optionLetters[idx]}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {showAnswerFeedback && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                          {showAnswerFeedback && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Box */}
                {showAnswerFeedback && (
                  <div className="bg-slate-950 border-l-4 border-lime p-4.5 rounded-2xl space-y-1.5 animate-in fade-in duration-200 shadow-lg">
                    <div className="text-[11px] font-black text-lime uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-lime" /> Pembahasan & Kunci Jawaban:
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {activeQuiz.questions[quizIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {showAnswerFeedback && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-4 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 border-2 border-dark cursor-pointer"
                  >
                    <span>{quizIndex + 1 === activeQuiz.questions.length ? 'Lihat Hasil & Skor Quiz' : 'Pertanyaan Selanjutnya ➔'}</span>
                  </button>
                )}

              </div>
            ) : (
              /* Quiz Finished View */
              <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-lime/20 text-lime border-2 border-lime flex items-center justify-center mx-auto shadow-limeGlow">
                  <Trophy className="w-10 h-10 text-lime" />
                </div>

                <div className="space-y-2">
                  <span className="bg-lime text-dark px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-dark">
                    ✦ Quiz Completed!
                  </span>
                  <h2 className="font-stinger font-black text-3xl sm:text-4xl text-white">
                    {activeQuiz.title}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm font-semibold">
                    Selamat! Kamu telah menyelesaikan kuis interaktif level {activeQuiz.level}.
                  </p>
                </div>

                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 max-w-sm mx-auto space-y-2 shadow-2xl">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">Skor Akhir Kamu</div>
                  <div className="text-5xl font-black text-lime drop-shadow-md">
                    {Math.round((quizScore / activeQuiz.questions.length) * 100)}%
                  </div>
                  <div className="text-xs font-bold text-slate-300">
                    {quizScore} dari {activeQuiz.questions.length} soal dijawab benar (+{quizScore * 25} XP)
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-lime" />
                    <span>Coba Lagi Quiz Ini</span>
                  </button>

                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-lime text-dark font-black text-xs sm:text-sm shadow-limeGlow hover:scale-105 transition-transform flex items-center justify-center gap-2 border-2 border-dark cursor-pointer"
                  >
                    <span>Selesai & Kembali ke LMS</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
