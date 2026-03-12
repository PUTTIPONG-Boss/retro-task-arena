import { useParams, Link, useNavigate } from "react-router-dom";
import { mockQuests } from "@/data/mockData";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import DifficultyStars from "@/components/DifficultyStars";

const QuestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quest = mockQuests.find((q) => q.id === id);

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelFrame>
          <p className="font-pixel text-[12px] text-foreground pixel-text-shadow">
            Quest not found in the archives...
          </p>
          <Link to="/" className="block mt-4">
            <PixelButton variant="primary" size="sm">Return to Board</PixelButton>
          </Link>
        </PixelFrame>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-6">
        <PixelButton variant="ghost" size="sm">← Back to Board</PixelButton>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <PixelFrame variant="parchment">
            <div className="flex items-center justify-between mb-3">
              <span className="font-pixel text-[8px] uppercase tracking-widest text-parchment-foreground/60">
                {quest.category}
              </span>
              <span className={`font-pixel text-[8px] uppercase ${quest.status === "open" ? "text-green-700" : "text-amber-700"}`}>
                ● {quest.status}
              </span>
            </div>

            <h1 className="font-pixel text-[14px] sm:text-[16px] text-parchment-foreground pixel-text-shadow leading-relaxed mb-4">
              {quest.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <span className="font-pixel text-[10px] text-accent pixel-text-shadow">🪙 {quest.rewardPoints} GP</span>
              <DifficultyStars level={quest.difficulty} />
              <span className="font-pixel text-[9px] text-parchment-foreground/70">⏳ {quest.estimatedTime}</span>
            </div>

            <div className="border-t-2 border-parchment-foreground/20 pt-4">
              <h2 className="font-pixel text-[10px] text-parchment-foreground mb-3">Quest Details</h2>
              <div className="text-xl leading-relaxed text-parchment-foreground/90 whitespace-pre-line">
                {quest.fullDescription}
              </div>
            </div>
          </PixelFrame>

          {/* Bids section */}
          {quest.bids.length > 0 && (
            <PixelFrame>
              <h2 className="font-pixel text-[11px] text-foreground pixel-text-shadow mb-4">
                📋 Adventurer Bids ({quest.bids.length})
              </h2>
              <div className="space-y-3">
                {quest.bids.map((bid) => (
                  <div key={bid.id} className="pixel-border bg-secondary p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-pixel text-[10px] text-foreground">{bid.username}</p>
                      <p className="text-lg text-muted-foreground mt-1">
                        {bid.questsCompleted} quests · ★ {bid.rating}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-pixel text-[10px] text-accent pixel-text-shadow">🪙 {bid.requestedPoints} GP</p>
                      <p className="text-base text-muted-foreground">⏳ {bid.estimatedTime}</p>
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
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">Quest Provider</h3>
            <p className="text-xl text-foreground mb-1">{quest.providerName}</p>
            {quest.contact && (
              <div className="mt-3 space-y-1">
                {quest.contact.discord && <p className="text-lg text-muted-foreground">💬 {quest.contact.discord}</p>}
                {quest.contact.email && <p className="text-lg text-muted-foreground">📧 {quest.contact.email}</p>}
                {quest.contact.line && <p className="text-lg text-muted-foreground">📱 LINE: {quest.contact.line}</p>}
              </div>
            )}
          </PixelFrame>

          {quest.repoUrl && (
            <PixelFrame>
              <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">Repository</h3>
              <p className="text-lg text-primary break-all">{quest.repoUrl}</p>
              {quest.branchName && (
                <p className="text-lg text-muted-foreground mt-2">Branch: <span className="text-accent">{quest.branchName}</span></p>
              )}
            </PixelFrame>
          )}

          {quest.status === "open" && (
            <PixelButton
              variant="gold"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/quest/${quest.id}/bid`)}
            >
              ⚔ Submit Bid
            </PixelButton>
          )}

          {quest.status === "in-progress" && (
            <PixelButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/quest/${quest.id}/workspace`)}
            >
              🛠 Open Workspace
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestDetail;
