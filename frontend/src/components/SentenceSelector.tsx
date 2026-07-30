import React, { useState, useMemo } from 'react';
import { PracticeItem, LevelType } from '../types/voice';
import { ChevronLeft, ChevronRight, Volume2, Square, Play } from 'lucide-react';

export const INITIAL_PRACTICE_DATA: PracticeItem[] = [
  {
    level: "A1",
    title: "Introduce Yourself",
    instruction: "Dengarkan lalu ulangi kalimat berikut.",
    referenceText: "Hello, my name is Dhalfa and I am learning English.",
    translation: "Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris."
  },
  {
    level: "A1",
    title: "Daily Routine",
    instruction: "Dengarkan lalu ulangi dengan jelas.",
    referenceText: "I usually study English in the evening.",
    translation: "Saya biasanya belajar bahasa Inggris pada malam hari."
  },
  {
    level: "A2",
    title: "Speaking Goal",
    instruction: "Ucapkan kalimat berikut dengan percaya diri.",
    referenceText: "My goal is to speak English confidently.",
    translation: "Tujuan saya adalah berbicara bahasa Inggris dengan percaya diri."
  },
  {
    level: "A2",
    title: "Weekend Story",
    instruction: "Jawab pertanyaan berikut dalam bahasa Inggris.",
    referenceText: "Tell me about your weekend.",
    translation: "Ceritakan tentang akhir pekanmu."
  }
];

interface SentenceSelectorProps {
  selectedSentence: PracticeItem;
  onSelectSentence: (item: PracticeItem) => void;
  isPlayingSample: boolean;
  onPlaySample: () => void;
  onStopSample: () => void;
  onStartPracticeStep: () => void;
}

export const SentenceSelector: React.FC<SentenceSelectorProps> = ({
  selectedSentence,
  onSelectSentence,
  isPlayingSample,
  onPlaySample,
  onStopSample,
  onStartPracticeStep
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');

  const filteredSentences = useMemo(() => {
    if (selectedLevelFilter === 'ALL') return INITIAL_PRACTICE_DATA;
    return INITIAL_PRACTICE_DATA.filter((item) => item.level === selectedLevelFilter);
  }, [selectedLevelFilter]);

  const currentIndex = useMemo(() => {
    const idx = filteredSentences.findIndex((item) => item.title === selectedSentence.title);
    return idx >= 0 ? idx : 0;
  }, [filteredSentences, selectedSentence]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectSentence(filteredSentences[currentIndex - 1]);
    } else {
      onSelectSentence(filteredSentences[filteredSentences.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredSentences.length - 1) {
      onSelectSentence(filteredSentences[currentIndex + 1]);
    } else {
      onSelectSentence(filteredSentences[0]);
    }
  };

  const getLevelBadgeColor = (level: LevelType) => {
    switch (level) {
      case 'A1':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'A2':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'B1':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'B2':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'C1':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3.5">
      {/* Level filter & navigation controls */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <label htmlFor="level-select" className="text-xs text-[#64748B] font-medium">
            Filter Level:
          </label>
          <select
            id="level-select"
            value={selectedLevelFilter}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedLevelFilter(val);
              const firstMatch = val === 'ALL'
                ? INITIAL_PRACTICE_DATA[0]
                : INITIAL_PRACTICE_DATA.find((i) => i.level === val) || INITIAL_PRACTICE_DATA[0];
              onSelectSentence(firstMatch);
            }}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#0F172A] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0F9F95] cursor-pointer"
            aria-label="Pilih Level Latihan"
          >
            <option value="ALL">Semua Level</option>
            <option value="A1">A1 (Pemula)</option>
            <option value="A2">A2 (Dasar)</option>
            <option value="B1">B1 (Menengah)</option>
            <option value="B2">B2 (Menengah Atas)</option>
            <option value="C1">C1 (Mahir)</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-[#0F172A] transition-colors focus:ring-2 focus:ring-[#0F9F95] focus:outline-hidden cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Latihan sebelumnya"
            title="Latihan sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#64748B] font-semibold min-w-[32px] text-center">
            {currentIndex + 1} / {filteredSentences.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-[#0F172A] transition-colors focus:ring-2 focus:ring-[#0F9F95] focus:outline-hidden cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Latihan berikutnya"
            title="Latihan berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Exercise Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getLevelBadgeColor(selectedSentence.level)}`}>
            Level {selectedSentence.level}
          </span>
          <h3 className="text-sm font-bold text-[#0F172A]">{selectedSentence.title}</h3>
        </div>
        <p className="text-xs text-[#64748B]">{selectedSentence.instruction}</p>
      </div>

      {/* Target English sentence */}
      <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-[#E2E8F0] space-y-1.5">
        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
          Kalimat Target
        </div>
        <p className="text-base font-bold text-[#071B34] leading-relaxed select-text">
          "{selectedSentence.referenceText}"
        </p>
        <p className="text-xs text-[#64748B]">
          Arti: {selectedSentence.translation}
        </p>
      </div>

      {/* Listen Sample button */}
      <div>
        {isPlayingSample ? (
          <button
            onClick={onStopSample}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer min-h-[44px]"
          >
            <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>Memutar contoh... (Klik untuk Berhenti)</span>
          </button>
        ) : (
          <button
            onClick={onPlaySample}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs focus:ring-2 focus:ring-[#0F9F95] focus:outline-hidden cursor-pointer min-h-[44px]"
          >
            <Volume2 className="w-4 h-4 text-[#0F9F95]" />
            <span>Dengarkan Contoh</span>
          </button>
        )}
      </div>

      {/* Primary Button "Mulai Latihan" */}
      <button
        onClick={onStartPracticeStep}
        className="w-full py-3 px-4 rounded-xl bg-[#0F9F95] hover:bg-[#0b827a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer min-h-[44px]"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Mulai Latihan</span>
      </button>
    </div>
  );
};
