// Definisi Tipe Latihan Suara (voice): Menyediakan antarmuka tipe data untuk level latihan, hasil skor pengucapan, pencocokan kata, dan riwayat latihan.
export type LevelType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface PracticeItem {
  level: LevelType;
  title: string;
  instruction: string;
  referenceText: string;
  translation: string;
}

export type WordResultStatus = 'green' | 'red' | 'yellow' | 'blue';

export interface WordResult {
  word: string;
  status: WordResultStatus;
  expectedWord?: string;
}

export interface ScoringResult {
  pronunciationScore: number;
  completenessScore: number;
  fluencyScore: number;
  overallScore: number;
  wordsPerMinute: number;
  durationSeconds: number;
  wordResults: WordResult[];
  feedback: string;
  disclaimer: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  level: LevelType;
  referenceText: string;
  recognizedText: string;
  pronunciationScore: number;
  completenessScore: number;
  fluencyScore: number;
  overallScore: number;
  wordsPerMinute: number;
  durationSeconds: number;
  wordResults: WordResult[];
  scoringMethod: 'browser_transcript_estimate';
  isEstimated: true;
  createdAt: string;
}
