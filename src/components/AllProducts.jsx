import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Search, SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories (structured: parent -> subCategories)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Fetch Categories Error:", err);
      }
    };
    fetchCategories();
  }, []);

  // Filter, search, and sort products
  useEffect(() => {
    let filtered = [...products];

    // Category filter: handle parent and subcategory
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => {
        const parentCategoryName = p.category?.parent?.name || "";
        const subCategoryName = p.category?.name || "";
        const selected = selectedCategory.toLowerCase();
        return (
          parentCategoryName.toLowerCase() === selected ||
          subCategoryName.toLowerCase() === selected
        );
      });
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const price = p.price || 0;
      if (minPrice !== "" && price < Number(minPrice)) return false;
      if (maxPrice !== "" && price > Number(maxPrice)) return false;
      return true;
    });

    // Search
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((p) => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sorting
    if (sortOrder === "low") filtered.sort((a, b) => a.price - b.price);
    else if (sortOrder === "high") filtered.sort((a, b) => b.price - a.price);

    setDisplayProducts(filtered);
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, sortOrder]);

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- HEADER --- */}
        <div className="mb-20 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-amber-600"></div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-600">
              The Edit
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter">
            Our Collection
          </h2>
          <p className="text-slate-500 text-lg font-light max-w-2xl leading-relaxed">
            A curated selection of pieces designed for the modern individual,
            balancing timeless aesthetics with contemporary comfort.
          </p>
        </div>

        {/* --- UTILITY BAR --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-16 border-b border-slate-100 pb-10">

          {/* --- CLASSIC DEPARTMENT NAVIGATION --- */}
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {/* All Pieces */}
            <button
              onClick={() => setSelectedCategory("All")}
              className={`relative py-2 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 group ${selectedCategory === "All" ? "text-slate-950" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              All
              <span className={`absolute bottom-0 left-0 h-[1.5px] bg-amber-600 transition-all duration-500 ${selectedCategory === "All" ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
            </button>

            {/* Parent Categories */}
            {categories.map((parent) => (
              <div key={parent._id} className="relative group">
                <button
                  onClick={() => setSelectedCategory(parent.name)}
                  className={`relative py-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ${selectedCategory === parent.name ? "text-slate-950" : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {parent.name}
                  {parent.subCategories.length > 0 && (
                    <ChevronDown size={12} className="opacity-30 group-hover:rotate-180 transition-transform duration-500" />
                  )}
                  {/* Elegant Underline Indicator */}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-amber-600 transition-all duration-500 ${selectedCategory === parent.name ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                </button>

                {/* Minimalist Sub-Menu Dropdown */}
                {parent.subCategories.length > 0 && (
                  <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-50">
                    <div className="bg-white border border-slate-100 p-6 min-w-[220px] shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
                      <div className="flex flex-col gap-4">
                        {parent.subCategories.map((sub) => (
                          <button
                            key={sub._id}
                            onClick={() => setSelectedCategory(sub.name)}
                            className={`text-[10px] uppercase tracking-[0.2em] text-left transition-all duration-300 hover:pl-2 ${selectedCategory === sub.name ? "text-amber-700 font-black" : "text-slate-400 hover:text-slate-950"
                              }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* --- MINIMALIST SEARCH BAR --- */}
          <div className="relative w-full lg:w-80 group">
            <input
              type="text"
              placeholder="Search the archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-slate-200 py-2 pr-10 text-[11px] font-medium tracking-[0.1em] focus:outline-none focus:border-amber-600 transition-colors placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-[0.2em]"
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-amber-600 transition-colors" />
          </div>

        </div>

        {/* --- FILTERS & SORT --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <SlidersHorizontal size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Price Range</span>
            </div>
            <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
              <input
                type="number"
                placeholder="MIN"
                className="bg-transparent border-none w-20 text-[11px] font-bold focus:ring-0 px-3"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <div className="h-4 w-[1px] bg-slate-200"></div>
              <input
                type="number"
                placeholder="MAX"
                className="bg-transparent border-none w-20 text-[11px] font-bold focus:ring-0 px-3"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="relative group w-full md:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="appearance-none bg-white border border-slate-200 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest w-full md:w-56 focus:outline-none focus:border-amber-600 cursor-pointer"
            >
              <option value="">Sort By: Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-40 border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-sm">
                No pieces match your selection
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSortOrder("");
                }}
                className="mt-6 text-amber-600 text-[10px] font-black uppercase tracking-widest border-b border-amber-600 pb-1"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
