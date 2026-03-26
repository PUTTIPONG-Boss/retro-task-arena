import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PixelFrame from "@/components/PixelFrame";
import PixelHeart from "@/components/icons/PixelHeart";
import PixelCoin from "@/components/icons/PixelCoin";
import { MyBid } from "@/features/finance/services/application.service";

interface ActivityTabProps {
  bids: MyBid[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ bids }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  return (
    <PixelFrame>
      <h2 className={`font-pixel text-[10px] text-foreground pixel-text-shadow mb-4 ${fontClass}`}>
        <PixelHeart size={20} className="inline mr-1 text-yellow-400" /> {t("userProfile.activity.title")}
      </h2>
      <div className="space-y-3">
        {bids.length === 0 ? (
          <p className={`text-sm text-muted text-center py-4 ${fontClass}`}>
            {t("userProfile.activity.noApplications")}
          </p>
        ) : (
          bids.map((app) => (
            <div key={app.id} className="pixel-border bg-secondary p-3 flex justify-between items-center">
              <div>
                <Link
                  to={`/quest/${app.taskId}`}
                  className={`font-pixel text-[9px] text-foreground hover:text-accent ${fontClass}`}
                >
                  {app.taskTitle || t("userProfile.activity.unknownQuest")}
                </Link>
                <div className="flex gap-3 items-center mt-1">
                  <p className={`text-[10px] text-muted-foreground ${fontClass}`}>
                    {t("userProfile.activity.bid")}:{" "}
                    <span className="text-accent">
                      <PixelCoin size={12} className="inline mr-0.5" /> {app.bidAmount} GP
                    </span>
                  </p>
                  <span className={`text-[10px] text-muted-foreground ${fontClass}`}>·</span>
                  <p className={`text-[10px] text-muted-foreground ${fontClass}`}>
                    Wait: <span className="text-foreground">{app.waitDuration}</span>
                  </p>
                </div>
                {app.note && (
                  <p className={`text-[9px] text-muted-foreground mt-2 italic border-l-2 border-muted pl-2 ${fontClass}`}>
                    "{app.note}"
                  </p>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`pixel-border px-2 py-1 font-pixel text-[7px] ${
                    app.status === "PENDING"
                      ? "bg-muted text-muted-foreground"
                      : app.status === "ACCEPTED"
                      ? "bg-success text-success-foreground"
                      : "bg-destructive text-destructive-foreground"
                  } ${fontClass}`}
                >
                  {t(`userProfile.activity.status.${app.status?.toLowerCase() || "pending"}`)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </PixelFrame>
  );
};

export default ActivityTab;
