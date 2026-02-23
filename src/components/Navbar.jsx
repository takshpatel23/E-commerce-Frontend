import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, Menu, X, Search, LogOut, Settings } from "lucide-react";
import { setSearchQuery } from "../redux/productSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Handle scroll effect for transparent to glass transition
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

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Dynamic Styles based on Scroll and Page Location
  const isHomePage = location.pathname === "/";
  const navTextColor = scrolled || !isHomePage ? "text-slate-900" : "text-white";
  const navBgColor = scrolled 
    ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-3" 
    : "bg-transparent py-6";

  const navLinkStyle = `relative text-[13px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:text-amber-500 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-500 after:transition-all after:duration-300 hover:after:w-full ${navTextColor}`;

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${navBgColor}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LEFT: LOGO */}
        <Link to="/" className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${navTextColor}`}>
          FASHION<span className="text-amber-500">STORE.</span>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center space-x-10">
          <Link to="/" className={navLinkStyle}>Home</Link>
          <Link to="/product" className={navLinkStyle}>Collection</Link>
          <Link to="/about" className={navLinkStyle}>Our Story</Link>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center space-x-4 md:space-x-7">
          
          {/* Search Bar - Aesthetic version */}
          <div className="hidden md:block relative group">
            <input
              type="text"
              placeholder="Search..."
              className={`bg-transparent border-b transition-all duration-500 outline-none text-sm py-1 w-32 focus:w-48 ${
                scrolled || !isHomePage ? "border-slate-300 focus:border-slate-900" : "border-white/30 focus:border-white"
              } ${navTextColor}`}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
            <Search className={`absolute right-0 top-1.5 h-4 w-4 opacity-50 ${navTextColor}`} />
          </div>

          {/* Cart Icon */}
          <button 
            onClick={() => navigate("/cart")}
            className={`relative transition-transform active:scale-90 ${navTextColor}`}
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Auth Section */}
          <div className="flex items-center">
            {isLoggedIn && user ? (
              <div className="relative group">
                <button className={`flex items-center space-x-2 transition-opacity hover:opacity-70 ${navTextColor}`}>
                  <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center overflow-hidden">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <span className="hidden md:block text-[12px] font-black uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                </button>

                {/* Profile Dropdown */}
                <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-slate-100 p-2 overflow-hidden">
                  <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition text-slate-700 text-sm font-bold">
                    <Settings size={16} /> <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-red-50 rounded-xl transition text-red-600 text-sm font-bold mt-1"
                  >
                    <LogOut size={16} /> <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className={`hidden md:block text-[12px] font-black uppercase tracking-widest hover:text-amber-500 transition ${navTextColor}`}>
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-amber-500 hover:bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 active:scale-95"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden transition-transform active:scale-90 ${navTextColor}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-white z-[150] transition-transform duration-700 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"} lg:hidden`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-20">
            <span className="text-2xl font-black tracking-tighter text-slate-900">MENU.</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
              <X size={30} className="text-slate-900" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-8">
            {["Home", "Product", "About"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-5xl font-black text-slate-900 tracking-tighter hover:text-amber-500 transition-colors"
              >
                {item === "Product" ? "Collection" : item}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-6">
            <div className="h-[1px] bg-slate-100 w-full" />
            <p className="text-slate-400 text-sm font-medium">© 2026 FASHION STORE GLOBAL</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;