// Auth service — isolated API layer for future OneID OAuth integration
// Replace mock implementations with real API calls when backend is ready

import { UserProfile } from "@/features/users/types";
import { mockUser } from "@/data/mockData";

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
export async function loginWithOneID(): Promise<OAuthTokenResponse> {
  await delay(MOCK_DELAY);

  // Simulate OAuth redirect → callback → token exchange
  return {
    access_token: "mock_access_token_" + Date.now(),
    user: { ...mockUser, role: "adventurer" },
  };
}

/**
 * Real login with email and password.
 */
import { apiClient } from "@/lib/api";

export async function login(email: string, password: string): Promise<OAuthTokenResponse> {
  const response = await apiClient.post("/user/login", { email, password });
  const token = response.data.token;
  
  // After login, fetch user profile using the new /user/me endpoint
  // The token is automatically attached by the interceptor if we wait for the store to update,
  // but here we can pass it manually for the very first call.
  const userResponse = await apiClient.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const userData = userResponse.data;

  return {
    access_token: token,
    user: {
       ...mockUser, // Fallback fields
       ...userData,
       id: userData.userId || userData.id,
       username: userData.username,
       points: userData.points || 0,
       role: userData.role || "adventurer",
       skills: userData.skills ? userData.skills.split(",") : [],
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
    role: userData.role || "adventurer",
    skills: userData.skills ? userData.skills.split(",") : [],
  };
}

/**
 * Logout — clear tokens.
 * Future: POST /auth/logout
 */
export async function logout(): Promise<void> {
  await delay(200);
}
