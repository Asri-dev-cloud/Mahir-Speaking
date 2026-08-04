import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const phoneNumber = '6281572120190';
  const defaultMessage = encodeURIComponent('Halo Mahir Speaking! Saya berminat untuk informasi pendaftaran dan konsultasi program English Speaking.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
      {/* Tooltip Label */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full border border-slate-700 shadow-xl hover:bg-slate-800 transition-all group"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>tanya konsultasi WA (0815-7212-0190)</span>
      </a>

      {/* Floating Button */}
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
