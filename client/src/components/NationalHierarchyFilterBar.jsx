import React, { useState } from 'react';
import { Search, SlidersHorizontal, Layers, MapPin, Building2, ChevronDown } from 'lucide-react';

export const NationalHierarchyFilterBar = ({ onFilterChange }) => {
  const [stateFilter, setStateFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('PRJ-2026-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="space-y-4">
      {/* Dark Hierarchy & Universal Search Box */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-amber-500 tracking-wider">NATIONAL HIERARCHY:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              IN All India (36 States/UTs)
            </span>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors border border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filters ∨</span>
          </button>
        </div>

        {/* Universal Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Universal National Search: Project Name, Agency, District, State, ULPIN (Bhu-Aadhaar), Survey No, or Landowner..."
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* 6 Dropdown Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-[11px]">
          {/* 1. State / UT */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">1. STATE / UT (36)</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-lg p-2 outline-none"
            >
              <option value="All">All India (36 States & UTs)</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          {/* 2. District */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">2. DISTRICT (786)</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-lg p-2 outline-none"
            >
              <option value="All">All Districts</option>
              <option value="Alwar">Alwar</option>
              <option value="Palwal">Palwal</option>
              <option value="Sawai Madhopur">Sawai Madhopur</option>
              <option value="Vadodara">Vadodara</option>
            </select>
          </div>

          {/* 3. Sector / Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">3. SECTOR / TYPE (30)</label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-lg p-2 outline-none"
            >
              <option value="All">All Sectors (30)</option>
              <option value="Highway">National Highway</option>
              <option value="Railway">Rail Freight Corridor</option>
              <option value="Energy">Renewable Solar Park</option>
            </select>
          </div>

          {/* 4. Project */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">4. PROJECT (8)</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-slate-950 border border-amber-500/40 text-amber-400 font-bold rounded-lg p-2 outline-none"
            >
              <option value="PRJ-2026-01">Delhi-Mumbai Industrial Expressway (Phase IV)</option>
              <option value="PRJ-2026-02">Western Dedicated Freight Rail Corridor Spur Line</option>
              <option value="PRJ-2026-03">Bundelkhand 1200MW Mega Solar Infrastructure Park</option>
            </select>
          </div>

          {/* 5. Revenue Village */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">5. REVENUE VILLAGE (6)</label>
            <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-lg p-2 outline-none">
              <option value="All">All Villages</option>
              <option value="Bambora">Bambora</option>
              <option value="Kishangarh">Kishangarh</option>
              <option value="Palwal Rural">Palwal Rural</option>
            </select>
          </div>

          {/* 6. Parcel / ULPIN */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">6. PARCEL / ULPIN (5)</label>
            <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-lg p-2 outline-none">
              <option value="PCL-101">SRV-2026-88A - Ramesh Chandra Yadav</option>
              <option value="PCL-102">SRV-2026-88B - Suresh Kumar Meena</option>
              <option value="PCL-103">SRV-2026-90 - Sunita Devi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mode Selector Stepper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-900 font-black flex items-center gap-2">
              <span>LAND ACQUISITION & MANAGEMENT</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-800 border border-amber-500/30">ENGINE 1: STATUTORY LARR</span>
            </div>
            <p className="text-[10px] text-slate-500 font-normal">
              End-to-end land acquisition, parcel verification, compensation, R&R and project monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 rounded-xl border transition-all ${
              activeTab === 1
                ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-sm font-black'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            1. Project Acquisition
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeTab === 2
                ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-sm font-black'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>2. Land Dispute Radar</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-600 text-white font-extrabold">NEW</span>
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
              activeTab === 3
                ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-sm font-black'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>3. Route Simulator</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-slate-950 font-black">MCDA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
