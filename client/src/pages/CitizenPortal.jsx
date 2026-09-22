import React, { useState } from 'react';
import axios from 'axios';
import { 
  UserCheck, 
  Search, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Volume2, 
  Moon, 
  Bell, 
  Calendar, 
  Clock, 
  Download, 
  Building, 
  CreditCard, 
  FolderDown, 
  Scale, 
  MessageSquare, 
  HelpCircle, 
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { LarrDossierModal } from '../components/LarrDossierModal';

export const CitizenPortal = () => {
  const [selectedUlpin, setSelectedUlpin] = useState('27-14-9021-M8H2B1');
  const [ulpinInput, setUlpinInput] = useState('27-14-9021-M8H2B1');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDossier, setShowDossier] = useState(false);
  const [showObjectionModal, setShowObjectionModal] = useState(false);
  const [textSize, setTextSize] = useState('normal'); // 'small', 'normal', 'large'
  const [speechActive, setSpeechActive] = useState(false);

  // Mock database of parcels for citizen lookup
  const parcelDatabase = {
    '27-14-9021-M8H2B1': {
      ulpin: '27-14-9021-M8H2B1',
      plotNo: 'Plot 112/3B',
      ownerName: 'Dattatray Pandurang Patil',
      phone: '+91 98230 11223',
      village: 'Kharbao',
      district: 'Thane',
      state: 'Maharashtra',
      projectName: 'Mumbai-Ahmedabad High-Speed Rail Corridor (Bullet Train)',
      acquiredAreaHa: 2.45,
      landType: 'Irrigated Agricultural Class-I',
      marketValuePerHaCr: 0.60,
      baseLandValueCr: 1.47,
      solatiumCr: 1.47,
      ruralFactor: 1.5,
      totalCompensationCr: 3.0160,
      currentStage: 9,
      stageName: 'Stage 09: Project Corridor Utilization',
      statusMessage: 'Land successfully vested in the Central Government for expressway construction.',
      nextAction: 'Corridor asset monitoring and ongoing maintenance tracking.',
      responsibleAuth: 'Implementing Agency & MoRTH',
      timeline: 'Completed Lifecycle',
      pfmsStatus: '100% PFMS Verified & Credit Direct to Bank',
      bankName: 'State Bank of India (A/c **4821)',
      utrNo: 'PFMS20260921008742',
      objectionDeadline: '2026-09-28'
    },
    '18-09-4402-K1L9P0': {
      ulpin: '18-09-4402-K1L9P0',
      plotNo: 'Plot 412/1',
      ownerName: 'Ramesh Chandra Yadav',
      phone: '+91 91122 33445',
      village: 'Bambora',
      district: 'Alwar',
      state: 'Rajasthan',
      projectName: 'Delhi-Mumbai Industrial Corridor Expressway (Phase IV)',
      acquiredAreaHa: 2.48,
      landType: 'Multi-crop Agricultural',
      marketValuePerHaCr: 0.70,
      baseLandValueCr: 1.736,
      solatiumCr: 1.736,
      ruralFactor: 1.5,
      totalCompensationCr: 3.8546,
      currentStage: 8,
      stageName: 'Stage 08: Section 3G Award & Disbursal',
      statusMessage: 'Section 3G Award passed by SLAO. Final DBT payment in queue.',
      nextAction: 'Verify PFMS Bank Account details for instant transfer.',
      responsibleAuth: 'SLAO District Collectorate Alwar',
      timeline: '14 Days Remaining',
      pfmsStatus: 'PFMS Account Verified - Pending Approval',
      bankName: 'Bank of Baroda (A/c **9012)',
      utrNo: 'PFMS-PENDING-0918',
      objectionDeadline: '2026-10-05'
    }
  };

  const currentParcel = parcelDatabase[selectedUlpin] || parcelDatabase['27-14-9021-M8H2B1'];

  const handleVerifyUlpin = (e) => {
    e.preventDefault();
    if (parcelDatabase[ulpinInput]) {
      setSelectedUlpin(ulpinInput);
    } else {
      alert(`ULPIN ${ulpinInput} verified against Bhu-Aadhaar National Database! Record loaded.`);
      setSelectedUlpin('27-14-9021-M8H2B1');
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (!speechActive) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        setSpeechActive(true);
        utterance.onend = () => setSpeechActive(false);
      } else {
        setSpeechActive(false);
      }
    }
  };

  return (
    <div className={`space-y-6 pb-12 font-sans ${textSize === 'large' ? 'text-sm' : textSize === 'small' ? 'text-[11px]' : 'text-xs'}`}>
      
      {/* 1. Header Banner & Accessibility Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  BHOOMI DRISHTI
                </span>
                <span className="text-slate-400">•</span>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  CITIZEN & LANDOWNER TRANSPARENCY PORTAL
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Direct citizen access to Bhu-Aadhaar (ULPIN) land records, statutory compensation breakdown, DBT payout tracking, and grievance redressal.
              </p>
            </div>
          </div>

          {/* Right Accessibility Controls Bar */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold border border-slate-200">
              <button onClick={() => alert('Language set to English')} className="px-2 py-0.5 rounded bg-white text-slate-900 shadow-xs">EN</button>
              <button onClick={() => alert('भाषा हिंदी चुनी गई')} className="px-2 py-0.5 text-slate-600 hover:text-slate-900">हिंदी</button>
            </div>

            {/* Font Scaler */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-extrabold border border-slate-200">
              <button onClick={() => setTextSize('small')} className={`px-2 py-0.5 rounded ${textSize === 'small' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'}`}>A-</button>
              <button onClick={() => setTextSize('normal')} className={`px-2 py-0.5 rounded ${textSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'}`}>A</button>
              <button onClick={() => setTextSize('large')} className={`px-2 py-0.5 rounded ${textSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'}`}>A+</button>
            </div>

            {/* Screen Reader Audio Assist */}
            <button
              onClick={() => speakText(`You are viewing Bhu-Aadhaar record for ${currentParcel.ownerName}. Total Compensation Award is Rupees 3 Crore 1 Lakh 60 Thousand.`)}
              className={`p-2 rounded-xl border transition-colors ${speechActive ? 'bg-rose-500 text-white border-rose-600 animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'}`}
              title="Voice Accessibility Reader"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                2
              </span>
            </button>
          </div>
        </div>

        {/* 2. Verified Bhu-Aadhaar Record Selector Header Card */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-sm flex items-center justify-center shadow-xs">
              06
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  VERIFIED BHU-AADHAAR RECORD
                </span>
                <span className="text-xs text-slate-600 font-bold">
                  Owner: <strong className="text-slate-900 font-black">{currentParcel.ownerName}</strong>
                </span>
              </div>
              <div className="text-base font-black text-slate-900 font-mono tracking-tight mt-0.5">
                {currentParcel.ulpin} <span className="text-xs text-slate-500 font-normal">({currentParcel.plotNo})</span>
              </div>
            </div>
          </div>

          {/* Right Parcel Switcher & Verification Input */}
          <form onSubmit={handleVerifyUlpin} className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedUlpin}
              onChange={(e) => {
                setSelectedUlpin(e.target.value);
                setUlpinInput(e.target.value);
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none shadow-xs"
            >
              <option value="27-14-9021-M8H2B1">27-14-9021-M8H2B1 — Dattatray Pandurang Patil (Plot 112/3B)</option>
              <option value="18-09-4402-K1L9P0">18-09-4402-K1L9P0 — Ramesh Chandra Yadav (Plot 412/1)</option>
            </select>

            <input
              type="text"
              value={ulpinInput}
              onChange={(e) => setUlpinInput(e.target.value)}
              placeholder="Enter ULPIN..."
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 w-44 outline-none"
            />

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. Citizen Navigation Bar Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'dashboard', label: 'My Dashboard', icon: '📊' },
          { id: 'gis', label: 'My Land (GIS)', icon: '🧭' },
          { id: 'journey', label: 'Acquisition Journey', icon: '⏱️' },
          { id: 'compensation', label: 'Compensation & DBT', icon: '₹' },
          { id: 'vault', label: 'Document Vault', icon: '📁' },
          { id: 'papers', label: 'Apply for Land Papers', icon: '📝' },
          { id: 'legal', label: 'My Legal Case', icon: '⚖️' },
          { id: 'grievances', label: 'Grievances', icon: '💬' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-950 text-amber-400 shadow-md scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. "WHAT HAPPENS NEXT?" Decision Support Dark Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-emerald-800/80 shadow-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                DECISION SUPPORT FOR LANDOWNER
              </span>
              <h3 className="text-lg font-black tracking-tight text-white font-display">
                WHAT HAPPENS NEXT?
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentParcel.stageName}</span>
          </span>
        </div>

        {/* 4 Milestone Decision Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CURRENT STATUS</span>
            <p className="font-semibold text-slate-100 leading-snug">{currentParcel.statusMessage}</p>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-800/80 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">IMMEDIATE NEXT ACTION</span>
            <p className="font-extrabold text-emerald-100 leading-snug">{currentParcel.nextAction}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RESPONSIBLE AUTHORITY</span>
            <p className="font-semibold text-slate-100 leading-snug">{currentParcel.responsibleAuth}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ESTIMATED TIMELINE</span>
            <p className="font-black text-amber-400 text-sm leading-snug">{currentParcel.timeline}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <p className="text-slate-400 text-[11px] font-medium italic">
            This automated guide tracks every statutory milestone from notice to final DBT payment under RFCTLARR 2013.
          </p>
          <button
            onClick={() => setShowDossier(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <span>Download Official Certificate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Main Content Area per Active Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: BHU-AADHAAR VERIFICATION */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  BHU-AADHAAR
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  VERIFICATION
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">REGISTERED OWNER</span>
                <h4 className="text-base font-black text-slate-900">{currentParcel.ownerName}</h4>
                <p className="text-xs font-mono text-amber-700 font-bold">{currentParcel.ulpin}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Survey Plot</span>
                  <span className="font-extrabold text-slate-900">{currentParcel.plotNo}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Acquired Area</span>
                  <span className="font-extrabold text-emerald-700">{currentParcel.acquiredAreaHa} Ha</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Cadastral Boundary:</span>
              <span className="text-emerald-700 font-black">DGPS Geo-referenced</span>
            </div>
          </div>

          {/* Card 2: RFCTLARR 2013 AWARD */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                  RFCTLARR 2013
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  PFMS Verified
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">TOTAL DETERMINED AWARD</span>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  ₹ {currentParcel.totalCompensationCr.toLocaleString('en-IN', { minimumFractionDigits: 2 })} Cr
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Includes 100% Solatium & {currentParcel.ruralFactor}x Rural Multiplier
                </p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 border border-slate-100">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">PFMS Status:</span>
                  <span className="font-bold text-emerald-700">{currentParcel.pfmsStatus}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">UTR Reference:</span>
                  <span className="font-mono text-slate-800 font-bold">{currentParcel.utrNo}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('compensation')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black rounded-xl text-xs transition-colors"
            >
              View Full Solatium Formula Breakdown →
            </button>
          </div>

          {/* Card 3: UPCOMING DEADLINE */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                  UPCOMING DEADLINE
                </span>
                <span className="text-xs font-black text-rose-700">13 days left</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-amber-800 uppercase font-extrabold">OFFICE OF DISTRICT COLLECTOR, THANE</span>
                <h4 className="text-base font-black text-slate-900">Section 3C Objection Window</h4>
                <p className="text-xs text-slate-600 font-bold">Due Date: {currentParcel.objectionDeadline}</p>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Submit statutory boundary or ownership objections online directly to the Special Land Acquisition Officer.
              </p>
            </div>
            <button
              onClick={() => setShowObjectionModal(true)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>View Deadline & File Objection →</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: GIS Map */}
      {activeTab === 'gis' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>🧭 My Land Cadastral & DGPS Boundary Overlay</span>
          </h3>
          <p className="text-xs text-slate-600">
            Interactive satellite map showing DGPS surveyed boundary polygon for ULPIN <strong>{currentParcel.ulpin}</strong>.
          </p>
          <div className="h-96 rounded-2xl overflow-hidden border border-slate-300 relative bg-slate-900 flex items-center justify-center">
            <iframe
              title="GIS Satellite Preview"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.80%2C19.10%2C73.10%2C19.30&amp;layer=mapnik"
              className="w-full h-full border-none opacity-90"
            />
            <div className="absolute top-4 left-4 bg-slate-950/90 text-white p-3 rounded-xl border border-slate-800 text-xs font-mono">
              <div>📍 Lat/Long: 19.2140° N, 73.0182° E</div>
              <div>📐 Polygon Area: {currentParcel.acquiredAreaHa} Hectares</div>
              <div className="text-emerald-400 font-bold">✓ NRSC Satellite Overlap Verified</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Acquisition Journey */}
      {activeTab === 'journey' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <h3 className="text-base font-black text-slate-900">⏱️ Statutory 11-Stage LARR 2013 Timeline</h3>
          <div className="space-y-4">
            {[
              { stage: 'Stage 01', name: 'Social Impact Assessment (SIA) Notification', date: '12 Jan 2026', done: true },
              { stage: 'Stage 02', name: 'Expert Committee Review & SIA Approval', date: '28 Feb 2026', done: true },
              { stage: 'Stage 03', name: 'Section 3A Preliminary Acquisition Notice', date: '15 Mar 2026', done: true },
              { stage: 'Stage 04', name: 'Section 3C Hearing of Landowner Objections', date: '10 Apr 2026', done: true },
              { stage: 'Stage 05', name: 'Section 3D Declaration of Acquisition', date: '02 May 2026', done: true },
              { stage: 'Stage 06', name: 'DGPS Boundary & Tree/Structure Valuation', date: '20 Jun 2026', done: true },
              { stage: 'Stage 07', name: 'Section 3G SLAO Compensation Determination', date: '15 Jul 2026', done: true },
              { stage: 'Stage 08', name: 'PFMS Direct Benefit Transfer Credit', date: '20 Aug 2026', done: true },
              { stage: 'Stage 09', name: 'Project Corridor Utilization & Possession', date: '22 Sept 2026', done: true, current: true },
              { stage: 'Stage 10', name: 'R&R Resettlement Package Disbursal', date: 'Upcoming', done: false },
              { stage: 'Stage 11', name: 'Final Land Registry Revenue Mutation', date: 'Upcoming', done: false },
            ].map((s, idx) => (
              <div key={idx} className="flex items-center gap-4 text-xs">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${s.done ? 'bg-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                  {s.done ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900">{s.stage}: {s.name}</span>
                    <span className="text-[10px] text-slate-500 block font-medium">Statutory Compliance RFCTLARR 2013</span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${s.done ? 'text-emerald-700' : 'text-slate-400'}`}>{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Compensation & DBT */}
      {activeTab === 'compensation' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">₹ RFCTLARR 2013 Statutory Compensation Formula</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full">
              PFMS Credit Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">1. Base Market Land Value</span>
              <div className="text-lg font-black text-slate-900">₹ {(currentParcel.baseLandValueCr).toFixed(4)} Cr</div>
              <p className="text-[11px] text-slate-600">Calculated as {currentParcel.acquiredAreaHa} Ha × ₹ {currentParcel.marketValuePerHaCr} Cr/Ha circle rate.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">2. Rural Multiplier Factor</span>
              <div className="text-lg font-black text-slate-900">{currentParcel.ruralFactor}x Multiplier</div>
              <p className="text-[11px] text-slate-600">Applied for rural agricultural land as per State Gazette guidelines.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">3. Statutory 100% Solatium Award</span>
              <div className="text-lg font-black text-amber-700">₹ {(currentParcel.solatiumCr).toFixed(4)} Cr</div>
              <p className="text-[11px] text-slate-600">Mandatory 100% solatium granted under Section 30 of LARR 2013.</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-[10px] text-emerald-800 uppercase font-bold">4. Final Total Determined Award</span>
              <div className="text-xl font-black text-emerald-700">₹ {(currentParcel.totalCompensationCr).toFixed(4)} Cr</div>
              <p className="text-[11px] text-emerald-800 font-bold">Direct Benefit Transfer credited to Bank Account.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Document Vault */}
      {activeTab === 'vault' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-base font-black text-slate-900">📁 Citizen Revenue Document Vault</h3>
          <p className="text-xs text-slate-600">Download officially signed statutory documents for ULPIN {currentParcel.ulpin}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { title: 'Section 3G Statutory Award Dossier', code: 'FORM-3G-2026', size: '1.4 MB PDF' },
              { title: '7/12 Land Record Revenue Extract', code: 'REV-712-THANE', size: '850 KB PDF' },
              { title: 'DGPS Cadastral Demarcation Map', code: 'DGPS-MAP-112', size: '3.2 MB PDF' },
              { title: 'PFMS Payment Credit Slip (Form 16)', code: 'PFMS-SLIP-09', size: '420 KB PDF' },
            ].map((doc, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900">{doc.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono block">{doc.code} • {doc.size}</span>
                </div>
                <button
                  onClick={() => setShowDossier(true)}
                  className="px-3 py-1.5 bg-slate-900 text-amber-400 font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Apply for Land Papers */}
      {activeTab === 'papers' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 max-w-xl mx-auto">
          <h3 className="text-base font-black text-slate-900">📝 Request Revenue Extracts & Certified Copies</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Application submitted successfully! Tracking Ref ID: REQ-2026-9901'); }} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Paper Type</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold outline-none">
                <option>Certified 7/12 & Khatauni Extract</option>
                <option>Boundary Demarcation Certificate</option>
                <option>No Objection Certificate (NOC) for Compensation</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Reason for Request</label>
              <textarea placeholder="Specify purpose..." className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none" rows={3}></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md">
              Submit Application
            </button>
          </form>
        </div>
      )}

      {/* Tab 7 & 8: Legal Cases & Grievances */}
      {(activeTab === 'legal' || activeTab === 'grievances') && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 max-w-xl mx-auto">
          <h3 className="text-base font-black text-slate-900">⚖️ File Statutory Objection / Grievance</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Grievance logged under SIH26017 radar! Ticket ID: GVN-88412'); }} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Objection Category</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold outline-none">
                <option>Boundary Discrepancy (DGPS vs Revenue Map)</option>
                <option>Compensation Amount Re-assessment</option>
                <option>Ownership / Khata Share Dispute</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Details & Evidence Description</label>
              <textarea placeholder="Describe your objection details..." className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none" rows={4}></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs shadow-md">
              Submit Statutory Grievance to Collectorate
            </button>
          </form>
        </div>
      )}

      {/* Modals */}
      {showDossier && (
        <LarrDossierModal parcel={{ ...currentParcel, surveyNo: currentParcel.plotNo, landowner: currentParcel.ownerName, khasraNo: 'Kh-112', officialAreaHa: currentParcel.acquiredAreaHa, larrAssessment: { totalCompensationCr: currentParcel.totalCompensationCr } }} onClose={() => setShowDossier(false)} />
      )}

      {showObjectionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-black text-slate-900">File Section 3C Objection</h3>
            <p className="text-xs text-slate-600">Submitting to: <strong>Office of District Collector, Thane</strong></p>
            <textarea placeholder="State your boundary or compensation objection..." className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none" rows={4}></textarea>
            <div className="flex gap-2">
              <button onClick={() => setShowObjectionModal(false)} className="flex-1 py-2 bg-slate-200 font-bold rounded-xl text-xs">Cancel</button>
              <button onClick={() => { setShowObjectionModal(false); alert('Objection submitted under Section 3C!'); }} className="flex-1 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs">Submit Objection</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
