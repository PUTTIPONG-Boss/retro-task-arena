import React from "react";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "../services/admin.service";

const STALE_TIME = 5 * 60 * 1_000;

const SkeletonRows = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <tr key={i} className="border-b border-[#333]/30">
        {Array.from({ length: 7 }).map((__, j) => (
          <td key={j} className="p-3">
            <div
              className="h-4 rounded bg-white/10 animate-pulse"
              style={{ width: j === 2 ? "80%" : j === 6 ? "60%" : "50%" }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const ManageJunior = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = React.useState("");
  const { data: juniors = [], isLoading } = useQuery({
    queryKey: ["admin", "users", "junior"],
    queryFn: () => getUsersByRole("JUNIOR"),  
    staleTime: STALE_TIME,
    gcTime: 10 * 60 * 1_000,
  });

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const filteredJuniors = (juniors as any[]).filter((j) => {
    const q = search.toLowerCase();
    return (
      j.id?.toLowerCase().includes(q) ||
      j.username?.toLowerCase().includes(q) ||
      j.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7"><path d="M2 22H0v-4h2v4Zm14 0h-2v-4h2v4Zm8 0h-2v-4h2v4ZM4 18H2v-2h2v2Zm10 0h-2v-2h2v2Zm8 0h-2v-2h2v2Zm-10-2H4v-2h8v2Zm8 0h-4v-2h4v2Zm-9-4H5v-2h6v2Zm8 0h-4v-2h4v2ZM5 10H3V4h2v6Zm8 0h-2V4h2v6Zm8 0h-2V4h2v6ZM11 4H5V2h6v2Zm8 0h-4V2h4v2Z"/></svg>
          {t("admin.juniorpage.manage")}
        </h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ID / Username / Email..."
          className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-3 py-1.5 w-72 hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-muted-foreground ${fontClass}`}
        />
      </div>
      
      <PixelFrame variant="dark" className="relative p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className={`border-b border-[#333] text-muted-foreground uppercase tracking-wider ${fontClass}`}>
              <th className="p-3">{t("admin.juniorpage.id")}</th>
              <th className="p-3">{t("admin.juniorpage.username")}</th>
              <th className="p-3">{t("admin.juniorpage.email")}</th>
              <th className="p-3 text-center">{t("admin.juniorpage.questsInProgress")}</th>
              <th className="p-3 text-center">{t("admin.juniorpage.questsInReview")}</th>
              <th className="p-3 text-center">{t("admin.juniorpage.questsCompleted")}</th>
              <th className="p-3 text-center">{t("admin.juniorpage.role")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows />
            ) : juniors.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  {t("admin.juniorpage.notfoundjunior")}
                </td>
              </tr>
            ) : (
              filteredJuniors.map((junior: any) => (
                <tr key={junior.id} className="border-b border-[#333]/30 hover:bg-white/5 transition-colors">
                  <td className={`p-3 text-muted-foreground ${fontClass}`}>{junior.id.substring(0, 8)}...</td>
                  <td className={`p-3 text-foreground ${fontClass}`}>{junior.username}</td>
                  <td className={`p-3 text-muted-foreground ${fontClass}`}>{junior.email}</td>
                  <td className={`p-3 text-center text-orange-400 ${fontClass}`}>{junior.questsInProgress || 0}</td>
                  <td className={`p-3 text-center text-blue-400 ${fontClass}`}>{junior.questsInReview || 0}</td>
                  <td className={`p-3 text-center text-accent ${fontClass}`}>{junior.questsCompleted || 0}</td>
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