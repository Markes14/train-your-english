import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  ArrowRight,
  Lightbulb,
  MousePointerClick,
  Keyboard,
  Sparkles,
  Shuffle,
  Clock,
} from 'lucide-react';
import {
  SentenceItem,
  InputMode,
  WordTile,
  ValidationResult,
  ThemeConfig,
  FontConfig,
} from '../types';
import { playEnglishAudio } from '../utils/speech';
import { soundEffects } from '../utils/audio';
import {
  extractSentenceWords,
  evaluateSentence,
  shuffleArray,
} from '../utils/textEvaluator';
import { LEVEL_METADATA } from '../data/sentences';

interface SentenceCardProps {
  sentence: SentenceItem;
  currentIndex: number;
  totalSentencesInLevel: number;
  timerSecondsPerWord: number;
  onUpdateTimerSecondsPerWord?: (seconds: number) => void;
  inputMode: InputMode;
  onChangeInputMode: (mode: InputMode) => void;
  onSentenceComplete: (isFirstTryCorrect: boolean) => void;
  onNextSentence: () => void;
  onOpenOptions: () => void;
  strictPunctuation: boolean;
  theme: ThemeConfig;
  font: FontConfig;
  soundEnabled: boolean;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  currentIndex,
  totalSentencesInLevel,
  timerSecondsPerWord,
  onUpdateTimerSecondsPerWord,
  inputMode,
  onChangeInputMode,
  onSentenceComplete,
  onNextSentence,
  onOpenOptions,
  strictPunctuation,
  theme,
  font,
  soundEnabled,
}) => {
  // Expected words
  const expectedWords = extractSentenceWords(sentence.english);
  const wordCount = expectedWords.length;

  // State for typed mode
  const [typedInput, setTypedInput] = useState<string>('');

  // State for clicked word-bank mode
  const [wordBank, setWordBank] = useState<WordTile[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);

  // Exercise states: ONLY Portuguese sentence is shown initially!
  const [showEnglishModel, setShowEnglishModel] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Timer states (No pause button as requested)
  // New mechanic: exactly 7 seconds per word action, not accumulated!
  const TIMER_PER_WORD = 7;
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_PER_WORD);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset state when sentence changes
  useEffect(() => {
    setTypedInput('');
    setValidationResult(null);
    setAttemptCount(0);
    setIsRevealed(false);
    setShowEnglishModel(false); // Strictly hidden at beginning
    setIsTimeUp(false);
    setTimeLeft(TIMER_PER_WORD);

    // Create scrambled word tiles
    const tiles: WordTile[] = expectedWords.map((word, idx) => ({
      id: `word-${idx}-${word}-${Math.random().toString(36).substring(2, 6)}`,
      text: word,
      used: false,
    }));
    setWordBank(shuffleArray(tiles));
    setSelectedWordIds([]);

    if (inputMode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sentence.id]);

  // Timer tick (without pause)
  useEffect(() => {
    // If the timer is disabled in settings, just don't start the interval
    if (isTimeUp || validationResult?.isCorrect) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimeUp(true);
          if (soundEnabled) soundEffects.playErrorSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeUp, validationResult?.isCorrect, soundEnabled]);

  // Current constructed sentence text
  const currentConstructedText =
    inputMode === 'click'
      ? selectedWordIds
          .map((id) => wordBank.find((w) => w.id === id)?.text || '')
          .filter(Boolean)
          .join(' ')
      : typedInput;

  // Handle clicking a word from the bank below
  const handleSelectWordFromBank = (tileId: string) => {
    if (validationResult?.isCorrect) return;
    if (selectedWordIds.includes(tileId)) return;

    if (soundEnabled) {
      soundEffects.playTileClick(480 + (selectedWordIds.length % 5) * 60);
    }

    setSelectedWordIds((prev) => [...prev, tileId]);
    setWordBank((prev) =>
      prev.map((item) => (item.id === tileId ? { ...item, used: true } : item))
    );
  };

  // Handle clicking a selected word to remove it back to the bank
  const handleRemoveSelectedWord = (tileId: string) => {
    if (validationResult?.isCorrect) return;

    if (soundEnabled) {
      soundEffects.playTileClick(400);
    }

    setSelectedWordIds((prev) => prev.filter((id) => id !== tileId));
    setWordBank((prev) =>
      prev.map((item) => (item.id === tileId ? { ...item, used: false } : item))
    );
  };

  // Shuffle remaining bank words
  const handleShuffleBank = () => {
    const unused = wordBank.filter((w) => !w.used);
    const shuffledUnused = shuffleArray(unused);
    setWordBank((prev) => [
      ...prev.filter((w) => w.used),
      ...shuffledUnused,
    ]);
  };

  // Reset/Clear user input (and restart timer)
  const handleClear = () => {
    setTypedInput('');
    setSelectedWordIds([]);
    setWordBank((prev) => prev.map((w) => ({ ...w, used: false })));
    setValidationResult(null);
    setIsTimeUp(false);
    setTimeLeft(TIMER_PER_WORD);
    if (inputMode === 'type' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Audio speech
  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    await playEnglishAudio(sentence.english, 0.95);
    setIsPlayingAudio(false);
  };

  // Check the answer
  const handleCheckAnswer = () => {
    const textToCheck = currentConstructedText.trim();
    const result = evaluateSentence(textToCheck, sentence.english, strictPunctuation);
    setValidationResult(result);
    setAttemptCount((prev) => prev + 1);

    if (result.isCorrect) {
      // COOL SUCCESS SOUND REQUESTED BY USER!
      if (soundEnabled) {
        soundEffects.playSuccessSound();
      }
      onSentenceComplete(attemptCount === 0);
      // Play native English audio for reinforcement
      playEnglishAudio(sentence.english, 0.95);
    } else {
      if (soundEnabled) {
        soundEffects.playErrorSound();
      }
    }
  };

  // Auto-submit if time runs out
  useEffect(() => {
    if (isTimeUp && !validationResult) {
      const textToCheck = currentConstructedText.trim();
      const result = evaluateSentence(textToCheck, sentence.english, strictPunctuation);
      result.isCorrect = false; // Force failure on timeout
      result.messagePt = 'Tempo Esgotado! ' + (textToCheck ? 'Resposta incompleta.' : 'Você não escreveu nada.');
      setValidationResult(result);
      setAttemptCount((prev) => prev + 1);
    }
  }, [isTimeUp, validationResult, currentConstructedText, sentence.english, strictPunctuation]);

  // Keyboard shortcut support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (validationResult?.isCorrect) {
        onNextSentence();
      } else {
        handleCheckAnswer();
      }
    }
  };

  const timerPercentage =
    TIMER_PER_WORD > 0
      ? Math.max(0, Math.min(100, (timeLeft / TIMER_PER_WORD) * 100))
      : 100;
  const isTimerDanger = timeLeft <= 2 ;
  const isTimerWarning = timeLeft <= 4 && !isTimerDanger ;

  return (
    <div
      id="sentence-card"
      className={`w-full rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${theme.cardBgClass} ${theme.borderClass}`}
    >
      {/* Exercise Sub-header */}
      <div
        className={`px-5 sm:px-7 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${theme.subtleBgClass} ${theme.borderClass}`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-xs font-black tracking-tight ${theme.accentClass}`}
          >
            {sentence.level}
          </span>
          <span className={`text-xs font-bold ${theme.textPrimaryClass}`}>
            {LEVEL_METADATA[sentence.level].ptName}
          </span>
          {sentence.category && (
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${theme.borderClass} ${theme.textSecondaryClass}`}
            >
              {sentence.category}
            </span>
          )}
          <span className={`text-xs font-mono ${theme.textMutedClass}`}>
            #{currentIndex + 1} de {totalSentencesInLevel}
          </span>
        </div>

        {/* Action icons & Peek button */}
        <div className="flex items-center gap-2">
          {/* Audio pronunciation helper */}
          <button
            id="speak-audio-btn"
            type="button"
            onClick={handlePlayAudio}
            disabled={isPlayingAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isPlayingAudio
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                : `${theme.subtleBgClass} ${theme.borderClass} ${theme.textSecondaryClass} hover:${theme.textPrimaryClass}`
            }`}
            title="Ouvir pronúncia da frase em inglês"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ouvir inglês</span>
          </button>

          {/* Spy button: ONLY available after at least one mistake as requested */}
          {attemptCount >= 1 && !validationResult?.isCorrect && (
            <button
              id="toggle-model-peek-btn"
              type="button"
              onClick={() => setShowEnglishModel((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all animate-in fade-in ${
                showEnglishModel
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
              }`}
              title={showEnglishModel ? 'Ocultar frase em inglês' : 'Espiar frase em inglês (desbloqueado após erro)'}
            >
              {showEnglishModel ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ocultar Espião</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Opção Espião</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Sentence Prompt Section: ONLY Portuguese sentence shown by default! */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Frase em Português (Brasil):
            </span>
            <span className={`text-[11px] font-mono ${theme.textMutedClass}`}>
              {wordCount} palavras em inglês
            </span>
          </div>

          {/* Main Stimulus: The Portuguese Sentence */}
          <div
            id="portuguese-stimulus-display"
            className={`p-4 rounded-xl border ${theme.subtleBgClass} ${theme.borderClass}`}
          >
            <p
              className={`text-xl sm:text-2xl font-bold leading-relaxed tracking-normal ${theme.textPrimaryClass}`}
              style={{ fontFamily: font.fontFamily }}
            >
              &ldquo;{sentence.portuguese}&rdquo;
            </p>
          </div>

          {/* English Reference (ONLY visible if unlocked by mistake AND clicked) */}
          {showEnglishModel && attemptCount >= 1 && (
            <div className={`mt-3 p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 transition-all animate-in fade-in`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Espião (Frase Objetivo em Inglês):
                </span>
                <span className="text-[11px] text-indigo-300/70 font-mono">
                  {wordCount} palavras
                </span>
              </div>
              <p
                className={`text-base sm:text-lg font-semibold text-white tracking-wide`}
                style={{ fontFamily: font.fontFamily }}
              >
                {sentence.english}
              </p>
            </div>
          )}
        </div>

        {/* Word Timer Status & Interactive Controls (Standard 7s) */}
        <div
          id="word-timer-status"
          className={`mb-5 p-3 rounded-xl border transition-all ${theme.subtleBgClass} ${theme.borderClass}`}
        >
          <div className="flex flex-wrap items-center justify-between text-xs gap-2 mb-1.5">
            {/* Timer badge */}
            <div
              id="cycle-timer-badge-btn"
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all ${
                isTimerDanger
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : isTimerWarning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : `${theme.cardBgClass} ${theme.borderClass} ${theme.textPrimaryClass}`
              }`}
            >
              <Clock
                className={`w-3.5 h-3.5 ${
                  isTimerDanger
                    ? 'text-rose-400 animate-spin'
                    : isTimerWarning
                    ? 'text-amber-400'
                    : 'text-amber-400'
                }`}
              />
              <span className="font-mono font-bold text-sm">
                {`${timeLeft}s restantes`}
              </span>
              {isTimeUp && (
                <span className="text-[11px] px-1.5 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300">
                  Tempo Esgotado!
                </span>
              )}
            </div>
          </div>

          {/* Progress line (No pause) */}
          <div
            className="w-full bg-black/30 h-2 rounded-full overflow-hidden"
          >
              <div
                className={`h-full transition-all duration-300 ${
                  isTimerDanger
                    ? 'bg-rose-500'
                    : isTimerWarning
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
        </div>

        {/* Input Mode Selector: Click Words vs Type Keyboard */}
        <div className="flex items-center justify-between mb-3">
          <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondaryClass}`}>
            Sua escrita em inglês:
          </label>

          <div className={`flex items-center p-1 rounded-xl border ${theme.subtleBgClass} ${theme.borderClass}`}>
            <button
              id="mode-click-btn"
              type="button"
              onClick={() => onChangeInputMode('click')}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                inputMode === 'click'
                  ? `${theme.accentClass} shadow-xs font-bold`
                  : `${theme.textSecondaryClass} hover:${theme.textPrimaryClass}`
              }`}
              title="Montar clicando nas palavras abaixo"
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Clicar Palavras</span>
            </button>

            <button
              id="mode-type-btn"
              type="button"
              onClick={() => onChangeInputMode('type')}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                inputMode === 'type'
                  ? `${theme.accentClass} shadow-xs font-bold`
                  : `${theme.textSecondaryClass} hover:${theme.textPrimaryClass}`
              }`}
              title="Digitar livremente pelo teclado"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Digitar</span>
            </button>
          </div>
        </div>

        {/* Active Writing / Composition Area */}
        <div className="mb-4">
          {inputMode === 'click' ? (
            /* Click Mode Sentence Assembly Line */
            <div
              id="sentence-assembly-area"
              className={`min-h-[72px] w-full p-4 rounded-xl border-2 border-dashed transition-all flex flex-wrap items-center gap-2 ${
                theme.subtleBgClass
              } ${theme.borderClass}`}
            >
              {selectedWordIds.length === 0 ? (
                <span className={`text-xs sm:text-sm italic select-none ${theme.textMutedClass}`}>
                  Clique nas palavras abaixo para construir a frase em inglês nesta ordem...
                </span>
              ) : (
                selectedWordIds.map((tileId) => {
                  const tile = wordBank.find((w) => w.id === tileId);
                  if (!tile) return null;
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => handleRemoveSelectedWord(tile.id)}
                      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border shadow-xs transition-all active:scale-95 ${
                        theme.cardBgClass
                      } ${theme.borderClass} ${theme.textPrimaryClass} hover:border-rose-400 hover:text-rose-300`}
                      style={{ fontFamily: font.fontFamily }}
                      title="Clique para devolver à caixinha"
                    >
                      <span>{tile.text}</span>
                      <span className="text-xs text-white/30 group-hover:text-rose-400">
                        &times;
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            /* Type Mode Input Field */
            <div>
              <input
                ref={inputRef}
                id="sentence-type-input"
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={validationResult?.isCorrect || isTimeUp}
                placeholder="Escreva a frase em inglês aqui (pressione Enter para verificar)..."
                className={`w-full px-4 py-3.5 rounded-xl border-2 text-base sm:text-lg font-medium transition-all focus:outline-hidden ${
                  theme.subtleBgClass
                } ${theme.borderClass} ${theme.textPrimaryClass} placeholder:${theme.textMutedClass} focus:border-indigo-400`}
                style={{ fontFamily: font.fontFamily }}
                autoComplete="off"
                spellCheck="false"
              />
              <div className={`mt-1.5 flex items-center justify-between text-xs px-1 ${theme.textMutedClass}`}>
                <span>Dica: Pressione Enter para validar sua resposta.</span>
                <span>
                  {extractSentenceWords(typedInput).length} / {wordCount} palavras
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Word Bank: The words below to click and create the sentence */}
        {inputMode === 'click' && (
          <div
            id="word-bank-container"
            className={`mb-6 p-4 rounded-xl border ${theme.subtleBgClass} ${theme.borderClass}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondaryClass}`}>
                Palavras abaixo (clique para montar):
              </span>
              <button
                type="button"
                onClick={handleShuffleBank}
                className={`text-xs flex items-center gap-1.5 font-medium transition-colors ${theme.textMutedClass} hover:${theme.textPrimaryClass}`}
                title="Embaralhar palavras restantes"
              >
                <Shuffle className="w-3 h-3" />
                <span>Embaralhar</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {wordBank.map((tile) => {
                return (
                  <button
                    key={tile.id}
                    id={`bank-tile-${tile.id}`}
                    type="button"
                    disabled={tile.used || validationResult?.isCorrect || isTimeUp}
                    onClick={() => handleSelectWordFromBank(tile.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                      tile.used
                        ? 'opacity-20 line-through cursor-not-allowed border-transparent bg-black/20 text-white/30'
                        : `${theme.cardBgClass} ${theme.borderClass} ${theme.textPrimaryClass} hover:border-white/40 hover:scale-102 active:scale-95 shadow-xs cursor-pointer`
                    }`}
                    style={{ fontFamily: font.fontFamily }}
                  >
                    {tile.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Brazilian Learner Tip Callout: Placed BELLOW the place where people write sentences */}
        {sentence.tipForBrazilians && (
          <div
            id="brazilian-learner-tip"
            className={`mb-5 rounded-xl p-3.5 border flex items-start gap-2.5 transition-all ${
              theme.isDark
                ? 'bg-amber-950/25 border-amber-800/40 text-amber-200'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs leading-relaxed">
              <strong className="text-amber-400 font-bold">Dica para Brasileiros: </strong>
              {sentence.tipForBrazilians}
            </div>
          </div>
        )}

        {/* Feedback Section (When Checked) */}
        {validationResult && (
          <div
            id="validation-feedback-card"
            className={`p-4 rounded-xl border mb-5 transition-all duration-300 ${
              validationResult.isCorrect
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              {validationResult.isCorrect ? (
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/30">
                  <Check className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  !
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm leading-tight text-white">
                  {validationResult.messagePt}
                </h4>
                <p className="text-xs opacity-80">
                  Precisão da escrita: {validationResult.scorePercentage}%
                </p>
              </div>
            </div>

            {/* Word-by-word visual breakdown */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="text-xs font-semibold block mb-1.5 opacity-80">
                Análise detalhada de cada palavra:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {validationResult.wordFeedbacks.map((fb, idx) => {
                  let badgeStyle = '';
                  if (fb.status === 'correct') {
                    badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                  } else if (fb.status === 'incorrect') {
                    badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                  } else if (fb.status === 'missing') {
                    badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 border-dashed';
                  } else {
                    badgeStyle = 'bg-white/10 text-white/70 border-white/20';
                  }

                  return (
                    <div
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${badgeStyle}`}
                      style={{ fontFamily: font.fontFamily }}
                    >
                      <span>{fb.word}</span>
                      {fb.status === 'correct' && (
                        <Check className="w-3 h-3 text-emerald-400" />
                      )}
                      {fb.status === 'incorrect' && fb.expectedWord && (
                        <span className="text-[10px] text-rose-400">
                          (esperado: &ldquo;{fb.expectedWord}&rdquo;)
                        </span>
                      )}
                      {fb.status === 'missing' && (
                        <span className="text-[10px] text-amber-400">(faltou)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Revealed answer (if requested) */}
        {isRevealed && !validationResult?.isCorrect && (
          <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-500/15 mb-5 text-xs text-indigo-200">
            <span className="font-bold block mb-1 text-indigo-300">Gabarito Completo:</span>
            <p
              className="text-base font-semibold text-white tracking-wide"
              style={{ fontFamily: font.fontFamily }}
            >
              {sentence.english}
            </p>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              id="clear-input-btn"
              type="button"
              onClick={handleClear}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isTimeUp || (attemptCount > 0 && !validationResult?.isCorrect)
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : `${theme.subtleBgClass} ${theme.borderClass} ${theme.textSecondaryClass} hover:${theme.textPrimaryClass}`
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTimeUp || (attemptCount > 0 && !validationResult?.isCorrect) ? 'Tentar Novamente' : 'Limpar'}</span>
            </button>

            {/* Spy option: ONLY available if player made at least one mistake */}
            {!validationResult?.isCorrect && attemptCount >= 1 && (
              <button
                id="reveal-answer-btn"
                type="button"
                onClick={() => setIsRevealed((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all animate-in fade-in`}
                title="Opção espião desbloqueada após errar a resposta"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isRevealed ? 'Ocultar Espião' : 'Opção Espião (Gabarito)'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!validationResult?.isCorrect ? (
              <button
                id="check-sentence-btn"
                type="button"
                onClick={handleCheckAnswer}
                disabled={currentConstructedText.trim().length === 0 || isTimeUp}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed ${theme.accentClass}`}
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Verificar Resposta</span>
              </button>
            ) : (
              <button
                id="next-sentence-btn"
                type="button"
                onClick={onNextSentence}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-98 animate-bounce-short"
              >
                <span>Próxima Frase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
