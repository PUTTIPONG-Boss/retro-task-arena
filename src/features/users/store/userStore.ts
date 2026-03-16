import { create } from 'zustand';
import { UserProfile } from '../types';
import { mockUser } from '@/data/mockData';

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUserStats: (addedPoints: number, newRating: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: mockUser, // Initialize with mock user for now
  setUser: (user) => set({ user }),
  updateUserStats: (addedPoints, newRating) => set((state) => {
    if (!state.user) return state;
    return {
      user: {
        ...state.user,
        points: state.user.points + addedPoints,
        questsCompleted: state.user.questsCompleted + 1,
        rating: newRating,
        totalRatings: state.user.totalRatings + 1
      }
    };
  })
}));
