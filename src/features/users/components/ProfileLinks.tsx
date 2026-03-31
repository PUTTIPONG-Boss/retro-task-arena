import React from "react";
import { useTranslation } from "react-i18next";
import { Github, Linkedin } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";

interface ProfileLinksProps {
  githubUrl: string;
  linkinUrl: string;
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ githubUrl, linkinUrl }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  return (
    <>
      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Github size={20} className="text-yellow-400"></Github>
          {t("userProfile.links")}
        </h2>
        {githubUrl ? (
          <a
            href={githubUrl.startsWith("http") ? githubUrl : `https://${githubUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-accent hover:text-gray-300 font-pixel ${fontClass} transition-colors break-all`}
          >
            {githubUrl}
          </a>
        ) : (
          <p className={`text-muted-foreground font-pixel ${fontClass}`}>
            {t("userProfile.noGithub")}
          </p>
        )}
      </PixelFrame>

      <PixelFrame className="mb-6">
  <h2
    className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center leading-none gap-2`}
  >
    <Linkedin size={18} className="text-yellow-400 shrink-0" />
    {t("userProfile.linkedinLinks")}
  </h2>
  {linkinUrl ? (
        <a
          href={linkinUrl.startsWith("http") ? linkinUrl : `https://${linkinUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-accent hover:text-gray-300 font-pixel ${fontClass} transition-colors break-all`}
        >
          {linkinUrl}
        </a>
  ) : (
    <p className={`text-muted-foreground font-pixel ${fontClass}`}>
      {t("userProfile.noLinkedin")}
    </p>
  )}
</PixelFrame>
    </> 
  );
};

export default ProfileLinks;
