import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExpBar from "@/components/ExpBar";
import PixelFrame from "@/components/PixelFrame";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelStar from "@/components/icons/PixelStar";
import PixelGem from "@/components/icons/PixelGem";
import PixelMessage from "@/components/icons/PixelMessage";
import { useGetPublicProfile } from "../../services/publicProfile.service";

// ── Role config ───────────────────────────────────────────────────────────────
const roleConfig = {
  ADMIN: { label: "ADMIN", dot: "bg-red-400", text: "text-red-400", border: "border-red-400/40" },
  SENIOR: { label: "SENIOR", dot: "bg-accent", text: "text-accent", border: "border-accent/40" },
  JUNIOR: { label: "JUNIOR", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-400/40" },
};

// ── Loading skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="max-w-[980px] mx-auto px-6 py-10 space-y-5">
    <div className="h-44 bg-card pixel-border animate-pulse" />
    <div className="h-28 bg-card pixel-border animate-pulse" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-card pixel-border animate-pulse" />)}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => <div key={i} className="h-36 bg-card pixel-border animate-pulse" />)}
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isTh = i18n.language === "th";

  const { data: profile, isLoading, isError } = useGetPublicProfile(id ?? "");

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="font-pixel text-[14px] text-destructive uppercase tracking-widest">
          {t("profileView.error", "Profile not found")}
        </p>
      </div>
    );
  }

  const role = roleConfig[profile.role] ?? roleConfig["JUNIOR"];

  const nameEn = profile.firstNameEn || profile.lastNameEn
    ? `${profile.firstNameEn ?? ""} ${profile.lastNameEn ?? ""}`.trim() : null;
  const nameTh = profile.firstNameTh || profile.lastNameTh
    ? `${profile.firstNameTh ?? ""} ${profile.lastNameTh ?? ""}`.trim() : null;

  const displayName = nameEn ?? nameTh ?? profile.username;
  const subName = nameTh ?? null;

  const joinedDate = new Date(profile.createdAt).toLocaleDateString(
    isTh ? "th-TH" : "en-GB",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const stats = [
    { label: t("profileView.rating", "Rating"), value: profile.rating, color: "text-accent", icon: <PixelStar size={72} className="text-accent" /> },
    { label: t("profileView.reviews", "Reviews"), value: profile.totalRatings, color: "text-blue-400", icon: <PixelMessage size={72} className="text-blue-400" /> },
    { label: t("profileView.totalExp", "Total EXP"), value: profile.totalExp.toLocaleString(), color: "text-purple-400", icon: <PixelGem size={72} className="text-purple-400" /> },
    { label: t("profileView.questsCompleted", "Quests Done"), value: profile.questsCompleted ?? 0, color: "text-accent", icon: <PixelTrophy size={72} className="text-accent" /> },
  ];

  return (
    <div className="max-w-[980px] mx-auto px-6 py-10">

      {/* ── SECTION 1: Identity ────────────────────────── */}
      <PixelFrame className="mb-5 p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

          {/* Avatar */}
          <div className="w-28 h-28 pixel-border bg-secondary flex items-center justify-center flex-shrink-0">
            <span className={`font-pixel pixel-text-shadow text-white ${isTh ? "text-[40px]" : "text-[40px]"}`}>
              {(displayName?.[0] ?? "?").toUpperCase()}
            </span>
          </div>

          {/* Name + role */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className={`font-pixel pixel-text-shadow text-white uppercase leading-snug mb-2 ${isTh ? "text-[20px]" : "text-[20px]"}`}>
              {displayName}
            </h1>
            {subName && (
              <p className={`font-pixel-body text-muted-foreground mb-2 ${isTh ? "text-[20px]" : "text-[20px]"}`}>
                {subName}
              </p>
            )}
            <p className={`font-pixel-body text-muted-foreground truncate mb-4 ${isTh ? "text-[20px]" : "text-[20px]"}`}>
              {profile.username}
            </p>
            <div className={`inline-flex items-center gap-2 border px-4 py-1.5 ${role.text} ${role.border}`}>
              <span className={`w-2.5 h-2.5 ${role.dot} animate-pulse`} />
              <span className="font-pixel text-[12px] tracking-widest">{role.label}</span>
            </div>
          </div>

          {/* Member since */}
          <div className="text-center sm:text-right flex-shrink-0">
            <p className="font-pixel text-[14px] text-muted-foreground uppercase tracking-widest mb-2">
              {t("profileView.memberSince", "Member Since")}
            </p>
            <p className={`font-pixel-body text-white ${isTh ? "text-[20px]" : "text-[20px]"}`}>
              {joinedDate}
            </p>
          </div>
        </div>
      </PixelFrame>

      {/* ── SECTION 2: Level & EXP ────────────────────── */}
      <PixelFrame className="mb-5 p-8">
        <div className="flex items-center gap-8">
          <div className="pixel-border bg-background px-8 py-5 text-center flex-shrink-0">
            <p className="font-pixel text-[14px] text-muted-foreground uppercase tracking-widest mb-2">
              {t("profileView.level", "Level")}
            </p>
            <p className="font-pixel text-[48px] text-white pixel-text-shadow leading-none">
              {profile.level}
            </p>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="font-pixel text-[14px] text-muted-foreground uppercase tracking-widest">
                {t("profileView.experience", "Experience")}
              </p>
              <p className="font-pixel text-[14px] text-emerald-400">
                {profile.totalExp.toLocaleString()} EXP
              </p>
            </div>
            <ExpBar level={profile.level} totalExp={profile.totalExp} size="lg" showText />
          </div>
        </div>
      </PixelFrame>

      {/* ── SECTION 3: Stats grid ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {stats.map(({ label, value, color, icon }) => (
          <div key={label} className="bg-card pixel-border p-6 relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
            <div className="absolute right-3 bottom-2 opacity-[0.07] pointer-events-none group-hover:opacity-[0.13] transition-opacity">
              {icon}
            </div>
            <p className="font-pixel text-[14px] text-muted-foreground uppercase tracking-widest mb-4">
              {label}
            </p>
            <p className={`font-pixel text-[30px] ${color} pixel-text-shadow leading-none`}>
              {value}
            </p>
          </div>
        ))}
      </div>
      {/* Footer */}
      <p className="font-pixel text-[7px] text-muted-foreground/40 text-center mt-10 uppercase tracking-[0.3em]">
        InstQuest Guild Registry · ID {profile.userId.slice(0, 8).toUpperCase()}
      </p>
    </div>
  );
};

export default ProfileView;