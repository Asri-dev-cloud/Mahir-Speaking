import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Shield, Award, Mic, Zap, Play, Volume2, Globe, ArrowRight, Video, Image, Camera } from 'lucide-react';

export default function Branding() {
  const { setActiveTab } = useAuth();
  const [activeVideo, setActiveVideo] = useState(0);

  const galleryPhotos = [
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      title: "Interactive Speaking Drill",
      category: "Learning Session"
    },
    {
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      title: "1-on-1 Native Tutor Mentorship",
      category: "Native Session"
    },
    {
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      title: "Community Workshop & IELTS Prep",
      category: "Workshop"
    },
    {
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      title: "Active Practice Lab",
      category: "AI Voice Lab"
    }
  ];

  const galleryVideos = [
    {
      title: "Demonstrasi AI Voice Coach 24/7",
      level: "A1 - C1 All Levels",
      duration: "02:15",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Lihat bagaimana AI Voice Coach mengoreksi pengucapan, tata bahasa, dan intonasi siswa secara real-time."
    },
    {
      title: "Simulasi Ujian Lisan IELTS Band 7.5+",
      level: "B2 - Upper Intermediate",
      duration: "03:40",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Strategi menjawab pertanyaan cue card IELTS dengan pembawaan percaya diri dan kosakata kaya."
    },
    {
      title: "Sesi Pitching Bahasa Inggris Bisnis",
      level: "B1 - Intermediate",
      duration: "01:50",
      thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Panduan presentasi profesional untuk wawancara kerja dan rapat tim menggunakan metode PREP."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* SECTION 1: BRAND STORY HERO */}
      <div className="bento-card-royal p-8 sm:p-14 rounded-4xl sm:rounded-5xl text-center space-y-6 relative overflow-hidden border-2 border-white/60 shadow-popout">
        <div className="inline-flex items-center gap-2 bg-lime text-dark text-xs font-black px-4 py-1.5 rounded-full uppercase border border-dark">
          <Sparkles className="w-4 h-4 fill-dark" /> Brand Identity & Vision
        </div>

        <h1 className="font-stinger text-4xl sm:text-6xl font-black text-white leading-tight">
          Mahir Speaking Identity
        </h1>

        <p className="text-slate-100 text-base sm:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          Membangun generasi Indonesia yang bebas dari rasa takut berbicara bahasa Inggris melalui teknologi diagnostik suara AI dan metode active speaking terstruktur.
        </p>

        <div className="pt-4 flex justify-center">
          <img src="/MP.png" alt="Mahir Speaking Logo" className="h-20 sm:h-28 w-auto object-contain bg-white p-3 rounded-3xl border-4 border-lime shadow-2xl" />
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE VIDEO GALLERY SHOWCASE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand text-lime flex items-center justify-center font-bold shadow-glow">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand">Showcase Media</span>
              <h2 className="font-stinger font-black text-2xl sm:text-3xl text-slate-900">Galeri Video Pembelajaran</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Active Video Player (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-slate-800 shadow-2xl space-y-4 p-4 text-white">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
              <iframe
                src={galleryVideos[activeVideo].embedUrl}
                title={galleryVideos[activeVideo].title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-lime uppercase">{galleryVideos[activeVideo].level}</span>
                <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full font-bold text-slate-300">Durasi: {galleryVideos[activeVideo].duration}</span>
              </div>
              <h3 className="font-stinger font-black text-xl text-white">{galleryVideos[activeVideo].title}</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{galleryVideos[activeVideo].description}</p>
            </div>
          </div>

          {/* Video List Items (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {galleryVideos.map((vid, idx) => (
              <div
                key={idx}
                onClick={() => setActiveVideo(idx)}
                className={`p-4 rounded-3xl cursor-pointer transition-all border-2 flex items-center gap-4 ${
                  activeVideo === idx
                    ? 'bg-brand text-lime border-brand shadow-glow scale-[1.02]'
                    : 'bg-white text-slate-800 border-white hover:border-slate-300'
                }`}
              >
                <div className="w-24 h-16 rounded-2xl overflow-hidden bg-slate-200 flex-shrink-0 relative">
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
                    <Play className="w-6 h-6 fill-white text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase opacity-90">{vid.level}</span>
                  <h4 className="font-bold text-xs sm:text-sm line-clamp-2">{vid.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* SECTION 3: PHOTO GALLERY BENTO SHOWCASE */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amberIcon text-white flex items-center justify-center font-bold shadow-goldGlow">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Visual Moments</span>
            <h2 className="font-stinger font-black text-2xl sm:text-3xl text-slate-900">Galeri Foto Kegiatannya</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryPhotos.map((photo, index) => (
            <div key={index} className="bento-card rounded-3xl overflow-hidden border-2 border-white group space-y-3 p-3">
              <div className="h-48 rounded-2xl overflow-hidden relative">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-2 right-2 bg-dark/80 text-lime font-black text-[10px] px-2.5 py-0.5 rounded-full border border-white/20">
                  {photo.category}
                </div>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 px-1">{photo.title}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: METHODOLOGY FRAMEWORK */}
      <div className="bento-card p-8 sm:p-12 rounded-4xl sm:rounded-5xl bg-white/95 space-y-8 shadow-popout border-2 border-white">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="bg-brand text-lime text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">Metode PREP Framework</span>
          <h2 className="font-stinger text-3xl font-black text-slate-900">Formula Bicara Bahasa Inggris Alami</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
            <div className="font-stinger font-black text-3xl text-brand">P</div>
            <h4 className="font-bold text-sm text-slate-900">Point</h4>
            <p className="text-xs text-slate-600 font-medium">Sampaikan pendapat utama secara tegas.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
            <div className="font-stinger font-black text-3xl text-brand">R</div>
            <h4 className="font-bold text-sm text-slate-900">Reason</h4>
            <p className="text-xs text-slate-600 font-medium">Berikan alasan pendukung yang logis.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
            <div className="font-stinger font-black text-3xl text-brand">E</div>
            <h4 className="font-bold text-sm text-slate-900">Example</h4>
            <p className="text-xs text-slate-600 font-medium">Sertakan contoh pengalaman nyata.</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-2">
            <div className="font-stinger font-black text-3xl text-brand">P</div>
            <h4 className="font-bold text-sm text-slate-900">Point</h4>
            <p className="text-xs text-slate-600 font-medium">Tutup dengan kesimpulan yang kuat.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
