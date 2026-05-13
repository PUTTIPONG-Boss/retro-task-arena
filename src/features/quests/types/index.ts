export type QuestStatus = "open" | "bidding" | "in-progress" | "review" | "completed";

export interface TeamMember {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Bid {
  id: string;
  taskId: string;
  userId: string;
  username: string;
  githubUrl: string;
  questsCompleted: number;
  rating: number;
  requestedPoints: number;
  estimatedTime: string;
  explanation: string;
  avatarSeed?: number;
  totalPointsEarned?: number;
  bidAmount?: number;
  waitDuration?: string;
  note?: string;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | string;
  teamMembers?: TeamMember[];
  createdAt?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "digital" | "voucher" | "perk";
  icon: string;
  stock: number;
}

export interface SubmitBidPayload {
  user_id: string;
  bid_amount: number;
  wait_duration: string;
  note?: string;
  type: string;
  team_members?: string[];
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
  workType?: string;
  createdAt: string;
}

export interface DistributePointsPayload {
  mode: "AUTO" | "MANUAL";
  allocations?: { user_id: string; point: number }[];
}

export interface CreateQuestPayload {
  title: string;
  description: string;
  point: number;
  estimated_time: string;
  type: string;
  skills: string;
  difficulty: string;
  work_type: string;
  git_repo_url?: string;
  req_branch_name?: string;
}
