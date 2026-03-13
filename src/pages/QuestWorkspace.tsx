import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuestContext } from "@/context/QuestContext";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import RatingModal from "@/components/RatingModal";
import { toast } from "sonner";

const QuestWorkspace = () => {
  const { id } = useParams();
  const { quests, submitForReview, approveQuest, requestChanges } = useQuestContext();
  const quest = quests.find((q) => q.id === id);
  const [showRating, setShowRating] = useState(false);

  if (!quest) return null;

  const repoUrl = quest.repoUrl || "https://github.com/example/repo";
  const branch = quest.branchName || "feature/quest-name";

  const steps = [
    {
      label: "Clone Repository",
      cmd: `git clone ${repoUrl}`,
      desc: "Download the project to your local machine.",
    },
    {
      label: "Create Branch",
      cmd: `git checkout -b ${branch}`,
      desc: "Create and switch to the quest branch.",
    },
    {
      label: "Implement Solution",
      cmd: null,
      desc: "Make the required changes according to the quest description.",
    },
    {
      label: "Commit Changes",
      cmd: `git add .\ngit commit -m "Complete quest task"`,
      desc: "Stage and commit your work.",
    },
    {
      label: "Push Branch",
      cmd: `git push origin ${branch}`,
      desc: "Push your branch to the remote repository.",
    },
    {
      label: "Submit Pull Request",
      cmd: null,
      desc: "Open a pull request to the main branch on GitHub.",
    },
  ];

  const handleSubmitReview = () => {
    submitForReview(quest.id);
    toast.success("Quest submitted for review!", {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
  };

  const handleApprove = () => {
    setShowRating(true);
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    setShowRating(false);
    approveQuest(quest.id, rating, feedback);
    toast.success("Quest approved! Rewards transferred.", {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
  };

  const handleRequestChanges = () => {
    requestChanges(quest.id);
    toast("Changes requested. Worker notified.", {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
  };

  const workerBid = quest.bids.find((b) => b.userId === quest.assignedTo);
  const workerUsername = workerBid?.username || "Adventurer";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className="mb-6">← Back to Quest</PixelButton>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <PixelFrame>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-pixel text-[9px] text-accent pixel-text-shadow">🛠 QUEST WORKSPACE</span>
              <span className={`font-pixel text-[8px] ml-auto ${
                quest.status === "review" ? "text-accent" :
                quest.status === "completed" ? "text-success" :
                "text-foreground"
              }`}>
                ● {quest.status.toUpperCase()}
              </span>
            </div>
            <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow leading-relaxed mb-4">
              {quest.title}
            </h1>
            <div className="text-xl leading-relaxed text-foreground/80 whitespace-pre-line">
              {quest.fullDescription}
            </div>
          </PixelFrame>

          <PixelFrame>
            <h2 className="font-pixel text-[11px] text-foreground pixel-text-shadow mb-4">
              📝 Workflow Steps
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="pixel-border bg-secondary p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-pixel text-[10px] text-accent w-8">
                      {i + 1}.
                    </span>
                    <span className="font-pixel text-[10px] text-foreground">{step.label}</span>
                  </div>
                  <p className="text-lg text-muted-foreground ml-11 mb-2">{step.desc}</p>
                  {step.cmd && (
                    <div className="pixel-inset bg-background px-3 py-2 ml-11">
                      <code className="text-lg text-accent font-pixel-body whitespace-pre-wrap break-all">{step.cmd}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PixelFrame>

          {/* Provider Review Section */}
          {quest.status === "review" && (
            <PixelFrame>
              <h2 className="font-pixel text-[11px] text-foreground pixel-text-shadow mb-4">
                🔍 Provider Review
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                The adventurer has submitted their pull request for review.
              </p>
              <div className="flex gap-3">
                <PixelButton variant="gold" size="md" onClick={handleApprove}>
                  ✅ Approve Quest
                </PixelButton>
                <PixelButton variant="danger" size="md" onClick={handleRequestChanges}>
                  🔄 Request Changes
                </PixelButton>
              </div>
            </PixelFrame>
          )}

          {quest.status === "completed" && (
            <PixelFrame>
              <div className="text-center py-6">
                <span className="text-4xl mb-3 block">🏆</span>
                <h2 className="font-pixel text-[13px] text-success pixel-text-shadow mb-2">
                  Quest Complete!
                </h2>
                <p className="font-pixel text-[11px] text-accent pixel-text-shadow">
                  +{quest.rewardPoints} GP Earned
                </p>
              </div>
            </PixelFrame>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PixelFrame>
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">Quest Provider</h3>
            <p className="text-xl text-foreground mb-3">{quest.providerName}</p>
            {quest.contact && (
              <div className="space-y-1">
                {quest.contact.discord && <p className="text-lg text-muted-foreground">💬 {quest.contact.discord}</p>}
                {quest.contact.email && <p className="text-lg text-muted-foreground">📧 {quest.contact.email}</p>}
                {quest.contact.line && <p className="text-lg text-muted-foreground">📱 LINE: {quest.contact.line}</p>}
              </div>
            )}
          </PixelFrame>

          <PixelFrame>
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">Quest Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-lg text-muted-foreground">Status</span>
                <span className={`font-pixel text-[9px] ${
                  quest.status === "completed" ? "text-success" : "text-accent"
                }`}>{quest.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-muted-foreground">Reward</span>
                <span className="font-pixel text-[9px] text-accent">🪙 {quest.rewardPoints} GP</span>
              </div>
            </div>
          </PixelFrame>

          {quest.status === "in-progress" && (
            <PixelButton variant="gold" size="lg" className="w-full" onClick={handleSubmitReview}>
              📤 Submit for Review
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestWorkspace;
