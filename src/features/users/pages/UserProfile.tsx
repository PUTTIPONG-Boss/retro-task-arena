import { useQuestStore } from "@/features/quests/store/questStore";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import DifficultyStars from "@/features/quests/components/DifficultyStars";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const user = useUserStore((state) => state.user);
  const quests = useQuestStore((state) => state.quests);

  if (!user) return null;

  const completedQuests = quests.filter((q) => q.status === "completed");
  const activeQuests = quests.filter(
    (q) => q.assignedTo === user.id && q.status !== "completed",
  );

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <Link to="/profile/edit">
          <button className="pixel-border bg-secondary hover:bg-muted px-4 py-2 font-pixel text-[8px] text-accent transition-colors">
            [ EDIT PROFILE ]
          </button>
        </Link>
      </div>
      <PixelFrame className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 pixel-border bg-secondary flex items-center justify-center">
            <span className="font-pixel text-[28px] text-accent pixel-text-shadow">
              {user.username[0]}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-pixel text-[14px] text-foreground pixel-text-shadow">
              {user.username}
            </h1>
            <p className="font-pixel text-[9px] text-accent pixel-text-shadow mt-1">
              {user.title}
            </p>
            <p className="text-lg text-muted-foreground mt-1">
              Joined {user.joinedDate}
            </p>
          </div>

          <div className="pixel-border bg-secondary px-6 py-3 text-center">
            <p className="font-pixel text-[8px] text-muted-foreground mb-1">
              LEVEL
            </p>
            <p className="font-pixel text-[22px] text-accent pixel-text-shadow">
              {user.level}
            </p>
          </div>
        </div>
      </PixelFrame>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Gold",
            value: `🪙 ${user.points.toLocaleString()}`,
            color: "text-accent",
          },
          {
            label: "Quests Done",
            value: `🏆 ${user.questsCompleted}`,
            color: "text-foreground",
          },
          {
            label: "Rating",
            value: `★ ${user.rating} / 5`,
            color: "text-accent",
          },
          {
            label: "Reviews",
            value: `📊 ${user.totalRatings}`,
            color: "text-foreground",
          },
        ].map((stat) => (
          <PixelFrame key={stat.label} className="text-center">
            <p className="font-pixel text-[7px] text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p
              className={`font-pixel text-[11px] pixel-text-shadow ${stat.color}`}
            >
              {stat.value}
            </p>
          </PixelFrame>
        ))}
      </div>

      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
          ⚔ Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <span
              key={skill}
              className="pixel-border bg-secondary px-3 py-1 font-pixel text-[8px] text-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
          🔗 Links
        </h2>
        <a
          href={user.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl text-accent hover:text-foreground"
        >
          {user.githubUrl}
        </a>
      </PixelFrame>

      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
          📋 Active Quests
        </h2>
        {activeQuests.length === 0 ? (
          <p className="text-lg text-muted-foreground">
            No active quests. Visit the board to find your next adventure!
          </p>
        ) : (
          <div className="space-y-3">
            {activeQuests.map((q) => (
              <Link key={q.id} to={`/quest/${q.id}/workspace`}>
                <div className="pixel-border bg-secondary p-3 flex justify-between items-center hover:bg-muted cursor-pointer">
                  <div>
                    <p className="font-pixel text-[9px] text-foreground">
                      {q.title}
                    </p>
                    <p className="text-base text-muted-foreground mt-1">
                      {q.category} · ⏳ {q.estimatedTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-pixel text-[9px] text-accent pixel-text-shadow">
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
          <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">
            🏆 Completed Quests
          </h2>
          <div className="space-y-3">
            {completedQuests.map((q) => (
              <div
                key={q.id}
                className="pixel-border bg-secondary p-3 flex justify-between items-center opacity-70"
              >
                <div>
                  <p className="font-pixel text-[9px] text-foreground">
                    {q.title}
                  </p>
                  <p className="text-base text-muted-foreground mt-1">
                    {q.category}
                  </p>
                </div>
                <span className="font-pixel text-[9px] text-success pixel-text-shadow">
                  ✓ DONE
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
