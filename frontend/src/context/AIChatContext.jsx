import React, { createContext, useContext, useState, useEffect } from 'react';
import { aiService } from '../services/api';
import { useAuth } from './AuthContext';

// 🤖 Konteks Chatbot AI Mashira: Sahabat Curhat & Voice Coach Pintar! 💬
const AIChatContext = createContext();

export const AIChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      role: 'assistant',
      mode: 'general',
      content: `Welcome to **Mahir AI Coach**! 🚀\n\nI am your 24/7 personal English Speaking Assistant. What would you like to practice today?\n\n- **🎙️ Speaking Practice:** Formulate speech responses using the PREP method.\n- **🔍 Grammar Corrector:** Paste any sentence to check and perfect its grammar.\n- **📚 Vocabulary Booster:** Learn idioms, synonyms, and natural collocations.\n- **🇮🇩 ⇄ 🇬🇧 Indonesian-English Translator:** Translate with natural conversational nuances.`
    }
  ]);
  const [activeMode, setActiveMode] = useState('general'); // 🎨 Mode chat (general, grammar, speaking, vocab, translator)
  const [isTyping, setIsTyping] = useState(false);
  const [limitWarning, setLimitWarning] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  // 📜 Ambil riwayat chat lama si doi kalo udah login
  useEffect(() => {
    if (user) {
      aiService.getHistory()
        .then(data => {
          if (data.success && data.history.length > 0) {
            setMessages(data.history);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // 🚀 Kirim pesan ke Mashira AI Coach
  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const tempUserMsg = { id: Date.now(), role: 'user', mode: activeMode, content: text };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);
    setLimitWarning(null);

    try {
      const data = await aiService.sendMessage(text, activeMode);
      if (data.success) {
        setMessages(prev => [...prev, data.aiMessage]);
        // 🎙️ Auto-Speak balasan AI kalo lagi di mode latihan percakapan/speaking!
        if (activeMode === 'speaking') {
          speakText(data.aiMessage.content, data.aiMessage.id);
        }
      }
    } catch (err) {
      if (err.message && err.message.includes('Daily AI Chat limit reached')) {
        setLimitWarning(err.message);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            mode: activeMode,
            content: `⚠️ Note dari Sistem: Server lagi padat gais. Ini feedback kilat buat kamu untuk "${text}":\n\n> "Awesome effort! Tetep percaya diri & perhatikan intonasi di akhir kalimat ya bestie~"`
          }
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // 🧹 Bersihin riwayat chat biar makin fresh mulus
  const clearChat = async () => {
    try {
      await aiService.clearHistory();
    } catch (e) {}
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        mode: 'general',
        content: `Sesi latihan baru udah siap gais! Silakan pilih mode di atas yuk ✨`
      }
    ]);
  };

  // 🗣️ Fitur Web Speech API: Membacakan teks dengan suara native yang merdu~
  const speakText = (text, messageId = null) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser kamu belum mendukung fitur suara nih bestie, coba pake Chrome/Edge ya! 🙏');
      return;
    }

    window.speechSynthesis.cancel(); // Stop suara sebelumnya biar gak tabrakan gais

    const cleanText = text.replace(/[*_#>`-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    if (messageId) setSpeakingMessageId(messageId);

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  // 🛑 Hentikan suara yang lagi ngomong
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  return (
    <AIChatContext.Provider value={{
      messages,
      activeMode,
      setActiveMode,
      isTyping,
      limitWarning,
      speakingMessageId,
      sendMessage,
      clearChat,
      speakText,
      stopSpeaking
    }}>
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => useContext(AIChatContext);
