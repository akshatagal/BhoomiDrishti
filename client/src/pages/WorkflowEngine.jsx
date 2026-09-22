import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  GitMerge, 
  FileText, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { LarrDossierModal } from '../components/LarrDossierModal';

export const WorkflowEngine = () => {
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showDossier, setShowDossier] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState('');

  const isSlaoOrAdmin = user?.role === 'slao' || user?.role === 'central_admin';
  const isSurveyor = user?.role === 'surveyor';
  const isLandowner = user?.role === 'landowner';

  const larrStages = [
    { stage: 1, title: 'Preliminary Proposal', law: 'LARR Sec 4', desc: 'Project alignment & preliminary boundary identification' },
    { stage: 2, title: 'Social Impact Assessment', law: 'LARR Sec 4-6', desc: 'SIA public hearing & environmental impact study' },
    { stage: 3, title: 'Expert Group Review', law: 'LARR Sec 7', desc: 'Independent multi-disciplinary expert approval' },
    { stage: 4, title: 'Sec 11 Preliminary Notice', law: 'LARR Sec 11', desc: 'Gazette preliminary notification & objections log' },
    { stage: 5, title: 'DGPS Boundary Cadastre', law: 'Survey of India', desc: 'Drone aerial survey & high-precision DGPS demarcation' },
    { stage: 6, title: 'R&R Scheme Formulation', law: 'LARR Sec 16-18', desc: 'Rehabilitation & Resettlement family entitlement plan' },
    { stage: 7, title: 'Sec 19 Declaration', law: 'LARR Sec 19', desc: 'Final land acquisition declaration in official gazette' },
    { stage: 8, title: 'Market Value Valuation', law: 'LARR Sec 26-29', desc: 'Circle rate, rural multiplier (1.2x-2x) & solatium calculation' },
    { stage: 9, title: 'Sec 3G Award Declaration', law: 'LARR Sec 3G/30', desc: 'Statutory SLAO final compensation award declaration' },
    { stage: 10, title: 'DBT Payment Disbursal', law: 'PFMS Direct Transfer', desc: '100% Direct Benefit Transfer to verified landowner bank A/c' },
    { stage: 11, title: 'Possession & Mutation', law: 'LARR Sec 38/ Revenue', desc: 'Final land handover & revenue records mutation entry' }
  ];

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const res = await axios.get('/api/parcels');
      if (res.data && res.data.length > 0) {
        setParcels(res.data);
        fetchParcelDetails(res.data[0].id);
      }
    } catch (err) {
      console.warn('Using fallback parcel details');
    }
  };

  const fetchParcelDetails = async (id) => {
    try {
      const res = await axios.get(`/api/parcels/${id}`);
      setSelectedParcel(res.data);
    } catch (err) {
      console.warn('Failed to fetch parcel details');
    }
  };

  const handleAdvanceStage = async () => {
    if (!selectedParcel || !isSlaoOrAdmin) return;
    setLoading(true);
    try {
      const nextStage = selectedParcel.currentStage + 1;
      await axios.post(`/api/parcels/${selectedParcel.id}/advance-stage`, {
        targetStage: nextStage,
        verifiedBy: user?.name || 'SLAO Officer',
        remarks: remarks || 'Statutory LARR criteria verified and approved.'
      });
      setRemarks('');
      await fetchParcelDetails(selectedParcel.id);
      await fetchParcels();
    } catch (err) {
      alert('Error advancing stage');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedParcel) {
    return <div className="p-8 text-center text-slate-500 font-bold">Loading LARR 2013 Workflow Engine...</div>;
  }

  const currentStageInfo = larrStages[selectedParcel.currentStage - 1] || larrStages[10];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-black text-slate-900 font-display">
              11-Stage Statutory LARR Acquisition Workflow Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Active Role Persona: <span className="font-bold text-amber-700 uppercase">{user?.designation || user?.role}</span>
          </p>
        </div>

        {/* Parcel Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Select Land Parcel:</span>
          <select
            value={selectedParcel.id}
            onChange={(e) => fetchParcelDetails(e.target.value)}
            className="bg-slate-100 border border-slate-300 text-slate-900 text-xs font-extrabold rounded-xl px-3.5 py-2 outline-none"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.surveyNo} - {p.landowner} ({p.village})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 11-Stage Stepper Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 overflow-x-auto">
        <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
          Statutory LARR 2013 Acquisition Progress Stepper
        </div>
        <div className="flex items-center gap-2 min-w-[900px] py-2">
          {larrStages.map((s) => {
            const isCompleted = s.stage < selectedParcel.currentStage;
            const isCurrent = s.stage === selectedParcel.currentStage;

            return (
              <React.Fragment key={s.stage}>
                <div
                  className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black'
                      : isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                      : 'bg-slate-100 border-slate-200 text-slate-600 font-medium'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase font-black">Stage {s.stage}</div>
                  <div className="text-[11px] font-bold truncate mt-0.5">{s.title}</div>
                  <div className="text-[9px] opacity-80 font-semibold">{s.law}</div>
                </div>
                {s.stage < 11 && <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Grid: Active Stage Details & Role-Based Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Stage & Advance Action (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-black uppercase text-amber-700 tracking-wider">
                CURRENT ACTIVE STAGE: STAGE {selectedParcel.currentStage} OF 11
              </div>
              <h3 className="text-lg font-black text-slate-900">{currentStageInfo.title}</h3>
              <p className="text-xs text-slate-600 font-medium">{currentStageInfo.desc} ({currentStageInfo.law})</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              {selectedParcel.acquisitionStatus}
            </span>
          </div>

          {/* Parcel Statutory Particulars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Landowner Name</span>
              <span className="font-extrabold text-slate-900">{selectedParcel.landowner}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Survey / Khasra No</span>
              <span className="font-bold text-amber-700">{selectedParcel.surveyNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Official Land Area</span>
              <span className="font-mono text-emerald-700 font-black">{selectedParcel.officialAreaHa} Hectares</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold uppercase">DGPS Survey Status</span>
              <span className="font-bold text-slate-800">{selectedParcel.dgpsStatus}</span>
            </div>
          </div>

          {/* Role-Based Dynamic Control Box */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-4">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Persona Capabilities: {user?.designation || user?.role}</span>
            </h4>

            {/* SLAO / Admin Controls */}
            {isSlaoOrAdmin && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-800 font-bold">SLAO Approval Remarks / Gazette Reference:</label>
                  <input
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Section 11 gazette published. Objections evaluated under Sec 15."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-medium outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setShowDossier(true)}
                    className="px-4 py-2.5 bg-white text-amber-800 hover:bg-slate-100 font-extrabold rounded-xl text-xs border border-slate-300 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>View Statutory Section 3G Award</span>
                  </button>

                  <button
                    onClick={handleAdvanceStage}
                    disabled={loading || selectedParcel.currentStage >= 11}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    <span>
                      {selectedParcel.currentStage >= 11
                        ? 'Acquisition Completed'
                        : `Approve & Advance to Stage ${selectedParcel.currentStage + 1}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Surveyor Controls */}
            {isSurveyor && (
              <div className="space-y-3">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 font-medium">
                  <strong>Surveyor Mode:</strong> You can inspect DGPS plot coordinates, verify boundary markers, and upload aerial drone survey orthomosaics.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.location.href = '/gis'}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Open DGPS Cadastral Studio
                  </button>
                  <button
                    onClick={() => setShowDossier(true)}
                    className="px-4 py-2.5 bg-white text-slate-800 font-bold rounded-xl text-xs border border-slate-300"
                  >
                    View Survey Dossier
                  </button>
                </div>
              </div>
            )}

            {/* Landowner Read-Only View */}
            {isLandowner && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Landowner Transparency Mode:</strong> You have read-only access to track your plot acquisition & view your certified Section 3G statutory award.</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDossier(true)}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Download My Award Certificate</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/disputes'}
                    className="px-4 py-2.5 bg-white text-rose-700 border border-rose-300 font-bold rounded-xl text-xs hover:bg-rose-50 transition-colors"
                  >
                    File Objection / Grievance
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Workflow Audit Trail History (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
            Statutory Workflow Audit Log
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {selectedParcel.workflowHistory && selectedParcel.workflowHistory.length > 0 ? (
              selectedParcel.workflowHistory.map((wf) => (
                <div key={wf.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-800">Stage {wf.stageNumber}: {wf.stageName}</span>
                    <span className="text-[10px] text-emerald-700 font-black">{wf.status}</span>
                  </div>
                  <div className="text-slate-700 text-[11px] font-medium">{wf.remarks}</div>
                  <div className="text-[10px] text-slate-500 flex justify-between pt-1 font-semibold">
                    <span>Verified by: {wf.verifiedBy}</span>
                    <span>{new Date(wf.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl font-medium">
                Initial stage logs recorded. Advance stage as SLAO to generate audit entries.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LARR Statutory Dossier Modal */}
      {showDossier && (
        <LarrDossierModal parcel={selectedParcel} onClose={() => setShowDossier(false)} />
      )}
    </div>
  );
};
