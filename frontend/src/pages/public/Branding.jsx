import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ChevronRight,
  Heart,
  Maximize2,
  MessageCircle,
  Sparkles,
  Star,
  Users,
  X,
  CheckCircle2,
  XCircle,
  Globe,
  Award,
  Video,
  BookOpen
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "One-on-One Speaking",
    category: "mentorship",
    label: "Mentorship",
    image: "/a.jpeg",
    description:
      "Sesi personal untuk melatih pelafalan, intonasi, dan rasa percaya diri.",
    color: "#0362C0",
  },
  {
    id: 2,
    title: "Interactive Group Class",
    category: "class",
    label: "Live Class",
    image: "/b.jpeg",
    description:
      "Belajar aktif lewat diskusi, role-play, dan speaking challenge bersama.",
    color: "#FFA715",
  },
  {
    id: 3,
    title: "English Practice Day",
    category: "community",
    label: "Community",
    image: "/c.jpeg",
    description:
      "Ruang aman untuk berlatih, bertemu teman baru, dan berani berbicara.",
    color: "#12B886",
  },
  {
    id: 4,
    title: "Career Speaking Workshop",
    category: "workshop",
    label: "Workshop",
    image: "/d.jpeg",
    description:
      "Latihan interview, presentasi, dan komunikasi profesional yang aplikatif.",
    color: "#7457E8",
  },
  {
    id: 5,
    title: "Weekly Speaking Mission",
    category: "class",
    label: "Speaking Mission",
    image: "/r16.png",
    description:
      "Tantangan mingguan singkat agar kebiasaan speaking terus bertumbuh.",
    color: "#0362C0",
  },
  {
    id: 6,
    title: "Student Celebration",
    category: "community",
    label: "Student Moment",
    image: "/f.jpeg",
    description:
      "Merayakan setiap progres kecil yang membuat siswa semakin percaya diri.",
    color: "#FFA715",
  },
];

const galleryActivities = [
  {
    id: 1,
    title: "Sesi Pendampingan Individu",
    image: "/g.jpeg",
    description: "Fokus melatih rasa percaya diri siswa secara personal.",
    color: "#0362C0",
    label: "Mentorship",
    category: "mentorship"
  },
  {
    id: 2,
    title: "Diskusi Kelompok Interaktif",
    image: "/h.jpeg",
    description: "Kolaborasi aktif bertukar opini menggunakan bahasa Inggris sehari-hari.",
    color: "#FFA715",
    label: "Live Class",
    category: "class"
  },
  {
    id: 3,
    title: "Speaking Club & Community",
    image: "/i.jpeg",
    description: "Membangun rasa berani berdialog di lingkungan yang sangat suportif.",
    color: "#12B886",
    label: "Community",
    category: "community"
  },
  {
    id: 4,
    title: "Workshop Komunikasi Profesional",
    image: "/j.jpeg",
    description: "Mempersiapkan bekal interview kerja dan cara presentasi yang meyakinkan.",
    color: "#7457E8",
    label: "Workshop",
    category: "workshop"
  },
  {
    id: 5,
    title: "Evaluasi Pelafalan & Aksen",
    image: "/k.jpeg",
    description: "Bedah intonasi dan pengucapan agar terdengar natural layaknya native speaker.",
    color: "#0362C0",
    label: "Speaking Drill",
    category: "class"
  },
  {
    id: 6,
    title: "Perayaan Progres Kelulusan",
    image: "/l.jpeg",
    description: "Apresiasi atas konsistensi dan keberanian melangkah dari nol.",
    color: "#FFA715",
    label: "Student Moment",
    category: "community"
  },
  {
    id: 7,
    title: "Sesi Praktik Berpasangan",
    image: "/11.jpg",
    description: "Praktik dialog langsung antar siswa untuk melatih refleks berbicara.",
    color: "#12B886",
    label: "Peer Practice",
    category: "class"
  },
  {
    id: 8,
    title: "Mentoring Bersama Native Speaker",
    image: "/12.jpg",
    description: "Interaksi santai melatih kebiasaan mendengarkan aksen asli.",
    color: "#7457E8",
    label: "Native Session",
    category: "mentorship"
  },
  {
    id: 9,
    title: "Kelas Review Mingguan",
    image: "/13.jpg",
    description: "Evaluasi bersama atas pencapaian kuis dan tantangan mingguan.",
    color: "#0362C0",
    label: "Review Class",
    category: "class"
  },
  {
    id: 10,
    title: "Gathering Komunitas Bulanan",
    image: "/14.jpeg",
    description: "Aktivitas berkumpul bersama seluruh alumni dan mentor secara kekeluargaan.",
    color: "#FFA715",
    label: "Community Event",
    category: "community"
  },
  {
    id: 11,
    title: "Simulasi Wawancara Kerja",
    image: "/15.jpeg",
    description: "Latihan wawancara terarah menggunakan STAR method untuk persiapan karier.",
    color: "#7457E8",
    label: "Career Prep",
    category: "workshop"
  }
];

const categories = [
  { id: "all", label: "Semua" },
  { id: "mentorship", label: "Mentorship" },
  { id: "class", label: "Kelas" },
  { id: "workshop", label: "Workshop" },
  { id: "community", label: "Komunitas" },
];

const mentors = [
  {
    name: "Mr.Alfada Naufal",
    role: "Mahir Speaking",
    focus: "Daily Learning & Interactive Conversation",
    bio: "Mendampingi praktik percakapan harian, grammar yang aplikatif, serta pembentukan kebiasaan berkomunikasi aktif.",
    image: "/alfa.jpg",
    skills: ["Private 1-on-1", "Public Speaking", "Confidence Building"]
  },
  {
    name: "Ms. Deasy Puspawati",
    role: "Mahir Speaking",
    focus: "One-on-One Private Speaking & Confidence",
    bio: "Pengalaman 10+ tahun membimbing ratusan siswa, mahasiswa, pekerja mengatasi rasa takut bicara, memperlancar kelancaran presentasi, dan wawancara kerja.",
    image: "/deasy.jpg",
    skills: ["Daily Practice", "Grammar Drills", "Interactive Class"]
  },
  {
    name: "Mr.Garry Wilson",
    role: "Mahir Speaking",
    focus: "Pronunciation, Intonation & Accent Clarity",
    bio: "•	Penutus asli yang menjadi partner agar peserta berani bicara, terdengar jelas, natural, mudah dipahami.",
    image: "/garry.jpg ",
    skills: ["Phonetics", "Native Accent", "Speech Rhythm"]
  },
];

const programComparison = [
  {
    feature: "Akses Materi & Silabus",
    free: "Sampel & Modul Dasar Singkat",
    premium: "Modul Lengkap E-Book 4 Level CEFR + Audio Pack"
  },
  {
    feature: "Mentorship Tutor Senior",
    free: "Tidak Ada (Mandiri)",
    premium: "Pendampingan Langsung 1-on-1 / Small Class (Ms. Era, Ms. Deasy, Ms. Ade)"
  },
  {
    feature: "Native Speaker Meeting Session",
    free: "Tidak Termasuk",
    premium: "Tersedia Sesi Live Diskusi Bersama Native Speaker"
  },
  {
    feature: "Laporan Progres & Evaluasi",
    free: "Tanpa Laporan Evaluation",
    premium: "Detailed Monthly Progress Report & Feedback Instruktur"
  },
  {
    feature: "Akses Rekaman Kelas & LMS 24/7",
    free: "Akses Terbatas 7 Hari",
    premium: "Full Access 24/7 Rekaman Class, Kuis, & Modul LMS"
  },
  {
    feature: "Placement Test & Diagnostic",
    free: "Tes Singkat Mandiri",
    premium: "Diagnostic Level Assessment & Personal Career Guidance"
  },
  {
    feature: "Sertifikat Kelulusan Resmi",
    free: "Tidak Dapat Sertifikat",
    premium: "Official Certificate of Completion Ber-QR Code Verification"
  }
];

const quotes = [
  {
    text: "Jangan menunggu lancar untuk mulai berbicara. Berbicaralah untuk menjadi lancar.",
    tag: "Start before you are ready",
  },
  {
    text: "Kesalahan bukan tanda kamu gagal. Itu tanda kamu sedang berani mencoba.",
    tag: "Mistakes mean progress",
  },
  {
    text: "Satu kalimat hari ini bisa menjadi percakapan penuh percaya diri besok.",
    tag: "Little steps, big voice",
  },
];

export default function Branding() {
  const { setActiveTab } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filteredActivities =
    activeCategory === "all"
      ? galleryActivities
      : galleryActivities.filter((activity) => activity.category === activeCategory);

  const changeSlide = (direction) => {
    setActiveSlide((current) => {
      const next = current + direction;
      if (next < 0) return activities.length - 1;
      if (next >= activities.length) return 0;
      return next;
    });
  };

  const getSlideOffset = (index) => {
    let offset = index - activeSlide;
    if (offset > activities.length / 2) offset -= activities.length;
    if (offset < -activities.length / 2) offset += activities.length;
    return offset;
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#87CEFA] via-white to-white text-[#08203C]">
      {/* 1. HERO BRANDING GALLERY */}
      <section className="relative overflow-hidden bg-transparent px-4 pb-7 pt-6 sm:px-8 sm:pb-10 sm:pt-12">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#FFFF00]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0362C0] shadow-sm backdrop-blur sm:text-xs">
              <Camera size={15} />
              Galeri & Branding Mahir Speaking
            </div>
            <h1 className="mt-5 text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Belajar, berlatih,
              <span className="block text-[#FFFF00]">lalu berani bicara.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-6 text-[#083F78] sm:text-base">
              Intip keseruan kelas, mentorship, workshop, dan perjalanan siswa
              membangun kepercayaan diri bersama Mahir Speaking.
            </p>
          </div>

          <div className="relative mx-auto mt-8 h-[365px] max-w-4xl sm:mt-10 sm:h-[440px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {activities.map((item, index) => {
                const offset = getSlideOffset(index);
                const isActive = offset === 0;
                const isVisible = Math.abs(offset) <= 1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      isActive ? setSelectedPhoto(item) : setActiveSlide(index)
                    }
                    aria-label={`Lihat ${item.title}`}
                    style={{
                      transform: `translateX(${offset * 66}%) scale(${isActive ? 1 : 0.82}) rotate(${offset * 3}deg)`,
                      opacity: isVisible ? (isActive ? 1 : 0.58) : 0,
                      zIndex: isActive ? 20 : 10 - Math.abs(offset),
                      pointerEvents: isVisible ? "auto" : "none",
                    }}
                    className="absolute h-[330px] w-[78%] max-w-[330px] overflow-hidden rounded-[28px] border-4 border-white bg-[#0362C0] text-left shadow-[0_24px_55px_rgba(3,98,192,0.28)] transition-all duration-500 sm:h-[400px] sm:max-w-[380px]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061A35] via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-[#FFFF00] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0362C0]">
                      {item.label}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFFF00]">
                        Mahir Speaking Moments
                      </p>
                      <h2 className="text-xl font-black leading-tight sm:text-2xl">
                        {item.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/80 sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => changeSlide(-1)}
              aria-label="Foto sebelumnya"
              className="absolute left-0 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-white text-[#0362C0] shadow-lg transition hover:scale-105 sm:left-8"
            >
              <ArrowLeft size={19} />
            </button>
            <button
              type="button"
              onClick={() => changeSlide(1)}
              aria-label="Foto berikutnya"
              className="absolute right-0 top-1/2 z-30 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-white text-[#0362C0] shadow-lg transition hover:scale-105 sm:right-8"
            >
              <ArrowRight size={19} />
            </button>
          </div>

          <div className="mt-2 flex justify-center gap-2">
            {activities.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ke slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${activeSlide === index
                  ? "w-8 bg-[#0362C0]"
                  : "w-2.5 bg-white/75"
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. EDUKASI PROGRAM: FREE LEARNING vs KURSUS INTENSIF  */}
      <section className="bg-slate-900 text-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-[#C6F500] px-4 py-1.5 text-xs font-black uppercase text-[#0A1128]">
              EDUKASI PROGRAM MAHIR SPEAKING
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Perbedaan <span className="text-[#C6F500]">Program Belajar Gratis</span> vs <span className="text-cyan-400">Kursus Intensif </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-semibold">
              Pahami manfaat dari setiap program agar Anda dapat menentukan pilihan terbaik sesuai target kelancaran bicara Anda.
            </p>
          </div>

          {/* Cards Split Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Learning Box */}
            <div className="bg-slate-800 border-2 border-slate-700 p-6 rounded-3xl space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="bg-slate-700 text-slate-200 text-xs font-black px-3 py-1 rounded-full uppercase">
                  Program Belajar Gratis
                </span>
                <h3 className="text-xl font-black text-white">Komunitas & Latihan Mandiri</h3>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  Program gratis tanpa biaya bagi umum untuk berkenalan dengan ekosistem latihan Mahir Speaking pertemuan online dan praktik interaktif.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 font-semibold pt-2 border-t border-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Akses Kuis LMS Interaktif Publik</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Gabung Grup WA Komunitas Umum</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Mengikuti Weekly Live Webinar</li>
                  <li className="flex items-center gap-2 text-slate-400"><XCircle className="w-4 h-4 text-slate-500 flex-shrink-0" /> Tanpa Pendampingan Tutor Private</li>
                  <li className="flex items-center gap-2 text-slate-400"><XCircle className="w-4 h-4 text-slate-500 flex-shrink-0" /> Tanpa Sesi Native Speaker</li>
                </ul>
              </div>
              <button
                onClick={() => setActiveTab('lms')}
                className="w-full py-3 rounded-2xl bg-slate-700 text-white font-black text-xs hover:bg-slate-600 transition-all border border-slate-600"
              >
                Coba Free Learning Sekarang ➔
              </button>
            </div>

            {/* Premium Program Box */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-4 border-[#C6F500] p-6 rounded-3xl space-y-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <span className="absolute top-0 right-0 bg-[#C6F500] text-[#0A1128] text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
                RECOMMENDED PREPARATION
              </span>
              <div className="space-y-4">
                <span className="bg-[#C6F500] text-[#0A1128] text-xs font-black px-3 py-1 rounded-full uppercase">
                  Program Kursus Intensif
                </span>
                <h3 className="text-xl font-black text-white">Full Mentorship & Guaranteed Fluency</h3>
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                  Pendampingan intensif bersama Mentor Senior, evaluasi bulanan, rekaman materi 24/7, modul lengkap, & Native Speaker Meeting.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-100 font-bold pt-2 border-t border-slate-700">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C6F500] flex-shrink-0" /> Mentorship Mentor Berpengalaman</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C6F500] flex-shrink-0" /> Diagnostic Placement Test & Personal Roadmap</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C6F500] flex-shrink-0" /> Full Rekaman Sesi LMS & E-Book Lengkap</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C6F500] flex-shrink-0" /> Sertifikat Kelulusan Resmi & Progress Report</li>
                </ul>
              </div>
              <button
                onClick={() => setActiveTab('pricing')}
                className="w-full py-3 rounded-2xl bg-[#C6F500] text-[#0A1128] font-black text-xs hover:bg-emerald-400 transition-all border-2 border-dark"
              >
                Lihat Paket Kursus Premium ➔
              </button>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 overflow-x-auto">
            <h3 className="text-lg font-black text-[#C6F500] mb-4 text-center">Tabel Perbandingan Fitur Detail</h3>
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-700 text-slate-300 font-black">
                  <th className="p-3">Fitur Program</th>
                  <th className="p-3 text-slate-400">Program Belajar Gratis</th>
                  <th className="p-3 text-[#C6F500]">Program Kursus Intensif </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-semibold text-slate-200">
                {programComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/40 transition-colors">
                    <td className="p-3 font-bold text-white">{row.feature}</td>
                    <td className="p-3 text-slate-400">{row.free}</td>
                    <td className="p-3 text-emerald-300 font-bold">{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. PROFIL MENTOR & TUTOR EXPERIENCED + NATIVE SPEAKER MEETING */}
      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0362C0]">
                <Users size={15} className="text-[#FFA715]" />
                Experienced Tutors & Mentors
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
                Ditemani instruktur profesional yang bikin kamu
                <span className="text-[#0362C0]"> berani mencoba.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Bukan hanya menjelaskan teori, mentor mendampingi setiap ritme percakapanmu sampai lancar!
            </p>
          </div>

          {/* Detailed Tutor Profile Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {mentors.map((mentor, index) => (
              <div
                key={mentor.name}
                className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col justify-between space-y-5 hover:border-[#0362C0] transition-all shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-[#0362C0]/20 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <span className="bg-[#EAF6FF] text-[#0362C0] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                        {mentor.role}
                      </span>
                      <h3 className="text-lg font-black text-slate-900 mt-1">{mentor.name}</h3>
                      <p className="text-xs text-slate-500 font-bold">{mentor.focus}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-semibold leading-relaxed border-t border-slate-100 pt-3">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mentor.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/6281572120190?text=${encodeURIComponent(`Halo Mahir Speaking! Saya ingin konsultasi jadwal belajar bersama ${mentor.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-900 font-black text-xs text-center block hover:bg-[#0362C0] hover:text-white transition-all border border-slate-200"
                >
                  Konsultasi Belajar ➔
                </a>
              </div>
            ))}
          </div>

          {/* 🌍 NATIVE SPEAKER MEETING SESSION SHOWCASE BOX */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 rounded-4xl border-4 border-cyan-400 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-cyan-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase border border-white">
                <Globe className="w-4 h-4 text-slate-950 animate-spin" />
                <span>EXCLUSIVELY FOR PREMIUM STUDENTS</span>
              </div>
              <h3 className="font-stinger font-black text-2xl sm:text-4xl text-white">
                Native Speaker Meeting Session
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                Uji langsung rasa percaya dirimu dan tingkatkan pemahaman aksen internasional dalam sesi live interaktif bersama Native Speakers dari negara berbahasa Inggris.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-cyan-200">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Sesi Diskusi Kebudayaan & Habit</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Live Q&A & Pronunciation Check</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Sertifikat Kehadiran Sesi Native</span>
              </div>
            </div>

            <a
              href="https://wa.me/6281572120190?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20mengikuti%20Sesi%20Native%20Speaker%20Meeting."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-2xl bg-cyan-400 text-slate-950 font-black text-xs hover:bg-white transition-all border-2 border-white flex-shrink-0 shadow-lg"
            >
              Ikuti Native Speaker Session ➔
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#FFFF00] px-4 py-3 text-center text-xs font-black text-[#0362C0] sm:text-sm">
            <Star size={16} fill="currentColor" />
            “Kamu tidak harus sempurna untuk mulai speaking—kamu hanya perlu berani mencoba.”
          </div>
        </div>
      </section>

      {/* 4. GALLERY CATEGORY ACTIVITIES */}
      <section className="bg-[#F4FBFF] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0362C0]">
                <Sparkles size={15} className="text-[#FFA715]" />
                Dokumentasi & Aktivitas Belajar
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
                Keseruan Belajar & <span className="text-[#0362C0]">Aktivitas Komunitas</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Intip dokumentasi kegiatan mentoring, kelas interaktif, dan kebersamaan komunitas Mahir Speaking.
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryActivities.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedPhoto(item)}
                className={`group overflow-hidden rounded-[24px] bg-white text-left shadow-[0_12px_35px_rgba(8,32,60,0.08)] ring-1 ring-[#0362C0]/10 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(3,98,192,0.15)] ${index === 0 && galleryActivities.length > 2
                  ? "sm:row-span-2"
                  : ""
                  }`}
              >
                <div
                  className={`relative overflow-hidden ${index === 0 && galleryActivities.length > 2
                    ? "h-64 sm:h-[420px]"
                    : "h-56"
                    }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <Maximize2 size={24} className="text-white drop-shadow-md" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. QUOTES & CTA */}
      <section className="px-4 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] bg-[#0362C0] px-5 py-8 text-white shadow-[0_20px_50px_rgba(3,98,192,0.22)] sm:px-10 sm:py-12">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#FFFF00]">
            <Heart size={16} fill="currentColor" />A little reminder for you
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {quotes.map((quote, index) => (
              <article
                key={quote.tag}
                className={`rounded-[22px] border p-5 ${index === 1
                  ? "border-[#FFFF00] bg-[#FFFF00] text-[#08203C]"
                  : "border-white/20 bg-white/10"
                  }`}
              >
                <Star
                  size={20}
                  className={index === 1 ? "text-[#FFA715]" : "text-[#FFFF00]"}
                  fill="currentColor"
                />
                <p className="mt-4 text-base font-extrabold leading-6">
                  “{quote.text}”
                </p>
                <p
                  className={`mt-4 text-[10px] font-black uppercase tracking-[0.16em] ${index === 1 ? "text-[#0362C0]" : "text-white/60"
                    }`}
                >
                  {quote.tag}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-8 sm:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-[28px] border border-[#0362C0]/15 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:p-9">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#87CEFA] text-[#0362C0]">
              <Users size={23} />
            </div>
            <div>
              <h2 className="text-xl font-black sm:text-2xl">
                Mau jadi bagian dari cerita berikutnya?
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Mulai dari satu latihan kecil, lalu tumbuh bersama komunitas Mahir Speaking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0362C0] px-6 py-3.5 text-sm font-black text-[#FFFF00] shadow-md transition hover:-translate-y-0.5 sm:w-auto"
          >
            Daftar Kursus Sekarang
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-[28px] bg-transparent shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup foto"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
            >
              <X size={19} />
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="max-h-[85vh] w-full object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </main>
  );
}