import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import RewardBanner from "../components/RewardBanner";
import { useTranslation } from "react-i18next";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelStore from "@/components/icons/PixelStore";
import { mockRewards } from "@/data/mockData";

const RewardShop = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const products = mockRewards;
  const isLoading = false;
  const isError = false;
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const priceFilters = [
    { id: "all", labelKey: "all", min: 0, max: Infinity },
    { id: "0-500", labelKey: "range1", min: 0, max: 500 },
    { id: "501-1000", labelKey: "range2", min: 501, max: 1000 },
    { id: "1001-2000", labelKey: "range3", min: 1001, max: 2000 },
    { id: "2001-5000", labelKey: "range4", min: 2001, max: 5000 },
    { id: "5001+", labelKey: "range5", min: 5001, max: Infinity },
  ];

  if (!user) return null;

  const handleBuy = (name: string, cost: number) => {
    if (user.points >= cost) {
      toast.success(t("rewardShop.toastSuccess", { name }), {
        style: {
          fontFamily:
            i18n.language === "th" ? "text-[16px]" : "text-[16px]",
          fontSize: "10px",
        },
      });
    } else {
      toast.error(t("rewardShop.toastError"), {
        style: {
          fontFamily:
            i18n.language === "th" ? "text-[16px]" : "text-[16px]",
          fontSize: "10px",
        },
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
      return item.cost >= selectedRange.min && item.cost <= selectedRange.max;
    }
    return true;
  });

  return (
    <div className={`min-h-screen ${fontClass}`}>
      <RewardBanner />

      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <PixelFrame className="mb-6 flex items-center justify-between">
          <span className={`text-foreground pixel-text-shadow ${fontClass}`}>
            {t("rewardShop.balance")}
          </span>
          <div className="flex items-center gap-4">
            <span
              className={`text-accent pixel-text-shadow flex items-center gap-1.5 ${fontClass}`}
            >
              <PixelCoin size={16} className="inline mr-1 text-yellow-400" /> {user.points.toLocaleString()}

              <span className={fontClass}>{t("rewardShop.currency")}</span>
            </span>
            {(user.role === "employer" ||
              user.role.toLowerCase().includes("senior")) && (
                <PixelButton
                  variant="gold"
                  size="sm"
                  className={fontClass}
                  onClick={() => navigate("/add-product")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <PixelStore size={18} />
                    <span className="leading-none">
                      {t("rewardShop.addProduct")}
                    </span>
                  </div>
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
              className={fontClass}
              onClick={() => setActiveFilter(filter.id)}
            >
              {t(`rewardShop.filters.${filter.labelKey}`)}
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
            <p
              className={`text-destructive pixel-text-shadow mb-4 ${fontClass}`}
            >
              {t("rewardShop.loaditem")}
            </p>
            <p className={`text-muted-foreground ${fontClass}`}>
              {t("rewardShop.running")}
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
                      {/* Icon */}
                      <div className="text-center mb-3">
                        <span className="text-4xl">
                          {item.icon}
                        </span>
                      </div>

                      {/* ID badge */}
                      <p className="text-[12px] text-muted-foreground text-center mb-1 tracking-widest uppercase font-pixel">
                        [{item.id}]
                      </p>

                      {/* Name */}
                      <h3
                        className={`text-foreground pixel-text-shadow text-center mb-2 ${fontClass}`}
                      >
                        {item.name}
                      </h3>

                      {/* Description */}
                      <p className={`text-muted-foreground text-center flex-1 mb-3 ${fontClass}`}>
                        {item.description}
                      </p>

                      {/* Price + Stock */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-accent pixel-text-shadow ${fontClass}`}
                        >
                          <PixelCoin size={16} className="inline mr-1 text-yellow-400" /> {item.cost.toLocaleString()}{" "}
                        </span>
                        <span className={`text-muted-foreground ${fontClass}`}>
                          {t("rewardShop.stock")}: {item.stock}
                        </span>
                      </div>

                      {/* Buy Button */}
                      <PixelButton
                        variant={
                          user.points >= item.cost ? "primary" : "ghost"
                        }
                        size="sm"
                        className={`w-full ${fontClass}`}
                        onClick={() => handleBuy(item.name, item.cost)}
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0
                          ? "Out of Stock"
                          : user.points >= item.cost
                            ? t("rewardShop.buy")
                            : t("rewardShop.needMore")}
                      </PixelButton>
                    </PixelFrame>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 pixel-border bg-secondary/50">
                <span className="text-4xl mb-4 block">🕸️</span>
                <p
                  className={`text-muted-foreground pixel-text-shadow ${fontClass}`}
                >
                  {products.length === 0
                    ? "The shop is empty. Check back later!"
                    : t("rewardShop.empty")}
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
