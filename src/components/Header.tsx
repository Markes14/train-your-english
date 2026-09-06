import React from 'react';
import {
  Flame,
  CheckCircle2,
  HelpCircle,
  Sliders,
  ChevronLeft,
  Trophy,
} from 'lucide-react';
import { UserStats, ThemeConfig, FontConfig, CEFRLevel } from '../types';

interface HeaderProps {
  stats: UserStats;
  theme: ThemeConfig;
  font: FontConfig;
  onOpenHelp: () => void;
  onOpenOptions: () => void;
  onOpenAchievements?: () => void;
  onReturnToMenu?: () => void;
  isTrainingScreen?: boolean;
  currentLevel?: CEFRLevel;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  theme,
  font,
  onOpenHelp,
  onOpenOptions,
  onOpenAchievements,
  onReturnToMenu,
  isTrainingScreen,
  currentLevel,
}) => {
  return (
    <header
      id="main-header"
      className={`w-full border-b backdrop-blur-md sticky top-0 z-20 transition-colors duration-300 ${theme.cardBgClass}/95 ${theme.borderClass}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand / Logo + Navigation */}
        <div className="flex items-center gap-3">
          {isTrainingScreen && onReturnToMenu ? (
            <button
              id="back-to-menu-header-btn"
              type="button"
              onClick={onReturnToMenu}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${theme.subtleBgClass} ${theme.borderClass} ${theme.textSecondaryClass} hover:${theme.textPrimaryClass}`}
              title="Voltar ao menu de níveis"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Menu de Níveis</span>
            </button>
          ) : (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black tracking-tight text-sm shadow-md ${theme.accentClass}`}
            >
              TE
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-base sm:text-lg font-black tracking-tight leading-tight ${theme.textPrimaryClass}`}
                style={{ fontFamily: font.fontFamily }}
              >
                Train your english
              </h1>
              {currentLevel && isTrainingScreen && (
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${theme.accentBgClass} ${theme.accentTextClass}`}
                >
                  Nível {currentLevel}
                </span>
              )}
            </div>
            <p className={`text-[11px] ${theme.textMutedClass} leading-none mt-0.5 hidden sm:block`}>
              Escrita em inglês para falantes de português do Brasil
            </p>
          </div>
        </div>

        {/* Live User Metrics & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div
            id="streak-badge"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
              theme.isDark
                ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
            title="Sequência de acertos seguidos"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{stats.streak}</span>
            <span className="hidden md:inline font-normal opacity-80">streak</span>
          </div>

          {/* Completed count */}
          <div
            id="completed-badge"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border ${theme.subtleBgClass} ${theme.borderClass} ${theme.textSecondaryClass}`}
            title="Frases concluídas com sucesso"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{stats.completedCount}</span>
            <span className="hidden md:inline font-normal opacity-80">feitas</span>
          </div>

          {/* Options / Settings button */}
          <button
            id="header-options-btn"
            type="button"
            onClick={onOpenOptions}
            className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all ${theme.subtleBgClass} ${theme.borderClass} ${theme.textSecondaryClass} hover:${theme.textPrimaryClass}`}
            title="Opções de Tempo, Cores e Fonte"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Opções</span>
          </button>

          {/* Achievements button */}
          {onOpenAchievements && (
            <button
              id="header-achievements-btn"
              type="button"
              onClick={onOpenAchievements}
              className={`p-2 rounded-xl border text-xs transition-all ${theme.subtleBgClass} ${theme.borderClass} ${theme.textMutedClass} hover:${theme.textPrimaryClass}`}
              title="Conquistas"
            >
              <Trophy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Help button */}
          <button
            id="header-help-btn"
            type="button"
            onClick={onOpenHelp}
            className={`p-2 rounded-xl border text-xs transition-all ${theme.subtleBgClass} ${theme.borderClass} ${theme.textMutedClass} hover:${theme.textPrimaryClass}`}
            title="Como treinar"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
