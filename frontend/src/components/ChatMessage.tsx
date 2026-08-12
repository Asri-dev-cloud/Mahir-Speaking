// Komponen ChatMessage: Menampilkan balon obrolan individu (dari pengguna maupun asisten AI) beserta tombol pemutar suara (text-to-speech).
import React, { useMemo } from 'react';
import { ChatMessageItem } from '../types/chat';
import { Volume2, Square, Mic } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageItem;
  onSpeak: (text: string, lang: 'en-US' | 'id-ID') => void;
  isSpeaking: boolean;
  activeSpeakingMsgId: string | null;
  onStopSpeak: () => void;
  onPracticeWithVoice: (englishSentence: string) => void;
}

// Language Detector
function detectLanguage(text: string): 'en-US' | 'id-ID' {
  const lower = text.toLowerCase();
  const idWords = ['saya', 'kamu', 'anda', 'yang', 'dan', 'dengan', 'untuk', 'ini', 'itu', 'akan', 'aku', 'bisa', 'halo', 'terima', 'kasih', 'koreksi', 'kalimat', 'artinya', 'maksud', 'bantuan', 'singkat'];
  const enWords = ['the', 'you', 'are', 'your', 'have', 'with', 'this', 'that', 'from', 'english', 'practice', 'speak', 'hello', 'how', 'what', 'would', 'like', 'great', 'good', 'sentence'];

  let idCount = 0;
  let enCount = 0;

  const words = lower.split(/\s+/);
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, '');
    if (idWords.includes(clean)) idCount++;
    if (enWords.includes(clean)) enCount++;
  });

  return idCount > enCount ? 'id-ID' : 'en-US';
}

// Extract max 1 clean English sentence
function extractEnglishSentence(text: string): string | null {
  // Look for quotes or sentences
  const quoteMatch = text.match(/"([^"]+)"/);
  if (quoteMatch && quoteMatch[1] && /[a-zA-Z]{3,}/.test(quoteMatch[1])) {
    return quoteMatch[1].trim();
  }

  // Split into sentences
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
  const englishSentences = sentences.filter(s => {
    const trimmed = s.trim();
    // Must contain English words and limited Indonesian words
    return /[a-zA-Z]{3,}/.test(trimmed) && !/ (saya|yang|dengan|untuk|adalah) /i.test(trimmed);
  });

  if (englishSentences.length > 0) {
    const candidate = englishSentences[0].trim().replace(/^["'\s]+|["'\s]+$/g, '');
    if (candidate.length >= 6) {
      return candidate;
    }
  }

  // Fallback: if entire text looks like English
  if (/^[a-zA-Z0-9\s,.'"-]+$/.test(text.trim()) && text.trim().length >= 6) {
    return text.trim();
  }

  return null;
}

// Safe Link Renderer
function renderMessageText(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F9F95] underline hover:text-[#0b827a] font-medium break-all"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSpeak,
  isSpeaking,
  activeSpeakingMsgId,
  onStopSpeak,
  onPracticeWithVoice
}) => {
  const isUser = message.role === 'user';
  const isThisMsgSpeaking = isSpeaking && activeSpeakingMsgId === message.id;

  const detectedLang = useMemo(() => detectLanguage(message.content), [message.content]);
  const englishSentenceForVoice = useMemo(() => {
    if (isUser) return null;
    return extractEnglishSentence(message.content);
  }, [message.content, isUser]);

  const formattedTime = useMemo(() => {
    try {
      return new Date(message.createdAt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }, [message.createdAt]);

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
      {/* Message Bubble */}
      <div
        className={`max-w-[82%] p-3 text-xs leading-relaxed transition-all shadow-2xs ${
          isUser
            ? 'bg-[#071B34] text-white rounded-2xl rounded-tr-xs'
            : 'bg-white text-[#0F172A] border border-[#E2E8F0] rounded-2xl rounded-tl-xs'
        }`}
      >
        <div className="whitespace-pre-wrap select-text">
          {renderMessageText(message.content)}
        </div>

        {/* Action Buttons for Assistant Message */}
        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
            {/* Listen Button (TTS) */}
            <button
              type="button"
              onClick={() => {
                if (isThisMsgSpeaking) {
                  onStopSpeak();
                } else {
                  onSpeak(message.content, detectedLang);
                }
              }}
              className="flex items-center gap-1 font-semibold text-[#0F9F95] hover:text-[#0b827a] transition-colors cursor-pointer py-0.5 px-1.5 rounded-md hover:bg-teal-50"
              title="Dengarkan jawaban"
            >
              {isThisMsgSpeaking ? (
                <>
                  <Square className="w-3 h-3 fill-current text-amber-500 animate-pulse" />
                  <span className="text-amber-600">Berhenti</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengarkan ({detectedLang === 'en-US' ? 'EN' : 'ID'})</span>
                </>
              )}
            </button>

            {/* Practice with Voice Button (if English sentence present) */}
            {englishSentenceForVoice && (
              <button
                type="button"
                onClick={() => onPracticeWithVoice(englishSentenceForVoice)}
                className="flex items-center gap-1 font-semibold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer py-0.5 px-1.5 rounded-md hover:bg-blue-50"
                title="Latih kalimat ini dengan Voice Coach"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Latih dengan Voice</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-slate-400 font-medium px-1">
        {formattedTime}
      </span>
    </div>
  );
};
