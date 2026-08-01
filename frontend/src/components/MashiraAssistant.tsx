import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AssistantMode } from '../types/chat';
import { AssistantModeSwitcher } from './AssistantModeSwitcher';
import { ChatPanel } from './ChatPanel';
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
import { Minus, X, RefreshCw, ChevronRight, Save, CheckCircle, History, GripHorizontal, Check, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { useMashiraChat } from '../hooks/useMashiraChat';
import { exerciseService } from '../services/api';

interface MashiraAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  floatingButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

const STORAGE_MODE_KEY = 'mashira_assistant_mode';
const STORAGE_HISTORY_KEY = 'mahir_speaking_history';
const STORAGE_POS_KEY = 'mashira_panel_pos';

export const MashiraAssistant: React.FC<MashiraAssistantProps> = ({
  isOpen,
  onClose,
  floatingButtonRef
}) => {
  // Mode State (Chat / Voice)
  const [mode, setMode] = useState<AssistantMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODE_KEY);
      return (saved === 'chat' || saved === 'voice') ? saved : 'chat';
    } catch {
      return 'chat';
    }
  });

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  // Voice Coach State
  const [currentVoiceView, setCurrentVoiceView] = useState<'practice' | 'history'>('practice');
  const [voiceStep, setVoiceStep] = useState<1 | 2 | 3>(1);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [selectedSentence, setSelectedSentence] = useState<PracticeItem>(INITIAL_PRACTICE_DATA[0]);
  const [exercises, setExercises] = useState<PracticeItem[]>([]);
  const [isCustomExercise, setIsCustomExercise] = useState<boolean>(false);
  const [isSavingVoice, setIsSavingVoice] = useState<boolean>(false);
  const [isAnalyzingVoice, setIsAnalyzingVoice] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const headingTitleRef = useRef<HTMLHeadingElement>(null);
  const dragControls = useDragControls();

  // Chat hook directly in Assistant for cross-mode messaging
  const { sendMessage } = useMashiraChat();

  // Load Desktop Drag Position
  const [desktopPos, setDesktopPos] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POS_KEY);
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  });

  // Voice History State
  const [voiceHistory, setVoiceHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Speech Recognition & Speech Synthesis Hooks for Voice Coach
  const {
    isListening,
    interimTranscript,
    finalTranscript,
    error: voiceError,
    durationSeconds,
    startListening,
    stopListening,
    resetState
  } = useSpeechRecognition();

  const { isPlaying: isPlayingTTS, speak, stop: stopTTS } = useTextToSpeech();

  // Save mode to localStorage
  const handleModeChange = (newMode: AssistantMode) => {
    stopTTS();
    setMode(newMode);
    try {
      localStorage.setItem(STORAGE_MODE_KEY, newMode);
    } catch {
      // ignore
    }
  };

  // Focus Title on Open & Handle Cleanup
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

  // Fetch Dynamic Exercises from API on Open
  useEffect(() => {
    if (isOpen) {
      const fetchExercises = async () => {
        const res = await exerciseService.getExercises();
        if (res.success && res.exercises) {
          setExercises(res.exercises);
          setSelectedSentence((prev) => {
            const isDefault = prev.title === INITIAL_PRACTICE_DATA[0].title && prev.referenceText === INITIAL_PRACTICE_DATA[0].referenceText;
            if (isDefault && res.exercises.length > 0) {
              return res.exercises[0];
            }
            const exists = res.exercises.some((e) => e.title === prev.title);
            if (!exists && res.exercises.length > 0) {
              return res.exercises[0];
            }
            return prev;
          });
        }
      };
      fetchExercises();
    }
  }, [isOpen]);

  // Calculate Voice Scores
  const calculatedScore: ScoringResult | null = useMemo(() => {
    if (!finalTranscript.trim() || isListening) {
      return null;
    }
    return calculateScores(selectedSentence.referenceText, finalTranscript, durationSeconds);
  }, [selectedSentence.referenceText, finalTranscript, isListening, durationSeconds]);

  // Auto transition from Step 2 to Step 3 in Voice Coach
  useEffect(() => {
    if (voiceStep === 2 && !isListening && finalTranscript.trim() && calculatedScore) {
      setIsAnalyzingVoice(true);
      const timer = setTimeout(() => {
        setIsAnalyzingVoice(false);
        changeVoiceStep(3);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [voiceStep, isListening, finalTranscript, calculatedScore]);

  const changeVoiceStep = (newStep: 1 | 2 | 3) => {
    if (newStep === voiceStep) return;
    setSlideDirection(newStep > voiceStep ? 'next' : 'prev');
    setVoiceStep(newStep);
  };

  // Save Voice history
  const saveToVoiceHistory = (item: HistoryItem) => {
    const updated = [item, ...voiceHistory.filter((h) => h.id !== item.id)];
    setVoiceHistory(updated);
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = voiceHistory.filter((h) => h.id !== id);
    setVoiceHistory(updated);
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearHistory = () => {
    setVoiceHistory([]);
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  // Avatar state
  const avatarState: MashiraAvatarState = useMemo(() => {
    if (voiceError) return 'error';
    if (isListening) return 'listening';
    if (isPlayingTTS) return 'speaking';
    if (isChatSending) return 'thinking';
    if (calculatedScore && voiceStep === 3) return 'success';
    return 'idle';
  }, [voiceError, isListening, isPlayingTTS, isChatSending, calculatedScore, voiceStep]);

  // Dynamic Header Status Text without emojis
  const statusText = useMemo(() => {
    if (isChatSending) return 'Sedang mengetik...';
    if (isListening) return 'Sedang mendengarkan...';
    if (isPlayingTTS || isAnalyzingVoice) return 'Memproses ucapan...';
    return 'Siap membantu';
  }, [isChatSending, isListening, isPlayingTTS, isAnalyzingVoice]);

  // Navigation actions for Voice
  const handleTryAgainVoice = () => {
    resetState();
    changeVoiceStep(2);
  };

  const handleNextExerciseVoice = () => {
    setIsCustomExercise(false);
    const currentList = exercises.length > 0 ? exercises : INITIAL_PRACTICE_DATA;
    const currentIdx = currentList.findIndex((i) => i.title === selectedSentence.title);
    const nextIdx = currentIdx >= 0 && currentIdx < currentList.length - 1 ? currentIdx + 1 : 0;
    setSelectedSentence(currentList[nextIdx]);
    resetState();
    changeVoiceStep(1);
  };

  const handleSaveVoiceResult = () => {
    if (!calculatedScore || !finalTranscript.trim() || isSavingVoice) return;

    setIsSavingVoice(true);
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

      saveToVoiceHistory(historyRecord);
      setIsSavingVoice(false);
      setToastMessage('Hasil latihan berhasil disimpan.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 400);
  };

  // Integration: Chat -> Voice
  const handlePracticeWithVoiceFromChat = (englishSentence: string) => {
    const customItem: PracticeItem = {
      level: 'A2',
      title: 'Latihan dari Chat Mashira',
      instruction: 'Dengarkan lalu ulangi kalimat berikut.',
      referenceText: englishSentence,
      translation: 'Kalimat latihan dari Chat Mashira'
    };
    setSelectedSentence(customItem);
    setIsCustomExercise(true);
    resetState();
    setVoiceStep(1);
    handleModeChange('voice');
  };

  // Integration: Voice -> Chat
  const handleAskMashiraAboutResult = () => {
    if (!finalTranscript.trim()) return;
    const prompt = `Tolong koreksi grammar dari kalimat bahasa Inggris saya berikut dan beri penjelasan singkat dalam bahasa Indonesia:\n\n${finalTranscript.trim()}`;
    handleModeChange('chat');
    setTimeout(() => {
      sendMessage(prompt);
    }, 150);
  };

  // Drag Handlers
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

  const handleHeaderDoubleClick = () => {
    const defaultPos = { x: 0, y: 0 };
    setDesktopPos(defaultPos);
    try {
      localStorage.setItem(STORAGE_POS_KEY, JSON.stringify(defaultPos));
    } catch {
      // ignore
    }
  };

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
        aria-label="Mashira AI Assistant"
        aria-modal="true"
        className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-auto justify-center sm:justify-end"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: isMinimized ? 0.9 : 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          drag={window.innerWidth >= 640}
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragConstraints={{ left: -window.innerWidth + 460, right: 20, top: -window.innerHeight + 500, bottom: 20 }}
          onDragEnd={handleDragEnd}
          style={{ x: desktopPos.x, y: desktopPos.y }}
          className={`pointer-events-auto bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col ${
            isMinimized
              ? 'rounded-2xl h-[64px] w-[calc(100%-32px)] mb-[76px] sm:w-[440px] sm:mr-5 sm:mb-5'
              : 'rounded-t-[24px] sm:rounded-[24px] w-full sm:w-[440px] h-[92dvh] sm:h-[680px] sm:max-h-[calc(100dvh-32px)] sm:mr-5 sm:mb-5 pb-[calc(env(safe-area-inset-bottom)+76px)] sm:pb-[env(safe-area-inset-bottom)]'
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
                  Mashira
                </h2>
                <p className="text-[11px] text-slate-300 font-medium mt-1 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F9F95] shrink-0" />
                  <span className="truncate">{statusText}</span>
                </p>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* History Button (only in Voice mode) */}
              {mode === 'voice' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentVoiceView(currentVoiceView === 'history' ? 'practice' : 'history');
                  }}
                  className={`p-1.5 rounded-lg transition-colors focus:ring-2 focus:ring-white/30 focus:outline-hidden cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center relative ${
                    currentVoiceView === 'history'
                      ? 'bg-[#0F9F95] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  aria-label="Riwayat Latihan Voice"
                  title="Riwayat Latihan Voice"
                >
                  <History className="w-4 h-4" />
                  {voiceHistory.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#071B34]" />
                  )}
                </button>
              )}

              {/* Drag Handle Icon */}
              <span className="hidden sm:inline-flex text-slate-500 mx-0.5" aria-label="Geser panel Mashira">
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
                aria-label={isMinimized ? 'Perbesar panel Mashira' : 'Kecilkan panel Mashira'}
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
                aria-label="Tutup panel Mashira"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Segmented Control directly below Header */}
          {!isMinimized && (
            <AssistantModeSwitcher
              currentMode={mode}
              onModeChange={handleModeChange}
              isListeningInVoice={isListening}
            />
          )}

          {/* Minimized View Bar */}
          {isMinimized ? (
            <div className="p-2 bg-white flex items-center justify-between px-4">
              <p className="text-xs font-semibold text-[#0F172A] truncate">
                Mashira AI Assistant ({mode === 'chat' ? 'Chat' : 'Voice'})
              </p>
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="px-3 py-1 bg-[#0F9F95] text-white rounded-lg text-xs font-bold hover:bg-[#0b827a] cursor-pointer"
              >
                Buka
              </button>
            </div>
          ) : (
            /* Main Content Container (Preserves both DOM states) */
            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
              {/* CHAT MODE VIEW */}
              <div className={`flex-1 flex flex-col min-h-0 ${mode === 'chat' ? 'flex' : 'hidden'}`}>
                <ChatPanel
                  onPracticeWithVoice={handlePracticeWithVoiceFromChat}
                  onSetSendingState={setIsChatSending}
                />
              </div>

              {/* VOICE MODE VIEW */}
              <div className={`flex-1 flex flex-col min-h-0 ${mode === 'voice' ? 'flex' : 'hidden'}`}>
                {currentVoiceView === 'history' ? (
                  /* History View */
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    <PracticeHistory
                      history={voiceHistory}
                      onDeleteHistoryItem={handleDeleteHistoryItem}
                      onClearHistory={handleClearHistory}
                      onBackToPractice={() => setCurrentVoiceView('practice')}
                    />
                  </div>
                ) : (
                  /* Practice Stepper View */
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Sticky Stepper */}
                    <div className="bg-white border-b border-[#E2E8F0] px-4 py-2 shrink-0 select-none">
                      <div className="flex items-center justify-between max-w-sm mx-auto">
                        <button
                          type="button"
                          onClick={() => changeVoiceStep(1)}
                          className="flex items-center gap-1.5 cursor-pointer focus:outline-hidden group"
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                              voiceStep === 1
                                ? 'bg-[#0F9F95] text-white ring-2 ring-[#0F9F95]/30'
                                : voiceStep > 1
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {voiceStep > 1 ? <Check className="w-3 h-3" /> : '1'}
                          </span>
                          <span
                            className={`text-xs font-bold transition-colors ${
                              voiceStep === 1 ? 'text-[#0F9F95]' : 'text-[#0F172A]'
                            }`}
                          >
                            Pilih
                          </span>
                        </button>

                        <div className={`flex-1 h-0.5 mx-2 transition-colors ${voiceStep >= 2 ? 'bg-[#0F9F95]' : 'bg-slate-200'}`} />

                        <button
                          type="button"
                          onClick={() => {
                            if (voiceStep >= 2 || finalTranscript || isListening) {
                              changeVoiceStep(2);
                            }
                          }}
                          disabled={voiceStep < 2 && !finalTranscript && !isListening}
                          className={`flex items-center gap-1.5 focus:outline-hidden ${
                            voiceStep >= 2 || finalTranscript ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                              voiceStep === 2
                                ? 'bg-[#0F9F95] text-white ring-2 ring-[#0F9F95]/30'
                                : voiceStep > 2
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {voiceStep > 2 ? <Check className="w-3 h-3" /> : '2'}
                          </span>
                          <span
                            className={`text-xs font-bold transition-colors ${
                              voiceStep === 2 ? 'text-[#0F9F95]' : voiceStep > 2 ? 'text-[#0F172A]' : 'text-slate-400'
                            }`}
                          >
                            Bicara
                          </span>
                        </button>

                        <div className={`flex-1 h-0.5 mx-2 transition-colors ${voiceStep >= 3 ? 'bg-[#0F9F95]' : 'bg-slate-200'}`} />

                        <button
                          type="button"
                          onClick={() => {
                            if (calculatedScore) {
                              changeVoiceStep(3);
                            }
                          }}
                          disabled={!calculatedScore}
                          className={`flex items-center gap-1.5 focus:outline-hidden ${
                            calculatedScore ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                              voiceStep === 3
                                ? 'bg-[#0F9F95] text-white ring-2 ring-[#0F9F95]/30'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            3
                          </span>
                          <span
                            className={`text-xs font-bold transition-colors ${
                              voiceStep === 3 ? 'text-[#0F9F95]' : 'text-slate-400'
                            }`}
                          >
                            Hasil
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Custom Exercise Badge if created from Chat */}
                    {isCustomExercise && (
                      <div className="bg-teal-50 border-b border-teal-100 px-3 py-1.5 text-[11px] font-bold text-[#0F9F95] flex items-center justify-between shrink-0">
                        <span>Latihan dari Chat Mashira</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomExercise(false);
                            setSelectedSentence(exercises[0] || INITIAL_PRACTICE_DATA[0]);
                            resetState();
                          }}
                          className="text-slate-400 hover:text-slate-600 font-normal underline cursor-pointer"
                        >
                          Ganti
                        </button>
                      </div>
                    )}

                    {/* Toast Banner */}
                    {toastMessage && (
                      <div className="mx-4 mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{toastMessage}</span>
                      </div>
                    )}

                    {/* Step Content Container */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 relative">
                      <AnimatePresence mode="wait" custom={slideDirection}>
                        <motion.div
                          key={voiceStep}
                          custom={slideDirection}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="space-y-3"
                        >
                          {/* STEP 1: PILIH */}
                          {voiceStep === 1 && (
                            <SentenceSelector
                              selectedSentence={selectedSentence}
                              onSelectSentence={(sentence) => {
                                setIsCustomExercise(false);
                                setSelectedSentence(sentence);
                                resetState();
                              }}
                              isPlayingSample={isPlayingTTS}
                              onPlaySample={() => speak(selectedSentence.referenceText)}
                              onStopSample={stopTTS}
                              onStartPracticeStep={() => changeVoiceStep(2)}
                              exercises={exercises}
                            />
                          )}

                          {/* STEP 2: BICARA */}
                          {voiceStep === 2 && (
                            <VoiceRecorder
                              referenceText={selectedSentence.referenceText}
                              translation={selectedSentence.translation}
                              isListening={isListening}
                              interimTranscript={interimTranscript}
                              finalTranscript={finalTranscript}
                              error={voiceError}
                              durationSeconds={durationSeconds}
                              onStartListening={startListening}
                              onStopListening={stopListening}
                              onPlaySampleAgain={() => {
                                if (isPlayingTTS) stopTTS();
                                else speak(selectedSentence.referenceText);
                              }}
                              isPlayingSample={isPlayingTTS}
                              onBackToStep1={() => changeVoiceStep(1)}
                              isAnalyzing={isAnalyzingVoice}
                            />
                          )}

                          {/* STEP 3: HASIL */}
                          {voiceStep === 3 && calculatedScore && (
                            <div className="space-y-3">
                              {/* Overall Score */}
                              <ScoreResult
                                score={calculatedScore}
                                userTranscript={finalTranscript}
                              />

                              {/* Ask Mashira Button (Voice to Chat) */}
                              {finalTranscript.trim() && (
                                <button
                                  type="button"
                                  onClick={handleAskMashiraAboutResult}
                                  className="w-full py-2.5 px-3 bg-[#071B34] hover:bg-[#0f284a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer border border-white/10"
                                >
                                  <MessageCircle className="w-4 h-4 text-[#0F9F95]" />
                                  <span>Tanya Mashira tentang hasil ini</span>
                                </button>
                              )}

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

                    {/* Sticky Action Bar for Voice Step 3 */}
                    {voiceStep === 3 && calculatedScore && (
                      <div className="sticky bottom-0 bg-white border-t border-[#E2E8F0] p-3 space-y-2 shrink-0">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={handleSaveVoiceResult}
                            disabled={isSavingVoice}
                            className={`py-2 px-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all min-h-[40px] ${
                              !isSavingVoice
                                ? 'bg-[#0F9F95] hover:bg-[#0b827a] text-white shadow-2xs cursor-pointer'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-4 h-4" />
                            <span>{isSavingVoice ? 'Menyimpan...' : 'Simpan Hasil'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleTryAgainVoice}
                            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Coba Lagi</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-end text-xs pt-0.5">
                          <button
                            type="button"
                            onClick={handleNextExerciseVoice}
                            className="text-[#0F9F95] hover:underline font-bold flex items-center gap-1 cursor-pointer py-1"
                          >
                            <span>Latihan Berikutnya</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
