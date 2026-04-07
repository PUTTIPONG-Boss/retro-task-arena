import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, updateOrderStatus } from "../services/admin.service";
import PixelButton from "@/components/PixelButton";
import PixelStore from "@/components/icons/PixelStore";
import { toast } from "sonner";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Truck,
  XCircle,
  Package
} from "lucide-react";

const ManageOrders = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("desc"); // 'desc' for newest, 'asc' for oldest
  const limit = 10;

  const fontClass = i18n.language === "th" ? "text-[20px]" : "text-[20px]";

  // Fetch orders
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, status, searchTerm, sort],
    queryFn: () => getAllOrders({ page, limit, status, search: searchTerm, sort }),
  });

  // Update status mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated!");
    },
    onError: () => {
      toast.error("Failed to update order status");
    }
  });

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-blue-900/40 text-blue-400 border-blue-500/50",
    PAID: "bg-yellow-900/40 text-yellow-500 border-yellow-500/50",
    SHIPPED: "bg-purple-900/40 text-purple-400 border-purple-500/50",
    COMPLETED: "bg-green-900/40 text-green-400 border-green-500/50",
    CANCELLED: "bg-red-900/40 text-red-400 border-red-500/50",
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a1a1b] p-6 pixel-border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent/20 flex items-center justify-center pixel-border border-accent">
            <Package className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className={`text-[24px] text-accent pixel-text-shadow ${fontClass}`}>
              {t("admin.orders.title")}
            </h1>
            <p className="text-muted-foreground opacity-70">
              {t("admin.orders.subtitle")}
            </p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative group w-full md:w-64">
          <input
            type="text"
            placeholder={t("admin.orders.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary border-2 border-[#333] p-2 pl-10 text-sm focus:outline-none focus:border-accent transition-colors font-pixel"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent" />
        </form>
      </div>

      {/* Filters (Tabs Style) */}
      <div className="flex flex-wrap gap-2 px-1">
        {["", "PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-4 py-2 text-[12px] uppercase tracking-wider transition-all pixel-border ${status === s
              ? "bg-accent text-black border-accent"
              : "bg-secondary text-muted-foreground border-transparent hover:border-[#444]"
              } font-pixel`}
          >
            {s || "ALL"}
          </button>
        ))}
      </div>

      <div className="flex justify-end px-1">
        <button
          onClick={() => setSort(s => s === "desc" ? "asc" : "desc")}
          className="flex items-center gap-2 text-[12px] text-accent hover:text-accent/80 transition-colors font-pixel uppercase tracking-widest bg-secondary/50 px-3 py-1.5 pixel-border border-[#333]"
        >
          <Filter className="w-3 h-3" />
          {sort === "desc" ? "Newest First (ล่าสุด)" : "Oldest First (เก่าสุด)"}
        </button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse text-accent font-pixel">LOADING ORDERS...</div>
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="bg-secondary/30 pixel-border p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground font-pixel">{t("admin.orders.noOrders")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {data.data.map((order) => (
              <div key={order.id} className="bg-secondary pixel-border p-5 hover:bg-secondary/80 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-accent font-pixel">#{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 pixel-border ${statusColors[order.status] || ""} font-pixel`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-6 h-6 bg-[#333] pixel-border border-[#444] flex items-center justify-center text-[10px]">
                        {order.user?.username?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-medium">{order.user?.username || "Quest Hunter"}</span>
                      {/* <span className="text-muted-foreground text-xs">({order.user?.email || "Unknown Email"})</span> */}
                    </div>
                    <p className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Items Summary */}
                  <div className="flex-1 border-l-2 border-[#333] md:pl-6">
                    <div className="space-y-1">
                      {order.orderItems?.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-[#e3d8c1]">x{item.quantity} {item.product?.name || "Item"}</span>
                          <span className="text-accent">{item.totalPrice} P</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t border-[#333] flex justify-between font-bold text-accent">
                        <span>{t("admin.orders.total")}</span>
                        <span>{order.totalPrice} P</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    {order.status === "PENDING" && (
                      <PixelButton
                        size="sm"
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-[10px]"
                        onClick={() => updateMutation.mutate({ id: order.id, status: "PAID" })}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-2" />
                        Confirm Payment
                      </PixelButton>
                    )}
                    {(order.status === "PENDING" || order.status === "PAID") && (
                      <PixelButton
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-[10px]"
                        onClick={() => updateMutation.mutate({ id: order.id, status: "SHIPPED" })}
                      >
                        <Truck className="w-3 h-3 mr-2" />
                        Ship Order
                      </PixelButton>
                    )}
                    {order.status === "SHIPPED" && (
                      <PixelButton
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-500 text-[10px]"
                        onClick={() => updateMutation.mutate({ id: order.id, status: "COMPLETED" })}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-2" />
                        Complete Order
                      </PixelButton>
                    )}
                    {["PENDING", "PAID"].includes(order.status) && (
                      <button
                        className="text-[9px] text-red-500 hover:underline mt-1 font-pixel uppercase tracking-tighter"
                        onClick={() => updateMutation.mutate({ id: order.id, status: "CANCELLED" })}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div className="mt-4 pt-4 border-t border-[#333] text-[11px] text-muted-foreground italic">
                    📍 {order.shippingAddress}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 py-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 pixel-border bg-secondary disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-pixel text-accent">PAGE {page}</span>
            <button
              disabled={data.data.length < limit}
              onClick={() => setPage(p => p + 1)}
              className="p-2 pixel-border bg-secondary disabled:opacity-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
