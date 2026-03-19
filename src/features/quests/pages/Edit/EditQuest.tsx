import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useQuestStore } from "@/features/quests/store/questStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const difficulties: { label: string; value: number; key: string }[] = [
  { label: "Easy", value: 1, key: "Easy" },
  { label: "Medium", value: 3, key: "Medium" },
  { label: "Hard", value: 5, key: "Hard" },
];

const categories = ["Frontend", "Backend", "Bug Fix", "Feature"];

const EditQuest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[14px]";
  
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
          <p className={`font-pixel text-foreground pixel-text-shadow ${fontClass}`}>Quest not found...</p>
          <PixelButton variant="primary" size="sm" className={`mt-4 font-pixel ${fontClass}`} onClick={() => navigate("/")}>
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

    // ⭐️ ดึงคำแปล successMsg
    toast.success(t("editQuest.successMsg"), {
      style: { fontFamily: i18n.language === "th" ? '"TA-ChaiLai"' : '"Press Start 2P"', fontSize: "10px" },
    });
    
    navigate(`/quest/${quest.id}`);
  };

  return (
    <div className={`max-w-[700px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA-ChaiLai']" : ""}`}>
      <PixelButton variant="ghost" size="sm" className={`mb-6 font-pixel ${fontClass}`} onClick={() => navigate(`/quest/${quest.id}`)}>
        {/* ⭐️ ดึงคำแปลปุ่มย้อนกลับ */}
        ← {t("editQuest.back")}
      </PixelButton>

      <PixelFrame>
        <h1 className={`font-pixel text-foreground pixel-text-shadow mb-2 ${fontClass}`}>
          {/* ⭐️ ดึงคำแปลชื่อหน้า */}
          ⚙️ {t("editQuest.title")}
        </h1>
        <p className={`text-muted-foreground mb-6 font-pixel ${fontClass}`}>
          {/* ⭐️ ดึงคำแปลคำอธิบายหน้า */}
          {t("editQuest.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {/* ⭐️ ดึงคำแปล Label ชื่อเควสต์ */}
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.questTitle")}</label>
            <PixelInput className={`font-pixel ${fontClass}`} placeholder="e.g. Slay the Authentication Dragon" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            {/* ⭐️ ดึงคำแปล Label รายละเอียดเควสต์ */}
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.questDesc")}</label>
            <PixelTextarea className={`font-pixel ${fontClass}`} rows={6} placeholder="Describe the quest requirements..." value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* ⭐️ ดึงคำแปล Label รางวัล */}
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.baseReward")}</label>
              <PixelInput className={`font-pixel ${fontClass}`} type="number" placeholder="1000" value={rewardPoints} onChange={(e) => setRewardPoints(e.target.value)} required />
            </div>
            <div>
              {/* ⭐️ ดึงคำแปล Label เวลา */}
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.estimatedTime")}</label>
              <PixelInput className={`font-pixel ${fontClass}`} placeholder="e.g. 8" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* ⭐️ ดึงคำแปล Label ความยาก */}
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.difficulty")}</label>
              <div className="flex gap-2">
                {difficulties.map((d) => (
                  <PixelButton
                    key={d.value}
                    type="button"
                    variant={difficulty === d.value ? "gold" : "ghost"}
                    size="sm"
                    className={`font-pixel ${fontClass}`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    {/* ⭐️ ดึงคำแปลตัวเลือกความยาก */}
                    {t(`editQuest.difficulties.${d.key}`)}
                  </PixelButton>
                ))}
              </div>
            </div>
            <div>
              {/* ⭐️ ดึงคำแปล Label หมวดหมู่ */}
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.category")}</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <PixelButton
                    key={cat}
                    type="button"
                    variant={category === cat ? "gold" : "ghost"}
                    size="sm"
                    className={`font-pixel ${fontClass}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat} {/* ใน JSON ไม่มีคำแปลหมวดหมู่ของ editQuest เลยขออนุญาตใช้ค่าเดิมไปก่อนนะครับ */}
                  </PixelButton>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* ⭐️ ดึงคำแปล Label Git URL */}
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("editQuest.labels.repoUrl")}</label>
            <PixelInput className={`font-pixel ${fontClass}`} placeholder="https://github.com/org/repo" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
          </div>

          <div>
            {/* ใน JSON ไม่ได้ให้ branchName มา ขออิงคำแปลจาก createQuest ไว้ก่อนหรือใช้คำเดิมนะครับ */}
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>{t("createQuest.labels.branchName", "Required Branch Name")}</label>
            <PixelInput className={`font-pixel ${fontClass}`} placeholder="e.g. feature/quest-42" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
          </div>

          <PixelButton type="submit" variant="gold" size="lg" className={`w-full font-pixel ${fontClass}`}>
             {/* ⭐️ ดึงคำแปลปุ่มบันทึก */}
            💾 {t("editQuest.saveBtn")}
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default EditQuest;