import React from "react";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import { useQuery } from "@tanstack/react-query";
import { getUsersByRole } from "../services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProfile } from "@/features/users/types";

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
  const [selectedJunior, setSelectedJunior] = React.useState<UserProfile | null>(null);
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
                <tr
                  key={junior.id}
                  className="border-b border-[#333]/30 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedJunior(junior)}
                >
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

      <Dialog open={!!selectedJunior} onOpenChange={(open) => !open && setSelectedJunior(null)}>
        <DialogContent className="bg-[#12141a] border border-[#333] text-foreground font-pixel max-w-lg">
          <DialogHeader>
            <DialogTitle className={`text-accent pixel-text-shadow ${fontClass}`}>
              {t("admin.juniorpage.dialog.title")}
            </DialogTitle>
          </DialogHeader>
          {selectedJunior && (
            <div className={`space-y-3 ${fontClass}`}>
              <div className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2">
                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.fullId")}</span>
                <span className="text-foreground break-all">{selectedJunior.id}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.username")}</span>
                <span className="text-foreground">{selectedJunior.username}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.email")}</span>
                <span className="text-foreground">{selectedJunior.email || t("admin.juniorpage.dialog.notSpecified")}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.nameTh")}</span>
                <span className="text-foreground">
                  {selectedJunior.firstNameTh || selectedJunior.lastNameTh
                    ? `${selectedJunior.firstNameTh ?? ""} ${selectedJunior.lastNameTh ?? ""}`.trim()
                    : t("admin.juniorpage.dialog.notSpecified")}
                </span>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.nameEn")}</span>
                <span className="text-foreground">
                  {selectedJunior.firstNameEn || selectedJunior.lastNameEn
                    ? `${selectedJunior.firstNameEn ?? ""} ${selectedJunior.lastNameEn ?? ""}`.trim()
                    : t("admin.juniorpage.dialog.notSpecified")}
                </span>

                <span className="text-muted-foreground">{t("admin.juniorpage.role")}</span>
                <span className="text-green-400 uppercase">{selectedJunior.role}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.points")}</span>
                <span className="text-accent">{selectedJunior.points ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.rating")}</span>
                <span className="text-yellow-400">{selectedJunior.rating ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.questsInProgress")}</span>
                <span className="text-orange-400">{selectedJunior.questsInProgress ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.questsInReview")}</span>
                <span className="text-blue-400">{selectedJunior.questsInReview ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.questsCompleted")}</span>
                <span className="text-accent">{selectedJunior.questsCompleted ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.github")}</span>
                <span className="text-foreground">
                  {selectedJunior.github
                    ? <a href={selectedJunior.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{selectedJunior.github}</a>
                    : t("admin.juniorpage.dialog.notSpecified")}
                </span>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.linkedin")}</span>
                <span className="text-foreground">
                  {selectedJunior.linkin
                    ? <a href={selectedJunior.linkin} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{selectedJunior.linkin}</a>
                    : t("admin.juniorpage.dialog.notSpecified")}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.skills")}</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedJunior.skills && selectedJunior.skills.length > 0
                    ? selectedJunior.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-accent/20 border border-accent/40 text-accent text-xs">
                          {skill}
                        </span>
                      ))
                    : <span className="text-muted-foreground">{t("admin.juniorpage.dialog.noSkills")}</span>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJunior;