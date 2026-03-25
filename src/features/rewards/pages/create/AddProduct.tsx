import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useCreateProduct } from "../../services/product.service";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import PixelStore from "@/components/icons/PixelStore";

const AddProduct = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && !(user.role === 'employer' || user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('senior'))) {
      toast.error("Access denied. Only Senior Adventurers or Shopkeepers can list products.");
      navigate("/reward-shop");
    }
  }, [user, navigate]);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const { t, i18n } = useTranslation();
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || !name.trim() || !description.trim() || !price || !stock) {
      toast.error("Please fill in all required fields.", {
        style: { fontFamily: i18n.language === "th" ? "text-[16px]" : "text-[16px]" },
      });
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

    createProduct(
      {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        stock: parsedStock,
      },
      {
        onSuccess: () => {
          toast.success(t("createReward.successMsg"), {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
          });
          navigate("/reward-shop");
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.error || t("createReward.errorMsg");
          toast.error(msg, {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
          });
        },
      }
    );
  };

  return (
    <div className={`max-w-[700px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      {/* Back Button */}
      <PixelButton
        variant="ghost"
        size="sm"
        className={`mb-6 font-pixel ${fontClass}`}
        onClick={() => navigate("/reward-shop")}
      >
        ← {t("createReward.back")}
      </PixelButton>

      <PixelFrame>
        <h1 className={`flex items-center gap-2 font-pixel pixel-text-shadow mb-2 ${fontClass}`}>
          <PixelStore size={24} className="text-yellow-500" /> {t("createReward.title")}
        </h1>
        <p className={`text-muted-foreground mb-6 font-pixel ${fontClass}`}>
          {t("createReward.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Code */}
          <div>
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {t("createReward.labels.code")}
            </label>
            <PixelInput
              placeholder={t("createReward.placeholders.code")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`font-pixel ${fontClass}`}
            />
            <p className={`font-pixel text-muted-foreground mt-1 ${fontClass}`}>
              {t("createReward.hints.code")}
            </p>
          </div>

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
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <PixelStore size={18} className="animate-pulse" />
                <span className={fontClass}>{t("createReward.submitBtn")}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <PixelStore size={18} />
                <span className={fontClass}>{t("createReward.submitBtn")}</span>
              </div>
            )}
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default AddProduct;