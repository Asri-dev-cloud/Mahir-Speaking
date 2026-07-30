import { useState, useEffect, useRef, useCallback } from 'react';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((
    text: string,
    lang: 'en-US' | 'id-ID' = 'en-US',
    onEndCallback?: () => void
  ) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (!text.trim()) return;

    // Cancel active playback
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    if (lang === 'id-ID') {
      const idVoices = voices.filter(v => v.lang.includes('id-ID') || v.lang.includes('id_ID') || v.lang.startsWith('id'));
      if (idVoices.length > 0) {
        const preferred = idVoices.find(v => v.name.includes('Google') || v.name.includes('Indonesian') || v.name.includes('Gadis')) || idVoices[0];
        utterance.voice = preferred;
      }
    } else {
      const enVoices = voices.filter(v => v.lang.includes('en-US') || v.lang.includes('en_US') || v.lang.startsWith('en'));
      if (enVoices.length > 0) {
        const preferred = enVoices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen')) || enVoices[0];
        utterance.voice = preferred;
      }
    }

    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      currentUtteranceRef.current = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      currentUtteranceRef.current = null;
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      currentUtteranceRef.current = null;
    }
  }, []);

  return {
    isPlaying,
    speak,
    stop
  };
}
