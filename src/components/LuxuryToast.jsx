import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, X } from 'lucide-react';

const LuxuryToast = ({ message, type, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const duration = 5000; // 5 seconds

  useEffect(() => {
    const interval = 50; // Update every 50ms
    const step = (interval / duration) * 100;

    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            onClose();
            return 0;
          }
          return prev - step;
        });
      }, interval);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused, onClose]);

  return (
    <div 
      className="fixed top-32 right-10 z-[250] animate-in slide-in-from-top-5 fade-in duration-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`
        relative overflow-hidden flex items-center gap-6 px-8 py-5 rounded-[2rem] 
        shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl border
        ${type === 'success' ? 'bg-slate-900/95 border-amber-500/50' : 'bg-rose-950/95 border-rose-500/50'}
      `}>
        {/* PROGRESS BAR */}
        <div 
          className="absolute bottom-0 left-0 h-[3px] transition-all ease-linear"
          style={{ 
            width: `${progress}%`, 
            backgroundColor: type === 'success' ? '#f59e0b' : '#f43f5e', // Amber or Rose
            boxShadow: type === 'success' ? '0 0 10px #f59e0b' : '0 0 10px #f43f5e'
          }}
        />

        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${type === 'success' ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
          {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
        </div>

        <div className="text-left pr-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">System Notification</p>
          <p className="text-sm font-bold text-white tracking-tight leading-tight">{message}</p>
        </div>

        <button 
          onClick={onClose} 
          className="p-2 -mr-2 text-slate-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default LuxuryToast;