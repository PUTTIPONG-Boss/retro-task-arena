import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import PixelStore from "@/components/icons/PixelStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts, deleteProduct } from "../services/admin.service";

const ManageReward = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["admin", "products", page],
    queryFn: () => getAllProducts(page, LIMIT),
    staleTime: 30_000,
  });

  const handleDelete = async (id: string) => {
    if (window.confirm(t("admin.rewardspage.alert"))) {
      try {
        await deleteProduct(id);
        queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
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
                        onClick={() => navigate(`/edit-product/${reward.id}`)}
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
    </div>
  );
};

export default ManageReward;
