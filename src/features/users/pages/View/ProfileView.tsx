import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ExpBar from "@/components/ExpBar";
import PixelFrame from "@/components/PixelFrame";
import PixelTrophy from "@/components/icons/PixelTrophy";
import PixelStar from "@/components/icons/PixelStar";
import PixelGem from "@/components/icons/PixelGem";
import PixelMessage from "@/components/icons/PixelMessage";
import { Github, Gitlab, ExternalLink } from "lucide-react";
import { useGetPublicProfile, PublicProfile } from "../../services/publicProfile.service";

// ── Extended profile type ─────────────────────────────────────────────────────
interface ExtendedProfile extends PublicProfile {
  gitlabUsername?: string;
  gitInetUsername?: string;
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="max-w-[980px] mx-auto px-6 py-10 space-y-5">
    <div className="h-44 bg-card pixel-border animate-pulse" />
    <div className="h-28 bg-card pixel-border animate-pulse" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-card pixel-border animate-pulse" />)}
    </div>
    <div className="h-24 bg-card pixel-border animate-pulse" />
  </div>
);

// ── Role config ───────────────────────────────────────────────────────────────
const roleConfig: Record<string, { label: string; dot: string; text: string; border: string; bg: string }> = {
  ADMIN: {
    label: "ADMIN",
    dot: "bg-red-400",
    text: "text-red-400",
    border: "border-red-400/40",
    bg: "bg-red-400/10",
  },
  SENIOR: {
    label: "SENIOR",
    dot: "bg-accent",
    text: "text-accent",
    border: "border-accent/40",
    bg: "bg-accent/10",
  },
  JUNIOR: {
    label: "JUNIOR",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/10",
  },
};

// ── Star Rating display ───────────────────────────────────────────────────────
const StarRating = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <div className="flex gap-1 items-center">
    {Array.from({ length: max }).map((_, i) => (
      <PixelStar
        key={i}
        size={14}
        color={i < Math.round(rating) ? "#FFD700" : "#334155"}
      />
    ))}
  </div>
);

// ── Skill badge ───────────────────────────────────────────────────────────────
const SkillBadge = ({ skill }: { skill: string }) => (
  <span className="inline-flex items-center px-3 py-1 bg-secondary pixel-border font-pixel text-[12px] text-emerald-400 uppercase tracking-widest hover:bg-emerald-400/10 transition-colors">
    {skill}
  </span>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  sub?: React.ReactNode;
}

const StatCard = ({ label, value, color, icon, sub }: StatCardProps) => (
  <div className="bg-card pixel-border p-5 relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
    <div className="absolute right-2 bottom-2 opacity-[0.06] pointer-events-none group-hover:opacity-[0.12] transition-opacity scale-110">
      {icon}
    </div>
    <p className="font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-3">
      {label}
    </p>
    <p className={`font-pixel text-[28px] ${color} pixel-text-shadow leading-none mb-1`}>
      {value}
    </p>
    {sub && <div className="mt-2">{sub}</div>}
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

  const extProfile = profile as ExtendedProfile;
  const role = roleConfig[profile.role] ?? roleConfig["JUNIOR"];

  const nameEn =
    profile.firstNameEn || profile.lastNameEn
      ? `${profile.firstNameEn ?? ""} ${profile.lastNameEn ?? ""}`.trim()
      : null;
  const nameTh =
    profile.firstNameTh || profile.lastNameTh
      ? `${profile.firstNameTh ?? ""} ${profile.lastNameTh ?? ""}`.trim()
      : null;

  const displayName = isTh ? (nameTh ?? nameEn ?? profile.username) : (nameEn ?? nameTh ?? profile.username);
  const subName = isTh ? (nameEn ?? null) : (nameTh ?? null);

  // Handle skills being either string[] or comma-separated string
  const rawSkills = profile.skills;
  const skillsList: string[] = Array.isArray(rawSkills)
    ? rawSkills
    : typeof rawSkills === "string"
    ? (rawSkills as string).split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const avatarLetter = (displayName?.[0] ?? "?").toUpperCase();

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(
        isTh ? "th-TH" : "en-GB",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : null;

  const stats: StatCardProps[] = [
    {
      label: t("profileView.rating", "Rating"),
      value: `${profile.rating ?? 0}/5`,
      color: "text-accent",
      icon: <PixelStar size={72} className="text-accent" />,
      sub: <StarRating rating={profile.rating ?? 0} />,
    },
    {
      label: t("profileView.reviews", "Reviews"),
      value: profile.totalRatings ?? 0,
      color: "text-blue-400",
      icon: <PixelMessage size={72} className="text-blue-400" />,
      sub: (
        <p className="font-pixel text-[12px] text-muted-foreground uppercase tracking-wider">
          {t("profileView.totalReviews", "Total Reviews")}
        </p>
      ),
    },
    {
      label: t("profileView.totalExp", "Total EXP"),
      value: (profile.totalExp ?? 0).toLocaleString(),
      color: "text-purple-400",
      icon: <PixelGem size={72} className="text-purple-400" />,
      sub: (
        <p className="font-pixel text-[12px] text-muted-foreground uppercase tracking-wider">
          {t("profileView.expPoints", "Experience Pts")}
        </p>
      ),
    },
    {
      label: t("profileView.questsCompleted", "Quests Done"),
      value: profile.questsCompleted ?? 0,
      color: "text-accent",
      icon: <PixelTrophy size={72} className="text-accent" />,
      sub: (
        <p className="font-pixel text-[12px] text-muted-foreground uppercase tracking-wider">
          {t("profileView.completedQuests", "Completed")}
        </p>
      ),
    },
  ];

  return (
    <div className="max-w-[980px] mx-auto px-6 py-10">

      {/* ── SECTION 1: Identity ─────────────────────────────────────────────── */}
      <PixelFrame className="mb-5 p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 pixel-border bg-secondary flex items-center justify-center">
              <span className="font-pixel pixel-text-shadow text-white text-[44px] leading-none">
                {avatarLetter}
              </span>
            </div>
            {/* Level badge on avatar */}
            <div className="absolute -bottom-3 -right-3 bg-accent pixel-border px-2 py-0.5 flex items-center gap-1">
              <span className="font-pixel text-[9px] text-accent-foreground uppercase tracking-widest">
                LVL
              </span>
              <span className="font-pixel text-[14px] text-accent-foreground pixel-text-shadow leading-none">
                {profile.level}
              </span>
            </div>
          </div>

          {/* Name + role */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="font-pixel pixel-text-shadow text-white uppercase leading-snug mb-1 text-[20px]">
              {displayName}
            </h1>
            {subName && (
              <p className="font-pixel-body text-muted-foreground mb-2 text-[16px]">
                {subName}
              </p>
            )}
            <p className="font-pixel-body text-muted-foreground/60 truncate mb-4 text-[12px] uppercase tracking-widest">
              {profile.username}
            </p>

            {/* Role badge */}
            <div
              className={`inline-flex items-center gap-2 border px-4 py-1.5 ${role.text} ${role.border} ${role.bg}`}
            >
              <span className={`w-2 h-2 ${role.dot} animate-pulse`} />
              <span className="font-pixel text-[11px] tracking-widest">{role.label}</span>
            </div>
          </div>

          {/* Right column: joined date */}
          <div className="text-center sm:text-right flex-shrink-0 space-y-3">
            {joinedDate && (
              <div>
                <p className="font-pixel text-[12px] text-muted-foreground uppercase tracking-widest mb-1">
                  {t("profileView.memberSince", "Member Since")}
                </p>
                <p className="font-pixel-body text-white text-[14px]">{joinedDate}</p>
              </div>
            )}
          </div>
        </div>
      </PixelFrame>

      {/* ── SECTION 2: Level & EXP + Points ────────────────────────────────── */}
      <div className="mb-5">
        <PixelFrame className="p-6">
          <div className="flex items-center gap-6">
            <div className="pixel-border bg-background px-6 py-4 text-center flex-shrink-0">
              <p className="font-pixel text-[12px] text-muted-foreground uppercase tracking-widest mb-1">
                {t("profileView.level", "Level")}
              </p>
              <p className="font-pixel text-[48px] text-white pixel-text-shadow leading-none">
                {profile.level}
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="font-pixel text-[12px] text-muted-foreground uppercase tracking-widest">
                  {t("profileView.experience", "Experience")}
                </p>
                <p className="font-pixel text-[12px] text-emerald-400">
                  {(profile.totalExp ?? 0).toLocaleString()} EXP
                </p>
              </div>
              <ExpBar level={profile.level} totalExp={profile.totalExp} size="lg" showText />
            </div>
          </div>
        </PixelFrame>

      </div>

      {/* ── SECTION 3: Stats grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ── SECTION 4: Skills ───────────────────────────────────────────────── */}
      {skillsList.length > 0 && (
        <PixelFrame className="mb-5 p-6">
          <p className="font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 inline-block" />
            {t("profileView.skills", "Skills")}
          </p>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </PixelFrame>
      )}

      {/* ── SECTION 5: Links ────────────────────────────────────────────────── */}
      {(profile.github || extProfile.gitlabUsername || extProfile.gitInetUsername) && (
        <PixelFrame className="mb-5 p-6">
          <p className="font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 inline-block" />
            {t("profileView.links", "Links & Accounts")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 pixel-border bg-secondary/50 p-3 hover:bg-white/[0.04] transition-colors group"
              >
                <Github size={16} className="text-white flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-0.5">
                    GitHub
                  </p>
                  <p className="font-pixel-body text-gold text-[18px] truncate group-hover:text-white transition-colors">
                    {profile.github.replace("https://github.com/", "@")}
                  </p>
                </div>
                <ExternalLink size={12} className="text-muted-foreground/50 flex-shrink-0" />
              </a>
            )}

            {extProfile.gitlabUsername && (
              <div className="flex items-center gap-3 pixel-border bg-secondary/50 p-3">
                <Gitlab size={16} className="text-orange-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-0.5">
                    GitLab
                  </p>
                  <p className="font-pixel-body text-white/80 text-[18px] truncate">
                    @{extProfile.gitlabUsername}
                  </p>
                </div>
              </div>
            )}

            {extProfile.gitInetUsername && (
              <div className="flex items-center gap-3 pixel-border bg-secondary/50 p-3">
                <Gitlab size={16} className="text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-pixel text-[16px] text-muted-foreground uppercase tracking-widest mb-0.5">
                    Git INET
                  </p>
                  <p className="font-pixel-body text-white/80 text-[18px] truncate">
                    @{extProfile.gitInetUsername}
                  </p>
                </div>
              </div>
            )}

          </div>
        </PixelFrame>
      )}

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <p className="font-pixel text-[7px] text-muted-foreground/40 text-center mt-10 uppercase tracking-[0.3em]">
        InetQuest Guild Registry
        {profile.userId ? ` · ID ${profile.userId.slice(0, 8).toUpperCase()}` : ""}
      </p>
    </div>
  );
};

export default ProfileView;