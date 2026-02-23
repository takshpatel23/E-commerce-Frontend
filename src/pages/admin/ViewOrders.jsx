import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Package,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    X,
    Truck,
    Calendar,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Layers,
    Clock
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
                const { data } = await axios.get("${import.meta.env.VITE_API_URL}/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(data);
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
            <div className="w-12 h-12 border-t-2 border-slate-900 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-6 text-slate-400">Initializing Archive</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-950 font-sans selection:bg-amber-100 selection:text-amber-900">
            <div className="max-w-7xl mx-auto pt-32 pb-24 px-6 lg:px-12">

                {/* --- HEADER --- */}
                <header className="border-b border-slate-900 pb-16 mb-12 flex flex-col md:flex-row justify-between items-baseline gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-amber-600">
                            <span className="w-8 h-[1px] bg-amber-600"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Internal System v2.0</span>
                        </div>
                        <h2 className="text-7xl font-black uppercase tracking-tighter italic leading-none">
                            The Ledger<span className="not-italic text-slate-200">.</span>
                        </h2>
                    </div>
                    <div className="flex gap-16 border-l border-slate-100 pl-16">
                        <StatBox label="Archived Volume" value={orders.length} />
                        <StatBox label="Page Index" value={`${currentPage} of ${totalPages}`} />
                    </div>
                </header>

                {/* --- CONTROLS --- */}
                <div className="flex justify-between items-center mb-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Index {indexOfFirstOrder + 1} — {Math.min(indexOfLastOrder, orders.length)}
                    </p>
                    <select
                        value={ordersPerPage}
                        onChange={(e) => { setOrdersPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-transparent border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest py-1 focus:outline-none cursor-pointer"
                    >
                        <option value={10}>Show 10</option>
                        <option value={20}>Show 20</option>
                        <option value={50}>Show 50</option>
                    </select>
                </div>

                {/* --- LIST --- */}
                {orders.length === 0 ? (
                    <div className="py-40 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <Package className="mx-auto text-slate-200 mb-6" size={48} strokeWidth={1} />
                        <p className="text-slate-400 font-medium italic tracking-wide">The archive is currently silent.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 border-t border-slate-100">
                        {currentOrders.map((order) => (
                            <OrderRow key={order._id} order={order} onDetails={() => setModalOrder(order)} onUpdate={updateStatus} />
                        ))}
                    </div>
                )}

                {/* --- PAGINATION --- */}
                <div className="mt-20 flex justify-center items-center gap-12">
                    <button
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <div className="flex gap-4">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300 hover:text-slate-900'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === totalPages}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-20"
                    >
                        Next <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* --- LUXE MODAL --- */}
            {modalOrder && (
                <DetailModal order={modalOrder} onClose={() => setModalOrder(null)} onUpdate={updateStatus} />
            )}
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const OrderRow = ({ order, onDetails, onUpdate }) => (
    <div className="group flex flex-col md:flex-row items-center justify-between py-10 hover:bg-white transition-colors px-4">
        <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto">
            <div className="text-left">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em] mb-1">Entry ID</p>
                <p className="text-xl font-black tracking-tighter">#{order._id.slice(-6).toUpperCase()}</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>
            <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Commissioned By</p>
                <p className="text-lg font-bold tracking-tight text-slate-700">{order.userName}</p>
            </div>
        </div>

        <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Valuation</p>
                <p className="text-2xl font-black tracking-tighter">₹{order.total.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        order.status === 'Cancelled' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                    {order.status}
                </span>
                <button
                    onClick={onDetails}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
                >
                    <ArrowUpRight size={18} />
                </button>
            </div>
        </div>
    </div>
);

const DetailModal = ({ order, onClose, onUpdate }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white w-full max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 rounded-sm">

            {/* Split Pane - Side Info */}
            <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col">
                <button onClick={onClose} className="mb-12 self-start p-3 bg-white hover:bg-slate-950 hover:text-white rounded-full transition-all shadow-sm">
                    <X size={20} />
                </button>

                <div className="space-y-10 flex-grow">
                    <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-2">Ref. Index</p>
                        <h3 className="text-3xl font-black tracking-tighter uppercase italic">{order._id.slice(-8)}</h3>
                    </div>

                    <div className="space-y-6">
                        <ModalStat
                            icon={<Calendar size={14} />}
                            label="Timestamp"
                            value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            })}
                        />                        <ModalStat icon={<Truck size={14} />} label="Logistics" value="Standard Freight" />
                        <ModalStat icon={<CreditCard size={14} />} label="Settlement" value="Verified" />
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 space-y-3">
                    {order.status === "Pending" && (
                        <>
                            <button
                                onClick={() => onUpdate(order._id, "Completed")}
                                className="w-full bg-slate-950 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                            > Approve Transaction </button>
                            <button
                                onClick={() => onUpdate(order._id, "Cancelled")}
                                className="w-full border border-slate-200 text-rose-600 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-colors"
                            > Void Entry </button>
                        </>
                    )}
                </div>
            </div>

            {/* Split Pane - Manifest */}
            <div className="flex-grow p-10 md:p-16 overflow-y-auto">
                <div className="flex justify-between items-start mb-16">
                    <div>
                        <h4 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Manifest</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Order Breakdown & Valuation</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Commissioned By</p>
                        <p className="text-xl font-bold tracking-tight">{order.userName}</p>
                    </div>
                </div>

                <div className="space-y-1 divide-y divide-slate-100">
                    {order.items.map((item) => (
                        <div key={item._id} className="py-6 flex items-center justify-between group">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-slate-50 overflow-hidden rounded-smtransition-all">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-950 uppercase tracking-tight text-lg">{item.name}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Qty: {item.quantity} — Size: {item.selectedSize || 'N/A'}</p>
                                </div>
                            </div>
                            <p className="text-xl font-black tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t-2 border-slate-950 flex justify-between items-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Total Manifest Valuation</p>
                    <p className="text-5xl font-black tracking-tighter italic">₹{order.total.toLocaleString()}</p>
                </div>
            </div>
        </div>
    </div>
);

const StatBox = ({ label, value }) => (
    <div className="text-left">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
);

const ModalStat = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-900 border border-slate-100">{icon}</div>
        <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-[11px] font-bold text-slate-900 tracking-tight mt-0.5">{value}</p>
        </div>
    </div>
);

export default ViewOrders;