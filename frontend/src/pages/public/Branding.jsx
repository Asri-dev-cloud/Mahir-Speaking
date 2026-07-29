import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, Award, Play, ArrowRight, Video, Camera, Maximize2, X, 
  UserCheck, Star, Users, CheckCircle2, ChevronRight, Volume2
} from 'lucide-react';

export default function Branding() {
  const { setActiveTab } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [stackIndex, setStackIndex] = useState(2); // Center card active

  const galleryCategories = [
    { id: 'all', label: 'Semua Galeri' },
    { id: 'tutor-1on1', label: 'Mentorship 1-on-1' },
    { id: 'native', label: 'Native Speaker' },
    { id: 'workshop', label: 'IELTS & Business Prep' }
  ];

  const showcaseStack = [
    {
      id: 0,
      title: "1-on-1 Native Mentorship",
      category: "Native Session",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      instructor: "Mr. David Miller (UK Native Mentor)"
    },
    {
      id: 1,
      title: "Interactive Group Speaking",
      category: "Active Drill",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      instructor: "Miss Sarah Wijaya, M.Ed"
    },
    {
      id: 2,
      title: "Real Instructor Live Coaching",
      category: "Masterclass",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      instructor: "Coach Alex, Cambridge Certified"
    },
    {
      id: 3,
      title: "IELTS Speaking Band 7.5+",
      category: "IELTS Prep",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      instructor: "Mr. James Watson, IELTS Examiner"
    },
    {
      id: 4,
      title: "Business Pitching Mentorship",
      category: "Corporate",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
      instructor: "Coach Amanda, Corporate Mentor"
    }
  ];

  const bentoWallPhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      title: "Sesi Mentorship 1-on-1 Tatap Muka",
      category: "tutor-1on1",
      categoryName: "Mentorship 1-on-1",
      desc: "Bimbingan langsung bersama Instruktur Ahli untuk koreksi pengucapan & intonasi secara akurat.",
      instructor: "Miss Sarah Wijaya, M.Ed"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      title: "Group Speaking Drill & Practice",
      category: "workshop",
      categoryName: "IELTS & Business Prep",
      desc: "Diskusi kelompok interaktif dibimbing fasilitator senior untuk membangun refleks bicara spontan.",
      instructor: "Coach Alex, Cambridge Certified"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      title: "Native Speaker Intensive Class",
      category: "native",
      categoryName: "Native Speaker",
      desc: "Praktik percakapan bahasa Inggris bisnis bersama penutur asli asal Inggris & Australia.",
      instructor: "Mr. David Miller (UK Native)"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      title: "Simulasi Ujian Lisan IELTS Band 7.5+",
      category: "workshop",
      categoryName: "IELTS & Business Prep",
      desc: "Simulasi cue card & pertanyaan IELTS bersama penguji lisan tersertifikasi.",
      instructor: "Mr. James Watson, IELTS Examiner"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
      title: "Business Pitching & Job Interview",
      category: "tutor-1on1",
      categoryName: "Mentorship 1-on-1",
      desc: "Latihan presentasi eksekutif dan persetujuan rapat bersama konsultan komunikasi.",
      instructor: "Coach Amanda, Executive Mentor"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      title: "Komunitas Active Speaker Weekly",
      category: "native",
      categoryName: "Native Speaker",
      desc: "Pertemuan mingguan siswa dan alumni untuk menjaga kelancaran bicara bahasa Inggris.",
      instructor: "Native Community Lead"
    }
  ];

  const galleryVideos = [
    {
      title: "Sesi Mentorship Speaking 1-on-1 Bersama Instruktur Profesional",
      level: "A1 - C1 All Levels",
      duration: "02:45",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Siswa dibimbing secara langsung oleh Instruktur Ahli dalam memperbaiki artikulasi, tata bahasa, dan intonasi secara real-time."
    },
    {
      title: "Simulasi Lisan Ujian IELTS Speaking Band 7.5+ dengan Penguji Tersertifikasi",
      level: "B2 - Upper Intermediate",
      duration: "03:40",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Strategi praktis menjawab pertanyaan cue card IELTS dengan pembawaan percaya diri, intonasi tepat, dan variasi kosakata kaya."
    },
    {
      title: "Masterclass Business English Pitching Bersama Native Speaker Mentor",
      level: "B1 - Intermediate",
      duration: "01:50",
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Panduan presentasi profesional untuk wawancara kerja dan rapat tim internasional menggunakan Metode PREP Framework."
    }
  ];

  const instructors = [
    {
      name: "Mr. David Miller",
      role: "Senior Native English Mentor",
      origin: "United Kingdom (UK)",
      exp: "12+ Tahun Pengalaman",
      spec: "Native Accent & Professional Fluency",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Miss Sarah Wijaya, M.Ed",
      role: "Lead Master Instructor",
      origin: "Alumni University of Melbourne",
      exp: "8+ Tahun Pengalaman",
      spec: "Pronunciation & Intonation Specialist",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Mr. James Watson",
      role: "Certified IELTS Examiner Mentor",
      origin: "Australia",
      exp: "10+ Tahun Pengalaman",
      spec: "IELTS Speaking Band 7.5+ Coaching",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const filteredPhotos = activeCategory === 'all' 
    ? bentoWallPhotos 
    : bentoWallPhotos.filter(photo => photo.category === activeCategory);

  return (
    <div className="bg-[#050C18] text-white min-h-screen -mt-4 sm:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 py-8 sm:py-14 space-y-16 sm:space-y-24 overflow-hidden">
      
      {/* ========================================================================= */}
      {/* SECTION 1: FAN-OUT 3D CAROUSEL GALLERY HERO (Reference Screenshot 1) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
        


        {/* 3D FAN-OUT CAROUSEL STACK */}
        <div className="pt-4 pb-8 relative flex justify-center items-center h-64 sm:h-80 md:h-96">
          <div className="relative w-full max-w-4xl flex items-center justify-center">
            {showcaseStack.map((item, idx) => {
              // Calculate offset relative to active stack index
              const offset = idx - stackIndex;
              const isCenter = offset === 0;

              // 3D Rotations and Transforms for fan-out effect
              const rotateDeg = offset * 12;
              const translateX = offset * 90; // spacing on desktop
              const scaleVal = isCenter ? 1.15 : 0.88 - Math.abs(offset) * 0.08;
              const zIndexVal = 30 - Math.abs(offset) * 5;
              const opacityVal = Math.abs(offset) > 2 ? 0.3 : 1 - Math.abs(offset) * 0.15;

              return (
                <div
                  key={item.id}
                  onClick={() => setStackIndex(idx)}
                  style={{
                    transform: `translateX(${translateX}px) rotate(${rotateDeg}deg) scale(${scaleVal})`,
                    zIndex: zIndexVal,
                    opacity: opacityVal
                  }}
                  className={`absolute w-44 sm:w-60 md:w-72 h-56 sm:h-72 md:h-88 rounded-3xl sm:rounded-4xl overflow-hidden border-2 transition-all duration-500 ease-out cursor-pointer shadow-2xl ${
                    isCenter 
                      ? 'border-lime shadow-[0_0_60px_rgba(204,255,0,0.35)] ring-4 ring-lime/20' 
                      : 'border-slate-700/80 hover:border-slate-400'
                  }`}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  
                  {/* Overlay Gradient & Title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050C18] via-transparent to-transparent flex flex-col justify-end p-4 text-left">
                    <span className="text-[10px] font-black uppercase text-lime tracking-wider">{item.category}</span>
                    <h3 className="font-black text-xs sm:text-base text-white leading-snug">{item.title}</h3>
                    {isCenter && (
                      <p className="text-[10px] text-slate-300 font-medium truncate pt-0.5">{item.instructor}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Headline & CTA */}
        <div className="space-y-4 max-w-xl mx-auto pt-4 relative z-40">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Pelatihan Speaking Intensif <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-emerald-300 to-lime">Bersama Instruktur Ahli</span>
          </h2>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('pricing')}
              className="px-6 py-3 rounded-full bg-white text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:bg-lime transition-all transform hover:scale-105"
            >
              <span>Pilih Kelas Instruktur</span>
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: MORPHIC HERO & BENTO WALL GALLERY (Reference Screenshot 2) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Header Split Layout (Morphic Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-slate-800/80 pt-12">
          
          {/* Left Headline */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <span>Fitur Baru • Mentorship 1-on-1 Intensif</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Kuasai Speaking Bahasa Inggris <br />
              <span className="text-slate-400">Secara Alami & Percaya Diri</span>
            </h2>
          </div>

          {/* Right Paragraph Description & Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Mahir Speaking menghadirkan ekosistem pembelajaran bahasa Inggris lisan terstruktur bersama <strong className="text-lime font-bold">Instruktur Master & Native Mentor</strong>. Dapatkan koreksi pengucapan, tata bahasa, dan intonasi langsung secara real-time.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab('pricing')}
                className="px-5 py-2.5 rounded-xl bg-lime text-slate-950 font-black text-xs sm:text-sm cursor-pointer shadow-md hover:bg-lime/90 hover:scale-105 transition-all"
              >
                Mulai Belajar Sekarang
              </button>
              <button
                onClick={() => setActiveTab('lms')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
              >
                Lihat Jadwal Kelas
              </button>
            </div>
          </div>

        </div>

        {/* BENTO WALL GALLERY GRID */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <Camera className="w-5 h-5 text-lime" />
              <h3 className="font-black text-xl text-white">Galeri Foto Kegiatannya</h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {galleryCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                    activeCategory === cat.id
                      ? 'bg-lime text-slate-950 border-lime shadow-md'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-slate-900/80 rounded-3xl overflow-hidden border border-slate-800 shadow-xl hover:border-lime transition-all duration-300 group p-3 space-y-3 cursor-pointer"
              >
                <div className="h-52 sm:h-60 rounded-2xl overflow-hidden relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#050C18]/90 text-lime font-black text-[10px] px-3 py-1 rounded-full border border-white/10">
                    {photo.categoryName}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="px-1 space-y-1">
                  <h4 className="font-black text-sm text-white group-hover:text-lime transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">
                    {photo.desc}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 border-t border-slate-800/80">
                    <UserCheck className="w-3.5 h-3.5 text-lime" />
                    <span>{photo.instructor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: INSTRUCTOR HALL OF FAME */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-t border-slate-800/80 pt-12">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 text-lime text-xs font-black uppercase">
            <Award className="w-4 h-4" />
            <span>Tim Instruktur Profesional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Instruktur Ahli & Native Mentor</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Belajar langsung dengan instruktur tersertifikasi dan penguji ujian lisan internasional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instructors.map((inst, index) => (
            <div key={index} className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 hover:border-lime transition-all flex flex-col items-center text-center space-y-4 group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-lime/80 shadow-lg relative group-hover:scale-105 transition-transform">
                <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-lime bg-lime/10 px-3 py-0.5 rounded-full border border-lime/20">
                  {inst.origin}
                </span>
                <h3 className="font-black text-lg text-white pt-1">{inst.name}</h3>
                <p className="text-xs font-bold text-slate-400">{inst.role}</p>
              </div>
              <div className="w-full pt-3 border-t border-slate-800 text-xs font-semibold text-slate-400 space-y-1">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{inst.exp}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">{inst.spec}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: VIDEO SHOWCASE INSTRUCTOR MENTORSHIP */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-t border-slate-800/80 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Video className="w-5 h-5 text-indigo-400" />
            <h3 className="font-black text-xl text-white">Cuplikan Sesi Praktik Instruktur</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 text-white space-y-4 shadow-2xl">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative shadow-lg">
              <iframe
                src={galleryVideos[activeVideo].embedUrl}
                title={galleryVideos[activeVideo].title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black text-lime uppercase bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
                  {galleryVideos[activeVideo].level}
                </span>
                <span className="text-xs bg-slate-800 px-3 py-1 rounded-full font-bold text-slate-300">
                  Durasi: {galleryVideos[activeVideo].duration}
                </span>
              </div>
              <h4 className="font-black text-lg sm:text-xl text-white leading-snug">
                {galleryVideos[activeVideo].title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                {galleryVideos[activeVideo].description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            {galleryVideos.map((vid, idx) => (
              <div
                key={idx}
                onClick={() => setActiveVideo(idx)}
                className={`p-4 rounded-3xl cursor-pointer transition-all border flex items-center gap-4 ${
                  activeVideo === idx
                    ? 'bg-slate-900 text-white border-lime shadow-lg scale-[1.02]'
                    : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-24 h-16 rounded-2xl overflow-hidden bg-black flex-shrink-0 relative">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className={`w-6 h-6 fill-white text-white ${activeVideo === idx ? 'text-lime fill-lime' : ''}`} />
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <span className={`text-[10px] font-black uppercase ${activeVideo === idx ? 'text-lime' : 'text-slate-400'}`}>
                    {vid.level}
                  </span>
                  <h5 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug text-white">
                    {vid.title}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 border border-slate-700 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-lime uppercase bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
                {selectedPhoto.categoryName}
              </span>
              <h3 className="text-xl font-black text-white">{selectedPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">{selectedPhoto.desc}</p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-400 border-t border-slate-800">
                <UserCheck className="w-4 h-4 text-lime" />
                <span>Didampingi oleh: {selectedPhoto.instructor}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
