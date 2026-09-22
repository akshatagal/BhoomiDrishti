import React, { useState, useEffect } from 'react';
import { ShieldCheck, Globe, Clock } from 'lucide-react';

export const GovernmentTopBar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      };
      setCurrentTime(now.toLocaleString('en-IN', options) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 text-slate-300 px-6 py-1.5 text-[11px] flex flex-wrap items-center justify-between border-b border-slate-800 font-medium">
      {/* Left: Official Government Header Text */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-white font-bold">
          <span className="text-amber-500 font-serif font-black">भारत सरकार</span>
          <span>Government of India</span>
        </div>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">Ministry of Rural Development</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">MoRTH</span>
        <span className="text-slate-600">•</span>
        <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-extrabold border border-emerald-500/30">
          DILRMP 3.0
        </span>
      </div>

      {/* Right: Live Gateway Sync, Time & Language Switcher */}
      <div className="flex items-center gap-4">
        {/* NIC Gateway Synced Badge */}
        <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>NIC Gateway Synced</span>
        </div>

        {/* Live IST Clock */}
        <div className="hidden md:flex items-center gap-1 text-slate-300 font-mono text-[10px]">
          <Clock className="w-3 h-3 text-amber-500" />
          <span>{currentTime || '22 Sept 2026 | 05:27:26 pm IST'}</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(l => (l === 'EN' ? 'HI' : 'EN'))}
          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
        >
          <Globe className="w-3 h-3 text-amber-500" />
          <span className="font-bold">{lang === 'EN' ? 'EN | हिंदी' : 'हिंदी | EN'}</span>
        </button>
      </div>
    </div>
  );
};
