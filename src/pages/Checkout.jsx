import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../redux/cartSlice";
import { 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  Receipt, 
  Package, 
  Lock 
} from "lucide-react";
import Navbar from "../components/Navbar";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    setUser(localUser);
    if (!localUser) navigate("/login");
    window.scrollTo(0, 0);
  }, [navigate]);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; 
  const grandTotal = subtotal + tax;
  const invoiceId = `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const handlePayment = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty");

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");

      const orderData = {
        items: cartItems.map((item) => ({
          product: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || "N/A",
          image: item.image || "/no-image.png",
        })),
        subtotal: subtotal,
        gst: tax,
        total: grandTotal,
        paymentMethod: "Online Payment",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          dispatch(clearCart());
          navigate("/product");
        }, 3000);
      }
    } catch (err) {
      console.error("Checkout Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Internal Server Error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      <Navbar />

      {/* SUCCESS OVERLAY */}
      {isSuccess && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-100">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Transaction Approved</h2>
          <p className="text-slate-500 text-sm max-w-xs">Your acquisition has been logged. Redirecting to gallery...</p>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: ORDER DETAILS */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                    <Receipt size={20} className="md:w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight uppercase">Checkout</h1>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ID: {invoiceId}</p>
                  </div>
                </div>
              </div>

              {/* ITEM LIST */}
              <div className="space-y-6 md:space-y-8">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 md:gap-6 pb-6 border-b border-slate-50 last:border-0">
                      <div className="w-20 h-24 md:w-24 md:h-28 bg-slate-50 rounded-xl md:rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm md:text-base line-clamp-1">{item.name}</h3>
                          <p className="font-bold text-slate-900 text-sm md:text-base ml-2">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-[9px] md:text-[11px] text-slate-400 uppercase font-bold tracking-widest">
                            Spec: {item.selectedSize}
                          </p>
                          <p className="text-[9px] md:text-[11px] text-slate-400 uppercase font-bold tracking-widest">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-400 font-medium italic uppercase tracking-widest text-sm">Manifest is empty</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: FINANCIAL SUMMARY */}
          <div className="lg:col-span-5 sticky top-24 lg:top-32 order-1 lg:order-2">
            <div className="bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl shadow-slate-400/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-6 md:mb-8">Summary Ledger</h2>
              
              <div className="space-y-4 md:space-y-5">
                <div className="flex justify-between text-[11px] md:text-xs font-medium tracking-wide">
                  <span className="text-slate-400 uppercase">Subtotal</span>
                  <span className="text-slate-100">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] md:text-xs font-medium tracking-wide">
                  <span className="text-slate-400 uppercase">Logistics</span>
                  <span className="text-amber-500 font-black text-[9px] md:text-[10px] uppercase">Complimentary</span>
                </div>
                <div className="flex justify-between text-[11px] md:text-xs font-medium tracking-wide">
                  <span className="text-slate-400 uppercase">Tax (GST 5%)</span>
                  <span className="text-slate-100">₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-slate-800 flex justify-between items-end">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Valuation</span>
                  <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 md:mt-12 space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-amber-500 text-slate-900 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-amber-400 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Authorize Payment <Lock size={14} /></>
                  )}
                </button>
                
                <div className="flex flex-col items-center gap-3 pt-2 md:pt-4">
                  <div className="flex gap-4 opacity-30">
                      <ShieldCheck size={16} />
                      <Package size={16} />
                  </div>
                  <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Secure Terminal</p>
                </div>
              </div>
            </div>

            <button 
                onClick={() => navigate("/product")}
                className="w-full mt-4 md:mt-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 rounded-2xl"
            >
                ← Back to Inventory
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;