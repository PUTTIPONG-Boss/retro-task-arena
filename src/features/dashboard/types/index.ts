export interface DashboardTask {
  id: string;
  title: string;
  description: string;
  point: number;
  estimatedTime: string;
  type: string;
  workType: "INDIVIDUAL" | "TEAM";
  skills: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "REVIEW";
  ownerId: string;
  ownerName: string;
  assigneeId?: string;
  gitRepoUrl: string;
  createdAt: string;
}

export interface DashboardData {
  // Common across all roles
  completedTasksCount: number;
  inProgressTasksCount: number;
  level: number;
  rating: number;
  role: "ADMIN" | "JUNIOR" | "SENIOR";
  tasks: DashboardTask[];
  totalExp: number;
  totalRatings: number;

  // JUNIOR / SENIOR / ADMIN
  pointBalance?: number;

  // ADMIN / SENIOR only
  openTasksCount?: number;

  // ADMIN only
  limit?: number;
  offset?: number;
  totalTasksCount?: number;
  totalUsersCount?: number;
}