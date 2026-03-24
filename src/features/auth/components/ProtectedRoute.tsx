import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ReactNode, useEffect } from "react";
import { useGetUnseenPoints, useMarkPointsAsSeen } from "@/features/users/services/point.service";
import { useUiStore } from "@/store/uiStore";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showPointsAnimation = useUiStore((s) => s.showPointsAnimation);

  const { data: unseenData } = useGetUnseenPoints(isAuthenticated);
  const markAsSeen = useMarkPointsAsSeen();

  useEffect(() => {
    if (unseenData?.data?.amount && unseenData.data.amount > 0) {
      showPointsAnimation(unseenData.data.amount);
      markAsSeen.mutate();
    }
  }, [unseenData, showPointsAnimation]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

