import { useGetQuests } from "@/features/quests/services/quest.service";
import { useUserStore } from "@/features/users/store/userStore";
import PixelButton from "@/components/PixelButton";
import PixelFrame from "@/components/PixelFrame";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { Link } from "react-router-dom";
// ⭐️ 1. นำเข้า useTranslation
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getTransactions, Transaction } from "@/features/finance/services/finance.service";
import { getMyBids, MyBid } from "@/features/finance/services/application.service";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const { data: quests = [] } = useGetQuests();
  const [activeTab, setActiveTab] = useState<"quests" | "financials" | "activity">("quests");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bids, setBids] = useState<MyBid[]>([]);

  useEffect(() => {
    if (activeTab === "financials") {
      getTransactions().then(setTransactions).catch(console.error);
    } else if (activeTab === "activity") {
      getMyBids().then(setBids).catch(console.error);
    }
  }, [activeTab]);

  // ⭐️ 2. เรียกใช้ useTranslation
  const { t, i18n } = useTranslation();

  // ⭐️ 3. กำหนด fontClass
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  if (!user) return null;

  const completedQuests = quests.filter((q) => q.status === "completed");
  const activeQuests = quests.filter(
    (q) => q.assignedTo === user.id && q.status !== "completed",
  );

  const postedQuests = quests.filter((q) => q.providerId === user.id);

  const isSeniorOrEmployer = (role: string) => {
    const r = role.toLowerCase();
    return r.includes('senior') || r === 'employer';
  };

  return (
    // ⭐️ 4. เพิ่ม ${fontClass} ไปที่ div หลัก
    <div className={`max-w-[900px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      
      {/* Tab Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {["quests", "financials", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              // ✅ แก้ไขสไตล์ปุ่ม Tab ให้เป็นแบบปุ่มประกาศภารกิจสีทอง
              className={`pixel-border px-4 py-2 transition-all font-pixel !text-[14px] bg-[#eab308] text-black hover:bg-[#facc15] shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.3)] ${fontClass} ${
                activeTab === tab
                  ? "opacity-100"
                  : "opacity-60" // ทำให้ปุ่มที่ไม่ได้เลือกสีดรอปลงเล็กน้อย
              }`}
            >
              {t(`userProfile.btn.${tab}`).toUpperCase()}
            </button>
          ))}
        </div>
        <Link to="/profile/edit">
          {/* ✅ แก้ไขสไตล์ปุ่ม Edit Profile ให้เป็นปุ่มทองเช่นกัน */}
          <button className={`pixel-border bg-[#eab308] hover:bg-[#facc15] text-black shadow-[inset_-2px_-2px_0_0_rgba(0,0,0,0.3)] px-4 py-2 transition-colors font-pixel ${fontClass}`}>
            {t("userProfile.editProfile")}
          </button>
        </Link>
      </div>

      {/* --- TAB: QUESTS (PROFILE) --- */}
      {activeTab === "quests" && (
        <>
          <PixelFrame className="mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 pixel-border bg-secondary flex items-center justify-center">
                {/* ✅ แก้ไขตัวอักษรแรกใน Avatar ให้เป็นสีขาว (text-white) */}
                <span className={`text-white font-bold pixel-text-shadow font-pixel ${i18n.language === "th" ? "text-[36px]" : "text-[28px]"} ${fontClass}`}>
                  {user.username[0]}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className={`text-[22px] text-white font-bold pixel-text-shadow font-pixel ${fontClass}`}>
                  {user.username}
                </h1>
                {/* ✅ แก้ไขฉายาให้เป็นสีขาว (text-white) */}
                <p className={`text-white pixel-text-shadow mt-1 font-pixel ${fontClass}`}>
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
                <p className={`text-[22px] text-white pixel-text-shadow font-pixel ${fontClass}`}>
                  {user.level}
                </p>
              </div>
            </div>
          </PixelFrame>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: t("userProfile.stats.gold"),
                value: `🪙 ${user.points.toLocaleString()}`,
                color: "text-white", // ✅ เปลี่ยนสีเหรียญทองเป็นสีขาว
              },
              {
                label: t("userProfile.stats.questsDone"),
                value: `🏆 ${user.questsCompleted}`,
                color: "text-foreground",
              },
              {
                label: t("userProfile.stats.rating"),
                value: `★ ${user.rating} / 5`,
                color: "text-white", // ✅ เปลี่ยนสีเรตติ้งเป็นสีขาว
              },
              {
                label: t("userProfile.stats.reviews"),
                value: `📊 ${user.totalRatings}`,
                color: "text-foreground",
              },
            ].map((stat) => (
              <PixelFrame key={stat.label} className="text-center">
                <p className={`text-muted-foreground mb-1 font-pixel ${fontClass}`}>
                  {stat.label}
                </p>
                <p className={`pixel-text-shadow ${stat.color} font-pixel ${fontClass}`}>
                  {stat.value}
                </p>
              </PixelFrame>
            ))}
          </div>

          <PixelFrame className="mb-6">
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
            <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
              🔗 {t("userProfile.links")}
            </h2>
            {/* ✅ เปลี่ยนสีลิงก์ Github ให้เป็นสีขาว (text-white) */}
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-white hover:text-gray-300 font-pixel ${fontClass} transition-colors`}
            >
              {user.githubUrl}
            </a>
          </PixelFrame>

          {/* --- Section: Active Quests --- */}
          <PixelFrame className="mb-6">
            <h2 className={`text-foreground pixel-text-shadow mb-3 font-pixel ${fontClass}`}>
              📋 {t("userProfile.activeQuests")}
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
                        <p className={`text-muted-foreground mt-1 font-pixel ${fontClass}`}>
                          {q.category} · ⏳ {q.estimatedTime}
                        </p>
                      </div>
                      <div className="text-right">
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

          {/* --- Section: Posted Quests --- */}
          {isSeniorOrEmployer(user.role) && (
            <PixelFrame className="mb-6">
              <h2 className={`font-pixel text-foreground pixel-text-shadow mb-3 ${fontClass}`}>
                📜 {t("userProfile.postQuests")}
              </h2>
              {postedQuests.length === 0 ? (
                <p className={`text-lg text-muted-foreground font-pixel ${fontClass}`}> {t("userProfile.noPostedQuests")}</p>
              ) : (
                <div className="space-y-3">
                  {postedQuests.map((q) => (
                    <div key={q.id} className="pixel-border bg-secondary p-3 flex justify-between items-center hover:bg-muted group">
                      <Link to={`/quest/${q.id}`} className="flex-1">
                        <div>
                          <p className={`font-pixel text-[9px] text-foreground group-hover:text-accent transition-colors ${fontClass}`}>{q.title}</p>
                          <p className={`text-base text-muted-foreground mt-1 font-pixel ${fontClass}`}>
                            {q.status.toUpperCase()} · ⏳ {q.estimatedTime}
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
      )}

      {/* --- TAB: FINANCIALS --- */}
      {activeTab === "financials" && (
        <PixelFrame>
          <h2 className={`font-pixel text-foreground pixel-text-shadow mb-4 ${fontClass}`}>💰 {t("userProfile.financials.title")}</h2>
          <div className="space-y-4">
            <div className="pixel-border bg-secondary p-4 flex justify-between items-center">
              <div>
                <p className={`font-pixel text-muted-foreground ${fontClass}`}>{t("userProfile.financials.currentBalance")}</p>
                <p className={`font-pixel text-white mt-1 ${fontClass}`}>🪙 {user.points.toLocaleString()} GP</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className={`font-pixel text-muted-foreground mb-2 ${fontClass}`}>{t("userProfile.financials.recentTransactions")}</h3>
              {transactions.length === 0 ? (
                <p className={`text-sm text-muted text-center py-4 ${fontClass}`}>{t("userProfile.financials.noTransactions")}</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="pixel-border bg-muted p-3 flex justify-between items-center">
                    <div>
                      <p className={`font-pixel text-[8px] text-foreground ${fontClass}`}>{tx.transactionType}</p>
                      <p className={`text-[10px] text-muted-foreground font-pixel ${fontClass}`}>{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className={`font-pixel text-[9px] ${tx.amount > 0 ? "text-success" : "text-destructive"} ${fontClass}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount} GP
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </PixelFrame>
      )}

      {/* --- TAB: ACTIVITY --- */}
      {activeTab === "activity" && (
        <PixelFrame>
          <h2 className={`font-pixel text-[10px] text-foreground pixel-text-shadow mb-4 ${fontClass}`}>🛡 {t("userProfile.activity.title")}</h2>
          <div className="space-y-3">
            {bids.length === 0 ? (
              <p className={`text-sm text-muted text-center py-4 ${fontClass}`}>{t("userProfile.activity.noApplications")}</p>
            ) : (
              bids.map((app) => (
                <div key={app.id} className="pixel-border bg-secondary p-3 flex justify-between items-center">
                  <div>
                    <Link to={`/quest/${app.taskId}`} className={`font-pixel text-[9px] text-foreground hover:text-accent ${fontClass}`}>
                      {app.taskTitle || t("userProfile.activity.unknownQuest")}
                    </Link>
                    <div className="flex gap-3 items-center mt-1">
                      <p className={`text-[10px] text-muted-foreground ${fontClass}`}>
                        {t("userProfile.activity.bid")}: <span className="text-accent">🪙 {app.bidAmount} GP</span>
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
                    <span className={`pixel-border px-2 py-1 font-pixel text-[7px] ${app.status === "PENDING" ? "bg-muted text-muted-foreground" :
                      app.status === "ACCEPTED" ? "bg-success text-success-foreground" :
                        "bg-destructive text-destructive-foreground"
                      } ${fontClass}`}>
                      {t(`userProfile.activity.status.${app.status?.toLowerCase() || "pending"}`)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </PixelFrame>
      )}
    </div>
  );
};

export default UserProfile;