import React, { useEffect, useState } from 'react';
import { Timer, Clock, Pause, Play, RotateCcw } from 'lucide-react';

interface WordTimerControlProps {
  secondsPerWord: number;
  onSelectSecondsPerWord: (seconds: number) => void;
  wordCount: number;
  onTimeout: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  resetTrigger: number; // Increment to reset timer
  hasSubmitted: boolean;
}

export const WordTimerControl: React.FC<WordTimerControlProps> = ({
  secondsPerWord,
  onSelectSecondsPerWord,
  wordCount,
  onTimeout,
  isPaused,
  onTogglePause,
  resetTrigger,
  hasSubmitted,
}) => {
  const totalSeconds = secondsPerWord > 0 ? wordCount * secondsPerWord : 0;
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Reset when sentence changes or reset triggered
  useEffect(() => {
    const newTotal = secondsPerWord > 0 ? wordCount * secondsPerWord : 0;
    setTimeLeft(newTotal);
    setIsTimeUp(false);
  }, [secondsPerWord, wordCount, resetTrigger]);

  // Tick interval
  useEffect(() => {
    if (secondsPerWord === 0 || isPaused || hasSubmitted || isTimeUp) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimeUp(true);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsPerWord, isPaused, hasSubmitted, isTimeUp, onTimeout]);

  const percentage = totalSeconds > 0 ? Math.max(0, Math.min(100, (timeLeft / totalSeconds) * 100)) : 100;

  // Visual state
  const isDanger = timeLeft <= 5 && secondsPerWord > 0;
  const isWarning = timeLeft <= 10 && !isDanger && secondsPerWord > 0;

  return (
    <div id="word-timer-control" className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              secondsPerWord === 0
                ? 'bg-slate-200 text-slate-600'
                : isDanger
                ? 'bg-rose-100 text-rose-600 animate-pulse'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">
                Opção de Timer por Palavra
              </span>
              {secondsPerWord > 0 && (
                <span className="text-[11px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                  {secondsPerWord}s/palavra
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {secondsPerWord === 0
                ? 'Sem limite de tempo (pratique no seu ritmo)'
                : `${wordCount} palavras &times; ${secondsPerWord}s = ${totalSeconds}s total`}
            </p>
          </div>
        </div>

        {/* Seconds per word selector pills */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Tempo:</span>
          {[0, 3, 5, 8, 10].map((sec) => (
            <button
              key={sec}
              id={`timer-option-${sec}s`}
              type="button"
              onClick={() => onSelectSecondsPerWord(sec)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                secondsPerWord === sec
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {sec === 0 ? 'Off' : `${sec}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Active Timer Countdown Bar */}
      {secondsPerWord > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span
                className={`font-mono font-bold text-sm ${
                  isDanger ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-800'
                }`}
              >
                {timeLeft}s restantes
              </span>
              {isTimeUp && (
                <span className="text-[11px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-semibold">
                  Tempo Esgotado!
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {!hasSubmitted && !isTimeUp && (
                <button
                  id="timer-pause-resume-btn"
                  type="button"
                  onClick={onTogglePause}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                  title={isPaused ? 'Continuar' : 'Pausar'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              )}
              <button
                id="timer-restart-btn"
                type="button"
                onClick={() => {
                  setTimeLeft(totalSeconds);
                  setIsTimeUp(false);
                }}
                className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isDanger
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
