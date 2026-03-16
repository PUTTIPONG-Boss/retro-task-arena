import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
// 1. เปลี่ยน Import มาใช้ Zustand
import { useQuestStore } from "@/features/quests/store/questStore";
import { toast } from "sonner";

const difficulties: { label: string; value: number }[] = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 3 },
  { label: "Hard", value: 5 },
];

const categories = ["Frontend", "Backend", "Bug Fix", "Feature"];

const EditQuest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 2. ดึง State จาก Zustand แทน Context
  const quests = useQuestStore((state) => state.quests);
  const updateQuest = useQuestStore((state) => state.updateQuest);

  const quest = quests.find((q) => q.id === id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [repoUrl, setRepoUrl] = useState("");
  const [branchName, setBranchName] = useState("");

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.fullDescription || quest.description);
      setRewardPoints(quest.rewardPoints.toString());
      setDifficulty(quest.difficulty);
      
      const timeMatch = quest.estimatedTime.match(/\d+/);
      setEstimatedTime(timeMatch ? timeMatch[0] : quest.estimatedTime);
      
      setCategory(quest.category);
      setRepoUrl(quest.repoUrl || "");
      setBranchName(quest.branchName || "");
    }
  }, [quest]);

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelFrame>
          <p className="font-pixel text-[12px] text-foreground pixel-text-shadow">Quest not found...</p>
          <PixelButton variant="primary" size="sm" className="mt-4" onClick={() => navigate("/")}>
            Return to Board
          </PixelButton>
        </PixelFrame>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      title,
      description,
      fullDescription: description,
      rewardPoints: parseInt(rewardPoints) || 0,
      difficulty,
      estimatedTime: `~${estimatedTime} Cycles`,
      category,
      repoUrl: repoUrl || undefined,
      branchName: branchName || undefined,
    };

    if (updateQuest) {
      updateQuest(quest.id, updatedData);
    }

    toast.success("Quest updated successfully!", {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
    
    navigate(`/quest/${quest.id}`);
  };

  // (ส่วน Return UI ด้านล่างเหมือนเดิมทั้งหมดครับ)
  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <PixelButton variant="ghost" size="sm" className="mb-6" onClick={() => navigate(`/quest/${quest.id}`)}>
        ← Back to Quest
      </PixelButton>

      <PixelFrame>
        <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow mb-2">
          ⚙️ Edit Quest
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Modify the details of your requested task.
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
              <label className="font-pixel text-[9px] text-foreground block mb-2">Estimated Time (Cycles)</label>
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
            💾 Save Changes
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default EditQuest;