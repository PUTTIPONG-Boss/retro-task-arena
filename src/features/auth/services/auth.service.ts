// Auth service — isolated API layer for future OneID OAuth integration
// Replace mock implementations with real API calls when backend is ready

import { UserProfile } from "@/features/users/types";
import { mockUser } from "@/data/mockData";
import { mockSenior, mockAdmin } from "@/data/mockData";

export interface OAuthTokenResponse {
  access_token: string;
  user: UserProfile;
}

const MOCK_DELAY = 800;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Initiates OneID OAuth flow.
 * Future: POST /auth/oauth/oneid
 */
export async function loginWithOneID(username: string, password: string): Promise<OAuthTokenResponse> {
  // login → backend sets HttpOnly cookies อัตโนมัติ (access_token, refresh_token)
  await apiClient.post("/user/login", { username, password });

  // ดึงข้อมูล user (cookie ถูกส่งไปอัตโนมัติจาก withCredentials: true)
  const userResponse = await apiClient.get("/user/me");
  const userData = userResponse.data;

  return {
    access_token: "cookie_based", // Placeholder indicate cookie is used
    user: {
      ...mockUser,
      ...userData,
      id: userData.userId || userData.id,
      username: userData.username,
      points: userData.points || 0,
      role: userData.role || "JUNIOR",
      skills: userData.skills ? (typeof userData.skills === 'string' ? userData.skills.split(",") : []) : [],
      questsCompleted: userData.questsCompleted || 0,
      rating: userData.rating || 5.0,
    },
  };
}

/**
 * Real login with email and password.
 */
import { apiClient } from "@/lib/api";

export async function login(email: string, password: string): Promise<OAuthTokenResponse> {
  // backend sets HttpOnly cookies อัตโนมัติ
  await apiClient.post("/user/login", { email, password });

  // ดึงข้อมูล user โดยใช้ cookie (interceptor will handle basic config)
  const userResponse = await apiClient.get("/user/me");

  const userData = userResponse.data;

  return {
    access_token: "cookie_based",
    user: {
      ...mockUser, // Fallback fields
      ...userData,
      id: userData.userId || userData.id,
      username: userData.username,
      points: userData.points || 0,
      role: userData.role || "JUNIOR",
      skills: userData.skills ? (typeof userData.skills === 'string' ? userData.skills.split(",") : []) : [],
      questsCompleted: userData.questsCompleted || 0,
      rating: userData.rating || 5.0,
    },
  };
}

/**
 * Mock login for development purposes.
 */
export async function mockLogin(): Promise<OAuthTokenResponse> {
  await delay(400);
  return {
    access_token: "mock_dev_token_" + Date.now(),
    user: { ...mockUser, role: "employer" }, // Mock as employer for testing
  };
}

/**
 * Fetch or create user after OAuth callback.
 */
export async function fetchOrCreateUser(
  token: string
): Promise<UserProfile> {
  const response = await apiClient.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const userData = response.data;
  return {
    ...mockUser,
    ...userData,
    id: userData.userId || userData.id,
    points: userData.points || 0,
    role: userData.role || "JUNIOR",
    skills: userData.skills ? userData.skills.split(",") : [],
  };
}

/**
 * Logout — clear tokens.
 * Future: POST /auth/logout
 */
export async function logout(): Promise<void> {
  // await delay(200);
}

/**
 * Mock login for Senior role.
 */
export async function mockSeniorLogin(): Promise<OAuthTokenResponse> {
  await delay(400); // ใช้ฟังก์ชัน delay ตัวเดิมของคุณ
  return {
    access_token: "mock_senior_token_" + Date.now(),
    user: mockSenior,
  };
}

/**
 * Mock login for Admin role.
 */
export async function mockAdminLogin(): Promise<OAuthTokenResponse> {
  await delay(400);
  return {
    access_token: "mock_admin_token_" + Date.now(),
    user: mockAdmin,
  };
}