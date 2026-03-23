import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";

interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "digital" | "voucher" | "perk";
  icon: string;
  stock: number;
}

// 2. Mock Data (ข้อมูลไอเทมของรางวัล)
const initialRewards: RewardItem[] = [
  {
    id: "r1",
    name: "Cloak of Dark Mode",
    description: "Unlock the legendary dark theme for your profile.",
    cost: 500,
    category: "perk",
    icon: "🧥",
    stock: 99,
  },
  {
    id: "r2",
    name: "GitHub Pro Scroll",
    description: "One month of GitHub Pro subscription.",
    cost: 3000,
    category: "voucher",
    icon: "📜",
    stock: 10,
  },
  {
    id: "r3",
    name: "XP Boost Elixir",
    description: "Double quest points for your next 3 completed quests.",
    cost: 1500,
    category: "perk",
    icon: "🧪",
    stock: 25,
  },
];

const ManageReward = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);

  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<RewardItem | null>(null);

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this reward item?")) {
      // TODO: ใส่โค้ดเรียก API ลบข้อมูลตรงนี้
      setRewards(rewards.filter((reward) => reward.id !== id));
    }
  };

  // --- ฟังก์ชันเปิดหน้าต่าง Edit ---
  const openEditModal = (reward: RewardItem) => {
    setCurrentEdit(reward);
    setIsEditModalOpen(true);
  };

  // --- ฟังก์ชัน Update (Save) ---
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEdit) return;

    // TODO: ใส่โค้ดเรียก API อัปเดตข้อมูลตรงนี้
    setRewards(
      rewards.map((reward) =>
        reward.id === currentEdit.id ? currentEdit : reward,
      ),
    );
    setIsEditModalOpen(false);
    setCurrentEdit(null);
  };

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
              <th className="p-3 w-12 text-center">Icon</th>
              <th className="p-3">Item Name</th>
              <th className="p-3">Cost</th>
              <th className="p-3 text-center">Category</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-muted-foreground"
                >
                  No rewards found in the shop.
                </td>
              </tr>
            ) : (
              rewards.map((reward) => (
                <tr
                  key={reward.id}
                  className="border-b border-[#333]/30 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 text-center text-2xl">{reward.icon}</td>
                  <td className="p-3">
                    <div className="font-medium text-foreground text-sm">
                      {reward.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 truncate max-w-[200px]">
                      {reward.description}
                    </div>
                  </td>
                  <td className="p-3 text-yellow-400 font-bold text-sm">
                    {reward.cost} pts
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase tracking-wider ${
                        reward.category === "voucher"
                          ? "bg-purple-900/50 text-purple-400 border border-purple-800"
                          : reward.category === "perk"
                            ? "bg-blue-900/50 text-blue-400 border border-blue-800"
                            : "bg-green-900/50 text-green-400 border border-green-800"
                      }`}
                    >
                      {reward.category}
                    </span>
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
          {/* กรอบ Modal */}
          <PixelFrame variant="dark" className="relative p-8 w-full max-w-lg">
            <h2 className="text-xl text-accent mb-6 pixel-text-shadow text-center">
              Edit Reward Item
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-16">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">
                    Icon
                  </label>
                  <PixelInput
                    type="text"
                    value={currentEdit.icon}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, icon: e.target.value })
                    }
                    className="text-center text-xl"
                    required
                  />
                </div>
                <div className="flex-1">
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
              </div>

              <div>
                <label className="block text-[10px] text-muted-foreground mb-2 uppercase">
                  Description
                </label>
                {/* ถ้ามี PixelTextarea สามารถนำมาใช้แทน input ปกติได้ครับ */}
                <input
                  type="text"
                  value={currentEdit.description}
                  onChange={(e) =>
                    setCurrentEdit({
                      ...currentEdit,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-[#0a0a0a] border-2 border-[#333] p-2 text-foreground focus:border-accent outline-none font-pixel text-sm"
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
                    value={currentEdit.cost}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        cost: Number(e.target.value),
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

                <div className="flex-1">
                  <label className="block text-[10px] text-muted-foreground mb-2 uppercase">
                    Category
                  </label>
                  <select
                    value={currentEdit.category}
                    onChange={(e) =>
                      setCurrentEdit({
                        ...currentEdit,
                        category: e.target.value as RewardItem["category"],
                      })
                    }
                    className="w-full bg-[#0a0a0a] border-2 border-[#333] p-2 text-foreground focus:border-accent outline-none font-pixel text-sm h-[42px]"
                  >
                    <option value="digital">Digital</option>
                    <option value="voucher">Voucher</option>
                    <option value="perk">Perk</option>
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

export default ManageReward;
