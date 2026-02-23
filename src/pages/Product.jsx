import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { SlidersHorizontal, X, ChevronRight } from "lucide-react";

const Product = () => {
  const { searchQuery } = useSelector((state) => state.products);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        setError("Our collection is temporarily unavailable. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data); // structured parent -> subCategories
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Filter helper
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

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* SECTION HEADER */}
          <div className="mb-16">
            <h1 className="text-6xl font-black text-slate-950 tracking-tighter mb-4">
              The <span className="text-amber-600">Archive.</span>
            </h1>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Curated Selection</span>
              <div className="h-[1px] w-20 bg-slate-100"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{filteredProducts.length} Pieces</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* SIDEBAR FILTERS */}
            <aside className="lg:col-span-3 space-y-12">
              <div className="sticky top-32">
                <div className="flex items-center gap-2 mb-8">
                  <SlidersHorizontal size={18} className="text-amber-600" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Refine By</h2>
                </div>

                {/* Category Filter */}
                {/* Department Filter - Classic Editorial Style */}
<div className="mb-12">
  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8 flex items-center">
    <span className="bg-amber-600 w-8 h-[1px] mr-3"></span>
    Departments
  </h3>

  <ul className="space-y-6">
    {/* All Pieces Link */}
    <li>
      <button
        onClick={() => setSelectedCategory("all")}
        className={`group relative flex items-center text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
          selectedCategory === "all" ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span className={`absolute -left-4 transition-all duration-500 ${selectedCategory === "all" ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
          •
        </span>
        All Archive
      </button>
    </li>

    {/* Parent Categories */}
    {categories.map((parent) => (
      <li key={parent._id} className="group">
        <button
          onClick={() => setSelectedCategory(parent.name)}
          className={`relative flex items-center justify-between w-full text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
            selectedCategory === parent.name ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="flex items-center">
            <span className={`absolute -left-4 transition-all duration-500 ${selectedCategory === parent.name ? "opacity-100 visible" : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"}`}>
              •
            </span>
            {parent.name}
          </div>
          {parent.subCategories.length > 0 && (
            <span className="text-[9px] text-slate-300 group-hover:text-amber-600 transition-colors">
              ({parent.subCategories.length})
            </span>
          )}
        </button>

        {/* Subcategories - Reveals on parent hover or selection */}
        {parent.subCategories.length > 0 && (
          <div className="mt-4 ml-2 pl-4 border-l border-slate-100 flex flex-col gap-3 overflow-hidden max-h-0 group-hover:max-h-60 transition-all duration-700 ease-in-out">
            {parent.subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => setSelectedCategory(sub.name)}
                className={`text-[10px] uppercase tracking-widest text-left transition-colors duration-300 ${
                  selectedCategory === sub.name ? "text-amber-700 font-bold" : "text-slate-400 hover:text-slate-950"
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
                {/* Price Filter */}
                <div className="mb-10">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Price Range</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">₹</span>
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)} 
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-7 text-xs font-bold focus:ring-2 focus:ring-amber-500/20" 
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">₹</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)} 
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-7 text-xs font-bold focus:ring-2 focus:ring-amber-500/20" 
                      />
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all duration-500"
                >
                  <X size={14} className="group-hover:rotate-90 transition-transform" />
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Archive...</p>
                </div>
              ) : error ? (
                <div className="text-center py-40 bg-red-50 rounded-[3rem]">
                  <p className="text-red-500 font-bold uppercase tracking-widest text-xs">{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
                  <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-sm">No items found in this criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;
