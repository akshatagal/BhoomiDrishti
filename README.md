# 🏛️ BhoomiDrishti - Real-Time National Land Acquisition & Decision Support System

> **Tagline:** *"Visioning Transparent, Real-Time & Equitable Land Governance for India's Infrastructure"*  
> **Smart India Hackathon (SIH 2026):** Problem Statement **SIH26016** & **SIH26017** (Ministry of Rural Development / NHAI / Infrastructure Projects)

---

## 🌟 Key Features

1. **Multi-Role Access & Live Demo Role Switcher:**
   - **Central Ministry Admin (MoRD / NHAI):** Executive National Dashboard, Budget Monitoring, Cross-Pillar Analytics.
   - **Special Land Acquisition Officer (SLAO):** 11-Stage LARR Statutory Workflow Engine, Sec 3G/30 Award Declarations, Document Verification.
   - **Field Surveyor (DGPS GIS Specialist):** Cadastral Demarcation Studio, Drone Aerial Survey overlay, Boundary Discrepancy Engine.
   - **Citizen / Affected Landowner:** Public Transparency Portal, Compensation Breakdown, PFMS Direct Benefit Transfer Credit Status.

2. **11-Stage RFCTLARR Act 2013 Statutory Acquisition Workflow Engine:**
   - Standardized pipeline from SIA Proposal to Sec 11 Notification, Sec 19 Declaration, Sec 3G Award, DBT Payment, and Revenue Mutation.

3. **Interactive Cadastral GIS & DGPS Map Studio:**
   - Leaflet interactive cadastral maps with color-coded plot polygons (Acquired, Pending, Disputed).
   - High-precision DGPS boundary measurement comparing official revenue area vs surveyed area.

4. **RFCTLARR 2013 Statutory Compensation & Solatium Calculator:**
   - Automated formula incorporating 100% Solatium, Rural Multipliers (1.2x - 2.0x), 12% Additional Interest per annum, and Asset (Structures/Trees) Valuation.
   - One-click Official Section 3G Award PDF / Printable Certificate Dossier.

5. **Direct Benefit Transfer (DBT) & PFMS Disbursement Ledger:**
   - Real-time transaction tracker with Aadhaar & PFMS bank account validation.

6. **SIH26017 AI Acquisition Delay Risk Analytics & Dispute Portal:**
   - Machine Learning delay risk score (0-100) forecasting litigation bottlenecks.
   - Citizen Grievance log & SLAO hearing schedule manager.

7. **Full Control Backend & SQLite Database:**
   - Express REST API with local `server/data/bhoomidrishti.db` database under your complete control.

---

## 🚀 Quick Start Instructions

### Option 1: Double-Click Launcher
Run `D:\SIH2026\BhoomiDrishti\start_all.bat` to launch both Backend API and Frontend UI simultaneously.

### Option 2: Manual Terminal Launch
```bash
# 1. Start Backend API Server
cd D:\SIH2026\BhoomiDrishti\server
npm start

# 2. Start Frontend React App (in another terminal)
cd D:\SIH2026\BhoomiDrishti\client
npm run dev
```

- **Frontend Application URL:** `http://localhost:3000`
- **Backend REST API URL:** `http://localhost:5000/api`

---

## 🔐 Demo Credentials for Hackathon Judges

| Persona Role | Email | Password |
|---|---|---|
| **Central Admin (MoRD / NHAI)** | `admin@bhoomidrishti.gov.in` | `admin123` |
| **SLAO Officer (District)** | `slao@bhoomidrishti.gov.in` | `slao123` |
| **Field Surveyor (DGPS)** | `surveyor@bhoomidrishti.gov.in` | `survey123` |
| **Citizen Landowner** | `landowner@bhoomidrishti.gov.in` | `owner123` |
