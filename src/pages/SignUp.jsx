import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration encountered an issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* --- LEFT SIDE: THE EDITORIAL VISUAL (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
          alt="Luxury Fabric" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 hover:scale-105 transition-all duration-[10s] ease-out"
        />
        
        <div className="relative z-20 flex flex-col justify-between p-20 w-full text-white">
          <Link to="/" className="text-xl font-black tracking-[0.4em] uppercase group flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white group-hover:w-12 transition-all" />
            The Archive
          </Link>
          
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">New Era</span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.85] mb-8">
              Join the <br />
              <span className="text-slate-400 italic font-light">Collective.</span>
            </h1>
            <p className="text-slate-300 font-light leading-relaxed tracking-wide text-sm border-l border-slate-700 pl-6">
              Create your account to unlock curated experiences, early access to new drops, and personalized tailoring services.
            </p>
          </div>
          
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">
            <span>© 2026 Archive Ltd.</span>
            <span>Bespoke Digital Experience</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: THE FORM ENGINE --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle background element for mobile flair */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl lg:hidden" />
        
        <div className="w-full max-w-sm space-y-12 relative z-10">
          
          <div className="space-y-4">
            <div className="lg:hidden mb-12">
               <Link to="/" className="text-lg font-black tracking-[0.3em] uppercase text-slate-950">The Archive</Link>
            </div>
            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em]">Membership Registry</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">Create Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-600 p-4 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Full Name */}
              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-amber-600 transition-colors">Client Identity</label>
                <div className="flex items-center gap-4 border-b-2 border-slate-100 group-focus-within:border-slate-950 transition-all py-3">
                  <User size={18} className="text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-slate-950 font-black tracking-tight placeholder:text-slate-200 placeholder:font-normal focus:outline-none text-lg"
                    placeholder="ALEXANDER MCQUEEN"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-amber-600 transition-colors">Digital Correspondence</label>
                <div className="flex items-center gap-4 border-b-2 border-slate-100 group-focus-within:border-slate-950 transition-all py-3">
                  <Mail size={18} className="text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-950 font-black tracking-tight placeholder:text-slate-200 placeholder:font-normal focus:outline-none text-lg"
                    placeholder="NAME@ARCHIVE.COM"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-amber-600 transition-colors">Private Access Key</label>
                <div className="flex items-center gap-4 border-b-2 border-slate-100 group-focus-within:border-slate-950 transition-all py-3">
                  <Lock size={18} className="text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-slate-950 font-black tracking-tight placeholder:text-slate-200 placeholder:font-normal focus:outline-none text-lg"
                    placeholder="********"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-slate-950 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-amber-600 transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] disabled:bg-slate-200 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Initialize Membership <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-10 border-t border-slate-50 flex flex-col items-center gap-6">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
              Existing Member?
            </p>
            <Link
              to="/login"
              className="text-slate-950 font-black uppercase tracking-[0.3em] text-[10px] group flex flex-col items-center"
            >
              Log in to Profile
              <div className="h-[2px] w-full bg-slate-950 mt-1 scale-x-50 group-hover:scale-x-100 transition-transform origin-center" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;