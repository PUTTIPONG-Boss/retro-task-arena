import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "@/components/Navbar";
import PointsAnimation from "@/features/users/components/PointsAnimation";

const AdminLayout = () => {
  return (
    <div className="relative z-10 h-screen flex flex-col bg-background font-pixel">
      <PointsAnimation />
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