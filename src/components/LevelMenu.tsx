import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MousePointerClick,
  Keyboard,
  Check,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { CEFRLevel, InputMode, UserSettings, UserStats } from '../types';
import { LEVEL_METADATA } from '../data/sentences';
import { THEMES, FONTS } from '../data/themes';
import { soundEffects } from '../utils/audio';

interface LevelMenuProps {
  selectedLevel: CEFRLevel;
  onSelectLevel: (level: CEFRLevel) => void;
  inputMode: InputMode;
  onChangeInputMode: (mode: InputMode) => void;
  onStartTraining: () => void;
  onOpenOptions: () => void;
  onOpenAchievements?: () => void;
  onOpenStudyGuide?: (level: CEFRLevel) => void;
  settings: UserSettings;
  stats: UserStats;
  sentenceCounts: Record<CEFRLevel, number>;
}

export const LevelMenu: React.FC<LevelMenuProps> = ({
  selectedLevel,
  onSelectLevel,
  inputMode,
  onChangeInputMode,
  onStartTraining,
  onOpenOptions,
  onOpenAchievements,
  onOpenStudyGuide,
  settings,
  stats,
  sentenceCounts,
}) => {
  const currentTheme = THEMES[settings.theme];
  const currentFont = FONTS[settings.font];

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleLevelCardClick = (lvl: CEFRLevel) => {
    onSelectLevel(lvl);
    if (settings.soundEnabled) {
      soundEffects.playTileClick(520 + levels.indexOf(lvl) * 60);
    }
  };

  const handleModeSelect = (mode: InputMode) => {
    onChangeInputMode(mode);
    if (settings.soundEnabled) {
      soundEffects.playTileClick(600);
    }
  };

  return (
    <div
      id="first-menu-screen"
      className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in fade-in duration-300 py-2 sm:py-6"
    >
      {/* Top Banner & Quick Options access */}
      <div className="w-full flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${currentTheme.subtleBgClass} ${currentTheme.borderClass} border ${currentTheme.textSecondaryClass}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Foco em falantes de Português (Brasil)</span>
          </div>
        </div>

        {/* Quick Options and Achievements */}
        <div className="flex items-center gap-2">
          {onOpenAchievements && (
            <button
              id="menu-achievements-btn"
              type="button"
              onClick={onOpenAchievements}
              className={`flex items-center justify-center p-2 rounded-xl border transition-all ${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} hover:border-white/20`}
              title="Abrir Conquistas"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}
          <button
            id="menu-options-btn"
            type="button"
            onClick={onOpenOptions}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} hover:border-white/20`}
            title="Abrir opções de tempo, cores e fonte"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Opções</span>
            <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-md ${currentTheme.accentBgClass} ${currentTheme.accentTextClass}`}>
              {settings.timerSecondsPerWord === 0 ? 'Sem timer' : `${settings.timerSecondsPerWord}s`}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Message */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2
          className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${currentTheme.textPrimaryClass}`}
          style={{ fontFamily: currentFont.fontFamily }}
        >
          Escolha o seu nível de inglês
        </h2>
        <p className={`text-sm sm:text-base ${currentTheme.textSecondaryClass} leading-relaxed`}>
          Você receberá uma frase em <strong>português</strong> para formular e escrever em <strong>inglês</strong>.
          Selecione por qual nível deseja começar:
        </p>
      </div>

      {/* Level Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full mb-8">
        {levels.map((lvl) => {
          const meta = LEVEL_METADATA[lvl];
          const isSelected = selectedLevel === lvl;
          const count = sentenceCounts[lvl] || 0;

          return (
            <div
              key={lvl}
              id={`level-card-${lvl.toLowerCase()}`}
              onClick={() => handleLevelCardClick(lvl)}
              className={`group relative p-4.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? `${currentTheme.cardBgClass} border-indigo-500/80 shadow-lg shadow-black/40 ring-2 ring-indigo-500/30 scale-[1.02]`
                  : `${currentTheme.cardBgClass} ${currentTheme.borderClass} opacity-85 hover:opacity-100 hover:border-white/20`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-black tracking-tight px-2.5 py-0.5 rounded-lg ${
                        isSelected
                          ? currentTheme.accentClass
                          : `${currentTheme.subtleBgClass} ${currentTheme.textPrimaryClass}`
                      }`}
                    >
                      {lvl}
                    </span>
                    <span className={`text-xs font-bold ${currentTheme.textPrimaryClass}`}>
                      {meta.ptName}
                    </span>
                  </div>
                </div>

                <p className={`text-xs ${currentTheme.textSecondaryClass} leading-relaxed min-h-[36px]`}>
                  {meta.descriptionPt}
                </p>
              </div>

              <div className={`mt-3 pt-3 border-t ${currentTheme.borderClass} flex items-center justify-between text-[11px]`}>
                <span className={isSelected ? currentTheme.accentTextClass : currentTheme.textMutedClass}>
                  {isSelected ? 'Nível Selecionado' : 'Clique para escolher'}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'border border-white/20 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Study Guide Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent level selection click
                  if (onOpenStudyGuide) onOpenStudyGuide(lvl);
                }}
                className={`mt-2 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold border transition-all hover:scale-102 ${
                  currentTheme.subtleBgClass
                } ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Teoria & Palavras
              </button>
            </div>
          );
        })}
      </div>

      {/* Choose Input Mode before game begins (Requested by user) */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="text-center mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Passo 2: Como você deseja responder?
          </span>
          <p className={`text-xs ${currentTheme.textSecondaryClass} mt-0.5`}>
            Escolha se prefere clicar nas palavras ou digitar livremente antes de começar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: Click words */}
          <div
            id="choose-mode-click"
            onClick={() => handleModeSelect('click')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
              inputMode === 'click'
                ? `${currentTheme.cardBgClass} border-amber-500/80 ring-2 ring-amber-500/30 shadow-md scale-[1.01]`
                : `${currentTheme.cardBgClass} ${currentTheme.borderClass} opacity-75 hover:opacity-100 hover:border-white/20`
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                inputMode === 'click'
                  ? `${currentTheme.accentClass}`
                  : `${currentTheme.subtleBgClass} ${currentTheme.textSecondaryClass}`
              }`}
            >
              <MousePointerClick className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${currentTheme.textPrimaryClass}`}>
                  Clicar nas Palavras
                </span>
                {inputMode === 'click' && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className={`text-xs ${currentTheme.textSecondaryClass} mt-1 leading-relaxed`}>
                Monte a frase em ordem clicando nos bloquinhos de palavras organizados abaixo.
              </p>
            </div>
          </div>

          {/* Option 2: Type on keyboard */}
          <div
            id="choose-mode-type"
            onClick={() => handleModeSelect('type')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
              inputMode === 'type'
                ? `${currentTheme.cardBgClass} border-amber-500/80 ring-2 ring-amber-500/30 shadow-md scale-[1.01]`
                : `${currentTheme.cardBgClass} ${currentTheme.borderClass} opacity-75 hover:opacity-100 hover:border-white/20`
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                inputMode === 'type'
                  ? `${currentTheme.accentClass}`
                  : `${currentTheme.subtleBgClass} ${currentTheme.textSecondaryClass}`
              }`}
            >
              <Keyboard className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${currentTheme.textPrimaryClass}`}>
                  Digitar no Teclado
                </span>
                {inputMode === 'type' && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className={`text-xs ${currentTheme.textSecondaryClass} mt-1 leading-relaxed`}>
                Escreva a frase em inglês diretamente digitando no teclado para treinar a ortografia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id="start-training-btn"
          type="button"
          onClick={onStartTraining}
          className={`w-full sm:w-auto min-w-[320px] flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base shadow-xl transition-all duration-200 active:scale-98 ${currentTheme.accentClass}`}
        >
          <span>
            Iniciar Treino ({selectedLevel} &bull; {inputMode === 'click' ? 'Clicar palavras' : 'Digitar'})
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          id="configure-options-btn"
          type="button"
          onClick={onOpenOptions}
          className={`w-full sm:w-auto px-5 py-4 rounded-2xl border text-sm font-semibold transition-all ${currentTheme.subtleBgClass} ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`}
        >
          Ajustar Opções (Tempo, Cor, Fonte)
        </button>
      </div>

    </div>
  );
};
