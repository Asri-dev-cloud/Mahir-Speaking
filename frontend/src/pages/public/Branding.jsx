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
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "One-on-One Speaking",
    category: "mentorship",
    label: "Mentorship",
    image: "/mo.png",
    description:
      "Sesi personal untuk melatih pelafalan, intonasi, dan rasa percaya diri.",
    color: "#0362C0",
  },
  {
    id: 2,
    title: "Interactive Group Class",
    category: "class",
    label: "Live Class",
    image: "/ma.png",
    description:
      "Belajar aktif lewat diskusi, role-play, dan speaking challenge bersama.",
    color: "#FFA715",
  },
  {
    id: 3,
    title: "English Practice Day",
    category: "community",
    label: "Community",
    image: "/mi.png",
    description:
      "Ruang aman untuk berlatih, bertemu teman baru, dan berani berbicara.",
    color: "#12B886",
  },
  {
    id: 4,
    title: "Career Speaking Workshop",
    category: "workshop",
    label: "Workshop",
    image: "/mo.png",
    description:
      "Latihan interview, presentasi, dan komunikasi profesional yang aplikatif.",
    color: "#7457E8",
  },
  {
    id: 5,
    title: "Weekly Speaking Mission",
    category: "class",
    label: "Speaking Mission",
    image: "/ma.png",
    description:
      "Tantangan mingguan singkat agar kebiasaan speaking terus bertumbuh.",
    color: "#0362C0",
  },
  {
    id: 6,
    title: "Student Celebration",
    category: "community",
    label: "Student Moment",
    image: "/mi.png",
    description:
      "Merayakan setiap progres kecil yang membuat siswa semakin percaya diri.",
    color: "#FFA715",
  },
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
    name: "Ms. Era Purike",
    role: "Speaking Mentor",
    focus: "One-on-One Speaking",
    image: "/mo.png",
  },
  {
    name: "Ms. Deasy Puspawati",
    role: "English Tutor",
    focus: "Daily Learning & Conversation",
    image: "/ma.png",
  },
  {
    name: "Ms. Ade Ihdinayah",
    role: "Speaking Mentor",
    focus: "Pronunciation & Confidence",
    image: "/mi.png",
  },
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
      ? activities
      : activities.filter((item) => item.category === activeCategory);

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
    <main className="min-h-screen overflow-x-hidden bg-white text-[#08203C]">
      <section className="relative overflow-hidden bg-[#87CEFA] px-4 pb-7 pt-6 sm:px-8 sm:pb-10 sm:pt-12">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-white/25 blur-2xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#FFFF00]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0362C0] shadow-sm backdrop-blur sm:text-xs">
              <Camera size={15} />
              Galeri Kegiatan Mahir Speaking
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

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0362C0]">
                <Users size={15} className="text-[#FFA715]" />
                Meet your mentors
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
                Ditemani mentor yang bikin kamu
                <span className="text-[#0362C0]"> berani mencoba.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              Bukan hanya menjelaskan materi, mentor juga mendampingi setiap
              proses latihanmu.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {mentors.map((mentor, index) => (
              <article
                key={mentor.name}
                className={`group relative flex items-center gap-4 overflow-hidden rounded-[24px] border p-4 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(3,98,192,0.13)] ${index === 1
                  ? "border-[#0362C0] bg-[#0362C0] text-white"
                  : "border-[#0362C0]/10 bg-white shadow-[0_10px_30px_rgba(8,32,60,0.07)]"
                  }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`absolute -inset-1 rounded-full ${index === 1 ? "bg-[#FFFF00]" : "bg-[#87CEFA]"
                      }`}
                  />
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="relative h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                  />
                </div>

                <div className="relative min-w-0">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${index === 1
                      ? "bg-white/10 text-[#FFFF00]"
                      : "bg-[#EAF6FF] text-[#0362C0]"
                      }`}
                  >
                    {mentor.role}
                  </span>
                  <h3 className="mt-2 truncate text-base font-black sm:text-lg">
                    {mentor.name}
                  </h3>
                  <p
                    className={`mt-1 text-xs font-semibold leading-5 ${index === 1 ? "text-white/65" : "text-slate-500"
                      }`}
                  >
                    {mentor.focus}
                  </p>
                </div>

                <Sparkles
                  size={42}
                  className={`absolute -bottom-2 -right-2 rotate-12 ${index === 1 ? "text-white/10" : "text-[#87CEFA]/30"
                    }`}
                />
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#FFFF00] px-4 py-3 text-center text-xs font-black text-[#0362C0] sm:text-sm">
            <Star size={16} fill="currentColor" />
            “Kamu tidak harus sempurna untuk mulai speaking—kamu hanya perlu
            berani mencoba.”
          </div>
        </div>
      </section>

      <section className="bg-[#F4FBFF] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#0362C0]">
                <Sparkles size={15} className="text-[#FFA715]" />
                Cerita dari ruang belajar
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
                Kegiatan yang bikin belajar
                <span className="text-[#0362C0]"> nggak membosankan.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Pilih kategori untuk melihat suasana belajar yang paling kamu
              suka.
            </p>
          </div>

          <div className="-mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-extrabold transition ${activeCategory === category.id
                  ? "bg-[#0362C0] text-[#FFFF00] shadow-md"
                  : "border border-[#0362C0]/15 bg-white text-[#42617F] hover:border-[#0362C0]/40"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedPhoto(item)}
                className={`group overflow-hidden rounded-[24px] bg-white text-left shadow-[0_12px_35px_rgba(8,32,60,0.08)] ring-1 ring-[#0362C0]/10 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(3,98,192,0.15)] ${index === 0 && filteredActivities.length > 2
                  ? "sm:row-span-2"
                  : ""
                  }`}
              >
                <div
                  className={`relative overflow-hidden ${index === 0 && filteredActivities.length > 2
                    ? "h-64 sm:h-[420px]"
                    : "h-56"
                    }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061A35]/85 via-transparent to-transparent" />
                  <span
                    style={{ backgroundColor: item.color }}
                    className="absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white"
                  >
                    {item.label}
                  </span>
                  <Maximize2
                    size={18}
                    className="absolute right-4 top-4 text-white opacity-0 transition group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="text-lg font-black">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-white/75">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

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
                Mulai dari satu latihan kecil, lalu tumbuh bersama komunitas
                Mahir Speaking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("lms")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0362C0] px-6 py-3.5 text-sm font-black text-[#FFFF00] shadow-md transition hover:-translate-y-0.5 sm:w-auto"
          >
            Mulai Belajar
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#061A35]/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.title}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup foto"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#061A35]/75 text-white"
            >
              <X size={19} />
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.title}
              className="max-h-[62vh] w-full object-cover"
            />
            <div className="p-5 sm:p-7">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0362C0]">
                {selectedPhoto.label}
              </span>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                {selectedPhoto.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {selectedPhoto.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Heart size={15} className="text-[#FFA715]" />
                  Keep growing
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={15} className="text-[#0362C0]" />
                  Speak with confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}