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
    user: { ...mockUser },
  };
}

/**
 * Mock login for development purposes.
 */
export async function mockLogin(): Promise<OAuthTokenResponse> {
  await delay(400);
  return {
    access_token: "mock_dev_token_" + Date.now(),
    user: { ...mockUser },
  };
}

/**
 * Fetch or create user after OAuth callback.
 * Future: GET /users/me  or  POST /users (if new)
 */
export async function fetchOrCreateUser(
  _token: string
): Promise<UserProfile> {
  await delay(300);
  return { ...mockUser };
}

/**
 * Logout — clear tokens.
 * Future: POST /auth/logout
 */
export async function logout(): Promise<void> {
  await delay(200);
}
