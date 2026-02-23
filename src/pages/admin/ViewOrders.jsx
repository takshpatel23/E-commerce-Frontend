import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Package,
    ArrowUpRight,
    X,
    Truck,
    Calendar,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Hash
} from "lucide-react";

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOrder, setModalOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const validatedData = Array.isArray(data) ? data : (data.orders || []);
                // Sort by newest first by default
                setOrders(validatedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error("Error fetching orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const safeOrders = Array.isArray(orders) ? orders : [];
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = safeOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(safeOrders.length / ordersPerPage) || 1;

    const updateStatus = async (orderId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
            if (modalOrder?._id === orderId) setModalOrder({ ...modalOrder, status });
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <div className="w-16 h-16 border-[3px] border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                <Hash className="absolute inset-0 m-auto text-slate-300 animate-pulse" size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] mt-8 text-slate-400">Syncing Ledger Archive</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-950 font-sans text-left selection:bg-amber-100">
            <div className="max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-12">

                {/* --- HEADER --- */}
                <header className="border-b-[6px] border-slate-950 pb-16 mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest">Secure Node</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">System / Transaction Logs</span>
                        </div>
                        <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8]">
                            The Ledger<span className="not-italic text-slate-200">.</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-12 md:gap-20 border-l border-slate-100 pl-12 md:pl-20">
                        <StatBox label="Archived Volume" value={safeOrders.length} />
                        <StatBox label="Index" value={`${currentPage}/${totalPages}`} />
                    </div>
                </header>

                {/* --- TOOLBAR --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Search size={18} className="text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="SEARCH BY ENTRY ID..." 
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none w-full md:w-64"
                        />
                    </div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-950 transition-colors">
                            <Filter size={14} /> Filter Range
                        </div>
                        <select
                            value={ordersPerPage}
                            onChange={(e) => { setOrdersPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-transparent border-b-2 border-slate-950 text-[10px] font-black uppercase tracking-widest py-1 focus:outline-none cursor-pointer"
                        >
                            <option value={10}>Show 10</option>
                            <option value={20}>Show 20</option>
                            <option value={50}>Show 50</option>
                        </select>
                    </div>
                </div>

                {/* --- ORDER LIST --- */}
                <div className="space-y-4">
                    {safeOrders.length === 0 ? (
                        <div className="py-48 text-center border-2 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/50">
                            <Package className="mx-auto text-slate-200 mb-8" size={64} strokeWidth={1} />
                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">No Active Logs Detected</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40">
                            <div className="hidden md:grid grid-cols-5 px-12 py-6 bg-slate-50 border-b border-slate-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reference</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Consignee</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Valuation</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Protocol</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Action</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {currentOrders.map((order) => (
                                    <OrderRow key={order._id} order={order} onDetails={() => setModalOrder(order)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- PAGINATION --- */}
                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-16">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] disabled:opacity-10 hover:text-amber-600 transition-colors"
                        >
                            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Previous
                        </button>
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${currentPage === i + 1 ? 'bg-slate-950 w-8' : 'bg-slate-200'} transition-all duration-500`}></div>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] disabled:opacity-10 hover:text-amber-600 transition-colors"
                        >
                            Next <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {modalOrder && (
                <DetailModal order={modalOrder} onClose={() => setModalOrder(null)} onUpdate={updateStatus} />
            )}
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const OrderRow = ({ order, onDetails }) => (
    <div className="group md:grid md:grid-cols-5 items-center px-6 md:px-12 py-10 hover:bg-slate-50/80 transition-all duration-300">
        <div className="mb-4 md:mb-0">
            <p className="text-[10px] md:text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 md:hidden">Entry ID</p>
            <p className="text-xl font-black tracking-tighter text-slate-900 italic">#{order._id?.slice(-6).toUpperCase()}</p>
        </div>

        <div className="mb-6 md:mb-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 md:hidden">Customer</p>
            <p className="text-sm font-bold tracking-tight text-slate-700 uppercase">{order.userName || order.user?.name || 'Restricted'}</p>
        </div>

        <div className="mb-6 md:mb-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 md:hidden">Valuation</p>
            <p className="text-2xl font-black tracking-tighter text-slate-950 leading-none">₹{order.total?.toLocaleString()}</p>
        </div>

        <div className="flex md:justify-center mb-8 md:mb-0">
            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                order.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                order.status === 'Cancelled' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                'bg-slate-50 border-slate-200 text-slate-500 animate-pulse'
            }`}>
                {order.status}
            </span>
        </div>

        <div className="flex justify-end">
            <button
                onClick={onDetails}
                className="w-14 h-14 rounded-[1.5rem] border border-slate-200 flex items-center justify-center bg-white group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 group-hover:rotate-45"
            >
                <ArrowUpRight size={22} />
            </button>
        </div>
    </div>
);

const DetailModal = ({ order, onClose, onUpdate }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl transition-all duration-700" onClick={onClose}></div>
        
        <div className="relative bg-white w-full max-w-7xl h-[90vh] md:h-[80vh] shadow-[0_0_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:grid md:grid-cols-12 rounded-[3.5rem] animate-in zoom-in-95 duration-500">
            
            {/* --- SIDEBAR --- */}
            <div className="md:col-span-3 bg-slate-50 p-12 flex flex-col justify-between border-r border-slate-100">
                <div className="space-y-16">
                    <button onClick={onClose} className="p-4 bg-white hover:bg-slate-950 hover:text-white rounded-2xl transition-all shadow-sm group">
                        <X size={24} className="group-hover:rotate-90 transition-transform" />
                    </button>
                    
                    <div className="space-y-12">
                        <div>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.5em] mb-4">Ref. Node</p>
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{order._id?.slice(-8)}</h3>
                        </div>
                        <div className="space-y-8">
                            <ModalStat icon={<Calendar size={16} />} label="Filing Date" value={new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} />
                            <ModalStat icon={<Truck size={16} />} label="Logistics" value="Direct Dispatch" />
                            <ModalStat icon={<CreditCard size={16} />} label="Settlement" value="Auth Verified" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {order.status === "Pending" && (
                        <>
                            <button onClick={() => onUpdate(order._id, "Completed")} className="w-full bg-slate-950 text-white py-6 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-slate-200"> Verify & Close </button>
                            <button onClick={() => onUpdate(order._id, "Cancelled")} className="w-full border-2 border-slate-200 text-rose-600 py-6 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all duration-500"> Terminate </button>
                        </>
                    )}
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="md:col-span-9 p-10 md:p-20 overflow-y-auto custom-scrollbar bg-white">
                <div className="flex justify-between items-end mb-16 border-b border-slate-100 pb-12">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 mb-4">Manifest Contents</h4>
                        <h5 className="text-6xl font-black tracking-tighter uppercase italic">Inventory Log</h5>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Value</p>
                        <p className="text-5xl font-black tracking-tighter text-slate-950">₹{order.total?.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {order.items?.map((item, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row justify-between items-center p-8 bg-slate-50/50 hover:bg-white border border-slate-50 hover:border-slate-100 rounded-[2.5rem] transition-all duration-500 group">
                            <div className="flex items-center gap-10 w-full md:w-auto">
                                <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden flex-shrink-0 border border-slate-100 p-2 shadow-sm">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                                            <Package size={32} strokeWidth={1} />
                                        </div>
                                    )}
                                </div>

                                <div className="text-left space-y-2">
                                    <p className="text-xl font-black text-slate-950 uppercase tracking-tight">{item.name}</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black bg-slate-950 text-white px-3 py-1 rounded-full uppercase tracking-widest">Qty: {item.quantity}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate: ₹{item.price?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 text-right w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-slate-100">
                                <p className="text-3xl font-black italic tracking-tighter text-slate-950">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const StatBox = ({ label, value }) => (
    <div className="text-left group cursor-default">
        <p className="text-[10px] font-black text-slate-400 group-hover:text-amber-600 uppercase tracking-[0.4em] mb-2 transition-colors">{label}</p>
        <p className="text-5xl font-black tracking-tighter leading-none">{value}</p>
    </div>
);

const ModalStat = ({ icon, label, value }) => (
    <div className="flex items-center gap-6 text-left group">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-slate-950 border border-slate-100 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-slate-950 transition-colors">{label}</p>
            <p className="text-sm font-black text-slate-950 tracking-tight mt-1">{value}</p>
        </div>
    </div>
);

export default ViewOrders;