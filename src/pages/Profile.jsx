import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LuxuryToast from "../components/LuxuryToast";
import axios from "axios";
import {
  User, MapPin, Phone, Mail, Camera, Save, Shield,
  Package, XCircle, Clock, CheckCircle, ChevronRight, Hash,
  X, Truck, Calendar, CreditCard, Heart, ShoppingBag, Trash2,
  ArrowRight, Box, Sparkles
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
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      {toast.show && (
        <LuxuryToast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}

      <main className="pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">

        {/* --- LUXURY HEADER --- */}
        <div className="mb-12 md:mb-20 flex flex-col lg:flex-row lg:items-center justify-between gap-10 border-b border-slate-100 pb-12 md:pb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 md:gap-10 text-center md:text-left">
            <div className="relative group">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[3rem] md:rounded-[4rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl relative z-10">
                <img
                  src={preview || (userData.profileImage?.startsWith('http') ? userData.profileImage : `${import.meta.env.VITE_API_URL}${userData.profileImage}`) || "https://ui-avatars.com/api/?name=User"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Member Portrait"
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=User"; }}
                />
                <label htmlFor="portrait-upload" className="absolute inset-0 bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
                  <Camera className="text-white mb-2" size={24} />
                  <input id="portrait-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-[4.5rem] blur-2xl opacity-10"></div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Sparkles size={12} className="text-amber-500" />
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.4em]">Elite Tier Member</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase leading-[0.9]">
                {userData.name?.split(' ')[0] || "Client"}<br />
                <span className="text-slate-300 font-light italic">{userData.name?.split(' ')[1] || "Member"}</span>
              </h1>
            </div>
          </div>

          <div className="flex justify-center md:justify-start gap-8 md:gap-16 bg-slate-50/80 backdrop-blur-sm p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-white">
            <div className="text-center md:text-right">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Acquisitions</p>
              <p className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none">{orders.length}</p>
            </div>
            <div className="w-px bg-slate-200 h-8 md:h-10 self-center"></div>
            <div className="text-center md:text-right">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Saved Pieces</p>
              <p className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none">{wishlist.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

          {/* --- SIDE NAVIGATION: Responsive Scroll on Mobile --- */}
          <aside className="lg:col-span-3">
            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar space-x-4 lg:space-x-0 lg:space-y-3 sticky top-24 md:top-32 z-40 bg-white lg:bg-transparent">
              <SidebarLink icon={<User size={18} />} label="Identity" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
              <SidebarLink icon={<Package size={18} />} label="Manifest" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
              <SidebarLink icon={<Heart size={18} />} label="Vault" active={activeTab === "wishlist"} onClick={() => setActiveTab("wishlist")} />
              <div className="hidden lg:block pt-10 mt-10 border-t border-slate-100">
                <button className="flex items-center gap-4 px-8 text-slate-400 hover:text-rose-600 transition-all">
                  <XCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Terminate</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* --- CONTENT ENGINE --- */}
          <div className="lg:col-span-9">

            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 md:space-y-20">
                <section>
                  <SectionTitle title="Client Credentials" />
                  <div className="grid md:grid-cols-2 gap-8 md:gap-16 mt-8 md:mt-12">
                    <ProfileInput label="Full Signature Name" name="name" value={userData.name} onChange={handleChange} />
                    <ProfileInput label="Registered Email" name="email" value={userData.email} readonly />
                    <ProfileInput label="Primary Contact" name="phone" value={userData.phone} onChange={handleChange} />
                  </div>
                </section>

                <section>
                  <SectionTitle title="Shipping Logistics" />
                  <div className="mt-8 md:mt-12 space-y-8 md:space-y-12">
                    <ProfileInput label="Street Registry" name="address" value={userData.address} onChange={handleChange} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                      <ProfileInput label="City" name="city" value={userData.city} onChange={handleChange} />
                      <ProfileInput label="State" name="state" value={userData.state} onChange={handleChange} />
                      <ProfileInput label="Zip" name="pincode" value={userData.pincode} onChange={handleChange} />
                      <ProfileInput label="Country" name="country" value={userData.country} onChange={handleChange} />
                    </div>
                  </div>
                </section>

                <div className="flex justify-center md:justify-end pt-6">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full md:w-auto group px-12 py-5 bg-slate-950 text-white rounded-2xl md:rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-amber-600 transition-all duration-500"
                  >
                    {loading ? "Synchronizing..." : <>Sync Changes <Save size={16} /></>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SectionTitle title="The Manifest Archive" />
                <div className="mt-12 space-y-6">
                  {orders.length === 0 ? (
                    <EmptyState icon={<Box size={32} />} message="No transaction history." />
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="group bg-white rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 border border-slate-100 hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black italic md:text-xl">
                            {order.status.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">#{order._id.slice(-6).toUpperCase()}</span>
                              <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {order.status}
                              </span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-black text-slate-950 tracking-tighter italic leading-none">₹{order.total.toLocaleString()}</h3>
                          </div>
                        </div>
                        <button onClick={() => setModalOrder(order)} className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                          View Details <ArrowRight size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <SectionTitle title="The Private Vault" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {wishlist.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState icon={<Heart size={32} />} message="Vault is currently vacant." />
                    </div>
                  ) : (
                    wishlist.map((product) => (
                      <div key={product._id} className="group bg-white rounded-[2rem] md:rounded-[3.5rem] p-4 md:p-6 border border-slate-50 hover:border-slate-200 transition-all flex items-center gap-6 md:gap-8">
                        <div className="w-24 h-32 md:w-32 md:h-44 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-slate-50 flex-shrink-0">
                          <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-[8px] font-black text-amber-600 uppercase tracking-[0.2em] truncate">{product.category || "Piece"}</p>
                            <button onClick={() => removeFromWishlist(product._id)} className="text-slate-200 hover:text-rose-500 transition-colors p-1">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <h3 className="text-lg md:text-2xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-1 truncate">{product.name}</h3>
                          <p className="text-lg md:text-2xl font-black text-slate-950 tracking-tighter italic">₹{product.price.toLocaleString()}</p>
                          <button onClick={() => navigate(`/product/${product._id}`)} className="mt-4 flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-900 border-b border-slate-950 pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-all">
                            Acquire <ChevronRight size={12} />
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

      {/* --- ORDER MODAL: Fullscreen Responsive --- */}
      {modalOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md md:backdrop-blur-xl" onClick={() => setModalOrder(null)}></div>
          <div className="relative bg-white md:rounded-[4rem] w-full h-full md:h-auto md:max-w-5xl md:max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col lg:flex-row">
            
            {/* Left/Top Panel */}
            <div className="w-full lg:w-80 bg-slate-50 p-8 md:p-12 border-r border-slate-100">
              <div className="flex flex-row lg:flex-col justify-between items-center lg:items-start h-full gap-8">
                <button onClick={() => setModalOrder(null)} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-xl shadow-sm">
                  <X size={20} />
                </button>
                <div className="lg:mt-12 text-right lg:text-left">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">Status</p>
                  <h4 className="text-2xl md:text-4xl font-black text-slate-950 uppercase tracking-tighter italic">{modalOrder.status}</h4>
                </div>
                <div className="hidden lg:flex flex-col gap-8 mt-12">
                  <ModalStat icon={<Calendar size={14} />} label="Registered" value={new Date(modalOrder.createdAt).toLocaleDateString()} />
                  <ModalStat icon={<Truck size={14} />} label="Logistics" value="Priority" />
                </div>
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex-grow p-8 md:p-16">
              <h3 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase mb-12">Manifest</h3>
              <div className="space-y-8">
                {modalOrder.items.map((item) => (
                  <div key={item._id} className="flex gap-6 md:gap-10 items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="mb-2 md:mb-0">
                        <p className="font-black text-slate-950 uppercase tracking-tighter text-sm md:text-xl">{item.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xl md:text-2xl font-black text-slate-950 tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-16 pt-8 border-t-2 border-slate-950 flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</p>
                <p className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter italic leading-none">₹{modalOrder.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

/* --- REFINED SUB-COMPONENTS --- */
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex-shrink-0 flex items-center gap-4 px-6 lg:px-10 py-4 lg:py-6 rounded-2xl lg:rounded-[2.5rem] transition-all duration-500 ${active ? 'bg-slate-950 text-white shadow-lg lg:scale-105' : 'text-slate-400 hover:text-slate-950 bg-slate-50 lg:bg-transparent'}`}>
    <span className={active ? "text-amber-500" : ""}>{icon}</span>
    <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] whitespace-nowrap">{label}</span>
  </button>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-4 md:gap-8">
    <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-amber-600 whitespace-nowrap">{title}</h3>
    <div className="h-px bg-slate-100 w-full"></div>
  </div>
);

const ProfileInput = ({ label, name, value, onChange, readonly }) => (
  <div className="space-y-2 md:space-y-4">
    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</label>
    <input
      type="text" name={name} value={value || ""} onChange={onChange} readOnly={readonly}
      className={`w-full bg-transparent border-b border-slate-100 py-2 md:py-4 text-base md:text-xl font-black tracking-tight text-slate-950 focus:outline-none focus:border-slate-950 transition-all ${readonly ? 'opacity-40 italic cursor-not-allowed' : ''}`}
    />
  </div>
);

const ModalStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-950">{icon}</div>
    <div>
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className="text-[11px] font-black text-slate-950 uppercase">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="py-20 text-center border border-dashed border-slate-200 rounded-[2rem] bg-slate-50/30">
    <div className="text-slate-200 flex justify-center mb-4">{icon}</div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{message}</p>
  </div>
);

export default Profile;