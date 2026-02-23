import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Mail, Phone, MapPin, Briefcase, Globe, Home, Hash, ShieldCheck } from "lucide-react";

const ViewUsers = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]); // Initialized as array
  const [loading, setLoading] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // FIX 1: Use backticks (`) for template literals
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // FIX 2: Defensive check for API response structure
      // If your API returns { users: [...] }, use res.data.users
      const userData = Array.isArray(res.data) ? res.data : (res.data.users || []);
      setUsers(userData);
      
    } catch (err) {
      console.error("Fetch error:", err);
      // Ensure state remains an array on error to prevent .map() crash
      setUsers([]);
      alert("Failed to fetch users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-left">
      <div className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Users Directory</h2>
            <p className="text-slate-500 mt-1">Manage and view all registered system members.</p>
          </div>
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
            {users?.length || 0} Total Users
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : !Array.isArray(users) || users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-lg">No users found in the database.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => setModalUser(user)}
                className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                      {user.profileImage ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                          alt={user.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-600 font-bold text-xl uppercase">
                          {user.name ? user.name[0] : "?"}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                      {user.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Mail size={14} /> {user.email}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <ShieldCheck size={14} className="text-amber-500" /> {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-8 px-6">
                   <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</p>
                      <p className="text-sm text-slate-600 font-medium">{user.city || 'N/A'}, {user.country || 'N/A'}</p>
                   </div>
                   <button className="bg-slate-50 text-slate-400 group-hover:bg-amber-500 group-hover:text-white p-2.5 rounded-xl transition-all">
                      <Briefcase size={20} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            <div className="md:w-1/3 bg-slate-900 p-10 text-center flex flex-col items-center justify-center relative">
              <button onClick={() => setModalUser(null)} className="absolute top-6 left-6 text-slate-400 hover:text-white md:hidden">
                <X size={24} />
              </button>
              
              <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl mb-6 ring-4 ring-amber-500/20">
                <img
                  src={modalUser.profileImage ? `${import.meta.env.VITE_API_URL}${modalUser.profileImage}` : "https://via.placeholder.com/300"}
                  alt={modalUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{modalUser.name}</h2>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                {modalUser.role}
              </span>
            </div>

            <div className="md:w-2/3 p-10 md:p-14 relative bg-white">
              <button onClick={() => setModalUser(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 hidden md:block">
                <X size={28} />
              </button>

              <div className="mb-10 text-left">
                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Home size={16} /> Contact & Address
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                  <InfoBlock label="Full Address" value={modalUser.address} />
                  <InfoBlock label="City" value={modalUser.city} />
                  <InfoBlock label="State / Province" value={modalUser.state} />
                  <InfoBlock label="Pincode" value={modalUser.pincode} />
                  <InfoBlock label="Country" value={modalUser.country} />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setModalUser(null)}
                  className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-slate-700 font-semibold pb-1">{value || "—"}</p>
  </div>
);

export default ViewUsers;