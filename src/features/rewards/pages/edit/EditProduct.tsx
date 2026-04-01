import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useGetProductById, useUpdateProduct } from "../../services/product.service";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import PixelStore from "@/components/icons/PixelStore";

const CATEGORY_OPTIONS = [
  { value: "coupon", label: "Coupon" },
  { value: "accessories", label: "Accessories" },
  { value: "clothing", label: "Clothing" },
];

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { t, i18n } = useTranslation();

  const { data: product, isLoading: isFetching } = useGetProductById(id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("coupon");

  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  // Admin access check
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      toast.error("Access denied. Only Admin can edit products.");
      navigate("/reward-shop");
    }
  }, [user, navigate]);

  // Pre-fill form when product data is loaded
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setCategory(product.category || "coupon");
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;
    if (!name.trim() || !description.trim() || !category.trim() || !price || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const parsedPrice = parseInt(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Price must be a valid non-negative number.");
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      toast.error("Stock must be a valid non-negative number.");
      return;
    }

    updateProduct(
      {
        id,
        payload: {
          name: name.trim(),
          description: description.trim(),
          category: category.trim(),
          price: parsedPrice,
          stock: parsedStock,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("admin.rewardspage.saveSuccess") || "Product updated successfully!", {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
          });
          navigate("/admin/managereward");
        },
        onError: (error: any) => {
          const raw = error?.response?.data?.error;
          const msg = typeof raw === "string" ? raw : typeof raw?.message === "string" ? raw.message : "Failed to update product.";
          toast.error(msg, {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
          });
        },
      }
    );
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="font-pixel text-accent animate-pulse">Loading Product...</div>
      </div>
    );
  }

  return (
    <div className={`max-w-[700px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      {/* Back Button */}
      <PixelButton
        variant="danger"
        size="sm"
        className={`mb-6 font-pixel ${fontClass}`}
        onClick={() => navigate(-1)}
      >
        ← {t("createReward.back")}
      </PixelButton>

      <PixelFrame>
        <h1 className={`flex items-center gap-2 font-pixel pixel-text-shadow mb-2 ${fontClass}`}>
          <PixelStore size={24} className="text-yellow-500" /> {t("admin.questspage.edit") || "Edit Product"}
        </h1>
        <p className={`text-muted-foreground mb-6 font-pixel ${fontClass}`}>
          Update product details and stock availability
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {t("createReward.labels.name")}
            </label>
            <PixelInput
              placeholder={t("createReward.placeholders.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`font-pixel ${fontClass}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {t("createReward.labels.description")}
            </label>
            <PixelTextarea
              rows={4}
              placeholder={t("createReward.placeholders.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`font-pixel ${fontClass}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {t("createReward.labels.category")}
            </label>
            <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`font-pixel ${fontClass} w-full bg-background border border-border text-foreground px-3 py-2 pr-10 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer appearance-none pixel-inset`}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <ChevronDown size={16} />
              </div>
          </div>  
          </div>

          {/* Price + Stock side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
                {t("createReward.labels.price")}
              </label>
              <PixelInput
                type="number"
                placeholder={t("createReward.placeholders.price")}
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`font-pixel ${fontClass}`}
              />
            </div>
            <div>
              <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
                {t("createReward.labels.stock")}
              </label>
              <PixelInput
                type="number"
                placeholder={t("createReward.placeholders.stock")}
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`font-pixel ${fontClass}`}
              />
            </div>
          </div>

          {/* Submit */}
          <PixelButton
            type="submit"
            variant="gold"
            size="lg"
            className="w-full font-pixel h-14"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <PixelStore size={18} className="animate-pulse" />
                <span className={fontClass}>{t("admin.rewardspage.save") || "Saving..."}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <PixelStore size={18} />
                <span className={fontClass}>{t("admin.rewardspage.save") || "Save Changes"}</span>
              </div>
            )}
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default EditProduct;
