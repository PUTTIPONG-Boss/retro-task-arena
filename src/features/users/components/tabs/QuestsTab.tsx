import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, Archive, Hourglass } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelTrophy from "@/components/icons/PixelTrophy";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { UserProfile } from "../../types";
import { isSeniorOrEmployer } from "../../utils/roleUtils";

interface QuestsTabProps {
  user: UserProfile;
  quests: any[];
}

const QuestsTab: React.FC<QuestsTabProps> = ({ user, quests }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  const completedQuests = quests.filter((q) => q.status === "completed");
  const activeQuests = quests.filter(
    (q) => q.assignedTo === user.id && q.status !== "completed",
  );
  const postedQuests = quests.filter((q) => q.providerId === user.id);

  return (
    <>
      {/* --- Section: Active Quests --- */}
      <PixelFrame className="mb-6">
        <h2
          className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass} flex items-center gap-2`}
        >
          <Clock size={20} className="text-white" /> {t("userProfile.activeQuests")}
        </h2>
        {activeQuests.length === 0 ? (
          <p className={`text-muted-foreground font-pixel ${fontClass}`}>
            {t("userProfile.noActiveQuests")}
          </p>
        ) : (
          <div className="space-y-3">
            {activeQuests.map((q) => (
              <Link key={q.id} to={`/quest/${q.id}/workspace`}>
                <div className="pixel-border bg-secondary p-3 flex justify-between items-center hover:bg-muted cursor-pointer">
                  <div>
                    <p className={`text-foreground font-pixel ${fontClass}`}>
                      {q.title}
                    </p>
                    <p
                      className={`text-muted-foreground mt-1 font-pixel ${fontClass}`}
                    >
                      {q.category} ·{" "}
                      <Hourglass size={16} className="inline mr-1 text-yellow-400" />{" "}
                      {q.estimatedTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <PixelCoin size={14} className="inline mr-1" /> {q.rewardPoints} GP
                    <DifficultyStars level={q.difficulty} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PixelFrame>

      {/* --- Section: Posted Quests --- */}
      {isSeniorOrEmployer(user.role) && (
        <PixelFrame className="mb-6">
          <h2
            className={`font-pixel text-foreground pixel-text-shadow ${fontClass} flex items-center gap-2`}
          >
            <Archive size={20} className="text-white" /> {t("userProfile.postQuests")}
          </h2>
          {postedQuests.length === 0 ? (
            <p className={`text-lg text-muted-foreground font-pixel ${fontClass}`}>
              {t("userProfile.noPostedQuests")}
            </p>
          ) : (
            <div className="space-y-3">
              {postedQuests.map((q) => (
                <div
                  key={q.id}
                  className="pixel-border bg-secondary p-3 flex justify-between items-center hover:bg-muted group"
                >
                  <Link to={`/quest/${q.id}`} className="flex-1">
                    <div>
                      <p
                        className={`font-pixel text-[9px] text-foreground group-hover:text-accent transition-colors ${fontClass}`}
                      >
                        {q.title}
                      </p>
                      <p
                        className={`text-base text-muted-foreground mt-1 font-pixel ${fontClass}`}
                      >
                        {q.status.toUpperCase()} ·{" "}
                        <Hourglass size={16} className="inline mr-1 text-yellow-400" />{" "}
                        {q.estimatedTime}
                      </p>
                    </div>
                  </Link>
                  <div className={`flex gap-2 font-pixel ${fontClass}`}>
                    <Link to={`/quest/${q.id}/edit`}>
                      <PixelButton variant="gold" size="sm">
                        {t("userProfile.editPostedQuests")}
                      </PixelButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PixelFrame>
      )}

      {/* --- Section: Completed Quests --- */}
      {completedQuests.length > 0 && (
        <PixelFrame>
          <h2
            className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}
          >
            <PixelTrophy size={20} className="inline-block mr-1 text-yellow-400" />{" "}
            {t("userProfile.completedQuests")}
          </h2>
          <div className="space-y-3">
            {completedQuests.map((q) => (
              <div
                key={q.id}
                className="pixel-border bg-secondary p-3 flex justify-between items-center opacity-70"
              >
                <div>
                  <p className={`text-foreground font-pixel ${fontClass}`}>
                    {q.title}
                  </p>
                  <p className={`text-muted-foreground mt-1 font-pixel ${fontClass}`}>
                    {q.category}
                  </p>
                </div>
                <span className={`text-success pixel-text-shadow font-pixel ${fontClass}`}>
                  ✓ {t("userProfile.done")}
                </span>
              </div>
            ))}
          </div>
        </PixelFrame>
      )}
    </>
  );
};

export default QuestsTab;
