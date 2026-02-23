import React, { useEffect, useState } from "react";
import { 
  Bell, CheckCircle2, Clock, Target, ShoppingCart, 
  TrendingUp, ArrowRight, Trash2, BarChart2, X 
} from "lucide-react";
import axios from "axios";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState(() => {
    // Load cleared notifications from local storage
    const saved = localStorage.getItem("dismissed_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const token = localStorage.getItem("token");
  const MONTHLY_TARGET = 500000; 

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // --- DYNAMIC CALCULATIONS ---
        const now = new Date();
        const currentMonth = now.getMonth();
        const lastMonth = currentMonth - 1;

        const currentRevenue = data
          .filter(o => new Date(o.createdAt).getMonth() === currentMonth)
          .reduce((sum, o) => sum + o.total, 0);

        const lastMonthRevenue = data
          .filter(o => new Date(o.createdAt).getMonth() === lastMonth)
          .reduce((sum, o) => sum + o.total, 0);

        // Calculate Growth %
        const growth = lastMonthRevenue > 0 
          ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 100;

        let dynamicList = [];

        // 1. Goal: Growth Notification
        if (growth > 0) {
          dynamicList.push({
            id: 'noti-growth',
            type: 'GROWTH',
            title: 'Business is Growing!',
            description: `Revenue is up by ${growth.toFixed(1)}% compared to last month.`,
            time: new Date(),
            status: 'Trending',
            icon: <BarChart2 className="text-emerald-500" size={20} />,
            color: 'bg-emerald-50'
          });
        }

        // 2. Goal: Progress Trackers
        const completion = (currentRevenue / MONTHLY_TARGET) * 100;
        if (completion >= 50) {
          dynamicList.push({
            id: 'noti-goal-50',
            type: 'MILESTONE',
            title: 'Halfway to Target',
            description: `You've reached 50% of your ₹${MONTHLY_TARGET.toLocaleString()} goal.`,
            time: new Date(),
            status: 'Dynamic',
            icon: <TrendingUp className="text-amber-500" size={20} />,
            color: 'bg-amber-50'
          });
        }

        // 3. Orders (Latest 15)
        const orderNotis = data.slice(0, 15).map(order => ({
          id: order._id,
          type: 'ORDER',
          title: `New Order: #${order._id.slice(-6).toUpperCase()}`,
          description: `Received ₹${order.total} from ${order.user?.name || 'Customer'}`,
          time: new Date(order.createdAt),
          status: order.status,
          icon: <ShoppingCart className="text-blue-500" size={20} />,
          color: 'bg-blue-50'
        }));

        // Filter out dismissed notifications
        const finalData = [...dynamicList, ...orderNotis]
          .filter(n => !dismissedIds.includes(n.id))
          .sort((a, b) => b.time - a.time);

        setNotifications(finalData);
        setLoading(false);
      } catch (err) {
        console.error("Data Sync Error:", err);
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, [token, dismissedIds]);

  // --- CLEAR NOTIFICATION LOGIC ---
  const handleClear = (id) => {
    const updatedDismissed = [...dismissedIds, id];
    setDismissedIds(updatedDismissed);
    localStorage.setItem("dismissed_notifications", JSON.stringify(updatedDismissed));
    // UI will auto-update because dismissedIds is in the useEffect dependency array
  };

  const handleClearAll = () => {
    const allIds = notifications.map(n => n.id);
    const updatedDismissed = [...dismissedIds, ...allIds];
    setDismissedIds(updatedDismissed);
    localStorage.setItem("dismissed_notifications", JSON.stringify(updatedDismissed));
  };

  return (
    <div className="p-4 lg:p-8 text-left max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Intelligence Feed</h1>
          <p className="text-slate-500 font-medium">Dynamic updates based on real-time store performance.</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-rose-50 hover:text-rose-600 transition-all uppercase tracking-widest"
          >
            <Trash2 size={16} /> Clear All Activity
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-[0.3em]">Syncing Intelligence...</div>
        ) : notifications.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <Bell size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest">Inbox is Clean</p>
          </div>
        ) : (
          notifications.map((noti) => (
            <div 
              key={noti.id} 
              className="group bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${noti.color} rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform`}>
                {noti.icon}
              </div>

              {/* Body */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase tracking-tighter">
                    {noti.type}
                  </span>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(noti.time).toLocaleDateString()}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{noti.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{noti.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                <button 
                  onClick={() => handleClear(noti.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Dismiss"
                >
                  <X size={20} />
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all">
                  Details <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;