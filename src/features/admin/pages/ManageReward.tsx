import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/admin.service";

const ManageReward = () => {
  const navigate = useNavigate();
  
  const { data: rewards, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAllProducts,
  });

  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any | null>(null);

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reward item?")) {
      // TODO: API DELETE
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่าง Edit ---
  const openEditModal = (reward: any) => {
    setCurrentEdit(reward);
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

  if (isLoading) return <div className="p-6 font-pixel text-accent">Loading Rewards...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">
          🎁 Manage Rewards
        </h1>
        <PixelButton
          variant="gold"
          size="md"
          onClick={() => navigate("/add-product")}
        >
          Add New Product
        </PixelButton>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล (ใช้ PixelFrame ครอบ) --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#333] text-muted-foreground uppercase text-xs tracking-wider">
              <th className="p-3">ID</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Cost</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!rewards || rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No rewards found in the shop.
                </td>
              </tr>
            ) : (
              rewards.map((reward: any) => (
                <tr
                  key={reward.id}
                  className="border-b border-[#333]/30 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 text-muted-foreground text-xs">{reward.id.substring(0, 8)}...</td>
                  <td className="p-3">
                    <div className="font-medium text-foreground text-sm">
                      {reward.name}
                    </div>
                  </td>
                  <td className="p-3 text-yellow-400 font-bold text-sm">
                    {reward.price} pts
                  </td>
                  <td className="p-3 text-center text-accent text-sm">
                    {reward.stock > 0 ? (
                      reward.stock
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2 mt-2">
                    <PixelButton
                      onClick={() => openEditModal(reward)}
                      variant="primary"
                      size="sm"
                      className="text-[10px]"
                    >
                      EDIT
                    </PixelButton>
                    <PixelButton
                      onClick={() => handleDelete(reward.id)}
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
          <PixelFrame variant="dark" className="relative p-8 w-full max-w-lg">
            <h2 className="text-xl text-accent mb-6 pixel-text-shadow text-center">
              Edit Reward Item
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">
                  Item Name
                </label>
                <PixelInput
                  type="text"
                  value={currentEdit.name}
                  onChange={(e) =>
                    setCurrentEdit({ ...currentEdit, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">
                    Cost (Points)
                  </label>
                  <PixelInput
                    type="number"
                    value={currentEdit.price}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">
                    Stock
                  </label>
                  <PixelInput
                    type="number"
                    value={currentEdit.stock}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        stock: Number(e.target.value),
                      })
                    }
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

export default ManageReward;
