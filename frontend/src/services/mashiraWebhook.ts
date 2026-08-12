// Layanan Webhook Mashira (mashiraWebhook): Menghubungkan aplikasi frontend dengan server asisten chatbot Mashira AI eksternal melalui n8n.
import { WebhookResponse } from '../types/chat';

const WEBHOOK_URL = 'https://n8n-mstcxw5l5v5x.jkt5.sumopod.my.id/webhook/mahir-speaking-chat';
const DEFAULT_TIMEOUT_MS = 30000;

// Fungsi utama untuk mengirim pesan obrolan pengguna ke endpoint webhook asisten Mashira AI secara asinkron.
export async function sendChatMessageToWebhook(
  message: string,
  sessionId: string,
  externalSignal?: AbortSignal
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // Menggabungkan sinyal pembatalan eksternal jika disediakan.
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        sessionId
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[MashiraWebhook Error] HTTP ${response.status} ${response.statusText}`);
      throw new Error('Mashira belum bisa menjawab. Silakan coba lagi.');
    }

    let data: WebhookResponse;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[MashiraWebhook Error] Failed to parse JSON response:', parseError);
      throw new Error('Mashira belum bisa menjawab. Silakan coba lagi.');
    }

    if (data.success === false) {
      console.error('[MashiraWebhook Error] Webhook explicitly returned success: false', data);
      throw new Error('Mashira belum bisa menjawab. Silakan coba lagi.');
    }

    // Mengekstrak balasan teks dari webhook dengan penanganan fallback.
    const replyText = data.reply || data.output || data.message;

    if (!replyText || typeof replyText !== 'string' || !replyText.trim()) {
      console.error('[MashiraWebhook Error] Empty reply received in webhook response:', data);
      throw new Error('Mashira belum bisa menjawab. Silakan coba lagi.');
    }

    return replyText.trim();
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[MashiraWebhook Error] Webhook request timed out after 30 seconds');
      } else {
        console.error('[MashiraWebhook Error]', error.message);
      }
    } else {
      console.error('[MashiraWebhook Error] Unknown network error:', error);
    }

    throw new Error('Mashira belum bisa menjawab. Silakan coba lagi.');
  }
}
