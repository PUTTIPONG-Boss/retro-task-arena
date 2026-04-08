import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Banknote, ShoppingBag, Filter, LayoutGrid } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";
import PixelCoin from "@/components/icons/PixelCoin";
import PixelButton from "@/components/PixelButton";
import { Transaction } from "@/features/finance/services/finance.service";

interface FinancialsTabProps {
  userPoints: number;
  transactions: Transaction[];
  orders: any[];
}

type SortOrder = "date-desc" | "date-asc" | "price-desc" | "price-asc";
type DisplayLimit = 5 | 10 | 0; // 0 means "All"

const FinancialsTab: React.FC<FinancialsTabProps> = ({ userPoints, transactions, orders }) => {
  const { t, i18n } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOrder>("date-desc");
  const [displayLimit, setDisplayLimit] = useState<DisplayLimit>(5);

  const fontClass = i18n.language === "th" ? "text-[20px]" : "text-[20px]";

  // --- Logic for Filtering and Sorting ---
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-desc":
          return b.totalPrice - a.totalPrice;
        case "price-asc":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    // Limiting
    if (displayLimit > 0) {
      result = result.slice(0, displayLimit);
    }

    return result;
  }, [orders, sortBy, displayLimit]);

  return (
    <div className="space-y-6">
      <PixelFrame>
        <h2 className={`font-pixel text-foreground pixel-text-shadow mb-4 ${fontClass}`}>
          <Banknote size={20} className="inline mr-1 text-yellow-400" /> {t("userProfile.financials.title")}
        </h2>
        <div className="space-y-4">
          <div className="pixel-border bg-secondary p-4 flex justify-between items-center">
            <div>
              <p className={`font-pixel text-muted-foreground ${fontClass}`}>
                {t("userProfile.financials.currentBalance")}
              </p>
              <p className={`font-pixel text-white mt-1 ${fontClass}`}>
                <PixelCoin size={16} className="inline mr-1 text-yellow-400" /> {userPoints.toLocaleString()} GP
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className={`font-pixel text-muted-foreground mb-2 ${fontClass}`}>
              {t("userProfile.financials.recentTransactions")}
            </h3>
            {transactions.length === 0 ? (
              <p className={`text-sm text-muted text-center py-4 ${fontClass}`}>
                {t("userProfile.financials.noTransactions")}
              </p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="pixel-border bg-muted p-3 flex justify-between items-center">
                  <div>
                    <p className={`font-pixel text-[8px] text-foreground ${fontClass}`}>
                      {tx.description || tx.transactionType}
                    </p>
                    <p className={`text-[10px] text-muted-foreground font-pixel ${fontClass}`}>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`font-pixel text-[9px] ${tx.amount > 0 ? "text-success" : "text-destructive"} ${fontClass}`}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} GP
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </PixelFrame>

      <PixelFrame>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className={`font-pixel text-foreground pixel-text-shadow m-0 ${fontClass}`}>
            <ShoppingBag size={20} className="inline mr-1 text-yellow-400" /> {t("userProfile.financials.redemptions")}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className={`text-[16px] text-muted-foreground ${fontClass}`}>{t("userProfile.financials.sortBy")}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                className="bg-[#1a1a1b] border-2 border-[#4a3e2a] text-[#e3b86a] font-pixel text-[16px] px-2 py-1 outline-none focus:border-[#e3b86a]"
              >
                <option value="date-desc">🕒 {t("userProfile.activity.sortNewest")}</option>
                <option value="date-asc">🕒 {t("userProfile.activity.sortOldest")}</option>
                <option value="price-desc">💰 {t("userProfile.financials.priceHigh")}</option>
                <option value="price-asc">💰 {t("userProfile.financials.priceLow")}</option>
              </select>
            </div>

            {/* Display Limit Controls */}
            <div className="flex items-center gap-2">
              <span className={`text-[16px] text-muted-foreground font-pixel ${fontClass}`}>
                {t("userProfile.financials.displayLimit")}
              </span>
              <div className="flex gap-1">
                {[5, 10, 0].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => setDisplayLimit(limit as DisplayLimit)}
                    className={`font-pixel text-[16px] px-2 py-1 border-2 transition-all ${
                      displayLimit === limit
                        ? "bg-[#e3b86a] border-[#e3b86a] text-[#1a1a1b]"
                        : "bg-[#1a1a1b] border-[#4a3e2a] text-[#8a8a8a] hover:border-[#8a8a8a]"
                    }`}
                  >
                    {limit === 0 ? "ALL" : limit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAndSortedOrders.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <span className="text-4xl block mb-2">🕸️</span>
              <p className={`text-sm font-pixel ${fontClass}`}>
                {t("userProfile.financials.noRedemptions")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedOrders.map((order) => (
                <div key={order.id} className="pixel-border bg-secondary p-4 hover:bg-secondary/80 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className={`font-pixel text-[20px] text-[#e3b86a] ${fontClass}`}>
                        Order #{order.orderNumber.split('-').pop()}
                      </p>
                      <p className={`font-pixel text-[20px] text-muted-foreground font-pixel mt-1 ${fontClass}`}>
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`pixel-border px-3 py-1 font-pixel text-[9px] ${
                        order.status === "COMPLETED"
                          ? "bg-green-900/40 text-green-400 border-green-500/50"
                          : order.status === "CANCELLED"
                          ? "bg-red-900/40 text-red-400 border-red-500/50"
                          : "bg-blue-900/40 text-blue-400 border-blue-500/50"
                      } ${fontClass}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-[#4a3e2a]/50">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-[12px] font-pixel text-white">
                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[20px] text-muted-foreground">x{item.quantity}</span>
                          <span className="text-[#e3d8c1] font-pixel text-[20px]">{item.product?.name || "Unknown Product"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-pixel text-[20px]">
                          <PixelCoin size={22} />
                          <span>{item.totalPrice?.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-dashed border-[#4a3e2a]">
                    <span className={`font-pixel text-[20px] text-muted-foreground ${fontClass}`}>{t("userProfile.financials.total") || "TOTAL"}</span>
                    <div className="flex items-center gap-2 text-[#e3b86a] font-pixel text-[20px]">
                      <PixelCoin size={22} />
                      <span>{order.totalPrice?.toLocaleString()} P</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PixelFrame>
    </div>
  );
};

export default FinancialsTab;
