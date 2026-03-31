import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import PixelClipboardList from "@/components/icons/PixelClipboardList";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/admin.service";

const ManageQuest = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const { data: quests, isLoading } = useQuery({
    queryKey: ["admin", "quests", page],
    queryFn: () => getAllTasks(page, LIMIT),
    staleTime: 30_000,
  });

  // --- ฟังก์ชัน Delete ---
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this quest?")) {
      // TODO: API DELETE
    }
  };

  // Helper สำหรับตัดข้อความที่ยาวเกินไป
  const truncateText = (text: string, length: number = 20) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const getStatusKey = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "review") return "in_review";
    if (s === "in-progress") return "in_progress";
    return s;
  };

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

  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.questspage.loading")}</div>;

  return (
    <div className={`p-6 max-w-[1400px] mx-auto text-foreground font-pixel ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <PixelClipboardList className="w-7 h-7" />
          {t("admin.questspage.manage")}
        </h1>
        <PixelButton
          variant="gold"
          size="md"
          className={fontClass}
          onClick={() => navigate("/create-quest")}>
          {t("admin.questspage.add")}
        </PixelButton>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล --- */}
      <PixelFrame variant="dark" className="relative p-6">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3 w-[10%]">{t("admin.questspage.id")}</th>
              <th className="p-3 w-[10%]">{t("admin.questspage.title")}</th>
              <th className="p-3 w-[16%]">{t("admin.questspage.desc")}</th>
              <th className="p-3 w-[8%] text-center">{t("admin.questspage.reward")}</th>
              <th className="p-3 w-[8%] text-center">{t("admin.questspage.est")}</th>
              <th className="p-3 w-[8%] text-center">{t("admin.questspage.type")}</th>
              <th className="p-3 w-[8%] text-center">{t("admin.questspage.diff")}</th>
              <th className="p-3 w-[15%] text-center">{t("admin.questspage.status")}</th>
              <th className="p-3 w-[17%] text-center">{t("admin.questspage.action")}</th>
            </tr>
          </thead>
          <tbody>
            {!quests || quests.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-muted-foreground">
                  {t("admin.questspage.notfoundquest")}
                </td>
              </tr>
            ) : (
              quests.map((quest: any) => (
                <tr key={quest.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
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
                    {quest.point} pts
                  </td>
                  <td className={`p-3 text-center text-accent truncate ${fontClass}`}>
                    {quest.estimatedTime}
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