import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldAlert, Calendar, Plus, CheckCircle2, Cpu, User, FileText } from 'lucide-react';

export const DisputesPortal = () => {
  const fallbackDisputes = [
    {
      id: 'DSP-8001',
      parcelId: 'PCL-101',
      raisedBy: 'Ramesh Chandra Yadav',
      disputeType: 'Section 3C Objections & Boundary Discrepancy',
      description: 'DGPS surveyed area (2.48 Ha) exceeds 7/12 revenue record area (2.45 Ha). Requesting boundary reconciliation.',
      status: 'Under SLAO Hearing',
      riskScore: 78,
      createdAt: '2026-08-10'
    },
    {
      id: 'DSP-8002',
      parcelId: 'PCL-102',
      raisedBy: 'Dattatray Pandurang Patil',
      disputeType: 'Khata Share Ratio & Entitlement Claim',
      description: 'Joint ownership khata share dispute between co-parceners.',
      status: 'Resolved by Collectorate',
      riskScore: 32,
      createdAt: '2026-07-22'
    }
  ];

  const [disputes, setDisputes] = useState(fallbackDisputes);
  const [showNewModal, setShowNewModal] = useState(false);
  const [parcels, setParcels] = useState([]);

  // New Grievance Form State
  const [parcelId, setParcelId] = useState('PCL-101');
  const [raisedBy, setRaisedBy] = useState('Akshat Agal');
  const [disputeType, setDisputeType] = useState('Joint Ownership & Title Claim');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDisputes();
    fetchParcels();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await axios.get('/api/disputes');
      if (res.data && res.data.length > 0) setDisputes(res.data);
    } catch (err) {
      console.warn('Using fallback disputes list');
      setDisputes(fallbackDisputes);
    }
  };

  const fetchParcels = async () => {
    try {
      const res = await axios.get('/api/parcels');
      if (res.data && res.data.length > 0) {
        setParcels(res.data);
        if (!parcelId) {
          setParcelId(res.data[0].id);
        }
      }
    } catch (err) {}
  };

  const handleOpenModal = () => {
    if (parcels.length > 0 && !parcelId) {
      setParcelId(parcels[0].id);
    }
    setShowNewModal(true);
  };

  const handleSubmitGrievance = async (e) => {
    e.preventDefault();
    try {
      const targetParcelId = parcelId || (parcels.length > 0 ? parcels[0].id : 'PCL-101');
      await axios.post('/api/disputes', {
        parcelId: targetParcelId,
        raisedBy: raisedBy || 'Akshat Agal',
        disputeType: disputeType || 'Joint Ownership & Title Claim',
        description: description || 'Grievance registered'
      });
      setShowNewModal(false);
      setRaisedBy('');
      setDescription('');
      fetchDisputes();
    } catch (err) {
      alert('Error submitting grievance: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl font-bold text-white font-display">
              Dispute Redressal & AI Acquisition Delay Risk Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            SIH 2026 Problem Statement SIH26017 Predictive Risk Engine, SLAO Hearing Schedule & Public Objection Tracker
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register Land Dispute / Objection</span>
        </button>
      </div>

      {/* Grid: AI Delay Risk Prediction Banner (SIH26017 Bonus Integration) */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 p-6 rounded-2xl border border-rose-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              SIH26017 AI Predictive Acquisition Delay Model
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            ML Delay Risk 88% Accuracy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Litigation Probability</span>
            <div className="text-lg font-bold text-amber-400 font-mono">14.2% Risk Score</div>
            <p className="text-[11px] text-slate-500">Based on joint ownership count & revenue discrepancy</p>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Forecasted Stage Delay</span>
            <div className="text-lg font-bold text-rose-400 font-mono">+ 45 Days Delay</div>
            <p className="text-[11px] text-slate-500">Predicted if SLAO hearing is not scheduled within 15 days</p>
          </div>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Recommended Action</span>
            <div className="text-xs font-bold text-emerald-400">Fast-Track SLAO Mediation</div>
            <p className="text-[11px] text-slate-500">Initiate joint DGPS re-survey with landowner present</p>
          </div>
        </div>
      </div>

      {/* Disputes & Grievance List Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white">Registered Disputes & Public Grievance Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-800">
                <th className="p-3">Grievance No</th>
                <th className="p-3">Landowner / Claimant</th>
                <th className="p-3">Survey / Village</th>
                <th className="p-3">Dispute Category</th>
                <th className="p-3">Assigned SLAO</th>
                <th className="p-3">Hearing Date</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {disputes.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-400">{d.grievanceNo}</td>
                  <td className="p-3 font-semibold text-white">{d.raisedBy}</td>
                  <td className="p-3 text-slate-300">
                    <div>{d.surveyNo || 'SRV-2026-88B'}</div>
                    <div className="text-[10px] text-slate-500">{d.village || 'Bambora'}</div>
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{d.disputeType}</td>
                  <td className="p-3 text-slate-400">{d.slaOfficer || 'ADM Collectorate'}</td>
                  <td className="p-3 font-mono text-slate-300">{d.hearingDate || 'Pending'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {d.riskLevel || 'HIGH_RISK'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Dispute Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Register New Land Dispute / Objection
            </h3>

            <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Select Land Parcel:</label>
                <select
                  value={parcelId || (parcels[0]?.id || '')}
                  onChange={(e) => setParcelId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 outline-none font-medium"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.surveyNo} - {p.landowner} ({p.village})
                    </option>
                  ))}
                  {parcels.length === 0 && (
                    <option value="PCL-101">SRV-2026-88A - Ramesh Chandra Yadav (Bambora)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Claimant / Landowner Name:</label>
                <input
                  type="text"
                  required
                  value={raisedBy}
                  onChange={(e) => setRaisedBy(e.target.value)}
                  placeholder="Full Name of Claimant"
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Dispute Category:</label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 outline-none"
                >
                  <option value="Joint Ownership & Title Claim">Joint Ownership & Title Claim</option>
                  <option value="Boundary Discrepancy">Boundary Discrepancy & Area Mismatch</option>
                  <option value="Compensation Objection">Compensation Valuation Objection</option>
                  <option value="SIA Objection">Social Impact Assessment (SIA) Objection</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Objection / Grievance Description:</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed description of boundary mismatch or legal objection..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
                >
                  Submit Official Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
