import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LuxuryToast from "../components/LuxuryToast";
import axios from "axios";
import {
  User, MapPin, Phone, Mail, Camera, Save, Shield,
  Package, XCircle, Clock, CheckCircle, ChevronRight, Hash,
  X, Truck, Calendar, CreditCard, Heart, ShoppingBag, Trash2,
  ArrowRight, Box, Sparkles, Loader2
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "", country: "", profileImage: ""
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [preview, setPreview] = useState(null);
  const [modalOrder, setModalOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, { headers });
        setUserData(userRes.data);

        const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, { headers });
        setOrders(orderRes.data);

        const wishRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/wishlist`, { headers });
        setWishlist(wishRes.data || []);
      } catch (err) { showToast("Archive Access Denied", "error"); }
    };
    if (token) fetchData();
  }, [token]);

  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (key !== 'profileImage') formData.append(key, userData[key]);
      });
      if (userData.profileImage instanceof File) {
        formData.append("profileImage", userData.profileImage);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      showToast("Profile Synchronized Successfully");
    } catch (error) {
      showToast("Sync Error: Update Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/wishlist/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      <Navbar />
      {toast.show && (
        <LuxuryToast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}

      <main className="pt-24 md:pt-40 pb-24 px-4 md:px-8 max-w-7xl mx-auto">

        {/* --- LUXURY HEADER --- */}
        <div className="mb-10 md:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 pb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] md:rounded-[5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-2xl relative z-10">
                <img
                  src={preview || (userData.profileImage?.startsWith('http') ? userData.profileImage : `${import.meta.env.VITE_API_URL}${userData.profileImage}`) || "https://ui-avatars.com/api/?name=User"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Member Portrait"
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=User"; }}
                />
                <label htmlFor="portrait-upload" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
                  <Camera className="text-white mb-2" size={24} />
                  <span className="text-[8px] text-white font-black uppercase tracking-widest">Update</span>
                  <input id="portrait-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-[6rem] blur-2xl opacity-10"></div>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="h-px w-6 bg-amber-500 hidden md:block"></div>
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.4em]">Elite Identity</p>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-[0.85]">
                {userData.name?.split(' ')[0] || "Client"}<br />
                <span className="text-slate-200 font-light italic">{userData.name?.split(' ')[1] || "Member"}</span>
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-12 bg-slate-50/80 backdrop-blur-sm p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-white/50">
            <div className="text-center md:text-right border-r md:border-r-0 border-slate-200 pr-4 md:pr-0">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Acquisitions</p>
              <p className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter leading-none">{orders.length}</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Vault Size</p>
              <p className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter leading-none">{wishlist.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

          {/* --- MOBILE-OPTIMIZED COMMAND BAR --- */}
          <aside className="lg:col-span-3">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar gap-3 sticky top-20 md:top-32 z-40 bg-white/90 backdrop-blur-md lg:bg-transparent -mx-4 px-4 lg:mx-0 lg:px-0">
              <SidebarLink icon={<User size={18} />} label="Identity" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
              <SidebarLink icon={<Package size={18} />} label="Manifest" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
              <SidebarLink icon={<Heart size={18} />} label="Vault" active={activeTab === "wishlist"} onClick={() => setActiveTab("wishlist")} />
              
              <div className="hidden lg:block pt-10 mt-10 border-t border-slate-100">
                <button className="group flex items-center gap-4 px-10 text-slate-300 hover:text-rose-600 transition-all">
                  <XCircle size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* --- CONTENT ENGINE --- */}
          <div className="lg:col-span-9">

            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-16 md:space-y-24">
                <section>
                  <SectionTitle title="Core Credentials" />
                  <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-10 md:mt-12">
                    <ProfileInput label="Full Signature Name" name="name" value={userData.name} onChange={handleChange} />
                    <ProfileInput label="Registered Email" name="email" value={userData.email} readonly />
                    <ProfileInput label="Primary Contact" name="phone" value={userData.phone} onChange={handleChange} />
                  </div>
                </section>

                <section>
                  <SectionTitle title="Shipping Logistics" />
                  <div className="mt-10 md:mt-12 space-y-10 md:space-y-16">
                    <ProfileInput label="Street Registry" name="address" value={userData.address} onChange={handleChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                      <ProfileInput label="City" name="city" value={userData.city} onChange={handleChange} />
                      <ProfileInput label="State" name="state" value={userData.state} onChange={handleChange} />
                      <ProfileInput label="Zip Code" name="pincode" value={userData.pincode} onChange={handleChange} />
                      <ProfileInput label="Country" name="country" value={userData.country} onChange={handleChange} />
                    </div>
                  </div>
                </section>

                <div className="flex justify-center md:justify-end pt-10">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full md:w-auto group px-16 py-6 bg-slate-950 text-white rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-amber-600 transition-all duration-700 shadow-2xl shadow-slate-200"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sync Changes <Save size={18} /></>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <SectionTitle title="The Manifest Archive" />
                <div className="mt-12 space-y-4 md:space-y-8">
                  {orders.length === 0 ? (
                    <EmptyState icon={<Box size={40} />} message="No transaction history logged." />
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="group bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 border border-slate-50 hover:border-slate-200 hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-slate-950 text-white flex items-center justify-center font-black italic text-xl md:text-2xl shrink-0">
                            {order.status.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">#{order._id.slice(-8).toUpperCase()}</span>
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full">
                                <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                                <span className="text-[8px] font-black uppercase text-amber-600 tracking-widest">{order.status}</span>
                              </div>
                            </div>
                            <h3 className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter italic leading-none">₹{order.total.toLocaleString()}</h3>
                          </div>
                        </div>
                        <button onClick={() => setModalOrder(order)} className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-slate-950 text-white md:bg-slate-50 md:text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all duration-500">
                          Inspect <ArrowRight size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <SectionTitle title="The Private Vault" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  {wishlist.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState icon={<Heart size={40} />} message="Vault is currently vacant." />
                    </div>
                  ) : (
                    wishlist.map((product) => (
                      <div key={product._id} className="group bg-white rounded-[2.5rem] md:rounded-[4rem] p-5 md:p-8 border border-slate-50 hover:border-slate-200 transition-all flex items-center gap-6 md:gap-10">
                        <div className="w-28 h-36 md:w-40 md:h-52 rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-50 flex-shrink-0 relative">
                          <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          <button onClick={() => removeFromWishlist(product._id)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[8px] md:text-[9px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2">{product.category || "Design Piece"}</p>
                          <h3 className="text-xl md:text-3xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-2 truncate">{product.name}</h3>
                          <p className="text-xl md:text-3xl font-black text-slate-950 tracking-tighter italic mb-6">₹{product.price.toLocaleString()}</p>
                          <button onClick={() => navigate(`/product/${product._id}`)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-950 group/btn">
                            Acquire <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* --- ORDER MODAL: FULLSCREEN MOBILE --- */}
      {modalOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setModalOrder(null)}></div>
          <div className="relative bg-white w-full h-full md:h-auto md:max-w-6xl md:max-h-[85vh] md:rounded-[5rem] overflow-y-auto shadow-2xl flex flex-col lg:flex-row">
            
            <div className="w-full lg:w-96 bg-slate-50 p-10 md:p-16 border-r border-slate-100 shrink-0">
              <div className="flex flex-row lg:flex-col justify-between items-center lg:items-start h-full gap-12">
                <button onClick={() => setModalOrder(null)} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-[1.5rem] shadow-xl hover:scale-110 transition-all duration-500">
                  <X size={24} />
                </button>
                <div className="lg:mt-20 text-right lg:text-left">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-3">Shipment Status</p>
                  <h4 className="text-3xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">{modalOrder.status}</h4>
                </div>
                <div className="hidden lg:flex flex-col gap-10 mt-20">
                  <ModalStat icon={<Calendar size={16} />} label="Date Registered" value={new Date(modalOrder.createdAt).toLocaleDateString()} />
                  <ModalStat icon={<Truck size={16} />} label="Handling" value="Secured Global" />
                  <ModalStat icon={<CreditCard size={16} />} label="Method" value="Digital Transaction" />
                </div>
              </div>
            </div>

            <div className="flex-grow p-10 md:p-20">
              <div className="flex items-center gap-6 mb-16">
                 <div className="h-px bg-slate-950 flex-grow"></div>
                 <h3 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase italic">Manifest</h3>
              </div>
              <div className="space-y-10 md:space-y-16">
                {modalOrder.items.map((item) => (
                  <div key={item._id} className="flex gap-8 md:gap-12 items-center">
                    <div className="w-20 h-24 md:w-32 md:h-40 bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Premium Unit</p>
                        <p className="font-black text-slate-950 uppercase tracking-tighter text-lg md:text-3xl">{item.name}</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Allocation: {item.quantity}</p>
                      </div>
                      <p className="text-2xl md:text-4xl font-black text-slate-950 tracking-tighter italic leading-none">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-20 pt-10 border-t-4 border-slate-950 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Aggregate Valuation</p>
                   <p className="text-12px italic text-slate-300 font-bold uppercase tracking-widest">Fully Insured Shipment</p>
                </div>
                <p className="text-5xl md:text-8xl font-black text-slate-950 tracking-tighter italic leading-none">₹{modalOrder.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

/* --- LUXE REFINED SUB-COMPONENTS --- */
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex-shrink-0 flex items-center gap-4 px-8 lg:px-12 py-5 lg:py-7 rounded-[1.5rem] lg:rounded-[3rem] transition-all duration-700 ${active ? 'bg-slate-950 text-white shadow-2xl shadow-slate-300 lg:scale-110' : 'text-slate-400 hover:text-slate-950 bg-slate-50 lg:bg-transparent'}`}>
    <span className={active ? "text-amber-500" : "opacity-50"}>{icon}</span>
    <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-[0.3em] whitespace-nowrap">{label}</span>
  </button>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-6 md:gap-10">
    <h3 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-amber-600 whitespace-nowrap italic">{title}</h3>
    <div className="h-px bg-slate-100 w-full"></div>
  </div>
);

const ProfileInput = ({ label, name, value, onChange, readonly }) => (
  <div className="space-y-4 md:space-y-6">
    <label className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">{label}</label>
    <input
      type="text" name={name} value={value || ""} onChange={onChange} readOnly={readonly}
      className={`w-full bg-transparent border-b-2 border-slate-50 py-3 md:py-6 text-xl md:text-3xl font-black tracking-tighter text-slate-950 focus:outline-none focus:border-amber-500 transition-all duration-500 placeholder:text-slate-100 ${readonly ? 'opacity-30 italic cursor-not-allowed selection:bg-slate-100' : ''}`}
    />
  </div>
);

const ModalStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 group">
    <div className="w-14 h-14 rounded-[1.2rem] bg-white flex items-center justify-center shadow-lg text-slate-950 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">{label}</p>
      <p className="text-[12px] font-black text-slate-950 uppercase tracking-tighter">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="py-24 md:py-32 text-center border-4 border-dotted border-slate-50 rounded-[3rem] md:rounded-[5rem] bg-slate-50/20">
    <div className="text-slate-100 flex justify-center mb-6 transform scale-150">{icon}</div>
    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] italic">{message}</p>
  </div>
);

export default Profile;