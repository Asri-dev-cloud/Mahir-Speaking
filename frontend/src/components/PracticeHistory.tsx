// Komponen PracticeHistory: Menampilkan daftar riwayat latihan berbicara yang pernah dikerjakan oleh pengguna, beserta rincian skor pengucapannya.
import React, { useState } from 'react';
import { HistoryItem } from '../types/voice';
import { ArrowLeft, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface PracticeHistoryProps {
  history: HistoryItem[];
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onBackToPractice: () => void;
}

export const PracticeHistory: React.FC<PracticeHistoryProps> = ({
  history,
  onDeleteHistoryItem,
  onClearHistory,
  onBackToPractice
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Header bar with Back Button */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <button
          onClick={onBackToPractice}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] hover:text-[#0F9F95] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Latihan</span>
        </button>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[11px] text-red-600 hover:text-red-700 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            title="Hapus semua riwayat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {/* History List or Empty State */}
      {!history || history.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] text-center space-y-2 my-4">
          <p className="text-sm font-bold text-[#0F172A]">Belum Ada Riwayat Latihan</p>
          <p className="text-xs text-[#64748B]">
            Selesaikan ucapan di menu utama lalu tekan "Simpan Hasil" untuk mencatat riwayat di sini.
          </p>
          <button
            onClick={onBackToPractice}
            className="mt-2 px-4 py-2 bg-[#0F9F95] text-white rounded-xl text-xs font-bold hover:bg-[#0b827a] transition-all cursor-pointer"
          >
            Mulai Latihan
          </button>
        </div>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
          {history.map((item) => {
            const isExpanded = expandedId === item.id;
            const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 border border-[#E2E8F0] space-y-2 transition-all hover:border-slate-300 shadow-2xs"
              >
                {/* Summary Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-[#0F172A] border border-slate-200">
                        {item.level}
                      </span>
                      <span className="text-xs font-bold text-[#0F172A]">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className="text-base font-black text-[#0F9F95]">
                        {item.overallScore}
                      </span>
                      <span className="text-[10px] text-[#64748B]">/100</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                      aria-label={`Hapus riwayat ${item.title}`}
                      title="Hapus riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-[#0F172A] animate-in fade-in duration-150">
                    <div>
                      <span className="font-bold text-[#64748B] text-[10px] uppercase block">Ucapan Terekam:</span>
                      <p className="italic text-[#0F172A] bg-slate-50 p-2 rounded-lg border border-slate-100 mt-0.5">
                        "{item.recognizedText}"
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[#64748B] text-[10px] block">Kejelasan</span>
                        <span className="font-bold text-[#0F9F95]">{item.pronunciationScore}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[#64748B] text-[10px] block">Kelengkapan</span>
                        <span className="font-bold text-[#2563EB]">{item.completenessScore}%</span>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[#64748B] text-[10px] block">Kelancaran</span>
                        <span className="font-bold text-amber-600">{item.fluencyScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
