// Komponen WordComparison: Membandingkan transkrip kata demi kata yang diucapkan siswa dengan teks referensi asli untuk menganalisis keakuratan pelafalan.
import React, { useState } from 'react';
import { WordResult } from '../types/voice';
import { Check, AlertCircle, Plus, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordComparisonProps {
  wordResults: WordResult[];
  defaultOpen?: boolean;
}

export const WordComparison: React.FC<WordComparisonProps> = ({
  wordResults,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showLegendPopover, setShowLegendPopover] = useState(false);

  if (!wordResults || wordResults.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden transition-all">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Perbandingan Kata
          </span>
          <span className="text-[10px] bg-teal-50 text-[#0F9F95] font-semibold px-2 py-0.5 rounded-full border border-teal-100">
            {wordResults.length} Kata
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowLegendPopover(!showLegendPopover);
            }}
            className="p-1 text-[#64748B] hover:text-[#0F9F95] rounded-md transition-colors cursor-pointer"
            aria-label="Informasi Arti Warna Kata"
            title="Penjelasan Warna Kata"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Popover Legend Explanation */}
      {showLegendPopover && (
        <div className="px-3 pb-2 text-xs space-y-1.5 text-[#0F172A] border-t border-slate-100 pt-2 bg-slate-50">
          <div className="font-bold text-[11px] text-[#0F172A]">Keterangan Warna Kata:</div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>Sesuai (Hijau ✓)</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-800">
              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
              <span>Beda (Merah ⚠)</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
              <span>Terlewat (Kuning)</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              <span>Tambahan (Biru +)</span>
            </div>
          </div>
        </div>
      )}

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 border-t border-slate-100 flex flex-wrap gap-1.5 mt-2">
              {wordResults.map((item, index) => {
                let colorStyle = '';
                let iconComponent = null;
                let badgeText = '';

                switch (item.status) {
                  case 'green':
                    colorStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
                    iconComponent = <Check className="w-3 h-3 text-emerald-600 shrink-0" />;
                    break;
                  case 'red':
                    colorStyle = 'bg-red-50 text-red-800 border-red-300 font-semibold';
                    iconComponent = <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />;
                    badgeText = item.expectedWord ? `(${item.expectedWord})` : '';
                    break;
                  case 'yellow':
                    colorStyle = 'bg-amber-50 text-amber-800 border-amber-300 line-through opacity-85';
                    badgeText = 'terlewat';
                    break;
                  case 'blue':
                    colorStyle = 'bg-blue-50 text-blue-800 border-blue-300 font-medium';
                    iconComponent = <Plus className="w-3 h-3 text-blue-600 shrink-0" />;
                    break;
                }

                return (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${colorStyle} transition-all`}
                    title={item.expectedWord ? `Harusnya: ${item.expectedWord}` : undefined}
                  >
                    {iconComponent}
                    <span>{item.word}</span>
                    {badgeText && item.status !== 'green' && (
                      <span className="text-[9px] opacity-80 font-normal ml-0.5">{badgeText}</span>
                    )}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
