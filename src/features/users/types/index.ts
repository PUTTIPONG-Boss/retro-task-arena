export interface UserProfile {
  id: string;
  username: string;
  title: string;
  level: number;
  points: number;
  questsCompleted: number;
  rating: number;
  totalRatings: number;
  githubUrl: string;
  joinedDate: string;
  role: string;
  skills: string[];
}
