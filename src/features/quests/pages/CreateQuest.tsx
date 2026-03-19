import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useQuestStore } from "@/features/quests/store/questStore";
import {
  useCreateQuest,
  CreateQuestPayload,
} from "@/features/quests/services/quest.service";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const difficulties: { label: string; value: number }[] = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 3 },
  { label: "Hard", value: 5 },
];

const categories = ["Frontend", "Backend", "Bug Fix", "Feature"];

const CreateQuest = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [repoUrl, setRepoUrl] = useState("");
  const [branchName, setBranchName] = useState("");

  const { mutate: createQuest, isPending } = useCreateQuest();

  const { t, i18n } = useTranslation();

  // ⭐️ 1. สร้าง fontClass สำหรับสลับฟอนต์ไทย-อังกฤษ
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

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
      skills: "General", // Placeholder for now, can be added to form later
      difficulty: difficultyStr,
      git_repo_url: repoUrl || undefined,
      req_branch_name: branchName || undefined,
    };

    createQuest(newQuest, {
      onSuccess: () => {
        // ⭐️ 2. ดึงคำแปล successMsg และเปลี่ยนฟอนต์ของ toast ให้สอดคล้องกัน
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
          className={`font-pixel text-foreground pixel-text-shadow mb-2 ${fontClass}`}
        >
          📜 {t("createQuest.title")}
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
            className={`w-full font-pixel flex items-center justify-center gap-2 h-11 ${i18n.language === "th" ? "pb-1.5 pt-0" : "pt-0.5 pb-0"} ${fontClass}`}
            disabled={isPending}
          >
            {isPending ? `📜 ${t("createQuest.submitBtn")}...` : `📜 ${t("createQuest.submitBtn")}`}
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default CreateQuest;
