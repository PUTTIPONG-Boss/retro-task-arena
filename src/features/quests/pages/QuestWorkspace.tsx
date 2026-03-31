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
import { useCreateReview } from "@/features/bids/services/review.service";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/authStore";
import { RepoExplorer } from "../components/RepoExplorer";
import { FileViewer } from "../components/FileViewer";
import { Layout, Terminal, FileText, FolderTree, CheckCircle2, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const QuestWorkspace = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"workflow" | "readme" | "files">("workflow");
  const [showRating, setShowRating] = useState(false);

  const { data: quest, isLoading: isLoadingQuest } = useGetQuestById(id);
  const { data: bids = [] } = useGetBids(id);

  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const updateStatus = useUpdateQuestStatus();
  const createReview = useCreateReview();

  if (isLoadingQuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={`font-pixel animate-pulse ${fontClass}`}>{t("questWorkspace.loading")}</p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelFrame>
          <p className={`font-pixel ${fontClass}`}>{t("questWorkspace.notFound")}</p>
          <Link to="/" className="mt-4 block">
            <PixelButton variant="primary" size="sm" className={fontClass}>
              <span className={fontClass}>{t("questWorkspace.notFound")}</span>
            </PixelButton>
          </Link>
        </PixelFrame>
      </div>
    );
  }

  const repoUrl = quest.repoUrl || "";
  const branch = quest.branchName || "main";

  const workflowSteps = [
    {
      label: t("questWorkspace.workflow.steps.clone.label"),
      cmd: `git clone ${repoUrl}`,
      desc: t("questWorkspace.workflow.steps.clone.desc"),
    },
    {
      label: t("questWorkspace.workflow.steps.branch.label"),
      cmd: `git checkout -b ${branch}`,
      desc: t("questWorkspace.workflow.steps.branch.desc"),
    },
    {
      label: t("questWorkspace.workflow.steps.solve.label"),
      cmd: null,
      desc: t("questWorkspace.workflow.steps.solve.desc"),
    },
    {
      label: t("questWorkspace.workflow.steps.commit.label"),
      cmd: `git add .\ngit commit -m "Complete quest task"`,
      desc: t("questWorkspace.workflow.steps.commit.desc"),
    },
    {
      label: t("questWorkspace.workflow.steps.push.label"),
      cmd: `git push origin ${branch}`,
      desc: t("questWorkspace.workflow.steps.push.desc"),
    },
    {
      label: t("questWorkspace.workflow.steps.submit.label"),
      cmd: null,
      desc: t("questWorkspace.workflow.steps.submit.desc"),
    },
  ];

  const handleSubmitReview = async () => {
    try {
      await updateStatus.mutateAsync({ id: quest.id, status: "review" as any });
      toast.success(t("questWorkspace.toasts.submitted"));
    } catch (err: any) {
      const msg = err.response?.data?.error || t("questWorkspace.toasts.submitFailed");
      toast.error(msg);
    }
  };

  const handleApprove = () => setShowRating(true);

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    setShowRating(false);
    try {
      if (!quest.assignedTo) {
        toast.error(t("questWorkspace.toasts.noWorker"));
        return;
      }

      await createReview.mutateAsync({
        taskId: quest.id,
        revieweeId: quest.assignedTo,
        rating: rating,
        comment: feedback,
        qualityScore: rating, // Simple mapping for now
        timelinessScore: rating,
        behaviorScore: rating,
        pointsAwarded: quest.rewardPoints,
      });

      toast.success(t("questWorkspace.toasts.approved"));
    } catch (err: any) {
      const msg = err.response?.data?.error || t("questWorkspace.toasts.approveFailed");
      const details = err.response?.data?.details;
      toast.error(`${msg}${details ? `: ${details}` : ""}`);
    }
  };

  const handleRequestChanges = async () => {
    try {
      await updateStatus.mutateAsync({ id: quest.id, status: "in-progress" as any });
      toast(t("questWorkspace.toasts.changesRequested"));
    } catch {
      toast.error(t("questWorkspace.toasts.requestFailed"));
    }
  };

  const workerBid = bids.find((b) => b.userId === quest.assignedTo);
  const workerUsername = workerBid?.username || "Adventurer";
  const isOwner = user?.id === quest.providerId;

  return (
    <div className={`max-w-[1280px] mx-auto px-4 py-8 ${fontClass}`}>
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className={`mb-6 ${fontClass}`}>
          <span className={fontClass}>{t("questWorkspace.backToQuest")}</span>
        </PixelButton>
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <PixelFrame className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 ${fontClass}`}>
              <span className={cn(
                `font-pixel px-2 py-1 bg-background/50 border border-pixel-shadow/20 ${fontClass}`,
                quest.status === "review" ? "text-yellow-400" :
                  quest.status === "completed" ? "text-success" : "text-accent"
              )}>
                ● {t(`questDetail.status.${quest.status}`)}
              </span>
            </div>

            <h1 className={`font-pixel text-foreground pixel-text-shadow leading-relaxed mb-6 ${fontClass}`}>
              {quest.title}
            </h1>

            {/* Tabs Navigation */}
            <div className={`flex border-b border-pixel-shadow/20 mb-6 ${fontClass}`}>
              {[
                { id: "workflow", label: t("questWorkspace.tabs.workflow"), icon: Terminal },
                { id: "readme", label: t("questWorkspace.tabs.readme"), icon: FileText },
                { id: "files", label: t("questWorkspace.tabs.files"), icon: FolderTree },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    `px-6 py-3 font-pixel flex items-center gap-2 transition-all ${fontClass}`,
                    activeTab === tab.id
                      ? "bg-secondary text-accent border-t-2 border-l-2 border-r-2 border-pixel-shadow"
                      : "text-muted-foreground hover:bg-muted/30"
                  )}
                >
                  <tab.icon size={14} />
                  <span className={fontClass}>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={`h-[600px] overflow-hidden relative ${fontClass}`}>
              {activeTab === "workflow" && (
                <div className={`h-full overflow-y-auto pr-2 custom-scrollbar space-y-4 animate-in fade-in duration-300 ${fontClass}`}>
                  {workflowSteps.map((step, i) => (
                    <div key={i} className={`pixel-border bg-secondary/50 p-4 group ${fontClass}`}>
                      <div className={`flex items-center gap-3 mb-2 ${fontClass}`}>
                        <span className={`font-pixel text-accent w-8 ${fontClass}`}>{i + 1}.</span>
                        <span className={`font-pixel text-foreground group-hover:text-accent transition-colors ${fontClass}`}>{step.label}</span>
                      </div>
                      <p className={`text-muted-foreground ml-11 mb-2 ${fontClass}`}>{step.desc}</p>
                      {step.cmd && (
                        <div className={`pixel-inset bg-background px-3 py-2 ml-11 relative ${fontClass}`}>
                          <code className={`text-accent font-pixel-body whitespace-pre-wrap break-all ${fontClass}`}>{step.cmd}</code>
                          <button
                            className={`absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity font-pixel text-muted-foreground hover:text-accent ${fontClass}`}
                            onClick={() => {
                              navigator.clipboard.writeText(step.cmd!);
                              toast.success(t("questWorkspace.workflow.copied"));
                            }}
                          >
                            {t("questWorkspace.workflow.copyBtn")}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "readme" && (
                <div className={`h-full pixel-border bg-background/50 overflow-hidden animate-in zoom-in-95 duration-300 ${fontClass}`}>
                  {repoUrl ? (
                    <FileViewer repoUrl={repoUrl} path="README.md" branch={branch} />
                  ) : (
                    <div className={`h-full flex items-center justify-center font-pixel text-muted-foreground ${fontClass}`}>
                      No repository URL provided for this quest.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "files" && (
                <div className={`h-full animate-in slide-in-from-bottom-4 duration-300 ${fontClass}`}>
                  {repoUrl ? (
                    <RepoExplorer repoUrl={repoUrl} branch={branch} />
                  ) : (
                    <div className={`h-full flex items-center justify-center font-pixel text-muted-foreground ${fontClass}`}>
                      No repository URL provided for this quest.
                    </div>
                  )}
                </div>
              )}
            </div>
          </PixelFrame>

          {/* Provider Review Tools */}
          {isOwner && quest.status === "review" && (
            <PixelFrame className={`border-accent ${fontClass}`}>
              <div className={`flex items-center gap-3 mb-4 ${fontClass}`}>
                <Layout size={20} className="text-accent" />
                <h2 className={`font-pixel text-accent pixel-text-shadow ${fontClass}`}>{t("questWorkspace.review.title")}</h2>
              </div>
              <p className={`text-muted-foreground mb-6 ${fontClass}`}>
                {t("questWorkspace.review.desc")}
              </p>
              <div className="flex gap-4">
                <PixelButton variant="gold" size="md" onClick={handleApprove} className={`flex-1 ${fontClass}`}>
                  <span className={fontClass}>{t("questWorkspace.review.approveBtn")}</span>
                </PixelButton>
                <PixelButton variant="danger" size="md" onClick={handleRequestChanges} className={`flex-1 ${fontClass}`}>
                  <span className={fontClass}>{t("questWorkspace.review.requestChangesBtn")}</span>
                </PixelButton>
              </div>
            </PixelFrame>
          )}

          {/* Completion Banner */}
          {quest.status === "completed" && (
            <PixelFrame className={`bg-success/5 border-success border-2 ${fontClass}`}>
              <div className="text-center py-6">
                <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
                <h2 className={`font-pixel text-success pixel-text-shadow mb-2 ${fontClass}`}>{t("questWorkspace.victory")}</h2>
                <p className={`font-pixel text-accent ${fontClass}`}>{t("questWorkspace.rewardAwarded", { reward: quest.rewardPoints })}</p>
              </div>
            </PixelFrame>
          )}
        </div>

        {/* Info Sidebar */}
        <div className={`w-full lg:w-[320px] space-y-6 ${fontClass}`}>
          <PixelFrame>
            <h3 className={`font-pixel text-foreground pixel-text-shadow mb-4 uppercase tracking-wider underline ${fontClass}`}>{t("questWorkspace.sidebar.provider")}</h3>
            <div className="space-y-4">
              <div>
                <p className={`text-muted-foreground uppercase mb-1 ${fontClass}`}>{t("questWorkspace.sidebar.name")}</p>
                <p className={`text-foreground font-pixel ${fontClass}`}>{quest.providerName}</p>
              </div>
              <div>
                <p className={`text-muted-foreground uppercase mb-1 ${fontClass}`}>{t("questWorkspace.sidebar.contractId")}</p>
                <code className={`font-pixel text-accent bg-background/50 p-1 block truncate ${fontClass}`}>#{quest.id.slice(0, 8)}</code>
              </div>
            </div>
          </PixelFrame>

          <PixelFrame>
            <h3 className={`font-pixel text-foreground pixel-text-shadow mb-4 uppercase tracking-wider underline ${fontClass}`}>{t("questWorkspace.sidebar.statusReport")}</h3>
            <div className="space-y-4">
                <span className={`font-pixel text-accent ${fontClass}`}><Coins size={14} className="inline mr-1" /> {quest.rewardPoints} GP</span>
              <div className="flex justify-between items-center">
                <span className={`text-muted-foreground uppercase ${fontClass}`}>{t("questWorkspace.sidebar.estimated")}</span>
                <span className={`text-foreground ${fontClass}`}>{quest.estimatedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-muted-foreground uppercase ${fontClass}`}>{t("questWorkspace.sidebar.category")}</span>
                <span className={`text-foreground px-2 py-0.5 bg-secondary ${fontClass}`}>{quest.category}</span>
              </div>
            </div>
          </PixelFrame>

          {/* Action Button for Worker */}
          {user?.id === quest.assignedTo && quest.status === "in-progress" && (
            <PixelButton
              variant="gold"
              size="lg"
              className={`w-full py-6 ${fontClass}`}
              onClick={handleSubmitReview}
              isLoading={updateStatus.isPending}
            >
              <span className={fontClass}>{t("questWorkspace.actions.submitWork")}</span>
            </PixelButton>
          )}

          {user?.id === quest.assignedTo && quest.status === "review" && (
            <PixelButton
              variant="ghost"
              size="lg"
              className="w-full py-6 cursor-not-allowed opacity-80"
              disabled
            >
              {t("questWorkspace.actions.waitingReview")}
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
