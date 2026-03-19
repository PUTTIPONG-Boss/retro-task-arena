import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useQuestStore } from "@/features/quests/store/questStore";
import { useCreateQuest } from "@/features/quests/services/quest.service";
import { CreateQuestPayload } from "@/features/quests/types";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
import { useEffect } from "react";

const difficulties: { label: string; value: number }[] = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 3 },
  { label: "Hard", value: 5 },
];

const categories = ["Frontend", "Backend", "Bug Fix", "Feature"];

const CreateQuest = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && !(user.role === 'employer' || user.role.toLowerCase().includes('senior'))) {
      toast.error("Access denied. Only Senior Adventurers or Employers can post quests.");
      navigate("/");
    }
  }, [user, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [repoUrl, setRepoUrl] = useState("");
  const [branchName, setBranchName] = useState("");

  const [selectedSkills, setSelectedSkills] = useState<string[]>(["General"]);
  const [customSkill, setCustomSkill] = useState("");

  const { mutate: createQuest, isPending } = useCreateQuest();

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length === 1 && selectedSkills[0] === "General") return; // Keep at least one
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkill("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to post a quest.");
      return;
    }

    // Map Difficulty to Backend String
    let difficultyStr = "EASY";
    if (difficulty === 3) difficultyStr = "MEDIUM";
    if (difficulty === 5) difficultyStr = "HARD";

    // Map Category to Backend String explicitly
    let categoryStr = "FRONTEND";
    if (category === "Backend") categoryStr = "BACKEND";
    if (category === "Bug Fix") categoryStr = "BUG FIX";
    if (category === "Feature") categoryStr = "FEATURE";

    // Format Backend Payload
    const newQuest: CreateQuestPayload = {
      employer_id: user.id,
      title,
      description,
      point: parseInt(rewardPoints) || 0,
      estimated_time: `${estimatedTime} Cycles`,
      type: categoryStr,
      skills: selectedSkills.join(", "),
      difficulty: difficultyStr,
      git_repo_url: repoUrl || undefined,
      req_branch_name: branchName || undefined,
    };

    createQuest(newQuest, {
      onSuccess: () => {
        toast.success("Quest posted to the board!", {
          style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
        });
        navigate("/");
      },
      onError: (error) => {
        console.error("Failed to post quest:", error);
        toast.error("Failed to post the quest. Ensure the API is running.", {
          style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
        });
      }
    });
  };

  const mainSkills = ["Golang", "Node.js", "Vue", "Angular", "React", "Next.js", "General"];

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

          {/* Skill Selection Section */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {mainSkills.map((skill) => (
                  <PixelButton
                    key={skill}
                    type="button"
                    variant={selectedSkills.includes(skill) ? "gold" : "ghost"}
                    size="sm"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </PixelButton>
                ))}
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2 items-end mb-4">
                <div className="flex-1">
                  <PixelInput
                    placeholder="Add other skills (e.g. Rust, Docker)"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  />
                </div>
                <PixelButton type="button" variant="primary" size="sm" onClick={addCustomSkill}>
                  Add
                </PixelButton>
              </div>

              {/* Selected Skills Badges */}
              <div className="flex flex-wrap gap-2 min-h-[30px] p-2 bg-secondary/30 pixel-border border-dashed">
                {selectedSkills.length === 0 ? (
                  <span className="text-xs text-muted-foreground italic">No skills selected</span>
                ) : (
                  selectedSkills.map((skill) => (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={skill}
                      className="flex items-center gap-2 bg-accent/20 border border-accent/50 px-2 py-1"
                    >
                      <span className="font-pixel text-[8px] text-accent">{skill}</span>
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="text-accent hover:text-foreground transition-colors"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))
                )}
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

          <PixelButton type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "📜 Posting..." : "📜 Post Quest"}
          </PixelButton>
        </form >
      </PixelFrame >
    </div >
  );
};

export default CreateQuest;
