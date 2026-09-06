export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ThemeId = 'midnight' | 'sepia' | 'emerald' | 'obsidian' | 'cream';

export type FontId = 'sans' | 'serif' | 'mono' | 'rounded';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  namePt: string;
  bgClass: string;
  cardBgClass: string;
  subtleBgClass: string;
  borderClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  textMutedClass: string;
  accentClass: string;
  accentHoverClass: string;
  accentBgClass: string;
  accentTextClass: string;
  isDark: boolean;
}

export interface FontConfig {
  id: FontId;
  name: string;
  fontFamily: string;
  className: string;
}

export interface SentenceItem {
  id: string;
  english: string;
  portuguese: string;
  level: CEFRLevel;
  tipForBrazilians?: string;
  category?: string;
}

export type InputMode = 'click' | 'type';

export interface UserSettings {
  timerSecondsPerWord: number; // standard default is 7s
  theme: ThemeId;
  font: FontId;
  soundEnabled: boolean;
  strictPunctuation: boolean;
  speechSpeed: number;
}

export interface WordTile {
  id: string;
  text: string;
  used: boolean;
}

export interface ValidationWordFeedback {
  word: string;
  status: 'correct' | 'incorrect' | 'missing' | 'extra';
  expectedWord?: string;
}

export interface ValidationResult {
  isCorrect: boolean;
  scorePercentage: number;
  wordFeedbacks: ValidationWordFeedback[];
  messagePt: string;
  messageEn: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  completedCount: number;
  streak: number; // Represents daily streak
  correctFirstTry: number;
  totalAttempts: number;
  levelProgress: Record<CEFRLevel, number>;
  lastActiveDate?: string;
  unlockedBadges: string[];
}
