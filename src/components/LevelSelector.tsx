import React from 'react';
import { CEFRLevel } from '../types';
import { LEVEL_METADATA } from '../data/sentences';

interface LevelSelectorProps {
  currentLevel: CEFRLevel;
  onSelectLevel: (level: CEFRLevel) => void;
  sentenceCounts: Record<CEFRLevel, number>;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel,
  sentenceCounts,
}) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div id="level-selector-container" className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Nível CEFR
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            Quadro Europeu Comum
          </span>
        </div>
        <span className="text-xs text-slate-600 font-medium">
          {LEVEL_METADATA[currentLevel].ptName} &bull; {sentenceCounts[currentLevel] || 0} frases
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {levels.map((lvl) => {
          const isSelected = currentLevel === lvl;
          const meta = LEVEL_METADATA[lvl];

          return (
            <button
              key={lvl}
              id={`level-btn-${lvl.toLowerCase()}`}
              type="button"
              onClick={() => onSelectLevel(lvl)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm shadow-slate-900/10'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-base font-extrabold tracking-tight">{lvl}</span>
              <span
                className={`text-[11px] font-medium leading-tight mt-0.5 ${
                  isSelected ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {meta.ptName}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <p className="line-clamp-1 italic">
          <span className="font-semibold text-slate-700 not-italic">Foco do {currentLevel}:</span>{' '}
          {LEVEL_METADATA[currentLevel].descriptionPt}
        </p>
      </div>
    </div>
  );
};
