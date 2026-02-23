import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

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
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
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
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: The Brand Aesthetic */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
          alt="Luxury Fabric" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 hover:scale-110 transition-all duration-[4s]"
        />
        <div className="relative z-10 flex flex-col justify-between p-20 w-full text-white">
          <Link to="/" className="text-2xl font-black tracking-[0.3em] uppercase">The Archive</Link>
          <div className="max-w-md">
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6">
              Join the <br />
              <span className="text-slate-300 italic font-light">Collective.</span>
            </h1>
            <p className="text-slate-400 font-light leading-relaxed tracking-wide">
              Create your account to unlock curated experiences, early access to new drops, and personalized tailoring services.
            </p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
            Bespoke Digital Experience 
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-sm space-y-12">
          
          <div className="space-y-4">
            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em]">Membership</span>
            <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">Create Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Full Name */}
              <div className="group relative border-b border-slate-200 focus-within:border-slate-950 transition-all py-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-amber-600">Full Name</label>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-slate-300" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2 bg-transparent text-slate-950 font-bold placeholder:text-slate-200 placeholder:font-light focus:outline-none"
                    placeholder="E.g. Alexander McQueen"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group relative border-b border-slate-200 focus-within:border-slate-950 transition-all py-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-amber-600">Email Address</label>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 bg-transparent text-slate-950 font-bold placeholder:text-slate-200 placeholder:font-light focus:outline-none"
                    placeholder="name@archive.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group relative border-b border-slate-200 focus-within:border-slate-950 transition-all py-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-amber-600">Create Private Key</label>
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-slate-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 bg-transparent text-slate-950 font-bold placeholder:text-slate-200 placeholder:font-light focus:outline-none"
                    placeholder="Min. 8 characters"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-slate-950 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-600 transition-all duration-500 shadow-2xl shadow-slate-200"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Initialize Membership <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Already a member?
            </p>
            <Link
              to="/login"
              className="text-slate-950 font-black uppercase tracking-widest text-[11px] hover:text-amber-600 transition-colors border-b-2 border-slate-950 hover:border-amber-600 pb-1"
            >
              Log in to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;