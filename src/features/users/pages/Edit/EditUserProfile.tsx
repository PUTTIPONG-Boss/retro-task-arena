import { useUserStore } from "@/features/users/store/userStore";
import { useUpdateProfile } from "@/features/users/services/user.service";
import PixelFrame from "@/components/PixelFrame";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PixelButton from "@/components/PixelButton";
import { Github, Linkedin, Sword, Gitlab } from "lucide-react";

const EditUserProfile = () => {
  const user = useUserStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px] font-pixel";

  const [github, setGithub] = useState(user?.github || "");
  const [linkin, setLinkin] = useState(user?.linkin || "");
  const [gitlabUsername, setGitlabUsername] = useState(user?.gitlabUsername || "");
  const [gitInetUsername, setGitInetUsername] = useState(user?.gitInetUsername || "");
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
      await updateProfile.mutateAsync({
        github,
        linkin,
        skills,
        gitlabUsername,
        gitInetUsername,
      });

      toast.success(t("editProfile.successMsg"), {
        style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"TA_8bit"', fontSize: "16px" },
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
                className={`flex items-center gap-2 mb-1 font-pixel ${fontClass}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px] text-yellow-400 shrink-0">
                  <path d="M6 22H4v-4h2v4Zm14 0h-2v-4h2v4ZM8 18H6v-2h2v2Zm10 0h-2v-2h2v2Zm-2-2H8v-2h8v2Zm-1-4H9v-2h6v2Zm-6-2H7V4h2v6Zm8 0h-2V4h2v6Zm-2-6H9V2h6v2Z"/>
                </svg>
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
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Sword className="text-yellow-400" />
          {t("editProfile.skills.title")}
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
            className={`flex-1 bg-secondary pixel-border p-2 text-foreground placeholder-white-400 focus:outline-none font-pixel ${fontClass}`}
          />
          <button
            onClick={addSkill}
            className={`pixel-border bg-muted px-4 font-pixel transition-colors ${fontClass} ${
              newSkill.trim() ? "text-amber-400 hover:text-amber-300" : "text-gray-500"
            }`}
          >
            {t("editProfile.skills.addBtn")}
          </button>
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Github size={18} className="text-yellow-400" />
          {t("editProfile.githubUrl")}
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
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Gitlab size={18} className="text-yellow-400" />
          {t("editProfile.gitlabUrl")}
        </h2>
        <input
          type="text"
          value={gitlabUsername}
          onChange={(e) => setGitlabUsername(e.target.value.replace(/@/g, ""))}
          placeholder={t("editProfile.gitlabPlaceholder")}
          className={`w-full bg-secondary pixel-border p-3 focus:outline-none font-pixel ${fontClass}`}
        />
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Gitlab size={18} className="text-yellow-400" />
          {t("editProfile.gitInetUrl")}
        </h2>
        <input
          type="text"
          value={gitInetUsername}
          onChange={(e) => setGitInetUsername(e.target.value.replace(/@/g, ""))}
          placeholder={t("editProfile.gitInetPlaceholder")}
          className={`w-full bg-secondary pixel-border p-3 focus:outline-none font-pixel ${fontClass}`}
        />
      </PixelFrame>

            <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Linkedin size={18} className="text-yellow-400" />
          {t("editProfile.linkinUrl")}
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