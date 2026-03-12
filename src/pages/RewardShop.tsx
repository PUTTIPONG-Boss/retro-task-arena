import { mockRewards } from "@/data/mockData";
import { useQuestContext } from "@/context/QuestContext";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { toast } from "sonner";
import { motion } from "framer-motion";

const RewardShop = () => {
  const { user } = useQuestContext();

  const handleBuy = (name: string, cost: number) => {
    if (user.points >= cost) {
      toast.success(`You acquired: ${name}!`, {
        style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
      });
    } else {
      toast.error("Not enough gold! Complete more quests.", {
        style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[180px] overflow-hidden pixel-border bg-secondary">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-pixel text-[18px] text-accent pixel-text-shadow">🏪 Reward Shop</h1>
          <p className="font-pixel text-[10px] text-foreground pixel-text-shadow mt-2">
            Trade your gold for legendary items
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <PixelFrame className="mb-8 flex items-center justify-between">
          <span className="font-pixel text-[10px] text-foreground pixel-text-shadow">Your Balance</span>
          <span className="font-pixel text-[14px] text-accent pixel-text-shadow">🪙 {user.points.toLocaleString()} GP</span>
        </PixelFrame>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mockRewards.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <PixelFrame className="h-full flex flex-col">
                <div className="text-center mb-3">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h3 className="font-pixel text-[9px] text-foreground pixel-text-shadow text-center mb-2">
                  {item.name}
                </h3>
                <p className="text-lg text-muted-foreground text-center flex-1 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[9px] text-accent pixel-text-shadow">🪙 {item.cost}</span>
                  <span className="text-base text-muted-foreground">Stock: {item.stock}</span>
                </div>
                <PixelButton
                  variant={user.points >= item.cost ? "gold" : "ghost"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleBuy(item.name, item.cost)}
                >
                  {user.points >= item.cost ? "Buy" : "Need More GP"}
                </PixelButton>
              </PixelFrame>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardShop;
