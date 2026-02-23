import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Edit3, Trash2, Eye, Filter, Search, Plus, Package, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Nested structure from API
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Products and Categories simultaneously
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        axios.get("${import.meta.env.VITE_API_URL}/api/products"),
        axios.get("${import.meta.env.VITE_API_URL}/api/categories")
      ]);
      setProducts(prodRes.data);
      setFilteredProducts(prodRes.data);
      setAllCategories(catRes.data);
    } catch (error) {
      toast.error("Failed to sync inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Helper to find Parent Category Name
  const getParentCategoryName = (product) => {
    if (!product || !allCategories.length) return "General";
    
    // Get the ID of the sub-category attached to the product
    const subCatId = typeof product.category === 'object' 
      ? product.category?._id 
      : product.category;

    // Find the main category that contains this sub-category ID
    const parent = allCategories.find(main => 
      main.subCategories?.some(sub => sub._id === subCatId)
    );

    return parent ? parent.name : "Uncategorized";
  };

  // 3. Combined Filter and Search Logic
  useEffect(() => {
    let result = products;

    // Filter by Parent Category
    if (activeFilter !== "All") {
      result = result.filter(p => {
        const parentName = getParentCategoryName(p);
        return parentName.toLowerCase() === activeFilter.toLowerCase();
      });
    }

    // Filter by Search Term
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeFilter, searchTerm, products, allCategories]);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-bold text-slate-800">Permanently delete this item?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Item removed");
                fetchData();
              } catch (error) {
                toast.error("Delete failed");
              }
              toast.dismiss(t.id);
            }}
            className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
          >
            Confirm
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700 p-4">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Catalog</h2>
          <p className="text-slate-400 font-medium">Inventory control and stock monitoring.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/add-product")}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl transition-all active:scale-95"
        >
          <Plus size={20} /> New Product
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl w-full lg:w-auto">
          {["All", "Men", "Women", "Kids"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeFilter === cat ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all text-sm font-bold outline-none"
          />
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-amber-500" size={40} />
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-32 text-center border-2 border-dashed border-slate-100">
           <Package className="mx-auto text-slate-100 mb-6" size={80} strokeWidth={1} />
           <p className="text-slate-400 font-bold text-xl tracking-tight">No products found in this department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden hover:shadow-2xl hover:border-amber-100 transition-all duration-500">
              <div className="relative h-72 overflow-hidden bg-slate-50">
                <img 
                  src={product.image[0] || "https://via.placeholder.com/400"} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                
                {/* PARENT CATEGORY BADGE */}
                <div className="absolute top-5 left-5">
                  <span className="bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] text-slate-900 shadow-lg border border-white">
                    {getParentCategoryName(product)}
                  </span>
                </div>

                {/* OVERLAY ACTIONS */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                  <button onClick={() => setModalProduct(product)} className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-amber-500 hover:text-white transition-all transform hover:-translate-y-1">
                    <Eye size={22} />
                  </button>
                  <button onClick={() => navigate(`/admin/add-product?id=${product._id}`)} className="p-4 bg-white rounded-2xl text-slate-900 hover:bg-amber-500 hover:text-white transition-all transform hover:-translate-y-1">
                    <Edit3 size={22} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-4 bg-white rounded-2xl text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <h3 className="font-black text-slate-900 text-xl mb-1 line-clamp-1 italic uppercase tracking-tighter">{product.name}</h3>
                <div className="flex items-center justify-between mt-6">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{product.price}</p>
                  <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400">
                    Stock: {product.sizes?.reduce((acc, s) => acc + s.quantity, 0) || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODERN DETAIL MODAL */}
      {modalProduct && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3.5rem] shadow-2xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden animate-in zoom-in duration-300 relative border border-white/20">
            <button onClick={() => setModalProduct(null)} className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl transition-all z-10 text-slate-500">
              <X size={24} />
            </button>

            <div className="md:w-1/2 bg-slate-50 flex items-center justify-center p-16">
               <img 
                 src={modalProduct.image[0]} 
                 alt={modalProduct.name} 
                 className="max-h-[500px] w-full object-contain rounded-3xl transition-transform duration-700" 
               />
            </div>

            <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block">
                {getParentCategoryName(modalProduct)} Collection / {modalProduct.category?.name || "Premium"}
              </span>
              <h3 className="text-5xl font-black text-slate-900 mb-6 leading-none italic uppercase tracking-tighter">{modalProduct.name}</h3>
              <p className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">₹{modalProduct.price}</p>
              
              <div className="space-y-8 mb-12">
                 <div className="h-[2px] bg-slate-100 w-24"></div>
                 <p className="text-slate-500 leading-relaxed font-medium text-lg italic">
                   {modalProduct.description || "Sophisticated design meets unparalleled comfort in this curated seasonal piece."}
                 </p>
                 
                 <div className="flex flex-wrap gap-3">
                   {modalProduct.sizes?.map((s, i) => (
                     <div key={i} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">
                       {s.size}: {s.quantity}
                     </div>
                   ))}
                 </div>
              </div>

              <button 
                onClick={() => { setModalProduct(null); navigate(`/admin/add-product?id=${modalProduct._id}`); }}
                className="w-full bg-amber-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-amber-600 transition shadow-2xl shadow-amber-200 active:scale-95"
              >
                Modify Inventory Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;