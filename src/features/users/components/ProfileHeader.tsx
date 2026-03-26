import React from "react";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import { UserProfile } from "../types";

interface ProfileHeaderProps {
  user: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  return (
    <PixelFrame className="mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 pixel-border bg-secondary flex items-center justify-center">
          <span
            className={`text-white font-bold pixel-text-shadow font-pixel ${
              i18n.language === "th" ? "text-[36px]" : "text-[28px]"
            } ${fontClass}`}
          >
            {user.username[0]}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1
            className={`text-[22px] text-white font-bold pixel-text-shadow font-pixel ${fontClass}`}
          >
            {user.username}
          </h1>
          <p
            className={`text-white pixel-text-shadow mt-1 font-pixel ${fontClass}`}
          >
            {user.title}
          </p>
          <p className={`text-muted-foreground mt-1 font-pixel ${fontClass}`}>
            {t("userProfile.joined")} {user.joinedDate}
          </p>
        </div>

        <div className="pixel-border bg-secondary px-6 py-3 text-center">
          <p className={`text-muted-foreground mb-1 font-pixel ${fontClass}`}>
            {t("userProfile.level")}
          </p>
          <p
            className={`text-[22px] text-white pixel-text-shadow font-pixel ${fontClass}`}
          >
            {user.level}
          </p>
        </div>
      </div>
    </PixelFrame>
  );
};

export default ProfileHeader;
