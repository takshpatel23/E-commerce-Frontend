import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!user) navigate("/login");
    else navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 md:mb-8">
            <ShoppingBag size={32} className="text-slate-200" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter mb-4">
            Your Selection is Empty
          </h1>
          <p className="text-slate-400 font-light mb-8 max-w-xs leading-relaxed text-sm md:text-base">
            Discover our latest collection and find the pieces that define your style.
          </p>
          <button
            onClick={() => navigate("/product")}
            className="w-full md:w-auto px-10 py-4 bg-slate-950 text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-amber-600 transition-all duration-500 shadow-xl shadow-slate-200"
          >
            Start Exploring
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-24">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter">
            Shopping <span className="text-slate-200 italic font-light">Bag</span>
          </h1>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mt-2">
            {cartItems.length} Items Reserved
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* LEFT - Cart Items */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="border-t border-slate-100">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-start py-6 md:py-10 border-b border-slate-100 group"
                >
                  {/* Image - Scaled for mobile */}
                  <div className="w-24 md:w-32 aspect-[3/4] overflow-hidden rounded-2xl md:rounded-[2rem] bg-slate-50 shadow-sm flex-shrink-0">
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 ml-4 md:ml-8 flex flex-col space-y-1 md:space-y-2">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-1">
                      <div>
                        <h2 className="text-base md:text-xl font-bold text-slate-950 tracking-tight line-clamp-1">{item.name}</h2>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Ref: {item._id?.slice(-6).toUpperCase() || "NEW-PCS"}
                        </p>
                      </div>
                      <p className="text-sm md:text-xl font-black text-slate-950 tracking-tighter">
                        ₹{item.price?.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-6 pt-2 md:pt-4">
                      {item.selectedSize && (
                        <div className="bg-slate-50 px-3 md:px-4 py-0.5 md:py-1 rounded-full border border-slate-100">
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Size: {item.selectedSize}
                          </span>
                        </div>
                      )}
                      
                      {/* Quantity Logic */}
                      <div className="flex items-center gap-3 md:gap-4 bg-slate-50 rounded-lg md:rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => dispatch(decreaseQuantity({ id: item._id || item.id, selectedSize: item.selectedSize }))}
                          className="p-0.5 hover:text-amber-600 transition-colors"
                        >
                          <Minus size={12} className="md:w-3.5" />
                        </button>
                        <span className="text-[10px] md:text-xs font-black w-3 md:w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => dispatch(increaseQuantity({ id: item._id || item.id, selectedSize: item.selectedSize }))}
                          className="p-0.5 hover:text-amber-600 transition-colors"
                        >
                          <Plus size={12} className="md:w-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart({ id: item._id || item.id, selectedSize: item.selectedSize }))}
                      className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 pt-3 md:pt-4 transition-colors w-fit"
                    >
                      <Trash2 size={10} className="md:w-3" /> Remove Piece
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => dispatch(clearCart())}
              className="mt-6 md:mt-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-950 transition-colors"
            >
              Clear Entire Selection
            </button>
          </div>

          {/* RIGHT - Summary */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-slate-50 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] sticky top-24 md:top-32 space-y-6 md:space-y-8">
              <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-900 border-b border-slate-200 pb-4 md:pb-6">
                Order Summary
              </h2>

              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-slate-400 font-medium">Subtotal</span>
                  <span className="text-slate-950 font-black tracking-tight">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-slate-400 font-medium">Shipping</span>
                  <span className="text-amber-600 font-black uppercase tracking-widest text-[9px] md:text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-slate-950 font-black uppercase tracking-widest text-[10px] md:text-[11px]">Total</span>
                  <span className="text-xl md:text-2xl font-black text-slate-950 tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2 md:pt-4">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 md:py-5 bg-slate-950 text-white rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
                >
                  Checkout <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/product")}
                  className="w-full py-4 md:py-5 border border-slate-200 text-slate-950 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-slate-400">
                <ShieldCheck size={14} />
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Secure Global Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;