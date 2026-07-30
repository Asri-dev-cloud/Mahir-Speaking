import React, { useState, useEffect } from 'react';
import { Mic, Volume2, AlertCircle, Check, ArrowLeft, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  referenceText: string;
  translation: string;
  isListening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  durationSeconds: number;
  onStartListening: () => void;
  onStopListening: () => void;
  onPlaySampleAgain: () => void;
  isPlayingSample: boolean;
  onBackToStep1: () => void;
  isAnalyzing?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  referenceText,
  translation,
  isListening,
  interimTranscript,
  finalTranscript,
  error,
  durationSeconds,
  onStartListening,
  onStopListening,
  onPlaySampleAgain,
  isPlayingSample,
  onBackToStep1,
  isAnalyzing = false
}) => {
  const [micState, setMicState] = useState<'ready' | 'listening' | 'finished'>('ready');

  useEffect(() => {
    if (isListening) {
      setMicState('listening');
    } else if (finalTranscript) {
      setMicState('finished');
      const timer = setTimeout(() => {
        setMicState('ready');
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setMicState('ready');
    }
  }, [isListening, finalTranscript]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-4">
      {/* Compact Target Sentence Header */}
      <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
            Kalimat Target
          </span>
          <button
            onClick={onPlaySampleAgain}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#0F9F95] hover:underline cursor-pointer"
          >
            {isPlayingSample ? (
              <Square className="w-3 h-3 fill-current animate-pulse text-amber-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
            <span>{isPlayingSample ? 'Berhenti' : 'Dengarkan Contoh Lagi'}</span>
          </button>
        </div>

        <p className="text-sm font-bold text-[#071B34] leading-snug">
          "{referenceText}"
        </p>
        <p className="text-[11px] text-[#64748B]">
          {translation}
        </p>
      </div>

      {/* Analyzing Banner */}
      {isAnalyzing && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-150">
          <Loader2 className="w-4 h-4 animate-spin text-[#0F9F95]" />
          <span>Menganalisis ucapan...</span>
        </div>
      )}

      {/* Central 76px Mic Button */}
      <div className="flex flex-col items-center justify-center space-y-3 py-1">
        <div className="relative flex items-center justify-center">
          {/* 3 Pulse Rings when Listening */}
          {micState === 'listening' && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping pointer-events-none scale-150" />
              <span className="absolute inset-0 rounded-full bg-red-500/30 animate-pulse pointer-events-none scale-125" />
              <span className="absolute inset-0 rounded-full bg-red-400/40 pointer-events-none" />
            </>
          )}

          <button
            onClick={isListening ? onStopListening : onStartListening}
            aria-label={isListening ? 'Hentikan rekaman' : 'Mulai bicara'}
            className={`relative z-10 w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-offset-2 ${
              micState === 'listening'
                ? 'bg-[#EF4444] text-white shadow-lg shadow-red-500/30 focus:ring-red-400'
                : micState === 'finished'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 focus:ring-emerald-400'
                : 'bg-[#071B34] hover:bg-[#0F9F95] text-white shadow-md hover:shadow-lg focus:ring-[#0F9F95]'
            }`}
          >
            {micState === 'listening' ? (
              <Mic className="w-8 h-8 animate-bounce" />
            ) : micState === 'finished' ? (
              <Check className="w-8 h-8 animate-in zoom-in-75 duration-200" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Live Status Description via aria-live */}
        <div className="text-center space-y-1">
          <div
            aria-live="polite"
            className="text-xs font-bold text-[#0F172A]"
          >
            {isListening ? (
              <span className="text-[#EF4444] flex items-center justify-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                Sedang mendengarkan...
              </span>
            ) : (
              'Tekan Mikrofon lalu Ucapkan'
            )}
          </div>

          <p className="text-[11px] text-[#64748B]">
            {isListening
              ? 'Tekan tombol mikrofon lagi setelah selesai berbicara'
              : 'Pastikan mikrofon browser diizinkan'}
          </p>

          {/* Audio Visualizer Bars (ONLY when listening) */}
          {isListening && (
            <div className="flex items-center justify-center gap-1 pt-1 h-4">
              <span className="w-1 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-3.5 bg-red-500 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-2.5 bg-red-500 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:100ms]" />
              <span className="w-1 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:200ms]" />
            </div>
          )}

          {/* Timer Display ONLY when duration > 0 */}
          {durationSeconds > 0 && (
            <p className="text-[11px] text-[#64748B] font-mono pt-0.5">
              Durasi: {durationSeconds.toFixed(1)}s
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="leading-tight">{error}</div>
        </div>
      )}

      {/* Interim / Final Transcript Box directly below Mic */}
      <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#E2E8F0] space-y-1">
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
          Hasil Suara Anda
        </span>
        <div className="min-h-[36px] text-xs text-[#0F172A] flex items-center">
          {isListening && interimTranscript && (
            <p className="text-slate-400 italic">
              {interimTranscript}
            </p>
          )}

          {finalTranscript ? (
            <p className="font-semibold text-[#0F172A] select-text">
              "{finalTranscript}"
            </p>
          ) : !isListening && !interimTranscript ? (
            <p className="text-slate-400 italic text-center w-full py-0.5">
              (Belum ada ucapan terekam)
            </p>
          ) : null}
        </div>
      </div>

      {/* Back Button to Step 1 */}
      <div className="pt-1">
        <button
          onClick={onBackToStep1}
          className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali Pilih Latihan</span>
        </button>
      </div>
    </div>
  );
};
