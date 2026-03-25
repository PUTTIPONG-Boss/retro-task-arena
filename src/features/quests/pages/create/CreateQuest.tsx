import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useQuestStore } from "@/features/quests/store/questStore";
import { useTranslation } from "react-i18next";
import { useCreateQuest } from "@/features/quests/services/quest.service";
import { CreateQuestPayload } from "@/features/quests/types";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
import { useEffect } from "react";
import PixelClipboardList from "@/components/icons/PixelClipboardList";

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
    if (user && !(user.role === 'employer' || user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('senior'))) {
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

  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

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
        toast.success(t("createQuest.successMsg"), {
          style: { fontFamily: i18n.language === "th" ? '"TA-ChaiLai"' : '"Press Start 2P"', fontSize: "10px" },
        });
        navigate("/");
      },
      onError: (error) => {
        console.error("Failed to post quest:", error);
        toast.error("Failed to post the quest. Ensure the API is running.", {
          style: { fontFamily: i18n.language === "th" ? '"TA-ChaiLai"' : '"Press Start 2P"', fontSize: "10px" },
        });
      },
    });
  };

  const mainSkills = ["Golang", "Node.js", "Vue", "Angular", "React", "Next.js", "General"];

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <PixelButton
        variant="ghost"
        size="sm"
        className={`mb-6 font-pixel ${fontClass}`}
        onClick={() => navigate("/")}
      >
        ← {t("createQuest.back")}
      </PixelButton>

      <PixelFrame>
        <h1
          className={`flex items-center gap-2 font-pixel text-foreground pixel-text-shadow mb-2 ${fontClass}`}
        >
          <PixelClipboardList size={24} className="text-yellow-400" /> {t("createQuest.title")}
        </h1>
        <p className={`text-muted-foreground mb-6 font-pixel ${fontClass}`}>
          {t("createQuest.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`font-pixel text-foreground block mb-2 ${fontClass}`}
            >
              {" "}
              {t("createQuest.labels.questTitle")}
            </label>
            <PixelInput
              placeholder={t("createQuest.placeholders.questTitle")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`font-pixel ${fontClass}`}
              required
            />
          </div>

          <div>
            <label
              className={`font-pixel text-foreground block mb-2 ${fontClass}`}
            >
              {t("createQuest.labels.questDesc")}
            </label>
            <PixelTextarea
              rows={6}
              placeholder={t("createQuest.placeholders.questDesc")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`font-pixel ${fontClass}`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
                {t("createQuest.labels.baseReward")}
              </label>
              <PixelInput
                type="number"
                placeholder={t("createQuest.placeholders.reward")}
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                className={`font-pixel ${fontClass}`}
                required
              />
            </div>
            <div>
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
                {t("createQuest.labels.estimatedTime")}
              </label>
              <PixelInput
                placeholder={t("createQuest.placeholders.time")}
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className={`font-pixel ${fontClass}`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
                {t("createQuest.labels.difficulty")}
              </label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <PixelButton
                    key={d.value}
                    type="button"
                    variant={difficulty === d.value ? "gold" : "ghost"}
                    size="sm"
                    onClick={() => setDifficulty(d.value)}
                    className={`font-pixel ${fontClass}`}
                  >
                    {t(`createQuest.difficulties.${d.label}`)}
                  </PixelButton>
                ))}
              </div>
            </div>
            <div>
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
                {t("createQuest.labels.category")}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <PixelButton
                    key={cat}
                    type="button"
                    variant={category === cat ? "gold" : "ghost"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className={`font-pixel ${fontClass}`}
                  >
                    {t(`createQuest.categories.${cat}`, cat)}
                  </PixelButton>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Selection Section */}
          <div className="space-y-4 pt-2">
            <div>
              <label className={`font-pixel text-foreground block mb-2" ${fontClass}`}>{t("createQuest.labels.requiredSkills")}</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {mainSkills.map((skill) => (
                  <PixelButton
                    key={skill}
                    type="button"
                    variant={selectedSkills.includes(skill) ? "gold" : "ghost"}
                    size="sm"
                    className={`font-pixel ${fontClass}`}
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
                    placeholder={t("createQuest.placeholders.customSkill")}
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    className={`font-pixel ${fontClass}`}
                  />
                </div>
                <PixelButton type="button" variant="gold" size="sm" onClick={addCustomSkill} className={`font-pixel ${fontClass}`}>
                  {t("createQuest.buttons.add")}
                </PixelButton>
              </div>

              {/* Selected Skills Badges */}
              <div className="flex flex-wrap gap-2 min-h-[30px] p-2 bg-secondary/30 pixel-border border-dashed">
                {selectedSkills.length === 0 ? (
                  <span className={`font-pixeltext-xs text-muted-foreground italic ${fontClass}`}>{t("createQuest.messages.noSkills")}</span>
                ) : (
                  selectedSkills.map((skill) => (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={skill}
                      className="flex items-center gap-2 bg-accent/20 border border-accent/50 px-2 py-1"
                    >
                      <span className={`font-pixel ${fontClass}`}>{skill}</span>
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
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {t("createQuest.labels.repoUrl")}
            </label>
            <PixelInput
              placeholder={t("createQuest.labels.repoUrlPlaceholder")}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className={`font-pixel ${fontClass}`}
            />
          </div>

          <div>
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {t("createQuest.labels.branchName")}
            </label>
            <PixelInput
              placeholder={t("createQuest.labels.branchNamePlaceholder")}
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className={`font-pixel ${fontClass}`}
            />
          </div>

          <PixelButton
            type="submit"
            variant="gold"
            size="lg"
            className="w-full font-pixel h-14"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <PixelClipboardList size={18} />
                <span className={fontClass}>{t("createQuest.submitBtn")}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <PixelClipboardList size={18} />
                <span className={fontClass}>{t("createQuest.submitBtn")}</span>
              </div>
            )}
          </PixelButton>
        </form >
      </PixelFrame >
    </div >
  );
};

export default CreateQuest;