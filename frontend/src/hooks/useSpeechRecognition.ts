import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interface declarations for TypeScript
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isUserStoppingRef = useRef<boolean>(false);

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setError('Voice Coach paling baik digunakan melalui Google Chrome atau Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        startTimeRef.current = Date.now();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcriptPiece + ' ';
          } else {
            currentInterim += transcriptPiece;
          }
        }

        setInterimTranscript(currentInterim);
        if (currentFinal.trim()) {
          setFinalTranscript((prev) => (prev ? `${prev} ${currentFinal}` : currentFinal).trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        const errType = event.error;

        if (errType === 'aborted' && isUserStoppingRef.current) {
          // User manually stopped, ignore error
          return;
        }

        switch (errType) {
          case 'not-allowed':
          case 'permission-denied':
            setError('Izin mikrofon ditolak. Aktifkan izin mikrofon di browser.');
            break;
          case 'audio-capture':
            setError('Mikrofon tidak ditemukan.');
            break;
          case 'no-speech':
            setError('Suara tidak terdeteksi. Silakan coba lagi.');
            break;
          case 'network':
            setError('Pengenalan suara mengalami masalah jaringan.');
            break;
          case 'aborted':
            // Quiet abort
            break;
          default:
            setError(`Terjadi kesalahan pengenalan suara (${errType}).`);
            break;
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (startTimeRef.current) {
          const duration = (Date.now() - startTimeRef.current) / 1000;
          setDurationSeconds(duration);
          startTimeRef.current = null;
        }
        isUserStoppingRef.current = false;
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
      setError('Gagal menginisialisasi Speech Recognition di browser ini.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Voice Coach paling baik digunakan melalui Google Chrome atau Microsoft Edge.');
      return;
    }

    if (isListening) return; // Prevent double trigger

    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
    setDurationSeconds(0);
    isUserStoppingRef.current = false;

    try {
      recognitionRef.current.start();
    } catch {
      // If already started or transitioning
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 100);
      } catch {
        setError('Gagal mengaktifkan mikrofon. Silakan coba lagi.');
      }
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;

    isUserStoppingRef.current = true;
    try {
      recognitionRef.current.stop();
    } catch {
      // Force state sync if stop fails
      setIsListening(false);
    }
  }, [isListening]);

  const resetState = useCallback(() => {
    if (isListening) {
      stopListening();
    }
    setInterimTranscript('');
    setFinalTranscript('');
    setError(null);
    setDurationSeconds(0);
  }, [isListening, stopListening]);

  return {
    isListening,
    interimTranscript,
    finalTranscript,
    error,
    durationSeconds,
    isSupported,
    startListening,
    stopListening,
    resetState
  };
}
