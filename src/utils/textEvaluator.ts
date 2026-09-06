import { ValidationResult, ValidationWordFeedback } from '../types';

/**
 * Clean and split a sentence into tokens
 */
export function extractSentenceWords(text: string): string[] {
  if (!text) return [];
  // Split by whitespace
  return text.trim().split(/\s+/).filter(Boolean);
}

/**
 * Remove trailing or leading punctuation for forgiving comparisons
 */
export function cleanWord(word: string): string {
  return word.replace(/^[.,/#!$%^&*;:{}=\-_`~()?"'“”—]+|[.,/#!$%^&*;:{}=\-_`~()?"'“”—]+$/g, '').toLowerCase();
}

/**
 * Evaluate submitted sentence against the expected English sentence
 */
export function evaluateSentence(
  submittedText: string,
  expectedText: string,
  strictPunctuation: boolean = false
): ValidationResult {
  const submittedWords = extractSentenceWords(submittedText);
  const expectedWords = extractSentenceWords(expectedText);

  if (submittedWords.length === 0) {
    return {
      isCorrect: false,
      scorePercentage: 0,
      wordFeedbacks: expectedWords.map((w) => ({
        word: w,
        status: 'missing',
        expectedWord: w,
      })),
      messagePt: 'Por favor, digite ou monte a frase antes de verificar.',
      messageEn: 'Please write or build the sentence before checking.',
    };
  }

  const wordFeedbacks: ValidationWordFeedback[] = [];
  let correctMatches = 0;

  const maxLen = Math.max(submittedWords.length, expectedWords.length);

  for (let i = 0; i < maxLen; i++) {
    const sub = submittedWords[i];
    const exp = expectedWords[i];

    if (!sub && exp) {
      wordFeedbacks.push({
        word: exp,
        status: 'missing',
        expectedWord: exp,
      });
      continue;
    }

    if (sub && !exp) {
      wordFeedbacks.push({
        word: sub,
        status: 'extra',
      });
      continue;
    }

    // Both exist
    const isMatch = strictPunctuation
      ? sub.trim() === exp.trim()
      : cleanWord(sub) === cleanWord(exp);

    if (isMatch) {
      correctMatches++;
      wordFeedbacks.push({
        word: sub,
        status: 'correct',
        expectedWord: exp,
      });
    } else {
      wordFeedbacks.push({
        word: sub,
        status: 'incorrect',
        expectedWord: exp,
      });
    }
  }

  const isExactMatch =
    strictPunctuation
      ? submittedText.trim() === expectedText.trim()
      : submittedWords.length === expectedWords.length &&
        submittedWords.every((w, idx) => cleanWord(w) === cleanWord(expectedWords[idx]));

  const scorePercentage = Math.round((correctMatches / Math.max(1, expectedWords.length)) * 100);

  let messagePt = '';
  let messageEn = '';

  if (isExactMatch) {
    messagePt = 'Excelente! Sua escrita está 100% precisa.';
    messageEn = 'Excellent! Your writing is 100% accurate.';
  } else if (scorePercentage >= 75) {
    messagePt = 'Muito bom! Quase perfeito, confira os pequenos ajustes em destaque.';
    messageEn = 'Very good! Almost perfect, check the highlighted words.';
  } else if (scorePercentage >= 50) {
    messagePt = 'Bom esforço! Reveja a ordem ou a grafia das palavras destacadas.';
    messageEn = 'Good effort! Review the order or spelling of the highlighted words.';
  } else {
    messagePt = 'Continue praticando! Veja a frase correta e tente mais uma vez.';
    messageEn = 'Keep practicing! Review the correct sentence and try again.';
  }

  return {
    isCorrect: isExactMatch,
    scorePercentage,
    wordFeedbacks,
    messagePt,
    messageEn,
  };
}

/**
 * Fisher-Yates shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
