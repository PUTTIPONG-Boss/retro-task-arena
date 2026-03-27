import React from "react";
import { useTranslation } from "react-i18next";
import { Github } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";

interface ProfileLinksProps {
  githubUrl: string;
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ githubUrl }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  return (
    <PixelFrame className="mb-6">
      <h2
        className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
      >
        <Github size={20} className="text-white"></Github>
        {t("userProfile.links")}
      </h2>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-accent hover:text-gray-300 font-pixel ${fontClass} transition-colors`}
      >
        {githubUrl}
      </a>
    </PixelFrame>
  );
};

export default ProfileLinks;
