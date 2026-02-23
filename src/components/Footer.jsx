import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from "react-icons/fa";
import { MoveRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white pt-16 md:pt-20 pb-8 md:pb-10 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Newsletter Section */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-4 uppercase">
                Fashion<span className="text-amber-500">Store.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                Redefining modern elegance through curated collections and timeless design. Join our journey toward sustainable luxury.
              </p>
            </div>

            {/* Newsletter Input */}
            <div className="space-y-4 max-w-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Newsletter</h4>
              <div className="flex border-b border-slate-700 pb-2 group focus-within:border-amber-500 transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600 focus:ring-0 px-0" 
                />
                <button className="text-slate-400 group-hover:text-amber-500 transition-colors">
                  <MoveRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Links Sections - Collections */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Collections</h4>
            <ul className="space-y-3 text-slate-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest">
              <li><Link to="/product" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/product" className="hover:text-white transition-colors">Limited Edit</Link></li>
            </ul>
          </div>

          {/* Links Sections - Support */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Support</h4>
            <ul className="space-y-3 text-slate-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/customer-service" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/customer-service" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/customer-service" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Follow Us</h4>
            <div className="flex gap-6">
              <SocialIcon Icon={FaInstagram} />
              <SocialIcon Icon={FaFacebookF} />
              <SocialIcon Icon={FaTwitter} />
              <SocialIcon Icon={FaPinterestP} />
            </div>
            <div className="pt-4">
              <p className="text-slate-500 text-[9px] md:text-[10px] uppercase tracking-widest font-black">Headquarters</p>
              <p className="text-slate-300 text-sm mt-1">123 Fashion Ave, NY 10001</p>
              <p className="text-slate-300 text-sm underline underline-offset-4 decoration-amber-500/30 mt-2 font-bold break-words">
                support@fashionstore.com
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-left">
            &copy; {currentYear} Fashion Store Global. All Rights Reserved.
          </p>
          <div className="flex gap-6 md:gap-8 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ Icon }) => (
  <a href="#" className="text-slate-400 hover:text-amber-500 transition-all duration-300 transform hover:-translate-y-1">
    <Icon size={18} />
  </a>
);

export default Footer;