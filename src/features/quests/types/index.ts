export type QuestStatus = "open" | "bidding" | "in-progress" | "review" | "completed";

export interface Bid {
  id: string;
  oderId: string;
  userId: string;
  username: string;
  githubUrl: string;
  questsCompleted: number;
  rating: number;
  requestedPoints: number;
  estimatedTime: string;
  explanation: string;
  avatarSeed: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  rewardPoints: number;
  difficulty: number; // 1-5
  estimatedTime: string;
  category: string;
  status: QuestStatus;
  providerId: string;
  providerName: string;
  repoUrl?: string;
  branchName?: string;
  contact?: {
    discord?: string;
    line?: string;
    email?: string;
  };
  bids: Bid[];
  assignedTo?: string;
}
