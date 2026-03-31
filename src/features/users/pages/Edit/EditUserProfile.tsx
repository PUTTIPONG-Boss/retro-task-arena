import { useUserStore } from "@/features/users/store/userStore";
import { useUpdateProfile } from "@/features/users/services/user.service";
import PixelFrame from "@/components/PixelFrame";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PixelButton from "@/components/PixelButton";

const EditUserProfile = () => {
  const user = useUserStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px] font-pixel";

  const [github, setGithub] = useState(user?.github || "");
  const [linkin, setLinkin] = useState(user?.linkin || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState("");

  if (!user) return null;

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      // FIX: ส่งเฉพาะ id และ field ที่ user แก้ได้จริงๆ
      // ไม่ spread ...user ทั้งหมด เพราะจะทำให้ field อื่น (role, points, level ฯลฯ)
      // ถูกส่งไป PATCH และ backend อาจ overwrite ค่าสำคัญด้วยค่าผิดพลาด
      await updateProfile.mutateAsync({
        github,
        linkin,
        skills,
      });

      toast.success(t("editProfile.successMsg"), {
        style: {
          fontFamily:
            i18n.language === "th" ? "text-[16px]" : "text-[16px] font-pixel",
          fontSize: "10px",
        }
      });
      navigate(-1);
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    }
  };

  return (
    <div
      className={`max-w-[900px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`text-red-500 hover:text-red-400 transition-colors font-pixel ${fontClass}`}
        >
          {t("editProfile.cancel")}
        </button>
        <h1
          className={`text-accent text-4xl pixel-text-shadow font-pixel ${fontClass}`}
        >
          {t("editProfile.title")}
        </h1>
      </div>

      <PixelFrame className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 py-2">
          <div className="flex-1 w-full space-y-4">
            <div>
              <label
                className={`block mb-1 font-pixel ${fontClass}`}
              >
                {t("editProfile.labels.username")}
              </label>
              <div
                className={`w-full bg-secondary/50 pixel-border p-2 text-foreground/70 font-pixel ${fontClass}`}
              >
                {user.username}
              </div>
            </div>
          </div>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}
        >
          ⚔ {t("editProfile.skills.title")}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className={`pixel-border bg-secondary px-3 py-1 text-foreground flex items-center gap-2 font-pixel ${fontClass}`}
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-accent hover:text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("editProfile.skills.placeholder")}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            className={`flex-1 bg-secondary pixel-border p-2 text-foreground placeholder-amber-400 focus:outline-none font-pixel ${fontClass}`}
          />
          <button
            onClick={addSkill}
            className={`pixel-border bg-muted px-4 text-amber-500 hover:text-amber-300 font-pixel ${fontClass}`}
          >
            {t("editProfile.skills.addBtn")}
          </button>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}
        >
          🔗 {t("editProfile.githubUrl")}
        </h2>
        <input
          type="text"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          placeholder={t("editProfile.githubPlaceholder")}
          className={`w-full bg-secondary pixel-border p-3 focus:outline-none font-pixel ${fontClass}`}
        />
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}
        >
          🔗 {t("editProfile.linkinUrl")}
        </h2>
        <input
          type="text"
          value={linkin}
          onChange={(e) => setLinkin(e.target.value)}
          placeholder={t("editProfile.linkinPlaceholder")}
          className={`w-full bg-secondary pixel-border p-3 focus:outline-none font-pixel ${fontClass}`}
        />
      </PixelFrame>

      <PixelButton
        type="submit"
        variant="gold"
        size="lg"
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className={`w-full font-pixel flex items-center justify-center gap-2 h-11 ${i18n.language === "th" ? "pb-1.5 pt-0" : "pt-0.5 pb-0"} ${fontClass}`}
      >
        {updateProfile.isPending ? t("common.loading") : t("editProfile.confirmBtn")}
      </PixelButton>
    </div>
  );
};

export default EditUserProfile;