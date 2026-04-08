import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "@/components/Navbar";
import { useQueryClient } from "@tanstack/react-query";
import { getUsersByRole } from "../services/admin.service";
import { useOwnerBidNotifications } from "@/hooks/useOwnerBidNotifications";

const STALE_TIME = 5 * 60 * 1_000; // 5 minutes

const AdminLayout = () => {
  const queryClient = useQueryClient();
  useOwnerBidNotifications();

  // Prefetch both lists the moment admin enters the panel.
  // By the time user clicks "Manage Juniors" / "Manage Seniors",
  // the data is already in cache → instant render.
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["admin", "users", "junior"],
      queryFn: () => getUsersByRole("JUNIOR"),
      staleTime: STALE_TIME,
    });
    queryClient.prefetchQuery({
      queryKey: ["admin", "users", "senior"],
      queryFn: () => getUsersByRole("SENIOR"),
      staleTime: STALE_TIME,
    });
  }, [queryClient]);

  return (
    <div className="relative z-10 h-screen flex flex-col bg-transparent">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <AdminSidebar />
        
        <main className="flex-1 h-full overflow-y-auto w-full relative z-10 p-6">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;