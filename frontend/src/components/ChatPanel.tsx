// Komponen ChatPanel: Panel utama area percakapan chat tertulis, menampilkan daftar riwayat pesan obrolan secara kronologis.
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatComposer } from './ChatComposer';
import { TypingIndicator } from './TypingIndicator';
import { useMashiraChat } from '../hooks/useMashiraChat';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { RotateCcw, AlertCircle, RefreshCw, MessageSquarePlus } from 'lucide-react';

interface ChatPanelProps {
  onPracticeWithVoice: (englishSentence: string) => void;
  onSetSendingState?: (isSending: boolean) => void;
}

const QUICK_ACTIONS = [
  "Latihan percakapan",
  "Koreksi grammar",
  "Persiapan interview",
  "Tanya tentang Mahir Speaking"
];

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onPracticeWithVoice,
  onSetSendingState
}) => {
  const {
    messages,
    isSending,
    error,
    sendMessage,
    retryLastMessage,
    startNewConversation
  } = useMashiraChat();

  const { isPlaying: isPlayingTTS, speak, stop: stopTTS } = useTextToSpeech();
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = React.useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrollingUpRef = useRef<boolean>(false);

  // Notify parent of sending state for Header status
  useEffect(() => {
    if (onSetSendingState) {
      onSetSendingState(isSending);
    }
  }, [isSending, onSetSendingState]);

  // Handle auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !isUserScrollingUpRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
      isUserScrollingUpRef.current = !isAtBottom;
    }
  };

  const handleSpeakMessage = (msgId: string, text: string, lang: 'en-US' | 'id-ID') => {
    setActiveSpeakingMsgId(msgId);
    speak(text, lang, () => {
      setActiveSpeakingMsgId(null);
    });
  };

  const handleStopSpeak = () => {
    stopTTS();
    setActiveSpeakingMsgId(null);
  };

  const handleConfirmNewConversation = () => {
    const confirm = window.confirm(
      'Apakah Anda yakin ingin memulai percakapan baru? Riwayat chat saat ini akan dibersihkan.'
    );
    if (confirm) {
      stopTTS();
      startNewConversation();
    }
  };

  const handleQuickActionClick = (actionText: string) => {
    isUserScrollingUpRef.current = false;
    sendMessage(actionText);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
      {/* Top Bar inside ChatPanel for New Conversation Button */}
      <div className="bg-white border-b border-[#E2E8F0] px-3 py-1.5 flex items-center justify-between shrink-0 text-xs">
        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
          Chat Tutor Mashira
        </span>

        <button
          type="button"
          onClick={handleConfirmNewConversation}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#0F9F95] hover:text-[#0b827a] hover:bg-teal-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          title="Mulai percakapan baru"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span>Percakapan Baru</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3"
      >
        {/* Initial Greeting Banner if no messages */}
        {messages.length === 0 && (
          <div className="space-y-3 my-2 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0F9F95] text-white font-black text-xs flex items-center justify-center">
                  M
                </span>
                <span className="text-xs font-bold text-[#0F172A]">
                  AI English Tutor
                </span>
              </div>
              <p className="text-xs text-[#0F172A] leading-relaxed">
                Halo! Aku Mashira, AI English Tutor dari Mahir Speaking. Mau latihan speaking, memperbaiki grammar, atau mempersiapkan interview hari ini?
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-1 block">
                Topik Populer
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickActionClick(action)}
                    className="p-2.5 bg-white hover:bg-teal-50/60 border border-[#E2E8F0] hover:border-[#0F9F95]/40 rounded-xl text-left text-xs font-semibold text-[#0F172A] hover:text-[#0F9F95] transition-all shadow-2xs cursor-pointer min-h-[40px] flex items-center"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSpeak={(text, lang) => handleSpeakMessage(msg.id, text, lang)}
            isSpeaking={isPlayingTTS}
            activeSpeakingMsgId={activeSpeakingMsgId}
            onStopSpeak={handleStopSpeak}
            onPracticeWithVoice={onPracticeWithVoice}
          />
        ))}

        {/* Typing Indicator */}
        {isSending && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        {/* Error Banner with Retry */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="leading-tight font-medium">{error}</div>
            </div>
            <button
              type="button"
              onClick={retryLastMessage}
              className="px-3 py-1.5 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}
      </div>

      {/* Composer Input */}
      <ChatComposer onSend={sendMessage} isSending={isSending} />
    </div>
  );
};
