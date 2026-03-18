import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import RewardBanner from "../components/RewardBanner";
import { useGetProducts } from "../services/product.service";

const priceFilters = [
  { id: "all", label: "ALL ITEMS" },
  { id: "0-500", label: "0-500 GP", min: 0, max: 500 },
  { id: "501-1000", label: "501-1000 GP", min: 501, max: 1000 },
  { id: "1001-2000", label: "1001-2000 GP", min: 1001, max: 2000 },
  { id: "2001-5000", label: "2001-5000 GP", min: 2001, max: 5000 },
  { id: "5001+", label: "5001+ GP", min: 5001, max: Infinity },
];

// Map product.code to a pixel icon for visual variety
const getProductIcon = (code: string): string => {
  const icons = ["🧪", "📜", "💎", "⚡", "🏅", "🎫", "👾", "🧥", "🔮", "⚔️"];
  const index = code.charCodeAt(0) % icons.length;
  return icons[index];
};

const RewardShop = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { data: products = [], isLoading, isError } = useGetProducts();

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

  const filteredProducts = products.filter((item) => {
    if (activeFilter === "all") return true;
    const selectedRange = priceFilters.find((f) => f.id === activeFilter);
    if (
      selectedRange &&
      selectedRange.min !== undefined &&
      selectedRange.max !== undefined
    ) {
      return item.price >= selectedRange.min && item.price <= selectedRange.max;
    }
    return true;
  });

  return (
    <div className="min-h-screen">
      <RewardBanner />

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* User Balance + Add Product button */}
        <PixelFrame className="mb-6 flex items-center justify-between">
          <span className="font-pixel text-[10px] text-foreground pixel-text-shadow">
            Your Balance
          </span>
          <div className="flex items-center gap-4">
            <span className="font-pixel text-[14px] text-accent pixel-text-shadow">
              🪙 {user.points.toLocaleString()} GP
            </span>
            {(user.role === 'employer' || user.role.toLowerCase().includes('senior')) && (
              <PixelButton
                variant="gold"
                size="sm"
                onClick={() => navigate("/add-product")}
              >
                + Add Product
              </PixelButton>
            )}
          </div>
        </PixelFrame>

        {/* Price Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
          {priceFilters.map((filter) => (
            <PixelButton
              key={filter.id}
              variant={activeFilter === filter.id ? "gold" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </PixelButton>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="pixel-border bg-secondary/30 h-56 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-20 pixel-border bg-secondary/50">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="font-pixel text-[10px] text-destructive pixel-text-shadow mb-4">
              Failed to load items from the shop.
            </p>
            <p className="font-pixel text-[8px] text-muted-foreground">
              Make sure the backend is running and try again.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !isError && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredProducts.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <PixelFrame className="h-full flex flex-col">
                      {/* Icon derived from product code */}
                      <div className="text-center mb-3">
                        <span className="text-4xl">{getProductIcon(item.code)}</span>
                      </div>

                      {/* Code badge */}
                      <p className="font-pixel text-[7px] text-muted-foreground text-center mb-1 tracking-widest uppercase">
                        [{item.code}]
                      </p>

                      {/* Name */}
                      <h3 className="font-pixel text-[9px] text-foreground pixel-text-shadow text-center mb-2">
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className="text-lg text-muted-foreground text-center flex-1 mb-3">
                        {item.description}
                      </p>

                      {/* Price + Stock */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-pixel text-[9px] text-accent pixel-text-shadow">
                          🪙 {item.price.toLocaleString()} GP
                        </span>
                        <span className="text-base text-muted-foreground">
                          Stock: {item.stock}
                        </span>
                      </div>

                      {/* Buy Button */}
                      <PixelButton
                        variant={user.points >= item.price ? "primary" : "ghost"}
                        size="sm"
                        className="w-full"
                        onClick={() => handleBuy(item.name, item.price)}
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0
                          ? "Out of Stock"
                          : user.points >= item.price
                            ? "Buy"
                            : "Need More GP"}
                      </PixelButton>
                    </PixelFrame>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 pixel-border bg-secondary/50">
                <span className="text-4xl mb-4 block">🕸️</span>
                <p className="font-pixel text-[12px] text-muted-foreground pixel-text-shadow">
                  {products.length === 0
                    ? "The shop is empty. Check back later!"
                    : "No items found in this price range..."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RewardShop;
