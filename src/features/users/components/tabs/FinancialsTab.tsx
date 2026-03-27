import React from "react";
import { useTranslation } from "react-i18next";
import { Banknote, ShoppingBag } from "lucide-react";
import PixelFrame from "@/components/PixelFrame";
import PixelCoin from "@/components/icons/PixelCoin";
import { Transaction } from "@/features/finance/services/finance.service";

interface FinancialsTabProps {
  userPoints: number;
  transactions: Transaction[];
  orders: any[];
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ userPoints, transactions, orders }) => {
  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

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
        <h2 className={`font-pixel text-foreground pixel-text-shadow mb-4 ${fontClass}`}>
          <ShoppingBag size={20} className="inline mr-1 text-yellow-400" /> {t("userProfile.financials.redemptions") || "REDEMPTION HISTORY"}
        </h2>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className={`text-sm text-muted text-center py-4 ${fontClass}`}>
              {t("userProfile.financials.noRedemptions") || "No redemptions yet."}
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="pixel-border bg-secondary p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className={`font-pixel text-[10px] text-foreground ${fontClass}`}>
                      Order: {order.orderNumber}
                    </p>
                    <p className={`text-[10px] text-muted-foreground font-pixel ${fontClass}`}>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`pixel-border px-2 py-0.5 font-pixel text-[8px] ${
                      order.status === "COMPLETED"
                        ? "bg-success text-success-foreground"
                        : order.status === "CANCELLED"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    } ${fontClass}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1 pl-2 border-l-2 border-muted">
                  {order.orderItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-[11px] font-pixel text-white">
                      <span>
                        {item.product?.name || "Unknown Product"} x{item.quantity}
                      </span>
                      <span>
                        <PixelCoin size={12} className="inline mr-1" /> {item.totalPrice} GP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </PixelFrame>
    </div>
  );
};

export default FinancialsTab;
