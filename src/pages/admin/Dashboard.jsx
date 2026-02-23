import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Package, Users, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, 
  MoreHorizontal, Calendar, X, Search, ChevronRight, AlertCircle, XCircle, Clock,
  ArrowRight, Download, Zap
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
    document.body.style.overflow = showModal ? 'hidden' : 'unset';
  }, [showModal]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        
        const [prodRes, userRes, orderRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/products`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/users/data`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, { headers })
        ]);

        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || []);
        const userData = Array.isArray(userRes.data) ? userRes.data : (userRes.data.users || []);
        const orderData = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.orders || []);

        setProducts(prodData);
        setUsers(userData);
        setOrders(orderData);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDashboardData();
  }, [token]);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const successfulOrders = safeOrders.filter(o => o.status !== "Cancelled");
  const cancelledOrders = safeOrders.filter(o => o.status === "Cancelled");
  const pendingOrders = safeOrders.filter(o => o.status?.toLowerCase() === "pending");

  const totalRevenue = successfulOrders.reduce((acc, order) => acc + (order.total || 0), 0);
  const cancelledAmount = cancelledOrders.reduce((acc, order) => acc + (order.total || 0), 0);

  const today = new Date().toISOString().split("T")[0];
  const todayOrders = successfulOrders.filter(o => o.createdAt?.startsWith(today));
  const todayRevenue = todayOrders.reduce((acc, order) => acc + (order.total || 0), 0);
  const progressPercentage = dailyGoal > 0 ? Math.min(Math.round((todayRevenue / dailyGoal) * 100), 100) : 0;

  const handleSetGoal = () => {
    setDailyGoal(Number(tempGoal));
    localStorage.setItem("dailyGoal", tempGoal);
    setShowGoalInput(false);
  };

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-[3px] border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
        <Zap className="absolute inset-0 m-auto text-amber-500 animate-pulse" size={20} />
      </div>
      <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.5em]">Establishing Neural Link</p>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-left">
        <div>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
            Executive <span className="text-indigo-600 not-italic">Console</span>
          </h1>
          <div className="flex items-center gap-3 mt-3">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
             <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Real-time Performance Manifest</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition">
            <Download size={14} /> Report.pdf
          </button>
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-950 text-white rounded-2xl shadow-2xl shadow-slate-200">
            <Calendar size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Feb 2026 / Q1</span>
          </div>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Global Inventory" value={products.length} change="+12.5%" icon={<Package size={22}/>} color="bg-amber-500" />
        <StatCard title="Client Base" value={users.length} change="+4.2%" icon={<Users size={22}/>} color="bg-indigo-600" />
        <StatCard title="Daily Throughput" value={todayOrders.length} change="Live" icon={<ShoppingCart size={22}/>} color="bg-slate-950" />
        <StatCard title="Gross Revenue" value={`₹${totalRevenue.toLocaleString()}`} change="Verified" icon={<TrendingUp size={22}/>} color="bg-emerald-600" />
      </div>

      {/* --- SUB-METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MiniStatCard label="Pending Approval" value={pendingOrders.length} icon={<Clock size={18} />} color="text-amber-600 bg-amber-50" />
        <MiniStatCard label="Voided Transactions" value={cancelledOrders.length} icon={<XCircle size={18} />} color="text-rose-600 bg-rose-50" />
        <MiniStatCard label="Recoverable Loss" value={`₹${cancelledAmount.toLocaleString()}`} icon={<AlertCircle size={18} />} color="text-slate-400 bg-slate-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        {/* --- TRANSACTION TABLE --- */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
             <h2 className="text-sm font-black text-slate-950 uppercase tracking-[0.3em]">Live Transaction Stream</h2>
             <button onClick={() => setShowModal(true)} className="p-3 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-xl transition-all">
                <Search size={18} />
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ref ID</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {safeOrders.slice(0, 5).map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full py-8 bg-slate-50/50 hover:bg-slate-50 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 transition-all flex items-center justify-center gap-3"
          >
            Access Full Archive <ArrowRight size={14} />
          </button>
        </div>

        {/* --- REVENUE STRATEGY --- */}
        <div className="lg:col-span-4 space-y-8">
          <div className={`rounded-[3rem] p-10 transition-all duration-700 shadow-2xl ${progressPercentage >= 100 ? 'bg-emerald-600 shadow-emerald-200' : 'bg-slate-950 shadow-slate-400/20'}`}>
            <div className="flex justify-between items-start mb-10 text-white">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Daily Directive</p>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">Target Velocity</h3>
              </div>
              <div className="relative">
                <button onClick={() => setShowGoalInput(!showGoalInput)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition">
                  <MoreHorizontal size={20} />
                </button>
                {showGoalInput && (
                  <div className="absolute right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl p-8 z-[50] animate-in zoom-in-95 border border-slate-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4 text-left">Adjust Target (₹)</label>
                    <input 
                      type="number" 
                      className="w-full p-5 bg-slate-50 rounded-2xl text-slate-950 font-black text-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                      value={tempGoal}
                      onChange={(e) => setTempGoal(e.target.value)}
                    />
                    <button onClick={handleSetGoal} className="w-full py-5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">Apply Strategy</button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-white mb-8">
              <span className="text-6xl font-black italic tracking-tighter block leading-none">₹{todayRevenue.toLocaleString()}</span>
              <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mt-4 block">Current Payload / Target ₹{Number(dailyGoal).toLocaleString()}</span>
            </div>

            <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-6 p-1">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${progressPercentage >= 100 ? 'bg-white' : 'bg-indigo-500'}`} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase text-white tracking-widest">
              <span className="px-4 py-1.5 bg-white/10 rounded-full italic">{progressPercentage}% Complete</span>
              {progressPercentage < 100 && <span className="opacity-40">Gap: ₹{(dailyGoal - todayRevenue).toLocaleString()}</span>}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl text-left">
             <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.3em]">Command Center</h3>
             <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center gap-3 py-8 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 rounded-[2rem] transition-all group">
                   <Package size={20} className="group-hover:scale-110 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-widest">New Stock</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 py-8 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[2rem] transition-all group">
                   <Users size={20} className="group-hover:scale-110 transition-transform" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Audit Users</span>
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- SIDE MANIFEST MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-12 border-b border-slate-50">
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setShowModal(false)} className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-slate-950 hover:text-white transition-all"><X size={24} /></button>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full uppercase tracking-widest">Full Ledger Sync</span>
              </div>
              <h2 className="text-5xl font-black text-slate-950 tracking-tighter uppercase italic leading-none mb-10">Global <br /><span className="text-indigo-600 not-italic">Manifest</span></h2>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="SEARCH REFERENCE OR CLIENT..." 
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] text-sm font-black focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-12 space-y-6 scrollbar-hide">
              {safeOrders.filter(o => o.userName?.toLowerCase().includes(searchTerm.toLowerCase())).map((order) => (
                <div key={order._id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex justify-between items-center hover:border-slate-300 transition-all shadow-sm hover:shadow-xl">
                  <div className="flex items-center gap-6 text-left">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white ${order.status?.toLowerCase() === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-950 uppercase italic tracking-tight">{order.userName}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1">REF: {order._id?.slice(-10).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-950 tracking-tighter italic">₹{order.total?.toLocaleString()}</p>
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${order.status?.toLowerCase() === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
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

/* --- UI COMPONENTS --- */
const StatCard = ({ title, value, change, icon, color }) => (
  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl text-left hover:translate-y-[-4px] transition-all duration-500 group">
    <div className="flex justify-between items-start mb-8">
      <div className={`p-5 rounded-[1.5rem] text-white shadow-2xl group-hover:scale-110 transition-transform ${color}`}>{icon}</div>
      <div className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
        {change}
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{title}</p>
    <h2 className="text-4xl font-black text-slate-950 italic tracking-tighter leading-none">{value}</h2>
  </div>
);

const MiniStatCard = ({ label, value, icon, color }) => (
    <div className={`p-6 rounded-[2.5rem] flex items-center gap-5 border border-slate-50 shadow-sm bg-white hover:shadow-md transition-shadow`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div className="text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
            <p className="text-xl font-black text-slate-950 tracking-tight">{value}</p>
        </div>
    </div>
);

const OrderRow = ({ order }) => (
  <tr className="hover:bg-slate-50/80 transition-all group">
    <td className="px-10 py-7 text-[10px] font-bold text-slate-400 tracking-widest">#{order._id?.slice(-8).toUpperCase()}</td>
    <td className="px-10 py-7 text-sm text-slate-950 font-black uppercase tracking-tighter italic">{order.userName}</td>
    <td className="px-10 py-7 font-black text-xl italic tracking-tighter text-slate-950">₹{order.total?.toLocaleString()}</td>
    <td className="px-10 py-7 text-right">
       <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 ${
           order.status?.toLowerCase() === 'completed' ? 'text-emerald-500 border-emerald-50 bg-emerald-50/20' : 
           'text-amber-500 border-amber-50 bg-amber-50/20'
       }`}>
           {order.status}
       </span>
    </td>
  </tr>
);

export default Dashboard;