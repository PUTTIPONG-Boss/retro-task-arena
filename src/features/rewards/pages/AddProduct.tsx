import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useCreateProduct } from "../services/product.service";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const AddProduct = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user && !(user.role === 'employer' || user.role.toLowerCase().includes('senior'))) {
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
  
  // ⭐️ 1. กำหนด fontClass ตามแบบที่คุณให้จำไว้ (ไม่มีชื่อ font ข้างใน)
  const fontClass = i18n.language === "th" ? "text-[16px] pt-1" : "text-[16px]";

  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
          // ⭐️ 2. ดึงคำแปล Success Message และเปลี่ยนฟอนต์ตามภาษา
          toast.success(t("createReward.successMsg"), {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
          });
          navigate("/reward-shop");
        },
        onError: (error: any) => {
          // ⭐️ 3. ดึงคำแปล Error Message เป็น Default 
          const msg = error?.response?.data?.error || t("createReward.errorMsg");
          toast.error(msg, {
            style: { fontFamily: i18n.language === "th" ? '"TA_8bit"' : '"Press Start 2P"', fontSize: "10px" },
          });
        },
      }
    );
  };

  return (
    // ⭐️ 4. เพิ่มคลาส font-['TA_8bit'] ที่ Container หลักเพื่อให้คลุมทั้งหน้า
    <div className={`max-w-[700px] mx-auto px-4 py-8 ${i18n.language === "th" ? "font-['TA_8bit']" : ""}`}>
      {/* Back Button */}
      <PixelButton
        variant="ghost"
        size="sm"
        // ⭐️ 5. เพิ่ม font-pixel และ fontClass
        className={`mb-6 font-pixel ${fontClass}`}
        onClick={() => navigate("/reward-shop")}
      >
        {/* ⭐️ 6. ดึงคำแปล */}
        ← {t("createReward.back")}
      </PixelButton>

      <PixelFrame>
        {/* Header */}
        {/* ⭐️ 7. เพิ่ม fontClass */}
        <h1 className={`font-pixel text-[13px] text-foreground pixel-text-shadow mb-2 ${fontClass}`}>
          {/* ⭐️ 8. ดึงคำแปล */}
          🏪 {t("createReward.title")}
        </h1>
        {/* ⭐️ 9. เพิ่ม font-pixel และ fontClass */}
        <p className={`text-muted-foreground mb-6 font-pixel ${fontClass}`}>
          {/* ⭐️ 10. ดึงคำแปล */}
          {t("createReward.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Code */}
          <div>
            {/* ⭐️ 11. เพิ่ม fontClass ลงใน Label ทั้งหมด */}
            <label className={`font-pixel text-foreground block mb-2 ${fontClass}`}>
              {/* ⭐️ 12. ดึงคำแปล Label */}
              {t("createReward.labels.code")}
            </label>
            <PixelInput
              // ⭐️ 13. ดึงคำแปล Placeholder และเพิ่ม fontClass
              placeholder={t("createReward.placeholders.code")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`font-pixel ${fontClass}`}
              required
            />
            {/* ⭐️ 14. เพิ่ม fontClass ให้ Hint และดึงคำแปล */}
            <p className={`font-pixel text-[7px] text-muted-foreground mt-1 ${fontClass}`}>
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
              required
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
              required
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
                required
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
                required
              />
            </div>
          </div>

          {/* Submit */}
          <PixelButton
            type="submit"
            variant="gold"
            size="lg"
            // ⭐️ 15. เพิ่ม font-pixel และ fontClass
            className={`w-full font-pixel ${fontClass}`}
            disabled={isPending}
          >
            {/* ⭐️ 16. ดึงคำแปลปุ่ม */}
            {isPending ? `🏪 ${t("createReward.submitBtn")}...` : `🏪 ${t("createReward.submitBtn")}`}
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default AddProduct;