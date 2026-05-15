import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { useCreateReview, useGetReviewsByTaskId } from "@/features/bids/services/review.service";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  useUpdateQuestStatus,
  useGetBids,
  useSubmitBid,
  useAcceptBid,
  useUpdateBid,
  useGetQuestById,
  useUpdateQuest,
  useDistributePoints,
} from "../services/quest.service";
import { useGetAllUsers } from "@/features/users/services/user.service";
import { UserProfile } from "@/features/users/types";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { isSeniorOrAdmin } from "@/features/users/utils/roleUtils";
import { getErrorMessage } from "@/lib/errorUtils";
import { useThemeStore } from "@/store/themeStore";
import { useBidSocket } from "@/hooks/useBidSocket";
import PixelCheck from "@/components/icons/PixelCheck";
import PixelUsers from "@/components/icons/PixelUsers";
import PixelHourglass from "@/components/icons/PixelHourglass";
import PixelScroll from "@/components/icons/PixelScroll";
import PixelX from "@/components/icons/PixelX";
import PixelEye from "@/components/icons/PixelEye";
import PortfolioSelector from "../components/PortfolioSelector";

const statusColor: Record<string, string> = {
  open: "text-success",
  bidding: "text-accent",
  "in-progress": "text-accent",
  review: "text-purple-400",
  in_review: "text-purple-400",
  completed: "text-success",
};

const lightStatusColor: Record<string, string> = {
  open: "#2A6E35",
  bidding: "#8B5E10",
  "in-progress": "#8B5E10",
  review: "#6B3A8B",
  in_review: "#6B3A8B",
  completed: "#2A6E35",
};

const getStatusKey = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "review") return "in_review";
  if (s === "in-progress") return "in_progress";
  return s;
};

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // --- Fetch quest directly from API ---
  const { data: quest, isLoading: questLoading } = useGetQuestById(id);

  // --- Fetch reviews if quest is completed ---
  const { data: reviews = [], isLoading: reviewsLoading } = useGetReviewsByTaskId(id);

  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  // --- Hooks ---
  const updateStatus = useUpdateQuestStatus();
  const { data: bids = [], isLoading: bidsLoading } = useGetBids(id);
  const submitBid = useSubmitBid();
  const acceptBid = useAcceptBid();
  const updateQuestMutation = useUpdateQuest();
  const distributePoints = useDistributePoints();
  const [pointsDistributed, setPointsDistributed] = useState(false);
  const [distMode, setDistMode] = useState<"AUTO" | "MANUAL">("AUTO");
  const [manualAllocations, setManualAllocations] = useState<Record<string, number>>({});

  // --- Portfolio selection state ---
  const [portfolioIds, setPortfolioIds] = useState<string[]>([]);
  const [editPortfolioIds, setEditPortfolioIds] = useState<string[]>([]);

  // --- Bid form state ---
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [waitDuration, setWaitDuration] = useState("");
  const [note, setNote] = useState("");
  const [showBidForm, setShowBidForm] = useState(false);

  // --- Edit bid state ---
  const [editMode, setEditMode] = useState(false);
  const [editBidAmount, setEditBidAmount] = useState<number>(0);
  const [editWaitDuration, setEditWaitDuration] = useState("");
  const [editNote, setEditNote] = useState("");
  const updateBid = useUpdateBid();

  const { theme: appTheme } = useThemeStore();
  const isLight = appTheme === "light";

  // --- Team recruitment state ---
  const [selectedTeam, setSelectedTeam] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: searchResults = [] } = useGetAllUsers(debouncedQuery);

  const filteredUsers = searchQuery.trim()
    ? searchResults.filter(u => {
      const query = searchQuery.toLowerCase();
      const nameTh = `${u.firstNameTh || ""} ${u.lastNameTh || ""}`.toLowerCase();
      const nameEn = `${u.firstNameEn || ""} ${u.lastNameEn || ""}`.toLowerCase();
      const username = (u.username || "").toLowerCase();

      return (nameTh.includes(query) || nameEn.includes(query) || username.includes(query)) &&
        !selectedTeam.some(m => m.id === u.id) &&
        u.id !== user?.id;
    })
    : [];

  const handleAddMember = (u: UserProfile) => {
    if (selectedTeam.length >= 10) {
      toast.error(t("questDetail.toast.limitReached") || "Maximum 10 team members reached", {
        style: { fontFamily: '"TA_8bit"', fontSize: '14px' }
      });
      return;
    }
    setSelectedTeam([...selectedTeam, u]);
    setSearchQuery("");
  };

  const handleRemoveMember = (userId: string) => {
    setSelectedTeam(selectedTeam.filter(m => m.id !== userId));
  };
  const isSeniorOrAdminUser = isSeniorOrAdmin(user?.role || "");

  const isOwner = user?.id === quest?.providerId;

  useBidSocket(id, isOwner, quest?.title);

  if (questLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={`font-pixel text-muted-foreground animate-pulse ${fontClass}`}>
          Loading Quest...
        </p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelFrame>
          <p className={`font-pixel text-foreground pixel-text-shadow ${fontClass}`}>
            Quest not found in the archives...
          </p>
          <Link to="/" className="block mt-4">
            <PixelButton variant="primary" size="sm" className={fontClass}>
              Return to Board
            </PixelButton>
          </Link>
        </PixelFrame>
      </div>
    );
  }

  const handleSubmitBid = async () => {
    const toastStyle = { fontFamily: '"TA_8bit"', fontSize: '16px' };
    if (!user) {
      toast.error(t("questDetail.toast.mustLogin"), { style: toastStyle });
      return;
    }
    if (!waitDuration || bidAmount <= 0) {
      toast.error(t("questDetail.toast.fillFields"), { style: toastStyle });
      return;
    }

    if (quest.workType === "TEAM" && selectedTeam.length === 0) {
      toast.error(t("questDetail.toast.teamRequired") || "Please select at least one team member for this team quest", { style: toastStyle });
      return;
    }
    try {
      await submitBid.mutateAsync({
        taskId: quest.id,
        payload: {
          user_id: user.id,
          bid_amount: bidAmount,
          wait_duration: waitDuration,
          note,
          type: selectedTeam.length > 0 ? "TEAM" : "INDIVIDUAL",
          team_members: selectedTeam.map(m => m.id),
          portfolio_task_ids: portfolioIds,
        },
      });
      toast.success(t("questDetail.toast.bidSubmitted"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
      setShowBidForm(false);
      setSelectedTeam([]);
    } catch (e) {
      toast.error(getErrorMessage(e), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
    }
  };

  const handleAcceptBid = async (appId: string) => {
    const selectedBid = bids.find((b) => b.id === appId);
    if (!selectedBid) return;

    try {
      // 1. รับข้อเสนอ (Accept Bid)
      await acceptBid.mutateAsync({ taskId: quest.id, appId });

      // 2. อัปเดตเวลาของ Quest ให้ตรงกับที่ตกลงกันใน Bid (ทำแบบเดียวกับที่ระบบอัปเดต Point)
      await updateQuestMutation.mutateAsync({
        id: quest.id,
        payload: {
          estimated_time: selectedBid.waitDuration || "",
        },
      });

      toast.success(t("questDetail.toast.bidAccepted"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
    } catch (e) {
      toast.error(getErrorMessage(e), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
    }
  };

  const myBid = bids.find((b) =>
    (b.userId || (b as any).user_id) === user?.id ||
    b.teamMembers?.some(m => m.userId === user?.id)
  );

  const isBidder = myBid && (myBid.userId || (myBid as any).user_id) === user?.id;
  const isTeamMember = myBid && !isBidder;
  const myBidStatus = isBidder ? "BIDDER" : isTeamMember ? "TEAM_MEMBER" : null;

  const isUserInAnyBid = bids.some(bid =>
    bid.userId === user?.id ||
    bid.teamMembers?.some(m => m.userId === user?.id)
  );

  const handleEditBid = () => {
    if (!myBid) return;
    setEditBidAmount(myBid.bidAmount);
    setEditWaitDuration(myBid.waitDuration);
    setEditNote(myBid.note || "");

    // Populate selectedTeam from myBid.teamMembers for editing
    if (myBid.teamMembers) {
      setSelectedTeam(myBid.teamMembers.map(m => ({
        id: m.userId,
        username: m.username,
        firstNameTh: m.firstName,
        lastNameTh: m.lastName,
        level: m.level ?? 0,
        rating: m.rating ?? 0,
        questsCompleted: 0,
        title: "",
        totalExp: 0,
        points: 0,
        totalRatings: 0,
        github: "",
        joinedDate: "",
        role: "",
        skills: [],
        linkin: ""
      } as UserProfile)));
    } else {
      setSelectedTeam([]);
    }

    setEditPortfolioIds(myBid.portfolioTasks?.map(t => t.id) || []);
    setEditMode(true);
  };

  const handleUpdateBid = async () => {
    if (!user || !myBid) return;
    if (!editWaitDuration || editBidAmount <= 0) {
      toast.error(t("questDetail.toast.fillFields"), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
      return;
    }
    try {
      await updateBid.mutateAsync({
        taskId: quest.id,
        bidId: myBid.id,
        payload: {
          user_id: user.id,
          bid_amount: editBidAmount,
          wait_duration: editWaitDuration,
          note: editNote,
          type: selectedTeam.length > 0 ? "TEAM" : "INDIVIDUAL",
          team_members: selectedTeam.map(m => m.id),
          portfolio_task_ids: editPortfolioIds,
        },
      });
      toast.success(t("questDetail.editbid.SuccessMsg"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
      setEditMode(false);
      setSelectedTeam([]);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || t("questDetail.editbid.FailMsg"), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
    }
  };

  return (
    <div className={`max-w-[1280px] mx-auto px-4 py-8 ${fontClass}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <PixelButton
          variant="danger"
          size="sm"
          className={fontClass}
          onClick={() => navigate("/")}
        >
          ← {t("questDetail.back")}
        </PixelButton>
        {isOwner && (
          <Link to={`/quest/${quest.id}/edit`}>
            <button className={`pixel-border bg-secondary hover:bg-muted px-4 py-2 font-pixel text-accent transition-colors ${fontClass}`}>
              {t("questDetail.edit")}
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PixelFrame>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`font-pixel uppercase tracking-widest text-muted-foreground ${fontClass}`}>
                  {quest.category}
                </span>
                {quest.workType && (
                  <span className={`font-pixel uppercase text-accent ${fontClass}`}>
                    [{t(`createQuest.workTypes.${quest.workType.toUpperCase()}`)}]
                  </span>
                )}
              </div>
              <span
                className={`font-pixel uppercase ${!isLight ? (statusColor[quest.status] || "text-success") : ""} ${fontClass}`}
                style={isLight ? { color: lightStatusColor[quest.status] || "#2A6E35" } : undefined}
              >
                ● {t(`questDetail.status.${getStatusKey(quest.status)}`)}
              </span>
            </div>

            <h1
              className={`font-pixel pixel-text-shadow leading-relaxed mb-4 break-words overflow-hidden ${!isLight ? "text-gold" : ""} ${fontClass}`}
              style={isLight ? { color: "#3D1C08" } : undefined}
            >
              {quest.title}
            </h1>

            <div className={`flex items-center gap-4 mb-6 ${fontClass}`}>
              <Coins size={14} className="inline mr-1 text-gold" /> {quest.rewardPoints} {t("questDetail.GP")}
              <DifficultyStars level={quest.difficulty} />
              <span className={`font-pixel text-muted-foreground flex items-center gap-1 ${fontClass}`}>
                <PixelHourglass size={14} color="currentColor" className="text-gold" /> {quest.estimatedTime}
              </span>
            </div>

            {quest.skills && (
              <div className="flex flex-wrap gap-2 mb-6">
                {quest.skills.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className={`pixel-text px-3 py-1 uppercase ${fontClass}`}
                    style={isLight
                      ? { backgroundColor: "#C89A50", border: "1px solid #8B5A20", color: "#3D1C08" }
                      : { backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--accent))" }
                    }
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t-2 border-border pt-4">
              <h2 className={`font-pixel text-foreground mb-3 ${fontClass}`}>
                {t("questDetail.questdetailboard")}
              </h2>
              <div className={`leading-relaxed text-foreground/80 whitespace-pre-line break-all overflow-hidden ${fontClass}`}>
                {quest.fullDescription}
              </div>
            </div>
          </PixelFrame>

          {/* ===== REVIEW SECTION ===== */}
          {quest.status === "completed" && (
            <PixelFrame className="border-accent bg-accent/5">
              <h2 className={`font-pixel text-accent pixel-text-shadow mb-4 flex items-center gap-2 ${fontClass}`}>
                {t("questDetail.finalReview.title")}
              </h2>

              {reviewsLoading ? (
                <p className={`font-pixel text-muted-foreground animate-pulse ${fontClass}`}>{t("questBoard.loading")}</p>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className={`font-pixel text-foreground ${fontClass}`}>{t("questDetail.finalReview.rating")}:</span>
                    <DifficultyStars level={Math.round(reviews[0].rating)} />
                    <span className="text-gold font-pixel ml-1">({reviews[0].rating.toFixed(1)})</span>
                  </div>
                  <div className="pixel-inset bg-background/50 p-4 border-l-4 border-accent">
                    <p className={`text-muted-foreground uppercase text-[10px] mb-2 font-pixel tracking-tighter ${fontClass}`}>
                      {t("questDetail.finalReview.comment")}
                    </p>
                    <p className={`text-foreground italic leading-relaxed whitespace-pre-line ${fontClass}`}>
                      "{reviews[0].comment}"
                    </p>
                  </div>
                </div>
              ) : (
                <p className={`font-pixel text-muted-foreground ${fontClass}`}>
                  {t("questDetail.finalReview.noReview")}
                </p>
              )}
            </PixelFrame>
          )}

          {/* ===== POINT DISTRIBUTION SECTION (Team Leader Only) ===== */}
          {quest.status === "completed" && (quest.workType === "TEAM" || quest.workType === "BOTH") && isBidder && myBid?.status === "ACCEPTED" && myBid.teamMembers && myBid.teamMembers.length > 0 && !pointsDistributed && (() => {
            const allMembers = [
              { userId: myBid.userId, username: myBid.username, firstName: "", lastName: "", isLeader: true },
              ...myBid.teamMembers.map(m => ({ ...m, isLeader: false })),
            ];
            const totalPoints = quest.rewardPoints;
            const totalAllocated = Object.values(manualAllocations).reduce((sum, v) => sum + (v || 0), 0);
            const remaining = totalPoints - totalAllocated;

            return (
              <PixelFrame className="border-gold bg-gold/5">
                <h2 className={`font-pixel text-gold pixel-text-shadow mb-4 flex items-center gap-2 ${fontClass}`}>
                  <Coins size={18} className="text-gold" /> {t("questDetail.pointDistribution.title")}
                </h2>
                <p className={`text-muted-foreground mb-4 ${fontClass}`}>
                  {t("questDetail.pointDistribution.totalPoint")} <span className="text-gold font-semibold">{totalPoints} GP</span>
                </p>

                {/* Mode Selection */}
                <div className="flex gap-3 mb-6">
                  <button
                    className={`pixel-border px-4 py-2 font-pixel transition-colors ${fontClass} ${distMode === "AUTO"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                      }`}
                    onClick={() => setDistMode("AUTO")}
                  >
                    ⚖ {t("questDetail.pointDistribution.autoMode")}
                  </button>
                  <button
                    className={`pixel-border px-4 py-2 font-pixel transition-colors ${fontClass} ${distMode === "MANUAL"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-muted"
                      }`}
                    onClick={() => {
                      setDistMode("MANUAL");
                      // Initialize allocations if empty
                      if (Object.keys(manualAllocations).length === 0) {
                        const init: Record<string, number> = {};
                        allMembers.forEach(m => { init[m.userId] = 0; });
                        setManualAllocations(init);
                      }
                    }}
                  >
                    ✏ {t("questDetail.pointDistribution.manualMode")}
                  </button>
                </div>

                {distMode === "AUTO" ? (
                  <div className="space-y-3">
                    <div className="pixel-inset bg-background/50 p-4">
                      <p className={`font-pixel text-foreground mb-2 ${fontClass}`}>
                        {t("questDetail.pointDistribution.eachReceive")} <span className="text-gold font-semibold">{Math.floor(totalPoints / allMembers.length)} GP</span>
                        {totalPoints % allMembers.length > 0 && (
                          <span className="text-muted-foreground text-[12px] ml-2">{t("questDetail.pointDistribution.remainder", { remainder: totalPoints % allMembers.length })}</span>
                        )}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {allMembers.map(m => (
                          <div key={m.userId} className="pixel-border border-border/50 bg-secondary/50 p-3 flex justify-between items-center">
                            <div>
                              <p className={`font-pixel text-accent text-[14px] ${fontClass}`}>
                                {m.username} {m.isLeader && <span className="text-gold text-[10px]">★ {t("questDetail.pointDistribution.leader")}</span>}
                              </p>
                            </div>
                            <span className="font-pixel text-gold">{Math.floor(totalPoints / allMembers.length)} GP</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <PixelButton
                      variant="gold"
                      size="md"
                      className={`w-full ${fontClass}`}
                      onClick={async () => {
                        try {
                          await distributePoints.mutateAsync({
                            taskId: quest.id,
                            payload: { mode: "AUTO" },
                          });
                          toast.success(t("questDetail.pointDistribution.successMsg"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
                          setPointsDistributed(true);
                        } catch (e) {
                          toast.error(getErrorMessage(e), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
                        }
                      }}
                      disabled={distributePoints.isPending}
                    >
                      <span className={fontClass}>{distributePoints.isPending ? t("questDetail.pointDistribution.distributing") : `⚖ ${t("questDetail.pointDistribution.confirmAuto")}`}</span>
                    </PixelButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="pixel-inset bg-background/50 p-4">
                      <div className="flex justify-between items-center mb-3">
                        <p className={`font-pixel text-foreground ${fontClass}`}>{t("questDetail.pointDistribution.fillPoint")}</p>
                        <p className={`font-pixel ${remaining < 0 ? 'text-red-400' : remaining === 0 ? 'text-success' : 'text-gold'} ${fontClass}`}>
                          {t("questDetail.pointDistribution.remaining")} {remaining} / {totalPoints} GP
                        </p>
                      </div>
                      <div className="space-y-2">
                        {allMembers.map(m => (
                          <div key={m.userId} className="pixel-border border-border/50 bg-secondary/50 p-3 flex justify-between items-center gap-3">
                            <div className="flex-1">
                              <p className={`font-pixel text-accent text-[14px] ${fontClass}`}>
                                {m.username} {m.isLeader && <span className="text-gold text-[10px]">★ {t("questDetail.pointDistribution.leader")}</span>}
                              </p>
                              {!m.isLeader && m.firstName && (
                                <p className="text-[12px] text-muted-foreground font-pixel">{m.firstName} {m.lastName}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                max={totalPoints}
                                value={manualAllocations[m.userId] || ""}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === "") {
                                    setManualAllocations(prev => ({ ...prev, [m.userId]: 0 }));
                                    return;
                                  }
                                  const val = Math.max(0, Math.min(totalPoints, Number(raw)));
                                  setManualAllocations(prev => ({ ...prev, [m.userId]: val }));
                                }}
                                placeholder="0"
                                className={`w-[80px] bg-background border-2 border-border px-2 py-1 text-foreground font-pixel text-center focus:outline-none focus:border-accent ${fontClass}`}
                              />
                              <span className="font-pixel text-muted-foreground text-[12px]">GP</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {remaining < 0 && (
                      <p className={`font-pixel text-red-400 text-[12px] ${fontClass}`}>
                        {t("questDetail.pointDistribution.exceedPoint", { total: totalPoints })}
                      </p>
                    )}

                    <PixelButton
                      variant="gold"
                      size="md"
                      className={`w-full ${fontClass}`}
                      onClick={async () => {
                        if (remaining < 0) {
                          toast.error(t("questDetail.pointDistribution.exceedPointToast"), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
                          return;
                        }
                        if (totalAllocated === 0) {
                          toast.error(t("questDetail.pointDistribution.minOnePerson"), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
                          return;
                        }
                        try {
                          await distributePoints.mutateAsync({
                            taskId: quest.id,
                            payload: {
                              mode: "MANUAL",
                              allocations: allMembers
                                .filter(m => (manualAllocations[m.userId] || 0) > 0)
                                .map(m => ({
                                  user_id: m.userId,
                                  point: manualAllocations[m.userId] || 0,
                                })),
                            },
                          });
                          toast.success(t("questDetail.pointDistribution.successMsg"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
                          setPointsDistributed(true);
                        } catch (e) {
                          toast.error(getErrorMessage(e), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
                        }
                      }}
                      disabled={distributePoints.isPending || remaining < 0}
                    >
                      <span className={fontClass}>{distributePoints.isPending ? t("questDetail.pointDistribution.distributing") : `✏ ${t("questDetail.pointDistribution.confirmManual")}`}</span>
                    </PixelButton>
                  </div>
                )}
              </PixelFrame>
            );
          })()}

          {/* ===== BID SECTION ===== */}
          {/* OWNER VIEW: see all bids with details */}
          {isOwner && quest.status === "open" && (
            <PixelFrame>
              <h2 className={`font-pixel text-foreground pixel-text-shadow mb-4 flex items-center gap-2 ${fontClass}`}>
                <PixelScroll size={16} color="currentColor" className="text-gold" /> {t("questDetail.OwnerQuest.aventurerbids")}
                {bidsLoading ? (
                  <span className={`text-muted-foreground ml-2 ${fontClass}`}>{t("questBoard.loading")}</span>
                ) : (
                  <span className={`text-muted-foreground ml-2 ${fontClass}`}>({bids.length})</span>
                )}
              </h2>

              {bids.length === 0 ? (
                <p className={`font-pixel text-muted-foreground ${fontClass}`}>{t("questDetail.OwnerQuest.nobid")}</p>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className={`pixel-border bg-secondary p-4 flex flex-col sm:flex-row justify-between gap-4 ${fontClass}`}
                    >
                      <div className="flex-1">
                        {/* Bidder Header */}
                        <p className={`font-pixel text-foreground mb-1 break-words flex items-center gap-2 ${fontClass}`}>
                          {bid.username}
                          <Link to={`/profile/view/${bid.userId}`} className="text-muted-foreground hover:text-accent transition-colors" title="View Profile">
                            <PixelEye size={16} />
                          </Link>
                        </p>

                        <p className={`text-muted-foreground flex items-center gap-1 text-[12px] ${fontClass}`}>
                          <PixelScroll size={12} color="currentColor" className="text-gold" /> {bid.questsCompleted} {t("questDetail.OwnerQuest.quest")} · ★ {bid.rating.toFixed(1)}
                        </p>

                        {/* Bid Note */}
                        {bid.note && (
                          <p className={`text-foreground/70 mt-2 italic break-words overflow-hidden text-[13px] ${fontClass}`}>
                            "{bid.note}"
                          </p>
                        )}

                        {/* Team Members */}
                        {bid.teamMembers && bid.teamMembers.length > 0 && (
                          <div className="mt-4 border-t border-border/30 pt-3">
                            <p className={`text-[12px] text-accent font-pixel flex items-center gap-1 mb-2 ${fontClass}`}>
                              <PixelUsers size={14} className="text-gold" /> {bid.teamMembers.length > 1 ? t("questDetail.teamMembers") : t("questDetail.teamMember")}: {bid.teamMembers.length} {bid.teamMembers.length > 1 ? t("questDetail.members") : t("questDetail.member")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {bid.teamMembers.map((m) => (
                                <div key={m.userId} className="pixel-border border-border/50 bg-background/40 p-3 flex flex-col relative group">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-[14px] font-pixel text-accent">{m.username}</p>
                                      <p className="text-[12px] font-pixel text-foreground/80">{m.firstName} {m.lastName}</p>
                                    </div>
                                    {(quest?.status === "in-progress" || quest?.status === "review") && bid.status === "ACCEPTED" && (
                                      <PixelButton
                                        variant="gold"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => navigate(`/quest/${quest.id}/workspace`)}
                                      >
                                        <span className="text-[10px]">{t("questDetail.sidebar.openWorkspace")}</span>
                                      </PixelButton>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Portfolio Tasks */}
                        <div className="border-t border-border/30 mt-4 pt-3">
                          <p className={`text-[12px] text-accent font-pixel flex items-center gap-1 mb-2 ${fontClass}`}>
                            <PixelScroll size={13} color="currentColor" className="text-gold" />
                            {t("questDetail.portfolio.titlePlain")}
                            {bid.portfolioTasks && bid.portfolioTasks.length > 0
                              ? ` (${t("questDetail.portfolio.itemsCount", { count: bid.portfolioTasks.length })})`
                              : ""}
                          </p>
                          {bid.portfolioTasks && bid.portfolioTasks.length > 0 ? (
                            <div className="space-y-1.5">
                              {bid.portfolioTasks.map((pt) => (
                                <Link
                                  key={pt.id}
                                  to={`/quest/${pt.id}`}
                                  className="flex items-center justify-between gap-3 pixel-border border-border/40 bg-background/40 hover:bg-accent/10 hover:border-accent/50 transition-colors px-3 py-2 cursor-pointer group"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className={`font-pixel text-foreground group-hover:text-accent transition-colors text-[12px] truncate ${fontClass}`}>
                                      {pt.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className={`text-[10px] font-pixel uppercase text-muted-foreground ${fontClass}`}>
                                        {pt.category}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                                    {pt.completedAt && (
                                      <span className={`font-pixel text-muted-foreground text-[10px] ${fontClass}`}>
                                        {new Date(pt.completedAt).toLocaleDateString('th-TH')}
                                      </span>
                                    )}
                                    <span className="text-muted-foreground/50 group-hover:text-accent transition-colors text-[10px] font-pixel">→</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className={`text-muted-foreground/60 text-[11px] font-pixel italic ${fontClass}`}>
                              {t("questDetail.portfolio.noAttached")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bid Actions/Stats */}
                      <div className="text-right flex flex-col justify-between items-end min-w-[160px] gap-4">
                        <div className="space-y-1">
                          <div className={`font-pixel text-gold text-[16px] ${fontClass}`}>
                            <Coins size={14} className="inline mr-1" /> {bid.bidAmount} {t("questDetail.OwnerQuest.GP")}
                          </div>
                          <p className={`text-[12px] text-muted-foreground flex items-center gap-1 justify-end ${fontClass}`}>
                            <PixelHourglass size={12} color="currentColor" className="text-gold" /> {bid.waitDuration}
                          </p>
                        </div>

                        <div className="flex justify-end gap-2">
                          {bid.status === "PENDING" && (
                            <PixelButton
                              variant="gold"
                              size="sm"
                              className={fontClass}
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={acceptBid.isPending}
                            >
                              <span className={`flex items-center gap-1 ${fontClass}`}>
                                <PixelCheck size={14} color="#4ade80" /> {t("questDetail.acceptbid")}
                              </span>
                            </PixelButton>
                          )}
                          {bid.status === "ACCEPTED" && (
                            <span className={`font-pixel text-success flex items-center gap-1 ${fontClass}`}>
                              <PixelCheck size={14} color="#4ade80" /> {t("questDetail.accept")}
                            </span>
                          )}
                          {bid.status === "REJECTED" && (
                            <span className={`font-pixel text-muted-foreground flex items-center gap-1 ${fontClass}`}>
                              <PixelX size={12} color="currentColor" /> {t("questDetail.reject")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PixelFrame>
          )}

          {/* REGULAR USER VIEW: see only count + submit bid */}
          {!isOwner && quest.status === "open" && (
            <>
              <PixelFrame>
                {/* Recruitment Section */}
                {(quest.workType === "TEAM" || quest.workType === "BOTH") && (
                  <div className="mb-6 border-b-2 border-border pb-6">
                    <h3 className={`font-pixel text-accent mb-1 flex items-center gap-2 ${fontClass}`}>
                      <PixelUsers size={20} className="text-gold" /> {t("questDetail.recruitment.title")} ({selectedTeam.length}/10)
                    </h3>
                    <p className={`text-[12px] text-muted-foreground font-pixel mb-4 ${fontClass}`}>
                      {t("questDetail.recruitmentNote")}
                    </p>

                    {(!isUserInAnyBid || editMode) && (
                      <div className="relative mb-4 flex items-center">
                        <input
                          type="text"
                          placeholder={t("questDetail.recruitment.searchPlaceholder")}
                          className={`w-full bg-background border-2 border-border px-3 py-2 pr-10 text-foreground font-pixel focus:outline-none focus:border-accent ${fontClass}`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 text-red-500 hover:text-red-400 transition-colors"
                            title={t("questDetail.recruitment.clearSearch")}
                          >
                            <PixelX size={14} color="currentColor" />
                          </button>
                        )}

                        {searchQuery && filteredUsers.length > 0 && (
                          <div className="absolute z-50 w-full bg-secondary border-2 border-border mt-1 top-full max-h-60 overflow-y-auto shadow-xl">
                            {filteredUsers.map((u) => (
                              <div
                                key={u.id}
                                className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-0 group"
                                onClick={() => handleAddMember(u)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-pixel text-foreground group-hover:text-gold transition-colors">
                                      {u.username}
                                    </p>
                                    <p className="text-[14px] text-muted-foreground font-pixel">
                                      {u.firstNameTh} {u.lastNameTh} {u.firstNameEn && u.lastNameEn && `(${u.firstNameEn} ${u.lastNameEn})`}
                                    </p>
                                  </div>
                                  <div className="text-right text-[14px] font-pixel text-muted-foreground">
                                    <p>Lvl {u.level}</p>
                                    <p>★ {u.rating.toFixed(1)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedTeam.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {selectedTeam.map((u) => (
                          <div
                            key={u.id}
                            className="relative pixel-border border-accent bg-secondary/50 p-4 animate-pixel-fade-in"
                          >
                            <button
                              onClick={() => handleRemoveMember(u.id)}
                              className="absolute -top-2 -right-2 bg-background border-2 border-border p-1 text-muted-foreground hover:text-red-400 transition-colors z-10"
                              title={t("questDetail.recruitment.removeMember")}
                            >
                              <PixelX size={12} />
                            </button>

                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="font-pixel text-accent text-[14px]">
                                  {u.username}
                                </p>
                                <div className="text-[12px] font-pixel text-foreground/90">
                                  <p>{u.firstNameTh} {u.lastNameTh}</p>
                                  {u.firstNameEn && u.lastNameEn && (
                                    <p className="text-muted-foreground text-[10px]">
                                      {u.firstNameEn} {u.lastNameEn}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right text-[12px] font-pixel text-muted-foreground">
                                <p className="text-gold">Lvl {u.level}</p>
                                <p className="text-yellow-400">★ {u.rating.toFixed(1)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <h2 className={`font-pixel text-foreground pixel-text-shadow mb-2 flex items-center gap-2 ${fontClass}`}>
                  <PixelUsers size={20} color="currentColor" className="text-gold" /> {bids.length} {t("questDetail.ownerbids")}
                </h2>
                <p className={`text-muted-foreground mb-4 ${fontClass}`}>
                  {t("questDetail.bidsdetail")}
                </p>

                {myBid ? (
                  <div className={`pixel-border bg-secondary p-4 mt-3 ${fontClass}`}>
                    {editMode ? (
                      /* ── EDIT FORM ── */
                      <div className="space-y-3">
                        <p className={`font-pixel text-accent mb-2 ${fontClass}`}> {t("questDetail.editbid.editbids")}</p>
                        <div>
                          <label className={`font-pixel text-muted-foreground block mb-1 ${fontClass}`}>{t("questDetail.editbid.bidamount")}</label>
                          <input
                            type="number"
                            value={editBidAmount}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val <= 1000) setEditBidAmount(val);
                            }}
                            className={`w-full bg-background border border-border px-3 py-2 text-foreground font-pixel focus:outline-none focus:border-accent ${fontClass}`}
                            min={1}
                            max={1000}
                          />
                        </div>
                        <div>
                          <label className={`font-pixel text-muted-foreground block mb-1 ${fontClass}`}>{t("questDetail.editbid.waitduration")}</label>
                          <input
                            type="text"
                            value={editWaitDuration}
                            onChange={(e) => setEditWaitDuration(e.target.value)}
                            className={`w-full bg-background border border-border px-3 py-2 text-foreground font-pixel focus:outline-none focus:border-accent ${fontClass}`}
                            placeholder="e.g. 3 days, 1 week"
                          />
                        </div>
                        <div>
                          <label className={`font-pixel text-muted-foreground block mb-1 ${fontClass}`}>{t("questDetail.editbid.note")}</label>
                          <textarea
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            rows={2}
                            className={`w-full bg-background border border-border px-3 py-2 text-foreground font-pixel focus:outline-none focus:border-accent resize-none ${fontClass}`}
                          />
                        </div>
                        {/* ── PORTFOLIO SELECTOR (EDIT MODE) ── */}
                        <div>
                          <PortfolioSelector
                            selectedIds={editPortfolioIds}
                            onChange={setEditPortfolioIds}
                            fontClass={fontClass}
                            initialSelectedTasks={myBid?.portfolioTasks?.map(t => ({ id: t.id, title: t.title })) || []}
                          />
                        </div>
                        <div className="flex gap-3">
                          <PixelButton
                            variant="gold"
                            size="sm"
                            className={`flex-1 ${fontClass}`}
                            onClick={handleUpdateBid}
                            disabled={updateBid.isPending}
                          >
                            <span className={fontClass}>{updateBid.isPending ? t("questDetail.editbid.Saving") : t("questDetail.editbid.SuccessSave")}</span>
                          </PixelButton>
                          <PixelButton variant="ghost" size="sm" className={fontClass} onClick={() => {
                            setEditMode(false);
                            setSelectedTeam([]);
                          }}>
                            <span className={fontClass}>{t("questDetail.editbid.btncancel")}</span>
                          </PixelButton>
                        </div>
                      </div>
                    ) : (
                      /* ── VIEW MODE ── */
                      <>
                        <div className="flex justify-between items-start">
                          <p className={`font-pixel text-success mb-1 flex items-center gap-1 ${fontClass}`}><PixelCheck size={18} color="#4ade80" /> {myBidStatus === "BIDDER" ? t("questDetail.viewmode.yourbidsub") : t("questDetail.viewmode.teambidsub") || "Your team's bid has been submitted!"}</p>
                        </div>
                        {myBidStatus === "TEAM_MEMBER" && (
                          <p className={`text-foreground mb-1 ${fontClass}`}>
                            {t("questDetail.teamLeader")}: <span className="text-accent">{myBid.username}</span>
                          </p>
                        )}
                        <p className={`text-foreground ${fontClass}`}>{t("questDetail.viewmode.amount")} : <span className="text-accent">{myBid.bidAmount} {t("questDetail.viewmode.GP")}</span></p>
                        <p className={`text-muted-foreground ${fontClass}`}>{t("questDetail.viewmode.duration")}: {myBid.waitDuration}</p>
                        {myBid.note && <p className={`text-muted-foreground mt-1 break-words overflow-hidden ${fontClass}`}>{t("questDetail.viewmode.note")}: {myBid.note}</p>}
                        <p className={`mt-2 ${fontClass}`}>
                          {t("questDetail.viewmode.status")}:
                          <span className={myBid.status === "ACCEPTED" ? "text-success font-semibold" : myBid.status === "REJECTED" ? "text-red-400" : "text-muted-foreground"}>
                            {myBid.status}
                          </span>
                        </p>

                        {myBid.teamMembers && myBid.teamMembers.length > 0 && (
                          <div className="mt-4 border-t border-border/30 pt-3">
                            <p className={`text-[12px] text-accent font-pixel flex items-center gap-1 mb-2 ${fontClass}`}>
                              <PixelUsers size={14} className="text-gold" /> {myBid.teamMembers.length > 1 ? t("questDetail.teamMembers") : t("questDetail.teamMember")}: {myBid.teamMembers.length} {myBid.teamMembers.length > 1 ? t("questDetail.members") : t("questDetail.member")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {myBid.teamMembers.map((m) => (
                                <div key={m.userId} className="pixel-border border-border/50 bg-background/40 p-4 flex flex-col relative group">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-[14px] font-pixel text-accent">{m.username}</p>
                                      <p className="text-[14px] font-pixel text-foreground/80">{m.firstName} {m.lastName}</p>
                                    </div>
                                    {(quest.status === "in-progress" || quest.status === "review") && myBid.status === "ACCEPTED" && (
                                      <PixelButton
                                        variant="gold"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => navigate(`/quest/${quest.id}/workspace`)}
                                      >
                                        <span className="text-[10px]">{t("questDetail.sidebar.openWorkspace")}</span>
                                      </PixelButton>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {myBid.portfolioTasks && myBid.portfolioTasks.length > 0 && (
                          <div className="mt-4 border-t border-border/30 pt-3">
                            <p className={`text-[12px] text-accent font-pixel flex items-center gap-1 mb-2 ${fontClass}`}>
                              <PixelScroll size={13} color="currentColor" className="text-gold" />
                              {t("questDetail.portfolio.title", { count: myBid.portfolioTasks.length })}
                            </p>
                            <div className="space-y-1.5">
                              {myBid.portfolioTasks.map((pt) => (
                                <Link
                                  key={pt.id}
                                  to={`/quest/${pt.id}`}
                                  className="flex items-center justify-between gap-3 pixel-border border-border/40 bg-background/40 hover:bg-accent/10 hover:border-accent/50 transition-colors px-3 py-2 cursor-pointer group"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className={`font-pixel text-foreground group-hover:text-accent transition-colors text-[12px] truncate ${fontClass}`}>
                                      {pt.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className={`text-[10px] font-pixel uppercase text-muted-foreground ${fontClass}`}>
                                        {pt.category}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0 flex items-center gap-2">
                                    {pt.completedAt && (
                                      <span className={`font-pixel text-muted-foreground text-[10px] ${fontClass}`}>
                                        {new Date(pt.completedAt).toLocaleDateString('th-TH')}
                                      </span>
                                    )}
                                    <span className="text-muted-foreground/50 group-hover:text-accent transition-colors text-[10px] font-pixel">→</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {myBidStatus === "BIDDER" && myBid.status === "PENDING" && (
                          <PixelButton
                            variant="gold"
                            size="md"
                            className={`w-full mt-4 ${fontClass}`}
                            onClick={handleEditBid}
                          >
                            <span className={fontClass}>⚙ {t("questDetail.editbid.editbids")}</span>
                          </PixelButton>
                        )}
                      </>
                    )}
                  </div>
                ) : showBidForm ? (
                  <div className={`space-y-4 mt-3 ${fontClass}`}>
                    <div>
                      <label className={`font-pixel text-muted-foreground block mb-1 ${fontClass}`}>{t("questDetail.bidamount")}</label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val <= 1000) setBidAmount(val);
                        }}
                        className={`w-full bg-secondary border border-border px-3 py-2 text-foreground font-pixel focus:outline-none focus:border-accent ${fontClass}`}
                        placeholder="e.g. 500"
                        min={1}
                        max={1000}
                      />
                    </div>
                    <div>
                      <label className={`font-pixel text-muted-foreground block mb-1 ${fontClass}`}>{t("questDetail.waitduration")}</label>
                      <input
                        type="text"
                        value={waitDuration}
                        onChange={(e) => setWaitDuration(e.target.value)}
                        className={`w-full bg-secondary border border-border px-3 py-2 text-foreground font-pixel focus:outline-none focus:border-accent ${fontClass}`}
                        placeholder="e.g. 3 days, 1 week"
                      />
                    </div>
                    <div>
                      <label className={`font-pixel text-muted-foreground block mb-1 ${fontClass}`}>{t("questDetail.note")}</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className={`w-full bg-secondary border border-border px-3 py-2 text-foreground font-pixel focus:outline-none focus:border-accent resize-none ${fontClass}`}
                        placeholder={t("questDetail.whatsolution")}
                      />
                    </div>
                    <div>
                      <PortfolioSelector
                        selectedIds={portfolioIds}
                        onChange={setPortfolioIds}
                        fontClass={fontClass}
                      />
                    </div>
                    <div className="flex gap-3">
                      <PixelButton
                        variant="gold"
                        size="md"
                        className={`flex-1 ${fontClass}`}
                        onClick={handleSubmitBid}
                        disabled={submitBid.isPending}
                      >
                        <span className={fontClass}>{submitBid.isPending ? t("questDetail.Submitting") : t("questDetail.btnbids")}</span>
                      </PixelButton>
                      <PixelButton
                        variant="ghost"
                        size="md"
                        className={fontClass}
                        onClick={() => setShowBidForm(false)}
                      >
                        <span className={fontClass}> {t("questDetail.btncancel")}</span>
                      </PixelButton>
                    </div>
                  </div>
                ) : (
                  <PixelButton
                    variant="gold"
                    size="md"
                    className={`w-full mt-2 ${fontClass}`}
                    onClick={() => {
                      setBidAmount(quest.rewardPoints);
                      setWaitDuration(quest.estimatedTime);
                      setShowBidForm(true);
                    }}
                  >
                    <span className={fontClass}> {t("questDetail.btnbids")}</span>
                  </PixelButton>
                )}
              </PixelFrame>

              {/* NEW Bidders List */}
              <PixelFrame className="mt-4">
                <h3 className={`font-pixel text-foreground pixel-text-shadow mb-3 flex items-center gap-2 ${fontClass}`}>
                  <Coins size={16} className="text-gold" /> {t("questDetail.biddersList.title", { count: bids.length })}
                </h3>
                {bids.length === 0 ? (
                  <p className={`font-pixel text-muted-foreground text-[14px] ${fontClass}`}>{t("questDetail.biddersList.empty")}</p>
                ) : (
                  <div className="space-y-3">
                    {bids.map(bid => (
                      <div key={bid.id} className="pixel-border border-border/40 bg-secondary/30 p-3 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className={`font-pixel text-accent text-[14px] ${fontClass}`}>{bid.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins size={12} className="text-gold" />
                          <span className={`font-pixel text-gold text-[14px] ${fontClass}`}>{bid.bidAmount} GP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </PixelFrame>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PixelFrame>
            <h3 className={`font-pixel text-foreground pixel-text-shadow mb-3 ${fontClass}`}>
              {t("questDetail.sidebar.providerTitle")}
            </h3>
            <p className={`text-foreground mb-1 break-words ${fontClass}`}>{quest.providerName}</p>
            {quest.contact && (
              <div className="mt-3 space-y-1">
                {quest.contact.discord && (
                  <p className={`text-muted-foreground ${fontClass}`}>
                    💬 {quest.contact.discord}
                  </p>
                )}
                {quest.contact.email && (
                  <p className={`text-muted-foreground ${fontClass}`}>
                    📧 {quest.contact.email}
                  </p>
                )}
                {quest.contact.line && (
                  <p className={`text-muted-foreground ${fontClass}`}>
                    📱 {t("questDetail.sidebar.line")}: {quest.contact.line}
                  </p>
                )}
              </div>
            )}
          </PixelFrame>

          {quest.repoUrl && (
            <PixelFrame>
              <h3 className={`font-pixel text-foreground pixel-text-shadow mb-3 ${fontClass}`}>
                {t("questDetail.sidebar.repoTitle")}
              </h3>
              <p className={`${!isLight ? "text-accent" : ""} break-all ${fontClass}`} style={isLight ? { color: "#7A3A08" } : undefined}>{quest.repoUrl}</p>
              {quest.branchName && (
                <p className={`text-muted-foreground mt-2 break-words ${fontClass}`}>
                  {t("questDetail.sidebar.branch")} <span className={!isLight ? "text-accent" : ""} style={isLight ? { color: "#7A3A08" } : undefined}>{quest.branchName}</span>
                </p>
              )}
            </PixelFrame>
          )}

          {/* Status Actions */}
          {(quest?.status === "in-progress" || quest?.status === "review") && (myBid?.status === "ACCEPTED" || isOwner) && (
            <div className="space-y-3">
              <PixelButton
                variant="gold"
                size="lg"
                className={`w-full ${fontClass}`}
                onClick={() => navigate(`/quest/${quest.id}/workspace`)}
              >
                <span className={fontClass}>{t("questDetail.sidebar.openWorkspace")}</span>
              </PixelButton>
            </div>
          )}

          {quest.status === "completed" && (
            <PixelFrame>
              <div className="text-center py-3">
                <span className={`font-pixel text-success pixel-text-shadow ${fontClass}`}>
                  {t("questDetail.sidebar.questCompleted")}
                </span>
              </div>
            </PixelFrame>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
