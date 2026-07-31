import React, { useState } from 'react';
import { CheckCircle, Sparkles, Shield, Zap, Users, UserCheck, Star, Award, Check, MessageCircle, ArrowRight, BookOpen, Video, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PricingPage() {
  const { setActiveTab, user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('reguler'); // reguler | semi_private | private

  // 💰 Skema Pembiayaan Resmi Mahir Speaking (dari TOR)
  const pricingData = {
    reguler: {
      title: 'Kelas Reguler',
      participants: '4 – 8 Peserta / Kelas',
      badge: 'Paling Hemat & Interaktif',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'Suasana kelas kelompok kecil yang dinamis untuk membangun keberanian dan rasa percaya diri dalam berdiskusi.',
      levels: [
        {
          name: 'Basic Level',
          price: 'Rp 350.000',
          pertemuan: '8x Pertemuan @ 90 menit',
          desc: 'Perkenalan diri, daily conversation, vocab dasar, pronunciation, & asking answering.',
          popular: false
        },
        {
          name: 'Intermediate Level',
          price: 'Rp 500.000',
          pertemuan: '10x Pertemuan @ 90 menit',
          desc: 'Storytelling, group discussion, grammar for speaking, & public speaking dasar.',
          popular: true
        },
        {
          name: 'Advanced Level',
          price: 'Rp 750.000',
          pertemuan: '12x Pertemuan @ 90 menit',
          desc: 'Interview preparation, business English, debate, & professional communication.',
          popular: false
        }
      ]
    },
    semi_private: {
      title: 'Kelas Semi Private',
      participants: '2 – 3 Peserta / Kelas',
      badge: 'Focus & Fast Track',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Kelas sangat intensif dalam kelompok super kecil. Perhatian mentor maksimal & waktu praktek bicaramu jauh lebih banyak.',
      levels: [
        {
          name: 'Basic Level',
          price: 'Rp 650.000',
          pertemuan: '8x Pertemuan @ 90 menit',
          desc: 'Dasar percakapan interaktif & koreksi tata bahasa langsung.',
          popular: false
        },
        {
          name: 'Intermediate Level',
          price: 'Rp 850.000',
          pertemuan: '10x Pertemuan @ 90 menit',
          desc: 'Simulasi diskusi mendalam, presentasi, & improvisasi opini.',
          popular: true
        },
        {
          name: 'Advanced Level',
          price: 'Rp 1.200.000',
          pertemuan: '12x Pertemuan @ 90 menit',
          desc: 'Persiapan karir global, pitch presentasi, & nego bisnis.',
          popular: false
        }
      ]
    },
    private: {
      title: 'Kelas Private (1-on-1 VIP)',
      participants: '1-on-1 (Eksklusif Personal Mentoring)',
      badge: 'VIP Flexible & Personal',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      description: 'Bimbingan privat 1 lawan 1 eksklusif bersama Mentor Senior (Ms. Era, Ms. Deasy, Ms. Ade). Jam & materi bebas custom!',
      levels: [
        {
          name: 'Basic Level',
          price: 'Rp 1.200.000',
          pertemuan: '8x Pertemuan @ 90 menit',
          desc: 'Mentoring 1-on-1 privat perkenalan & percakapan harian.',
          popular: false
        },
        {
          name: 'Intermediate Level',
          price: 'Rp 1.500.000',
          pertemuan: '10x Pertemuan @ 90 menit',
          desc: 'Mentoring 1-on-1 privat storytelling, public speaking, & presentasi.',
          popular: true
        },
        {
          name: 'Advanced Level',
          price: 'Rp 2.000.000',
          pertemuan: '12x Pertemuan @ 90 menit',
          desc: 'Mentoring 1-on-1 privat wawancara kerja, business English, & IELTS.',
          popular: false
        }
      ]
    }
  };

  // 📋 Ke-15 Daftar Check-list Fasilitas Resmi Mahir Speaking
  const facilitiesList = [
    { title: 'E-Book & Modul Pembelajaran Eksklusif', desc: 'Materi terstruktur PDF siap download & dibaca kapan saja.' },
    { title: 'Native Speaker Meeting Session', desc: 'Sesi latihan langsung bersama penutur asli bahasa Inggris.' },
    { title: 'Detailed Progress Report & Monthly Evaluation', desc: 'Laporan perkembangan kemampuan bicara dari tutor.' },
    { title: 'Sertifikat Kelulusan Resmi (Completion Certificate)', desc: 'Sertifikat resmi bermaterai & terverifikasi Mahir Speaking.' },
    { title: 'Recorded Class / Akses Rekaman Sesi Materi', desc: 'Dapat diputar ulang 24/7 jika berhalangan hadir live.' },
    { title: 'Vocabulary & Expression Pack Update Rutin', desc: 'Kumpulan frasa & kosakata harian kontekstual.' },
    { title: 'Placement Test & Diagnostic Level Assessment', desc: 'Tes diagnostik gratis untuk memetakan level awal.' },
    { title: 'Daily Speaking Practice & Interactive Drills', desc: 'Latihan bicara harian dengan AI Coach & feedback instant.' },
    { title: 'Small Class Size (Personal & Focused Mentoring)', desc: 'Jumlah peserta terbatas agar setiap siswa fokus praktek.' },
    { title: 'Group Discussion & WhatsApp Community Partner', desc: 'Komunitas grup WA aktif untuk latihan percakapan harian.' },
    { title: 'Akses LMS Interaktif 24/7 (Kuis & Practice Audio)', desc: 'Platform LMS lengkap dengan latihan soal & audio player.' },
    { title: 'Free Speaking Club & Weekly Live Webinar', desc: 'Akses webinar mingguan gratis pengembangan diri & karir.' },
    { title: 'Experienced Mentor Mentorship (Senior Tutor)', desc: 'Dibimbing mentor berpengalaman (Ms. Era, Ms. Deasy, Ms. Ade).' },
    { title: 'Flexible Schedule & Reschedule Request', desc: 'Bebas mengajukan atur ulang jadwal sesuai kesepakatan.' },
    { title: 'Career & Job Interview Preparation Guidance', desc: 'Pembekalan khusus menghadapi wawancara kerja & Beasiswa.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 pb-16 space-y-12">
      
      {/* 🌟 Header Halaman Pricing */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-lime text-dark text-xs font-black px-4 py-1.5 rounded-full uppercase border border-dark shadow-sm">
          <Sparkles className="w-4 h-4 text-dark animate-pulse" />
          <span>SKEMA PEMBIAYAAAN RESMI 2025 • MAHIR SPEAKING</span>
        </div>
        <h1 className="font-stinger text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
          Investasi Terjangkau untuk <span className="text-emerald-600 underline decoration-lime decoration-wavy">Kelancaran Bicara</span> Anda
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-bold">
          Pilih skema kelas yang sesuai dengan preferensi Anda: Reguler, Semi Private, atau Private VIP 1-on-1.
        </p>
      </div>

      {/* 📌 Cash Special & Installment Special Promo Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* PROMO 1: CASH DISKON 50% */}
        <div className="bg-gradient-to-br from-lime via-lime/90 to-emerald-400 p-6 rounded-3xl border-4 border-dark shadow-limeGlow space-y-4 relative overflow-hidden">
          <span className="bg-dark text-lime font-black text-[10px] uppercase px-3 py-1 rounded-full border border-dark inline-block">
            🎁 Diskon Cash Lunas
          </span>
          <h3 className="font-stinger font-black text-2xl text-dark">English Speaking Partner (Bayar Cash)</h3>
          <p className="text-xs text-dark/90 font-bold leading-relaxed">
            Dapatkan potongan harga spesial hemat 50% bagi yang memilih pembayaran lunas langsung di awal program!
          </p>
          <div className="space-y-1 pt-2 border-t border-dark/20">
            <span className="text-xs font-extrabold text-dark/70 line-through">Biaya Normal: Rp 1.500.000 / 3 Bulan</span>
            <div className="text-3xl font-stinger font-black text-dark">Rp 750.000 <span className="text-xs font-bold">(Nett Lunas)</span></div>
          </div>
          <a
            href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20mengambil%20Promo%20Diskon%20Cash%20Lunas%20Rp%20750.000."
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-2xl bg-dark text-lime font-black text-xs text-center block hover:bg-brand hover:text-white transition-all border-2 border-dark"
          >
            Klaim Diskon Cash Rp 750.000 ➔
          </a>
        </div>

        {/* PROMO 2: CICILAN 3X */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border-4 border-slate-700 shadow-2xl space-y-4 relative overflow-hidden">
          <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full border border-emerald-400 inline-block">
            💳 Skema Ringan Cicilan 3x
          </span>
          <h3 className="font-stinger font-black text-2xl text-white">English Speaking Partner (Cicilan 3x)</h3>
          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
            Bayar bertahap tanpa beban dengan metode angsuran 3x (Skema persentase: 70% DP awal, 15% Bulan ke-2, 15% Bulan ke-3).
          </p>
          <div className="space-y-1 pt-2 border-t border-slate-700 text-xs font-bold text-slate-300">
            <div>DP Angsuran 1 (70%): <strong className="text-emerald-400">Rp 1.050.000</strong></div>
            <div>Angsuran 2 (15%): <strong className="text-emerald-400">Rp 225.000</strong> | Angsuran 3 (15%): <strong className="text-emerald-400">Rp 225.000</strong></div>
          </div>
          <a
            href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20dengan%20Skema%20Cicilan%203x%20(DP%2070%25)."
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-2xl bg-lime text-dark font-black text-xs text-center block hover:bg-emerald-400 transition-all border-2 border-dark"
          >
            Pilih Skema Cicilan 3x ➔
          </a>
        </div>
      </div>

      {/* 🔘 TAB CATEGORY SELECTOR (Reguler | Semi Private | Private 1-on-1) */}
      <div className="space-y-8">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 bg-slate-100 p-2 rounded-3xl border border-slate-200 max-w-3xl mx-auto shadow-inner">
          <button
            onClick={() => setActiveCategory('reguler')}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'reguler'
                ? 'bg-brand text-lime shadow-md scale-105 border-2 border-dark'
                : 'text-slate-700 hover:bg-white hover:text-brand'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelas Reguler (4–8 Peserta)</span>
          </button>

          <button
            onClick={() => setActiveCategory('semi_private')}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'semi_private'
                ? 'bg-brand text-lime shadow-md scale-105 border-2 border-dark'
                : 'text-slate-700 hover:bg-white hover:text-brand'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Semi Private (2–3 Peserta)</span>
          </button>

          <button
            onClick={() => setActiveCategory('private')}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeCategory === 'private'
                ? 'bg-brand text-lime shadow-md scale-105 border-2 border-dark'
                : 'text-slate-700 hover:bg-white hover:text-brand'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Private VIP (1-on-1)</span>
          </button>
        </div>

        {/* 📦 CARDS DISPLAY UNTUK CATEGORY TERPILIH */}
        <div className="bg-white p-6 sm:p-10 rounded-4xl border-2 border-slate-200 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className={`inline-block text-[11px] font-black uppercase px-3 py-1 rounded-full border mb-2 ${pricingData[activeCategory].badgeColor}`}>
                {pricingData[activeCategory].badge}
              </span>
              <h2 className="font-stinger font-black text-2xl sm:text-3xl text-slate-900">
                {pricingData[activeCategory].title}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-2xl mt-1">
                {pricingData[activeCategory].description}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 px-4 rounded-2xl text-xs font-black text-slate-700 flex items-center gap-2 flex-shrink-0">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>{pricingData[activeCategory].participants}</span>
            </div>
          </div>

          {/* 3 Level Cards Grid (Basic, Intermediate, Advanced) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingData[activeCategory].levels.map((lvl, index) => (
              <div
                key={index}
                className={`rounded-3xl p-6 border-2 flex flex-col justify-between space-y-6 transition-all relative ${
                  lvl.popular
                    ? 'border-brand bg-gradient-to-b from-emerald-50/50 to-white shadow-xl ring-2 ring-brand/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {lvl.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-lime font-black text-[10px] uppercase px-3 py-1 rounded-full border border-dark shadow-sm">
                    ⭐ Pilihan Paling Populer
                  </span>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-stinger font-black text-xl text-slate-900">{lvl.name}</h3>
                    <div className="inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                      {lvl.pertemuan}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="font-stinger text-3xl font-black text-brand">{lvl.price}</div>
                    <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
                      {lvl.desc}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/6285861171129?text=${encodeURIComponent(`Halo Mahir Speaking! Saya berminat untuk daftar ${pricingData[activeCategory].title} - ${lvl.name} (${lvl.price}).`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-3.5 rounded-2xl font-black text-xs text-center block cursor-pointer transition-all border-2 ${
                    lvl.popular
                      ? 'bg-brand text-lime hover:bg-dark hover:text-lime border-dark shadow-md'
                      : 'bg-slate-900 text-white hover:bg-brand hover:text-lime border-slate-900'
                  }`}
                >
                  Pilih Paket {lvl.name} ➔
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📊 TABEL PERBANDINGAN SKEMA HARGA LENGKAP (TOR SUMMARY TABLE) */}
      <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-4xl border-4 border-slate-800 shadow-2xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black text-lime uppercase tracking-widest">✦ RINGKASAN TOR SKEMA BIAYA</span>
          <h2 className="font-stinger text-2xl sm:text-4xl font-black">Tabel Perbandingan Harga Resmi</h2>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold">
            Semua paket mencakup total 90 menit per sesi tatap muka interaktif bersama mentor.
          </p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b-2 border-slate-700 bg-slate-800/80 text-lime font-black">
                <th className="p-4 rounded-tl-2xl">Kategori Kelas</th>
                <th className="p-4">Level Basic (8x Pertemuan)</th>
                <th className="p-4">Level Intermediate (10x Pertemuan)</th>
                <th className="p-4 rounded-tr-2xl">Level Advanced (12x Pertemuan)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-semibold">
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Kelas Reguler (4–8 peserta)
                </td>
                <td className="p-4 text-emerald-400 font-bold">Rp 350.000</td>
                <td className="p-4 text-emerald-400 font-bold">Rp 500.000</td>
                <td className="p-4 text-emerald-400 font-bold">Rp 750.000</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  Kelas Semi Private (2–3 peserta)
                </td>
                <td className="p-4 text-amber-300 font-bold">Rp 650.000</td>
                <td className="p-4 text-amber-300 font-bold">Rp 850.000</td>
                <td className="p-4 text-amber-300 font-bold">Rp 1.200.000</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-black text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-400" />
                  Kelas Private (1-on-1 VIP)
                </td>
                <td className="p-4 text-purple-300 font-bold">Rp 1.200.000</td>
                <td className="p-4 text-purple-300 font-bold">Rp 1.500.000</td>
                <td className="p-4 text-purple-300 font-bold">Rp 2.000.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ DAFTAR CHECK-LIST 15 FASILITAS (BENEFITS CHECKLIST) */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-dark text-white p-6 sm:p-12 rounded-4xl border-4 border-lime shadow-2xl space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-lime text-dark text-xs font-black px-4 py-1.5 rounded-full uppercase border border-dark shadow-sm">
            <Award className="w-4 h-4 text-dark" />
            <span>15 FASILITAS LENGKAP SISWA</span>
          </div>
          <h2 className="font-stinger text-3xl sm:text-5xl font-black text-white leading-tight">
            Semua Yang Anda Dapatkan di <span className="text-lime">Mahir Speaking</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-base font-semibold">
            Nikmati 15 fasilitas terlengkap tanpa biaya tersembunyi untuk mendukung percepatan kelancaran bicaramu.
          </p>
        </div>

        {/* 15 Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {facilitiesList.map((item, index) => (
            <div key={index} className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex items-start gap-3 hover:border-lime/60 transition-colors">
              <div className="w-7 h-7 rounded-full bg-lime/20 text-lime flex items-center justify-center flex-shrink-0 mt-0.5 border border-lime/30">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout CTA */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-stinger font-black text-xl text-white">Masih Bingung Memilih Level & Paket?</h3>
            <p className="text-xs text-slate-300 font-semibold">Konsultasikan kebutuhan belajarmu secara gratis bersama Tim Mahir Speaking.</p>
          </div>
          <a
            href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20ingin%20konsultasi%20pemilihan%20paket%20dan%20level."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-lime text-dark font-black text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all border-2 border-dark flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi WA Gratis</span>
          </a>
        </div>
      </div>

    </div>
  );
}
