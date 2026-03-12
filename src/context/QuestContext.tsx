import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Quest, Bid, UserProfile, mockQuests as initialQuests, mockUser as initialUser } from "@/data/mockData";

export type QuestStatus = "open" | "bidding" | "in-progress" | "review" | "completed";

interface QuestContextType {
  quests: Quest[];
  user: UserProfile;
  addQuest: (quest: Quest) => void;
  addBid: (questId: string, bid: Bid) => void;
  acceptBidder: (questId: string, userId: string) => void;
  submitForReview: (questId: string) => void;
  approveQuest: (questId: string) => void;
  requestChanges: (questId: string) => void;
  pointsAnimation: { show: boolean; amount: number };
  clearPointsAnimation: () => void;
}

const QuestContext = createContext<QuestContextType | null>(null);

export const useQuestContext = () => {
  const ctx = useContext(QuestContext);
  if (!ctx) throw new Error("useQuestContext must be used within QuestProvider");
  return ctx;
};

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [pointsAnimation, setPointsAnimation] = useState({ show: false, amount: 0 });

  const addQuest = useCallback((quest: Quest) => {
    setQuests((prev) => [quest, ...prev]);
  }, []);

  const addBid = useCallback((questId: string, bid: Bid) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, bids: [...q.bids, bid], status: "open" as const }
          : q
      )
    );
  }, []);

  const acceptBidder = useCallback((questId: string, userId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: "in-progress" as const, assignedTo: userId }
          : q
      )
    );
  }, []);

  const submitForReview = useCallback((questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: "review" as const } : q
      )
    );
  }, []);

  const approveQuest = useCallback((questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const reward = quest.rewardPoints;

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: "completed" as const } : q
      )
    );

    setUser((prev) => ({
      ...prev,
      points: prev.points + reward,
      questsCompleted: prev.questsCompleted + 1,
    }));

    setPointsAnimation({ show: true, amount: reward });
  }, [quests]);

  const requestChanges = useCallback((questId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId ? { ...q, status: "in-progress" as const } : q
      )
    );
  }, []);

  const clearPointsAnimation = useCallback(() => {
    setPointsAnimation({ show: false, amount: 0 });
  }, []);

  return (
    <QuestContext.Provider
      value={{
        quests,
        user,
        addQuest,
        addBid,
        acceptBidder,
        submitForReview,
        approveQuest,
        requestChanges,
        pointsAnimation,
        clearPointsAnimation,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
