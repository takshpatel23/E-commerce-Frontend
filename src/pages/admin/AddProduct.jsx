import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import {
  PackagePlus,
  Image as ImageIcon,
  ArrowLeft,
  Plus,
  Trash2,
  Layers,
  Filter,
  Zap,
  Sparkles,
  Edit2
} from "lucide-react";

const AddProduct = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");

  const [allCategories, setAllCategories] = useState([]); 
  const [subCategories, setSubCategories] = useState([]); 
  const [selectedMainId, setSelectedMainId] = useState(""); 

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "", 
    image: [""],
    description: "",
    sizes: [{ size: "", quantity: 0 }],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        const categoriesArray = Array.isArray(data) ? data : (data.categories || data.data || []);
        setAllCategories(categoriesArray);
      } catch (err) {
        console.error("Category fetch error:", err);
        toast.error("Protocol Error: Category Database Offline");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productId && allCategories.length > 0) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`)
        .then((res) => {
          const product = res.data;
          const catId = product.category?._id || product.category;
          const parentObj = allCategories.find(main => 
            main.subCategories?.some(sub => sub._id === catId)
          );

          if (parentObj) {
            setSelectedMainId(parentObj._id);
            setSubCategories(parentObj.subCategories || []);
          }

          setFormData({
            name: product.name || "",
            price: product.price ?? 0,
            category: catId || "",
            image: product.image?.length > 0 ? product.image : [""],
            description: product.description || "",
            sizes: product.sizes?.map((s) => ({
              size: s.size || "",
              quantity: s.quantity ?? 0,
            })) || [{ size: "", quantity: 0 }],
          });
        })
        .catch(() => toast.error("Identity Retrieval Failed"));
    }
  }, [productId, allCategories]);

  const handleMainCategoryChange = (e) => {
    const mainId = e.target.value;
    setSelectedMainId(mainId);
    const selectedMain = allCategories.find(cat => cat._id === mainId);
    if (selectedMain) {
      setSubCategories(selectedMain.subCategories || []);
      setFormData(prev => ({ ...prev, category: "" })); 
    } else {
      setSubCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getDisplayCategory = () => {
    if (!selectedMainId) return "ARCHIVE";
    const foundMain = allCategories.find(cat => cat._id === selectedMainId);
    return foundMain ? foundMain.name : "UNIT";
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.image];
    updatedImages[index] = value;
    setFormData({ ...formData, image: updatedImages });
  };

  const addImageField = () => setFormData({ ...formData, image: [...formData.image, ""] });
  const removeImageField = (index) => {
    const updatedImages = formData.image.filter((_, i) => i !== index);
    setFormData({ ...formData, image: updatedImages.length ? updatedImages : [""] });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = field === "quantity" ? Number(value) : value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => setFormData({ ...formData, sizes: [...formData.sizes, { size: "", quantity: 0 }] });
  const removeSize = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: newSizes.length ? newSizes : [{ size: "", quantity: 0 }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) return toast.error("Protocol Error: Category Requirement Unmet");
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { 
        ...formData, 
        price: Number(formData.price), 
        image: formData.image.filter(img => img.trim() !== "") 
      };
      if (productId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, payload, config);
        toast.success("DATA OVERWRITTEN");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, payload, config);
        toast.success("NEW UNIT DEPLOYED");
      }
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Sync Protocol Failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-10 font-sans animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Toaster position="top-right" />

      {/* --- STUDIO HEADER --- */}
      <div className="flex items-center justify-between mb-12 border-b-[6px] border-slate-950 pb-12">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="group p-4 bg-slate-950 text-white hover:bg-amber-500 rounded-full transition-all duration-500">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
             <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Inventory Creator</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase italic leading-none">
               {productId ? "Edit Unit" : "New Entry"}<span className="not-italic text-slate-200">.</span>
             </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
        {/* --- CONTROL PANEL (FORM) --- */}
        <div className="xl:col-span-3 order-2 xl:order-1">
          <form onSubmit={handleSubmit} className="space-y-10 text-left">
            
            {/* IDENTIFICATION section */}
            <div className="space-y-6 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2px] bg-amber-500"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Core Identity</h3>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Full Product Title</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ENTER UNIT DESIGNATION..."
                      className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-amber-500/10 font-black uppercase tracking-tighter text-xl transition-all"
                      required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Department</label>
                      <div className="relative">
                        <select
                          value={selectedMainId}
                          onChange={handleMainCategoryChange}
                          className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-amber-500/10 font-bold uppercase tracking-widest text-xs appearance-none cursor-pointer"
                        >
                          <option value="">SELECT DEPT</option>
                          {allCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                        <Filter className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18}/>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Sub-Category</label>
                      <div className="relative">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          disabled={!selectedMainId}
                          className="w-full p-6 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-amber-500/10 font-bold uppercase tracking-widest text-xs appearance-none cursor-pointer disabled:opacity-30"
                          required
                        >
                          <option value="">SELECT SUB</option>
                          {subCategories.map((sub) => (
                            <option key={sub._id} value={sub._id}>{sub.name}</option>
                          ))}
                        </select>
                        <Layers className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18}/>
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Valuation (INR)</label>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full p-6 pl-12 bg-slate-50 rounded-[2rem] border-none focus:ring-4 focus:ring-amber-500/10 font-black text-xl tracking-tighter"
                        required
                      />
                   </div>
                </div>
            </div>

            {/* MEDIA section */}
            <div className="space-y-6 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2px] bg-amber-500"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Media Archive</h3>
                </div>

                {formData.image.map((img, index) => (
                  <div key={index} className="group/item flex gap-4">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="INPUT IMAGE SOURCE URL..."
                        className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-amber-500/10 text-[11px] font-bold tracking-widest"
                        required
                      />
                    </div>
                    <button type="button" onClick={() => removeImageField(index)} className="p-5 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-[1.5rem] transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                
                <button type="button" onClick={addImageField} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-3">
                  <Plus size={16} /> Register Additional Media
                </button>
            </div>

            {/* DESCRIPTION section */}
            <div className="space-y-6 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2px] bg-amber-500"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Marketing Brief</h3>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="COMPOSE UNIT SPECIFICATIONS AND NARRATIVE..."
                  className="w-full p-8 bg-slate-50 rounded-[2.5rem] border-none focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800 italic leading-relaxed resize-none text-sm"
                />
            </div>

            {/* INVENTORY section */}
            <div className="space-y-6 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-amber-500"></div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Inventory Allocation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.sizes.map((s, index) => (
                  <div key={index} className="flex gap-3 bg-slate-50 p-4 rounded-[1.8rem]">
                    <input
                      type="text" value={s.size} placeholder="SIZE"
                      onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 font-black uppercase italic tracking-tighter text-lg"
                      required
                    />
                    <div className="w-[2px] bg-slate-200"></div>
                    <input
                      type="number" value={s.quantity} placeholder="QTY"
                      onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                      className="w-20 bg-transparent border-none focus:ring-0 font-black text-lg text-amber-500"
                      required
                    />
                    <button type="button" onClick={() => removeSize(index)} className="text-slate-300 hover:text-rose-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button type="button" onClick={addSize} className="w-full py-4 bg-slate-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-500 transition-all flex items-center justify-center gap-3">
                <Plus size={16} /> Add Size Variant
              </button>
            </div>

            {/* SUBMIT ACTION */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-8 bg-slate-950 text-white rounded-[3rem] font-black uppercase tracking-[0.5em] hover:bg-amber-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] disabled:opacity-50 flex items-center justify-center gap-4 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} className="fill-amber-500 text-amber-500" />}
              {productId ? "OVERWRITE DATABASE" : "DEPLOY TO PRODUCTION"}
            </button>
          </form>
        </div>

        {/* --- LIVE STUDIO PREVIEW --- */}
        <div className="xl:col-span-2 order-1 xl:order-2">
          <div className="xl:sticky xl:top-10 space-y-8">
            <div className="flex items-center justify-between px-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Studio Live Preview</h3>
               <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
               </div>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-3xl overflow-hidden text-left relative">
              <div className="h-[500px] bg-slate-100 relative group overflow-hidden">
                {formData.image[0] ? (
                  <img src={formData.image[0]} alt="preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                ) : (
                  <div className="flex flex-col justify-center items-center h-full text-slate-200 gap-4">
                    <ImageIcon size={80} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Media</span>
                  </div>
                )}
                
                {/* Float Badge */}
                <div className="absolute top-10 left-10">
                   <div className="bg-slate-950 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                      <Layers size={12} className="text-amber-500" /> {getDisplayCategory()}
                   </div>
                </div>
              </div>

              <div className="p-12 space-y-8 relative">
                {/* Background Decoration */}
                <div className="absolute right-10 top-10 text-slate-50 font-black text-8xl italic pointer-events-none select-none uppercase tracking-tighter">
                  {formData.name?.split(' ')[0] || "UNIT"}
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="font-black text-4xl md:text-5xl text-slate-950 uppercase italic tracking-tighter leading-none max-w-[80%]">
                    {formData.name || "DESIGNATION"}
                  </h3>
                  <p className="text-amber-500 font-black text-4xl tracking-tighter italic">
                    ₹{formData.price || "0.00"}
                  </p>
                </div>

                <div className="w-12 h-1 bg-slate-950"></div>

                <p className="text-lg text-slate-400 font-bold italic leading-relaxed max-w-sm relative z-10">
                  {formData.description || "The product narrative will manifest in this space upon input."}
                </p>
                
                <div className="flex flex-wrap gap-3 relative z-10">
                   {formData.sizes.map((s, i) => (
                      s.size && (
                        <div key={i} className="px-5 py-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-tighter">
                          {s.size} <span className="text-amber-500 ml-1">[{s.quantity}]</span>
                        </div>
                      )
                   ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex gap-6 items-center">
               <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Edit2 size={24} />
               </div>
               <p className="text-[11px] font-bold text-amber-700 uppercase leading-relaxed tracking-wide">
                 Confirm all technical specifications before deployment. Entries are logged in the global audit trail.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;