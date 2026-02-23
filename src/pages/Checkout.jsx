import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../redux/cartSlice";
import { 
  X, 
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

  // Load user and protect route
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    setUser(localUser);
    if (!localUser) navigate("/login");
  }, [navigate]);

  // Calculations
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // GST 5%
  const grandTotal = subtotal + tax;
  const invoiceId = `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const handlePayment = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty");

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");

      // FIXED: Sending exactly what your Backend router.post("/") expects
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.id || item._id, // Ensure ID is passed correctly
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || "N/A",
          image: item.image || "/no-image.png",
        })),
        subtotal: subtotal,
        gst: tax,
        total: grandTotal,
        paymentMethod: "Online Payment", // Added to satisfy backend destructuring
      };

      const response = await axios.post(
        "http://localhost:5000/api/orders",
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
      alert(err.response?.data?.message || "Internal Server Error (500). Please check if backend fields match.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      <Navbar />

      {/* SUCCESS OVERLAY */}
      {isSuccess && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-100">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Transaction Approved</h2>
          <p className="text-slate-500 text-sm max-w-xs">Your acquisition has been logged. Redirecting to gallery...</p>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto pt-32 pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: ORDER DETAILS */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight uppercase">Checkout</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ID: {invoiceId}</p>
                  </div>
                </div>
              </div>

              {/* ITEM LIST */}
              <div className="space-y-8">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6 pb-6 border-b border-slate-50 last:border-0">
                      <div className="w-24 h-28 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                        {/* NO HOVER EFFECT AS REQUESTED */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-slate-800 uppercase tracking-tight">{item.name}</h3>
                          <p className="font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 uppercase font-bold tracking-widest">
                          Specification: {item.selectedSize}
                        </p>
                        <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-10 text-slate-400 font-medium italic uppercase tracking-widest">Manifest is empty</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: FINANCIAL SUMMARY */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-400/20 relative overflow-hidden">
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-8">Summary Ledger</h2>
              
              <div className="space-y-5">
                <div className="flex justify-between text-xs font-medium tracking-wide">
                  <span className="text-slate-400 uppercase">Subtotal</span>
                  <span className="text-slate-100">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium tracking-wide">
                  <span className="text-slate-400 uppercase">Logistics</span>
                  <span className="text-amber-500 font-black text-[10px] uppercase">Complimentary</span>
                </div>
                <div className="flex justify-between text-xs font-medium tracking-wide">
                  <span className="text-slate-400 uppercase">Tax (GST 5%)</span>
                  <span className="text-slate-100">₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="pt-8 mt-8 border-t border-slate-800 flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Valuation</span>
                  <span className="text-4xl font-black text-white tracking-tighter">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-amber-500 text-slate-900 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 disabled:bg-slate-800 disabled:text-slate-600 active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>Authorize Payment <Lock size={14} /></>
                  )}
                </button>
                
                <div className="flex flex-col items-center gap-3 pt-4">
                  <div className="flex gap-4 opacity-30">
                      <ShieldCheck size={18} strokeWidth={1.5} />
                      <Package size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Secure Terminal</p>
                </div>
              </div>
            </div>

            {/* RETURN LINK */}
            <button 
                onClick={() => navigate("/product")}
                className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 rounded-2xl"
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