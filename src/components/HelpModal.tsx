import React from 'react';
import { X, Timer, MousePointerClick, BookOpen, Volume2, Palette } from 'lucide-react';
import { ThemeConfig, FontConfig } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  font: FontConfig;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, theme, font }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div
        id="help-modal"
        className={`rounded-2xl max-w-lg w-full p-6 border shadow-2xl overflow-y-auto max-h-[90vh] ${theme.cardBgClass} ${theme.borderClass}`}
      >
        <div className={`flex items-center justify-between pb-4 border-b ${theme.borderClass}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${theme.accentBgClass} ${theme.accentTextClass}`}>
              ?
            </div>
            <h3
              className={`font-extrabold text-base ${theme.textPrimaryClass}`}
              style={{ fontFamily: font.fontFamily }}
            >
              Guia &bull; Train your english
            </h3>
          </div>
          <button
            id="close-help-modal-btn"
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${theme.textMutedClass} hover:${theme.textPrimaryClass} hover:bg-white/10`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold shrink-0 ${theme.subtleBgClass} ${theme.textPrimaryClass} border ${theme.borderClass}`}>
              1
            </div>
            <div>
              <h4 className={`font-bold mb-0.5 ${theme.textPrimaryClass}`}>Escolha seu nível no menu inicial</h4>
              <p className={theme.textSecondaryClass}>
                O menu inicial permite que você navegue livremente entre os níveis <strong>A1 (Iniciante)</strong> até <strong>C2 (Fluente)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${theme.subtleBgClass} ${theme.textPrimaryClass} border ${theme.borderClass}`}>
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className={`font-bold mb-0.5 ${theme.textPrimaryClass}`}>Apenas a frase em português é exibida</h4>
              <p className={theme.textSecondaryClass}>
                Para garantir um treino real de escrita e formulação mental, a frase em inglês fica oculta. Seu desafio é construir a versão em inglês correta!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${theme.subtleBgClass} ${theme.textPrimaryClass} border ${theme.borderClass}`}>
              <MousePointerClick className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className={`font-bold mb-0.5 ${theme.textPrimaryClass}`}>Palavras abaixo ou digitação</h4>
              <p className={theme.textSecondaryClass}>
                Você pode clicar nas palavras listadas abaixo para montar a frase em ordem, ou alternar para o modo de digitação livre pelo teclado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${theme.subtleBgClass} ${theme.textPrimaryClass} border ${theme.borderClass}`}>
              <Timer className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className={`font-bold mb-0.5 ${theme.textPrimaryClass}`}>Timer em Opções (Padrão: 7s)</h4>
              <p className={theme.textSecondaryClass}>
                O tempo padrão é de <strong>7 segundos por palavra</strong>. Para mudar ou desativar o tempo, abra a janela de <strong>Opções</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${theme.subtleBgClass} ${theme.textPrimaryClass} border ${theme.borderClass}`}>
              <Palette className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className={`font-bold mb-0.5 ${theme.textPrimaryClass}`}>Personalização &amp; Descanso Noturno</h4>
              <p className={theme.textSecondaryClass}>
                Em <strong>Opções</strong>, você pode escolher diferentes temas noturnos suaves (Midnight Slate, Café Quente, Floresta Esmeralda, Obsidian) e tipos de fonte.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${theme.subtleBgClass} ${theme.textPrimaryClass} border ${theme.borderClass}`}>
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className={`font-bold mb-0.5 ${theme.textPrimaryClass}`}>Som de Acerto</h4>
              <p className={theme.textSecondaryClass}>
                Ao acertar a frase completa, um efeito sonoro harmonioso celebra o seu progresso.
              </p>
            </div>
          </div>
        </div>

        <div className={`pt-4 border-t flex justify-end ${theme.borderClass}`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${theme.accentClass}`}
          >
            Entendido, vamos lá!
          </button>
        </div>
      </div>
    </div>
  );
};
