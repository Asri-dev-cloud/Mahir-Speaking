// Definisi Tipe Chatbot (chat): Menyediakan struktur tipe data untuk status asisten AI, data pesan obrolan, serta struktur permintaan/tanggapan webhook.
export type AssistantMode = 'chat' | 'voice';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface WebhookRequest {
  message: string;
  sessionId: string;
}

export interface WebhookResponse {
  success?: boolean;
  reply?: string;
  botName?: string;
  output?: string;
  message?: string;
}
