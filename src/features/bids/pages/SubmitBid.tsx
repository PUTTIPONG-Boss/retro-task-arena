import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuestStore } from "@/features/quests/store/questStore";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useState } from "react";
import { toast } from "sonner";
import { Coins } from "lucide-react";

const SubmitBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quests = useQuestStore((state) => state.quests);
  const addBid = useQuestStore((state) => state.addBid);
  const user = useUserStore((state) => state.user);
  const quest = quests.find((q) => q.id === id);

  const [points, setPoints] = useState("");
  const [time, setTime] = useState("");
  const [explanation, setExplanation] = useState("");
  const [github, setGithub] = useState("");

  if (!quest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to bid.");
      return;
    }
    addBid(quest.id, {
      id: `b-${Date.now()}`,
      taskId: quest.id,
      userId: user.id,
      username: user.username,
      githubUrl: github || user.githubUrl,
      questsCompleted: user.questsCompleted,
      rating: user.rating,
      requestedPoints: parseInt(points) || quest.rewardPoints,
      estimatedTime: `${time} Cycles`,
      explanation,
      avatarSeed: Math.floor(Math.random() * 100),
    });
    toast.success("Bid submitted! May fortune favor your quest.", {
      style: { fontFamily: '"TA_8bit"', fontSize: "10px" },
    });
    navigate(`/quest/${quest.id}`);
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className="mb-6">← Back to Quest</PixelButton>
      </Link>

      <PixelFrame>
        <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow mb-2">
          Submit Your Bid
        </h1>
        <p className="text-xl text-muted-foreground mb-1">
          Quest: {quest.title}
        </p>
        <p className="font-pixel text-[9px] text-accent pixel-text-shadow mb-6">
          Base Reward: <Coins size={14} className="inline mr-1 text-yellow-400" /> {quest.rewardPoints} GP
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Requested Reward (GP)</label>
            <PixelInput type="number" placeholder={String(quest.rewardPoints)} value={points} onChange={(e) => setPoints(e.target.value)} required />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Estimated Completion Time</label>
            <PixelInput placeholder="e.g. 5 Cycles (hours)" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">GitHub / Portfolio Link</label>
            <PixelInput placeholder="https://github.com/your-username" value={github} onChange={(e) => setGithub(e.target.value)} required />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">Your Approach</label>
            <PixelTextarea rows={5} placeholder="Explain how you would tackle this quest..." value={explanation} onChange={(e) => setExplanation(e.target.value)} required />
          </div>

          <PixelButton type="submit" variant="gold" size="lg" className="w-full">
            ⚔ Submit Bid
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default SubmitBid;
