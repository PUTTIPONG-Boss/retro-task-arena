import { useState } from "react";
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
} from "../services/quest.service";
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

const statusColor: Record<string, string> = {
  open: "text-success",
  bidding: "text-accent",
  "in-progress": "text-accent",
  review: "text-yellow-400",
  in_review: "text-yellow-400",
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
    try {
      await submitBid.mutateAsync({
        taskId: quest.id,
        payload: {
          user_id: user.id,
          bid_amount: bidAmount,
          wait_duration: waitDuration,
          note,
        },
      });
      toast.success(t("questDetail.toast.bidSubmitted"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
      setShowBidForm(false);
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

  const myBid = bids.find((b) => (b.userId || (b as any).user_id) === user?.id);

  const handleEditBid = () => {
    if (!myBid) return;
    setEditBidAmount(myBid.bidAmount);
    setEditWaitDuration(myBid.waitDuration);
    setEditNote(myBid.note || "");
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
        },
      });
      toast.success(t("questDetail.editbid.SuccessMsg"), { icon: <PixelCheck size={18} color="#4ade80" />, style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
      setEditMode(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || t("questDetail.editbid.FailMsg"), { style: { fontFamily: '"TA_8bit"', fontSize: '16px' } });
    }
  };

  return (
    <div className={`max-w-[1280px] mx-auto px-4 py-8 ${fontClass}`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <PixelButton variant="danger" size="sm" className={fontClass}>
            ← {t("questDetail.back")}
          </PixelButton>
        </Link>
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
              <span className={`font-pixel uppercase tracking-widest text-muted-foreground ${fontClass}`}>
                {quest.category}
              </span>
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
                🏆 {t("questDetail.finalReview.title")}
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
                      className={`pixel-border bg-secondary p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${fontClass}`}
                    >
                      <div className="flex-1">
                        <p className={`font-pixel text-foreground mb-1 break-words ${fontClass}`}>
                          {bid.username}
                        </p>
                        <p className={`text-muted-foreground flex items-center gap-1 ${fontClass}`}>
                          <PixelScroll size={12} color="currentColor" className="text-gold" /> {bid.questsCompleted} {t("questDetail.OwnerQuest.quest")} · ★ {bid.rating.toFixed(1)}
                        </p>
                        {bid.note && (
                          <p className={`text-foreground/70 mt-1 italic break-words overflow-hidden ${fontClass}`}>
                            "{bid.note}"
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Coins size={12} className="inline mr-1 text-gold" /> {bid.bidAmount} {t("questDetail.OwnerQuest.GP")}
                        <p className={`text-muted-foreground mb-3 flex items-center gap-1 justify-end ${fontClass}`}>
                          <PixelHourglass size={12} color="currentColor" className="text-gold" /> {bid.waitDuration}
                        </p>
                        {bid.status === "PENDING" && (
                          <PixelButton
                            variant="gold"
                            size="sm"
                            className={fontClass}
                            onClick={() => handleAcceptBid(bid.id)}
                            disabled={acceptBid.isPending}
                          >
                            <span className={`flex items-center gap-1 ${fontClass}`}><PixelCheck size={14} color="#4ade80" /> {t("questDetail.acceptbid")}</span>
                          </PixelButton>
                        )}
                        {bid.status === "ACCEPTED" && (
                          <span className={`font-pixel text-success flex items-center gap-1 ${fontClass}`}><PixelCheck size={14} color="#4ade80" /> {t("questDetail.accept")}</span>
                        )}
                        {bid.status === "REJECTED" && (
                          <span className={`font-pixel text-muted-foreground flex items-center gap-1 ${fontClass}`}><PixelX size={12} color="currentColor" /> {t("questDetail.reject")}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </PixelFrame>
          )}

          {/* REGULAR USER VIEW: see only count + submit bid */}
          {!isOwner && quest.status === "open" && (
            <PixelFrame>
              <h2 className={`font-pixel text-foreground pixel-text-shadow mb-2 flex items-center gap-2 ${fontClass}`}>
                <PixelUsers size={20} color="currentColor" className="text-gold"/> {bids.length} {t("questDetail.ownerbids")}
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
                        <PixelButton variant="ghost" size="sm" className={fontClass} onClick={() => setEditMode(false)}>
                          <span className={fontClass}>{t("questDetail.editbid.btncancel")}</span>
                        </PixelButton>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <>
                      <div className="flex justify-between items-start">
                        <p className={`font-pixel text-success mb-1 flex items-center gap-1 ${fontClass}`}><PixelCheck size={18} color="#4ade80" /> {t("questDetail.viewmode.yourbidsub")}</p>
                      </div>
                      <p className={`text-foreground ${fontClass}`}>{t("questDetail.viewmode.amount")} : <span className="text-accent">{myBid.bidAmount} {t("questDetail.viewmode.GP")}</span></p>
                      <p className={`text-muted-foreground ${fontClass}`}>{t("questDetail.viewmode.duration")}: {myBid.waitDuration}</p>
                      {myBid.note && <p className={`text-muted-foreground mt-1 break-words overflow-hidden ${fontClass}`}>{t("questDetail.viewmode.note")}: {myBid.note}</p>}
                      <p className={`mt-2 ${fontClass}`}>
                        {t("questDetail.viewmode.status")}:
                        <span className={myBid.status === "ACCEPTED" ? "text-success font-semibold" : myBid.status === "REJECTED" ? "text-red-400" : "text-muted-foreground"}>
                          {myBid.status}
                        </span>
                      </p>

                      {myBid.status === "PENDING" && (
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
          {(quest.status === "in-progress" || quest.status === "review") && (user?.id === quest.assignedTo || isOwner) && (
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
