import { apiClient } from "@/lib/api";
import { UserProfile } from "@/features/users/types";

// Note: Backend /v1/user returns []*domain.User
// We might need to map it to UserProfile or a specific admin type

export async function getAllUsers(): Promise<UserProfile[]> {
  const response = await apiClient.get("/user");
  // Backend might return array directly or wrapped in { data: [...] }
  const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

  // Map backend domain.User to frontend UserProfile
  return data.map((u: any) => ({
    id: u.userId || u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    points: u.points || 0,
    questsCompleted: u.questsCompleted || 0,
    rating: u.rating || 5.0,
    skills: u.skills ? u.skills.split(",") : [],
    github: u.github,
    linkin: u.linkin,
    firstNameTh: u.firstNameTh,
    lastNameTh: u.lastNameTh,
    firstNameEn: u.firstNameEn,
    lastNameEn: u.lastNameEn,
  }));
}

export async function getAllTasks() {
  const response = await apiClient.get("/tasks");
  return Array.isArray(response.data) ? response.data : (response.data.data || []);
}

export async function getAllProducts() {
  const response = await apiClient.get("/product");
  return Array.isArray(response.data) ? response.data : (response.data.data || []);
}
