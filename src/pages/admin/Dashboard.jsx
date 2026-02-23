import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Package, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, 
  MoreHorizontal, Calendar, X, Search, ChevronRight, AlertCircle, XCircle, Clock
} from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [dailyGoal, setDailyGoal] = useState(Number(localStorage.getItem("dailyGoal")) || 50000);
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoal);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showModal]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        
        // FIXED: Using backticks (`) instead of double quotes (") for URLs
        const [prodRes, userRes, orderRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/data`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers })
        ]);

        // DATA DEFENSE: Ensure we always extract the array from the response
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || prodRes.data.data || []);
        const userData = Array.isArray(userRes.data) ? userRes.data : (userRes.data.users || userRes.data.data || []);
        const orderData = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.orders || orderRes.data.data || []);

        setProducts(prodData);
        setUsers(userData);
        setOrders(orderData);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
        setLoading(false);
      }
    };
    if (token) fetchDashboardData();
  }, [token]);

  // --- REVENUE LOGIC (With Safety Checks) ---
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  const successfulOrders = safeOrders.filter(o => o.status !== "Cancelled");
  const cancelledOrders = safeOrders.filter(o => o.status === "Cancelled");
  const pendingOrders = safeOrders.filter(o => o.status === "Pending" || o.status === "pending");

  const totalRevenue = successfulOrders.reduce((acc, order) => acc + (order.total || 0), 0);
  const cancelledAmount = cancelledOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  const today = new Date().toISOString().split("T")[0];
  const todayOrders = successfulOrders.filter(o => o.createdAt?.startsWith(today));
  const todayRevenue = todayOrders.reduce((acc, order) => acc + (order.total || 0), 0);
  const dailyOrdersCount = todayOrders.length;
  const progressPercentage = dailyGoal > 0 ? Math.min(Math.round((todayRevenue / dailyGoal) * 100), 100) : 0;

  const handleSetGoal = () => {
    setDailyGoal(Number(tempGoal));
    localStorage.setItem("dailyGoal", tempGoal);
    setShowGoalInput(false);
  };

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const recentTransactionsAll = safeOrders
    .filter(order => new Date(order.createdAt) >= twoDaysAgo)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredTransactions = recentTransactionsAll.filter(order => 
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">Syncing Neural Link...</p>
    </div>
  );

  return (
    <div className="w-full space-y-10 p-4 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Executive <span className="text-indigo-600">Console</span></h1>
          <p className="text-slate-400 mt-1 font-bold text-xs uppercase tracking-widest">Real-time performance metrics.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
          <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition">Export CSV</button>
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-xl shadow-lg shadow-slate-200">
            <Calendar size={14} /> Feb 2026
          </div>
        </div>
      </div>

      {/* PRIMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Inventory" value={products.length} change="+12%" icon={<Package size={22}/>} color="bg-amber-500" />
        <StatCard title="Active Users" value={users.length} change="+5%" icon={<Users size={22}/>} color="bg-indigo-500" />
        <StatCard title="Daily Success" value={dailyOrdersCount} change="Live" icon={<ShoppingCart size={22}/>} color="bg-slate-900" />
        <StatCard title="Net Revenue" value={`₹${totalRevenue.toLocaleString()}`} change="Verified" icon={<TrendingUp size={22}/>} color="bg-emerald-500" />
      </div>

      {/* SECONDARY TRACKING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MiniStatCard label="Pending Queue" value={pendingOrders.length} icon={<Clock size={18} />} color="text-amber-600 bg-amber-50" />
        <MiniStatCard label="Cancelled Orders" value={cancelledOrders.length} icon={<XCircle size={18} />} color="text-rose-600 bg-rose-50" />
        <MiniStatCard label="Lost Revenue" value={`₹${cancelledAmount.toLocaleString()}`} icon={<AlertCircle size={18} />} color="text-slate-400 bg-slate-50" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Live Transaction Feed</h2>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {recentTransactionsAll.length > 0 ? (
                  recentTransactionsAll.slice(0, 6).map((order) => (
                    <OrderRow key={order._id} order={order} />
                  ))
                ) : (
                  <tr><td className="p-10 text-center text-slate-400 font-bold italic">No recent activity detected.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
            <button onClick={() => setShowModal(true)} className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center justify-center gap-2 mx-auto hover:gap-4 transition-all">
              Launch Archive Viewer <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* GROWTH SECTION */}
        <div className="space-y-6">
          <div className={`relative overflow-visible rounded-[2.5rem] p-9 transition-all duration-700 shadow-2xl ${progressPercentage >= 100 ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-900 shadow-slate-300'}`}>
            <div className="relative z-10 text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Today's Objective</p>
                   <h3 className="text-2xl font-black tracking-tight uppercase">Revenue Goal</h3>
                </div>
                <div className="relative">
                  <button onClick={() => setShowGoalInput(!showGoalInput)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition">
                    <MoreHorizontal size={20} />
                  </button>
                  {showGoalInput && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-[2rem] shadow-2xl p-6 z-[50] animate-in zoom-in-95 border border-slate-100">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Target Amount (₹)</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-black text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                        value={tempGoal}
                        onChange={(e) => setTempGoal(e.target.value)}
                      />
                      <button onClick={handleSetGoal} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">Update Strategy</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between mb-3">
                <span className="text-5xl font-black italic tracking-tighter">₹{todayRevenue.toLocaleString()}</span>
                <span className="text-[10px] font-black text-white/40 mb-2 uppercase">Target: ₹{Number(dailyGoal).toLocaleString()}</span>
              </div>

              <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-6">
                <div className={`h-full rounded-full transition-all duration-1000 ${progressPercentage >= 100 ? 'bg-white' : 'bg-indigo-400'}`} style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
                <span className="bg-white/10 px-3 py-1 rounded-full">{progressPercentage}% Complete</span>
                {progressPercentage < 100 && <span className="text-white/40 italic">Gap: ₹{Math.max(0, dailyGoal - todayRevenue).toLocaleString()}</span>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl text-left">
             <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">Management Tools</h3>
             <div className="grid grid-cols-2 gap-4">
                <ActionButton label="Stock Entry" color="bg-indigo-50 text-indigo-600" />
                <ActionButton label="Print Reports" color="bg-slate-50 text-slate-600" />
             </div>
          </div>
        </div>
      </div>

      {/* --- SLIDE-OVER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-10 bg-white border-b border-slate-50">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-300"><X size={20} /></button>
                <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">48H Sync Active</div>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-8 italic">Manifest <span className="text-indigo-600">History</span></h2>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Search Ref ID or Client..." 
                  className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-50 rounded-[1.5rem] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-4 scrollbar-hide">
              {filteredTransactions.map((order) => (
                <div key={order._id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex justify-between items-center hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${order.status?.toLowerCase() === 'completed' ? 'bg-emerald-500 shadow-emerald-100' : order.status?.toLowerCase() === 'cancelled' ? 'bg-rose-500 shadow-rose-100' : 'bg-amber-500 shadow-amber-100'}`}>
                        <ShoppingCart size={22} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{order.userName}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest mt-0.5">#{order._id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 tracking-tighter italic">₹{order.total?.toLocaleString()}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${order.status?.toLowerCase() === 'completed' ? 'text-emerald-500' : order.status?.toLowerCase() === 'cancelled' ? 'text-rose-500' : 'text-amber-500'}`}>
                        {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- HELPER COMPONENTS --- */
const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl text-left hover:scale-[1.02] transition-all duration-500">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-[1.2rem] text-white shadow-lg ${color}`}>{icon}</div>
      <div className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
        {change}
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
    <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">{value}</h2>
  </div>
);

const MiniStatCard = ({ label, value, icon, color }) => (
    <div className={`p-5 rounded-[2rem] flex items-center gap-4 border border-slate-50 shadow-sm bg-white`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div className="text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </div>
);

const OrderRow = ({ order }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order._id?.slice(-6)}</td>
    <td className="px-8 py-6 text-sm text-slate-900 font-bold uppercase tracking-tight">{order.userName}</td>
    <td className="px-8 py-6 font-black text-lg italic tracking-tighter text-slate-900">₹{order.total?.toLocaleString()}</td>
    <td className="px-8 py-6 text-right">
       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
           order.status?.toLowerCase() === 'completed' ? 'text-emerald-500 border-emerald-50 bg-emerald-50/30' : 
           order.status?.toLowerCase() === 'cancelled' ? 'text-rose-500 border-rose-50 bg-rose-50/30' : 
           'text-amber-500 border-amber-50 bg-amber-50/30'
       }`}>
           {order.status}
       </span>
    </td>
  </tr>
);

const ActionButton = ({ label, color }) => (
  <button className={`py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all ${color}`}>
      {label}
  </button>
);

export default Dashboard;