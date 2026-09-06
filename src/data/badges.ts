import { Badge, UserStats } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'Primeiros Passos',
    description: 'Completou 10 frases no total.',
    icon: '🎯',
    condition: (stats: UserStats) => stats.completedCount >= 10,
  },
  {
    id: 'century',
    name: 'O Centurião',
    description: 'Completou 100 frases no total.',
    icon: '💯',
    condition: (stats: UserStats) => stats.completedCount >= 100,
  },
  {
    id: 'polyglot',
    name: 'Mestre Poliglota',
    description: 'Completou 1000 frases no total.',
    icon: '👑',
    condition: (stats: UserStats) => stats.completedCount >= 1000,
  },
  {
    id: 'streak_3',
    name: 'Foco Inicial',
    description: 'Atingiu uma ofensiva de 3 dias seguidos.',
    icon: '🔥',
    condition: (stats: UserStats) => stats.streak >= 3,
  },
  {
    id: 'streak_10',
    name: 'Determinação',
    description: 'Atingiu uma ofensiva de 10 dias seguidos.',
    icon: '⚡',
    condition: (stats: UserStats) => stats.streak >= 10,
  },
  {
    id: 'streak_30',
    name: 'Hábito de Ferro',
    description: 'Atingiu uma ofensiva de 30 dias seguidos.',
    icon: '💎',
    condition: (stats: UserStats) => stats.streak >= 30,
  },
  {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Acertou 50 frases de primeira.',
    icon: '✨',
    condition: (stats: UserStats) => stats.correctFirstTry >= 50,
  },
];
