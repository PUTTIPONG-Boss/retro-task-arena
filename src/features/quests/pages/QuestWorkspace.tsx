import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetQuestById,
  useUpdateQuestStatus,
  useGetBids
} from "@/features/quests/services/quest.service";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import RatingModal from "@/features/bids/components/RatingModal";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";
import { RepoExplorer } from "../components/RepoExplorer";
import { FileViewer } from "../components/FileViewer";
import { Layout, Terminal, FileText, FolderTree, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const QuestWorkspace = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"workflow" | "readme" | "files">("workflow");
  const [showRating, setShowRating] = useState(false);

  const { data: quest, isLoading: isLoadingQuest } = useGetQuestById(id);
  const { data: bids = [] } = useGetBids(id);
  const updateStatus = useUpdateQuestStatus();

  if (isLoadingQuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-[12px] animate-pulse">Entering Workspace...</p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelFrame>
          <p className="font-pixel text-[12px]">Quest not found...</p>
          <Link to="/" className="mt-4 block">
            <PixelButton variant="primary" size="sm">Return to Board</PixelButton>
          </Link>
        </PixelFrame>
      </div>
    );
  }

  const repoUrl = quest.repoUrl || "";
  const branch = quest.branchName || "main";

  const workflowSteps = [
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
      label: "Submit for Review",
      cmd: null,
      desc: "Once pushed, click the 'Submit for Review' button on this page.",
    },
  ];

  const handleSubmitReview = async () => {
    try {
      await updateStatus.mutateAsync({ id: quest.id, status: "review" as any });
      toast.success("Quest submitted for review! The provider will be notified.");
    } catch {
      toast.error("Failed to submit for review.");
    }
  };

  const handleApprove = () => setShowRating(true);

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    setShowRating(false);
    try {
      await updateStatus.mutateAsync({ id: quest.id, status: "completed" as any });
      toast.success("Quest approved! Rewards transferred.");
    } catch {
      toast.error("Failed to approve quest.");
    }
  };

  const handleRequestChanges = async () => {
    try {
      await updateStatus.mutateAsync({ id: quest.id, status: "in-progress" as any });
      toast("Changes requested. Quest status returned to IN PROGRESS.");
    } catch {
      toast.error("Failed to request changes.");
    }
  };

  const workerBid = bids.find((b) => b.userId === quest.assignedTo);
  const workerUsername = workerBid?.username || "Adventurer";
  const isOwner = user?.id === quest.providerId;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className="mb-6">← Back to Quest</PixelButton>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <PixelFrame className="relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={cn(
                "font-pixel text-[8px] px-2 py-1 bg-background/50 border border-pixel-shadow/20",
                quest.status === "review" ? "text-yellow-400" :
                  quest.status === "completed" ? "text-success" : "text-accent"
              )}>
                ● {quest.status.toUpperCase()}
              </span>
            </div>

            <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow leading-relaxed mb-6">
              {quest.title}
            </h1>

            {/* Tabs Navigation */}
            <div className="flex border-b border-pixel-shadow/20 mb-6">
              {[
                { id: "workflow", label: "Workflow", icon: Terminal },
                { id: "readme", label: "README", icon: FileText },
                { id: "files", label: "Files", icon: FolderTree },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-6 py-3 font-pixel text-[9px] flex items-center gap-2 transition-all",
                    activeTab === tab.id
                      ? "bg-secondary text-accent border-t-2 border-l-2 border-r-2 border-pixel-shadow"
                      : "text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="h-[600px] overflow-hidden relative">
              {activeTab === "workflow" && (
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4 animate-in fade-in duration-300">
                  {workflowSteps.map((step, i) => (
                    <div key={i} className="pixel-border bg-secondary/50 p-4 group">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-pixel text-[9px] text-accent w-8">{i + 1}.</span>
                        <span className="font-pixel text-[9px] text-foreground group-hover:text-accent transition-colors">{step.label}</span>
                      </div>
                      <p className="text-xl text-muted-foreground ml-11 mb-2">{step.desc}</p>
                      {step.cmd && (
                        <div className="pixel-inset bg-background px-3 py-2 ml-11 relative">
                          <code className="text-xl text-accent font-pixel-body whitespace-pre-wrap break-all">{step.cmd}</code>
                          <button
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-pixel text-muted-foreground hover:text-accent"
                            onClick={() => {
                              navigator.clipboard.writeText(step.cmd!);
                              toast.success("Command copied!");
                            }}
                          >
                            [COPY]
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "readme" && (
                <div className="h-full pixel-border bg-background/50 overflow-hidden animate-in zoom-in-95 duration-300">
                  {repoUrl ? (
                    <FileViewer repoUrl={repoUrl} path="README.md" branch={branch} />
                  ) : (
                    <div className="h-full flex items-center justify-center font-pixel text-[8px] text-muted-foreground">
                      No repository URL provided for this quest.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "files" && (
                <div className="h-full animate-in slide-in-from-bottom-4 duration-300">
                  {repoUrl ? (
                    <RepoExplorer repoUrl={repoUrl} branch={branch} />
                  ) : (
                    <div className="h-full flex items-center justify-center font-pixel text-[8px] text-muted-foreground">
                      No repository URL provided for this quest.
                    </div>
                  )}
                </div>
              )}
            </div>
          </PixelFrame>

          {/* Provider Review Tools */}
          {isOwner && quest.status === "review" && (
            <PixelFrame className="border-accent">
              <div className="flex items-center gap-3 mb-4">
                <Layout size={20} className="text-accent" />
                <h2 className="font-pixel text-[11px] text-accent pixel-text-shadow">Review Status</h2>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                The worker has submitted their work. Please verify the code in the "Files" tab before approving.
              </p>
              <div className="flex gap-4">
                <PixelButton variant="gold" size="md" onClick={handleApprove} className="flex-1">
                  ✅ Approve Results
                </PixelButton>
                <PixelButton variant="danger" size="md" onClick={handleRequestChanges} className="flex-1">
                  🔄 Request Changes
                </PixelButton>
              </div>
            </PixelFrame>
          )}

          {/* Completion Banner */}
          {quest.status === "completed" && (
            <PixelFrame className="bg-success/5 border-success border-2">
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
                <h2 className="font-pixel text-[13px] text-success pixel-text-shadow mb-2">Quest Victory!</h2>
                <p className="font-pixel text-[9px] text-accent">Reward: {quest.rewardPoints} GP Awarded</p>
              </div>
            </PixelFrame>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="w-full lg:w-[320px] space-y-6">
          <PixelFrame>
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-4 uppercase tracking-wider underline">The Provider</h3>
            <div className="space-y-4">
              <div>
                <p className="text-lg text-muted-foreground uppercase mb-1">Name</p>
                <p className="text-xl text-foreground font-pixel">{quest.providerName}</p>
              </div>
              <div>
                <p className="text-lg text-muted-foreground uppercase mb-1">Contract ID</p>
                <code className="text-[9px] text-accent bg-background/50 p-1 block truncate">#{quest.id.slice(0, 8)}</code>
              </div>
            </div>
          </PixelFrame>

          <PixelFrame>
            <h3 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-4 uppercase tracking-wider underline">Status Report</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-muted-foreground uppercase">Reward</span>
                <span className="font-pixel text-[10px] text-accent">🪙 {quest.rewardPoints} GP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg text-muted-foreground uppercase">Estimated</span>
                <span className="text-lg text-foreground">{quest.estimatedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg text-muted-foreground uppercase">Category</span>
                <span className="text-lg text-foreground px-2 py-0.5 bg-secondary">{quest.category}</span>
              </div>
            </div>
          </PixelFrame>

          {/* Action Button for Worker */}
          {quest.status === "in-progress" && user?.id === quest.assignedTo && (
            <PixelButton
              variant="gold"
              size="lg"
              className="w-full py-6"
              onClick={handleSubmitReview}
              isLoading={updateStatus.isPending}
            >
              📤 Submit Work
            </PixelButton>
          )}
        </div>
      </div>

      <RatingModal
        open={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={handleRatingSubmit}
        workerUsername={workerUsername}
        questTitle={quest.title}
      />
    </div>
  );
};

export default QuestWorkspace;
