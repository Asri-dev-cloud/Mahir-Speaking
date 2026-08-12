import React, { createContext, useContext, useState, useEffect } from 'react';
import { aiService } from '../services/api';
import { useAuth } from './AuthContext';

// Konteks Obrolan AI (AIChatContext): Mengelola status percakapan dengan asisten AI, termasuk riwayat pesan, mode belajar aktif, dan pemutaran suara.
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
  const [activeMode, setActiveMode] = useState('general'); // Mengatur mode aktif (general, grammar, speaking, vocab, translator)
  const [isTyping, setIsTyping] = useState(false);
  const [limitWarning, setLimitWarning] = useState(null);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  // Mengambil riwayat percakapan dari server ketika pengguna sudah berhasil login.
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

  // Mengirimkan pesan baru pengguna ke asisten AI.
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
        // Memutar otomatis balasan suara dari AI jika sedang berada di mode latihan berbicara (speaking).
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
            content: `Akses sementara terganggu. Tetap semangat berlatih dan terus asah pelafalan Anda untuk kalimat "${text}".`
          }
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Mengosongkan riwayat percakapan secara lokal dan di sisi server.
  const clearChat = async () => {
    try {
      await aiService.clearHistory();
    } catch (e) {}
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        mode: 'general',
        content: `Sesi latihan baru telah disiapkan. Silakan memilih salah satu menu di atas untuk mulai berlatih.`
      }
    ]);
  };

  // Fitur Web Speech API: Membacakan teks tanggapan AI menggunakan aksen penutur asli (native speaker).
  const speakText = (text, messageId = null) => {
    if (!('speechSynthesis' in window)) {
      alert('Fitur pemutar suara tidak didukung pada browser ini. Silakan gunakan peramban modern seperti Google Chrome atau Microsoft Edge.');
      return;
    }

    window.speechSynthesis.cancel(); // Menghentikan pemutaran suara sebelumnya agar tidak tumpang tindih.

    const cleanText = text.replace(/[*_#>`-]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    if (messageId) setSpeakingMessageId(messageId);

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.speak(utterance);
  };

  // Menghentikan pemutaran suara yang sedang berjalan.
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
