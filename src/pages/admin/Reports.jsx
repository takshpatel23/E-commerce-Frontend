import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid 
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, Layers, Award, 
  ShoppingCart, Zap, Shield 
} from "lucide-react";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("${import.meta.env.VITE_API_URL}/api/reports/advanced-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Nexus Data Sync Failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Synchronizing Nexus Intelligence...</p>
    </div>
  );

  const statusData = [
    { name: 'APPROVED', value: data.metrics.approvedCount || 0, color: '#f59e0b' },
    { name: 'REJECTED', value: data.metrics.rejectedCount || 0, color: '#0f172a' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-slate-900 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-600">Nexus Intelligence / 2026-27</h4>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">
            Market<br/><span className="text-slate-200">Analysis</span>
          </h1>
        </div>
        
        <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Status</p>
          <p className="text-xl font-black italic tracking-tighter text-amber-500 flex items-center gap-3">
            Verified & Active <Shield size={20} className="text-white fill-white/10" />
          </p>
        </div>
      </div>

      {/* --- KPI SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100 pb-12">
        <Metric label="Settled Capital" value={`₹${data.metrics.completedRevenue.toLocaleString()}`} trend="+12.4%" positive={true} />
        <Metric label="Deficit (Rejected)" value={`₹${data.metrics.lostRevenue.toLocaleString()}`} trend="-2.1%" positive={false} />
        <Metric label="Market Potential" value={`₹${data.metrics.totalPotential.toLocaleString()}`} trend="Gross" positive={true} />
      </div>

      {/* --- MAIN ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* REVENUE FLOW - FIXED HEIGHT WRAPPER */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-amber-500 pl-4">Revenue Trajectory</h3>
          <div className="min-h-[400px] w-full bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
            <ResponsiveContainer width="100%" height={350} debounce={100}>
              <AreaChart data={data.daily}>
                <defs>
                  <linearGradient id="nexusAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" hide />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: '900'}} />
                <Area type="step" dataKey="revenue" stroke="#f59e0b" strokeWidth={4} fill="url(#nexusAmber)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDER INTEGRITY - ASPECT RATIO FIXED */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-slate-900 pl-4">Order Integrity</h3>
          <div className="min-h-[400px] flex flex-col items-center justify-center border border-slate-100 rounded-3xl bg-white shadow-sm overflow-hidden">
            <ResponsiveContainer width="100%" aspect={1} debounce={100}>
              <PieChart>
                <Pie data={statusData} innerRadius="65%" outerRadius="85%" paddingAngle={4} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-10 pb-8 mt-[-40px]">
              {statusData.map(s => (
                <div key={s.name} className="text-center">
                  <p className="text-[9px] font-black text-slate-400 mb-1 tracking-widest">{s.name}</p>
                  <p className="text-2xl font-black tracking-tighter text-slate-900">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCT EXCELLENCE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Layers className="text-amber-500" size={24} />
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Unit Leaders</h3>
          </div>
          <div className="space-y-5">
            {data.topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between group border-b border-slate-50 pb-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-black text-slate-200">0{i+1}</span>
                  <span className="text-lg font-bold text-slate-700 group-hover:text-amber-500 transition-colors">{product.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-1.5 bg-slate-100 w-32 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-900 group-hover:bg-amber-500 transition-all duration-500" style={{ width: `${(product.count / data.topProducts[0].count) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-black w-8 text-slate-900">{product.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAPITAL DOMINANCE - FIXED HEIGHT BAR CHART */}
        <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden shadow-2xl min-h-[400px]">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Award className="text-amber-500" size={24} />
               <h3 className="text-2xl font-black uppercase tracking-tighter italic">Capital Dominance</h3>
            </div>
            <Zap size={20} className="text-amber-500 animate-pulse fill-amber-500" />
          </div>
          <div className="relative z-10 h-64">
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <BarChart data={data.topProducts}>
                <XAxis dataKey="name" hide />
                <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px'}} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 6, 6]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ShoppingCart className="absolute -bottom-10 -right-10 text-white/5" size={250} />
        </div>
      </div>

      {/* --- FISCAL PROJECTION - ASPECT RATIO CONTROL --- */}
      <div className="border-t border-slate-900 pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900">Fiscal Projection</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Annualized Revenue Comparison</p>
          </div>
          <div className="px-8 py-3 bg-amber-500 text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-xl">
            Nexus Stability: 100%
          </div>
        </div>
        <div className="w-full bg-white rounded-3xl overflow-hidden min-h-[400px]">
          <ResponsiveContainer width="100%" aspect={window.innerWidth > 768 ? 2.5 : 1.2} debounce={100}>
            <BarChart data={data.monthly}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#0f172a', fontSize: 12, fontWeight: 900}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
              <Bar dataKey="revenue" fill="#0f172a" radius={[15, 15, 0, 0]} barSize={window.innerWidth > 768 ? 80 : 30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

const Metric = ({ label, value, trend, positive }) => (
  <div className="px-8 py-10 md:py-6 flex flex-col items-start text-left group hover:bg-slate-50 transition-colors duration-300">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">{label}</p>
    <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-3 text-slate-900">{value}</h2>
    <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
      {trend} {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
    </div>
  </div>
);

export default Reports;