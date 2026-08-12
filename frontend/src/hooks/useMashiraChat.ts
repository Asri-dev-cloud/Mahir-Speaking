import { useState, useEffect, useCallback } from 'react';
import { ChatMessageItem } from '../types/chat';
import { sendChatMessageToWebhook } from '../services/mashiraWebhook';

const STORAGE_CHAT_KEY = 'mashira_chat_history';
const STORAGE_SESSION_KEY = 'mashira_session_id';
const MAX_MESSAGES = 100;

// Hook useMashiraChat: Mengelola riwayat percakapan dengan asisten Mashira AI, termasuk sinkronisasi data lokal (localStorage) dan komunikasi ke webhook asisten.
export function useMashiraChat() {
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(-MAX_MESSAGES);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [sessionId, setSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) return saved;
      const newId = crypto.randomUUID();
      localStorage.setItem(STORAGE_SESSION_KEY, newId);
      return newId;
    } catch {
      return crypto.randomUUID();
    }
  });

  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  // Menyinkronkan riwayat pesan ke penyimpanan lokal (localStorage) secara otomatis.
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_CHAT_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
      } else {
        localStorage.removeItem(STORAGE_CHAT_KEY);
      }
    } catch {
      // ignore
    }
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    if (trimmed.length > 2000) {
      setError('Pesan terlalu panjang (maksimal 2.000 karakter).');
      return;
    }

    setError(null);
    setLastFailedMessage(null);
    setIsSending(true);

    const userMsg: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };

    setMessages((prev) => [...prev, userMsg].slice(-MAX_MESSAGES));

    try {
      const reply = await sendChatMessageToWebhook(trimmed, sessionId);

      const assistantMsg: ChatMessageItem = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg].slice(-MAX_MESSAGES));
      setIsSending(false);
    } catch (err: unknown) {
      console.error('[useMashiraChat] Error sending message:', err);
      setError('Mashira belum bisa menjawab. Silakan coba lagi.');
      setLastFailedMessage(trimmed);
      setIsSending(false);
    }
  }, [isSending, sessionId]);

  // Mencoba mengirim kembali pesan terakhir yang sempat gagal dikirim.
  const retryLastMessage = useCallback(() => {
    if (lastFailedMessage) {
      sendMessage(lastFailedMessage);
    }
  }, [lastFailedMessage, sendMessage]);

  // Memulai percakapan baru dengan membersihkan riwayat lama dan menghasilkan ID sesi baru.
  const startNewConversation = useCallback(() => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, newId);
      localStorage.removeItem(STORAGE_CHAT_KEY);
    } catch {
      // ignore
    }
    setMessages([]);
    setError(null);
    setLastFailedMessage(null);
  }, []);

  return {
    messages,
    sessionId,
    isSending,
    error,
    lastFailedMessage,
    sendMessage,
    retryLastMessage,
    startNewConversation
  };
}
