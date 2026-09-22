import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, ShieldCheck, Printer, FileText, ArrowRight, Landmark, RefreshCw } from 'lucide-react';
import { LarrDossierModal } from '../components/LarrDossierModal';

export const LARRCalculator = () => {
  const [areaHa, setAreaHa] = useState(2.45);
  const [marketRateLakhs, setMarketRateLakhs] = useState(45.0);
  const [isRural, setIsRural] = useState(true);
  const [landCategory, setLandCategory] = useState('Rural Standard');
  const [interestYears, setInterestYears] = useState(1.5);
  const [assetsValueLakhs, setAssetsValueLakhs] = useState(35.0);
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Calculations
  const baseLandValueCr = (parseFloat(areaHa || 0) * parseFloat(marketRateLakhs || 0)) / 100.0;
  const multiplier = isRural ? (landCategory === 'Remote Rural' ? 2.0 : 1.5) : 1.0;
  const multipliedLandValueCr = baseLandValueCr * multiplier;
  const solatiumCr = multipliedLandValueCr; // 100% Solatium
  const interestCr = baseLandValueCr * 0.12 * parseFloat(interestYears || 0);
  const assetsValueCr = parseFloat(assetsValueLakhs || 0) / 100.0;
  const totalCompensationCr = multipliedLandValueCr + solatiumCr + interestCr + assetsValueCr;

  const mockParcel = {
    id: 'PCL-CALC-DEMO',
    surveyNo: 'SRV-2026-CALC-88',
    khasraNo: 'Kh-412/1',
    village: 'Bambora',
    district: 'Alwar',
    state: 'Rajasthan',
    landowner: 'Ramesh Chandra Yadav',
    ownerPhone: '+91 91122 33445',
    officialAreaHa: areaHa,
    surveyedAreaHa: areaHa,
    projectName: 'Delhi-Mumbai Industrial Corridor Expressway (Phase IV)',
    marketRatePerHa: marketRateLakhs,
    larrAssessment: {
      baseLandValueCr,
      multiplier,
      multipliedLandValueCr,
      solatiumCr,
      interestCr,
      assetsValueCr,
      totalCompensationCr
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-display">
              LARR 2013 Statutory Compensation & Solatium Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            RFCTLARR Act 2013 First Schedule Multiplier (1.2x-2.0x), 100% Solatium, 12% Additional Interest & Asset Valuation Calculator
          </p>
        </div>

        <button
          onClick={() => setShowDossierModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Generate Statutory Section 3G Award PDF</span>
        </button>
      </div>

      {/* Grid: Inputs & Live Statutory Calculation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form Inputs (Col 1) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Land Parcel Valuation Inputs</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Area & Market Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Official Land Area (Hectares):</label>
                <input
                  type="number"
                  step="0.01"
                  value={areaHa}
                  onChange={(e) => setAreaHa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Circle / Market Rate (₹ Lakhs/Ha):</label>
                <input
                  type="number"
                  step="1"
                  value={marketRateLakhs}
                  onChange={(e) => setMarketRateLakhs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Rural vs Urban & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Land Location Type:</label>
                <select
                  value={isRural ? 'rural' : 'urban'}
                  onChange={(e) => setIsRural(e.target.value === 'rural')}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-bold text-xs outline-none"
                >
                  <option value="rural">Rural Land (Multiplier 1.2x - 2.0x)</option>
                  <option value="urban">Urban Land (Multiplier 1.0x)</option>
                </select>
              </div>

              {isRural && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Rural Multiplier Factor:</label>
                  <select
                    value={landCategory}
                    onChange={(e) => setLandCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs outline-none"
                  >
                    <option value="Rural Standard">Standard Rural (1.5x Multiplier)</option>
                    <option value="Remote Rural">Remote / Backward Rural (2.0x Multiplier)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Interest Years & Assets Valuation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">12% Interest Duration (Years):</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestYears}
                  onChange={(e) => setInterestYears(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Assets Valuation (₹ Lakhs):</label>
                <input
                  type="number"
                  step="1"
                  value={assetsValueLakhs}
                  onChange={(e) => setAssetsValueLakhs(e.target.value)}
                  placeholder="Trees, Tubewell, House"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Award Summary (Col 2) */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Statutory Award Summary (LARR 2013)</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Certified Formula
              </span>
            </h3>

            {/* Live Breakdown Matrix */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400">1. Base Market Land Value</span>
                <span className="font-mono font-bold text-white">₹ {baseLandValueCr.toFixed(4)} Cr</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400">2. Rural Multiplied Value ({multiplier}x)</span>
                <span className="font-mono font-bold text-amber-300">₹ {multipliedLandValueCr.toFixed(4)} Cr</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400">3. Solatium (100% Mandatory)</span>
                <span className="font-mono font-bold text-amber-400">₹ {solatiumCr.toFixed(4)} Cr</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400">4. Additional Statutory Interest (12%/yr)</span>
                <span className="font-mono font-bold text-slate-300">₹ {interestCr.toFixed(4)} Cr</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-slate-400">5. Assets Valuation (Structures/Trees)</span>
                <span className="font-mono font-bold text-slate-300">₹ {assetsValueCr.toFixed(4)} Cr</span>
              </div>
            </div>
          </div>

          {/* Grand Total Box */}
          <div className="bg-gradient-to-tr from-amber-500/20 via-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/40 text-center space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-400">
              TOTAL STATUTORY COMPENSATION AWARD
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">
              ₹ {totalCompensationCr.toFixed(4)} Crores
            </div>
            <div className="text-[11px] text-slate-400">
              Equivalent to ₹ {(totalCompensationCr * 100).toFixed(2)} Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* Printable Statutory Certificate Modal */}
      {showDossierModal && (
        <LarrDossierModal parcel={mockParcel} onClose={() => setShowDossierModal(false)} />
      )}
    </div>
  );
};
