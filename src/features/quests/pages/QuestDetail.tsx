import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuestStore } from "@/features/quests/store/questStore";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import DifficultyStars from "@/features/quests/components/DifficultyStars";

const statusLabel: Record<string, string> = {
  open: "OPEN",
  bidding: "BIDDING",
  "in-progress": "IN PROGRESS",
  review: "REVIEW",
  completed: "COMPLETED",
};

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quests = useQuestStore((state) => state.quests);
  const quest = quests.find((q) => q.id === id);

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

  const statusColor =
    quest.status === "completed"
      ? "text-success"
      : quest.status === "review"
        ? "text-accent"
        : quest.status === "in-progress"
          ? "text-accent"
          : "text-success";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
      <Link to="/">
        <PixelButton variant="ghost" size="sm">
          ← Back to Board
        </PixelButton>
      </Link>
        <Link to={`/quest/${quest.id}/edit`}>
          <button className="pixel-border bg-secondary hover:bg-muted px-4 py-2 font-pixel text-[8px] text-accent transition-colors">
            EDIT QUEST 
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PixelFrame>
            <div className="flex items-center justify-between mb-3">
              <span className="font-pixel text-[8px] uppercase tracking-widest text-muted-foreground">
                {quest.category}
              </span>
              <span
                className={`font-pixel text-[8px] uppercase ${statusColor}`}
              >
                ● {statusLabel[quest.status] || quest.status}
              </span>
            </div>

            <h1 className="font-pixel text-[14px] sm:text-[16px] text-foreground pixel-text-shadow leading-relaxed mb-4">
              {quest.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <span className="font-pixel text-[10px] text-accent pixel-text-shadow">
                🪙 {quest.rewardPoints} GP
              </span>
              <DifficultyStars level={quest.difficulty} />
              <span className="font-pixel text-[9px] text-muted-foreground">
                ⏳ {quest.estimatedTime}
              </span>
            </div>

            <div className="border-t-2 border-border pt-4">
              <h2 className="font-pixel text-[10px] text-foreground mb-3">
                Quest Details
              </h2>
              <div className="text-xl leading-relaxed text-foreground/80 whitespace-pre-line">
                {quest.fullDescription}
              </div>
            </div>
          </PixelFrame>

          {quest.bids.length > 0 && (
            <PixelFrame>
              <h2 className="font-pixel text-[11px] text-foreground pixel-text-shadow mb-4">
                📋 Adventurer Bids ({quest.bids.length})
              </h2>
              <div className="space-y-3">
                {quest.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="pixel-border bg-secondary p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-pixel text-[10px] text-foreground">
                        {bid.username}
                      </p>
                      <p className="text-lg text-muted-foreground mt-1">
                        {bid.questsCompleted} quests · ★ {bid.rating}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-pixel text-[10px] text-accent pixel-text-shadow">
                        🪙 {bid.requestedPoints} GP
                      </p>
                      <p className="text-base text-muted-foreground">
                        ⏳ {bid.estimatedTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PixelFrame>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PixelFrame>
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
              Quest Provider
            </h3>
            <p className="text-xl text-foreground mb-1">{quest.providerName}</p>
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
                <p className="text-lg text-muted-foreground mt-2">
                  Branch:{" "}
                  <span className="text-accent">{quest.branchName}</span>
                </p>
              )}
            </PixelFrame>
          )}

          {quest.status === "open" && (
            <>
              <PixelButton
                variant="gold"
                size="lg"
                className="w-full"
                onClick={() => navigate(`/quest/${quest.id}/bid`)}
              >
                ⚔ Submit Bid
              </PixelButton>
              {quest.bids.length > 0 && (
                <PixelButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate(`/quest/${quest.id}/bids`)}
                >
                  👥 View Bidders ({quest.bids.length})
                </PixelButton>
              )}
            </>
          )}

          {(quest.status === "in-progress" || quest.status === "review") && (
            <PixelButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/quest/${quest.id}/workspace`)}
            >
              🛠 Open Workspace
            </PixelButton>
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
