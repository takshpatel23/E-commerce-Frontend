import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid 
} from "recharts";
import { 
  ArrowUpRight, ArrowDownRight, Layers, Award, 
  ShoppingCart, Zap, Shield, AlertTriangle, Activity,
  Maximize2, ChevronRight, Globe
} from "lucide-react";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports/advanced-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Nexus Data Sync Failed", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <div className="relative">
        <div className="w-14 h-14 border-[3px] border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
        <Activity className="absolute inset-0 m-auto text-amber-500 animate-pulse" size={18} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Calibrating Nexus Core</p>
    </div>
  );

  if (!data || !data.metrics) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-slate-400">
      <div className="p-8 bg-slate-50 rounded-[3rem]">
        <AlertTriangle size={48} strokeWidth={1.5} className="text-rose-500" />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.4em]">Intelligence Feed Offline</p>
        <p className="text-xs font-bold mt-2 opacity-60 uppercase">Check API Uplink Status</p>
      </div>
    </div>
  );

  const statusData = [
    { name: 'APPROVED', value: data.metrics.approvedCount || 0, color: '#f59e0b' },
    { name: 'REJECTED', value: data.metrics.rejectedCount || 0, color: '#0f172a' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 p-6 lg:p-10 text-left">
      
      {/* --- EXECUTIVE HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b-[6px] border-slate-950 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
              Live Feed
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
              <Globe size={12} /> Global Intelligence / Q1 2026
            </h4>
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-slate-950 italic">
            Market<br/><span className="text-slate-200 not-italic">Analysis</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-4">
            <div className="bg-slate-950 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex items-center gap-8 group hover:bg-indigo-600 transition-colors duration-500">
              <div>
                <p className="text-[9px] font-bold text-slate-500 group-hover:text-white/60 uppercase tracking-[0.2em] mb-1">Nexus Status</p>
                <p className="text-2xl font-black italic tracking-tighter text-amber-500 group-hover:text-white">Active Uplink</p>
              </div>
              <Shield size={32} className="text-white opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
      </div>

      {/* --- KPI SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-100 rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-slate-200/50">
        <Metric label="Settled Capital" value={`₹${(data.metrics.completedRevenue || 0).toLocaleString()}`} trend="+14.2%" positive={true} />
        <Metric label="Deficit Flux" value={`₹${(data.metrics.lostRevenue || 0).toLocaleString()}`} trend="-1.8%" positive={false} isCenter={true} />
        <Metric label="Market Potential" value={`₹${(data.metrics.totalPotential || 0).toLocaleString()}`} trend="Stable" positive={true} />
      </div>

      {/* --- MAIN ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 border-l-4 border-amber-500 pl-6">Revenue Trajectory</h3>
            <Maximize2 size={16} className="text-slate-300 hover:text-slate-950 cursor-pointer transition-colors" />
          </div>
          <div className="h-[450px] w-full bg-slate-50/50 rounded-[3.5rem] p-10 border border-slate-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={200} />
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily || []}>
                <defs>
                  <linearGradient id="nexusAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#f59e0b', strokeWidth: 2 }}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', padding: '20px'}}
                  itemStyle={{fontWeight: '900', textTransform: 'uppercase', fontSize: '12px'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={5} fill="url(#nexusAmber)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950 border-l-4 border-slate-950 pl-6">Order Integrity</h3>
          <div className="h-[450px] flex flex-col items-center justify-center border border-slate-100 rounded-[3.5rem] bg-white shadow-2xl shadow-slate-200/50 relative">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={statusData} innerRadius="60%" outerRadius="80%" paddingAngle={8} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-12 pb-12 w-full">
              {statusData.map(s => (
                <div key={s.name} className="text-center group cursor-default">
                  <p className="text-[10px] font-black text-slate-400 mb-2 tracking-[0.2em] group-hover:text-slate-950 transition-colors">{s.name}</p>
                  <p className="text-4xl font-black tracking-tighter text-slate-950 italic">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- PRODUCT EXCELLENCE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <Layers className="text-amber-500" size={24} />
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">Unit Leaders</h3>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">View All Metrics</button>
          </div>
          
          <div className="space-y-8">
            {(data.topProducts || []).map((product, i) => (
              <div key={i} className="group relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-black text-slate-200 italic">#{i+1}</span>
                    <span className="text-xl font-black text-slate-800 uppercase tracking-tight group-hover:text-amber-500 transition-colors cursor-default">{product.name}</span>
                  </div>
                  <span className="text-lg font-black text-slate-950 italic tracking-tighter">{product.count} <span className="text-[10px] not-italic text-slate-400 ml-1 font-bold">UNITS</span></span>
                </div>
                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-950 group-hover:bg-amber-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                    style={{ width: `${(product.count / (data.topProducts[0]?.count || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 text-white p-16 rounded-[4rem] space-y-12 relative overflow-hidden shadow-3xl min-h-[500px] flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Award className="text-amber-500" size={32} />
               <h3 className="text-3xl font-black uppercase tracking-tighter italic">Capital Dominance</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Zap size={24} className="text-amber-500 animate-pulse fill-amber-500" />
            </div>
          </div>
          
          <div className="relative z-10 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts || []}>
                <XAxis dataKey="name" hide />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '16px', padding: '15px'}} 
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[12, 12, 12, 12]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="relative z-10 flex justify-between items-center pt-8 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Performance Index: Alpha</p>
             <ChevronRight className="text-white/20" />
          </div>
          
          <ShoppingCart className="absolute -bottom-20 -right-20 text-white/[0.02]" size={400} />
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const Metric = ({ label, value, trend, positive, isCenter }) => (
  <div className={`px-12 py-14 flex flex-col items-start text-left group hover:bg-slate-50 transition-all duration-500 ${isCenter ? 'border-y md:border-y-0 md:border-x border-slate-100' : ''}`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 group-hover:text-amber-600 transition-colors">{label}</p>
    <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-4 text-slate-950 italic leading-none">{value}</h2>
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${positive ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'}`}>
      {trend} {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
    </div>
  </div>
);

export default Reports;