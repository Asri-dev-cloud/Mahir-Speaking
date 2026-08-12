import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

// Komponen WelcomeModal: Menampilkan modal selamat datang pop-up interaktif selama 5 detik setelah pengguna berhasil login.
export default function WelcomeModal() {
  const { showWelcomeModal, welcomeUserName, closeWelcomeModal } = useAuth();
  const timerRef = useRef(null);

  useEffect(() => {
    if (showWelcomeModal) {
      timerRef.current = setTimeout(() => {
        closeWelcomeModal();
      }, 5000);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [showWelcomeModal, closeWelcomeModal]);

  if (!showWelcomeModal) return null;

  // Mengeliminasi gelar admin di dalam kurung dari nama lengkap pengguna.
  const cleanName = welcomeUserName ? welcomeUserName.replace(/\s*\([^)]*\)/g, '').trim() : 'Mahirians';

  return (
    <div 
      onClick={closeWelcomeModal}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900/95 text-white rounded-3xl p-6 sm:p-8 text-center max-w-sm w-full border border-slate-700/80 shadow-2xl space-y-4 relative overflow-hidden"
      >
        {/* Indikator waktu sisa tampilan modal (5 detik) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div className="bg-lime h-full animate-progress-5s" />
        </div>

        {/* Tangan melambai animasi */}
        <div className="flex justify-center pt-4 pb-2">
          <span className="animate-wave-hand inline-block origin-bottom-right text-8xl sm:text-9xl select-none drop-shadow-xl">
            👋
          </span>
        </div>

        {/* Pesan penyambutan */}
        <div className="space-y-1">
          <h2 className="font-stinger font-extrabold text-xl sm:text-2xl text-white">
            Halo, {cleanName}! 👋
          </h2>
          <p className="text-slate-300 font-bold text-sm">
            Selamat datang, Mahirians! ✨
          </p>
        </div>

        {/* Panduan untuk menutup modal */}
        <div className="pt-1 text-[11px] text-slate-400 font-medium">
          Klik di mana saja untuk menutup
        </div>
      </div>
    </div>
  );
}
