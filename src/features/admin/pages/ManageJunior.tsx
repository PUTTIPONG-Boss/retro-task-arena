import React from "react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/store/themeStore";
import PixelFrame from "@/components/PixelFrame";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsersByRole, updateUserRole } from "../services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserProfile } from "@/features/users/types";
import { useAuthStore } from "@/features/auth/store/authStore";
import PixelPencil from "@/components/icons/PixelPencil";
import PixelTable, { Column } from "../components/PixelTable";

const STALE_TIME = 0;

const JUNIOR_ROLE_OPTIONS = [
  { value: "SENIOR", label: "SENIOR", color: "text-purple-400", bg: "bg-purple-900/40", border: "border-purple-600" },
  { value: "ADMIN", label: "ADMIN", color: "text-red-400", bg: "bg-red-900/40", border: "border-red-600" },
] as const;

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

  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);
  const [isEditingRole, setIsEditingRole] = React.useState(false);
  const [pendingRole, setPendingRole] = React.useState<string>("");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "success" | "error">("idle");

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: (_data, variables) => {
      // Synchronously update the React Query cache for instant real-time updates
      queryClient.setQueryData<UserProfile[]>(["admin", "users", "junior"], (old) => {
        if (!old) return [];
        return old.filter((u) => u.id !== variables.userId);
      });

      if (variables.role === "SENIOR") {
        queryClient.setQueryData<UserProfile[]>(["admin", "users", "senior"], (old) => {
          if (!old) return [];
          const exists = old.some((u) => u.id === variables.userId);
          if (exists) {
            return old.map((u) => u.id === variables.userId ? { ...u, role: variables.role } : u);
          }
          if (selectedJunior) {
            return [...old, { ...selectedJunior, role: variables.role }];
          }
          return old;
        });
      }

      queryClient.invalidateQueries({ queryKey: ["admin", "users", "junior"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", "senior"] });
      setSaveStatus("success");
      setIsEditingRole(false);
      if (selectedJunior) setSelectedJunior({ ...selectedJunior, role: variables.role });
      
      // Instantly log out so the user must log in again to receive a fresh cookie
      logout();
    },
    onError: () => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    },
  });

  const fontClass = i18n.language === "th" ? "text-[18px]" : "text-[16px]";
  const { theme } = useThemeStore();
  const isLight = theme === "light";
  const inputCls = isLight ? "bg-[#EDE4CF] border-[#8B5A20]/60" : "bg-[#1a1c1e] border-[#333]";
  const dialogCls = isLight ? "bg-[#EDE4CF] border-[#8B5A20]" : "bg-[#12141a] border-[#333]";
  const sectionBorderCls = isLight ? "border-[#8B5A20]/40" : "border-[#333]";

  const filteredJuniors = (juniors as any[]).filter((j) => {
    const q = search.toLowerCase();
    return (
      j.id?.toLowerCase().includes(q) ||
      j.username?.toLowerCase().includes(q) ||
      j.email?.toLowerCase().includes(q)
    );
  });

  const columns: Column<UserProfile>[] = [
    {
      header: t("admin.juniorpage.id"),
      accessor: (j) => <span className={fontClass}>{j.id.substring(0, 8)}...</span>,
      className: "text-muted-foreground",
      headerClassName: fontClass,
    },
    {
      header: t("admin.juniorpage.username"),
      accessor: (j) => <span className={fontClass}>{j.username}</span>,
      className: "text-foreground",
      headerClassName: fontClass,
    },
    {
      header: t("admin.juniorpage.email"),
      accessor: (j) => <span className={fontClass}>{j.email}</span>,
      className: "text-muted-foreground",
      headerClassName: fontClass,
    },
    {
      header: t("admin.juniorpage.level"),
      accessor: (j) => <span className={fontClass}>{j.level || 1}</span>,
      className: "text-center text-orange-400",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.juniorpage.totalExp"),
      accessor: (j) => <span className={fontClass}>{j.totalExp || 0}</span>,
      className: "text-center text-blue-400",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.juniorpage.questsCompleted"),
      accessor: (j) => <span className={fontClass}>{j.questsCompleted || 0}</span>,
      className: "text-center text-accent",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.juniorpage.role"),
      accessor: (j) => (
        <span className={`px-2 py-1 uppercase tracking-wider bg-green-900/50 text-green-400 border border-green-800 ${fontClass}`}>
          {j.role}
        </span>
      ),
      className: "text-center",
      headerClassName: "text-center " + fontClass,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto text-foreground font-pixel">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-accent pixel-text-shadow flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7"><path d="M2 22H0v-4h2v4Zm14 0h-2v-4h2v4Zm8 0h-2v-4h2v4ZM4 18H2v-2h2v2Zm10 0h-2v-2h2v2Zm8 0h-2v-2h2v2Zm-10-2H4v-2h8v2Zm8 0h-4v-2h4v2Zm-9-4H5v-2h6v2Zm8 0h-4v-2h4v2ZM5 10H3V4h2v6Zm8 0h-2V4h2v6Zm8 0h-2V4h2v6ZM11 4H5V2h6v2Zm8 0h-4V2h4v2Z" /></svg>
          {t("admin.juniorpage.manage")}
        </h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t("admin.juniorpage.id")}/ ${t("admin.juniorpage.username")}/ ${t("admin.juniorpage.email")}`}
          className={`${inputCls} border text-foreground font-pixel px-3 py-1.5 w-72 hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-muted-foreground ${fontClass}`}
        />
      </div>

      <PixelTable
        columns={columns}
        data={filteredJuniors}
        isLoading={isLoading}
        onRowClick={(j) => setSelectedJunior(j)}
        rowKeyExtractor={(j) => j.id}
        emptyMessage={t("admin.juniorpage.notfoundjunior")}
      />

      <Dialog
        open={!!selectedJunior}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJunior(null);
            setIsEditingRole(false);
            setSaveStatus("idle");
          }
        }}
      >
        <DialogContent className={`${dialogCls} border text-foreground font-pixel max-w-lg`}>
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

                <span className="text-muted-foreground self-center">{t("admin.juniorpage.role")}</span>
                <div className="flex items-center gap-2">
                  {isEditingRole ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={pendingRole}
                        onChange={(e) => setPendingRole(e.target.value)}
                        className={`${inputCls} border border-[#F59E0B] text-foreground font-pixel px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B]`}
                      >
                        {JUNIOR_ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className={`${isLight ? "bg-[#EDE4CF]" : "bg-[#12141a]"} text-foreground`}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => roleMutation.mutate({ userId: selectedJunior.id, role: pendingRole })}
                        disabled={roleMutation.isPending}
                        className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white font-pixel text-xs border border-green-500 active:translate-y-[1px] transition-all"
                      >
                        {roleMutation.isPending ? t("admin.juniorpage.dialog.updating") : t("admin.juniorpage.dialog.save")}
                      </button>
                      <button
                        onClick={() => setIsEditingRole(false)}
                        className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white font-pixel text-xs border border-red-500 active:translate-y-[1px] transition-all"
                      >
                        {t("admin.juniorpage.dialog.cancel")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 uppercase tracking-wider bg-green-900/50 text-green-400 border border-green-800 text-sm">
                        {selectedJunior.role}
                      </span>
                      <button
                        onClick={() => {
                          setPendingRole(JUNIOR_ROLE_OPTIONS[0].value);
                          setIsEditingRole(true);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-400 border border-blue-600 text-xs rounded font-pixel active:translate-y-[1px] transition-all"
                      >
                        <PixelPencil className="w-3.5 h-3.5" size={16} />
                        {t("admin.juniorpage.dialog.editRole")}
                      </button>
                    </div>
                  )}
                  {saveStatus === "success" && (
                    <span className="text-xs text-green-400 animate-pulse ml-2">
                      {t("admin.juniorpage.dialog.success")}
                    </span>
                  )}
                  {saveStatus === "error" && (
                    <span className="text-xs text-red-400 animate-pulse ml-2">
                      {t("admin.juniorpage.dialog.error")}
                    </span>
                  )}
                </div>

                <span className="text-muted-foreground">{t("admin.juniorpage.dialog.rating")}</span>
                <span className="text-yellow-400">{selectedJunior.rating ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.level")}</span>
                <span className="text-orange-400">{selectedJunior.level ?? 1}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.totalExp")}</span>
                <span className="text-blue-400">{selectedJunior.totalExp ?? 0}</span>

                <span className="text-muted-foreground">{t("admin.juniorpage.questsCompleted")}</span>
                <span className="text-accent">{selectedJunior.questsCompleted ?? 0}</span>
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