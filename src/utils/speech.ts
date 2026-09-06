/**
 * Text to speech helper for English pronunciation training
 */
export function playEnglishAudio(text: string, rate: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = Math.max(0.6, Math.min(1.4, rate));
      utterance.pitch = 1.0;

      // Prefer a natural US or GB English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice =
        voices.find((v) => v.lang === 'en-US' && !v.name.includes('Google') === false) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
}
