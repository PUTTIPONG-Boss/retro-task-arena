import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllTasks, deleteTask } from "../services/admin.service";

const ManageQuest = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortReward, setSortReward] = useState("");
  const [sortDate, setSortDate] = useState("");

  const { data: quests, isLoading } = useQuery({
    queryKey: ["admin", "quests", page],
    queryFn: () => getAllTasks(page, LIMIT),
    staleTime: 30_000,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "quests"] });
    },
    onError: (error) => {
      console.error("Failed to delete quest:", error);
      alert("Failed to delete quest");
    }
  });

  const getStatusKey = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "review") return "in_review";
    if (s === "in-progress") return "in_progress";
    return s;
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "open":        return "bg-blue-900/50 text-blue-400 border border-blue-700";
      case "in_progress": return "bg-yellow-900/50 text-yellow-400 border border-yellow-700";
      case "review":
      case "in_review":   return "bg-purple-900/50 text-purple-400 border border-purple-700";
      case "completed":   return "bg-emerald-900/50 text-emerald-400 border border-emerald-700";
      default:            return "bg-gray-800/50 text-gray-400 border border-gray-600";
    }
  };

  const questList: any[] = Array.isArray(quests) ? quests : [];
  const uniqueTypes = Array.from(new Set(questList.map((q) => q.type).filter(Boolean))) as string[];

  const filteredQuests = questList
    .filter((q) => {
      if (filterDifficulty && q.difficulty?.toLowerCase() !== filterDifficulty) return false;
      if (filterType && q.type !== filterType) return false;
      if (filterStatus && getStatusKey(q.status) !== filterStatus && q.status?.toLowerCase() !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortReward === "asc") return (a.point ?? 0) - (b.point ?? 0);
      if (sortReward === "desc") return (b.point ?? 0) - (a.point ?? 0);
      if (sortDate === "newest") return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      if (sortDate === "oldest") return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
      return 0;
    });

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this quest?")) {
      deleteMutation.mutate(id);
    }
  };

  const isAllSelected = filteredQuests.length > 0 && filteredQuests.every((q: any) => selectedIds.has(q.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuests.map((q: any) => q.id)));
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
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} quest(s)?`)) {
      selectedIds.forEach(id => deleteMutation.mutate(id));
      setSelectedIds(new Set());
    }
  };

  // Helper สำหรับตัดข้อความที่ยาวเกินไป
  const truncateText = (text: string, length: number = 20) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.questspage.loading")}</div>;

  return (
    <div className={`p-6 max-w-[1400px] mx-auto text-foreground font-pixel ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <PixelClipboardList className="w-7 h-7" />
          {t("admin.questspage.manage")}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filters */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-2 py-1.5 cursor-pointer hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors ${fontClass}`}
          >
            <option value="">{t("admin.questspage.diff")}: {t("admin.questspage.all", "All")}</option>
            <option value="easy">{t("admin.questspage.difficulty_values.easy", "Easy")}</option>
            <option value="medium">{t("admin.questspage.difficulty_values.medium", "Medium")}</option>
            <option value="hard">{t("admin.questspage.difficulty_values.hard", "Hard")}</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-2 py-1.5 cursor-pointer hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors ${fontClass}`}
          >
            <option value="">{t("admin.questspage.type")}: {t("admin.questspage.all", "All")}</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-2 py-1.5 cursor-pointer hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors ${fontClass}`}
          >
            <option value="">{t("admin.questspage.status")}: {t("admin.questspage.all", "All")}</option>
            <option value="open">{t("admin.questspage.status_values.open", "Open")}</option>
            <option value="in_progress">{t("admin.questspage.status_values.in_progress", "In Progress")}</option>
            <option value="in_review">{t("admin.questspage.status_values.in_review", "In Review")}</option>
            <option value="completed">{t("admin.questspage.status_values.completed", "Completed")}</option>
          </select>

          <select
            value={sortDate}
            onChange={(e) => { setSortDate(e.target.value); setSortReward(""); }}
            className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-2 py-1.5 cursor-pointer hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors ${fontClass}`}
          >
            <option value="">{t("admin.questspage.sort_date", "Date")}: {t("admin.questspage.all", "All")}</option>
            <option value="newest">{t("admin.questspage.date.newest")}</option>
            <option value="oldest">{t("admin.questspage.date.oldest")}</option>
          </select>

          {selectedIds.size > 0 && (
            <PixelButton
              variant="danger"
              size="md"
              className={fontClass}
              onClick={handleBulkDelete}
            >
              {t("admin.questspage.delete")} ({selectedIds.size})
            </PixelButton>
          )}
          <PixelButton
            variant="gold"
            size="md"
            className={fontClass}
            onClick={() => navigate("/create-quest")}>
            {t("admin.questspage.add")}
          </PixelButton>
        </div>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล --- */}
      <PixelFrame variant="dark" className="relative p-6">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3 w-[4%] text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer accent-yellow-400"
                />
              </th>
              <th className="p-3 w-[10%]">{t("admin.questspage.id")}</th>
              <th className="p-3 w-[10%]">{t("admin.questspage.title")}</th>
              <th className="p-3 w-[16%]">{t("admin.questspage.desc")}</th>
              <th className="p-3 w-[8%] text-center">
                <button
                  onClick={() => {
                    setSortDate("");
                    setSortReward(sortReward === "" ? "desc" : sortReward === "desc" ? "asc" : "");
                  }}
                  className="flex items-center justify-center gap-1 w-full hover:text-yellow-400 transition-colors"
                >
                  {t("admin.questspage.reward")}
                  <span className="text-xs">
                    {sortReward === "asc" ? "▲" : sortReward === "desc" ? "▼" : "⇅"}
                  </span>
                </button>
              </th>
              <th className="p-3 w-[8%] text-center">{t("admin.questspage.type")}</th>
              <th className="p-3 w-[8%] text-center">{t("admin.questspage.diff")}</th>
              <th className="p-3 w-[15%] text-center">{t("admin.questspage.status")}</th>
              <th className="p-3 w-[17%] text-center">{t("admin.questspage.action")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuests.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-muted-foreground">
                  {t("admin.questspage.notfoundquest")}
                </td>
              </tr>
            ) : (
              filteredQuests.map((quest: any) => (
                <tr key={quest.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(quest.id)}
                      onChange={() => handleSelectOne(quest.id)}
                      className="w-4 h-4 cursor-pointer accent-yellow-400"
                    />
                  </td>
                  <td className="p-3">
                    <div className={`font-medium text-foreground truncate ${fontClass}`} title={quest.id}>{quest.id}</div>
                  </td>
                  <td className="p-3">
                    <div className={`font-medium text-foreground truncate ${fontClass}`} title={quest.title}>{quest.title}</div>
                  </td>
                  <td className="p-3">
                    <div className={`text-muted-foreground truncate ${fontClass}`} title={quest.description}>
                      {quest.description}
                    </div>
                  </td>
                  <td className={`p-3 text-center text-yellow-400 font-bold truncate ${fontClass}`}>
                    {quest.point}
                  </td>
                  <td className={`p-3 text-center text-muted-foreground truncate ${fontClass}`}>
                    {quest.type}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`px-2 py-1 border truncate inline-block max-w-full ${quest.difficulty?.toLowerCase() === "easy" || quest.difficulty === "Low" ? "border-green-800 text-green-400 bg-green-900/20" :
                        quest.difficulty?.toLowerCase() === "medium" || quest.difficulty === "Medium" ? "border-yellow-800 text-yellow-400 bg-yellow-900/20" :
                          "border-red-800 text-red-400 bg-red-900/20"
                        } ${i18n.language === "th" ? "text-[18px]" : "text-[16px]"}`}>
                        {t(`admin.questspage.difficulty_values.${quest.difficulty?.toLowerCase()}`)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`px-2 py-1 uppercase tracking-wider truncate inline-block max-w-full ${getStatusColor(quest.status)} ${fontClass}`}>
                        {t(`admin.questspage.status_values.${getStatusKey(quest.status)}`)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <PixelButton
                        onClick={() => navigate(`/quest/${quest.id}/edit`)}
                        variant="gold"
                        size="sm"
                        className={`${fontClass}`}
                      >
                        {t("admin.questspage.edit")}
                      </PixelButton>
                      <PixelButton
                        onClick={() => handleDelete(quest.id)}
                        variant="danger"
                        size="sm"
                        className={`text-white-400 hover:text-white-300 ${fontClass}`}
                      >
                        {t("admin.questspage.delete")}
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

export default ManageQuest;