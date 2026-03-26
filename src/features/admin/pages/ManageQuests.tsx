import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/admin.service";

const ManageQuest = () => {
  const navigate = useNavigate();

  const { data: quests, isLoading } = useQuery({
    queryKey: ["admin", "quests"],
    queryFn: getAllTasks,
  });
  
  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any | null>(null);

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this quest?")) {
      // TODO: API DELETE
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่าง Edit ---
  const openEditModal = (quest: any) => {
    setCurrentEdit(quest);
    setIsEditModalOpen(true);
  };

  // --- ฟังก์ชัน Update (Save) ---
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;
    // TODO: API UPDATE
    setIsEditModalOpen(false);
    setCurrentEdit(null);
  };

  // Helper สำหรับจัดการสีของ Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-900/50 text-green-400 border border-green-800";
      case "bidding": return "bg-blue-900/50 text-blue-400 border border-blue-800";
      case "in-progress": return "bg-yellow-900/50 text-yellow-400 border border-yellow-800";
      case "review": return "bg-purple-900/50 text-purple-400 border border-purple-800";
      case "completed": return "bg-gray-800 text-gray-400 border border-gray-600";
      default: return "bg-gray-800 text-gray-400";
    }
  };

  if (isLoading) return <div className="p-6 font-pixel text-accent">Loading Quests...</div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">📜 Manage Quests</h1>
        <PixelButton 
          variant="gold" 
          size="md" 
          onClick={() => navigate("/create-quest")}>
          Add New Quest
        </PixelButton>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-[#333] text-muted-foreground uppercase text-xs tracking-wider">
              <th className="p-3">ID</th>
              <th className="p-3 w-1/3">Quest Title</th>
              <th className="p-3 text-center">Reward</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!quests || quests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No quests found in the system.
                </td>
              </tr>
            ) : (
              quests.map((quest: any) => (
                <tr key={quest.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-muted-foreground text-xs">{quest.id.substring(0, 8)}...</td>
                  <td className="p-3">
                    <div className="font-medium text-foreground text-sm">{quest.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[300px]">
                      {quest.category}
                    </div>
                  </td>
                  <td className="p-3 text-center text-yellow-400 font-bold text-sm">{quest.rewardPoints} pts</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider ${getStatusColor(quest.status)}`}>
                      {quest.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2 mt-2">
                    <PixelButton
                      onClick={() => openEditModal(quest)}
                      variant="primary"
                      size="sm"
                      className="text-[10px]"
                    >
                      EDIT
                    </PixelButton>
                    <PixelButton
                      onClick={() => handleDelete(quest.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <PixelFrame variant="dark" className="relative p-8 w-full max-w-2xl my-8">
            <h2 className="text-xl text-accent mb-6 pixel-text-shadow text-center">
              Edit Quest Details
            </h2>
            
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Quest Title</label>
                <PixelInput
                  type="text"
                  value={currentEdit.title}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, title: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Category</label>
                  <PixelInput
                    type="text"
                    value={currentEdit.category}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Reward (Points)</label>
                  <PixelInput
                    type="number"
                    value={currentEdit.rewardPoints}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, rewardPoints: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">Status</label>
                  <select
                    value={currentEdit.status}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, status: e.target.value })}
                    className="w-full bg-[#0a0a0a] border-2 border-[#333] p-2 text-foreground focus:border-accent outline-none font-pixel text-sm h-[42px]"
                  >
                    <option value="open">Open</option>
                    <option value="bidding">Bidding</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
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

export default ManageQuest;