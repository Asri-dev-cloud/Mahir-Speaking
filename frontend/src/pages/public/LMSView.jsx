import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, Lock, Play, Star, Trophy, ArrowRight, BookOpen, ShieldCheck, 
  CheckCircle2, Zap, AlertCircle, X, HelpCircle, Layers, Award, Mic, Users,
  Globe, MessageSquare, Target, Check, Clock, ChevronRight, Video
} from 'lucide-react';

export default function LMSView() {
  const { user, setActiveTab } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [showLockModal, setShowLockModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

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

  const handleLessonClick = (lesson, levelCode) => {
    const isUserPaid = user && (user.isPaid || user.has_active_subscription || user.role === 'admin' || user.role === 'tutor');
    
    if (isUserPaid) {
      setActiveTab('lesson-view');
    } else {
      setSelectedLesson({ ...lesson, levelCode });
      setShowLockModal(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
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

      {/* FILTER LEVEL TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border-2 border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua Level (14 Modul)' },
            { id: 'A1', label: 'A1 Foundation' },
            { id: 'B1', label: 'B1 Business' },
            { id: 'B2', label: 'B2 IELTS 7.0+' },
            { id: 'C1', label: 'C1 Public Speaking' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLevel(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex-shrink-0 border-2 ${
                selectedLevel === tab.id 
                  ? 'bg-brand text-lime border-dark shadow-glow scale-[1.02]' 
                  : 'bg-slate-50 text-slate-700 border-transparent hover:bg-slate-100 hover:text-brand'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('pricing')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-lime text-dark font-black text-xs border-2 border-dark shadow-limeGlow hover:scale-105 transition-transform flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Buka Semua Akses (Pricing)</span>
        </button>
      </div>

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

    </div>
  );
}
