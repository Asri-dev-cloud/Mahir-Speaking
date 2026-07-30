import React from 'react';

export type MashiraAvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'success' | 'error';

interface MashiraAvatarProps {
  state?: MashiraAvatarState;
  size?: 'sm' | 'md' | 'lg';
}

export const MashiraAvatar: React.FC<MashiraAvatarProps> = ({
  state = 'idle',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }[size];

  // Ring and pulse animations based on state
  let ringClasses = 'ring-2 ring-emerald-400/40';
  let bgClasses = 'bg-[#0F9F95]';

  switch (state) {
    case 'listening':
      bgClasses = 'bg-[#EF4444]';
      ringClasses = 'ring-4 ring-red-400/50 animate-pulse';
      break;
    case 'thinking':
    case 'speaking':
      bgClasses = 'bg-[#0F9F95]';
      ringClasses = 'ring-4 ring-blue-400/60 animate-spin';
      break;
    case 'success':
      bgClasses = 'bg-emerald-600';
      ringClasses = 'ring-4 ring-emerald-400/60';
      break;
    case 'error':
      bgClasses = 'bg-red-700';
      ringClasses = 'ring-4 ring-red-300/60';
      break;
    case 'idle':
    default:
      bgClasses = 'bg-[#0F9F95]';
      ringClasses = 'ring-2 ring-[#0F9F95]/30';
      break;
  }

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${sizeClasses} ${bgClasses} ${ringClasses} rounded-full text-white font-black flex items-center justify-center shadow-xs transition-all duration-300 select-none`}
      >
        M
      </div>
      {/* Online indicator dot */}
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#071B34]" />
    </div>
  );
};
