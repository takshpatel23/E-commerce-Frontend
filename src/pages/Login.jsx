import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Lock, Mail, Loader2, ChevronLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      user.role === "admin" ? navigate("/admin/dashboard", { replace: true }) : navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: email.trim(),
        password,
      });

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        res.data.user.role === "admin" ? navigate("/admin/dashboard", { replace: true }) : navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Credentials not recognized.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* MOBILE HEADER: Minimal logo for mobile users */}
      <div className="lg:hidden flex items-center justify-between p-6">
        <Link to="/" className="text-sm font-black tracking-[0.3em] uppercase">The Archive</Link>
        <Link to="/" className="text-slate-400 hover:text-slate-950 transition-colors">
          <ChevronLeft size={20} />
        </Link>
      </div>

      {/* LEFT SIDE: Visual Brand Story (Hidden on small mobile, shown on large tablets/desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80" 
          alt="Luxury Interior" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 hover:scale-105 transition-all duration-[3s]"
        />
        <div className="relative z-10 flex flex-col justify-between p-20 w-full text-white">
          <Link to="/" className="text-2xl font-black tracking-[0.3em] uppercase">The Archive</Link>
          <div className="max-w-md">
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-6 italic font-light">
              Welcome <br /> Back.
            </h1>
            <p className="text-slate-300 font-light leading-relaxed tracking-wide text-lg">
              Access your personal collection and curated selections.
            </p>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
            © 2026 Archive Global Boutique
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Minimalist Entry Form */}
      <div className="flex-grow flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24">
        <div className="w-full max-w-sm space-y-10 md:space-y-12">
          
          <div className="space-y-3 md:space-y-4">
            <span className="text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Secure Access</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter uppercase leading-none">Identify Yourself</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Input */}
              <div className="group relative border-b border-slate-200 focus-within:border-slate-950 transition-all py-1 md:py-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-amber-600">Email Address</label>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 bg-transparent text-slate-950 font-bold text-sm md:text-base placeholder:text-slate-200 placeholder:font-light focus:outline-none"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group relative border-b border-slate-200 focus-within:border-slate-950 transition-all py-1 md:py-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-amber-600">Private Key</label>
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-slate-300 group-focus-within:text-slate-950 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 bg-transparent text-slate-950 font-bold text-sm md:text-base placeholder:text-slate-200 placeholder:font-light focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-slate-950 text-white py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-amber-600 transition-all duration-500 shadow-xl active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Authenticate <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-3 md:gap-4">
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
              New to the archive?
            </p>
            <Link
              to="/signup"
              className="text-slate-950 font-black uppercase tracking-widest text-[10px] md:text-[11px] hover:text-amber-600 transition-colors border-b-2 border-slate-950 hover:border-amber-600 pb-1"
            >
              Request Membership
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;