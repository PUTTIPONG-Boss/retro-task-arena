import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useQuestStore } from "@/features/quests/store/questStore";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";

const difficulties: { label: string; value: number }[] = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 3 },
  { label: "Hard", value: 5 },
];

const categories = ["Frontend", "Backend", "Bug Fix", "Feature"];

const CreateQuest = () => {
  const navigate = useNavigate();
  const addQuest = useQuestStore((state) => state.addQuest);
  const user = useUserStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [repoUrl, setRepoUrl] = useState("");
  const [branchName, setBranchName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuest = {
      id: `q-${Date.now()}`,
      title,
      description,
      fullDescription: description,
      rewardPoints: parseInt(rewardPoints) || 0,
      difficulty,
      estimatedTime: `~${estimatedTime} Cycles`,
      category,
      status: "open" as const,
      providerId: user?.id || "unknown",
      providerName: user?.username || "Unknown Adventurer",
      repoUrl: repoUrl || undefined,
      branchName: branchName || undefined,
      bids: [],
    };

    addQuest(newQuest);
    toast.success("Quest posted to the board!", {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
    navigate("/");
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <PixelButton variant="ghost" size="sm" className="mb-6" onClick={() => navigate("/")}>
        ← Back to Board
      </PixelButton>

      <PixelFrame>
        <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow mb-2">
          📜 Post New Quest
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Define a task for adventurers to complete.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Quest Title</label>
            <PixelInput placeholder="e.g. Slay the Authentication Dragon" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Quest Description</label>
            <PixelTextarea rows={6} placeholder="Describe the quest requirements..." value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Base Reward (GP)</label>
              <PixelInput type="number" placeholder="1000" value={rewardPoints} onChange={(e) => setRewardPoints(e.target.value)} required />
            </div>
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Estimated Time</label>
              <PixelInput placeholder="e.g. 8" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Difficulty</label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <PixelButton
                    key={d.value}
                    type="button"
                    variant={difficulty === d.value ? "gold" : "ghost"}
                    size="sm"
                    onClick={() => setDifficulty(d.value)}
                  >
                    {d.label}
                  </PixelButton>
                ))}
              </div>
            </div>
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <PixelButton
                    key={cat}
                    type="button"
                    variant={category === cat ? "gold" : "ghost"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </PixelButton>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Git Repository URL</label>
            <PixelInput placeholder="https://github.com/org/repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Required Branch Name</label>
            <PixelInput placeholder="e.g. feature/quest-42" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
          </div>

          <PixelButton type="submit" variant="gold" size="lg" className="w-full">
            📜 Post Quest
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default CreateQuest;
