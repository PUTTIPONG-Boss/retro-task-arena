import { useQuestStore } from "@/features/quests/store/questStore";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { Link } from "react-router-dom";
// ⭐️ 1. นำเข้า useTranslation
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const quests = useQuestStore((state) => state.quests);

  // ⭐️ 2. เรียกใช้ useTranslation
  const { t, i18n } = useTranslation();

  // ⭐️ 3. กำหนด fontClass แบบที่คุณให้จำไว้
  const fontClass = i18n.language === "th" ? "text-[16px] font-['TA-ChaiLai']" : "text-[16px] font-pixel";

  if (!user) return null;

  const completedQuests = quests.filter((q) => q.status === "completed");
  const activeQuests = quests.filter(
    (q) => q.assignedTo === user.id && q.status !== "completed",
  );

  return (
    // ⭐️ 4. เพิ่ม ${fontClass} ไปที่ div หลักเพื่อให้ฟอนต์ครอบคลุม
    <div className={`max-w-[900px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA-ChaiLai']" : ""}`}>
      <div className="flex justify-end mb-4">
        <Link to="/profile/edit">
          {/* ⭐️ 5. เพิ่ม fontClass ให้ปุ่ม Edit Profile */}
          <button className={`pixel-border bg-secondary hover:bg-muted px-4 py-2 text-accent transition-colors font-pixel ${fontClass}`}>
            {/* ⭐️ 6. ดึงคำแปล */}
            {t("userProfile.editProfile")}
          </button>
        </Link>
      </div>

      <PixelFrame className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 pixel-border bg-secondary flex items-center justify-center">
             {/* ⭐️ 7. เพิ่ม fontClass ให้ตัวอักษรแรกของชื่อ */}
            <span className={`text-accent pixel-text-shadow font-pixel ${i18n.language === "th" ? "text-[36px]" : "text-[28px]"} ${fontClass}`}>
              {user.username[0]}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
             {/* ⭐️ 8. เพิ่ม fontClass ให้ชื่อ */}
            <h1 className={`text-foreground pixel-text-shadow font-pixel ${fontClass}`}>
              {user.username}
            </h1>
            {/* ⭐️ 9. เพิ่ม fontClass ให้ฉายา */}
            <p className={`text-accent pixel-text-shadow mt-1 font-pixel ${fontClass}`}>
              {user.title}
            </p>
            {/* ⭐️ 10. ดึงคำแปล Joined */}
            <p className={`text-muted-foreground mt-1 ${fontClass}`}>
              {t("userProfile.joined")} {user.joinedDate}
            </p>
          </div>

          <div className="pixel-border bg-secondary px-6 py-3 text-center">
            {/* ⭐️ 11. ดึงคำแปล LEVEL และเพิ่ม fontClass */}
            <p className={`text-muted-foreground mb-1 font-pixel ${fontClass}`}>
              {t("userProfile.level")}
            </p>
            <p className={`text-[22px] text-accent pixel-text-shadow font-pixel ${fontClass}`}>
              {user.level}
            </p>
          </div>
        </div>
      </PixelFrame>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            // ⭐️ 12. ดึงคำแปล Stats ย่อย
            label: t("userProfile.stats.gold"),
            value: `🪙 ${user.points.toLocaleString()}`,
            color: "text-accent",
          },
          {
            label: t("userProfile.stats.questsDone"),
            value: `🏆 ${user.questsCompleted}`,
            color: "text-foreground",
          },
          {
            label: t("userProfile.stats.rating"),
            value: `★ ${user.rating} / 5`,
            color: "text-accent",
          },
          {
            label: t("userProfile.stats.reviews"),
            value: `📊 ${user.totalRatings}`,
            color: "text-foreground",
          },
        ].map((stat) => (
          <PixelFrame key={stat.label} className="text-center">
            {/* ⭐️ 13. เพิ่ม fontClass */}
            <p className={`text-muted-foreground mb-1 font-pixel ${fontClass}`}>
              {stat.label}
            </p>
            <p
              className={`pixel-text-shadow ${stat.color} font-pixel ${fontClass}`}
            >
              {stat.value}
            </p>
          </PixelFrame>
        ))}
      </div>

      <PixelFrame className="mb-6">
        {/* ⭐️ 14. ดึงคำแปล Skills และเพิ่ม fontClass */}
        <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
          ⚔ {t("userProfile.skills")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className={`pixel-border bg-secondary px-3 py-1 text-foreground font-pixel ${fontClass}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
         {/* ⭐️ 16. ดึงคำแปล Links และเพิ่ม fontClass */}
        <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
          🔗 {t("userProfile.links")}
        </h2>
        <a
          href={user.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-accent hover:text-foreground ${fontClass}`}
        >
          {user.githubUrl}
        </a>
      </PixelFrame>

      <PixelFrame className="mb-6">
        {/* ⭐️ 18. ดึงคำแปล Active Quests และเพิ่ม fontClass */}
        <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
          📋 {t("userProfile.activeQuests")}
        </h2>
        {activeQuests.length === 0 ? (
          // ⭐️ 19. ดึงคำแปลเมื่อไม่มีเควสต์ และเพิ่ม fontClass
          <p className={`text-muted-foreground ${fontClass}`}>
            {t("userProfile.noActiveQuests")}
          </p>
        ) : (
          <div className="space-y-3">
            {activeQuests.map((q) => (
              <Link key={q.id} to={`/quest/${q.id}/workspace`}>
                <div className="pixel-border bg-secondary p-3 flex justify-between items-center hover:bg-muted cursor-pointer">
                  <div>
                    {/* ⭐️ 20. เพิ่ม fontClass */}
                    <p className={`text-foreground font-pixel ${fontClass}`}>
                      {q.title}
                    </p>
                    <p className={`text-muted-foreground mt-1 ${fontClass}`}>
                      {q.category} · ⏳ {q.estimatedTime}
                    </p>
                  </div>
                  <div className="text-right">
                    {/* ⭐️ 21. เพิ่ม fontClass */}
                    <p className={`text-accent pixel-text-shadow font-pixel ${fontClass}`}>
                      🪙 {q.rewardPoints} GP
                    </p>
                    <DifficultyStars level={q.difficulty} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PixelFrame>

      {completedQuests.length > 0 && (
        <PixelFrame>
          {/* ⭐️ 22. ดึงคำแปล Completed Quests และเพิ่ม fontClass */}
          <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
            🏆 {t("userProfile.completedQuests")}
          </h2>
          <div className="space-y-3">
            {completedQuests.map((q) => (
              <div
                key={q.id}
                className="pixel-border bg-secondary p-3 flex justify-between items-center opacity-70"
              >
                <div>
                   {/* ⭐️ 23. เพิ่ม fontClass */}
                  <p className={`text-foreground font-pixel ${fontClass}`}>
                    {q.title}
                  </p>
                  <p className={`text-muted-foreground mt-1 ${fontClass}`}>
                    {q.category}
                  </p>
                </div>
                {/* ⭐️ 24. ดึงคำแปล DONE และเพิ่ม fontClass */}
                <span className={`text-success pixel-text-shadow font-pixel ${fontClass}`}>
                  ✓ {t("userProfile.done")}
                </span>
              </div>
            ))}
          </div>
        </PixelFrame>
      )}
    </div>
  );
};

export default UserProfile;