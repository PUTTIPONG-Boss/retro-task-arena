import React from "react";
import { useTranslation } from "react-i18next";
import { Sword } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";

interface ProfileSkillsProps {
  skills: string[];
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ skills }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  return (
    <PixelFrame className="mb-6">
      <h2
        className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
      >
        <Sword /> {t("userProfile.skills")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`pixel-border bg-secondary px-3 py-1 text-foreground font-pixel ${fontClass}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </PixelFrame>
  );
};

export default ProfileSkills;
