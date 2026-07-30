import React from 'react';
import { AssistantMode } from '../types/chat';
import { MessageCircle, Mic } from 'lucide-react';
import { motion } from 'motion/react';

interface AssistantModeSwitcherProps {
  currentMode: AssistantMode;
  onModeChange: (mode: AssistantMode) => void;
  isListeningInVoice?: boolean;
}

export const AssistantModeSwitcher: React.FC<AssistantModeSwitcherProps> = ({
  currentMode,
  onModeChange,
  isListeningInVoice = false
}) => {
  const handleSelectMode = (targetMode: AssistantMode) => {
    if (targetMode === currentMode) return;

    if (currentMode === 'voice' && isListeningInVoice) {
      const confirmLeave = window.confirm(
        'Anda sedang merekam suara. Yakin ingin berpindah ke Chat?'
      );
      if (!confirmLeave) return;
    }

    onModeChange(targetMode);
  };

  return (
    <div className="bg-[#071B34] border-b border-white/10 px-4 py-2 shrink-0 select-none">
      <div className="relative bg-[#1E293B] rounded-xl p-1 flex items-center max-w-sm mx-auto border border-white/5">
        {/* Animated Moving Background Indicator */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-lg bg-[#0F9F95]"
          initial={false}
          animate={{
            left: currentMode === 'chat' ? '4px' : 'calc(50% + 2px)',
            width: 'calc(50% - 6px)'
          }}
          transition={{ duration: 0.18, ease: 'easeInOut' }}
        />

        {/* Chat Tab Button */}
        <button
          type="button"
          onClick={() => handleSelectMode('chat')}
          className={`relative z-10 flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            currentMode === 'chat' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        {/* Voice Tab Button */}
        <button
          type="button"
          onClick={() => handleSelectMode('voice')}
          className={`relative z-10 flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            currentMode === 'voice' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice</span>
        </button>
      </div>
    </div>
  );
};
