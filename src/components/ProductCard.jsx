import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { ShoppingBag, Eye, Star } from "lucide-react";
import { toast } from "react-hot-toast";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return null;

  const discountPercent = 15;
  const originalPrice = product.price || 0;
  const offerPrice = originalPrice * (1 - discountPercent / 100);

  const image = product.image?.[0] || "/no-image.png";
  const name = product.name || "Unnamed Piece";

  // ✅ Show parent category if exists
  const category =
    typeof product.category === "object"
      ? product.category.parent?.name || product.category.name
      : product.category || "General";

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (product.sizes?.length > 0) {
      if (!selectedSize) {
        return toast.error("Please select a size first");
      }

      const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
      if (!selectedSizeObj || selectedSizeObj.quantity === 0) {
        return toast.error("This size is out of stock");
      }
    }

    dispatch(
      addToCart({
        id: product._id,
        name,
        price: offerPrice,
        image,
        quantity: 1,
        selectedSize: selectedSize || "Standard",
      })
    );

    toast.success(`${name} added to bag ✨`);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative flex flex-col cursor-pointer bg-transparent transition-all duration-700"
    >
      {/* IMAGE */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-[2.5rem]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />

        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-800 shadow-sm border border-white/20">
            {category}
          </span>

          <span className="bg-amber-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter shadow-lg">
            -{discountPercent}%
          </span>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
          <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 space-y-4">
            {/* SIZE SELECTOR */}
            {product.sizes?.length > 0 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {product.sizes.map((s, i) => {
                  const isOutOfStock = s.quantity === 0;
                  return (
                    <button
                      key={i}
                      disabled={isOutOfStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) setSelectedSize(s.size);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-300 border
                        ${isOutOfStock
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed line-through"
                          : selectedSize === s.size
                          ? "bg-amber-500 border-amber-400 text-white"
                          : "bg-white/20 border-white/30 text-white hover:bg-white hover:text-slate-900"
                        }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-[3] py-4 bg-white text-slate-900 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-amber-500 hover:text-white active:scale-95"
              >
                <ShoppingBag size={14} />
                {selectedSize || product.sizes?.length === 0 ? "Add to Bag" : "Select Size"}
              </button>

              <button
                className="flex-1 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product._id}`);
                }}
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-5 px-1 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight group-hover:text-amber-600 transition-colors duration-300">
            {name}
          </h3>
          <Star size={12} className="text-amber-400 fill-amber-400 mt-1" />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-lg font-black text-slate-950 tracking-tighter">
            ₹{offerPrice.toLocaleString()}
          </span>
          <span className="text-slate-400 text-xs line-through font-medium">
            ₹{originalPrice.toLocaleString()}
          </span>
        </div>

        <div className="overflow-hidden h-0 group-hover:h-5 transition-all duration-500 ease-in-out">
          <p className="text-[9px] text-amber-600 font-bold uppercase tracking-[0.25em]">
            Limited Atelier Release
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
