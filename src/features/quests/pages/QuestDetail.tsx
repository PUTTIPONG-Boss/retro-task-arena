import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  useUpdateQuestStatus,
  useGetBids,
  useSubmitBid,
  useAcceptBid,
  useGetQuestById,
  useUpdateBid,
} from "../services/quest.service";
import { toast } from "sonner";
import { Coins } from "lucide-react";

const statusLabel: Record<string, string> = {
  open: "OPEN",
  bidding: "BIDDING",
  "in-progress": "IN PROGRESS",
  review: "REVIEW",
  completed: "COMPLETED",
};

const statusColor: Record<string, string> = {
  open: "text-success",
  bidding: "text-accent",
  "in-progress": "text-accent",
  review: "text-yellow-400",
  completed: "text-success",
};

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // --- Fetch quest directly from API ---
  const { data: quest, isLoading: questLoading } = useGetQuestById(id);

  // --- Hooks ---
  const updateStatus = useUpdateQuestStatus();
  const { data: bids = [], isLoading: bidsLoading } = useGetBids(id);
  const submitBid = useSubmitBid();
  const acceptBid = useAcceptBid();

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

  if (questLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-[12px] text-muted-foreground animate-pulse">
          Loading Quest...
        </p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelFrame>
          <p className="font-pixel text-[12px] text-foreground pixel-text-shadow">
            Quest not found in the archives...
          </p>
          <Link to="/" className="block mt-4">
            <PixelButton variant="primary" size="sm">
              Return to Board
            </PixelButton>
          </Link>
        </PixelFrame>
      </div>
    );
  }

  const isSeniorOrEmployer =
    user?.role === "employer" || user?.role?.toLowerCase().includes("senior");

  const isOwner = user?.id === quest.providerId;

  const handleCompleteQuest = async () => {
    try {
      await updateStatus.mutateAsync({ id: quest.id, status: "completed" });
      toast.success("Order marked as completed! Points awarded.");
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  const handleSubmitBid = async () => {
    if (!user) {
      toast.error("You must be logged in to submit a bid.");
      return;
    }
    if (!waitDuration || bidAmount <= 0) {
      toast.error("Please fill in all required bid fields.");
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
      toast.success("⚔ Bid submitted successfully!");
      setShowBidForm(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Failed to submit bid");
    }
  };

  const handleAcceptBid = async (appId: string) => {
    try {
      await acceptBid.mutateAsync({ taskId: quest.id, appId });
      toast.success("✅ Bid accepted! Quest is now In Progress.");
    } catch {
      toast.error("Failed to accept bid.");
    }
  };

  const myBid = bids.find((b) => b.userId === user?.id);

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
      toast.error("Please fill in all required bid fields.");
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
      toast.success("✏ Bid updated successfully!");
      setEditMode(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || "Failed to update bid");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <PixelButton variant="ghost" size="sm">
            ← Back to Board
          </PixelButton>
        </Link>
        {isOwner && (
          <Link to={`/quest/${quest.id}/edit`}>
            <button className="pixel-border bg-secondary hover:bg-muted px-4 py-2 font-pixel text-[8px] text-accent transition-colors">
              EDIT QUEST
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PixelFrame>
            <div className="flex items-center justify-between mb-3">
              <span className="font-pixel text-[8px] uppercase tracking-widest text-muted-foreground">
                {quest.category}
              </span>
              <span className={`font-pixel text-[8px] uppercase ${statusColor[quest.status] || "text-success"}`}>
                ● {statusLabel[quest.status] || quest.status}
              </span>
            </div>

            <h1 className="font-pixel text-[14px] sm:text-[16px] text-foreground pixel-text-shadow leading-relaxed mb-4 break-words overflow-hidden">
              {quest.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
                <Coins size={14} className="inline mr-1" /> {quest.rewardPoints} GP
              <DifficultyStars level={quest.difficulty} />
              <span className="font-pixel text-[9px] text-muted-foreground">
                ⏳ {quest.estimatedTime}
              </span>
            </div>

            {quest.skills && (
              <div className="flex flex-wrap gap-2 mb-6">
                {quest.skills.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="pixel-text text-[10px] bg-secondary border border-border px-3 py-1 text-accent uppercase"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t-2 border-border pt-4">
              <h2 className="font-pixel text-[10px] text-foreground mb-3">
                Quest Details
              </h2>
              <div className="text-xl leading-relaxed text-foreground/80 whitespace-pre-line break-all overflow-hidden">
                {quest.fullDescription}
              </div>
            </div>
          </PixelFrame>

          {/* ===== BID SECTION ===== */}
          {/* OWNER VIEW: see all bids with details */}
          {isOwner && quest.status === "open" && (
            <PixelFrame>
              <h2 className="font-pixel text-[11px] text-foreground pixel-text-shadow mb-4">
                📋 Adventurer Bids
                {bidsLoading ? (
                  <span className="text-muted-foreground text-[9px] ml-2">Loading...</span>
                ) : (
                  <span className="text-muted-foreground text-[9px] ml-2">({bids.length})</span>
                )}
              </h2>

              {bids.length === 0 ? (
                <p className="font-pixel text-[9px] text-muted-foreground">No bids yet. Share this quest with adventurers!</p>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="pixel-border bg-secondary p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-pixel text-[10px] text-foreground mb-1 break-words">
                          ⚔ {bid.username}
                        </p>
                        <p className="text-base text-muted-foreground">
                          📜 {bid.questsCompleted} quests · ★ {bid.rating.toFixed(1)}
                        </p>
                        {bid.note && (
                          <p className="text-base text-foreground/70 mt-1 italic break-words overflow-hidden">
                            "{bid.note}"
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                          <Coins size={12} className="inline mr-1" /> {bid.bidAmount} GP
                        <p className="text-base text-muted-foreground mb-3">
                          ⏳ {bid.waitDuration}
                        </p>
                        {bid.status === "PENDING" && (
                          <PixelButton
                            variant="gold"
                            size="sm"
                            onClick={() => handleAcceptBid(bid.id)}
                            disabled={acceptBid.isPending}
                          >
                            ✅ Accept Bid
                          </PixelButton>
                        )}
                        {bid.status === "ACCEPTED" && (
                          <span className="font-pixel text-[8px] text-success">✅ ACCEPTED</span>
                        )}
                        {bid.status === "REJECTED" && (
                          <span className="font-pixel text-[8px] text-muted-foreground">✗ Rejected</span>
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
              <h2 className="font-pixel text-[11px] text-foreground pixel-text-shadow mb-2">
                👥 {bids.length} Adventurer(s) have bid on this quest
              </h2>
              <p className="text-base text-muted-foreground mb-4">
                Bid details are hidden to ensure fair competition.
              </p>

              {myBid ? (
                <div className="pixel-border bg-secondary p-4 mt-3">
                  {editMode ? (
                    /* ── EDIT FORM ── */
                    <div className="space-y-3">
                      <p className="font-pixel text-[9px] text-accent mb-2">✏ Edit Your Bid</p>
                      <div>
                        <label className="font-pixel text-[8px] text-muted-foreground block mb-1">BID AMOUNT (GP)</label>
                        <input
                          type="number"
                          value={editBidAmount}
                          onChange={(e) => setEditBidAmount(Number(e.target.value))}
                          className="w-full bg-background border border-border px-3 py-2 text-foreground font-pixel text-[10px] focus:outline-none focus:border-accent"
                          min={1}
                        />
                      </div>
                      <div>
                        <label className="font-pixel text-[8px] text-muted-foreground block mb-1">ESTIMATED DURATION</label>
                        <input
                          type="text"
                          value={editWaitDuration}
                          onChange={(e) => setEditWaitDuration(e.target.value)}
                          className="w-full bg-background border border-border px-3 py-2 text-foreground font-pixel text-[10px] focus:outline-none focus:border-accent"
                          placeholder="e.g. 3 days, 1 week"
                        />
                      </div>
                      <div>
                        <label className="font-pixel text-[8px] text-muted-foreground block mb-1">NOTE (OPTIONAL)</label>
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          rows={2}
                          className="w-full bg-background border border-border px-3 py-2 text-foreground font-pixel text-[10px] focus:outline-none focus:border-accent resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <PixelButton
                          variant="gold"
                          size="sm"
                          className="flex-1"
                          onClick={handleUpdateBid}
                          disabled={updateBid.isPending}
                        >
                          {updateBid.isPending ? "Saving..." : "💾 Save Changes"}
                        </PixelButton>
                        <PixelButton variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                          Cancel
                        </PixelButton>
                      </div>
                    </div>
                  ) : (
                    /* ── VIEW MODE ── */
                    <>
                      <div className="flex justify-between items-start">
                        <p className="font-pixel text-[9px] text-success mb-1">⚔ Your Bid Submitted!</p>
                        {myBid.status === "PENDING" && (
                          <button
                            onClick={handleEditBid}
                            className="font-pixel text-[7px] text-accent hover:text-foreground border border-accent px-2 py-1 transition-colors"
                          >
                            ✏ Edit Bid
                          </button>
                        )}
                      </div>
                      <p className="text-base text-foreground">Amount: <span className="text-accent">{myBid.bidAmount} GP</span></p>
                      <p className="text-base text-muted-foreground">Duration: {myBid.waitDuration}</p>
                      {myBid.note && <p className="text-base text-muted-foreground mt-1 break-words overflow-hidden">Note: {myBid.note}</p>}
                      <p className="text-base mt-2">
                        Status:{" "}
                        <span className={myBid.status === "ACCEPTED" ? "text-success font-semibold" : myBid.status === "REJECTED" ? "text-red-400" : "text-muted-foreground"}>
                          {myBid.status}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              ) : showBidForm ? (
                <div className="space-y-4 mt-3">
                  <div>
                    <label className="font-pixel text-[8px] text-muted-foreground block mb-1">BID AMOUNT (GP)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full bg-secondary border border-border px-3 py-2 text-foreground font-pixel text-[10px] focus:outline-none focus:border-accent"
                      placeholder="e.g. 500"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[8px] text-muted-foreground block mb-1">ESTIMATED DURATION</label>
                    <input
                      type="text"
                      value={waitDuration}
                      onChange={(e) => setWaitDuration(e.target.value)}
                      className="w-full bg-secondary border border-border px-3 py-2 text-foreground font-pixel text-[10px] focus:outline-none focus:border-accent"
                      placeholder="e.g. 3 days, 1 week"
                    />
                  </div>
                  <div>
                    <label className="font-pixel text-[8px] text-muted-foreground block mb-1">NOTE (OPTIONAL)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      className="w-full bg-secondary border border-border px-3 py-2 text-foreground font-pixel text-[10px] focus:outline-none focus:border-accent resize-none"
                      placeholder="What solution you can provide?"
                    />
                  </div>
                  <div className="flex gap-3">
                    <PixelButton
                      variant="gold"
                      size="md"
                      className="flex-1"
                      onClick={handleSubmitBid}
                      disabled={submitBid.isPending}
                    >
                      {submitBid.isPending ? "Submitting..." : "⚔ Submit Bid"}
                    </PixelButton>
                    <PixelButton
                      variant="ghost"
                      size="md"
                      onClick={() => setShowBidForm(false)}
                    >
                      Cancel
                    </PixelButton>
                  </div>
                </div>
              ) : (
                <PixelButton
                  variant="gold"
                  size="md"
                  className="w-full mt-2"
                  onClick={() => {
                    setBidAmount(quest.rewardPoints);
                    setShowBidForm(true);
                  }}
                >
                  ⚔ Submit Bid
                </PixelButton>
              )}
            </PixelFrame>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PixelFrame>
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
              Quest Provider
            </h3>
            <p className="text-xl text-foreground mb-1 break-words">{quest.providerName}</p>
            {quest.contact && (
              <div className="mt-3 space-y-1">
                {quest.contact.discord && (
                  <p className="text-lg text-muted-foreground">
                    💬 {quest.contact.discord}
                  </p>
                )}
                {quest.contact.email && (
                  <p className="text-lg text-muted-foreground">
                    📧 {quest.contact.email}
                  </p>
                )}
                {quest.contact.line && (
                  <p className="text-lg text-muted-foreground">
                    📱 LINE: {quest.contact.line}
                  </p>
                )}
              </div>
            )}
          </PixelFrame>

          {quest.repoUrl && (
            <PixelFrame>
              <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
                Repository
              </h3>
              <p className="text-lg text-accent break-all">{quest.repoUrl}</p>
              {quest.branchName && (
                <p className="text-lg text-muted-foreground mt-2 break-words">
                  Branch: <span className="text-accent">{quest.branchName}</span>
                </p>
              )}
            </PixelFrame>
          )}

          {/* Status Actions */}
          {(quest.status === "in-progress" || quest.status === "review") && (user?.id === quest.assignedTo || isOwner) && (
            <div className="space-y-3">
              <PixelButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate(`/quest/${quest.id}/workspace`)}
              >
                🛠 Open Workspace
              </PixelButton>

              {isSeniorOrEmployer && quest.status === "review" && (
                <PixelButton
                  variant="gold"
                  size="md"
                  className="w-full"
                  onClick={handleCompleteQuest}
                  disabled={updateStatus.isPending}
                >
                  🏆 Complete Quest & Award Points
                </PixelButton>
              )}
            </div>
          )}

          {quest.status === "completed" && (
            <PixelFrame>
              <div className="text-center py-3">
                <span className="font-pixel text-[10px] text-success pixel-text-shadow">
                  🏆 QUEST COMPLETED
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
