import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/features/users/store/userStore";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import RewardBanner from "../components/RewardBanner";
import { useGetProducts } from "../services/product.service";
import { useCreateOrder } from "../services/order.service";
import { useTranslation } from "react-i18next";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelStore from "@/components/icons/PixelStore";
import PixelPlus from "@/components/icons/PixelPlus";
import PixelMinus from "@/components/icons/PixelMinus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "../types";

// Map product.id to a pixel icon for visual variety
const getProductIcon = (id: string): string => {
  const icons = ["🧪", "📜", "💎", "⚡", "🏅", "🎫", "👾", "🧥", "🔮", "⚔️"];
  if (!id) return "📦";
  const index = id.charCodeAt(0) % icons.length;
  return icons[index] || "📦";
};

const RewardShop = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [buyTarget, setBuyTarget] = useState<Product | null>(null);
  const [buyQty, setBuyQty] = useState<number>(1);

  const { data: products = [], isLoading, isError } = useGetProducts();
  const { mutate: createOrder, isPending: isRedeeming } = useCreateOrder();
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px]" : "text-[16px]";

  const priceFilters = [
    { id: "all", labelKey: "all", min: 0, max: Infinity },
    { id: "0-50", labelKey: "range1", min: 0, max: 50 },
    { id: "51-100", labelKey: "range2", min: 51, max: 100 },
    { id: "101-150", labelKey: "range3", min: 101, max: 150 },
    { id: "151-200", labelKey: "range4", min: 151, max: 200 },
    { id: "201-250", labelKey: "range5", min: 201, max: 250 },
    { id: "251-300", labelKey: "range6", min: 251, max: 300 },
    { id: "300+", labelKey: "range7", min: 301, max: Infinity },
  ];

  if (!user) return null;

  const handleOpenBuyDialog = (item: Product) => {
    setBuyTarget(item);
    setBuyQty(1);
  };

  const handleConfirmBuy = () => {
    if (!buyTarget) return;
    const totalCost = buyTarget.price * buyQty;
    const currentPoints = user.points ?? 0;

    if (currentPoints < totalCost) {
      toast.error(t("rewardShop.toastError"), {
        style: { fontFamily: '"TA_8bit"', fontSize: "16px" },
        position: "bottom-right",
      });
      setBuyTarget(null);
      return;
    }

    createOrder(
      {
        orderItems: [{ productId: buyTarget.id, quantity: buyQty, pricePerUnit: buyTarget.price }],
        paymentMethod: "POINTS",
        shippingAddress: "Digital Reward / Point Exchange",
      },
      {
        onSuccess: () => {
          toast.success(t("rewardShop.toastSuccess", { name: buyTarget.name }), {
            style: { fontFamily: '"TA_8bit"', fontSize: "16px" },
            position: "bottom-right",
          });
          setBuyTarget(null);
        },
        onError: (error: any) => {
          const rawError = error.response?.data?.error;
          let message = "Failed to redeem reward.";
          if (typeof rawError === "string") {
            message = rawError;
          } else if (Array.isArray(rawError)) {
            message = rawError[0]?.message || "Validation Error";
          } else if (rawError && typeof rawError === "object" && rawError.message) {
            message = rawError.message;
          } else if (rawError) {
            message = JSON.stringify(rawError);
          }
          toast.error(message, {
            style: { fontFamily: '"TA_8bit"', fontSize: "16px" },
            position: "bottom-right",
          });
          setBuyTarget(null);
        },
      }
    );
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
              <PixelCoin size={16} className="inline mr-1 text-yellow-400" /> {(user.points ?? 0).toLocaleString()}

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
                      {/* Image or Icon */}
                      <div className="flex items-center justify-center mb-3 h-36 bg-white/5 rounded overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-5xl">{getProductIcon(item.id)}</span>
                        )}
                      </div>
                      
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
                          <PixelCoin size={16} className="inline mr-1 text-yellow-400" /> {(item.price ?? 0).toLocaleString()}
                        </span>
                        <span className={`text-muted-foreground ${fontClass}`}>
                          {t("rewardShop.stock")}: {item.stock}
                        </span>
                      </div>

                      {/* Buy Button */}
                      <PixelButton
                        variant={
                          (user.points ?? 0) >= item.price ? "gold" : "primary"
                        }
                        size="sm"
                        className={`w-full ${fontClass}`}
                        onClick={() => handleOpenBuyDialog(item)}
                        disabled={item.stock === 0 || isRedeeming}
                      >
                        {item.stock === 0
                          ? t("rewardShop.outOfStock")
                          : (user.points ?? 0) >= item.price
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
      {/* Buy Dialog */}
      <AlertDialog open={!!buyTarget} onOpenChange={(open) => !open && setBuyTarget(null)}>
        <AlertDialogContent className="bg-[#12141a] border border-[#333] text-foreground font-pixel sm:max-w-[520px] w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-accent pixel-text-shadow text-[24px] font-pixel ${fontClass}`}>
              {t("rewardShop.dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-5 mt-3">
                {/* Product info */}
                <div className="flex items-center gap-4 p-3 bg-white/5 border border-[#333]">
                  {buyTarget?.imageUrl ? (
                    <img src={buyTarget.imageUrl} alt={buyTarget?.name} className="w-20 h-20 object-contain rounded" />
                  ) : (
                    <span className="text-5xl w-20 h-20 flex items-center justify-center">{buyTarget ? getProductIcon(buyTarget.id) : "📦"}</span>
                  )}
                  <div className="space-y-1">
                    <p className={`text-foreground font-bold text-lg ${fontClass}`}>{buyTarget?.name}</p>
                    <p className={`text-muted-foreground ${fontClass} flex items-center gap-1`}>
                      <PixelCoin size={14} className="inline text-yellow-400" />
                      {(buyTarget?.price ?? 0).toLocaleString()} {t("rewardShop.currency")} / {t("rewardShop.dialog.unit")}
                    </p>
                    <p className={`text-muted-foreground ${fontClass}`}>
                      {t("rewardShop.stock")}: <span className="text-foreground">{buyTarget?.stock}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className={`text-muted-foreground ${fontClass}`}>{t("rewardShop.dialog.qty")}:</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => setBuyQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 border border-[#444] bg-[#1a1c1e] hover:bg-yellow-600 hover:border-yellow-500 hover:text-black text-foreground transition-colors flex items-center justify-center select-none"
                    >
                      <PixelMinus size={12} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={buyTarget?.stock ?? 1}
                      value={buyQty}
                      onChange={(e) => {
                        const v = Math.max(1, Math.min(buyTarget?.stock ?? 1, Number(e.target.value)));
                        setBuyQty(v);
                      }}
                      className={`w-20 h-10 text-center bg-[#1a1c1e] border-y border-[#444] text-foreground font-pixel focus:outline-none focus:border-yellow-400 ${fontClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                    <button
                      onClick={() => setBuyQty((q) => Math.min(buyTarget?.stock ?? 1, q + 1))}
                      className="w-10 h-10 border border-[#444] bg-[#1a1c1e] hover:bg-yellow-600 hover:border-yellow-500 hover:text-black text-foreground transition-colors flex items-center justify-center select-none"
                    >
                      <PixelPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* Total cost */}
                <div className={`flex items-center justify-between border-t border-[#333] pt-4 ${fontClass}`}>
                  <span className="text-muted-foreground text-lg">{t("rewardShop.dialog.total")}:</span>
                  <span className="text-yellow-400 font-bold text-xl flex items-center gap-2">
                    <PixelCoin size={16} className="text-yellow-400" />
                    {((buyTarget?.price ?? 0) * buyQty).toLocaleString()} {t("rewardShop.currency")}
                  </span>
                </div>

                {/* Insufficient points warning */}
                {(user.points ?? 0) < (buyTarget?.price ?? 0) * buyQty && (
                  <p className={`text-red-400 ${fontClass}`}>
                    ⚠ {t("rewardShop.dialog.notEnough")}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 gap-2">
            <AlertDialogCancel
              className={`bg-[#1a1c1e] border border-[#333] text-foreground hover:bg-white/10 font-pixel ${fontClass}`}
            >
              {t("rewardShop.dialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBuy}
              disabled={isRedeeming || (user.points ?? 0) < (buyTarget?.price ?? 0) * buyQty}
              className={`bg-yellow-600 hover:bg-yellow-500 text-black border border-yellow-500 font-pixel disabled:opacity-50 disabled:cursor-not-allowed ${fontClass}`}
            >
              {isRedeeming ? t("rewardShop.dialog.processing") : t("rewardShop.dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RewardShop;
