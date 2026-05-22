import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/store/themeStore";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelFrame from "@/components/PixelFrame";
import PixelStore from "@/components/icons/PixelStore";
import PixelTable, { Column } from "../components/PixelTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "../services/admin.service";
import { useDeleteProduct } from "../../rewards/services/product.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ManageReward = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";
  const { theme } = useThemeStore();
  const isLight = theme === "light";
  const inputCls = isLight ? "bg-[#EDE4CF] border-[#8B5A20]/60" : "bg-[#1a1c1e] border-[#333]";
  const dialogCls = isLight ? "bg-[#EDE4CF] border-[#8B5A20]" : "bg-[#12141a] border-[#333]";
  const cancelCls = isLight ? "bg-[#EDE4CF] border-[#8B5A20]/60 hover:bg-[#D6C9A8]" : "bg-[#1a1c1e] border-[#333] hover:bg-white/10";

  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: "price" | "stock"; dir: "asc" | "desc" } | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "newest" | "oldest">("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeletePending, setBulkDeletePending] = useState(false);

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
    setBulkDeletePending(true);
  };

  const confirmBulkDelete = () => {
    selectedIds.forEach(id => {
      deleteProduct(id, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
      });
    });
    toast.success(t("admin.rewardspage.deleteSuccess"), {
      style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
      position: "bottom-right",
    });
    setSelectedIds(new Set());
    setBulkDeletePending(false);
  };

  // Helper สำหรับตัดข้อความที่ยาวเกินไป
  const truncateText = (text: string, length: number = 20) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deleteProduct(deleteTargetId, {
        onSuccess: () => {
          toast.success(t("admin.rewardspage.deleteSuccess"), {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"TA_8bit"', fontSize: "16px" },
            position: "bottom-right",
          });
          queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        },
        onError: (err: any) => {
          toast.error(t("admin.rewardspage.deleteError"), {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"TA_8bit"', fontSize: "16px" },
            position: "bottom-right",
          });
        }
      });
      setDeleteTargetId(null);
    }
  };

  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.rewardspage.loading")}</div>;

  const sortedRewards = (() => {
    let list = Array.isArray(rewards) ? [...rewards] : [];
    if (searchTitle) {
      list = list.filter((r: any) => r.name?.toLowerCase().includes(searchTitle.toLowerCase()));
    }
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

  const columns: Column<any>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAll}
          className="w-4 h-4 cursor-pointer accent-yellow-400"
        />
      ),
      accessor: (reward) => (
        <input
          type="checkbox"
          checked={selectedIds.has(reward.id)}
          onChange={() => handleSelectOne(reward.id)}
          className="w-4 h-4 cursor-pointer accent-yellow-400"
        />
      ),
      className: "text-center w-[5%]",
      headerClassName: "w-[5%] text-center",
    },
    {
      header: t("admin.rewardspage.title"),
      accessor: (reward) => (
        <div className={`font-medium text-foreground truncate ${fontClass}`} title={reward.name}>
          {reward.name}
        </div>
      ),
      className: "w-[25%]",
      headerClassName: "w-[25%]",
    },
    {
      header: t("admin.rewardspage.desc"),
      accessor: (reward) => (
        <div className={`text-muted-foreground truncate ${fontClass}`} title={reward.description}>
          {truncateText(reward.description, 50)}
        </div>
      ),
      className: "w-[25%]",
      headerClassName: "w-[25%]",
    },
    {
      header: (
        <button
          onClick={() => handleSort("price")}
          className="flex items-center justify-center gap-1 w-full hover:text-yellow-400 transition-colors"
        >
          {t("admin.rewardspage.cost")}
          <span className="text-xs">
            {sortConfig?.key === "price" ? (sortConfig.dir === "asc" ? "▲" : "▼") : "⇅"}
          </span>
        </button>
      ),
      accessor: (reward) => `${reward.price} ${t("admin.rewardspage.pts")}`,
      className: `text-center text-yellow-400 font-bold truncate w-[15%] ${fontClass}`,
      headerClassName: "w-[15%] text-center",
    },
    {
      header: (
        <button
          onClick={() => handleSort("stock")}
          className="flex items-center justify-center gap-1 w-full hover:text-yellow-400 transition-colors"
        >
          {t("admin.rewardspage.stock")}
          <span className="text-xs">
            {sortConfig?.key === "stock" ? (sortConfig.dir === "asc" ? "▲" : "▼") : "⇅"}
          </span>
        </button>
      ),
      accessor: (reward) => reward.stock > 0 ? (
        reward.stock
      ) : (
        <span className="text-red-500">{t("admin.rewardspage.stockout")}</span>
      ),
      className: `text-center text-accent truncate w-[15%] ${fontClass}`,
      headerClassName: "w-[15%] text-center",
    },
    {
      header: t("admin.rewardspage.action"),
      accessor: (reward) => (
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
      ),
      className: "w-[20%]",
      headerClassName: "w-[20%] text-center",
    },
  ];

  return (
    <div className={`p-6 max-w-6xl mx-auto text-foreground font-pixel ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <PixelStore className="w-7 h-7" />
          {t("admin.rewardspage.manage")}
        </h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder={t("admin.rewardspage.searchTitle", "Search Product Name...")}
            className={`${inputCls} border text-foreground font-pixel px-3 py-1.5 leading-none hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-muted-foreground ${fontClass}`}
          />
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
            className={`${inputCls} border text-foreground font-pixel px-3 py-1.5 cursor-pointer hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors ${fontClass}`}
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

      <PixelTable
        columns={columns}
        data={sortedRewards}
        isLoading={isLoading}
        rowKeyExtractor={(reward) => reward.id}
        emptyMessage={t("admin.rewardspage.notfoundquest")}
        className="w-full"
      />
      {/* Single delete confirm */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className={`${dialogCls} border text-foreground font-pixel`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-red-400 ${fontClass}`}>
              {t("admin.rewardspage.deleteConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className={`text-muted-foreground ${fontClass}`}>
              {t("admin.rewardspage.deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={`${cancelCls} border text-foreground font-pixel ${fontClass}`}>
              {t("admin.rewardspage.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className={`bg-red-700 hover:bg-red-600 text-white border border-red-600 font-pixel ${fontClass}`}
            >
              {t("admin.rewardspage.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirm */}
      <AlertDialog open={bulkDeletePending} onOpenChange={(open) => !open && setBulkDeletePending(false)}>
        <AlertDialogContent className={`${dialogCls} border text-foreground font-pixel`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-red-400 ${fontClass}`}>
              {t("admin.rewardspage.deleteBulkConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className={`text-muted-foreground ${fontClass}`}>
              {t("admin.rewardspage.deleteBulkConfirmDesc", { count: selectedIds.size })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={`${cancelCls} border text-foreground font-pixel ${fontClass}`}>
              {t("admin.rewardspage.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className={`bg-red-700 hover:bg-red-600 text-white border border-red-600 font-pixel ${fontClass}`}
            >
              {t("admin.rewardspage.confirmDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageReward;
