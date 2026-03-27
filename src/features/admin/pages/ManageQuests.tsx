import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/admin.service";

const ManageQuest = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const { data: quests, isLoading } = useQuery({
    queryKey: ["admin", "quests"],
    queryFn: getAllTasks,
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
    <div className="p-6 max-w-[1400px] mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">📜 {t("admin.questspage.manage")}</h1>
        <PixelButton 
          variant="gold" 
          size="md" 
          className={fontClass}
          onClick={() => navigate("/create-quest")}>
          {t("admin.questspage.add")}
        </PixelButton>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3">{t("admin.questspage.id")}</th>
              <th className="p-3">{t("admin.questspage.title")}</th>
              <th className="p-3 w-1/4">{t("admin.questspage.desc")}</th>
              <th className="p-3 text-center">{t("admin.questspage.reward")}</th>
              <th className="p-3 text-center">{t("admin.questspage.est")}</th>
              <th className="p-3 text-center">{t("admin.questspage.type")}</th>
              <th className="p-3 text-center">{t("admin.questspage.skills")}</th>
              <th className="p-3 text-center">{t("admin.questspage.diff")}</th>
              <th className="p-3 text-center">{t("admin.questspage.status")}</th>
              <th className="p-3 text-center">{t("admin.questspage.action")}</th>
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
                    <div className={`font-medium text-foreground ${fontClass}`}>{quest.id}</div>
                  </td>
                  <td className="p-3">
                    <div className={`font-medium text-foreground ${fontClass}`}>{quest.title}</div>
                  </td>
                  <td className="p-3">
                    <div className={`text-muted-foreground mt-1 ${fontClass}`}>
                      {truncateText(quest.description)}
                    </div>
                  </td>
                  <td className={`p-3 text-center text-yellow-400 font-bold ${fontClass}`}>{quest.point} pts</td>
                  <td className={`p-3 text-center text-accent ${fontClass}`}>{quest.estimatedTime}</td>
                  <td className={`p-3 text-center text-muted-foreground ${fontClass}`}>{quest.type}</td>
                  <td className="p-3 text-center">
                    <div className={`text-xs text-muted-foreground ${fontClass}`}>
                      {truncateText(quest.skills)}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 text-xs border ${
                      quest.difficulty?.toLowerCase() === "easy" || quest.difficulty === "Low" ? "border-green-800 text-green-400 bg-green-900/20" :
                      quest.difficulty?.toLowerCase() === "medium" || quest.difficulty === "Medium" ? "border-yellow-800 text-yellow-400 bg-yellow-900/20" :
                      "border-red-800 text-red-400 bg-red-900/20"
                    } ${fontClass}`}>
                      {quest.difficulty}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 uppercase tracking-wider ${getStatusColor(quest.status)} ${fontClass}`}>
                      {quest.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2 mt-1">
                    <PixelButton
                      onClick={() => navigate(`/quest/${quest.id}/edit`)}
                      variant="gold"
                      size="sm"
                      className={fontClass}
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