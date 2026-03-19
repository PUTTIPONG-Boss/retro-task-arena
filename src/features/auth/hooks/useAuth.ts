import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithOneID,
    login,
    mockLogin,
    logout,
  } = useAuthStore();

  return { user, isAuthenticated, isLoading, loginWithOneID, login, mockLogin, logout };
};
