import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/admin.service";

const ManageReward = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";
  
  const { data: rewards, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getAllProducts,
  });

  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any | null>(null);

  // Helper สำหรับตัดข้อความที่ยาวเกินไป
  const truncateText = (text: string, length: number = 20) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm(t("admin.rewardspage.alert"))) {
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

  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.rewardspage.loading")}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">
          🎁 {t("admin.rewardspage.title")}
        </h1>
        <PixelButton
          variant="gold"
          size="md"
          className={fontClass}
          onClick={() => navigate("/add-product")}
        >
          {t("admin.rewardspage.add")}
        </PixelButton>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล (ใช้ PixelFrame ครอบ) --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3">{t("admin.rewardspage.id")}</th>
              <th className="p-3">{t("admin.rewardspage.title")}</th>
              <th className="p-3">{t("admin.rewardspage.desc")}</th>
              <th className="p-3 text-center">{t("admin.rewardspage.category")}</th>
              <th className="p-3 text-center">{t("admin.rewardspage.cost")}</th>
              <th className="p-3 text-center">{t("admin.rewardspage.stock")}</th>
              <th className="p-3 text-center">{t("admin.rewardspage.action")}</th>
            </tr>
          </thead>
          <tbody>
            {!rewards || rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-muted-foreground"
                >
                  {t("admin.rewardspage.notfoundquest")}
                </td>
              </tr>
            ) : (
              rewards.map((reward: any) => (
                <tr
                  key={reward.id}
                  className="border-b border-[#333]/30 hover:bg-white/5 transition-colors"
                >
                  <td className={`p-3 text-muted-foreground font-mono text-xs ${fontClass}`}>{reward.sku}</td>
                  <td className="p-3">
                    <div className={`font-medium text-foreground ${fontClass}`}>
                      {reward.name}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={`text-muted-foreground text-xs ${fontClass}`}>
                      {truncateText(reward.description)}
                    </div>
                  </td>
                  <td className={`p-3 text-center text-muted-foreground ${fontClass}`}>{reward.category}</td>
                  <td className={`p-3 text-center text-yellow-400 font-bold ${fontClass}`}>
                    {reward.price} {t("admin.rewardspage.pts")}
                  </td>
                  <td className={`p-3 text-center text-accent ${fontClass}`}>
                    {reward.stock > 0 ? (
                      reward.stock
                    ) : (
                      <span className="text-red-500">{t("admin.rewardspage.stockout")}</span>
                    )}
                  </td>
                  <td className="p-3 flex justify-center gap-2 mt-2">
                    <PixelButton
                      onClick={() => openEditModal(reward)}
                      variant="gold"
                      size="sm"
                      className={fontClass}
                    >
                      {t("admin.rewardspage.edit")}
                    </PixelButton>
                    <PixelButton
                      onClick={() => handleDelete(reward.id)}
                      variant="danger"
                      size="sm"
                      className={`text-white-400 hover:text-white-300 ${fontClass}`}
                    >
                      {t("admin.rewardspage.delete")}
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
              {t("admin.questspage.edit")}
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className={`block text-muted-foreground mb-2 uppercase ${fontClass}`}>
                  {t("admin.rewardspage.title")}
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
                  <label className={`block text-muted-foreground mb-2 uppercase ${fontClass}`}>
                    SKU
                  </label>
                  <PixelInput
                    type="text"
                    value={currentEdit.sku}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, sku: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className={`block text-muted-foreground mb-2 uppercase ${fontClass}`}>
                    {t("admin.rewardspage.category")}
                  </label>
                  <PixelInput
                    type="text"
                    value={currentEdit.category}
                    onChange={(e) =>
                      setCurrentEdit({ ...currentEdit, category: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-muted-foreground mb-2 uppercase ${fontClass}`}>
                  {t("admin.rewardspage.desc")}
                </label>
                <PixelInput
                  type="text"
                  value={currentEdit.description}
                  onChange={(e) =>
                    setCurrentEdit({ ...currentEdit, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={`block text-muted-foreground mb-2 uppercase ${fontClass}`}>
                    {t("admin.rewardspage.cost")}
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
                  <label className={`block text-muted-foreground mb-2 uppercase ${fontClass}`}>
                    {t("admin.rewardspage.stock")}
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
                  className={fontClass}
                >
                  {t("admin.rewardspage.cancel")}
                </PixelButton>
                <PixelButton
                  type="submit"
                  variant="gold"
                  size="md"
                  className={fontClass}
                >
                  {t("admin.rewardspage.save")}
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
