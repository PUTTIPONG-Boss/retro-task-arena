import React from "react";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelMessage from "@/components/icons/PixelMessage";
import PixelTrophy from "@/components/icons/PixelTrophy";
import { UserProfile } from "../types";

interface ProfileStatsProps {
  user: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  const stats = [
    {
      label: t("userProfile.stats.gold"),
      value: `${user.points.toLocaleString()}`,
      icon: (
        <PixelCoin size={20} className="inline-block mr-1 text-yellow-400" />
      ),
      color: "text-white",
    },
    {
      label: t("userProfile.stats.questsDone"),
      value: `${user.questsCompleted}`,
      icon: (
        <PixelTrophy size={20} className="inline-block mr-1 text-yellow-400" />
      ),
      color: "text-white",
    },
    {
      label: t("userProfile.stats.rating"),
      value: `★ ${user.rating} / 5`,
      icon: <Star size={20} className="inline-block mr-1 text-yellow-400" />,
      color: "text-white",
    },
    {
      label: t("userProfile.stats.reviews"),
      value: `${user.totalRatings}`,
      icon: (
        <PixelMessage size={20} className="inline-block mr-1 text-yellow-400" />
      ),
      color: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <PixelFrame key={stat.label} className="text-center">
          <p className={`text-muted-foreground mb-1 font-pixel ${fontClass}`}>
            {stat.label}
          </p>
          <p
            className={`pixel-text-shadow ${stat.color} font-pixel ${fontClass} flex items-center justify-center gap-1`}
          >
            {stat.icon}
            {stat.value}
          </p>
        </PixelFrame>
      ))}
    </div>
  );
};

export default ProfileStats;
