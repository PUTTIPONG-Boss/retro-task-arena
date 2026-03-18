import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PixelFrame from "@/components/PixelFrame";
import PixelButton from "@/components/PixelButton";
import PixelInput from "@/components/PixelInput";
import PixelTextarea from "@/components/PixelTextarea";
import { useCreateProduct } from "../services/product.service";
import { useUserStore } from "@/features/users/store/userStore";
import { toast } from "sonner";
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
          toast.success("Product added to the shop!", {
            style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
          });
          navigate("/reward-shop");
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.error || "Failed to add product. Check the API.";
          toast.error(msg, {
            style: { fontFamily: '"Press Start 2P"', fontSize: "10px" },
          });
        },
      }
    );
  };

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      {/* Back Button */}
      <PixelButton
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate("/reward-shop")}
      >
        ← Back to Shop
      </PixelButton>

      <PixelFrame>
        {/* Header */}
        <h1 className="font-pixel text-[13px] text-foreground pixel-text-shadow mb-2">
          🏪 Add New Product
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          List a new item in the Reward Shop.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Code */}
          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">
              Product Code
            </label>
            <PixelInput
              placeholder="e.g. PROD-2026-001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="font-pixel text-[7px] text-muted-foreground mt-1">
              Must be unique. Will be auto-uppercased.
            </p>
          </div>

          {/* Product Name */}
          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">
              Product Name
            </label>
            <PixelInput
              placeholder="e.g. Mechanical Keyboard G3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-pixel text-[9px] text-foreground block mb-2">
              Description
            </label>
            <PixelTextarea
              rows={4}
              placeholder="RGB Backlit, Blue Switches, Wireless 2.4GHz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Price + Stock side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">
                Price (GP)
              </label>
              <PixelInput
                type="number"
                placeholder="2500"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-pixel text-[9px] text-foreground block mb-2">
                Stock
              </label>
              <PixelInput
                type="number"
                placeholder="50"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <PixelButton
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "🏪 Adding..." : "🏪 Add Product"}
          </PixelButton>
        </form>
      </PixelFrame>
    </div>
  );
};

export default AddProduct;
