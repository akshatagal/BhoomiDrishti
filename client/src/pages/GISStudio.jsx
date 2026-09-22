import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Crosshair, Camera, AlertTriangle, CheckCircle2, Shield, Eye, Layers } from 'lucide-react';
import { GISMap } from '../components/GISMap';

export const GISStudio = () => {
  const fallbackParcels = [
    {
      id: 'PCL-101',
      surveyNo: 'SRV-2026-88A',
      khasraNo: 'Kh-412/1',
      village: 'Bambora',
      district: 'Alwar',
      state: 'Rajasthan',
      landowner: 'Ramesh Chandra Yadav',
      officialAreaHa: 2.45,
      surveyedAreaHa: 2.48,
      projectName: 'Delhi-Mumbai Industrial Corridor Expressway (Phase IV)',
      acquisitionStatus: 'Compensation Assessed (Sec 3G)',
      currentStage: 8,
      dgpsStatus: 'DGPS Verified',
      lat: 27.5530,
      lng: 76.6346
    },
    {
      id: 'PCL-102',
      surveyNo: 'SRV-2026-92B',
      khasraNo: 'Kh-108/4',
      village: 'Kharbao',
      district: 'Thane',
      state: 'Maharashtra',
      landowner: 'Dattatray Pandurang Patil',
      officialAreaHa: 1.80,
      surveyedAreaHa: 1.80,
      projectName: 'Mumbai-Ahmedabad High-Speed Rail Corridor',
      acquisitionStatus: 'DGPS Survey Complete',
      currentStage: 5,
      dgpsStatus: 'DGPS Verified',
      lat: 19.2140,
      lng: 73.0182
    }
  ];

  const [parcels, setParcels] = useState(fallbackParcels);
  const [selectedParcel, setSelectedParcel] = useState(fallbackParcels[0]);

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const res = await axios.get('/api/parcels');
      if (res.data && res.data.length > 0) {
        setParcels(res.data);
        setSelectedParcel(res.data[0]);
      }
    } catch (err) {
      console.warn('Using fallback parcels');
      if (!selectedParcel) {
        setParcels(fallbackParcels);
        setSelectedParcel(fallbackParcels[0]);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-display">
              Field Surveyor Workbench & Cadastral GIS Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            High-Precision DGPS Boundary Demarcation, Drone Survey Overlay, and Revenue Record Discrepancy Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5" />
            <span>DGPS Real-Time Centimeter Accuracy</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Surveyor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-xl flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Cadastral Parcel GIS Alignment & Boundary Viewer</h3>
            </div>
            <span className="text-[11px] text-slate-400">Survey of India Datum • WGS 84</span>
          </div>
          <div className="flex-1 min-h-[460px]">
            <GISMap parcels={parcels} onSelectParcel={(p) => setSelectedParcel(p)} />
          </div>
        </div>

        {/* Selected Parcel DGPS Field Inspection Box (1 Col) */}
        {selectedParcel && (
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase font-extrabold tracking-wider">
                    DGPS Field Survey Report
                  </span>
                  <h3 className="text-lg font-black text-white">{selectedParcel.surveyNo}</h3>
                  <p className="text-xs text-slate-400">{selectedParcel.khasraNo} • {selectedParcel.village}</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {selectedParcel.dgpsStatus}
                </span>
              </div>

              {/* Area Mismatch Alert */}
              {Math.abs(selectedParcel.officialAreaHa - selectedParcel.surveyedAreaHa) > 0.01 ? (
                <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-200 block">Boundary Area Discrepancy Detected!</span>
                    Official area ({selectedParcel.officialAreaHa} Ha) differs from DGPS surveyed area ({selectedParcel.surveyedAreaHa} Ha).
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-200 block">100% Boundary Verification Passed</span>
                    Official revenue records match DGPS field cadastre perfectly.
                  </div>
                </div>
              )}

              {/* Parcel Specs Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Official Revenue Area</span>
                  <span className="font-mono text-white font-bold text-sm">{selectedParcel.officialAreaHa} Ha</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">DGPS Surveyed Area</span>
                  <span className="font-mono text-amber-300 font-bold text-sm">{selectedParcel.surveyedAreaHa} Ha</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Landowner Particulars</span>
                  <span className="font-bold text-amber-400">{selectedParcel.landowner}</span>
                </div>
              </div>

              {/* Drone Aerial Orthomosaic Survey Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Drone High-Res Aerial Survey</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Resolution 2.5cm/px</span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-800 h-36">
                  <img
                    src={selectedParcel.droneSurveyUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600"}
                    alt="Drone Cadastral Survey"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex items-end justify-between">
                    <span className="text-[10px] font-mono bg-slate-900/90 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                      GPS: {selectedParcel.coordinates || '27.5530, 76.6346'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drone Survey Action Button */}
            <button
              onClick={() => alert(`Starting high-precision DGPS re-demarcation for ${selectedParcel.surveyNo}`)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/20"
            >
              Initiate DGPS Ground Re-Survey & Drone Capture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
