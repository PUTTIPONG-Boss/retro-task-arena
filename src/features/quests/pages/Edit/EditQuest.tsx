import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useGetQuestById, useUpdateQuest, useGetBids } from "@/features/quests/services/quest.service";
import { toast } from "sonner";
import DifficultyStars from "@/features/quests/components/DifficultyStars";

const difficulties = [
  { label: "Easy", value: "EASY", level: 1 },
  { label: "Medium", value: "MEDIUM", level: 3 },
  { label: "Hard", value: "HARD", level: 5 },
];

const categories = ["FRONTEND", "BACKEND", "DEVOPS", "BUG FIX", "FEATURE"];

const EditQuest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: quest, isLoading: isLoadingQuest } = useGetQuestById(id);
  const { data: bids = [] } = useGetBids(id);
  const updateQuestMutation = useUpdateQuest();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [category, setCategory] = useState("FRONTEND");
  const [repoUrl, setRepoUrl] = useState("");
  const [branchName, setBranchName] = useState("");
  const [skills, setSkills] = useState("");

  const hasBids = bids.length > 0;

  useEffect(() => {
    if (quest) {
      setTitle(quest.title);
      setDescription(quest.fullDescription || quest.description);
      setRewardPoints(quest.rewardPoints.toString());

      // Map level (1, 3, 5) back to value (EASY, MEDIUM, HARD)
      const diffObj = difficulties.find(d => d.level === quest.difficulty);
      setDifficulty(diffObj ? diffObj.value : "EASY");

      setEstimatedTime(quest.estimatedTime);
      setCategory(quest.category);
      setRepoUrl(quest.repoUrl || "");
      setBranchName(quest.branchName || "");
      setSkills(quest.skills || "");
    }
  }, [quest]);

  if (isLoadingQuest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-pixel text-[12px] animate-pulse">Loading quest data...</p>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasBids) {
      toast.error("Cannot edit a quest that already has bids.");
      return;
    }

    try {
      await updateQuestMutation.mutateAsync({
        id: quest.id,
        payload: {
          title,
          description,
          point: parseInt(rewardPoints) || 0,
          difficulty,
          estimated_time: estimatedTime,
          type: category,
          git_repo_url: repoUrl || "",
          req_branch_name: branchName || "",
          skills,
        }
      });

      toast.success("Quest updated successfully!");
      navigate(`/quest/${quest.id}`);
    } catch (error) {
      toast.error("Failed to update quest.");
    }
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <PixelButton variant="ghost" size="sm" className="mb-6" onClick={() => navigate(`/quest/${quest.id}`)}>
        ← Back to Quest
      </PixelButton>

      <PixelFrame>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow mb-2">
              ⚙️ Edit Quest
            </h1>
            <p className="text-xl text-muted-foreground">
              Modify the details of your requested task.
            </p>
          </div>
          {hasBids && (
            <div className="pixel-border bg-destructive/10 border-destructive p-3 max-w-[200px]">
              <p className="font-pixel text-[8px] text-destructive leading-tight">
                ⚠️ EDITING DISABLED
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Quest Title</label>
            <PixelInput
              placeholder="e.g. Slay the Authentication Dragon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={hasBids}
            />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Quest Description</label>
            <PixelTextarea
              rows={6}
              placeholder="Describe the quest requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={hasBids}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Base Reward (GP)</label>
              <PixelInput
                type="number"
                placeholder="1000"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                required
                disabled={hasBids}
              />
            </div>
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Estimated Time</label>
              <PixelInput
                placeholder="e.g. 3-5 days"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                required
                disabled={hasBids}
              />
            </div>
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Required Skills (comma separated)</label>
            <PixelInput
              placeholder="React, TypeScript, Go"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              disabled={hasBids}
            />
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
                    disabled={hasBids}
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
                    disabled={hasBids}
                  >
                    {cat}
                  </PixelButton>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Git Repository URL</label>
              <PixelInput
                placeholder="https://github.com/org/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={hasBids}
              />
            </div>
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Required Branch Name</label>
              <PixelInput
                placeholder="e.g. main"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                disabled={hasBids}
              />
            </div>
          </div>

          {!hasBids ? (
            <PixelButton
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={updateQuestMutation.isPending}
            >
              💾 Save Changes
            </PixelButton>
          ) : (
            <div className="text-center p-4 pixel-border bg-secondary/50">
              <p className="font-pixel text-[9px] text-muted-foreground">
                This quest is locked for editing because it has active bids.
              </p>
            </div>
          )}
        </form>
      </PixelFrame>
    </div>
  );
};

export default EditQuest;