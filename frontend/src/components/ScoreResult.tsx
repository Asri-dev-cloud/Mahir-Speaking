// Komponen ScoreResult: Menampilkan hasil detail penilaian skor pengucapan (pelafalan, kelancaran, kelengkapan) setelah melakukan latihan suara.
import React, { useState, useEffect } from 'react';
import { ScoringResult } from '../types/voice';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreResultProps {
  score: ScoringResult;
  userTranscript?: string;
}

export const ScoreResult: React.FC<ScoreResultProps> = ({ score, userTranscript }) => {
  const [displayOverall, setDisplayOverall] = useState(0);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

  // Count-up effect only run once per score
  useEffect(() => {
    let start = 0;
    const end = score.overallScore;
    if (end === 0) {
      setDisplayOverall(0);
      return;
    }

    const duration = 600; // ms
    const stepTime = Math.max(Math.floor(duration / end), 10);
    const timer = setInterval(() => {
      start += 1;
      setDisplayOverall(start);
      if (start >= end) {
        clearInterval(timer);
        setDisplayOverall(end);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score.overallScore]);

  // SVG Circle Calculations for 72px circle (r=28, stroke=6, circumference=175.9)
  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score.overallScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-[#E2E8F0] shadow-2xs space-y-3">
      {/* Compact Overall Score Header */}
      <div className="flex items-center gap-3.5 bg-[#071B34] text-white p-3 rounded-xl">
        {/* 72px Circular SVG Progress Ring */}
        <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center">
          <svg className="w-[72px] h-[72px] transform -rotate-90">
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#1E293B"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#0F9F95"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-white leading-none">
              {displayOverall}
            </span>
            <span className="text-[9px] text-gray-300 font-medium">/100</span>
          </div>
        </div>

        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
            Hasil Evaluasi
          </div>
          <p className="text-xs text-slate-100 font-semibold leading-snug line-clamp-2">
            {score.feedback}
          </p>
          <p className="text-[10px] text-slate-400">
            Durasi: {score.durationSeconds} detik
          </p>
        </div>
      </div>

      {/* 3 Thin Progress Bars Breakdown */}
      <div className="space-y-2 pt-0.5">
        {/* Kejelasan (Pronunciation) */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-xs font-semibold text-[#0F172A]">
            <span>Kejelasan</span>
            <span className="font-bold text-[#0F9F95]">{score.pronunciationScore}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.pronunciationScore}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="bg-[#0F9F95] h-full rounded-full"
            />
          </div>
        </div>

        {/* Kelengkapan (Completeness) */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-xs font-semibold text-[#0F172A]">
            <span>Kelengkapan</span>
            <span className="font-bold text-[#2563EB]">{score.completenessScore}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.completenessScore}%` }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="bg-[#2563EB] h-full rounded-full"
            />
          </div>
        </div>

        {/* Kelancaran (Fluency) + WPM */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-xs font-semibold text-[#0F172A]">
            <div className="flex items-center gap-1.5">
              <span>Kelancaran</span>
              <span className="text-[10px] font-normal text-[#64748B] bg-slate-100 px-1.5 py-0.2 rounded-md">
                {score.wordsPerMinute} WPM
              </span>
            </div>
            <span className="font-bold text-amber-600">{score.fluencyScore}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.fluencyScore}%` }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              className="bg-amber-500 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Expandable User Transcript row if provided */}
      {userTranscript && (
        <div className="border-t border-slate-100 pt-2 text-xs">
          <button
            type="button"
            onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
            className="flex items-center justify-between w-full text-left text-slate-600 hover:text-[#0F172A] font-medium"
          >
            <span className="text-[11px] font-bold text-[#64748B] uppercase">
              Ucapan Terekam
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#0F9F95]">
              <span className="truncate max-w-[160px] font-normal text-slate-500">
                "{userTranscript}"
              </span>
              {isTranscriptExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isTranscriptExpanded && (
            <p className="mt-1.5 p-2 bg-slate-50 rounded-lg text-xs text-[#0F172A] italic border border-slate-100 animate-in fade-in duration-150">
              "{userTranscript}"
            </p>
          )}
        </div>
      )}

      {/* One-Line Disclaimer */}
      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-1.5 text-[10px] text-[#64748B] leading-tight">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <p className="truncate">{score.disclaimer}</p>
      </div>
    </div>
  );
};
