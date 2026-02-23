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
    // No setTimeout needed here anymore! The Toast handles its own 5s life.
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
    console.log("FILE TYPE:", file.type);
    console.log("FILE NAME:", file.name);
    if (file) {
      setUserData({ ...userData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("city", userData.city);
      formData.append("state", userData.state);
      formData.append("pincode", userData.pincode);
      formData.append("country", userData.country);

      // 🔥 IMPORTANT
      if (userData.profileImage instanceof File) {
        formData.append("profileImage", userData.profileImage);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
        <LuxuryToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* --- LUXURY HEADER --- */}
        <div className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-slate-100 pb-16">
          <div className="flex items-center gap-10">
            <div className="relative group">
              {/* PORTRAIT UPLOAD */}
              <div className="w-44 h-44 rounded-[4rem] overflow-hidden bg-slate-100 border-4 border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative z-10">
                <img
                  src={preview || (userData.profileImage ? `${import.meta.env.VITE_API_URL}${userData.profileImage}` : "https://via.placeholder.com/150")}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  alt="Member Portrait"
                />
                <label htmlFor="portrait-upload" className="absolute inset-0 bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
                  <Camera className="text-white mb-2" size={28} />
                  <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">Update Portrait</span>
                  <input id="portrait-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-[4.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-700"></div>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles size={14} className="text-amber-500" />
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Elite Tier Member</p>
              </div>
              <h1 className="text-6xl font-black text-slate-950 tracking-tighter uppercase leading-[0.85]">
                {userData.name?.split(' ')[0] || "Client"}<br />
                <span className="text-slate-300 font-light italic">{userData.name?.split(' ')[1] || "Member"}</span>
              </h1>
            </div>
          </div>

          <div className="flex gap-16 bg-slate-50/80 backdrop-blur-sm p-8 rounded-[3rem] border border-white shadow-sm">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Acquisitions</p>
              <p className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{orders.length}</p>
            </div>
            <div className="w-px bg-slate-200 h-10 self-center"></div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Saved Pieces</p>
              <p className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{wishlist.length}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-20">

          {/* --- SIDE NAVIGATION --- */}
          <aside className="lg:col-span-3">
            <nav className="flex flex-col space-y-3 sticky top-32">
              <SidebarLink icon={<User size={18} />} label="Identity Details" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
              <SidebarLink icon={<Package size={18} />} label="The Manifest" active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
              <SidebarLink icon={<Heart size={18} />} label="Private Vault" active={activeTab === "wishlist"} onClick={() => setActiveTab("wishlist")} />
              <div className="pt-10 mt-10 border-t border-slate-100">
                <button className="flex items-center gap-4 px-8 text-slate-400 hover:text-rose-600 transition-colors duration-300">
                  <XCircle size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* --- CONTENT ENGINE --- */}
          <div className="lg:col-span-9 text-left">

            {activeTab === "profile" && (
              <div className="animate-in fade-in slide-in-from-right-10 duration-1000 space-y-20">
                <section>
                  <SectionTitle title="Client Credentials" />
                  <div className="grid md:grid-cols-2 gap-16 mt-12">
                    <ProfileInput label="Full Signature Name" name="name" value={userData.name} onChange={handleChange} />
                    <ProfileInput label="Registered Email" name="email" value={userData.email} readonly />
                    <ProfileInput label="Primary Contact" name="phone" value={userData.phone} onChange={handleChange} />
                  </div>
                </section>

                <section>
                  <SectionTitle title="Shipping & Logistics" />
                  <div className="mt-12 space-y-12">
                    <ProfileInput label="Street Registry" name="address" value={userData.address} onChange={handleChange} />
                    <div className="grid md:grid-cols-4 gap-12"> {/* Changed to grid-cols-4 to fit State */}
                      <ProfileInput label="City" name="city" value={userData.city} onChange={handleChange} />
                      <ProfileInput label="State/Province" name="state" value={userData.state} onChange={handleChange} />
                      <ProfileInput label="Postal Code" name="pincode" value={userData.pincode} onChange={handleChange} />
                      <ProfileInput label="Country" name="country" value={userData.country} onChange={handleChange} />
                    </div>
                  </div>
                </section>

                <div className="flex justify-end pt-10">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="group px-14 py-6 bg-slate-950 text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-5 hover:bg-amber-600 transition-all duration-700 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] disabled:bg-slate-200"
                  >
                    {loading ? "Synchronizing..." : <>Sync Changes <Save size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <SectionTitle title="The Manifest Archive" />
                <div className="mt-12 space-y-8">
                  {orders.length === 0 ? (
                    <EmptyState icon={<Box size={40} />} message="No transaction history discovered." />
                  ) : (
                    orders.map((order) => (
                      <div key={order._id} className="group bg-white rounded-[3.5rem] p-10 border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-700 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-10">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 text-white flex items-center justify-center font-black italic text-xl">
                            {order.status.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Ref: {order._id.slice(-6).toUpperCase()}</span>
                              <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {order.status}
                              </span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-950 tracking-tighter italic leading-none">₹{order.total.toLocaleString()}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{new Date(order.createdAt).toDateString()}</p>
                          </div>
                        </div>
                        <button onClick={() => setModalOrder(order)} className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all duration-500 group">
                          View Details <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                <SectionTitle title="The Private Vault" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {wishlist.length === 0 ? (
                    <div className="col-span-full">
                      <EmptyState icon={<Heart size={40} />} message="Your private vault is currently vacant." />
                    </div>
                  ) : (
                    wishlist.map((product) => (
                      <div key={product._id} className="group bg-white rounded-[3.5rem] p-6 border border-slate-50 hover:border-slate-200 hover:shadow-2xl transition-all duration-1000 flex items-center gap-8">
                        <div className="w-32 h-44 rounded-[2.5rem] overflow-hidden bg-slate-50 flex-shrink-0 relative">
                          <img src={product.image[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="flex-grow text-left">
                          <div className="flex justify-between items-start mb-4">
                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">{product.category || "Piece"}</p>
                            <button onClick={() => removeFromWishlist(product._id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <h3 className="text-2xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-2">{product.name}</h3>
                          <p className="text-2xl font-black text-slate-950 tracking-tighter italic">₹{product.price.toLocaleString()}</p>
                          <button
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 border-b-2 border-slate-950 pb-1 hover:text-amber-600 hover:border-amber-600 transition-all duration-500 group"
                          >
                            Acquire Piece <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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

      {/* --- ORDER MODAL (Remains Similar but Polished) --- */}
      {modalOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setModalOrder(null)}></div>
          <div className="relative bg-white rounded-[5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Left Panel */}
            <div className="w-full md:w-96 bg-slate-50 p-16 flex flex-col justify-between border-r border-slate-100 text-left">
              <div className="space-y-16">
                <button onClick={() => setModalOrder(null)} className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-950 transition-colors">
                  <X size={24} />
                </button>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em]">Manifest Status</p>
                  <h4 className="text-5xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">{modalOrder.status}</h4>
                </div>
                <div className="space-y-10">
                  <ModalStat icon={<Calendar size={16} />} label="Date Registered" value={new Date(modalOrder.createdAt).toLocaleDateString()} />
                  <ModalStat icon={<Truck size={16} />} label="Shipping Logistics" value="Priority Express" />
                  <ModalStat icon={<CreditCard size={16} />} label="Settlement" value="Verified Payment" />
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex-grow p-16 md:p-24 overflow-y-auto">
              <div className="flex justify-between items-start mb-20">
                <h3 className="text-6xl font-black text-slate-950 tracking-tighter uppercase leading-none">Registry<br />Manifest</h3>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tracking ID</p>
                  <p className="text-xl font-bold text-slate-950 tracking-tight italic uppercase">#{modalOrder._id}</p>
                </div>
              </div>
              <div className="space-y-12">
                {modalOrder.items.map((item) => (
                  <div key={item._id} className="flex gap-12 items-center">
                    <div className="w-28 h-28 bg-slate-100 rounded-[2.5rem] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex justify-between items-center">
                      <div className="space-y-3 text-left">
                        <p className="font-black text-slate-950 uppercase tracking-tighter text-2xl leading-none">{item.name}</p>
                        <div className="flex gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <span>Size: {item.selectedSize || 'N/A'}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-3xl font-black text-slate-950 tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-24 pt-12 border-t-4 border-slate-950 flex justify-between items-end">
                <div className="text-left">
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Total Valuation</p>
                  <p className="text-sm text-slate-400 italic">Insurance and global duty included.</p>
                </div>
                <p className="text-7xl font-black text-slate-950 tracking-tighter italic leading-none">₹{modalOrder.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const SidebarLink = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-6 px-10 py-6 rounded-[2.5rem] transition-all duration-700 group ${active ? 'bg-slate-950 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-950 hover:bg-slate-50'}`}>
    <span className={active ? "text-amber-500 scale-110" : "group-hover:text-amber-600 transition-colors"}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-[0.3em]">{label}</span>
  </button>
);

const SectionTitle = ({ title }) => (
  <div className="flex items-center gap-8">
    <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-amber-600 whitespace-nowrap leading-none">{title}</h3>
    <div className="h-px bg-slate-100 w-full"></div>
  </div>
);

const ProfileInput = ({ label, name, value, onChange, readonly }) => (
  <div className="group space-y-4">
    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-focus-within:text-amber-600 transition-colors duration-500">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readonly}
      className={`w-full bg-transparent border-b-2 border-slate-100 py-4 text-xl font-black tracking-tight text-slate-950 focus:outline-none focus:border-slate-950 transition-all duration-500 placeholder:text-slate-100 ${readonly ? 'opacity-30 cursor-not-allowed italic' : ''}`}
    />
  </div>
);

const ModalStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-5">
    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-slate-950">{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-2">{label}</p>
      <p className="text-[13px] font-black text-slate-950 tracking-tight leading-none uppercase">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-[5rem] bg-slate-50/50">
    <div className="text-slate-200 flex justify-center mb-8 scale-150">{icon}</div>
    <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] italic">{message}</p>
  </div>
)


export default Profile;