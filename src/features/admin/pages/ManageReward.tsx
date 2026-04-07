import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelFrame from "@/components/PixelFrame";
import PixelStore from "@/components/icons/PixelStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "../services/admin.service";
import { useDeleteProduct } from "../../rewards/services/product.service";
import { toast } from "sonner";

const ManageReward = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: "price" | "stock"; dir: "asc" | "desc" } | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "newest" | "oldest">("all");

  const handleSort = (key: "price" | "stock") => {
    setSortConfig(prev =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const { data: rewards, isLoading } = useQuery({
    queryKey: ["admin", "products", page],
    queryFn: () => getAllProducts(page, LIMIT),
    staleTime: 30_000,
  });

  const { mutate: deleteProduct } = useDeleteProduct();

  const isAllSelected = Array.isArray(rewards) && rewards.length > 0 && (rewards as any[]).every((r: any) => selectedIds.has(r.id));
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set((rewards as any[]).map((r: any) => r.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} product(s)?`)) {
      selectedIds.forEach(id => {
        deleteProduct(id, {
          onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
        });
      });
      setSelectedIds(new Set());
    }
  };

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
          queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        },
        onError: (err: any) => {
          toast.error("Failed to delete product: " + (err?.message || "Unknown error"));
        }
      });
    }
  };

  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.rewardspage.loading")}</div>;

  const sortedRewards = (() => {
    let list = Array.isArray(rewards) ? [...rewards] : [];
    if (dateFilter === "newest") {
      list = list.sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    } else if (dateFilter === "oldest") {
      list = list.sort((a: any, b: any) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime());
    }
    if (sortConfig) {
      list = list.sort((a: any, b: any) => {
        const aVal = sortConfig.key === "price" ? a.price : a.stock;
        const bVal = sortConfig.key === "price" ? b.price : b.stock;
        return sortConfig.dir === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    return list;
  })();

  return (
    <div className={`p-6 max-w-6xl mx-auto text-foreground font-pixel ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <PixelStore className="w-7 h-7" />
          {t("admin.rewardspage.title")}
        </h1>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <PixelButton
              variant="danger"
              size="md"
              className={fontClass}
              onClick={handleBulkDelete}
            >
              {t("admin.rewardspage.delete")} ({selectedIds.size})
            </PixelButton>
          )}
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value as "all" | "newest" | "oldest")}
            className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-3 py-1.5 cursor-pointer hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors ${fontClass}`}
          >
            <option value="all">{t("admin.rewardspage.date.dateAll")}</option>
            <option value="newest">{t("admin.rewardspage.date.newest")}</option>
            <option value="oldest">{t("admin.rewardspage.date.oldest")}</option>
          </select>
          <PixelButton
            variant="gold"
            size="md"
            className={fontClass}
            onClick={() => navigate("/add-product")}
          >
            {t("admin.rewardspage.add")}
          </PixelButton>
        </div>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล (ใช้ PixelFrame ครอบ) --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3 w-[5%] text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer accent-yellow-400"
                />
              </th>
              <th className="p-3 w-[25%]">{t("admin.rewardspage.title")}</th>
              <th className="p-3 w-[25%]">{t("admin.rewardspage.desc")}</th>
              <th className="p-3 w-[15%] text-center">
                <button
                  onClick={() => handleSort("price")}
                  className="flex items-center justify-center gap-1 w-full hover:text-yellow-400 transition-colors"
                >
                  {t("admin.rewardspage.cost")}
                  <span className="text-xs">
                    {sortConfig?.key === "price" ? (sortConfig.dir === "asc" ? "▲" : "▼") : "⇅"}
                  </span>
                </button>
              </th>
              <th className="p-3 w-[15%] text-center">
                <button
                  onClick={() => handleSort("stock")}
                  className="flex items-center justify-center gap-1 w-full hover:text-yellow-400 transition-colors"
                >
                  {t("admin.rewardspage.stock")}
                  <span className="text-xs">
                    {sortConfig?.key === "stock" ? (sortConfig.dir === "asc" ? "▲" : "▼") : "⇅"}
                  </span>
                </button>
              </th>
              <th className="p-3 w-[20%] text-center">{t("admin.rewardspage.action")}</th>
            </tr>
          </thead>
          <tbody>
            {!rewards || rewards.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-muted-foreground"
                >
                  {t("admin.rewardspage.notfoundquest")}
                </td>
              </tr>
            ) : (
              sortedRewards.map((reward: any) => (
                <tr
                  key={reward.id}
                  className="border-b border-[#333]/30 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(reward.id)}
                      onChange={() => handleSelectOne(reward.id)}
                      className="w-4 h-4 cursor-pointer accent-yellow-400"
                    />
                  </td>
                  <td className="p-3">
                    <div className={`font-medium text-foreground truncate ${fontClass}`} title={reward.name}>
                      {reward.name}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className={`text-muted-foreground truncate ${fontClass}`} title={reward.description}>
                      {truncateText(reward.description, 50)}
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
