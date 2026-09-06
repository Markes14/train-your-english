/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Sliders,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { Header } from './components/Header';
import { LevelMenu } from './components/LevelMenu';
import { SentenceCard } from './components/SentenceCard';
import { OptionsModal } from './components/OptionsModal';
import { HelpModal } from './components/HelpModal';
import { StudyGuideModal } from './components/StudyGuideModal';
import { AchievementsModal } from './components/AchievementsModal';
import { CEFRLevel, InputMode, UserStats, UserSettings, ThemeId, FontId } from './types';
import { SENTENCE_DATABASE, LEVEL_METADATA } from './data/sentences';
import { THEMES, FONTS } from './data/themes';
import { BADGES } from './data/badges';

const INITIAL_STATS: UserStats = {
  completedCount: 0,
  streak: 0,
  correctFirstTry: 0,
  totalAttempts: 0,
  levelProgress: {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
    C2: 0,
  },
  unlockedBadges: [],
};

const DEFAULT_SETTINGS: UserSettings = {
  timerSecondsPerWord: 0, // Timer disabled by default
  theme: 'sepia', // Standard requested: Warm Espresso (Café Quente)
  font: 'sans',
  soundEnabled: true,
  strictPunctuation: false,
  speechSpeed: 1.0,
};

export default function App() {
  // Screen state: 'menu' (first menu where learner picks level) or 'training'
  const [screen, setScreen] = useState<'menu' | 'training'>('menu');

  // Selected CEFR Level
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>(() => {
    const saved = localStorage.getItem('te_current_level');
    return (saved as CEFRLevel) || 'A1';
  });

  // Current sentence index within the chosen level
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);

  // Input mode: 'click' (words below) or 'type'
  const [inputMode, setInputMode] = useState<InputMode>(() => {
    const saved = localStorage.getItem('te_input_mode');
    return (saved as InputMode) || 'click';
  });

  // User Settings (Timer standard 7s, Colors/Theme: Warm Espresso standard, Fonts, Sound)
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('te_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // Warm Espresso standard requested
          theme: parsed.theme === 'midnight' ? 'sepia' : (parsed.theme || 'sepia'),
          timerSecondsPerWord: parsed.timerSecondsPerWord ?? 0,
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // User stats & persistence
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('te_stats');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  // Modals state
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [studyGuideLevel, setStudyGuideLevel] = useState<CEFRLevel | null>(null);

  // Save changes
  useEffect(() => {
    localStorage.setItem('te_current_level', currentLevel);
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('te_input_mode', inputMode);
  }, [inputMode]);

  useEffect(() => {
    localStorage.setItem('te_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('te_stats', JSON.stringify(stats));
  }, [stats]);

  // Active theme and font config
  const activeTheme = THEMES[settings.theme] || THEMES.midnight;
  const activeFont = FONTS[settings.font] || FONTS.sans;

  // Filter sentences for chosen level
  const levelSentences = useMemo(() => {
    return SENTENCE_DATABASE.filter((item) => item.level === currentLevel);
  }, [currentLevel]);

  // Sentence counts per level
  const sentenceCounts = useMemo(() => {
    const counts: Record<CEFRLevel, number> = {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
      C1: 0,
      C2: 0,
    };
    SENTENCE_DATABASE.forEach((s) => {
      counts[s.level] = (counts[s.level] || 0) + 1;
    });
    return counts;
  }, []);

  // Shuffled Queue State
  const [shuffledQueue, setShuffledQueue] = useState<string[]>([]);
  
  // Create a new shuffled queue for the level
  const generateShuffledQueue = (level: CEFRLevel) => {
    const levelSentenceIds = SENTENCE_DATABASE
      .filter((item) => item.level === level)
      .map((item) => item.id);
    
    // Fisher-Yates shuffle
    for (let i = levelSentenceIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [levelSentenceIds[i], levelSentenceIds[j]] = [levelSentenceIds[j], levelSentenceIds[i]];
    }
    
    return levelSentenceIds;
  };

  const handleStartTraining = () => {
    setShuffledQueue(generateShuffledQueue(currentLevel));
    setSentenceIndex(0);
    setScreen('training');
  };

  const currentSentenceId = shuffledQueue[sentenceIndex] || '';
  const currentSentence = SENTENCE_DATABASE.find((s) => s.id === currentSentenceId) || SENTENCE_DATABASE.filter(s => s.level === currentLevel)[0];

  const handleReturnToMenu = () => {
    setScreen('menu');
  };

  const handleNextSentence = () => {
    if (sentenceIndex < shuffledQueue.length - 1) {
      setSentenceIndex(sentenceIndex + 1);
    } else {
      // Re-shuffle when exhausted
      setShuffledQueue(generateShuffledQueue(currentLevel));
      setSentenceIndex(0);
    }
  };

  const handlePrevSentence = () => {
    if (sentenceIndex > 0) {
      setSentenceIndex(sentenceIndex - 1);
    }
  };

  const handleRandomSentence = () => {
    handleNextSentence(); // In shuffled mode, "next" is already random
  };

  const handleSentenceComplete = (isFirstTryCorrect: boolean) => {
    setStats((prev) => {
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
      let newStreak = prev.streak;

      if (prev.lastActiveDate !== today) {
        if (prev.lastActiveDate) {
          const lastDate = new Date(prev.lastActiveDate);
          const todayDate = new Date(today);
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
      }

      const updatedStats = {
        ...prev,
        completedCount: prev.completedCount + 1,
        streak: newStreak,
        correctFirstTry: prev.correctFirstTry + (isFirstTryCorrect ? 1 : 0),
        totalAttempts: prev.totalAttempts + 1,
        levelProgress: {
          ...prev.levelProgress,
          [currentLevel]: (prev.levelProgress[currentLevel] || 0) + 1,
        },
        lastActiveDate: today,
      };

      const newBadges = BADGES.filter(
        (b) => !(updatedStats.unlockedBadges || []).includes(b.id) && b.condition(updatedStats)
      );

      if (newBadges.length > 0) {
        updatedStats.unlockedBadges = [
          ...(updatedStats.unlockedBadges || []),
          ...newBadges.map((b) => b.id),
        ];
      }

      return updatedStats;
    });
  };

  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${activeTheme.bgClass} ${activeTheme.textPrimaryClass}`}
      style={{ fontFamily: activeFont.fontFamily }}
    >
      {/* Top App Header */}
      <Header
        stats={stats}
        theme={activeTheme}
        font={activeFont}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenOptions={() => setIsOptionsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onReturnToMenu={handleReturnToMenu}
        isTrainingScreen={screen === 'training'}
        currentLevel={currentLevel}
      />

      {/* Main Screen Layout */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center">
        {screen === 'menu' ? (
          /* 1. FIRST MENU: Choose English Level & Choose Mode (Click vs Type) */
          <LevelMenu
            selectedLevel={currentLevel}
            onSelectLevel={setCurrentLevel}
            inputMode={inputMode}
            onChangeInputMode={setInputMode}
            onStartTraining={handleStartTraining}
            onOpenOptions={() => setIsOptionsOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenStudyGuide={(lvl) => setStudyGuideLevel(lvl)}
            settings={settings}
            stats={stats}
            sentenceCounts={sentenceCounts}
          />
        ) : (
          /* 2. TRAINING SCREEN: Only Portuguese sentence shown first, cool chime on correct */
          <div className="w-full flex flex-col items-center animate-in fade-in duration-200">
            {/* Top Level Navigation bar within training */}
            <div className="w-full flex items-center justify-between mb-4 px-1">
              <button
                id="back-to-levels-link"
                type="button"
                onClick={handleReturnToMenu}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${activeTheme.subtleBgClass} ${activeTheme.borderClass} ${activeTheme.textSecondaryClass} hover:${activeTheme.textPrimaryClass}`}
                title="Voltar ao menu para escolher outro nível"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trocar de Nível ({currentLevel})</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="open-options-training-btn"
                  type="button"
                  onClick={() => setIsOptionsOpen(true)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border transition-all ${activeTheme.subtleBgClass} ${activeTheme.borderClass} ${activeTheme.textMutedClass} hover:${activeTheme.textPrimaryClass}`}
                  title="Configurar timer, cores e fonte"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Opções</span>
                  <span className="font-mono text-[11px]">
                    {settings.timerSecondsPerWord === 0 ? 'Off' : `${settings.timerSecondsPerWord}s`}
                  </span>
                </button>
              </div>
            </div>

            {/* Central Writing Card */}
            {currentSentence ? (
              <SentenceCard
                key={currentSentence.id}
                sentence={currentSentence}
                currentIndex={sentenceIndex}
                totalSentencesInLevel={shuffledQueue.length || 1}
                timerSecondsPerWord={settings.timerSecondsPerWord}
                onUpdateTimerSecondsPerWord={(seconds) =>
                  handleUpdateSettings({ timerSecondsPerWord: seconds })
                }
                inputMode={inputMode}
                onChangeInputMode={setInputMode}
                onSentenceComplete={handleSentenceComplete}
                onNextSentence={handleNextSentence}
                onOpenOptions={() => setIsOptionsOpen(true)}
                strictPunctuation={settings.strictPunctuation}
                theme={activeTheme}
                font={activeFont}
                soundEnabled={settings.soundEnabled}
              />
            ) : (
              <div
                className={`p-8 rounded-2xl border text-center ${activeTheme.cardBgClass} ${activeTheme.borderClass}`}
              >
                <p className={activeTheme.textMutedClass}>
                  Nenhuma frase encontrada para este nível.
                </p>
              </div>
            )}

            {/* Bottom Sentence Navigation Controls */}
            <div className="w-full mt-4 flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2">
                <button
                  id="prev-sentence-nav-btn"
                  type="button"
                  onClick={handlePrevSentence}
                  disabled={sentenceIndex === 0}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${activeTheme.subtleBgClass} ${activeTheme.borderClass} ${activeTheme.textSecondaryClass} hover:${activeTheme.textPrimaryClass}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <button
                  id="next-sentence-nav-btn"
                  type="button"
                  onClick={handleNextSentence}
                  disabled={false} // Never disabled, wraps around via reshuffle
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${activeTheme.subtleBgClass} ${activeTheme.borderClass} ${activeTheme.textSecondaryClass} hover:${activeTheme.textPrimaryClass}`}
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id="random-sentence-nav-btn"
                  type="button"
                  onClick={handleRandomSentence}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-medium transition-colors ${activeTheme.subtleBgClass} ${activeTheme.borderClass} ${activeTheme.textMutedClass} hover:${activeTheme.textPrimaryClass}`}
                  title="Avançar aleatoriamente"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Aleatória</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReturnToMenu}
                  className={`text-xs underline hover:no-underline ${activeTheme.textMutedClass} hover:${activeTheme.textPrimaryClass}`}
                >
                  Ver todos os níveis
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`w-full border-t py-4 mt-auto transition-colors duration-300 ${activeTheme.cardBgClass}/60 ${activeTheme.borderClass}`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${activeTheme.textPrimaryClass}`}>
              Train your english
            </span>
            <span className={activeTheme.textMutedClass}>&bull;</span>
            <span className={activeTheme.textMutedClass}>
              Treino de escrita &bull; Tema: {activeTheme.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOptionsOpen(true)}
              className={`hover:underline ${activeTheme.textMutedClass} hover:${activeTheme.textPrimaryClass}`}
            >
              Opções de tempo e cores
            </button>
            <span className={activeTheme.textMutedClass}>&bull;</span>
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className={`hover:underline ${activeTheme.textMutedClass} hover:${activeTheme.textPrimaryClass}`}
            >
              Ajuda
            </button>
          </div>
        </div>
      </footer>

      {/* Options Modal (Custom time - standard 7s, Colors, Fonts) */}
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        theme={activeTheme}
        font={activeFont}
      />

      {/* Achievements Modal */}
      {isAchievementsOpen && (
        <AchievementsModal
          stats={stats}
          theme={activeTheme}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {/* Study Guide Modal */}
      {studyGuideLevel && (
        <StudyGuideModal
          isOpen={true}
          onClose={() => setStudyGuideLevel(null)}
          level={studyGuideLevel}
          settings={settings}
        />
      )}
    </div>
  );
}
