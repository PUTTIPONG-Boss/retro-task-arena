import { apiClient } from "@/lib/api";
import { UserProfile } from "@/features/users/types";

async function withTTFB<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const ttfb = performance.now() - start;
    console.log(`[TTFB] ${label}: ${ttfb.toFixed(2)} ms`);
    return result;
  } catch (err) {
    const ttfb = performance.now() - start;
    console.error(`[TTFB] ${label} (failed): ${ttfb.toFixed(2)} ms`, err);
    throw err;
  }
}

export async function getUsersByRole(role: string): Promise<UserProfile[]> {
  const response = await apiClient.get(`/user/list?role=${role}&t=${Date.now()}`);
  const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
  return data.map((u: any) => ({
    id: u.userId || u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    points: u.points || 0,
    level: u.level || 1,
    totalExp: u.totalExp || 0,
    questsInProgress: u.questsInProgress || 0,
    questsInReview: u.questsInReview || 0,
    questsCompleted: u.questsCompleted || 0,
    rating: u.rating || 5.0,
    skills: u.skills ? u.skills.split(",") : [],
    github: u.github,
    linkin: u.linkin,
    firstNameTh: u.firstNameTh,
    lastNameTh: u.lastNameTh,
    firstNameEn: u.firstNameEn,
    lastNameEn: u.lastNameEn,
    openTasksCount: u.openTasksCount || 0,
    inProgressTasksCount: u.inProgressTasksCount || 0,
    finishedTasksCount: u.finishedTasksCount || 0,
    reviewCount: u.reviewCount || 0,
    postedTasks: u.postedTasks || [],
  }));
}

export async function getAllTasks(page = 1, limit = 20) {
  const response = await apiClient.get(`/tasks?page=${page}&limit=${limit}`);
  return Array.isArray(response.data) ? response.data : (response.data.data || []);
}

export async function getAllProducts(page = 1, limit = 20) {
  const response = await apiClient.get(`/product?page=${page}&limit=${limit}`);
  return Array.isArray(response.data) ? response.data : (response.data.data || []);
}

export async function updateProduct(id: string, payload: any) {
  const response = await apiClient.patch(`/product/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await apiClient.delete(`/product/${id}`);
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

export async function getAllOrders(params: { page?: number; limit?: number; status?: string; search?: string; sort?: string }) {
  const response = await apiClient.get('/admin/orders', { params });
  return response.data as { data: any[]; total: number; page: number; limit: number };
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await apiClient.patch(`/order/${id}`, { status });
}


export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  await apiClient.patch(
    `/user/${userId}/role`,
    { role: newRole }
  );
}