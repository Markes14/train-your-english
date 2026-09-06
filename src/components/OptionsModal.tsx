import React from 'react';
import {
  X,
  Sliders,
  Timer,
  Palette,
  Type,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { UserSettings, ThemeId, FontId } from '../types';
import { THEMES, FONTS } from '../data/themes';
import { soundEffects } from '../utils/audio';

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme];

  const handleTestSound = () => {
    soundEffects.playSuccessSound();
  };

  const timerOptions = [
    { sec: 0, label: 'Sem tempo' },
    { sec: 4, label: '4s (Rápido)' },
    { sec: 5, label: '5s' },
    { sec: 7, label: '7s (Padrão)' },
    { sec: 10, label: '10s' },
    { sec: 15, label: '15s (Relaxado)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="options-modal"
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col ${currentTheme.cardBgClass} ${currentTheme.borderClass}`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${currentTheme.borderClass}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${currentTheme.accentBgClass} ${currentTheme.accentTextClass}`}>
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-bold text-base ${currentTheme.textPrimaryClass}`}>
                Opções &amp; Personalização
              </h3>
              <p className={`text-xs ${currentTheme.textMutedClass}`}>
                Ajuste o cronômetro, cores noturnas e fontes
              </p>
            </div>
          </div>

          <button
            id="close-options-btn"
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass} hover:bg-white/10`}
            title="Fechar opções"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Section 2: Color theme selection (Eye comfort / Night design) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className={`w-4 h-4 ${currentTheme.accentTextClass}`} />
                <span className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  Cores &amp; Conforto Visual Noturno
                </span>
              </div>
              <span className={`text-xs ${currentTheme.textMutedClass}`}>
                Anti-cansaço visual
              </span>
            </div>
            <p className={`text-xs ${currentTheme.textSecondaryClass}`}>
              Paletas desenvolvidas especificamente para não machucar os olhos no escuro.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
                const th = THEMES[themeKey];
                const isSelected = settings.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    id={`theme-select-${themeKey}`}
                    type="button"
                    onClick={() => {
                      onUpdateSettings({ theme: themeKey });
                      if (settings.soundEnabled) soundEffects.playTileClick(650);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? `border-indigo-400/80 ring-1 ring-indigo-400/50 ${th.cardBgClass}`
                        : `${th.subtleBgClass} ${th.borderClass} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1">
                        <span className={`w-3.5 h-3.5 rounded-full ${th.bgClass} border border-white/20`} />
                        <span className={`w-3.5 h-3.5 rounded-full ${th.cardBgClass} border border-white/20`} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${th.textPrimaryClass}`}>
                          {th.name}
                        </div>
                        <div className={`text-[10px] ${th.textMutedClass}`}>
                          {th.namePt}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Typography selection */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className={`w-4 h-4 ${currentTheme.accentTextClass}`} />
                <span className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  Tipografia da Frase
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {(Object.keys(FONTS) as FontId[]).map((fontKey) => {
                const f = FONTS[fontKey];
                const isSelected = settings.font === fontKey;
                return (
                  <button
                    key={fontKey}
                    id={`font-select-${fontKey}`}
                    type="button"
                    onClick={() => {
                      onUpdateSettings({ font: fontKey });
                      if (settings.soundEnabled) soundEffects.playTileClick(580);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `border-indigo-400/80 ring-1 ring-indigo-400/50 ${currentTheme.subtleBgClass}`
                        : `${currentTheme.subtleBgClass} ${currentTheme.borderClass} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div className={`text-xs font-bold mb-0.5 ${currentTheme.textPrimaryClass}`}>
                      {f.name}
                    </div>
                    <div
                      className={`text-xs ${currentTheme.textSecondaryClass} truncate`}
                      style={{ fontFamily: f.fontFamily }}
                    >
                      I write fluent English.
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Sound Feedback Toggle & Test */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className={`w-4 h-4 ${currentTheme.textMutedClass}`} />
                )}
                <span className={`font-semibold ${currentTheme.textPrimaryClass}`}>
                  Som de Acerto &amp; Chime
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSound}
                  className={`text-xs px-2 py-1 rounded-lg border ${currentTheme.borderClass} ${currentTheme.textSecondaryClass} hover:${currentTheme.textPrimaryClass}`}
                  title="Testar o som harmonioso"
                >
                  Ouvir som
                </button>

                <button
                  id="toggle-sound-btn"
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ soundEnabled: !settings.soundEnabled })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
            <p className={`text-xs ${currentTheme.textSecondaryClass}`}>
              Toca um som com harmônicos limpos no momento exato em que a frase estiver 100% correta.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${currentTheme.borderClass} ${currentTheme.subtleBgClass}`}>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({
                timerSecondsPerWord: 7,
                theme: 'sepia',
                font: 'sans',
                soundEnabled: true,
              })
            }
            className={`text-xs flex items-center gap-1.5 ${currentTheme.textMutedClass} hover:${currentTheme.textPrimaryClass} transition-colors`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar padrões (7s / Warm Espresso)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${currentTheme.accentClass}`}
          >
            Salvar &amp; Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
