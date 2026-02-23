import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { slides } from "../assets/data";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-slate-950" id="/">
      {/* Navbar - Absolute at top */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
            index === current ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"
          }`}
        >
          {/* Darkening Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 z-[5]" />
          
          <video
            src={slide.video}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${
              index === current ? "scale-110" : "scale-100"
            }`}
          />

          {/* Editorial Content Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-24">
            <div className="max-w-4xl pt-20 md:pt-0">
              <span className={`block text-amber-500 uppercase tracking-[0.4em] text-[10px] md:text-sm font-bold mb-3 md:mb-4 transition-all duration-1000 delay-300 ${
                index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                New Arrival 2026
              </span>

              <h2 className={`text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-4 md:mb-6 transition-all duration-1000 delay-500 ${
                index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                {slide.title}
              </h2>

              <p className={`text-lg md:text-2xl text-slate-200 font-light italic max-w-xs md:max-w-xl mb-8 md:mb-10 transition-all duration-1000 delay-700 ${
                index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
                {slide.subtitle}
              </p>

              <button
                onClick={() => navigate("/product")}
                className={`group w-fit flex items-center gap-3 md:gap-4 bg-white hover:bg-amber-500 text-slate-950 hover:text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs transition-all duration-500 ${
                  index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                Explore Collection
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Luxury Progress Indicators */}
      <div className="absolute bottom-10 md:bottom-12 left-6 right-6 md:left-auto md:right-24 z-30 flex items-center justify-between md:justify-end gap-4 md:gap-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="group flex flex-col gap-2 flex-1 md:flex-none"
          >
            <span className={`text-[9px] md:text-[10px] font-bold transition-colors ${
              idx === current ? "text-white" : "text-white/40"
            }`}>
              0{idx + 1}
            </span>
            <div className="h-[2px] w-full md:w-24 bg-white/20 relative overflow-hidden">
              {idx === current && (
                <div className="absolute inset-0 bg-amber-500 animate-slide-progress" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Decorative Branding Text */}
      <div className="absolute -bottom-5 md:-bottom-10 -left-5 md:-left-10 text-[25vw] md:text-[20vw] font-black text-white/[0.03] select-none z-0 pointer-events-none uppercase">
        Vogue
      </div>
    </div>
  );
};

export default Header;