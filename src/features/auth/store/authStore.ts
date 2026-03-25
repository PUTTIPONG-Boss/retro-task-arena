import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/features/users/types";
import * as authService from "../services/auth.service";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  loginWithOneID: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  mockLogin: () => Promise<void>;
  mockSeniorLogin: () => Promise<void>;
  mockAdminLogin: () => Promise<void>;

  logout: () => void;
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      loginWithOneID: async () => {
        set({ isLoading: true });
        try {
          const res = await authService.loginWithOneID();
          set({
            user: res.user,
            token: res.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      mockLogin: async () => {
        set({ isLoading: true });
        try {
          const res = await authService.mockLogin();
          set({
            user: res.user,
            token: res.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      mockSeniorLogin: async () => {
        set({ isLoading: true });
        try {
          const res = await authService.mockSeniorLogin();
          set({
            user: res.user,
            token: res.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      mockAdminLogin: async () => {
        set({ isLoading: true });
        try {
          const res = await authService.mockAdminLogin();
          set({
            user: res.user,
            token: res.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await authService.login(email, password);
          localStorage.setItem("auth_token", res.access_token);
          set({
            user: res.user,
            token: res.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        localStorage.removeItem("auth_token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
    }
  )
);
