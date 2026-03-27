import React from "react";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/admin.service";

const ManageSenior = () => {
  const { t, i18n } = useTranslation();
  const { data: allUsers, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  });

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const seniors = allUsers?.filter(u => u.role?.toUpperCase().includes("SENIOR")) || [];
  
  if (isLoading) return <div className={`p-6 font-pixel text-accent ${fontClass}`}>{t("admin.seniorpage.loading")}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow">🛡️ {t("admin.seniorpage.manage")}</h1>
      </div>

      {/* --- ส่วนตารางแสดงข้อมูล (ใช้ PixelFrame ครอบ) --- */}
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3">{t("admin.seniorpage.id")}</th>
              <th className="p-3">{t("admin.seniorpage.username")}</th>
              <th className="p-3">{t("admin.seniorpage.email")}</th>
              <th className="p-3 text-center">{t("admin.seniorpage.quests")}</th>
              <th className="p-3 text-center">{t("admin.seniorpage.role")}</th>
            </tr>
          </thead>
          <tbody>
            {seniors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  {t("admin.seniorpage.notfoundsenior")}
                </td>
              </tr>
            ) : (
              seniors.map((senior) => (
                <tr key={senior.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className={`p-3 text-muted-foreground ${fontClass}`}>{senior.id.substring(0, 8)}...</td>
                  <td className={`p-3 text-foreground ${fontClass}`}>{senior.username}</td>
                  <td className={`p-3 text-muted-foreground ${fontClass}`}>{senior.email}</td>
                  <td className={`p-3 text-center text-accent ${fontClass}`}>{senior.questsCompleted}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 uppercase tracking-wider bg-purple-900/50 text-purple-400 border border-purple-800 ${fontClass}`}>
                      {senior.role}
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

export default ManageSenior;