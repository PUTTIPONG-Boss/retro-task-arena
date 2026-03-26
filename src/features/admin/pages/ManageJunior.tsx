import React, { useState } from "react";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/admin.service";

const ManageJunior = () => {
  const { data: allUsers, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  });

  const juniors = allUsers?.filter(u => u.role?.toUpperCase().includes("JUNIOR")) || [];
  
  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any | null>(null);

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this junior?")) {
      // TODO: ใส่โค้ดเรียก API ลบข้อมูลตรงนี้
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่าง Edit ---
  const openEditModal = (junior: any) => {
    setCurrentEdit(junior);
    setIsEditModalOpen(true);
  };

  // --- ฟังก์ชัน Update (Save) ---
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;

    // TODO: ใส่โค้ดเรียก API อัปเดตข้อมูลตรงนี้
    setIsEditModalOpen(false);
    setCurrentEdit(null);
  };

  if (isLoading) return <div className="p-6 font-pixel text-accent">Loading Juniors...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">🛡️ Manage Juniors</h1>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล (ใช้ PixelFrame ครอบ) --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#333] text-muted-foreground uppercase text-xs tracking-wider">
              <th className="p-3">ID</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3 text-center">Quests</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {juniors.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No juniors found in the system.
                </td>
              </tr>
            ) : (
              juniors.map((junior) => (
                <tr key={junior.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-muted-foreground text-sm">{junior.id.substring(0, 8)}...</td>
                  <td className="p-3 text-foreground text-sm">{junior.username}</td>
                  <td className="p-3 text-muted-foreground text-sm">{junior.email}</td>
                  <td className="p-3 text-center text-accent text-sm">{junior.questsCompleted}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 text-[10px] uppercase tracking-wider bg-green-900/50 text-green-400 border border-green-800">
                      {junior.role}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <PixelButton
                      onClick={() => openEditModal(junior)}
                      variant="primary"
                      size="sm"
                      className="text-[10px]"
                    >
                      EDIT
                    </PixelButton>
                    <PixelButton
                      onClick={() => handleDelete(junior.id)}
                      variant="ghost"
                      size="sm"
                      className="text-[10px] text-red-400 hover:text-red-300"
                    >
                      DEL
                    </PixelButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </PixelFrame>

      {/* --- ส่วน Modal สำหรับ Edit ข้อมูล --- */}
      {isEditModalOpen && currentEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <PixelFrame variant="dark" className="relative p-8 w-full max-w-md">
            <h2 className="text-xl text-accent mb-6 pixel-text-shadow text-center">
              Edit Junior Profile
            </h2>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Username</label>
                <PixelInput
                  type="text"
                  value={currentEdit.username}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Email</label>
                <PixelInput
                  type="email"
                  value={currentEdit.email}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, email: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Quests Completed</label>
                  <PixelInput
                    type="number"
                    value={currentEdit.questsCompleted}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, questsCompleted: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#333]/50">
                <PixelButton
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  variant="ghost"
                  size="md"
                  className="text-xs"
                >
                  CANCEL
                </PixelButton>
                <PixelButton
                  type="submit"
                  variant="gold"
                  size="md"
                  className="text-xs"
                >
                  SAVE CHANGES
                </PixelButton>
              </div>
            </form>
          </PixelFrame>
        </div>
      )}
    </div>
  );
};

export default ManageJunior;