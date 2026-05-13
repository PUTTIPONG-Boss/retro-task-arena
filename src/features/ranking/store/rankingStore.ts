import { create } from "zustand";
import { RankingTab } from "../types";

export type SortOption = "exp" | "quests";

interface RankingState {
  activeTab: RankingTab;
  sortBy: SortOption;
  setActiveTab: (tab: RankingTab) => void;
  setSortBy: (option: SortOption) => void;
}

export const useRankingStore = create<RankingState>((set) => ({
  activeTab: "points",
  sortBy: "exp",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSortBy: (option) => set({ sortBy: option }),
}));