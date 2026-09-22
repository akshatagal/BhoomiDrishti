import React from 'react';
import { X, Printer, ShieldCheck, Download, Landmark } from 'lucide-react';

export const LarrDossierModal = ({ parcel, onClose }) => {
  if (!parcel) return null;

  const larr = parcel.larrAssessment || {
    baseLandValueCr: (parcel.officialAreaHa * (parcel.marketRatePerHa || 45)) / 100,
    multiplier: 1.5,
    multipliedLandValueCr: ((parcel.officialAreaHa * (parcel.marketRatePerHa || 45)) / 100) * 1.5,
    solatiumCr: ((parcel.officialAreaHa * (parcel.marketRatePerHa || 45)) / 100) * 1.5,
    interestCr: ((parcel.officialAreaHa * (parcel.marketRatePerHa || 45)) / 100) * 0.18,
    assetsValueCr: 0.35,
    totalCompensationCr: (((parcel.officialAreaHa * (parcel.marketRatePerHa || 45)) / 100) * 3.18) + 0.35
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0 my-8">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">RFCTLARR Statutory Compensation Dossier</h3>
              <p className="text-xs text-slate-400">Section 3G Award & Valuation Certificate under LARR Act 2013</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Body */}
        <div id="printable-dossier" className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-slate-200 text-xs leading-relaxed">
          {/* Government Watermark / Header */}
          <div className="text-center border-b border-slate-800 pb-4 space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
              GOVERNMENT OF INDIA • REVENUE & REHABILITATION DEPARTMENT
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              STATUTORY AWARD CERTIFICATE (SECTION 3G)
            </h2>
            <p className="text-slate-400 text-[11px]">
              National Land Acquisition Project: <span className="text-amber-400 font-semibold">{parcel.projectName || 'Delhi-Mumbai Expressway Phase IV'}</span>
            </p>
          </div>

          {/* Particulars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Survey / Khasra No</span>
              <span className="font-bold text-white text-sm">{parcel.surveyNo}</span>
              <span className="text-[10px] text-slate-400 block">{parcel.khasraNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Landowner Particulars</span>
              <span className="font-bold text-amber-400">{parcel.landowner}</span>
              <span className="text-[10px] text-slate-400 block">{parcel.ownerPhone || '+91 98100 00000'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Revenue Village & District</span>
              <span className="font-medium text-slate-200">{parcel.village}</span>
              <span className="text-[10px] text-slate-400 block">{parcel.district}, {parcel.state}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">DGPS Area Measurement</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">{parcel.officialAreaHa} Hectares</span>
              <span className="text-[10px] text-slate-400 block">Surveyed: {parcel.surveyedAreaHa} Ha</span>
            </div>
          </div>

          {/* LARR Compensation Calculation Breakdown Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              LARR Act 2013 Statutory Compensation Assessment Breakdown
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-semibold">
                    <th className="py-2.5 px-3">Statutory Component</th>
                    <th className="py-2.5 px-3">Legal Mandate Rule</th>
                    <th className="py-2.5 px-3 text-right">Assessed Amount (₹ Crores)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-200">1. Base Market Land Value</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">RFCTLARR Sec 26 (Registered Sales Deed & Circle Rate)</td>
                    <td className="py-2 px-3 text-right font-mono text-white">₹ {(larr.baseLandValueCr || 1.1025).toFixed(4)} Cr</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-200">2. Rural Multiplier Factor</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">First Schedule Multiplier ({larr.multiplier || 1.5}x)</td>
                    <td className="py-2 px-3 text-right font-mono text-amber-300">₹ {((larr.baseLandValueCr || 1.1025) * (larr.multiplier || 1.5)).toFixed(4)} Cr</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-200">3. Solatium (100% Mandatory)</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">RFCTLARR Sec 30(1) (100% of multiplied land value)</td>
                    <td className="py-2 px-3 text-right font-mono text-amber-400">₹ {(larr.solatiumCr || 1.6537).toFixed(4)} Cr</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-200">4. Additional Statutory Interest</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">Sec 30(2) (12% per annum on market value from Sec 11)</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-300">₹ {(larr.interestCr || 0.1984).toFixed(4)} Cr</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-200">5. Assets Valuation (Structures & Trees)</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">PWD Approved Structural & Horticulture Assessment</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-300">₹ {(larr.assetsValueCr || 0.35).toFixed(4)} Cr</td>
                  </tr>
                  <tr className="bg-amber-500/10 border-t-2 border-amber-500/30 font-bold">
                    <td className="py-3 px-3 text-amber-400 text-sm">TOTAL FINAL STATUTORY AWARD</td>
                    <td className="py-3 px-3 text-amber-400 text-[11px]">Section 3G Certified Final Award</td>
                    <td className="py-3 px-3 text-right font-mono text-amber-400 text-base">
                      ₹ {(larr.totalCompensationCr || 3.8546).toFixed(4)} Cr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Digital Signature Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">Digitally Signed & Certified</span>
                <span>PFMS Direct Benefit Transfer Gateway Enabled</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-300 block">Vikramaditya Verma, ADM</span>
              <span>Special Land Acquisition Officer (SLAO)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
