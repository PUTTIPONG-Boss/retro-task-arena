import React from "react";
import { useTranslation } from "react-i18next";
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
import { useThemeStore } from "@/store/themeStore";

const STALE_TIME = 0;

const SENIOR_ROLE_OPTIONS = [
  { value: "JUNIOR", label: "JUNIOR", color: "text-green-400", bg: "bg-green-900/40", border: "border-green-600" },
  { value: "ADMIN", label: "ADMIN", color: "text-red-400", bg: "bg-red-900/40", border: "border-red-600" },
] as const;

const ManageSenior = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = React.useState("");
  const [selectedSenior, setSelectedSenior] = React.useState<UserProfile | null>(null);
  const { data: seniors = [], isLoading } = useQuery({
    queryKey: ["admin", "users", "senior"],
    queryFn: () => getUsersByRole("SENIOR"),

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
      queryClient.setQueryData<UserProfile[]>(["admin", "users", "senior"], (old) => {
        if (!old) return [];
        return old.filter((u) => u.id !== variables.userId);
      });

      if (variables.role === "JUNIOR") {
        queryClient.setQueryData<UserProfile[]>(["admin", "users", "junior"], (old) => {
          if (!old) return [];
          const exists = old.some((u) => u.id === variables.userId);
          if (exists) {
            return old.map((u) => u.id === variables.userId ? { ...u, role: variables.role } : u);
          }
          if (selectedSenior) {
            return [...old, { ...selectedSenior, role: variables.role }];
          }
          return old;
        });
      }

      queryClient.invalidateQueries({ queryKey: ["admin", "users", "junior"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users", "senior"] });
      setSaveStatus("success");
      setIsEditingRole(false);
      if (selectedSenior) setSelectedSenior({ ...selectedSenior, role: variables.role });
      
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

  const filteredSeniors = seniors.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.id?.toLowerCase().includes(q) ||
      s.username?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  const columns: Column<UserProfile>[] = [
    {
      header: t("admin.seniorpage.id"),
      accessor: (s) => <span className={fontClass}>{s.id.substring(0, 8)}...</span>,
      className: "text-muted-foreground",
      headerClassName: fontClass,
    },
    {
      header: t("admin.seniorpage.username"),
      accessor: (s) => <span className={fontClass}>{s.username}</span>,
      className: "text-foreground",
      headerClassName: fontClass,
    },
    {
      header: t("admin.seniorpage.email"),
      accessor: (s) => <span className={fontClass}>{s.email}</span>,
      className: "text-muted-foreground",
      headerClassName: fontClass,
    },
    {
      header: t("admin.seniorpage.level"),
      accessor: (s) => <span className={fontClass}>{s.level}</span>,
      className: "text-center text-accent",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.seniorpage.totalExp"),
      accessor: (s) => <span className={fontClass}>{s.totalExp}</span>,
      className: "text-center text-accent",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.seniorpage.questsCompleted"),
      accessor: (s) => <span className={fontClass}>{s.questsCompleted}</span>,
      className: "text-center text-accent",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.seniorpage.postedTasks"),
      accessor: (s) => <span className={fontClass}>{s.postedTasks?.length || 0}</span>,
      className: "text-center text-accent",
      headerClassName: "text-center " + fontClass,
    },
    {
      header: t("admin.seniorpage.role"),
      accessor: (s) => (
        <span className={`px-2 py-1 uppercase tracking-wider bg-purple-900/50 text-purple-400 border border-purple-800 ${fontClass}`}>
          {s.role}
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
          {t("admin.seniorpage.manage")}
        </h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`${t("admin.seniorpage.id")}/ ${t("admin.seniorpage.username")}/ ${t("admin.seniorpage.email")}`}
          className={`${inputCls} border text-foreground font-pixel px-3 py-1.5 w-72 hover:border-[#F59E0B] focus:outline-none focus:border-[#F59E0B] transition-colors placeholder:text-muted-foreground ${fontClass}`}
        />
      </div>

      <PixelTable
        columns={columns}
        data={filteredSeniors}
        isLoading={isLoading}
        onRowClick={(s) => setSelectedSenior(s)}
        rowKeyExtractor={(s) => s.id}
        emptyMessage={t("admin.seniorpage.notfoundsenior")}
      />

      <Dialog
        open={!!selectedSenior}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSenior(null);
            setIsEditingRole(false);
            setSaveStatus("idle");
          }
        }}
      >
        <DialogContent className={`${dialogCls} border text-foreground font-pixel max-w-2xl max-h-[90vh] overflow-y-auto`}>

          {selectedSenior && (
            <div className={`space-y-6 ${fontClass}`}>
              {/* Senior Profile Section */}
              <div className="space-y-4">
                <h3 className={`text-accent font-bold border-b border-dashed ${sectionBorderCls} pb-2`}>
                  {t("admin.seniorpage.dialog.title")}
                </h3>
                <div className="grid grid-cols-[160px_1fr] gap-x-3 gap-y-2">
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

                  <span className="text-muted-foreground self-center">{t("admin.seniorpage.role")}</span>
                  <div className="flex items-center gap-2">
                    {isEditingRole ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          value={pendingRole}
                          onChange={(e) => setPendingRole(e.target.value)}
                          className={`${inputCls} border border-[#F59E0B] text-foreground font-pixel px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#F59E0B]`}
                        >
                          {SENIOR_ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className={`${isLight ? "bg-[#EDE4CF]" : "bg-[#12141a]"} text-foreground`}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => roleMutation.mutate({ userId: selectedSenior.id, role: pendingRole })}
                          disabled={roleMutation.isPending}
                          className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white font-pixel text-xs border border-green-500 active:translate-y-[1px] transition-all"
                        >
                          {roleMutation.isPending ? t("admin.seniorpage.dialog.updating") : t("admin.seniorpage.dialog.save")}
                        </button>
                        <button
                          onClick={() => setIsEditingRole(false)}
                          className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white font-pixel text-xs border border-red-500 active:translate-y-[1px] transition-all"
                        >
                          {t("admin.seniorpage.dialog.cancel")}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 uppercase tracking-wider bg-purple-900/50 text-purple-400 border border-purple-800 text-sm">
                          {selectedSenior.role}
                        </span>
                        <button
                          onClick={() => {
                            setPendingRole(SENIOR_ROLE_OPTIONS[0].value);
                            setIsEditingRole(true);
                          }}
                          className="flex items-center gap-1 px-2 py-0.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-400 border border-blue-600 text-xs rounded font-pixel active:translate-y-[1px] transition-all"
                        >
                          <PixelPencil className="w-3.5 h-3.5" size={14} />
                          {t("admin.seniorpage.dialog.editRole")}
                        </button>
                      </div>
                    )}
                    {saveStatus === "success" && (
                      <span className="text-xs text-green-400 animate-pulse ml-2">
                        {t("admin.seniorpage.dialog.success")}
                      </span>
                    )}
                    {saveStatus === "error" && (
                      <span className="text-xs text-red-400 animate-pulse ml-2">
                        {t("admin.seniorpage.dialog.error")}
                      </span>
                    )}
                  </div>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.level")}</span>
                  <span className="text-accent">{selectedSenior.level ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.totalExp")}</span>
                  <span className="text-accent">{selectedSenior.totalExp ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.rating")}</span>
                  <span className="text-yellow-400">{selectedSenior.rating ?? 0}</span>
                </div>
              </div>

              {/* Quest Profile Section */}
              <div className="space-y-4">
                <h3 className={`text-accent font-bold border-b border-dashed ${sectionBorderCls} pb-2`}>
                  {t("admin.seniorpage.dialog.questProfile")}
                </h3>
                <div className="grid grid-cols-[160px_1fr] gap-x-3 gap-y-2">
                  <span className="text-muted-foreground">{t("admin.seniorpage.questsCompleted")}</span>
                  <span className="text-accent">{selectedSenior.questsCompleted ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.openTasksCount")}</span>
                  <span className="text-accent">{selectedSenior.openTasksCount ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.inProgressTasksCount")}</span>
                  <span className="text-accent">{selectedSenior.inProgressTasksCount ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.finishedTasksCount")}</span>
                  <span className="text-accent">{selectedSenior.finishedTasksCount ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.reviewCount")}</span>
                  <span className="text-accent">{selectedSenior.reviewCount ?? 0}</span>

                  <span className="text-muted-foreground">{t("admin.seniorpage.dialog.postedTasksCount")}</span>
                  <span className="text-accent">{selectedSenior.postedTasks?.length ?? 0}</span>
                </div>
              </div>

              {/* Skills Section */}
              <div className={`pt-2 border-t border-dashed ${sectionBorderCls}`}>
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