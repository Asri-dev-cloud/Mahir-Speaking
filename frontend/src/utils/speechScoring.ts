import { ScoringResult, WordResult } from '../types/voice';

/**
 * Normalizes text for speech comparison:
 * - lowercase
 * - remove punctuation
 * - collapse multiple spaces
 * - trim
 * - split into word array
 */
export function normalizeText(text: string): string[] {
  if (!text) return [];
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned ? cleaned.split(' ') : [];
}

/**
 * Calculates Levenshtein Distance between two strings for fuzzy comparison
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Word-level alignment using LCS and string similarity
 */
export function compareWords(referenceText: string, recognizedText: string): {
  wordResults: WordResult[];
  matchedCount: number;
} {
  const refWords = normalizeText(referenceText);
  const recWords = normalizeText(recognizedText);

  if (refWords.length === 0 && recWords.length === 0) {
    return { wordResults: [], matchedCount: 0 };
  }

  const n = refWords.length;
  const m = recWords.length;

  // DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (refWords[i - 1] === recWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to assemble word results
  let i = n;
  let j = m;
  const alignment: { refIndex?: number; recIndex?: number; type: 'match' | 'mismatch' | 'missing' | 'extra' }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && refWords[i - 1] === recWords[j - 1]) {
      alignment.unshift({ refIndex: i - 1, recIndex: j - 1, type: 'match' });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i - 1][j - 1] >= dp[i - 1][j] && dp[i - 1][j - 1] >= dp[i][j - 1]) {
      // Substitution check
      alignment.unshift({ refIndex: i - 1, recIndex: j - 1, type: 'mismatch' });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i - 1][j] >= dp[i][j - 1])) {
      // Omitted word in reference
      alignment.unshift({ refIndex: i - 1, type: 'missing' });
      i--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] > dp[i - 1][j])) {
      // Extra word spoken by user
      alignment.unshift({ recIndex: j - 1, type: 'extra' });
      j--;
    }
  }

  const wordResults: WordResult[] = [];
  let matchedCount = 0;

  for (const item of alignment) {
    if (item.type === 'match' && item.recIndex !== undefined) {
      wordResults.push({
        word: recWords[item.recIndex],
        status: 'green'
      });
      matchedCount++;
    } else if (item.type === 'mismatch' && item.recIndex !== undefined && item.refIndex !== undefined) {
      // Check distance: if very close, count as partial/mismatch
      const recWord = recWords[item.recIndex];
      const refWord = refWords[item.refIndex];
      const dist = levenshteinDistance(refWord, recWord);

      if (dist <= 1 && refWord.length > 3) {
        // Close enough
        wordResults.push({
          word: recWord,
          status: 'green'
        });
        matchedCount += 0.8;
      } else {
        wordResults.push({
          word: recWord,
          status: 'red',
          expectedWord: refWord
        });
      }
    } else if (item.type === 'missing' && item.refIndex !== undefined) {
      wordResults.push({
        word: refWords[item.refIndex],
        status: 'yellow'
      });
    } else if (item.type === 'extra' && item.recIndex !== undefined) {
      wordResults.push({
        word: recWords[item.recIndex],
        status: 'blue'
      });
    }
  }

  return {
    wordResults,
    matchedCount: Math.min(matchedCount, refWords.length)
  };
}

/**
 * Calculates complete speech score breakdown
 */
export function calculateScores(
  referenceText: string,
  recognizedText: string,
  durationSeconds: number
): ScoringResult {
  const refWords = normalizeText(referenceText);
  const recWords = normalizeText(recognizedText);

  if (refWords.length === 0 || recWords.length === 0) {
    return {
      pronunciationScore: 0,
      completenessScore: 0,
      fluencyScore: 0,
      overallScore: 0,
      wordsPerMinute: 0,
      durationSeconds: Math.max(0, Math.round(durationSeconds)),
      wordResults: [],
      feedback: 'Belum terbaca dengan jelas. Pastikan mikrofon aktif lalu coba kembali.',
      disclaimer: 'Skor ini merupakan perkiraan berdasarkan transkrip browser, bukan penilaian aksen atau fonetik profesional.'
    };
  }

  const { wordResults, matchedCount } = compareWords(referenceText, recognizedText);

  // 1. Pronunciation Estimate (0 - 100)
  // Ratio of correctly pronounced words against recognized words and reference
  const maxWordCount = Math.max(refWords.length, recWords.length);
  const pronunciationRaw = (matchedCount / maxWordCount) * 100;
  const pronunciationScore = Math.min(100, Math.max(0, Math.round(pronunciationRaw)));

  // 2. Completeness (0 - 100)
  // Percentage of reference words spoken
  const completenessRaw = (matchedCount / refWords.length) * 100;
  const completenessScore = Math.min(100, Math.max(0, Math.round(completenessRaw)));

  // 3. Fluency Estimate (0 - 100)
  // Calculate Words Per Minute
  const safeDurationMinutes = Math.max(durationSeconds, 1) / 60;
  const wordsPerMinute = Math.round(recWords.length / safeDurationMinutes);

  let fluencyScore = 80; // default baseline

  // Beginner target pace: 70 - 130 WPM
  if (wordsPerMinute >= 70 && wordsPerMinute <= 130) {
    fluencyScore = 95 - Math.abs(wordsPerMinute - 95) * 0.2;
  } else if (wordsPerMinute < 70) {
    fluencyScore = Math.max(30, 90 - (70 - wordsPerMinute) * 1.2);
  } else {
    // Too fast (>130 WPM)
    fluencyScore = Math.max(40, 90 - (wordsPerMinute - 130) * 0.8);
  }

  // Penalty if duration is extremely short relative to word count or zero
  if (durationSeconds < 0.8) {
    fluencyScore = Math.min(fluencyScore, 40);
  }

  fluencyScore = Math.min(100, Math.max(0, Math.round(fluencyScore)));

  // 4. Overall Score
  // 45% pronunciation estimate, 30% completeness, 25% fluency estimate
  const overallRaw = (pronunciationScore * 0.45) + (completenessScore * 0.30) + (fluencyScore * 0.25);
  const overallScore = Math.min(100, Math.max(0, Math.round(overallRaw)));

  // Feedback mapping
  let feedback = '';
  if (overallScore >= 85) {
    feedback = 'Bagus! Ucapanmu sudah jelas dan lengkap.';
  } else if (overallScore >= 70) {
    feedback = 'Sudah cukup baik. Coba ulangi kata yang masih berbeda.';
  } else if (overallScore >= 50) {
    feedback = 'Terus berlatih. Dengarkan contoh dan ucapkan dengan lebih pelan.';
  } else {
    feedback = 'Belum terbaca dengan jelas. Pastikan mikrofon aktif lalu coba kembali.';
  }

  return {
    pronunciationScore,
    completenessScore,
    fluencyScore,
    overallScore,
    wordsPerMinute,
    durationSeconds: Math.round(durationSeconds),
    wordResults,
    feedback,
    disclaimer: 'Skor ini merupakan perkiraan berdasarkan transkrip browser, bukan penilaian aksen atau fonetik profesional.'
  };
}
