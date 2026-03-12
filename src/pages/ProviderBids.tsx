import { useParams, Link } from "react-router-dom";
import { useQuestContext } from "@/context/QuestContext";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { toast } from "sonner";

const ProviderBids = () => {
  const { id } = useParams();
  const { quests, acceptBidder } = useQuestContext();
  const quest = quests.find((q) => q.id === id);

  if (!quest) return null;

  const handleSelect = (userId: string, username: string) => {
    acceptBidder(quest.id, userId);
    toast.success(`${username} has been assigned to this quest!`, {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className="mb-6">← Back to Quest</PixelButton>
      </Link>

      <PixelFrame>
        <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow mb-1">
          Bidder Roster
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          {quest.title} — {quest.bids.length} adventurer{quest.bids.length !== 1 ? "s" : ""} have answered the call.
        </p>

        {quest.bids.length === 0 ? (
          <p className="font-pixel text-[10px] text-muted-foreground text-center py-12">
            No adventurers have bid yet...
          </p>
        ) : (
          <div className="space-y-4">
            {quest.bids.map((bid) => (
              <div key={bid.id} className="pixel-border bg-secondary p-5">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-muted pixel-border flex items-center justify-center font-pixel text-[10px] text-accent">
                        {bid.username[0]}
                      </div>
                      <div>
                        <p className="font-pixel text-[10px] text-foreground">{bid.username}</p>
                        <a
                          href={bid.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg text-primary hover:text-accent"
                        >
                          {bid.githubUrl}
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4 text-base text-muted-foreground mb-2">
                      <span>🏆 {bid.questsCompleted} quests</span>
                      <span>★ {bid.rating}</span>
                    </div>

                    <p className="text-lg text-foreground/80">{bid.explanation}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <div className="text-right">
                      <p className="font-pixel text-[11px] text-accent pixel-text-shadow">🪙 {bid.requestedPoints} GP</p>
                      <p className="text-base text-muted-foreground">⏳ {bid.estimatedTime}</p>
                    </div>
                    {quest.status === "open" && (
                      <PixelButton variant="gold" size="sm" onClick={() => handleSelect(bid.userId, bid.username)}>
                        ⚔ Accept Bidder
                      </PixelButton>
                    )}
                    {quest.assignedTo === bid.userId && (
                      <span className="font-pixel text-[8px] text-success">✓ ASSIGNED</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PixelFrame>
    </div>
  );
};

export default ProviderBids;
