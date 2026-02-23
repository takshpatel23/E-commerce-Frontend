import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Mail, Phone, MapPin, Briefcase, Globe, Home, Hash, ShieldCheck, User as UserIcon, Loader2, ArrowRight, Activity } from "lucide-react";

const ViewUsers = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = Array.isArray(res.data) ? res.data : (res.data.users || res.data.data || []);
      setUsers(userData);
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
      // Using a modern subtle alert or notification would be better than window.alert
      console.error("Access Denied: Terminal Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans text-left animate-in fade-in duration-1000 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[6px] border-slate-950 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <Activity size={18} className="text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Security & Personnel</span>
            </div>
            <h2 className="text-7xl md:text-8xl font-black text-slate-950 tracking-tighter uppercase italic leading-[0.8]">
              Directory<span className="not-italic text-slate-200">.</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Authorized Personnel Registry // Level 4 Clearance</p>
          </div>
          
          <div className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl flex items-center gap-4">
            <span className="text-amber-500 text-2xl tracking-tighter italic">{users?.length || 0}</span>
            <span className="text-[10px] border-l border-white/20 pl-4 leading-tight">Verified<br/>Entities</span>
          </div>
        </div>

        {/* --- DIRECTORY FEED --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-6">
            <Loader2 className="animate-spin text-amber-500" size={40} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.6em]">Authenticating Archive...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-[4rem] py-40 text-center border-2 border-dashed border-slate-100">
             <UserIcon className="mx-auto text-slate-100 mb-8" size={100} strokeWidth={1} />
             <p className="text-slate-300 font-black text-xs uppercase tracking-[0.4em]">Zero Active Records Detected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => setModalUser(user)}
                className="group flex items-center justify-between bg-white p-6 md:p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:border-amber-100 transition-all duration-500 cursor-pointer overflow-hidden relative"
              >
                {/* Visual Background Element */}
                <div className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-slate-50 font-black text-9xl italic pointer-events-none group-hover:text-amber-50/50 transition-colors">
                  {user.role?.[0]}
                </div>

                <div className="flex items-center gap-8 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100 group-hover:scale-105 transition-transform duration-500">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage?.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_API_URL}${user.profileImage}`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=0f172a&bold=true`; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-950 font-black text-3xl uppercase italic">
                          {user.name ? user.name[0] : "?"}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-[4px] border-white rounded-full"></div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-950 group-hover:text-amber-500 transition-colors italic uppercase tracking-tighter">
                      {user.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Mail size={14} className="text-amber-500" /> {user.email}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-950 bg-slate-100 px-3 py-1 rounded-lg">
                        <ShieldCheck size={14} className="text-amber-500" /> {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-12 relative z-10">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Origin / Location</p>
                    <p className="text-sm text-slate-950 font-black uppercase italic tracking-tight">{user.city || 'N/A'}, {user.country || 'N/A'}</p>
                  </div>
                  <div className="w-16 h-16 bg-slate-50 group-hover:bg-amber-500 group-hover:text-white rounded-[1.5rem] transition-all duration-500 flex items-center justify-center shadow-inner">
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- PROFILE DATA MODAL --- */}
      {modalUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[4rem] shadow-3xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-500 relative border border-white/20">
            
            {/* Modal Sidebar */}
            <div className="md:w-[40%] bg-slate-950 p-12 text-center flex flex-col items-center justify-center relative">
              <button onClick={() => setModalUser(null)} className="absolute top-10 left-10 text-slate-500 hover:text-white md:hidden">
                <X size={28} />
              </button>

              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-[8px] border-slate-900 shadow-3xl mb-10 group/modal relative">
                <img
                  src={modalUser.profileImage?.startsWith('http') ? modalUser.profileImage : `${import.meta.env.VITE_API_URL}${modalUser.profileImage}`}
                  alt={modalUser.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/modal:scale-110"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${modalUser.name}&background=1e293b&color=ffffff&bold=true`; }}
                />
              </div>
              <h2 className="text-4xl font-black text-white mb-3 italic uppercase tracking-tighter leading-none">{modalUser.name}</h2>
              <div className="flex items-center gap-2">
                <span className="w-8 h-[1px] bg-amber-500"></span>
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">
                  {modalUser.role} Designation
                </span>
                <span className="w-8 h-[1px] bg-amber-500"></span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="md:w-[60%] p-12 md:p-24 relative bg-white flex flex-col justify-center">
              <button onClick={() => setModalUser(null)} className="absolute top-12 right-12 text-slate-300 hover:text-slate-950 hidden md:block transition-colors">
                <X size={32} />
              </button>

              <div className="space-y-12">
                <div>
                  <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                    <Home size={16} /> Contact Intelligence
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-16">
                    <InfoBlock label="Permanent Residence" value={modalUser.address} />
                    <InfoBlock label="Sovereign State" value={modalUser.country} />
                    <InfoBlock label="City Center" value={modalUser.city} />
                    <InfoBlock label="Postal Code" value={modalUser.pincode} />
                    <InfoBlock label="Regional Office" value={modalUser.state} />
                    <InfoBlock label="Global Identifier" value={modalUser._id} />
                  </div>
                </div>

                <div className="pt-12 border-t border-slate-50 flex justify-end">
                  <button
                    onClick={() => setModalUser(null)}
                    className="w-full md:w-auto px-12 py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-amber-500 transition-all duration-500 shadow-2xl active:scale-95"
                  >
                    Archive Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="space-y-2 group/info">
    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover/info:text-amber-500 transition-colors">{label}</p>
    <p className="text-slate-950 font-black text-xl uppercase italic tracking-tighter truncate">{value || "——"}</p>
  </div>
);

export default ViewUsers;