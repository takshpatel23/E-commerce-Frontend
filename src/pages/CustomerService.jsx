import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Truck, RefreshCw, HelpCircle, PhoneCall, Mail, Clock } from "lucide-react";

const CustomerService = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-16 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* HEADER SECTION */}
          <div className="text-center mb-12 md:mb-20 space-y-4">
            <span className="text-amber-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">
              Support & Care
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-slate-950 tracking-tighter leading-none">
              Client <span className="text-slate-200 italic font-light">Services</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-lg font-light max-w-xl mx-auto leading-relaxed">
              Our dedicated team is here to ensure your experience with the Archive is as seamless as our silhouettes.
            </p>
          </div>

          {/* SERVICE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
            
            {/* Shipping Policy */}
            <ServiceCard 
              icon={<Truck size={32} strokeWidth={1} />}
              title="Shipping & Logistics"
              desc="We offer white-glove delivery across the continent. Every piece is inspected and tracked from our atelier to your door."
              details="Standard Delivery: 3-5 Days | Express: 24 Hours"
            />

            {/* Returns & Exchanges */}
            <ServiceCard 
              icon={<RefreshCw size={32} strokeWidth={1} />}
              title="Returns & Exchanges"
              desc="If the fit isn't perfect, our return process is effortless. We accept returns of unworn pieces within 7 days of arrival."
              details="Complimentary pick-ups for all exchange orders."
            />

            {/* FAQ */}
            <ServiceCard 
              icon={<HelpCircle size={32} strokeWidth={1} />}
              title="Information Hub"
              desc="Find immediate answers regarding sizing, material care, and secure payment methods in our comprehensive guide."
              details="Search our database for instant resolutions."
            />

            {/* Support / Direct Assistance */}
            <div className="bg-white p-10 md:p-16 flex flex-col justify-between h-full">
              <div>
                <div className="text-amber-600 mb-6 md:mb-8">
                  <PhoneCall size={32} strokeWidth={1} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-6 uppercase">
                  Direct Assistance
                </h2>
                <div className="space-y-4 md:space-y-5">
                  <a href="mailto:concierge@fashionstore.com" className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                      <Mail size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-600 break-all">concierge@fashionstore.com</span>
                  </a>
                  <a href="tel:+911234567890" className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                      <PhoneCall size={16} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-600">+91 12345 67890</span>
                  </a>
                </div>
              </div>
              
              <div className="mt-10 md:mt-12 flex items-center gap-2 text-slate-400">
                <Clock size={14} />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Available 09:00 — 18:00 IST</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, details }) => (
  <div className="bg-white p-10 md:p-16 flex flex-col group hover:bg-slate-50 transition-colors duration-500">
    <div className="text-amber-600 mb-6 md:mb-8 transition-transform duration-500 group-hover:-translate-y-2">
      {icon}
    </div>
    <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mb-4 uppercase">
      {title}
    </h2>
    <p className="text-slate-500 font-light leading-relaxed mb-6 md:mb-8 flex-grow text-sm md:text-base">
      {desc}
    </p>
    <div className="pt-6 border-t border-slate-100">
      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-amber-600">
        {details}
      </p>
    </div>
  </div>
);

export default CustomerService;