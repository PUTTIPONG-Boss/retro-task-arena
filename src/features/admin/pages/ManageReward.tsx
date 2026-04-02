import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import PixelStore from "@/components/icons/PixelStore";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/admin.service";
import { useUpdateProduct, useDeleteProduct } from "../../rewards/services/product.service";
import { toast } from "sonner";
import { Product } from "../../rewards/types";

const ManageReward = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["admin", "products", page],
    queryFn: () => getAllProducts(page, LIMIT),
    staleTime: 30_000,
  });

  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  // State สำหรับจัดการ Modal การแก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Product | null>(null);

  // Helper สำหรับตัดข้อความที่ยาวเกินไป
  const truncateText = (text: string, length: number = 20) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm(t("admin.rewardspage.alert") || "Are you sure you want to delete this product?")) {
      deleteProduct(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully!");
        },
        onError: (err: any) => {
          toast.error("Failed to delete product: " + (err?.message || "Unknown error"));
        }
      });
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

    updateProduct(
      {
        id: currentEdit.id,
        payload: {
          name: currentEdit.name,
          description: currentEdit.description,
          category: currentEdit.category,
          price: currentEdit.price,
          stock: currentEdit.stock,
        },
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully!");
          setIsEditModalOpen(false);
          setCurrentEdit(null);
        },
        onError: (err: any) => {
          toast.error("Failed to update product: " + (err?.message || "Unknown error"));
        },
      }
    );
  };

  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.rewardspage.loading")}</div>;

  return (
    <div className={`p-6 max-w-6xl mx-auto text-foreground font-pixel ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <PixelStore className="w-7 h-7" />
          {t("admin.rewardspage.title")}
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
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3 w-[25%]">{t("admin.rewardspage.title")}</th>
              <th className="p-3 w-[25%]">{t("admin.rewardspage.desc")}</th>
              <th className="p-3 w-[15%] text-center">{t("admin.rewardspage.cost")}</th>
              <th className="p-3 w-[15%] text-center">{t("admin.rewardspage.stock")}</th>
              <th className="p-3 w-[20%] text-center">{t("admin.rewardspage.action")}</th>
            </tr>
          </thead>
          <tbody>
            {!rewards || rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
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

                  <td className="p-3">
                    <div className={`font-medium text-foreground truncate ${fontClass}`} title={reward.name}>
                      {reward.name}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={`text-muted-foreground truncate ${fontClass}`} title={reward.description}>
                      {reward.description}
                    </div>
                  </td>
                  <td className={`p-3 text-center text-yellow-400 font-bold truncate ${fontClass}`}>
                    {reward.price} {t("admin.rewardspage.pts")}
                  </td>
                  <td className={`p-3 text-center text-accent truncate ${fontClass}`}>
                    {reward.stock > 0 ? (
                      reward.stock
                    ) : (
                      <span className="text-red-500">{t("admin.rewardspage.stockout")}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
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
                    </div>
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
                    {t("admin.rewardspage.category")}
                  </label>
                  <PixelInput
                    type="text"
                    value={currentEdit.category || ""}
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
