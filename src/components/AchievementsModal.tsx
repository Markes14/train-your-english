import React from 'react';
import { X, Trophy, Lock } from 'lucide-react';
import { ThemeConfig, UserStats } from '../types';
import { BADGES } from '../data/badges';

interface AchievementsModalProps {
  stats: UserStats;
  theme: ThemeConfig;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ stats, theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 ${theme.bgClass} ${theme.borderClass} border`}
      >
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${theme.subtleBgClass} ${theme.borderClass}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.accentClass}`}>
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${theme.textPrimaryClass}`}>
                Conquistas
              </h3>
              <p className={`text-xs ${theme.textSecondaryClass}`}>
                Recompensas pelo seu progresso diário
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${theme.textSecondaryClass}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges List */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = (stats.unlockedBadges || []).includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex gap-3 p-3 rounded-xl border transition-all duration-300 ${
                  isUnlocked
                    ? `${theme.cardBgClass} ${theme.borderClass} shadow-md`
                    : `${theme.subtleBgClass} border-transparent opacity-60 grayscale`
                }`}
              >
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-3xl bg-black/10 dark:bg-white/5 rounded-full">
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold text-sm truncate ${theme.textPrimaryClass}`}>
                      {badge.name}
                    </span>
                    {!isUnlocked && <Lock className={`w-3 h-3 ${theme.textMutedClass}`} />}
                  </div>
                  <span className={`text-xs leading-tight mt-0.5 ${theme.textSecondaryClass}`}>
                    {badge.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className={`px-5 py-4 border-t flex flex-wrap gap-4 items-center justify-between ${theme.subtleBgClass} ${theme.borderClass}`}>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.textMutedClass}`}>Ofensiva</span>
            <span className={`font-mono font-bold text-lg ${theme.textPrimaryClass}`}>{stats.streak} dias</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.textMutedClass}`}>Frases</span>
            <span className={`font-mono font-bold text-lg ${theme.textPrimaryClass}`}>{stats.completedCount}</span>
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.textMutedClass}`}>Desbloqueadas</span>
            <span className={`font-mono font-bold text-lg ${theme.textPrimaryClass}`}>
              {stats.unlockedBadges?.length || 0} / {BADGES.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
