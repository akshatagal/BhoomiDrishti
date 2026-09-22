import { exec, run, query } from './db.js';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  console.log('Seeding BhoomiDrishti Database...');

  // Create Tables
  await exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      designation TEXT,
      department TEXT,
      phone TEXT,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      state TEXT NOT NULL,
      districts TEXT NOT NULL,
      executingAgency TEXT NOT NULL,
      totalLandAcres REAL NOT NULL,
      estimatedCostCr REAL NOT NULL,
      acquiredParcels INTEGER DEFAULT 0,
      totalParcels INTEGER DEFAULT 0,
      activeDisputes INTEGER DEFAULT 0,
      currentStage INTEGER DEFAULT 1,
      targetCompletionDate TEXT,
      riskScore INTEGER DEFAULT 15,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS parcels (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      surveyNo TEXT NOT NULL,
      khasraNo TEXT NOT NULL,
      village TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      landowner TEXT NOT NULL,
      ownerPhone TEXT,
      officialAreaHa REAL NOT NULL,
      surveyedAreaHa REAL NOT NULL,
      landType TEXT NOT NULL,
      marketRatePerHa REAL NOT NULL,
      acquisitionStatus TEXT NOT NULL,
      currentStage INTEGER DEFAULT 1,
      dgpsStatus TEXT DEFAULT 'Pending',
      droneSurveyUrl TEXT,
      activeDispute INTEGER DEFAULT 0,
      coordinates TEXT,
      FOREIGN KEY (projectId) REFERENCES projects(id)
    );

    CREATE TABLE IF NOT EXISTS workflow_history (
      id TEXT PRIMARY KEY,
      parcelId TEXT NOT NULL,
      stageNumber INTEGER NOT NULL,
      stageName TEXT NOT NULL,
      status TEXT NOT NULL,
      verifiedBy TEXT,
      remarks TEXT,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS larr_assessments (
      id TEXT PRIMARY KEY,
      parcelId TEXT UNIQUE NOT NULL,
      landValueCr REAL NOT NULL,
      multiplier REAL NOT NULL,
      solatiumCr REAL NOT NULL,
      interestCr REAL NOT NULL,
      assetsValueCr REAL NOT NULL,
      totalCompensationCr REAL NOT NULL,
      calculatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS dbt_transactions (
      id TEXT PRIMARY KEY,
      parcelId TEXT NOT NULL,
      landownerName TEXT NOT NULL,
      bankAccount TEXT NOT NULL,
      ifscCode TEXT NOT NULL,
      pfmsRefNo TEXT UNIQUE NOT NULL,
      amountCr REAL NOT NULL,
      status TEXT NOT NULL,
      disbursedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      parcelId TEXT NOT NULL,
      grievanceNo TEXT UNIQUE NOT NULL,
      raisedBy TEXT NOT NULL,
      disputeType TEXT DEFAULT 'Boundary Discrepancy',
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      slaOfficer TEXT,
      hearingDate TEXT,
      riskLevel TEXT NOT NULL,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      parcelId TEXT NOT NULL,
      docName TEXT NOT NULL,
      docType TEXT NOT NULL,
      fileUrl TEXT NOT NULL,
      verificationStatus TEXT NOT NULL,
      reviewerRemarks TEXT,
      uploadedAt TEXT
    );
  `);

  // Auto Migration: Add disputeType column if table was created in an older version
  try {
    await exec(`ALTER TABLE disputes ADD COLUMN disputeType TEXT DEFAULT 'Boundary Discrepancy'`);
  } catch (err) {
    // Column already exists, ignore error
  }

  // Check if users exist
  const existingUsers = await query(`SELECT COUNT(*) as count FROM users`);
  if (existingUsers[0].count > 0) {
    console.log('Database already seeded & migrated.');
    return;
  }

  // Passwords
  const adminPass = await bcrypt.hash('admin123', 10);
  const slaoPass = await bcrypt.hash('slao123', 10);
  const surveyPass = await bcrypt.hash('survey123', 10);
  const ownerPass = await bcrypt.hash('owner123', 10);

  // Users
  const users = [
    {
      id: 'USR-001',
      name: 'Dr. Rajeshwar Sharma, IAS',
      email: 'admin@bhoomidrishti.gov.in',
      password: adminPass,
      role: 'central_admin',
      designation: 'Joint Secretary (Land Resources)',
      department: 'Ministry of Rural Development & NHAI',
      phone: '+91 98100 12345',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'USR-002',
      name: 'Vikramaditya Verma, ADM',
      email: 'slao@bhoomidrishti.gov.in',
      password: slaoPass,
      role: 'slao',
      designation: 'Special Land Acquisition Officer (SLAO)',
      department: 'Revenue & Disaster Management Dept, Sector 4',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 'USR-003',
      name: 'Priyanka Deshmukh, DGPS Specialist',
      email: 'surveyor@bhoomidrishti.gov.in',
      password: surveyPass,
      role: 'surveyor',
      designation: 'Senior GIS Cadastral Surveyor',
      department: 'National Remote Sensing Centre (NRSC) / Survey of India',
      phone: '+91 94221 88990',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      id: 'USR-004',
      name: 'Ramesh Chandra Yadav',
      email: 'landowner@bhoomidrishti.gov.in',
      password: ownerPass,
      role: 'landowner',
      designation: 'Agricultural Farmer / Landholder',
      department: 'Village Khasra Khata No. 412, District Alwar',
      phone: '+91 91122 33445',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    }
  ];

  for (const u of users) {
    await run(
      `INSERT INTO users (id, name, email, password, role, designation, department, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.id, u.name, u.email, u.password, u.role, u.designation, u.department, u.phone, u.avatar]
    );
  }

  // Projects
  const projects = [
    {
      id: 'PRJ-2026-01',
      code: 'NHAI-EC-04',
      name: 'Delhi-Mumbai Industrial Corridor Expressway (Phase IV)',
      category: 'National Highway',
      state: 'Rajasthan & Gujarat',
      districts: 'Alwar, Sawai Madhopur, Vadodara',
      executingAgency: 'National Highways Authority of India (NHAI)',
      totalLandAcres: 1450.5,
      estimatedCostCr: 4250.0,
      acquiredParcels: 312,
      totalParcels: 420,
      activeDisputes: 14,
      currentStage: 8,
      targetCompletionDate: '2027-03-31',
      riskScore: 28,
      createdAt: '2025-01-15'
    },
    {
      id: 'PRJ-2026-02',
      code: 'DFCCIL-WFC-09',
      name: 'Western Dedicated Freight Rail Corridor Spur Line',
      category: 'Railway & Logistics',
      state: 'Haryana & Uttar Pradesh',
      districts: 'Rewari, Palwal, Gautam Buddha Nagar',
      executingAgency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
      totalLandAcres: 890.2,
      estimatedCostCr: 2180.0,
      acquiredParcels: 185,
      totalParcels: 210,
      activeDisputes: 5,
      currentStage: 9,
      targetCompletionDate: '2026-11-30',
      riskScore: 12,
      createdAt: '2024-11-10'
    },
    {
      id: 'PRJ-2026-03',
      code: 'UPEDA-GR-SOLAR',
      name: 'Bundelkhand 1200MW Mega Solar Infrastructure Park',
      category: 'Renewable Energy',
      state: 'Uttar Pradesh',
      districts: 'Jansi, Lalitpur, Hamirpur',
      executingAgency: 'UP New & Renewable Energy Development Agency',
      totalLandAcres: 3200.0,
      estimatedCostCr: 1850.0,
      acquiredParcels: 490,
      totalParcels: 600,
      activeDisputes: 22,
      currentStage: 6,
      targetCompletionDate: '2027-08-15',
      riskScore: 45,
      createdAt: '2025-04-01'
    }
  ];

  for (const p of projects) {
    await run(
      `INSERT INTO projects (id, code, name, category, state, districts, executingAgency, totalLandAcres, estimatedCostCr, acquiredParcels, totalParcels, activeDisputes, currentStage, targetCompletionDate, riskScore, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.code, p.name, p.category, p.state, p.districts, p.executingAgency, p.totalLandAcres, p.estimatedCostCr, p.acquiredParcels, p.totalParcels, p.activeDisputes, p.currentStage, p.targetCompletionDate, p.riskScore, p.createdAt]
    );
  }

  // Parcels
  const parcels = [
    {
      id: 'PCL-101',
      projectId: 'PRJ-2026-01',
      surveyNo: 'SRV-2026-88A',
      khasraNo: 'Kh-412/1',
      village: 'Bambora',
      district: 'Alwar',
      state: 'Rajasthan',
      landowner: 'Ramesh Chandra Yadav',
      ownerPhone: '+91 91122 33445',
      officialAreaHa: 2.45,
      surveyedAreaHa: 2.48,
      landType: 'Rural Agricultural (Multi-crop)',
      marketRatePerHa: 45.0,
      acquisitionStatus: 'Compensation Assessed (Sec 3G)',
      currentStage: 8,
      dgpsStatus: 'DGPS Verified',
      droneSurveyUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
      activeDispute: 0,
      coordinates: '27.5530,76.6346'
    },
    {
      id: 'PCL-102',
      projectId: 'PRJ-2026-01',
      surveyNo: 'SRV-2026-88B',
      khasraNo: 'Kh-412/2',
      village: 'Bambora',
      district: 'Alwar',
      state: 'Rajasthan',
      landowner: 'Suresh Kumar Meena',
      ownerPhone: '+91 98221 00441',
      officialAreaHa: 1.80,
      surveyedAreaHa: 1.75,
      landType: 'Rural Agricultural (Single-crop)',
      marketRatePerHa: 42.0,
      acquisitionStatus: 'Dispute Pending (Boundary Discrepancy)',
      currentStage: 5,
      dgpsStatus: 'Boundary Mismatch Detected',
      droneSurveyUrl: 'https://images.unsplash.com/photo-1595878715977-2e8f8df18ea8?w=600',
      activeDispute: 1,
      coordinates: '27.5542,76.6358'
    },
    {
      id: 'PCL-103',
      projectId: 'PRJ-2026-01',
      surveyNo: 'SRV-2026-90',
      khasraNo: 'Kh-415',
      village: 'Kishangarh',
      district: 'Alwar',
      state: 'Rajasthan',
      landowner: 'Sunita Devi W/o Late Harish',
      ownerPhone: '+91 94140 55667',
      officialAreaHa: 3.10,
      surveyedAreaHa: 3.10,
      landType: 'Semi-Urban Commercial Buffer',
      marketRatePerHa: 85.0,
      acquisitionStatus: 'DBT Payment Disbursed',
      currentStage: 10,
      dgpsStatus: 'DGPS Verified',
      droneSurveyUrl: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=600',
      activeDispute: 0,
      coordinates: '27.5580,76.6410'
    },
    {
      id: 'PCL-201',
      projectId: 'PRJ-2026-02',
      surveyNo: 'SRV-DF-104',
      khasraNo: 'Kh-89',
      village: 'Palwal Rural',
      district: 'Palwal',
      state: 'Haryana',
      landowner: 'Chaudhary Mahender Singh',
      ownerPhone: '+91 98180 77112',
      officialAreaHa: 4.20,
      surveyedAreaHa: 4.20,
      landType: 'Industrial Corridor Buffer',
      marketRatePerHa: 110.0,
      acquisitionStatus: 'Final Award Declared (Sec 3G)',
      currentStage: 9,
      dgpsStatus: 'DGPS Verified',
      droneSurveyUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600',
      activeDispute: 0,
      coordinates: '28.1487,77.3320'
    }
  ];

  for (const pcl of parcels) {
    await run(
      `INSERT INTO parcels (id, projectId, surveyNo, khasraNo, village, district, state, landowner, ownerPhone, officialAreaHa, surveyedAreaHa, landType, marketRatePerHa, acquisitionStatus, currentStage, dgpsStatus, droneSurveyUrl, activeDispute, coordinates) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [pcl.id, pcl.projectId, pcl.surveyNo, pcl.khasraNo, pcl.village, pcl.district, pcl.state, pcl.landowner, pcl.ownerPhone, pcl.officialAreaHa, pcl.surveyedAreaHa, pcl.landType, pcl.marketRatePerHa, pcl.acquisitionStatus, pcl.currentStage, pcl.dgpsStatus, pcl.droneSurveyUrl, pcl.activeDispute, pcl.coordinates]
    );
  }

  // LARR Assessments
  const assessments = [
    {
      id: 'LARR-101',
      parcelId: 'PCL-101',
      landValueCr: 1.1025,
      multiplier: 1.5,
      solatiumCr: 1.6537,
      interestCr: 0.1984,
      assetsValueCr: 0.35,
      totalCompensationCr: 3.8546,
      calculatedAt: '2026-02-10'
    },
    {
      id: 'LARR-103',
      parcelId: 'PCL-103',
      landValueCr: 2.6350,
      multiplier: 1.2,
      solatiumCr: 3.1620,
      interestCr: 0.3794,
      assetsValueCr: 0.85,
      totalCompensationCr: 7.0264,
      calculatedAt: '2026-01-20'
    }
  ];

  for (const a of assessments) {
    await run(
      `INSERT INTO larr_assessments (id, parcelId, landValueCr, multiplier, solatiumCr, interestCr, assetsValueCr, totalCompensationCr, calculatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.id, a.parcelId, a.landValueCr, a.multiplier, a.solatiumCr, a.interestCr, a.assetsValueCr, a.totalCompensationCr, a.calculatedAt]
    );
  }

  // DBT Transactions
  const dbts = [
    {
      id: 'DBT-2026-001',
      parcelId: 'PCL-103',
      landownerName: 'Sunita Devi W/o Late Harish',
      bankAccount: 'SBIN000451299841',
      ifscCode: 'SBIN0004512',
      pfmsRefNo: 'PFMS2026091299841',
      amountCr: 7.0264,
      status: 'SUCCESSFUL_CREDITED',
      disbursedAt: '2026-02-01 11:30:00'
    },
    {
      id: 'DBT-2026-002',
      parcelId: 'PCL-101',
      landownerName: 'Ramesh Chandra Yadav',
      bankAccount: 'PUNB01239910441',
      ifscCode: 'PUNB0123991',
      pfmsRefNo: 'PFMS2026091044192',
      amountCr: 3.8546,
      status: 'AWAITING_SLAO_APPROVAL',
      disbursedAt: null
    }
  ];

  for (const d of dbts) {
    await run(
      `INSERT INTO dbt_transactions (id, parcelId, landownerName, bankAccount, ifscCode, pfmsRefNo, amountCr, status, disbursedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.id, d.parcelId, d.landownerName, d.bankAccount, d.ifscCode, d.pfmsRefNo, d.amountCr, d.status, d.disbursedAt]
    );
  }

  // Disputes
  const disputes = [
    {
      id: 'DSP-2026-01',
      parcelId: 'PCL-102',
      grievanceNo: 'GRV-ALW-2026-89',
      raisedBy: 'Suresh Kumar Meena',
      disputeType: 'Boundary Discrepancy & Area Mismatch',
      description: 'Official revenue records state 1.80 Hectares whereas recent DGPS boundary survey measured 1.75 Hectares. Re-survey requested.',
      status: 'HEARING_SCHEDULED',
      slaOfficer: 'Vikramaditya Verma, ADM',
      hearingDate: '2026-10-05',
      riskLevel: 'HIGH_RISK',
      createdAt: '2026-03-01'
    }
  ];

  for (const d of disputes) {
    await run(
      `INSERT INTO disputes (id, parcelId, grievanceNo, raisedBy, disputeType, description, status, slaOfficer, hearingDate, riskLevel, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.id, d.parcelId, d.grievanceNo, d.raisedBy, d.disputeType, d.description, d.status, d.slaOfficer, d.hearingDate, d.riskLevel, d.createdAt]
    );
  }

  // Documents
  const documents = [
    {
      id: 'DOC-101-1',
      parcelId: 'PCL-101',
      docName: 'Section 11 Preliminary Notification Gazette.pdf',
      docType: 'Statutory Gazette',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      verificationStatus: 'VERIFIED_DIGITALLY_SIGNED',
      reviewerRemarks: 'Signed by District Revenue Officer under LARR 2013',
      uploadedAt: '2025-06-12'
    },
    {
      id: 'DOC-101-2',
      parcelId: 'PCL-101',
      docName: 'DGPS Boundary Cadastral Certificate.pdf',
      docType: 'GIS Field Survey',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      verificationStatus: 'VERIFIED_DIGITALLY_SIGNED',
      reviewerRemarks: 'Verified with Survey of India benchmark coordinates',
      uploadedAt: '2025-09-20'
    }
  ];

  for (const doc of documents) {
    await run(
      `INSERT INTO documents (id, parcelId, docName, docType, fileUrl, verificationStatus, reviewerRemarks, uploadedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [doc.id, doc.parcelId, doc.docName, doc.docType, doc.fileUrl, doc.verificationStatus, doc.reviewerRemarks, doc.uploadedAt]
    );
  }

  console.log('Database seeded successfully with BhoomiDrishti demo data!');
};

// Execute if run directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
