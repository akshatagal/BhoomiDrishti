import express from 'express';
import { login, register, getProfile, switchRoleDemo } from '../controllers/authController.js';
import { getAllProjects, getProjectById, getDashboardMetrics } from '../controllers/projectController.js';
import { getAllParcels, getParcelById, advanceParcelStage } from '../controllers/parcelController.js';
import { calculateLarrCompensation } from '../controllers/larrController.js';
import { getAllDisputes, createDispute } from '../controllers/disputeController.js';
import { getDbtLedger, triggerDbtPayment } from '../controllers/dbtController.js';

const router = express.Router();

// Auth & Roles
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/profile', getProfile);
router.post('/auth/demo-switch/:role', switchRoleDemo);

// Dashboard & Projects
router.get('/dashboard/metrics', getDashboardMetrics);
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);

// Parcels & GIS
router.get('/parcels', getAllParcels);
router.get('/parcels/:id', getParcelById);
router.post('/parcels/:id/advance-stage', advanceParcelStage);

// LARR Compensation Calculator
router.post('/larr/calculate', calculateLarrCompensation);

// Disputes & Grievance Portal
router.get('/disputes', getAllDisputes);
router.post('/disputes', createDispute);

// DBT Payment Disbursal
router.get('/dbt', getDbtLedger);
router.post('/dbt/transfer', triggerDbtPayment);

export default router;
