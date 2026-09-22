import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, 
  Layers, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  FileSpreadsheet, 
  Map, 
  ChevronRight
} from 'lucide-react';
import { GISMap } from '../components/GISMap';
import { LarrDossierModal } from '../components/LarrDossierModal';
import { NationalHierarchyFilterBar } from '../components/NationalHierarchyFilterBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProjects: 3,
    totalLandAcres: 5540.7,
    totalCostCr: 8280.0,
    totalParcels: 1230,
    acquiredParcels: 987,
    activeDisputes: 41,
    totalDbtDisbursedCr: 2840.5
  });

  const [parcels, setParcels] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, pRes, prjRes] = await Promise.all([
          axios.get('/api/dashboard/metrics'),
          axios.get('/api/parcels'),
          axios.get('/api/projects')
        ]);
        if (mRes.data) setMetrics(mRes.data);
        if (pRes.data) setParcels(pRes.data);
        if (prjRes.data) setProjects(prjRes.data);
      } catch (err) {
        console.warn('Using demo data fallback for dashboard');
      }
    };
    fetchData();
  }, []);

  const chartData = [
    { stage: 'Stage 1-3 SIA', parcels: 120 },
    { stage: 'Stage 4 Sec 11', parcels: 180 },
    { stage: 'Stage 5 DGPS', parcels: 210 },
    { stage: 'Stage 6-7 R&R', parcels: 190 },
    { stage: 'Stage 8-9 Sec 3G', parcels: 250 },
    { stage: 'Stage 10-11 DBT', parcels: 280 }
  ];

  const pieData = [
    { name: 'DBT Credited', value: 740, color: '#10b981' },
    { name: 'Award Pending', value: 449, color: '#f59e0b' },
    { name: 'Litigation Dispute', value: 41, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Universal National Hierarchy & Search Filter Bar (Matching Screenshot) */}
      <NationalHierarchyFilterBar />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm hover:border-amber-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>PARCELS TRACKED</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">41,876</div>
          <div className="text-xs text-amber-700 font-bold">36,403 Acquired (87%)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm hover:border-indigo-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>LAND ACQUIRED</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">150043.4 Ha</div>
          <div className="text-xs text-emerald-700 font-bold">Target: 178615.0 Ha</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm hover:border-emerald-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>DBT DISBURSED</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">₹ 682680.9 Cr</div>
          <div className="text-xs text-emerald-700 font-bold">100% PFMS Verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-sm hover:border-rose-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>ACTIVE OBJECTIONS</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600 font-mono">793 Cases</div>
          <div className="text-xs text-slate-600 font-bold">Sec 3C Dispute Radar</div>
        </div>
      </div>

      {/* Main Grid: GIS Map & Workflow Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Leaflet Cadastral Map (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Interactive Cadastral GIS & DGPS Survey Map</h3>
            </div>
            <span className="text-[11px] text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Live Geo-referenced Cadastre
            </span>
          </div>
          <div className="flex-1 min-h-[420px]">
            <GISMap parcels={parcels} onSelectParcel={(p) => setSelectedParcel(p)} />
          </div>
        </div>

        {/* Analytics & Stage Breakdown (1 Col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Acquisition Stage Breakdown</span>
            </h3>

            {/* Recharts Bar Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="stage" stroke="#475569" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="#475569" fontSize={10} fontWeight="bold" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar dataKey="parcels" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Disbursal Status */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="text-xs font-bold text-slate-900">Land Parcel Acquisition Status</div>
            <div className="flex items-center gap-4">
              <div className="h-28 w-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={40}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs flex-1">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-800 font-bold">{item.name}</span>
                    </div>
                    <span className="font-mono font-black text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Mega Infrastructure Projects</h3>
            <p className="text-xs text-slate-600 font-medium">Real-Time LARR 2013 Statutory Progress & Risk Score</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-[11px] uppercase font-black border-b border-slate-200">
                <th className="p-3.5">Project Code & Name</th>
                <th className="p-3.5">State / Districts</th>
                <th className="p-3.5">Executing Agency</th>
                <th className="p-3.5">Land Req. (Acres)</th>
                <th className="p-3.5">Current LARR Stage</th>
                <th className="p-3.5">Delay Risk Score</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {projects.map((prj) => (
                <tr key={prj.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <div className="font-extrabold text-slate-900 text-xs">{prj.name}</div>
                    <div className="text-[10px] text-amber-700 font-mono font-black">{prj.code}</div>
                  </td>
                  <td className="p-3.5 text-slate-800 font-semibold">
                    <div>{prj.state}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{prj.districts}</div>
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold">{prj.executingAgency}</td>
                  <td className="p-3.5 font-mono font-black text-slate-900">{prj.totalLandAcres} Acres</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                      Stage {prj.currentStage}/11
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            prj.riskScore > 35 ? 'bg-rose-600' : prj.riskScore > 20 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${prj.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-900 font-black">{prj.riskScore}/100</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right">
                    <a
                      href="/workflow"
                      className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-black"
                    >
                      <span>Workflow</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LARR Dossier Modal if parcel selected */}
      {selectedParcel && (
        <LarrDossierModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}
    </div>
  );
};
