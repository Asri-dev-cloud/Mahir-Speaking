// Halaman AIChatView: Area interaktif latihan percakapan chat dengan asisten AI Coach Mashira yang mencakup beberapa mode pembelajaran.
import React, { useState } from 'react';
import { useAIChat } from '../../context/AIChatContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bot, Send, Plus, Trash2, Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, 
  BookOpen, Mic, Languages, MessageSquare, ShieldAlert
} from 'lucide-react';

export default function AIChatView() {
  const { user, setActiveTab } = useAuth();
  const { 
    messages, activeMode, setActiveMode, isTyping, limitWarning, 
    speakingMessageId, sendMessage, clearChat, speakText, stopSpeaking 
  } = useAIChat();

  const [inputMessage, setInputMessage] = useState('');

  // Mengirim pesan input pengguna ke server asisten AI secara asinkron.
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const modes = [
    { id: 'general', label: 'Free Practice', icon: MessageSquare, desc: 'General conversation partner' },
    { id: 'grammar', label: 'Grammar Doctor', icon: CheckCircle2, desc: 'Sentence correction & fluency' },
    { id: 'speaking', label: 'Speaking Drill', icon: Mic, desc: 'PREP method speech formulation' },
    { id: 'vocab', label: 'Vocab Booster', icon: BookOpen, desc: 'Synonyms, idioms & collocations' },
    { id: 'translator', label: 'Indo ⇄ English', icon: Languages, desc: 'Natural contextual translation' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-140px)] min-h-[580px]">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Sidebar (Desktop 3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col justify-between glass-panel p-5 rounded-3xl border border-white shadow-glass h-full">
          <div className="space-y-4">
            
            <button
              onClick={clearChat}
              className="w-full py-3 px-4 rounded-2xl bg-brand text-electric font-bold text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Practice Chat</span>
            </button>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block px-2">
                Select Practice Mode
              </span>

              {modes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                      activeMode === mode.id
                        ? 'bg-amber-100/90 text-amber-950 font-bold border border-amber-300 shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeMode === mode.id ? 'text-amber-800' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold">{mode.label}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{mode.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* User Package Usage Widget */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>{user?.package_name || 'Standard'} Plan</span>
              <span className="text-amberIcon text-[10px]">
                {user?.ai_daily_limit === -1 ? '⚡ Unlimited' : 'Daily Limit'}
              </span>
            </div>
            {user?.ai_daily_limit !== -1 && (
              <p className="text-[10px] text-slate-300">
                Limit: {user?.ai_daily_limit || 50} msgs/day. Upgrade to Premium for UNLIMITED access.
              </p>
            )}
            <button
              onClick={() => setActiveTab('my-package')}
              className="w-full py-1.5 rounded-lg bg-electric text-slate-950 text-[10px] font-extrabold"
            >
              Upgrade Package
            </button>
          </div>

        </div>

        {/* Main Chat Area (9 cols) */}
        <div className="lg:col-span-9 flex flex-col justify-between glass-panel rounded-3xl border border-white shadow-glass h-full overflow-hidden">
          
          {/* Top Bar Header */}
          <div className="p-4 bg-white/90 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amberIcon text-white flex items-center justify-center shadow-goldGlow">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-stinger font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <span>Mahir AI Speaking Assistant</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Mode: <strong className="text-brand capitalize">{activeMode}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daily Limit Warning Modal Alert */}
          {limitWarning && (
            <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center gap-3 text-amber-900 text-xs font-medium">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <strong>Daily AI Limit Reached!</strong> {limitWarning}
              </div>
              <button
                onClick={() => setActiveTab('my-package')}
                className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg text-xs"
              >
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Messages Scroll View */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                  msg.role === 'user' ? 'bg-brand text-electric' : 'bg-amberIcon text-white'
                }`}>
                  {msg.role === 'user' ? 'You' : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-brand text-white rounded-tr-none shadow-sm font-medium'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/90 shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Audio Voice Synthesizer Button */}
                  {msg.role === 'assistant' && (
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">AI Audio Voice</span>
                      <button
                        onClick={() => {
                          if (speakingMessageId === msg.id) stopSpeaking();
                          else speakText(msg.content, msg.id);
                        }}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-brand hover:text-brand-600 bg-brand/5 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-red-500" />
                            <span>Stop Speaking</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen to Voice</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-amberIcon text-white flex items-center justify-center font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200/80 flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask AI Coach in ${activeMode} mode...`}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-xs sm:text-sm font-medium"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-brand text-electric font-black text-xs shadow-glow hover:bg-brand-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
