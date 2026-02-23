import React, { useEffect, useState, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, Package, Users, ShoppingCart, LogOut,
  Bell, Settings, BarChart3, Menu, X, Layers, Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import LuxuryToast from "../../components/LuxuryToast";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [hasUnread, setHasUnread] = useState(false);

  // Safely parse user data
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const token = localStorage.getItem("token");

  const showToast = (message, type = "success") => setToast({ show: true, message, type });

  // --- FETCH LOGIC WITH ERROR BOUNDARIES ---
  const fetchPendingOrders = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data && Array.isArray(data)) {
        const pending = data.filter(order => order?.status?.toLowerCase() === "pending");
        setPendingOrders(pending);
        setHasUnread(pending.length > 0);
      }
    } catch (error) {
      // Quietly handle Network Errors to prevent console spam
      if (!error.response) {
        console.warn("Backend unreachable. Check if server is running on port 5000.");
      } else if (error.response.status === 401) {
        handleLogout(); // Auto-logout if token is invalid
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000); // 30s interval
    return () => clearInterval(interval);
  }, [token, user?.role, navigate, fetchPendingOrders]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `relative flex items-center gap-4 px-5 py-3.5 text-sm font-semibold transition-all duration-300 rounded-xl group ${
      isActive
        ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden text-left relative">
      {toast.show && (
        <LuxuryToast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-80 p-6 transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="bg-white h-full rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
          <div className="px-8 pt-10 pb-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                <Package className="text-white" size={22} />
              </div>
              <span className="text-xl font-extrabold tracking-tight">Nexus<span className="text-amber-500">Admin</span></span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400">
               <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <p className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 mt-2">Core</p>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/dashboard" className={linkStyle}><LayoutDashboard size={20} /><span>Dashboard</span></NavLink>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/categories" className={linkStyle}><Layers size={20} /><span>Categories</span></NavLink>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/add-product" className={linkStyle}><PlusCircle size={20} /><span>Add Product</span></NavLink>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/products" className={linkStyle}><Package size={20} /><span>Inventory</span></NavLink>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/users" className={linkStyle}><Users size={20} /><span>User Base</span></NavLink>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/orders" className={linkStyle}><ShoppingCart size={20} /><span>Orders</span></NavLink>
            <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/reports" className={linkStyle}><BarChart3 size={20} /><span>Analytics</span></NavLink>
          </nav>

          <div className="p-4 mt-auto">
            {/* --- SAFE AVATAR RENDERING --- */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold border border-amber-200">
                {user?.image ? (
                   <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                   user?.name?.[0] || 'A'
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "Administrator"}</p>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Master Access</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-400 hover:text-rose-600 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-4 lg:pr-6 lg:py-6 lg:pl-0">
        <header className="h-20 bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between px-6 lg:px-10 mb-4 lg:mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl">
              <Menu size={20} />
            </button>
            <div className="flex flex-col text-left">
              <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Management</h2>
              <p className="text-sm font-bold text-slate-800 tracking-tight">{user?.name || "Administrator"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button onClick={() => { setHasUnread(false); navigate("/admin/notifications"); }} className="relative h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50">
                <Bell size={18} className={hasUnread ? "text-amber-500" : ""} />
                {hasUnread && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>}
             </button>
             <div className="h-6 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>
             <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase">System Online</span>
             </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto rounded-[2rem] bg-white border border-slate-100 shadow-inner p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminLayout;