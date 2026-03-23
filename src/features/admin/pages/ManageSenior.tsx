import React, { useState } from "react";
// เปิดใช้งาน Custom Components ของโปรเจกต์
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";

// 1. กำหนด Type สำหรับข้อมูล Senior
interface SeniorUser {
  id: string;
  username: string;
  email: string;
  level: number;
  status: "Active" | "Suspended" | "Pending";
}

// 2. Mock Data (จำลองข้อมูลจาก Database)
const initialSeniors: SeniorUser[] = [
  { id: "SEN-001", username: "ShadowBlade", email: "shadow@guild.com", level: 45, status: "Active" },
  { id: "SEN-002", username: "IronShield", email: "iron@guild.com", level: 32, status: "Active" },
  { id: "SEN-003", username: "MysticMage", email: "mystic@guild.com", level: 50, status: "Suspended" },
];

const ManageSenior = () => {
  const [seniors, setSeniors] = useState<SeniorUser[]>(initialSeniors);
  
  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<SeniorUser | null>(null);

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this senior?")) {
      // TODO: ใส่โค้ดเรียก API ลบข้อมูลตรงนี้
      setSeniors(seniors.filter((senior) => senior.id !== id));
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่าง Edit ---
  const openEditModal = (senior: SeniorUser) => {
    setCurrentEdit(senior);
    setIsEditModalOpen(true);
  };

  // --- ฟังก์ชัน Update (Save) ---
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;

    // TODO: ใส่โค้ดเรียก API อัปเดตข้อมูลตรงนี้
    setSeniors(
      seniors.map((senior) =>
        senior.id === currentEdit.id ? currentEdit : senior
      )
    );
    setIsEditModalOpen(false);
    setCurrentEdit(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">🛡️ Manage Seniors</h1>
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
            {seniors.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No seniors found in the system.
                </td>
              </tr>
            ) : (
              seniors.map((senior) => (
                <tr key={senior.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-muted-foreground text-sm">{senior.id}</td>
                  <td className="p-3 text-foreground text-sm">{senior.username}</td>
                  <td className="p-3 text-muted-foreground text-sm">{senior.email}</td>
                  <td className="p-3 text-center text-accent text-sm">{senior.level}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase tracking-wider ${
                        senior.status === "Active"
                          ? "bg-green-900/50 text-green-400 border border-green-800"
                          : senior.status === "Suspended"
                          ? "bg-red-900/50 text-red-400 border border-red-800"
                          : "bg-yellow-900/50 text-yellow-400 border border-yellow-800"
                      }`}
                    >
                      {senior.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <PixelButton
                      onClick={() => openEditModal(senior)}
                      variant="primary"
                      size="sm"
                      className="text-[10px]"
                    >
                      EDIT
                    </PixelButton>
                    <PixelButton
                      onClick={() => handleDelete(senior.id)}
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
          
          {/* เปลี่ยนกรอบ Modal เป็น PixelFrame */}
          <PixelFrame variant="dark" className="relative p-8 w-full max-w-md">
            <h2 className="text-xl text-accent mb-6 pixel-text-shadow text-center">
              Edit Senior Profile
            </h2>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Username</label>
                {/* เปลี่ยนเป็น PixelInput */}
                <PixelInput
                  type="text"
                  value={currentEdit.username}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Email</label>
                {/* เปลี่ยนเป็น PixelInput */}
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
                  {/* เปลี่ยนเป็น PixelInput */}
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
                    onChange={(e) => setCurrentEdit({ ...currentEdit, status: e.target.value as SeniorUser["status"] })}
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

export default ManageSenior;