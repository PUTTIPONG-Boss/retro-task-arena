import React from "react";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/admin.service";

const ManageJunior = () => {
  const { t, i18n } = useTranslation();
  const { data: allUsers, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  });

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const juniors = allUsers?.filter(u => u.role?.toUpperCase().includes("JUNIOR")) || [];
  
  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.juniorpage.loading")}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">🛡️ {t("admin.juniorpage.manage")}</h1>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล (ใช้ PixelFrame ครอบ) --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3">{t("admin.juniorpage.id")}</th>
              <th className="p-3">{t("admin.juniorpage.username")}</th>
              <th className="p-3">{t("admin.juniorpage.email")}</th>
              <th className="p-3 text-center">{t("admin.juniorpage.quests")}</th>
              <th className="p-3 text-center">{t("admin.juniorpage.role")}</th>
            </tr>
          </thead>
          <tbody>
            {juniors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  {t("admin.juniorpage.notfoundjunior")}
                </td>
              </tr>
            ) : (
              juniors.map((junior) => (
                <tr key={junior.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className={`p-3 text-muted-foreground ${fontClass}`}>{junior.id.substring(0, 8)}...</td>
                  <td className={`p-3 text-foreground ${fontClass}`}>{junior.username}</td>
                  <td className={`p-3 text-muted-foreground ${fontClass}`}>{junior.email}</td>
                  <td className={`p-3 text-center text-accent ${fontClass}`}>{junior.questsCompleted}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 uppercase tracking-wider bg-green-900/50 text-green-400 border border-green-800 ${fontClass}`}>
                      {junior.role}
                    </span>
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

export default ManageJunior;