import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  Plus, 
  Image as ImageIcon, 
  Star, 
  Trash2, 
  Search,
  ArrowLeft,
  LayoutGrid,
  ChevronRight,
  Loader2,
  AlertCircle,
  Database,
  Layers
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isFeatured: false,
    parent: "",
  });

  const [categories, setCategories] = useState([]); 
  const [structuredCategories, setStructuredCategories] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      setFetching(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      const categoryData = Array.isArray(data) ? data : (data.categories || []);
      
      setStructuredCategories(categoryData);
      // Main departments only for the parent selection dropdown
      const mainOnly = categoryData.filter(cat => !cat.parent);
      setCategories(mainOnly);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Systems Offline: Category Link Failed");
      setStructuredCategories([]);
      setCategories([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Protocol Error: Label Required");

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        parent: formData.parent === "" ? null : formData.parent
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/categories`, dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ name: "", description: "", image: "", isFeatured: false, parent: "" });
      fetchCategories();
      toast.success("Architecture Updated ✨");
    } catch (error) {
      toast.error(error.response?.data?.message || "Transmission Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if(!window.confirm("CRITICAL: Deletion will affect linked items. Proceed?")) return;
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Entity Purged");
        fetchCategories();
    } catch (error) {
        toast.error(error.response?.data?.message || "Deletion Failed");
    }
  };

  const SafeImage = ({ src, alt, className }) => {
    if (!src || src.trim() === "") {
      return (
        <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
          <ImageIcon size={20} strokeWidth={1.5} />
        </div>
      );
    }
    return <img src={src} alt={alt} className={className} />;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] w-full max-w-7xl mx-auto p-4 lg:p-10 font-sans selection:bg-slate-900 selection:text-white">
      <Toaster position="top-right" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="group p-4 bg-white border border-slate-200 shadow-sm hover:bg-slate-950 hover:text-white rounded-[1.25rem] transition-all duration-300"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="text-left">
            <h1 className="text-5xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">Taxonomy Nexus</h1>
            <p className="mt-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
              <Database size={12} className="text-amber-500" /> Structure & Global Classification
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* FORM SECTION */}
        <section className="lg:col-span-7 xl:col-span-8 bg-white p-8 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Layers size={120} strokeWidth={1} />
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white">
              <Plus size={20} />
            </div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Register New Entity</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-10 gap-y-8 text-left">
            <div className="space-y-8">
              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block group-focus-within:text-amber-600 transition-colors">Category Label</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. READY-TO-WEAR"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pb-3 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 font-black text-xl transition-all outline-none placeholder:text-slate-200 uppercase tracking-tight"
                  required
                />
              </div>

              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block group-focus-within:text-amber-600 transition-colors">Parent Sector</label>
                <div className="relative">
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleChange}
                    className="w-full py-3 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 font-bold appearance-none cursor-pointer outline-none uppercase text-xs"
                  >
                    <option value="">Main Department (Root)</option>
                    {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat._id} value={cat._id}>Under {cat.name}</option>
                    ))}
                  </select>
                  <ChevronRight size={14} className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block group-focus-within:text-amber-600 transition-colors">Multimedia URL</label>
                <input
                  type="text"
                  name="image"
                  placeholder="HTTPS://SOURCE.COM/IMAGE.JPG"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full pb-3 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 font-bold transition-all outline-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 block group-focus-within:text-amber-600 transition-colors">Sector Narrative</label>
                <textarea
                  name="description"
                  placeholder="DEFINE THE SCOPE OF THIS CLASSIFICATION..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-slate-950 focus:bg-white font-medium text-xs transition-all outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl cursor-pointer bg-slate-50 border-2 border-transparent hover:border-amber-500 transition-all group">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded-lg border-slate-300 text-slate-950 focus:ring-slate-950 cursor-pointer"
                  />
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-amber-600 uppercase tracking-widest">Featured</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[1.5] py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-amber-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Authorize Entity <ArrowLeft size={16} className="rotate-180" /></>}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* PREVIEW CARD */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[9px] font-black text-slate-950 uppercase tracking-[0.4em]">Holographic Preview</h3>
            <div className={`h-1.5 w-1.5 rounded-full ${formData.name ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`}></div>
          </div>
          
          <div className="relative group w-full bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-300">
            <div className="aspect-[3/4] overflow-hidden relative">
              <SafeImage src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-[3s] ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              <div className="absolute top-8 right-8">
                {formData.isFeatured && (
                  <div className="bg-amber-500 p-2 rounded-full text-white shadow-lg">
                    <Star size={16} className="fill-white" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-10 left-10 right-10 text-left">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full mb-4 border border-white/20">
                  {formData.parent ? "Sub-Sector" : "Root Department"}
                </span>
                <h4 className="text-white font-black text-4xl uppercase italic tracking-tighter leading-none break-words">
                  {formData.name || "UNNAMED"}
                </h4>
                <p className="mt-4 text-slate-400 text-[10px] font-medium uppercase tracking-widest line-clamp-2">
                  {formData.description || "No narrative defined for this sector."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATA ARCHIVE (TABLE) */}
      <div className="mt-20 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-[0.4em] flex items-center gap-3 text-left">
            <LayoutGrid size={18} className="text-amber-600" /> Taxonomy Overview
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {structuredCategories.length} Departments Registered
          </span>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
          {fetching ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6">
               <div className="relative">
                 <Loader2 className="animate-spin text-slate-950" size={48} strokeWidth={1} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                 </div>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Synchronizing Global Matrix</p>
            </div>
          ) : (
            <div className="overflow-x-auto text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-10 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Classification</th>
                    <th className="p-10 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Routing Slug</th>
                    <th className="p-10 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] text-center">Status</th>
                    <th className="p-10 text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] text-right">Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {structuredCategories.map((main) => (
                    <React.Fragment key={main._id}>
                      {/* MAIN CATEGORY ROW */}
                      <tr className="group hover:bg-slate-50/80 transition-all">
                        <td className="p-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-md group-hover:rotate-3 transition-transform">
                              <SafeImage src={main.image} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <span className="font-black text-slate-950 text-xl uppercase italic tracking-tighter block leading-none">{main.name}</span>
                               <span className="mt-2 inline-block text-[8px] font-black text-amber-600 uppercase tracking-widest border border-amber-200 px-2 py-0.5 rounded">Primary Node</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full group-hover:bg-slate-950 group-hover:text-white transition-colors">/{main.slug}</span>
                        </td>
                        <td className="p-8 text-center">
                          {main.isFeatured ? (
                            <div className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-500 rounded-full">
                              <Star size={16} className="fill-amber-500" />
                            </div>
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200 mx-auto" />
                          )}
                        </td>
                        <td className="p-8 text-right">
                          <button 
                            onClick={() => deleteCategory(main._id)} 
                            className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                          >
                            <Trash2 size={20} strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                      {/* SUB CATEGORY ROWS */}
                      {main.subCategories?.map((sub) => (
                        <tr key={sub._id} className="bg-slate-50/20 group/sub hover:bg-slate-100/40 transition-colors">
                          <td className="p-6 pl-32">
                            <div className="flex items-center gap-5">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                  <ChevronRight size={12} className="text-slate-400" />
                                </div>
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100">
                                  <SafeImage src={sub.image} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-black text-slate-600 uppercase text-[11px] tracking-tight">{sub.name}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-tighter opacity-60">/{sub.slug}</span>
                          </td>
                          <td className="p-6 text-center">
                            {sub.isFeatured && <Star size={12} className="mx-auto fill-amber-300 text-amber-300" />}
                          </td>
                          <td className="p-6 text-right pr-12">
                             <button 
                              onClick={() => deleteCategory(sub._id)} 
                              className="p-3 text-slate-200 hover:text-rose-400 transition-colors"
                             >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;