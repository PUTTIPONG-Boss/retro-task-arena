import { useParams, Link } from "react-router-dom";
import { mockQuests } from "@/data/mockData";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";

const QuestWorkspace = () => {
  const { id } = useParams();
  const quest = mockQuests.find((q) => q.id === id);

  if (!quest) return null;

  const steps = [
    { label: "Clone Repository", cmd: `git clone ${quest.repoUrl || "https://github.com/example/repo"}`, done: false },
    { label: "Create Branch", cmd: `git checkout -b ${quest.branchName || "quest/your-branch"}`, done: false },
    { label: "Push Commits", cmd: "git add . && git commit -m 'quest complete' && git push origin HEAD", done: false },
    { label: "Submit Pull Request", cmd: "Open PR on GitHub targeting main branch", done: false },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className="mb-6">← Back to Quest</PixelButton>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <PixelFrame variant="parchment">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-pixel text-[9px] text-accent pixel-text-shadow">🛠 QUEST WORKSPACE</span>
            </div>
            <h1 className="font-pixel text-[13px] text-parchment-foreground pixel-text-shadow leading-relaxed mb-4">
              {quest.title}
            </h1>
            <div className="text-xl leading-relaxed text-parchment-foreground/90 whitespace-pre-line">
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
                    <span className="font-pixel text-[10px] text-accent w-6">{i + 1}.</span>
                    <span className="font-pixel text-[10px] text-foreground">{step.label}</span>
                  </div>
                  <div className="pixel-inset bg-background px-3 py-2 ml-9">
                    <code className="text-lg text-primary font-pixel-body break-all">{step.cmd}</code>
                  </div>
                </div>
              ))}
            </div>
          </PixelFrame>
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
                <span className="font-pixel text-[9px] text-accent">{quest.status.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lg text-muted-foreground">Reward</span>
                <span className="font-pixel text-[9px] text-accent">🪙 {quest.rewardPoints} GP</span>
              </div>
            </div>
          </PixelFrame>

          <PixelButton variant="gold" size="lg" className="w-full">
            ✅ Mark Complete
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default QuestWorkspace;
