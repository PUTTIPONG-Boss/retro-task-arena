import { create } from 'zustand';

interface UiState {
  pointsAnimation: { show: boolean; amount: number };
  showPointsAnimation: (amount: number) => void;
  clearPointsAnimation: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  pointsAnimation: { show: false, amount: 0 },
  showPointsAnimation: (amount) => set({ pointsAnimation: { show: true, amount } }),
  clearPointsAnimation: () => set({ pointsAnimation: { show: false, amount: 0 } }),
}));
