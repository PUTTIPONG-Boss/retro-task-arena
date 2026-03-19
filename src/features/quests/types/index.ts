export type QuestStatus = "open" | "bidding" | "in-progress" | "review" | "completed";

export interface Bid {
  id: string;
  taskId: string;
  userId: string;
  username: string;
  questsCompleted: number;
  totalPointsEarned: number;
  rating: number;
  bidAmount: number;
  waitDuration: string;
  note: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
}

export interface SubmitBidPayload {
  user_id: string;
  bid_amount: number;
  wait_duration: string;
  note?: string;
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
  skills?: string;
}

export interface CreateQuestPayload {
  employer_id: string;
  title: string;
  description: string;
  point: number;
  estimated_time: string;
  type: string;
  skills: string;
  difficulty: string;
  git_repo_url?: string;
  req_branch_name?: string;
}
