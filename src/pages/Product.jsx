import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { SlidersHorizontal, X, ChevronRight, Filter } from "lucide-react";

const Product = () => {
  const { searchQuery } = useSelector((state) => state.products);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Our collection is temporarily unavailable. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const getCategoryProducts = () => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => {
      const parentCategoryName = p.category?.parent?.name || "";
      const subCategoryName = p.category?.name || "";
      const selected = selectedCategory.toLowerCase();
      return (
        parentCategoryName.toLowerCase() === selected ||
        subCategoryName.toLowerCase() === selected
      );
    });
  };

  const filteredProducts = getCategoryProducts()
    .filter((p) => (minPrice ? p.price >= Number(minPrice) : true))
    .filter((p) => (maxPrice ? p.price <= Number(maxPrice) : true))
    .filter((p) => (p.name || "").toLowerCase().includes((searchQuery || "").toLowerCase()));

  // Reusable Filter Content to avoid duplication
  const FilterContent = () => (
    <div className="space-y-12">
      <div className="hidden lg:flex items-center gap-2 mb-8">
        <SlidersHorizontal size={18} className="text-amber-600" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Refine By</h2>
      </div>

      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8 flex items-center">
          <span className="bg-amber-600 w-8 h-[1px] mr-3"></span>
          Departments
        </h3>
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => { setSelectedCategory("all"); setIsMobileFilterOpen(false); }}
              className={`group relative flex items-center text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                selectedCategory === "all" ? "text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              All Archive
            </button>
          </li>
          {categories.map((parent) => (
            <li key={parent._id} className="group">
              <button
                onClick={() => { setSelectedCategory(parent.name); setIsMobileFilterOpen(false); }}
                className={`relative flex items-center justify-between w-full text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                  selectedCategory === parent.name ? "text-slate-950 font-bold" : "text-slate-400"
                }`}
              >
                {parent.name}
              </button>
              {parent.subCategories.length > 0 && (
                <div className="mt-4 ml-2 pl-4 border-l border-slate-100 flex flex-col gap-3">
                  {parent.subCategories.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => { setSelectedCategory(sub.name); setIsMobileFilterOpen(false); }}
                      className={`text-[10px] uppercase tracking-widest text-left transition-colors duration-300 ${
                        selectedCategory === sub.name ? "text-amber-700 font-bold" : "text-slate-400"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Price Range</p>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="number" placeholder="Min" value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)} 
            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold" 
          />
          <input 
            type="number" placeholder="Max" value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold" 
          />
        </div>
      </div>

      <button
        onClick={() => { setSelectedCategory("all"); setMinPrice(""); setMaxPrice(""); setIsMobileFilterOpen(false); }}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all"
      >
        <X size={14} /> Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-grow pt-24 md:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* SECTION HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-4">
                The <span className="text-amber-600">Archive.</span>
              </h1>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Curated Selection</span>
                <div className="h-[1px] w-12 md:w-20 bg-slate-100"></div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">{filteredProducts.length} Pieces</span>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
            >
              <Filter size={14} /> Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32">
                <FilterContent />
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[2rem] md:rounded-[3rem]">
                  <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs md:text-sm px-4">No matches found in the archive</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>  
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-transform duration-500 ${isMobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-8 shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">Refine</h2>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2">
              <X size={20} />
            </button>
          </div>
          <FilterContent />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;