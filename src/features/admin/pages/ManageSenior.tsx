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
        {Array.from({ length: 5 }).map((__, j) => (
          <td key={j} className="p-3">
            <div
              className="h-4 rounded bg-white/10 animate-pulse"
              style={{ width: j === 2 ? "80%" : j === 4 ? "60%" : "50%" }}
            />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const ManageSenior = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = React.useState("");
  const [selectedSenior, setSelectedSenior] = React.useState<UserProfile | null>(null);
  const { data: seniors = [], isLoading } = useQuery({
    queryKey: ["admin", "users", "senior"],
    queryFn: () => getUsersByRole("SENIOR"),
    staleTime: STALE_TIME,
    gcTime: 10 * 60 * 1_000,
  });

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";

  const filteredSeniors = (seniors as any[]).filter((s) => {
    const q = search.toLowerCase();
    return (
      s.id?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7"><path d="M2 22H0v-4h2v4Zm14 0h-2v-4h2v4Zm8 0h-2v-4h2v4ZM4 18H2v-2h2v2Zm10 0h-2v-2h2v2Zm8 0h-2v-2h2v2Zm-10-2H4v-2h8v2Zm8 0h-4v-2h4v2Zm-9-4H5v-2h6v2Zm8 0h-4v-2h4v2ZM5 10H3V4h2v6Zm8 0h-2V4h2v6Zm8 0h-2V4h2v6ZM11 4H5V2h6v2Zm8 0h-4V2h4v2Z"/></svg>
          {t("admin.seniorpage.manage")}
        </h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t("admin.seniorpage.id")}/ ${t("admin.seniorpage.username")}/ ${t("admin.seniorpage.email")}`}
          className={`bg-[#1a1c1e] border border-[#333] text-foreground font-pixel px-3 py-1.5 w-72 hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-muted-foreground ${fontClass}`}
        />
      </div>

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
            {isLoading ? (
              <SkeletonRows />
            ) : seniors.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  {t("admin.seniorpage.notfoundsenior")}
                </td>
              </tr>
            ) : (
              filteredSeniors.map((senior: any) => (
                <tr
                  key={senior.id}
                  className="border-b border-[#333]/30 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedSenior(senior)}
                >
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

      <Dialog open={!!selectedSenior} onOpenChange={(open) => !open && setSelectedSenior(null)}>
        <DialogContent className="bg-[#12141a] border border-[#333] text-foreground font-pixel max-w-lg">
          <DialogHeader>
            <DialogTitle className={`text-accent pixel-text-shadow ${fontClass}`}>
              {t("admin.seniorpage.dialog.title")}
            </DialogTitle>
          </DialogHeader>
          {selectedSenior && (
            <div className={`space-y-3 ${fontClass}`}>
              <div className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-2">
                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.fullId")}</span>
                <span className="text-foreground break-all">{selectedSenior.id}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.username")}</span>
                <span className="text-foreground">{selectedSenior.username}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.email")}</span>
                <span className="text-foreground">{selectedSenior.email || t("admin.seniorpage.dialog.notSpecified")}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.nameTh")}</span>
                <span className="text-foreground">
                  {selectedSenior.firstNameTh || selectedSenior.lastNameTh
                    ? `${selectedSenior.firstNameTh ?? ""} ${selectedSenior.lastNameTh ?? ""}`.trim()
                    : t("admin.seniorpage.dialog.notSpecified")}
                </span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.nameEn")}</span>
                <span className="text-foreground">
                  {selectedSenior.firstNameEn || selectedSenior.lastNameEn
                    ? `${selectedSenior.firstNameEn ?? ""} ${selectedSenior.lastNameEn ?? ""}`.trim()
                    : t("admin.seniorpage.dialog.notSpecified")}
                </span>

                <span className="text-muted-foreground">{t("admin.seniorpage.role")}</span>
                <span className="text-purple-400 uppercase">{selectedSenior.role}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.points")}</span>
                <span className="text-accent">{selectedSenior.points ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.rating")}</span>
                <span className="text-yellow-400">{selectedSenior.rating ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.postedQuests")}</span>
                <span className="text-accent">{selectedSenior.questsCompleted ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.github")}</span>
                <span className="text-foreground">
                  {selectedSenior.github
                    ? <a href={selectedSenior.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{selectedSenior.github}</a>
                    : t("admin.seniorpage.dialog.notSpecified")}
                </span>

                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.linkedin")}</span>
                <span className="text-foreground">
                  {selectedSenior.linkin
                    ? <a href={selectedSenior.linkin} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{selectedSenior.linkin}</a>
                    : t("admin.seniorpage.dialog.notSpecified")}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-muted-foreground">{t("admin.seniorpage.dialog.skills")}</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSenior.skills && selectedSenior.skills.length > 0
                    ? selectedSenior.skills.map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-accent/20 border border-accent/40 text-accent text-xs">
                          {skill}
                        </span>
                      ))
                    : <span className="text-muted-foreground">{t("admin.seniorpage.dialog.noSkills")}</span>}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSenior;