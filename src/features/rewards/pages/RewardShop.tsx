import { mockRewards } from "@/data/mockData";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";

const priceFilters = [
  { id: "all", label: "ALL ITEMS" },
  { id: "0-50", label: "0-50 GP", min: 0, max: 50 },
  { id: "51-100", label: "51-100 GP", min: 51, max: 100 },
  { id: "101-150", label: "101-150 GP", min: 101, max: 150 },
  { id: "151-200", label: "151-200 GP", min: 151, max: 200 },
  { id: "201+", label: "201+ GP", min: 201, max: Infinity },
];

const RewardShop = () => {
  const user = useUserStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  if (!user) return null;

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

  const filteredRewards = mockRewards.filter((item) => {
    if (activeFilter === "all") return true;
    const selectedRange = priceFilters.find((f) => f.id === activeFilter);
    if (
      selectedRange &&
      selectedRange.min !== undefined &&
      selectedRange.max !== undefined
    ) {
      return item.cost >= selectedRange.min && item.cost <= selectedRange.max;
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      <div className="relative w-full h-[180px] overflow-hidden pixel-border bg-secondary">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-pixel text-[18px] text-accent pixel-text-shadow">
            🏪 Reward Shop
          </h1>
          <p className="font-pixel text-[10px] text-foreground pixel-text-shadow mt-2">
            Trade your gold for legendary items
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <PixelFrame className="mb-6 flex items-center justify-between">
          <span className="font-pixel text-[10px] text-foreground pixel-text-shadow">
            Your Balance
          </span>
          <span className="font-pixel text-[14px] text-accent pixel-text-shadow">
            🪙 {user.points.toLocaleString()} GP
          </span>
        </PixelFrame>

        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
          {priceFilters.map((filter) => (
            <PixelButton
              key={filter.id}
              variant={activeFilter === filter.id ? "gold" : "ghost"} // เปลี่ยนสีปุ่มที่ถูกเลือก
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </PixelButton>
          ))}
        </div>

        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRewards.map((item) => (
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
                    <span className="font-pixel text-[9px] text-accent pixel-text-shadow">
                      🪙 {item.cost}
                    </span>
                    <span className="text-base text-muted-foreground">
                      Stock: {item.stock}
                    </span>
                  </div>
                  <PixelButton
                    variant={user.points >= item.cost ? "primary" : "ghost"}
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
        ) : (
          <div className="text-center py-20 pixel-border bg-secondary/50">
            <span className="text-4xl mb-4 block">🕸️</span>
            <p className="font-pixel text-[12px] text-muted-foreground pixel-text-shadow">
              No items found in this price range...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardShop;
