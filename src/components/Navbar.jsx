import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, Menu, X, Search, LogOut, Settings, ChevronRight } from "lucide-react";
import { setSearchQuery } from "../redux/productSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isHomePage = location.pathname === "/";
  
  // Logic for color transitions
  const navTextColor = scrolled || !isHomePage ? "text-slate-900" : "text-white";
  const navBgColor = scrolled 
    ? "bg-white/80 backdrop-blur-xl shadow-sm py-3" 
    : "bg-transparent py-5 md:py-8";

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out ${navBgColor}`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex justify-between items-center">
        
        {/* LEFT: LOGO */}
        <Link to="/" className={`text-xl md:text-2xl font-black tracking-tighter transition-colors duration-300 z-[160] ${isMenuOpen ? "text-slate-900" : navTextColor}`}>
          FASHION<span className="text-amber-500">STORE.</span>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center space-x-10">
          {["Home", "Product", "About"].map((item) => (
            <Link 
              key={item}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className={`relative text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-amber-500 group ${navTextColor}`}
            >
              {item === "Product" ? "Collection" : item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center space-x-3 md:space-x-6">
          
          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:block relative group">
            <input
              type="text"
              placeholder="Search..."
              className={`bg-transparent border-b transition-all duration-500 outline-none text-[12px] py-1 w-24 lg:w-32 focus:w-48 ${
                scrolled || !isHomePage ? "border-slate-300 focus:border-slate-900" : "border-white/30 focus:border-white"
              } ${navTextColor}`}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
            <Search className={`absolute right-0 top-1.5 h-3.5 w-3.5 opacity-50 ${navTextColor}`} />
          </div>

          {/* Cart Icon */}
          <button 
            onClick={() => navigate("/cart")}
            className={`relative p-2 transition-transform active:scale-90 ${isMenuOpen ? "text-slate-900" : navTextColor}`}
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center">
            {isLoggedIn && user ? (
              <div className="relative group">
                <button className={`flex items-center space-x-2 transition-opacity hover:opacity-70 ${navTextColor}`}>
                  <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    <User size={16} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                </button>

                <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-100 p-2">
                  <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition text-slate-700 text-xs font-bold">
                    <Settings size={14} /> <span>Profile Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-50 rounded-xl transition text-red-600 text-xs font-bold mt-1">
                    <LogOut size={14} /> <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/signup" className="bg-amber-500 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full transition-all duration-300">
                Join Now
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden z-[160] p-2 transition-transform active:scale-90 ${isMenuOpen ? "text-slate-900" : navTextColor}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-white z-[150] transition-transform duration-700 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}>
        <div className="flex flex-col h-full px-8 pt-32 pb-12">
          
          <div className="space-y-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Navigation</p>
            <nav className="flex flex-col space-y-6">
              {["Home", "Product", "About"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between text-4xl font-black text-slate-900 tracking-tighter"
                >
                  {item === "Product" ? "Collection" : item}
                  <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-amber-500" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto space-y-8">
            {isLoggedIn ? (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-slate-100 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900">
                  <User size={14} /> Account
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-600">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-slate-950 text-white py-5 rounded-2xl text-center text-[11px] font-black uppercase tracking-[0.2em]"
              >
                Sign In to Account
              </Link>
            )}
            
            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">© 2026 FASHION STORE</p>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
                 <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;