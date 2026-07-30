import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 p-3 bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-sm shadow-2xs max-w-[120px]">
      <span className="w-2 h-2 rounded-full bg-[#0F9F95] animate-bounce [animation-delay:0ms] motion-reduce:animate-none" />
      <span className="w-2 h-2 rounded-full bg-[#0F9F95] animate-bounce [animation-delay:150ms] motion-reduce:animate-none" />
      <span className="w-2 h-2 rounded-full bg-[#0F9F95] animate-bounce [animation-delay:300ms] motion-reduce:animate-none" />
    </div>
  );
};
