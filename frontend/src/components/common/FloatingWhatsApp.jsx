import React from 'react';
import { MessageCircle } from 'lucide-react';

// Komponen FloatingWhatsApp: Menampilkan tombol melayang interaktif di pojok bawah halaman untuk memudahkan pengguna menghubungi WhatsApp konsultasi Mahir Speaking.
export default function FloatingWhatsApp() {
  // Nomor telepon admin konsultasi Mahir Speaking dalam format kode negara (62).
  const phoneNumber = '6281572120190';
  
  // Pesan bawaan yang otomatis terisi saat pengguna dialihkan ke aplikasi WhatsApp.
  const defaultMessage = encodeURIComponent('Halo Mahir Speaking! Saya berminat untuk informasi pendaftaran dan konsultasi program English Speaking.');
  
  // Tautan URL dinamis WhatsApp API untuk mengarahkan pengguna ke ruang percakapan.
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
      {/* Label Petunjuk Hubungi WA (Tooltip) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full border border-slate-700 shadow-xl hover:bg-slate-800 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>tanya konsultasi WA (0815-7212-0190)</span>
      </a>

      {/* Tombol Bulat Melayang dengan Animasi Ping */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact WhatsApp 085156916211"
        className="relative p-3.5 bg-emerald-500 text-white rounded-full shadow-[0_8px_25px_rgba(16,185,129,0.45)] hover:scale-110 hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center border-2 border-white group"
      >
        <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping pointer-events-none"></span>
        <MessageCircle className="w-6 h-6 fill-white stroke-none relative z-10" />
      </a>
    </div>
  );
}
