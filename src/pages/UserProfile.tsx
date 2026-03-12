import { mockUser, mockQuests } from "@/data/mockData";
import PixelFrame from "@/components/PixelFrame";
import DifficultyStars from "@/components/DifficultyStars";

const UserProfile = () => {
  const completedQuests = mockQuests.filter((q) => q.status === "completed");
  const activeQuests = mockQuests.filter((q) => q.assignedTo === mockUser.id);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      {/* Profile Header */}
      <PixelFrame className="mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 pixel-border bg-secondary flex items-center justify-center">
            <span className="font-pixel text-[28px] text-accent pixel-text-shadow">
              {mockUser.username[0]}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-pixel text-[14px] text-foreground pixel-text-shadow">
              {mockUser.username}
            </h1>
            <p className="font-pixel text-[9px] text-accent pixel-text-shadow mt-1">{mockUser.title}</p>
            <p className="text-lg text-muted-foreground mt-1">Joined {mockUser.joinedDate}</p>
          </div>

          <div className="pixel-border bg-secondary px-6 py-3 text-center">
            <p className="font-pixel text-[8px] text-muted-foreground mb-1">LEVEL</p>
            <p className="font-pixel text-[22px] text-accent pixel-text-shadow">{mockUser.level}</p>
          </div>
        </div>
      </PixelFrame>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Gold", value: `🪙 ${mockUser.points.toLocaleString()}`, color: "text-accent" },
          { label: "Quests Done", value: `🏆 ${mockUser.questsCompleted}`, color: "text-foreground" },
          { label: "Rating", value: `★ ${mockUser.rating}`, color: "text-accent" },
          { label: "Skills", value: `📚 ${mockUser.skills.length}`, color: "text-foreground" },
        ].map((stat) => (
          <PixelFrame key={stat.label} className="text-center">
            <p className="font-pixel text-[7px] text-muted-foreground mb-1">{stat.label}</p>
            <p className={`font-pixel text-[11px] pixel-text-shadow ${stat.color}`}>{stat.value}</p>
          </PixelFrame>
        ))}
      </div>

      {/* Skills */}
      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">⚔ Skills</h2>
        <div className="flex flex-wrap gap-2">
          {mockUser.skills.map((skill) => (
            <span key={skill} className="pixel-border bg-secondary px-3 py-1 font-pixel text-[8px] text-foreground">
              {skill}
            </span>
          ))}
        </div>
      </PixelFrame>

      {/* GitHub */}
      <PixelFrame className="mb-6">
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">🔗 Links</h2>
        <a href={mockUser.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xl text-primary hover:text-accent">
          {mockUser.githubUrl}
        </a>
      </PixelFrame>

      {/* Active Quests */}
      <PixelFrame>
        <h2 className="font-pixel text-[10px] text-foreground pixel-text-shadow mb-3">📋 Active Quests</h2>
        {activeQuests.length === 0 ? (
          <p className="text-lg text-muted-foreground">No active quests. Visit the board to find your next adventure!</p>
        ) : (
          <div className="space-y-3">
            {activeQuests.map((q) => (
              <div key={q.id} className="pixel-border bg-secondary p-3 flex justify-between items-center">
                <div>
                  <p className="font-pixel text-[9px] text-foreground">{q.title}</p>
                  <p className="text-base text-muted-foreground mt-1">{q.category} · ⏳ {q.estimatedTime}</p>
                </div>
                <div className="text-right">
                  <p className="font-pixel text-[9px] text-accent pixel-text-shadow">🪙 {q.rewardPoints} GP</p>
                  <DifficultyStars level={q.difficulty} />
                </div>
              </div>
            ))}
          </div>
        )}
      </PixelFrame>
    </div>
  );
};

export default UserProfile;
