import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { UserProfile } from "../types";

interface ProfileHeaderProps {
  user: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  return (
    <PixelFrame className="mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 pixel-border bg-secondary flex items-center justify-center">
          <div className="text-white font-bold pixel-text-shadow font-pixel flex items-center justify-center">
            {user.username ? (
              <span className={i18n.language === "th" ? "text-[36px]" : "text-[28px]"}>
                {user.username[0].toUpperCase()}
              </span>
            ) : (
              "?"
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1
              className={`text-[22px] text-white font-bold pixel-text-shadow font-pixel ${fontClass}`}
            >
              {user.username}
            </h1>
            <Link 
              to="/profile/edit" 
              className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center"
              title={t("userProfile.editProfile")}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                className="w-7 h-7"
              >
                <path d="M19 21H5v-2h14v2ZM5 19H3V5h2v14Zm16 0h-2v-6h2v6Zm-11-7h2v2h2v2H8v-6h2v2Zm6 2h-2v-2h2v2Zm2-2h-2v-2h2v2Zm-6-2h-2V8h2v2Zm8 0h-2V8h2v2Zm-6-2h-2V6h2v2Zm8 0h-2V6h2v2Zm-6-2h-2V4h2v2Zm4 0h-2V4h2v2Zm-9-1H5V3h6v2Zm7-1h-2V2h2v2Z"/>
              </svg>
            </Link>
          </div>
          <p
            className={`font-text pixel-text-shadow mt-1 font-pixel ${fontClass}`}
          >
            {user.role}
          </p>
          <p className={`text-muted-foreground mt-1 font-pixel ${fontClass}`}>
            {t("userProfile.joined")} {new Date(user.joinedDate).toLocaleDateString()}
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
