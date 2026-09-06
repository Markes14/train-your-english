import React from 'react';
import { X, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CEFRLevel, UserSettings } from '../types';
import { LEVEL_METADATA } from '../data/sentences';
import { THEMES } from '../data/themes';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: CEFRLevel;
  settings: UserSettings;
}

// Hardcoded theory and vocabulary specific to each level
const STUDY_CONTENT: Record<CEFRLevel, { theory: string[]; grammar: string[]; vocabulary: string[] }> = {
  A1: {
    theory: [
      'Estrutura básica de frases afirmativas: Sujeito + Verbo + Objeto (I drink water).',
      'Uso dos artigos definidos e indefinidos (the, a, an).',
      'Plural de substantivos regulares (adicionando -s ou -es).',
    ],
    grammar: [
      'Verbo To Be (am, is, are) no presente.',
      'Pronomes pessoais (I, you, he, she, it, we, they) e pronomes possessivos (my, your).',
      'Simple Present (adicionando "s" na terceira pessoa: he likes, she wants).',
    ],
    vocabulary: [
      'Saudações: Hello, Good morning, How are you?',
      'Dias e Meses: Monday, Friday, January, May.',
      'Cores e Números: Red, Blue, One, Ten, Twenty.',
      'Família e Pessoas: Mother, Father, Brother, Friend.',
    ],
  },
  A2: {
    theory: [
      'Uso de preposições de tempo (in, on, at).',
      'Quantificadores básicos: some, any, much, many, a lot of.',
      'Adjetivos comparativos regulares (taller, shorter) e irregulares (better, worse).',
    ],
    grammar: [
      'Simple Past (verbos regulares terminando em -ed e os verbos irregulares mais comuns).',
      'Past Continuous (was/were + verbo-ing).',
      'Futuro com "going to" para planos e "will" para decisões espontâneas.',
    ],
    vocabulary: [
      'Rotina diária: wake up, go to work, have dinner.',
      'Viagem e Transporte: airport, ticket, flight, bus stop.',
      'Lazer e Hobbies: watch a movie, play sports, read a book.',
      'Comida e Restaurante: order, waiter, menu, delicious.',
    ],
  },
  B1: {
    theory: [
      'Uso e diferença entre Simple Past e Present Perfect.',
      'Formação de frases condicionais (Zero e First Conditional).',
      'Expressar obrigação, proibição e conselho.',
    ],
    grammar: [
      'Present Perfect (have/has + particípio: I have seen that movie).',
      'Verbos Modais: must, can, should, might, have to.',
      'Gerúndio vs Infinitivo após certos verbos (enjoy doing, want to do).',
    ],
    vocabulary: [
      'Emoções e Sentimentos: excited, disappointed, confused, proud.',
      'Trabalho e Profissões: interview, colleague, meeting, salary.',
      'Tecnologia e Mídia: download, software, social network, upload.',
      'Opiniões: I think that, In my opinion, I agree with you.',
    ],
  },
  B2: {
    theory: [
      'Estruturas condicionais complexas (Second e Third Conditional).',
      'Voz Passiva em diferentes tempos verbais (The book was written by...).',
      'Uso de discursos indiretos (Reported Speech: He said that he was...).',
    ],
    grammar: [
      'Past Perfect (had + particípio).',
      'Relative Clauses (who, which, that, whose).',
      'Uso avançado de Modais de dedução (must have done, might have been).',
    ],
    vocabulary: [
      'Negócios e Economia: investment, profit, negotiation, strategy.',
      'Educação e Sociedade: poverty, globalization, scholarship, degree.',
      'Meio Ambiente: climate change, pollution, renewable energy.',
      'Idiomas e Expressões (Idioms): piece of cake, under the weather, bite the bullet.',
    ],
  },
  C1: {
    theory: [
      'Inversão para ênfase (Not only did he win, but he also broke the record).',
      'Estruturas mistas de condicionais (Mixed Conditionals).',
      'Cleft sentences para foco (It was John who told me).',
    ],
    grammar: [
      'Future Perfect e Future Continuous.',
      'Participle Clauses para resumir informações (Having finished his work, he left).',
      'Uso sutil de artigos e quantificadores em contextos abstratos.',
    ],
    vocabulary: [
      'Verbos Frasais Avançados (Phrasal Verbs): bring about, come up with, do away with.',
      'Linguagem Acadêmica e Formal: furthermore, nevertheless, subsequently.',
      'Direito e Política: legislation, democracy, jurisdiction, amend.',
      'Artes e Literatura: masterpiece, critique, genre, aesthetic.',
    ],
  },
  C2: {
    theory: [
      'Domínio completo de nuances gramaticais, tons literários e sarcasmo.',
      'Compreensão de referências culturais e coloquialismos altamente regionais.',
      'Estruturação retórica para discursos persuasivos e ensaios acadêmicos complexos.',
    ],
    grammar: [
      'Formas subjuntivas arcaicas e condicionais omitindo o "if" (Had I known...).',
      'Precisão extrema na escolha de tempos verbais para expressar micro-nuances temporais.',
      'Subordinação complexa sem perda de clareza.',
    ],
    vocabulary: [
      'Léxico Literário e Obscuro: ephemeral, ubiquitous, paradigm, idiosyncratic.',
      'Expressões Idiomáticas Complexas: by the skin of one\'s teeth, playing devil\'s advocate.',
      'Gírias contemporâneas e sua evolução morfológica.',
      'Vocabulário Científico e Técnico Específico.',
    ],
  },
};

export const StudyGuideModal: React.FC<StudyGuideModalProps> = ({ isOpen, onClose, level, settings }) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme] || THEMES.sepia;
  const content = STUDY_CONTENT[level];
  const meta = LEVEL_METADATA[level];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl border ${currentTheme.cardBgClass} ${currentTheme.borderClass} ${currentTheme.textPrimaryClass} animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className={`p-5 sm:p-6 flex items-start justify-between border-b ${currentTheme.borderClass} ${currentTheme.subtleBgClass}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-lg text-lg font-black ${currentTheme.accentClass}`}>
                {level}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 opacity-70" />
                Guia de Estudos
              </h2>
            </div>
            <p className={`text-sm ${currentTheme.textMutedClass}`}>
              Conceitos fundamentais para dominar o nível {meta.ptName}.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${currentTheme.textMutedClass} hover:${currentTheme.textPrimaryClass} hover:bg-white/10`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Grammar Section */}
          <section>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${currentTheme.textSecondaryClass}`}>
              <span className={`w-6 h-px ${currentTheme.borderClass}`} />
              Foco Gramatical
              <span className={`flex-1 h-px ${currentTheme.borderClass}`} />
            </h3>
            <ul className="space-y-2.5">
              {content.grammar.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${currentTheme.accentTextClass || 'text-indigo-400'}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Theory Section */}
          <section>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${currentTheme.textSecondaryClass}`}>
              <span className={`w-6 h-px ${currentTheme.borderClass}`} />
              Regras e Teoria
              <span className={`flex-1 h-px ${currentTheme.borderClass}`} />
            </h3>
            <ul className="space-y-2.5">
              {content.theory.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${currentTheme.textMutedClass}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Vocabulary Section */}
          <section>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${currentTheme.textSecondaryClass}`}>
              <span className={`w-6 h-px ${currentTheme.borderClass}`} />
              Vocabulário Geral
              <span className={`flex-1 h-px ${currentTheme.borderClass}`} />
            </h3>
            <div className="grid gap-2">
              {content.vocabulary.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${currentTheme.subtleBgClass} ${currentTheme.borderClass} text-sm leading-relaxed`}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={`p-4 sm:p-5 border-t flex justify-end ${currentTheme.borderClass} ${currentTheme.subtleBgClass}`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${currentTheme.accentClass}`}
          >
            Entendi, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
};
