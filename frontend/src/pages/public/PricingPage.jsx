import React, { useState } from 'react';
import { CheckCircle, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PricingPage() {
  const { setActiveTab, user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 pb-10 sm:py-14 space-y-8 sm:space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-lime text-dark text-xs font-black px-4 py-1 rounded-full uppercase border border-dark shadow-sm">
          <Sparkles className="w-4 h-4 text-dark" />
          <span>ENGLISH SPEAKING PARTNER • OPEN FOR 2025</span>
        </div>
        <h1 className="font-stinger text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
          Investasi Kelancaran Bahasa Inggris Kamu
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-semibold">
          Pilihan 4 paket pembelajaran komprehensif bersama instruktur berpengalaman, modul terintegrasi, dan sesi 1-on-1.
        </p>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: PAKET KURSUS GROUP */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-slate-200 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all bg-white">
          <div className="space-y-4">
            <span className="bg-slate-200 text-slate-800 text-[11px] font-black px-3 py-1 rounded-full uppercase">
              Paket Kursus
            </span>
            <h3 className="font-stinger font-black text-xl text-slate-900">Group Speaking Kursus</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Program belajar kelompok interaktif dibimbing instruktur untuk membangun keberanian bicara.
            </p>
            
            <div className="pt-2 border-t border-slate-200">
              <div className="font-stinger text-2xl font-black text-slate-900">
                Konsultasi Spesial
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Tersedia Skema Hemat Berkelompok
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-bold">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Integrated Modul Pembelajaran</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Daily Learning & Interactive Drill</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Community Practice & Leaderboard</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Akses Seluruh Kuis LMS Interaktif</li>
            </ul>
          </div>

          <a
            href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20untuk%20informasi%20pendaftaran%20dan%20konsultasi%20program%20Group%20Speaking%20Kursus."
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-2xl font-black bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white transition-all text-xs border border-slate-300 text-center block cursor-pointer"
          >
            Tanya Paket Kursus
          </a>
        </div>

        {/* CARD 2: ENGLISH SPEAKING PARTNER (BAYAR TUNAI / CASH DISKON SPECIAL) */}
        <div className="glass-panel p-6 rounded-3xl border-4 border-dark flex flex-col justify-between space-y-6 bg-lime shadow-limeGlow relative overflow-hidden transform lg:-translate-y-2">
          <span className="absolute top-0 right-0 bg-dark text-lime font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl border-b border-l border-dark">
            DISKON SPECIAL
          </span>

          <div className="space-y-4">
            <span className="bg-dark text-lime text-[11px] font-black px-3 py-1 rounded-full uppercase">
              Bayar Tunai / Cash
            </span>
            <h3 className="font-stinger font-black text-xl text-dark">English Speaking Partner (Cash)</h3>
            <p className="text-xs text-dark/90 font-bold leading-relaxed">
              Hemat 50% bayar lunas langsung. Pembimbing tutor, modul terintegrasi, & native.
            </p>

            <div className="pt-2 border-t border-dark/20 space-y-0.5">
              <div className="text-xs text-dark/70 font-extrabold line-through">Biaya Normal: Rp 1.500.000 / 3 Bulan</div>
              <div className="font-stinger text-3xl font-black text-dark">
                Rp 750.000
              </div>
              <div className="text-[10px] font-black text-dark bg-white/80 px-2 py-0.5 rounded inline-block">
                Potongan Harga Jadi Rp 750.000 (Bayar Langsung)
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-dark pt-4 border-t border-dark/20 font-bold">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-dark flex-shrink-0" /> Experienced Tutor Mentorship</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-dark flex-shrink-0" /> Integrated Modul Lengkap</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-dark flex-shrink-0" /> One on One Speaking Practice</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-dark flex-shrink-0" /> Daily Learning & Practical Drill</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-dark flex-shrink-0" /> Native Speaker Meeting Session</li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab(user ? 'my-package' : 'auth')}
            className="w-full py-3.5 rounded-2xl font-black bg-dark text-lime hover:bg-brand hover:text-white transition-all text-xs shadow-md border-2 border-dark cursor-pointer"
          >
            Daftar Cash (Rp 750.000)
          </button>
        </div>

        {/* CARD 3: ENGLISH SPEAKING PARTNER (SKEMA CICILAN 3X) */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-brand flex flex-col justify-between space-y-6 bg-white shadow-xl">
          <div className="space-y-4">
            <span className="bg-brand text-lime text-[11px] font-black px-3 py-1 rounded-full uppercase">
              Skema Cicilan 3x
            </span>
            <h3 className="font-stinger font-black text-xl text-brand">English Speaking Partner (Cicilan)</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Pembayaran diangsur 3 kali dengan skema persentase 70%, 15%, dan 15%.
            </p>

            <div className="pt-2 border-t border-slate-200 space-y-0.5">
              <div className="text-xs text-slate-400 font-bold">Total Biaya Program: Rp 1.500.000</div>
              <div className="font-stinger text-2xl font-black text-brand">
                70% • 15% • 15%
              </div>
              <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                DP Cicilan 1: Rp 1.050.000 (70%)
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-bold">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Angsuran 1 (70%): Rp 1.050.000</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Angsuran 2 (15%): Rp 225.000</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Angsuran 3 (15%): Rp 225.000</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Mentorship Tutor & Modul Lengkap</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Native Speaker Meeting Session</li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab(user ? 'my-package' : 'auth')}
            className="w-full py-3.5 rounded-2xl font-black bg-brand text-lime hover:scale-[1.02] transition-all text-xs border border-dark cursor-pointer shadow-md"
          >
            Daftar Skema Cicilan 3x
          </button>
        </div>

        {/* CARD 4: PAKET PRIVATE 1-ON-1 VIP */}
        <div className="glass-panel p-6 rounded-3xl border-2 border-slate-200 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all bg-white">
          <div className="space-y-4">
            <span className="bg-purple-100 text-purple-900 text-[11px] font-black px-3 py-1 rounded-full uppercase">
              Paket Private VIP
            </span>
            <h3 className="font-stinger font-black text-xl text-slate-900">Private 1-on-1 Intensive</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Bimbingan 1-on-1 privat intensif jadwal menyesuaikan (Ms. Era, Ms. Deasy, Ms. Ade).
            </p>

            <div className="pt-2 border-t border-slate-200">
              <div className="font-stinger text-2xl font-black text-purple-950">
                Konsultasi Intensif
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Pendampingan Khusus Instruktur Senior
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-200 font-bold">
              <li className="flex items-center gap-2 text-purple-950"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Full Private 1-on-1 Mentorship</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Bebas Atur Jadwal Belajar</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Native Speaker Meeting Prives</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" /> Evaluasi & Diagnostic Test Gratis</li>
            </ul>
          </div>

          <a
            href="https://wa.me/6285861171129?text=Halo%20Mahir%20Speaking!%20Saya%20berminat%20untuk%20informasi%20pendaftaran%20dan%20konsultasi%20program%20Private%201-on-1%20VIP."
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-2xl font-black bg-slate-900 text-white hover:bg-purple-950 transition-all text-xs text-center block cursor-pointer"
          >
            Tanya Paket Private VIP
          </a>
        </div>

      </div>

    </div>
  );
}
