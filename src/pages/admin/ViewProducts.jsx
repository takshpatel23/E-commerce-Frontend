import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Edit3, Trash2, Eye, Search, Plus, Package, Loader2, ArrowRight, Zap } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
      ]);

      const productData = Array.isArray(prodRes.data) 
        ? prodRes.data 
        : (prodRes.data.products || prodRes.data.data || []);
        
      const categoryData = Array.isArray(catRes.data) 
        ? catRes.data 
        : (catRes.data.categories || catRes.data.data || []);

      setProducts(productData);
      setFilteredProducts(productData);
      setAllCategories(categoryData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to sync inventory archive");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getParentCategoryName = (product) => {
    if (!product || !allCategories || !Array.isArray(allCategories)) return "General";
    
    const subCatId = typeof product.category === 'object' 
      ? product.category?._id 
      : product.category;

    const parent = allCategories.find(main => 
      main.subCategories?.some(sub => sub._id === subCatId)
    );

    return parent ? parent.name : "Uncategorized";
  };

  useEffect(() => {
    let result = Array.isArray(products) ? [...products] : [];

    if (activeFilter !== "All") {
      result = result.filter(p => {
        const parentName = getParentCategoryName(p);
        return parentName.toLowerCase() === activeFilter.toLowerCase();
      });
    }

    if (searchTerm) {
      result = result.filter(p => 
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeFilter, searchTerm, products, allCategories]);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <p className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Confirm Deletion?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Entry Purged");
                fetchData();
              } catch (error) {
                toast.error("Protocol Failed");
              }
              toast.dismiss(t.id);
            }}
            className="bg-slate-950 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter"
          >
            Confirm
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, style: { borderRadius: '24px', padding: '16px' } });
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-6 lg:p-10 text-left">
      <Toaster position="top-right" />

      {/* --- EXECUTIVE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-[6px] border-slate-950 pb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Zap size={18} className="text-amber-500 fill-amber-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Inventory Management</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-black text-slate-950 tracking-tighter uppercase italic leading-[0.8]">
            Catalog<span className="not-italic text-slate-200">.</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Authorized Access Only // Nexus Protocol v2.4</p>
        </div>
        
        <button 
          onClick={() => navigate("/admin/add-product")}
          className="group flex items-center gap-4 bg-slate-950 hover:bg-amber-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all duration-500 shadow-2xl shadow-slate-200 active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" /> 
          Register Unit
        </button>
      </div>

      {/* --- SEARCH & NAVIGATION --- */}
      <div className="bg-white p-6 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-[2.5rem] w-full xl:w-auto">
          {["All", "Men", "Women", "Kids"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-1 xl:flex-none px-10 py-3.5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                activeFilter === cat 
                ? "bg-slate-950 text-white shadow-xl translate-y-[-2px]" 
                : "text-slate-400 hover:text-slate-950"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full xl:w-[450px] group">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="FILTER BY UNIT NAME..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-amber-500/10 transition-all text-xs font-black uppercase tracking-widest outline-none placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* --- GRID ARCHITECTURE --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-48 gap-6">
          <div className="w-16 h-16 border-[3px] border-slate-100 border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.6em] animate-pulse">Synchronizing Units...</p>
        </div>
      ) : filteredProducts?.length === 0 ? (
        <div className="bg-white rounded-[4rem] py-40 text-center border-2 border-dashed border-slate-100">
            <Package className="mx-auto text-slate-100 mb-8" size={100} strokeWidth={1} />
            <p className="text-slate-300 font-black text-xs uppercase tracking-[0.4em]">Archive Null — No Matches Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          {filteredProducts?.map((product) => (
            <div key={product._id} className="group bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-slate-200 transition-all duration-700">
              <div className="relative h-[400px] overflow-hidden bg-slate-100">
                <img 
                  src={product.image?.[0] || "https://via.placeholder.com/600"} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                />
                
                <div className="absolute top-8 left-8">
                  <span className="bg-slate-950 text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {getParentCategoryName(product)}
                  </span>
                </div>

                {/* --- HOVER ACTIONS --- */}
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
                  <button onClick={() => setModalProduct(product)} className="w-14 h-14 bg-white rounded-2xl text-slate-950 hover:bg-amber-500 hover:text-white transition-all duration-500 transform hover:-translate-y-2 flex items-center justify-center shadow-xl">
                    <Eye size={22} />
                  </button>
                  <button onClick={() => navigate(`/admin/add-product?id=${product._id}`)} className="w-14 h-14 bg-white rounded-2xl text-slate-950 hover:bg-amber-500 hover:text-white transition-all duration-500 transform hover:-translate-y-2 flex items-center justify-center shadow-xl">
                    <Edit3 size={22} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="w-14 h-14 bg-white rounded-2xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-500 transform hover:-translate-y-2 flex items-center justify-center shadow-xl">
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-slate-950 text-2xl line-clamp-1 italic uppercase tracking-tighter w-2/3">{product.name}</h3>
                  <p className="text-xl font-black text-slate-900 tracking-tighter">₹{product.price}</p>
                </div>
                
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-950 bg-slate-100 px-3 py-1 rounded-lg">
                    {product.sizes?.reduce((acc, s) => acc + s.quantity, 0) || 0} UNITS
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- UNIT DATA MODAL --- */}
      {modalProduct && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xl flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[4rem] shadow-3xl max-w-7xl w-full h-[85vh] md:h-auto flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-500 relative border border-white/20">
            
            <button onClick={() => setModalProduct(null)} className="absolute top-10 right-10 p-4 bg-slate-50 hover:bg-slate-950 hover:text-white rounded-[1.5rem] transition-all z-20 text-slate-400 shadow-sm">
              <X size={28} />
            </button>

            {/* PRODUCT PREVIEW */}
            <div className="md:w-[45%] bg-slate-50 flex items-center justify-center p-12 md:p-24 relative overflow-hidden group/modal">
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none uppercase font-black text-[12rem] leading-none tracking-tighter rotate-[-10deg]">
                 {modalProduct.name}
               </div>
               <img 
                 src={modalProduct.image?.[0]} 
                 alt={modalProduct.name} 
                 className="max-h-[600px] w-full object-contain relative z-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)] transition-transform duration-1000 group-hover/modal:scale-105" 
               />
            </div>

            {/* PRODUCT SPECS */}
            <div className="md:w-[55%] p-12 md:p-24 flex flex-col justify-center">
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-amber-500"></span>
                    <span className="text-amber-500 text-[11px] font-black uppercase tracking-[0.5em]">
                      {getParentCategoryName(modalProduct)} Archive / {modalProduct.category?.name || "Global"}
                    </span>
                  </div>
                  <h3 className="text-6xl md:text-8xl font-black text-slate-950 leading-[0.85] italic uppercase tracking-tighter">{modalProduct.name}</h3>
                  <p className="text-5xl font-black text-slate-950 tracking-tighter">₹{modalProduct.price}</p>
                </div>

                <div className="space-y-8">
                   <p className="text-slate-500 leading-relaxed font-bold text-xl italic max-w-xl">
                     {modalProduct.description || "The pinnacle of utilitarian luxury, engineered for the modern nomad."}
                   </p>
                   
                   <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Inventory Distribution</p>
                     <div className="flex flex-wrap gap-4">
                       {modalProduct.sizes?.map((s, i) => (
                         <div key={i} className="px-6 py-3 bg-slate-950 text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-tighter shadow-lg">
                           {s.size}: <span className="text-amber-500 ml-1">{s.quantity}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>

                <button 
                  onClick={() => { setModalProduct(null); navigate(`/admin/add-product?id=${modalProduct._id}`); }}
                  className="group flex items-center justify-between w-full bg-slate-950 text-white p-8 rounded-[2.5rem] font-black uppercase tracking-[0.3em] hover:bg-amber-500 transition-all duration-500 shadow-2xl active:scale-95"
                >
                  Modify Specifications
                  <ArrowRight className="group-hover:translate-x-4 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;