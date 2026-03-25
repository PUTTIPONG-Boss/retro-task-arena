import React, { useState } from "react";
// เปิดใช้งาน Custom Components ของโปรเจกต์
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";

// 1. กำหนด Type สำหรับข้อมูล Junior
interface JuniorUser {
  id: string;
  username: string;
  email: string;
  level: number;
  status: "Active" | "Suspended" | "Pending";
}

// 2. Mock Data (จำลองข้อมูลจาก Database สำหรับ Junior)
const initialJuniors: JuniorUser[] = [
  { id: "JUN-001", username: "CodeNovice", email: "novice@guild.com", level: 5, status: "Active" },
  { id: "JUN-002", username: "PixelApprentice", email: "apprentice@guild.com", level: 8, status: "Active" },
  { id: "JUN-003", username: "BugHunter_99", email: "bughunter@guild.com", level: 2, status: "Pending" },
];

const ManageJunior = () => {
  const [juniors, setJuniors] = useState<JuniorUser[]>(initialJuniors);
  
  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<JuniorUser | null>(null);

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this junior?")) {
      // TODO: ใส่โค้ดเรียก API ลบข้อมูลตรงนี้
      setJuniors(juniors.filter((junior) => junior.id !== id));
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่าง Edit ---
  const openEditModal = (junior: JuniorUser) => {
    setCurrentEdit(junior);
    setIsEditModalOpen(true);
  };

  // --- ฟังก์ชัน Update (Save) ---
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;

    // TODO: ใส่โค้ดเรียก API อัปเดตข้อมูลตรงนี้
    setJuniors(
      juniors.map((junior) =>
        junior.id === currentEdit.id ? currentEdit : junior
      )
    );
    setIsEditModalOpen(false);
    setCurrentEdit(null);
  };

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
              <th className="p-3 text-center">Level</th>
              <th className="p-3 text-center">Status</th>
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
                  <td className="p-3 text-muted-foreground text-sm">{junior.id}</td>
                  <td className="p-3 text-foreground text-sm">{junior.username}</td>
                  <td className="p-3 text-muted-foreground text-sm">{junior.email}</td>
                  <td className="p-3 text-center text-accent text-sm">{junior.level}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase tracking-wider ${
                        junior.status === "Active"
                          ? "bg-green-900/50 text-green-400 border border-green-800"
                          : junior.status === "Suspended"
                          ? "bg-red-900/50 text-red-400 border border-red-800"
                          : "bg-yellow-900/50 text-yellow-400 border border-yellow-800"
                      }`}
                    >
                      {junior.status}
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
          
          {/* กรอบ Modal */}
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
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Level</label>
                  <PixelInput
                    type="number"
                    value={currentEdit.level}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, level: Number(e.target.value) })}
                    required
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Status</label>
                  <select
                    value={currentEdit.status}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, status: e.target.value as JuniorUser["status"] })}
                    className="w-full bg-[#0a0a0a] border-2 border-[#333] p-2 text-foreground focus:border-accent outline-none font-pixel text-sm h-[42px]"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
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