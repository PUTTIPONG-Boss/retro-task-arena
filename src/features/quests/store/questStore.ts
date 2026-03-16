import { create } from 'zustand';
import { Quest, Bid } from '../types';
import { mockQuests } from '@/data/mockData';

interface QuestState {
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  addBid: (questId: string, bid: Bid) => void;
  acceptBidder: (questId: string, userId: string) => void;
  submitForReview: (questId: string) => void;
  approveQuest: (questId: string, rating?: number, feedback?: string) => void;
  requestChanges: (questId: string) => void;
}

export const useQuestStore = create<QuestState>((set) => ({
  quests: mockQuests, // Initialize with mock quests for now
  setQuests: (quests: Quest[]) => set({ quests }),
  addQuest: (quest: Quest) => set((state) => ({ quests: [quest, ...state.quests] })),
  addBid: (questId: string, bid: Bid) => set((state) => ({
    quests: state.quests.map((q) =>
      q.id === questId ? { ...q, bids: [...q.bids, bid], status: "open" } : q
    )
  })),
  acceptBidder: (questId: string, userId: string) => set((state) => ({
    quests: state.quests.map((q) =>
      q.id === questId ? { ...q, status: "in-progress", assignedTo: userId } : q
    )
  })),
  submitForReview: (questId: string) => set((state) => ({
    quests: state.quests.map((q) =>
      q.id === questId ? { ...q, status: "review" } : q
    )
  })),
  approveQuest: (questId: string, rating?: number, feedback?: string) => set((state) => ({
    quests: state.quests.map((q) =>
      q.id === questId ? { ...q, status: "completed" } : q
    )
  })),
  requestChanges: (questId: string) => set((state) => ({
    quests: state.quests.map((q) =>
      q.id === questId ? { ...q, status: "in-progress" } : q
    )
  }))
}));
