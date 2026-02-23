import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Quote, Sparkles, ShieldCheck, Globe } from "lucide-react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION - Minimalist & Bold */}
        <section className="pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">
              Established 2019
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.9]">
              Philosophy & <br />
              <span className="text-slate-200 italic font-light">Heritage</span>
            </h1>
          </div>
        </section>

        {/* IMAGE + STORY - Asymmetric Layout */}
        <section className="max-w-7xl mx-auto py-24 px-6">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            
            {/* Image with Decorative Element */}
            <div className="md:col-span-7 relative group">
              <div className="absolute -inset-4 border border-slate-100 rounded-[3rem] -z-10 transition-transform group-hover:scale-105 duration-700"></div>
              <img
                src="https://images.unsplash.com/photo-1521334884684-d80222895322"
                alt="Our Atelier"
                className="rounded-[2.5rem] w-full h-[600px] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-[1.5s]"
              />
            </div>

            {/* Content */}
            <div className="md:col-span-5 space-y-8">
              <Quote size={40} className="text-amber-600 opacity-20" />
              <h2 className="text-4xl font-black text-slate-950 tracking-tight leading-none">
                DEFINING THE <br /> MODERN CANON.
              </h2>
              <div className="space-y-6 text-slate-500 font-light leading-relaxed text-lg">
                <p>
                  Founded with a singular vision, our store began as a small atelier 
                  dedicated to the art of tailoring. We believed that fashion shouldn't 
                  just be fast; it should be <span className="text-slate-950 font-bold">foundational</span>.
                </p>
                <p>
                  Today, we have evolved into a global archive, serving a community 
                  that values substance over trends and quality over quantity.
                </p>
              </div>
              <div className="pt-6">
                <div className="h-[1px] w-20 bg-slate-950"></div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-950">
                  Director's Note
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION - Sophisticated Monochrome */}
        <section className="bg-slate-950 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <StatItem number="10k" label="Pieces Curated" />
              <StatItem number="500+" label="Global Partners" />
              <StatItem number="05" label="Years of Heritage" />
              <StatItem number="24/7" label="Concierge Support" />
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - Luxury Values */}
        <section className="max-w-7xl mx-auto py-32 px-6">
          <div className="text-center mb-20">
             <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600 mb-4">Core Values</h2>
             <p className="text-4xl font-black text-slate-950 tracking-tighter">The Pillars of Our Craft</p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-[3rem] overflow-hidden">
            <ValueCard 
              icon={<Sparkles size={28} strokeWidth={1} />}
              title="Artisanal Quality"
              desc="We source fabrics from the world’s most renowned mills to ensure every thread meets our rigorous standard."
            />
            <ValueCard 
              icon={<Globe size={28} strokeWidth={1} />}
              title="Global Vision"
              desc="Inspired by the streets of Milan and the energy of Tokyo, our designs are a dialogue between cultures."
            />
            <ValueCard 
              icon={<ShieldCheck size={28} strokeWidth={1} />}
              title="Quiet Luxury"
              desc="No loud logos. No unnecessary noise. Just perfectly cut silhouettes that speak for themselves."
            />
          </div>
        </section>

        {/* NEWSLETTER/CTA */}
        <section className="pb-32 px-6">
            <div className="max-w-5xl mx-auto bg-amber-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Join the Inner Circle</h2>
                    <p className="text-amber-100 font-light mb-10 max-w-md mx-auto italic">Receive early access to seasonal archives and exclusive invitations.</p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:bg-white/20 md:w-80 placeholder:text-white/50"
                        />
                        <button className="bg-white text-slate-950 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
                {/* Decorative background text */}
                <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-white opacity-5 select-none pointer-events-none">
                    ARCHIVE
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* --- Sub-components for cleaner structure --- */

const StatItem = ({ number, label }) => (
  <div className="space-y-2">
    <h3 className="text-5xl font-black text-white tracking-tighter">{number}</h3>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">{label}</p>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-white p-12 hover:bg-slate-50 transition-colors duration-500 flex flex-col items-center text-center">
    <div className="text-amber-600 mb-8">{icon}</div>
    <h3 className="text-lg font-black text-slate-950 uppercase tracking-widest mb-4">{title}</h3>
    <p className="text-slate-500 font-light leading-relaxed text-sm">{desc}</p>
  </div>
);

export default About;