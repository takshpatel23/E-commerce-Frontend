import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Heart,
  Share2,
  ChevronRight,
  Info,
  Tag,
  Star
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(res.data);

        if (res.data.image && res.data.image.length > 0) {
          setSelectedImage(res.data.image[0]);
        }

        if (token) {
          const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsWishlisted(userRes.data.wishlist.includes(id));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const toggleWishlist = async () => {
    if (!token) return toast.error("Please login to save this piece.");

    setWishlistLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/wishlist/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsWishlisted(res.data.wishlist.includes(id));
      toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ✨");
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = product.price * 0.85;

    if (product.sizes?.length > 0) {
      if (!selectedSize) return toast.error("Please select a size");
      const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
      if (!selectedSizeObj || selectedSizeObj.quantity === 0) return toast.error("This size is out of stock");
    }

    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: finalPrice,
      image: selectedImage || product.image?.[0] || "/no-image.png",
      quantity: 1,
      selectedSize: selectedSize || "Standard",
    }));

    toast.success("Added to your collection ✨");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4 px-6 text-center">
      <p className="font-black text-slate-300 tracking-widest text-xl md:text-2xl uppercase">Piece Not Found</p>
      <button onClick={() => navigate(-1)} className="text-amber-600 font-bold flex items-center gap-2">
        <ArrowLeft size={18} /> Go Back
      </button>
    </div>
  );

  const discountPercent = 15;
  const offerPrice = product.price * (1 - discountPercent / 100);

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-slate-900 selection:bg-amber-100">
      <Navbar />
      <Toaster position="bottom-center" />

      {/* Breadcrumb Navigation - Scrollable on mobile */}
      <nav className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 overflow-x-auto whitespace-nowrap no-scrollbar">
        <span className="hover:text-slate-900 cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
        <ChevronRight size={10} className="flex-shrink-0" />
        <span className="hover:text-slate-900 cursor-pointer transition-colors" onClick={() => navigate("/product")}>Shop</span>
        <ChevronRight size={10} className="flex-shrink-0" />
        <span className="text-slate-900 truncate">{product.name}</span>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

        {/* LEFT SIDE: Visuals */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50 group">
            <img
              src={selectedImage || "/no-image.png"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            <button
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className={`absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-xl border shadow-2xl ${isWishlisted
                ? "bg-rose-500 border-rose-400 text-white"
                : "bg-white/40 border-white/20 text-slate-900 hover:bg-white"
                }`}
            >
              <Heart size={18} className={isWishlisted ? "fill-white" : "fill-none"} />
            </button>

            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-slate-900 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
              <Star size={12} className="text-amber-500 fill-amber-500" />
              Summer Exclusive
            </div>
          </div>

          {/* Gallery Grid - Horizontal scroll on mobile */}
          {product.image?.length > 1 && (
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {product.image.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square w-20 h-20 md:w-auto md:h-auto flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${selectedImage === img
                    ? "border-amber-500 p-1 bg-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Information */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-32 space-y-8 md:space-y-10">
            <header className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-amber-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
                  {typeof product.category === 'object' ? product.category?.name : product.category}
                </span>
                <button className="text-slate-400 hover:text-slate-900 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1] md:leading-[0.9] text-slate-900">
                {product.name}
              </h1>

              <div className="space-y-2">
                <div className="flex items-baseline flex-wrap gap-3 md:gap-4">
                  <p className="text-3xl md:text-4xl font-black text-slate-900">
                    ₹{offerPrice.toLocaleString()}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-slate-300 line-through">
                    ₹{product.price?.toLocaleString()}
                  </p>
                  <span className="text-[10px] md:text-xs font-black text-emerald-600 bg-emerald-50 px-2 md:px-3 py-1 rounded-lg uppercase tracking-widest">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  Seasonal Promotion Applied
                </p>
              </div>
            </header>

            <div className="space-y-3">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">The Narrative</h3>
              <p className="text-slate-500 leading-relaxed text-sm italic border-l-2 border-slate-100 pl-4">
                {product.description || "A masterfully crafted piece designed for those who appreciate the finer details."}
              </p>
            </div>

            {/* Sizes Selection */}
            {product.sizes?.length > 0 && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Select Size</h3>
                  <button className="text-[9px] md:text-[10px] font-bold text-slate-900 underline underline-offset-4">Size Guide</button>
                </div>
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  {product.sizes.map((s) => {
                    const isOutOfStock = s.quantity === 0;
                    return (
                      <button
                        key={s._id}
                        disabled={isOutOfStock}
                        onClick={() => !isOutOfStock && setSelectedSize(s.size)}
                        className={`min-w-[3.5rem] md:min-w-[4rem] h-12 md:h-14 px-3 md:px-4 rounded-xl border-2 font-black text-xs transition-all duration-300
                          ${isOutOfStock
                            ? "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed line-through"
                            : selectedSize === s.size
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200 scale-105"
                              : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                          }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Section */}
            <div className="space-y-6 pt-2">
              <div className="p-4 md:p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-amber-500 shadow-sm">
                  <Tag size={16} />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-tighter">Slate Exclusive</p>
                  <p className="text-[9px] md:text-[10px] text-slate-500 font-medium">Extra 5% discount for first-time orders.</p>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.sizes?.length > 0 && !selectedSize}
                className="w-full py-5 md:py-6 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 group flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} className="transition-transform group-hover:-translate-y-1" />
                Add to Collection
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-300">
                <Info size={12} />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center">Ships worldwide from our central atelier</span>
              </div>
            </div>

            {/* Trust Badges - Scrollable on very small screens */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mt-8 md:mt-10">
              <TrustBadge icon={<Truck size={16} />} label="Global" sub="Express" />
              <TrustBadge icon={<RefreshCw size={16} />} label="Exchange" sub="10 Days" />
              <TrustBadge icon={<ShieldCheck size={16} />} label="Secure" sub="Payment" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const TrustBadge = ({ icon, label, sub }) => (
  <div className="flex flex-col items-center gap-2 md:gap-3 p-3 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-slate-50 text-center hover:border-amber-100 transition-all duration-500">
    <div className="text-amber-500">{icon}</div>
    <div className="space-y-0.5">
      <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900">
        {label}
      </span>
      <span className="block text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
        {sub}
      </span>
    </div>
  </div>
);

export default ProductDetail;