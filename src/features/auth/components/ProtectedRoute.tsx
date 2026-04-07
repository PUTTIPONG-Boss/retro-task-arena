import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ReactNode, useEffect } from "react";
import { useGetProfile } from "@/features/users/services/user.service";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // Sync user profile data on mount and whenever it's invalidated
  useGetProfile(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

