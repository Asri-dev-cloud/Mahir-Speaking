import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SentenceSelector, INITIAL_PRACTICE_DATA } from './SentenceSelector';
import { VoiceRecorder } from './VoiceRecorder';
import { WordComparison } from './WordComparison';
import { ScoreResult } from './ScoreResult';
import { PracticeHistory } from './PracticeHistory';
import { MashiraAvatar, MashiraAvatarState } from './MashiraAvatar';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { calculateScores } from '../utils/speechScoring';
import { PracticeItem, HistoryItem, ScoringResult } from '../types/voice';
import { Minus, X, RefreshCw, ChevronRight, Save, CheckCircle, History, GripHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';

interface VoiceCoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
  floatingButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

const STORAGE_HISTORY_KEY = 'mahir_speaking_history';
const STORAGE_POS_KEY = 'mashira_panel_pos';

export const VoiceCoachPanel: React.FC<VoiceCoachPanelProps> = ({
  isOpen,
  onClose,
  floatingButtonRef
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'practice' | 'history'>('practice');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [selectedSentence, setSelectedSentence] = useState<PracticeItem>(INITIAL_PRACTICE_DATA[0]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const headingTitleRef = useRef<HTMLHeadingElement>(null);
  const dragControls = useDragControls();

  // Load Desktop Drag Position
  const [desktopPos, setDesktopPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POS_KEY);
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  });

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Speech Recognition & Speech Synthesis Hooks
  const {
    isListening,
    interimTranscript,
    finalTranscript,
    error,
    durationSeconds,
    startListening,
    stopListening,
    resetState
  } = useSpeechRecognition();

  const { isPlaying: isPlayingTTS, speak, stop: stopTTS } = useTextToSpeech();

  // Focus Title on Open
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setTimeout(() => {
        headingTitleRef.current?.focus();
      }, 50);
    } else {
      if (isListening) stopListening();
      stopTTS();
      floatingButtonRef?.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate Scores
  const calculatedScore: ScoringResult | null = useMemo(() => {
    if (!finalTranscript.trim() || isListening) {
      return null;
    }
    return calculateScores(selectedSentence.referenceText, finalTranscript, durationSeconds);
  }, [selectedSentence.referenceText, finalTranscript, isListening, durationSeconds]);

  // Auto transition from Step 2 to Step 3 when calculatedScore is ready
  useEffect(() => {
    if (step === 2 && !isListening && finalTranscript.trim() && calculatedScore) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        changeStep(3);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [step, isListening, finalTranscript, calculatedScore]);

  const changeStep = (newStep: 1 | 2 | 3) => {
    if (newStep === step) return;
    setSlideDirection(newStep > step ? 'next' : 'prev');
    setStep(newStep);
  };

  // Save history
  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history.filter((h) => h.id !== item.id)];
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  // Avatar state
  const avatarState: MashiraAvatarState = useMemo(() => {
    if (error) return 'error';
    if (isListening) return 'listening';
    if (isPlayingTTS) return 'speaking';
    if (calculatedScore && step === 3) return 'success';
    return 'idle';
  }, [error, isListening, isPlayingTTS, calculatedScore, step]);

  // Status text
  let statusText = 'Siap latihan';
  if (isListening) statusText = 'Sedang mendengarkan...';
  else if (isPlayingTTS) statusText = 'Memutar contoh...';
  else if (calculatedScore && step === 3) statusText = 'Hasil evaluasi siap';

  // Navigation actions
  const handleTryAgain = () => {
    resetState();
    changeStep(2);
  };

  const handleNextExercise = () => {
    const currentIdx = INITIAL_PRACTICE_DATA.findIndex((i) => i.title === selectedSentence.title);
    const nextIdx = currentIdx < INITIAL_PRACTICE_DATA.length - 1 ? currentIdx + 1 : 0;
    setSelectedSentence(INITIAL_PRACTICE_DATA[nextIdx]);
    resetState();
    changeStep(1);
  };

  const handleSaveResult = () => {
    if (!calculatedScore || !finalTranscript.trim() || isSaving) return;

    setIsSaving(true);
    setTimeout(() => {
      const historyRecord: HistoryItem = {
        id: Date.now().toString(),
        title: selectedSentence.title,
        level: selectedSentence.level,
        referenceText: selectedSentence.referenceText,
        recognizedText: finalTranscript.trim(),
        pronunciationScore: calculatedScore.pronunciationScore,
        completenessScore: calculatedScore.completenessScore,
        fluencyScore: calculatedScore.fluencyScore,
        overallScore: calculatedScore.overallScore,
        wordsPerMinute: calculatedScore.wordsPerMinute,
        durationSeconds: calculatedScore.durationSeconds,
        wordResults: calculatedScore.wordResults,
        scoringMethod: 'browser_transcript_estimate',
        isEstimated: true,
        createdAt: new Date().toISOString()
      };

      saveToHistory(historyRecord);
      setIsSaving(false);
      setToastMessage('Hasil latihan berhasil disimpan.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  // Drag End Handler
  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    const newPos = {
      x: desktopPos.x + info.offset.x,
      y: desktopPos.y + info.offset.y
    };
    setDesktopPos(newPos);
    try {
      localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(newPos));
    } catch {
      // ignore
    }
  };

  // Header Double Click Reset
  const handleHeaderDoubleClick = () => {
    const defaultPos = { x: 0, y: 0 };
    setDesktopPos(defaultPos);
    try {
      localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(defaultPos));
    } catch {
      // ignore
    }
  };

  // Slide Animation Variants for Stepper
  const slideVariants = {
    enter: (direction: 'next' | 'prev') => ({
      x: direction === 'next' ? 40 : -40,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'next' | 'prev') => ({
      x: direction === 'next' ? -40 : 40,
      opacity: 0
    })
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-label="Mashira Voice Coach"
        aria-modal="true"
        className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-auto justify-center sm:justify-end"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: isMinimized ? 0.9 : 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          drag={window.innerWidth >= 640} // Desktop drag
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragConstraints={{ left: -window.innerWidth + 460, right: 20, top: -window.innerHeight + 500, bottom: 20 }}
          onDragEnd={handleDragEnd}
          style={{ x: desktopPos.x, y: desktopPos.y }}
          className={`pointer-events-auto bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col w-full sm:w-[440px] ${
            isMinimized
              ? 'rounded-2xl h-[64px] sm:mr-5 sm:mb-5'
              : 'rounded-t-[24px] sm:rounded-[24px] h-[92dvh] sm:h-[680px] sm:max-h-[calc(100dvh-32px)] sm:mr-5 sm:mb-5 pb-[env(safe-area-inset-bottom)]'
          }`}
        >
          {/* Mobile Handle Bar */}
          <div className="sm:hidden w-full bg-[#071B34] pt-2 flex justify-center shrink-0">
            <span className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Sticky Header */}
          <div
            onPointerDown={(e) => {
              if (window.innerWidth >= 640) {
                dragControls.start(e);
              }
            }}
            onDoubleClick={handleHeaderDoubleClick}
            className="bg-[#071B34] text-white px-4 py-2.5 flex items-center justify-between shrink-0 h-[64px] select-none cursor-grab active:cursor-grabbing border-b border-white/10"
          >
            <div className="flex items-center gap-3 min-w-0">
              <MashiraAvatar state={avatarState} size="md" />

              <div className="min-w-0">
                <h2
                  ref={headingTitleRef}
                  tabIndex={-1}
                  className="text-sm font-bold text-white tracking-tight leading-none focus:outline-hidden truncate"
                >
                  Mashira Voice Coach
                </h2>
                <p className="text-[11px] text-slate-300 font-medium mt-1 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F9F95] shrink-0" />
                  <span className="truncate">{statusText}</span>
                </p>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* History Button in Header */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView(currentView === 'history' ? 'practice' : 'history');
                }}
                className={`p-1.5 rounded-lg transition-colors focus:ring-2 focus:ring-white/30 focus:outline-hidden cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center relative ${
                  currentView === 'history'
                    ? 'bg-[#0F9F95] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Riwayat Latihan"
                title="Riwayat Latihan"
              >
                <History className="w-4 h-4" />
                {history.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#071B34]" />
                )}
              </button>

              {/* Drag Handle Icon */}
              <span className="hidden sm:inline-flex text-slate-500 mx-0.5" aria-label="Geser panel Voice Coach">
                <GripHorizontal className="w-4 h-4 opacity-50" />
              </span>

              {/* Minimize Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:ring-2 focus:ring-white/30 focus:outline-hidden cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label={isMinimized ? 'Perbesar panel Voice Coach' : 'Kecilkan panel Voice Coach'}
                title={isMinimized ? 'Perbesar' : 'Kecilkan'}
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:ring-2 focus:ring-white/30 focus:outline-hidden cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Tutup panel Voice Coach"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimized View Bar */}
          {isMinimized ? (
            <div className="p-2 bg-white flex items-center justify-between px-4">
              <p className="text-xs font-semibold text-[#0F172A] truncate">
                {selectedSentence.title} ({selectedSentence.level})
              </p>
              <button
                onClick={() => setIsMinimized(false)}
                className="px-3 py-1 bg-[#0F9F95] text-white rounded-lg text-xs font-bold hover:bg-[#0b827a] cursor-pointer"
              >
                Buka
              </button>
            </div>
          ) : currentView === 'history' ? (
            /* History View */
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <PracticeHistory
                history={history}
                onDeleteHistoryItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
                onBackToPractice={() => setCurrentView('practice')}
              />
            </div>
          ) : (
            /* Step-Based Practice Flow */
            <>
              {/* Sticky Stepper directly below Header */}
              <div className="bg-white border-b border-[#E2E8F0] px-4 py-2.5 shrink-0 select-none">
                <div className="flex items-center justify-between max-w-sm mx-auto">
                  {/* Step 1: Pilih */}
                  <button
                    type="button"
                    onClick={() => changeStep(1)}
                    className="flex items-center gap-1.5 cursor-pointer focus:outline-hidden group"
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === 1
                          ? 'bg-[#0F9F95] text-white ring-2 ring-[#0F9F95]/30'
                          : step > 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                    </span>
                    <span
                      className={`text-xs font-bold transition-colors ${
                        step === 1 ? 'text-[#0F9F95]' : 'text-[#0F172A]'
                      }`}
                    >
                      Pilih
                    </span>
                  </button>

                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${step >= 2 ? 'bg-[#0F9F95]' : 'bg-slate-200'}`} />

                  {/* Step 2: Bicara */}
                  <button
                    type="button"
                    onClick={() => {
                      if (step >= 2 || finalTranscript || isListening) {
                        changeStep(2);
                      }
                    }}
                    disabled={step < 2 && !finalTranscript && !isListening}
                    className={`flex items-center gap-1.5 focus:outline-hidden ${
                      step >= 2 || finalTranscript ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === 2
                          ? 'bg-[#0F9F95] text-white ring-2 ring-[#0F9F95]/30'
                          : step > 2
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
                    </span>
                    <span
                      className={`text-xs font-bold transition-colors ${
                        step === 2 ? 'text-[#0F9F95]' : step > 2 ? 'text-[#0F172A]' : 'text-slate-400'
                      }`}
                    >
                      Bicara
                    </span>
                  </button>

                  <div className={`flex-1 h-0.5 mx-2 transition-colors ${step >= 3 ? 'bg-[#0F9F95]' : 'bg-slate-200'}`} />

                  {/* Step 3: Hasil */}
                  <button
                    type="button"
                    onClick={() => {
                      if (calculatedScore) {
                        changeStep(3);
                      }
                    }}
                    disabled={!calculatedScore}
                    className={`flex items-center gap-1.5 focus:outline-hidden ${
                      calculatedScore ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step === 3
                          ? 'bg-[#0F9F95] text-white ring-2 ring-[#0F9F95]/30'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      3
                    </span>
                    <span
                      className={`text-xs font-bold transition-colors ${
                        step === 3 ? 'text-[#0F9F95]' : 'text-slate-400'
                      }`}
                    >
                      Hasil
                    </span>
                  </button>
                </div>
              </div>

              {/* Toast Banner */}
              {toastMessage && (
                <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Scrollable Step Content Container with Slide Animation */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 relative">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={step}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="space-y-3"
                  >
                    {/* STEP 1: PILIH LATIHAN */}
                    {step === 1 && (
                      <SentenceSelector
                        selectedSentence={selectedSentence}
                        onSelectSentence={(sentence) => {
                          setSelectedSentence(sentence);
                          resetState();
                        }}
                        isPlayingSample={isPlayingTTS}
                        onPlaySample={() => speak(selectedSentence.referenceText)}
                        onStopSample={stopTTS}
                        onStartPracticeStep={() => changeStep(2)}
                      />
                    )}

                    {/* STEP 2: MULAI BICARA */}
                    {step === 2 && (
                      <VoiceRecorder
                        referenceText={selectedSentence.referenceText}
                        translation={selectedSentence.translation}
                        isListening={isListening}
                        interimTranscript={interimTranscript}
                        finalTranscript={finalTranscript}
                        error={error}
                        durationSeconds={durationSeconds}
                        onStartListening={startListening}
                        onStopListening={stopListening}
                        onPlaySampleAgain={() => {
                          if (isPlayingTTS) stopTTS();
                          else speak(selectedSentence.referenceText);
                        }}
                        isPlayingSample={isPlayingTTS}
                        onBackToStep1={() => changeStep(1)}
                        isAnalyzing={isAnalyzing}
                      />
                    )}

                    {/* STEP 3: HASIL EVALUASI */}
                    {step === 3 && calculatedScore && (
                      <div className="space-y-3">
                        {/* Overall Score & Progress Bars */}
                        <ScoreResult
                          score={calculatedScore}
                          userTranscript={finalTranscript}
                        />

                        {/* Accordion Perbandingan Kata */}
                        <WordComparison
                          wordResults={calculatedScore.wordResults}
                          defaultOpen={false}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sticky Action Bar for Step 3 */}
              {step === 3 && calculatedScore && (
                <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] p-3 space-y-2 shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleSaveResult}
                      disabled={isSaving}
                      className={`py-2.5 px-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
                        !isSaving
                          ? 'bg-[#0F9F95] hover:bg-[#0b827a] text-white shadow-2xs cursor-pointer'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Menyimpan...' : 'Simpan Hasil'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTryAgain}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Coba Lagi</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-end text-xs pt-0.5">
                    <button
                      type="button"
                      onClick={handleNextExercise}
                      className="text-[#0F9F95] hover:underline font-bold flex items-center gap-1 cursor-pointer py-1"
                    >
                      <span>Latihan Berikutnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
