import { useParams, Link, useNavigate } from "react-router-dom";
import { mockQuests } from "@/data/mockData";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useState } from "react";
import { toast } from "sonner";

const SubmitBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quest = mockQuests.find((q) => q.id === id);

  const [points, setPoints] = useState("");
  const [time, setTime] = useState("");
  const [explanation, setExplanation] = useState("");
  const [github, setGithub] = useState("");

  if (!quest) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bid submitted! May fortune favor your quest.", {
      style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
    });
    navigate(`/quest/${quest.id}`);
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <Link to={`/quest/${quest.id}`}>
        <PixelButton variant="ghost" size="sm" className="mb-6">← Back to Quest</PixelButton>
      </Link>

      <PixelFrame variant="parchment">
        <h1 className="font-pixel text-[13px] text-parchment-foreground pixel-text-shadow mb-2">
          Submit Your Bid
        </h1>
        <p className="text-xl text-parchment-foreground/70 mb-1">
          Quest: {quest.title}
        </p>
        <p className="font-pixel text-[9px] text-accent pixel-text-shadow mb-6">
          Base Reward: 🪙 {quest.rewardPoints} GP
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-pixel text-[9px] text-parchment-foreground block mb-2">
              Requested Reward (GP)
            </label>
            <PixelInput
              type="number"
              placeholder={String(quest.rewardPoints)}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-parchment-foreground block mb-2">
              Estimated Completion Time
            </label>
            <PixelInput
              placeholder="e.g. 5 Cycles (hours)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-parchment-foreground block mb-2">
              GitHub / Portfolio Link
            </label>
            <PixelInput
              placeholder="https://github.com/your-username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-pixel text-[9px] text-parchment-foreground block mb-2">
              Your Approach
            </label>
            <PixelTextarea
              rows={5}
              placeholder="Explain how you would tackle this quest..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              required
            />
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
