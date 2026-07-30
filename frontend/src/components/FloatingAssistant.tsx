import React from 'react';
import { Mic } from 'lucide-react';

interface FloatingAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
  isOpen,
  onToggle,
  buttonRef
}) => {
  return (
    <div className="fixed bottom-32 sm:bottom-24 right-4 sm:right-6 z-40 flex items-center gap-2 group">
      {/* Tooltip Label */}
      <div
        id="floating-tooltip"
        role="tooltip"
        className="hidden sm:flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none"
      >
        <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
        <span>Tanya Mashira AI Assistant</span>
      </div>

      {/* Circular Floating Mashira Assistant Button with Character 4.png */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        aria-label="Buka Mashira Assistant"
        aria-describedby="floating-tooltip"
        aria-expanded={isOpen}
        className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-300 cursor-pointer border-2 border-white group/btn ${
          isOpen
            ? 'bg-slate-900 text-white scale-95 ring-2 ring-lime shadow-limeGlow'
            : 'bg-slate-900 hover:scale-105 shadow-xl'
        }`}
      >
        {/* Soft Idle Breathing Pulse */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />
        )}

        {/* Character Avatar 4.png */}
        <img 
          src="/4.png" 
          alt="Mashira Assistant Character" 
          className="w-full h-full rounded-full object-cover p-0.5 bg-slate-900" 
        />

        {/* Small Microphone Overlay Badge */}
        <span className="absolute -bottom-1 -right-1 bg-slate-900 text-lime p-1.5 rounded-full ring-2 ring-white shadow-md">
          <Mic className="w-3.5 h-3.5 text-lime" />
        </span>

        {/* Online Indicator Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-lime ring-2 ring-slate-900 animate-pulse" />
      </button>
    </div>
  );
};
