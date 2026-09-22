import { query, get, run } from '../database/db.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await query(`SELECT * FROM projects ORDER BY createdAt DESC`);
    return res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await get(`SELECT * FROM projects WHERE id = ?`, [id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const parcels = await query(`SELECT * FROM parcels WHERE projectId = ?`, [id]);
    return res.json({ ...project, parcels });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const totalProjects = await get(`SELECT COUNT(*) as count FROM projects`);
    const totalAcres = await get(`SELECT SUM(totalLandAcres) as sum FROM projects`);
    const totalCost = await get(`SELECT SUM(estimatedCostCr) as sum FROM projects`);
    const totalParcels = await get(`SELECT COUNT(*) as count FROM parcels`);
    const acquiredParcels = await get(`SELECT COUNT(*) as count FROM parcels WHERE currentStage = 11 OR acquisitionStatus LIKE '%Acquired%' OR acquisitionStatus LIKE '%Disbursed%'`);
    const activeDisputes = await get(`SELECT COUNT(*) as count FROM disputes WHERE status != 'RESOLVED'`);
    const totalDbtDisbursed = await get(`SELECT SUM(amountCr) as sum FROM dbt_transactions WHERE status = 'SUCCESSFUL_CREDITED'`);

    return res.json({
      totalProjects: totalProjects.count || 0,
      totalLandAcres: Math.round((totalAcres.sum || 0) * 10) / 10,
      totalCostCr: Math.round((totalCost.sum || 0) * 10) / 10,
      totalParcels: totalParcels.count || 0,
      acquiredParcels: acquiredParcels.count || 0,
      activeDisputes: activeDisputes.count || 0,
      totalDbtDisbursedCr: Math.round((totalDbtDisbursed.sum || 0) * 100) / 100
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to calculate dashboard metrics' });
  }
};
