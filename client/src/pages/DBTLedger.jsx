import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle2, Clock, Landmark, Send, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const DBTLedger = () => {
  const [dbtList, setDbtList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parcels, setParcels] = useState([]);

  // New DBT Form
  const [parcelId, setParcelId] = useState('');
  const [landownerName, setLandownerName] = useState('Ramesh Chandra Yadav');
  const [bankAccount, setBank] = useState('PUNB01239910441');
  const [ifscCode, setIfsc] = useState('PUNB0123991');
  const [amountCr, setAmount] = useState('3.8546');

  useEffect(() => {
    fetchDbt();
    fetchParcels();
  }, []);

  const fetchDbt = async () => {
    try {
      const res = await axios.get('/api/dbt');
      if (res.data) setDbtList(res.data);
    } catch (err) {
      console.warn('Using fallback DBT ledger');
    }
  };

  const fetchParcels = async () => {
    try {
      const res = await axios.get('/api/parcels');
      if (res.data && res.data.length > 0) {
        setParcels(res.data);
        setParcelId(res.data[0].id);
      }
    } catch (err) {}
  };

  const handleTriggerDbt = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/dbt/transfer', {
        parcelId,
        landownerName,
        bankAccount,
        ifscCode,
        amountCr: parseFloat(amountCr)
      });
      fetchDbt();
      alert('Direct Benefit Transfer successfully processed via PFMS Gateway!');
    } catch (err) {
      alert('Error triggering DBT transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white font-display">
              Direct Benefit Transfer (DBT) & PFMS Disbursement Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-Time Public Financial Management System (PFMS) Gateway Payment Tracking & Bank Account Verification
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Aadhaar & PFMS Verified</span>
        </div>
      </div>

      {/* Grid: Trigger DBT Box & Ledger Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger DBT Disbursal Box (1 Col) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span>Process PFMS DBT Disbursal</span>
          </h3>

          <form onSubmit={handleTriggerDbt} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Target Land Parcel:</label>
              <select
                value={parcelId}
                onChange={(e) => {
                  setParcelId(e.target.value);
                  const p = parcels.find((x) => x.id === e.target.value);
                  if (p) setLandownerName(p.landowner);
                }}
                className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded-xl p-2.5 outline-none"
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.surveyNo} - {p.landowner} ({p.village})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Beneficiary Name:</label>
              <input
                type="text"
                required
                value={landownerName}
                onChange={(e) => setLandownerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Bank Account No:</label>
                <input
                  type="text"
                  required
                  value={bankAccount}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-mono rounded-xl p-2.5 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">IFSC Code:</label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-mono rounded-xl p-2.5 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Statutory Award Amount (₹ Crores):</label>
              <input
                type="number"
                step="0.0001"
                required
                value={amountCr}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm rounded-xl p-2.5 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Processing PFMS Gateway...' : 'Disburse Statutory DBT Award via PFMS'}
            </button>
          </form>
        </div>

        {/* Live DBT Transaction Ledger (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            Real-Time PFMS Gateway Disbursement Transaction History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-800">
                  <th className="p-3">PFMS Reference ID</th>
                  <th className="p-3">Beneficiary Landowner</th>
                  <th className="p-3">Bank A/c & IFSC</th>
                  <th className="p-3 text-right">Award Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
                {dbtList.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-400">{d.pfmsRefNo}</td>
                    <td className="p-3 font-semibold text-white">{d.landownerName}</td>
                    <td className="p-3 text-slate-300 font-mono text-[11px]">
                      <div>{d.bankAccount}</div>
                      <div className="text-[10px] text-slate-500">{d.ifscCode}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      ₹ {(d.amountCr || 0).toFixed(4)} Cr
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                        d.status === 'SUCCESSFUL_CREDITED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {d.status === 'SUCCESSFUL_CREDITED' ? 'CREDITED VIA PFMS' : 'AWAITING APPROVAL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
