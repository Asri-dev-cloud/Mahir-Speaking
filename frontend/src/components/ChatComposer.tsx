import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatComposerProps {
  onSend: (message: string) => void;
  isSending: boolean;
}

const MAX_CHARS = 2000;

export const ChatComposer: React.FC<ChatComposerProps> = ({ onSend, isSending }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea up to 3 lines (~72px)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 76)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed && !isSending && trimmed.length <= MAX_CHARS) {
      onSend(trimmed);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const isOverLimit = text.length > MAX_CHARS;
  const isNearLimit = text.length >= 1700;

  return (
    <div className="bg-white border-t border-[#E2E8F0] p-3 space-y-1.5 shrink-0">
      {/* Approaching Character Limit Warning */}
      {isNearLimit && (
        <div className="flex justify-end text-[10px] font-semibold text-slate-500">
          <span className={isOverLimit ? 'text-red-600 font-bold' : ''}>
            {text.length} / {MAX_CHARS}
          </span>
        </div>
      )}

      <div className="flex items-end gap-2 bg-[#F8FAFC] rounded-2xl p-2 border border-[#E2E8F0] focus-within:ring-2 focus-within:ring-[#0F9F95] focus-within:border-transparent transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan untuk Mashira..."
          disabled={isSending}
          rows={1}
          className="flex-1 bg-transparent text-xs text-[#0F172A] placeholder-slate-400 resize-none focus:outline-hidden py-1 px-1 min-h-[28px] max-h-[76px] custom-scrollbar"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || isSending || isOverLimit}
          aria-label="Kirim pesan"
          className={`p-2 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
            text.trim() && !isSending && !isOverLimit
              ? 'bg-[#0F9F95] hover:bg-[#0b827a] text-white shadow-2xs'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
