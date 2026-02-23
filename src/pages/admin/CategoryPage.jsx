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
  AlertCircle
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
      // FIXED: Used backticks for template literal
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      
      // DEFENSIVE: Ensure we are setting an array even if data is wrapped in an object
      const categoryData = Array.isArray(data) ? data : (data.categories || []);
      
      setStructuredCategories(categoryData);
      
      // Filter for dropdown
      const mainOnly = categoryData.filter(cat => !cat.parent);
      setCategories(mainOnly);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Systems Offline: Category Link Failed");
      // Fallback to empty arrays to prevent .map crashes
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

      // FIXED: Used backticks for template literal
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
          <ImageIcon size={16} />
        </div>
      );
    }
    return <img src={src} alt={alt} className={className} />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 font-sans">
      <Toaster position="top-right" />

      <div className="flex items-center gap-6 mb-10 text-left">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white border border-slate-100 shadow-sm hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Taxonomy Nexus</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <AlertCircle size={12} className="text-amber-500" /> Structure & Classification Management
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 bg-white p-6 lg:p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <Plus size={18} strokeWidth={3} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Register Entity</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Category Label</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Outerwear"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Parent Sector</label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold appearance-none cursor-pointer"
                >
                  <option value="">Main Department (Root)</option>
                  {Array.isArray(categories) && categories.map(cat => (
                    <option key={cat._id} value={cat._id}>Under {cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Multimedia Source (URL)</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Sector Narrative</label>
                <textarea
                  name="description"
                  placeholder="Define the scope..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold transition-all outline-none resize-none"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex-[0.5] flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white border-2 border-transparent hover:border-amber-500 transition-all group">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-black text-slate-400 group-hover:text-amber-600 uppercase">Featured</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Authorize"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Holographic Preview</h3>
            <div className={`h-2 w-2 rounded-full ${formData.name ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`}></div>
          </div>
          
          <div className="relative group w-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
            <div className="aspect-[4/5] overflow-hidden bg-slate-50 relative">
              <SafeImage src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase rounded-full">
                    {formData.parent ? "Sub-Sector" : "Main Dept"}
                  </span>
                  {formData.isFeatured && <Star size={12} className="fill-amber-400 text-amber-400" />}
                </div>
                <h4 className="text-white font-black text-3xl uppercase italic tracking-tighter truncate">
                  {formData.name || "Unnamed"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-16 space-y-6 text-left">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
            <LayoutGrid size={16} className="text-amber-500" /> Taxonomy Overview
          </h3>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
          {fetching ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="animate-spin text-slate-200" size={40} />
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Syncing Matrix...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Classification</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Route Slug</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">Featured</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Array.isArray(structuredCategories) && structuredCategories.map((main) => (
                    <React.Fragment key={main._id}>
                      <tr className="group hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-sm">
                              <SafeImage src={main.image} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <span className="font-black text-slate-900 text-lg uppercase italic tracking-tighter">{main.name}</span>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">Root Department</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">/{main.slug}</span>
                        </td>
                        <td className="p-6 text-center">
                          {main.isFeatured && <Star size={16} className="mx-auto fill-amber-400 text-amber-400" />}
                        </td>
                        <td className="p-6 text-right">
                          <button onClick={() => deleteCategory(main._id)} className="p-3 text-slate-300 hover:text-rose-500 rounded-xl transition-all">
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                      {main.subCategories?.map((sub) => (
                        <tr key={sub._id} className="bg-slate-50/20">
                          <td className="p-4 pl-24">
                            <div className="flex items-center gap-4">
                                <ChevronRight size={14} className="text-slate-300" />
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm">
                                  <SafeImage src={sub.image} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-slate-600 uppercase text-xs">{sub.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold text-slate-400">/{sub.slug}</span>
                          </td>
                          <td className="p-4 text-center">
                            {sub.isFeatured && <Star size={12} className="mx-auto fill-amber-300 text-amber-300" />}
                          </td>
                          <td className="p-4 text-right pr-10">
                             <button onClick={() => deleteCategory(sub._id)} className="p-2 text-slate-200 hover:text-rose-400 transition-colors">
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