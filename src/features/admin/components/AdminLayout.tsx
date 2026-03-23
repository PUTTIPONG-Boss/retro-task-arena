// src/features/admin/components/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-pixel">
      {/* Sidebar จะอยู่ทางซ้ายเสมอ */}
      <AdminSidebar />

      {/* เนื้อหาฝั่งขวาจะเปลี่ยนไปตาม URL ที่คลิก (ผ่าน <Outlet />) */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;