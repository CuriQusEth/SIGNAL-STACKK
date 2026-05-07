import { create } from 'zustand';

export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

interface GameStore {
  gameState: GameState;
  score: number;
  height: number;
  combo: number;
  multiplier: number;
  setGameState: (state: GameState) => void;
  updateStats: (score: number, height: number, combo: number, multiplier: number) => void;
  resetStats: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  score: 0,
  height: 0,
  combo: 0,
  multiplier: 1,
  setGameState: (state) => set({ gameState: state }),
  updateStats: (score, height, combo, multiplier) => set({ score, height, combo, multiplier }),
  resetStats: () => set({ score: 0, height: 0, combo: 0, multiplier: 1 }),
}));
