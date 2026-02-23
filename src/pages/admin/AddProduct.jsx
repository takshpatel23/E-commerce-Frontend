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
  ChevronDown,
  Layers,
  Filter
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
        toast.error("Failed to load categories");
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
        .catch(() => toast.error("Failed to fetch product details"));
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
    if (!selectedMainId) return "Uncategorized";
    const foundMain = allCategories.find(cat => cat._id === selectedMainId);
    return foundMain ? foundMain.name : "Department";
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
    if (!formData.category) return toast.error("Please select a sub-category");
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
        toast.success("Updated ✨");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, payload, config);
        toast.success("Published ✨");
      }
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 font-sans">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="text-left">
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{productId ? "Edit Product" : "New Inventory"}</h1>
           <p className="text-slate-400 text-xs md:text-sm">Fill in the details for your collection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* FORM COLUMN */}
        <div className="lg:col-span-2 order-2 lg:order-1 bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6 text-left">

            {/* Product Name */}
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Slim Fit Denim Jacket"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-medium transition-all"
                  required
                />
            </div>

            {/* Dual Category Dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Department</label>
                  <div className="relative">
                    <select
                      value={selectedMainId}
                      onChange={handleMainCategoryChange}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Choose Dept...</option>
                      {Array.isArray(allCategories) && allCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16}/>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub-Category</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={!selectedMainId}
                      className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-medium appearance-none cursor-pointer disabled:opacity-50"
                      required
                    >
                      <option value="">Select Sub...</option>
                      {Array.isArray(subCategories) && subCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                    <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16}/>
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (INR)</label>
               <input
                 type="number"
                 name="price"
                 value={formData.price}
                 onChange={handleChange}
                 placeholder="999"
                 className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-medium transition-all"
                 required
               />
            </div>

            {/* Images */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Media (URLs)</label>
               {formData.image.map((img, index) => (
                <div key={index} className="flex gap-2 md:gap-3">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://..."
                    className="flex-1 p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500 text-sm"
                    required
                  />
                  <button type="button" onClick={() => removeImageField(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addImageField} className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-tighter hover:text-amber-700 transition-colors pt-1">
                <Plus size={14} /> Add Another URL
              </button>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marketing Description</label>
               <textarea
                 name="description"
                 value={formData.description}
                 onChange={handleChange}
                 rows="3"
                 placeholder="What makes this product special?"
                 className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800 transition-all resize-none"
               />
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sizes</label>
              {formData.sizes.map((s, index) => (
                <div key={index} className="flex gap-2 md:gap-3 mt-1">
                  <input
                    type="text" value={s.size} placeholder="e.g. XL"
                    onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                    className="flex-1 p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500 text-sm"
                    required
                  />
                  <input
                    type="number" value={s.quantity} placeholder="Qty"
                    onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                    className="w-20 md:w-24 p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-amber-500 text-sm"
                    required
                  />
                  <button type="button" onClick={() => removeSize(index)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSize} className="flex items-center gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-tighter hover:text-amber-700 transition-colors pt-1">
                <Plus size={14} /> Add Size Variant
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 mt-4 md:mt-6"
            >
              {loading ? "Synchronizing..." : productId ? "Save Changes" : "Create Product"}
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW COLUMN */}
        <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 text-left">Storefront Preview</h3>
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden lg:sticky lg:top-8 text-left">
            <div className="h-56 md:h-72 bg-slate-50 relative group">
              {formData.image[0] ? (
                <img src={formData.image[0]} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex justify-center items-center h-full text-slate-200">
                  <ImageIcon size={64} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-800 border border-slate-100 shadow-sm flex items-center gap-1">
                <Layers size={10} className="text-amber-500" /> {getDisplayCategory()}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-black text-lg md:text-xl text-slate-900 truncate">
                  {formData.name || "Product Name"}
                </h3>
                <p className="text-amber-600 font-black text-base md:text-lg whitespace-nowrap">
                  ₹{formData.price || "0"}
                </p>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 italic leading-relaxed">
                {formData.description || "The product description will render here."}
              </p>
              
              <div className="flex gap-2 pt-2 overflow-x-auto no-scrollbar">
                 {formData.sizes.map((s, i) => (
                    s.size && <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 whitespace-nowrap">{s.size} ({s.quantity})</span>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;