import { query, get, run } from '../database/db.js';

export const getAllParcels = async (req, res) => {
  try {
    const parcels = await query(`
      SELECT p.*, prj.name as projectName, prj.code as projectCode 
      FROM parcels p 
      LEFT JOIN projects prj ON p.projectId = prj.id 
      ORDER BY p.id ASC
    `);
    return res.json(parcels);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch parcels' });
  }
};

export const getParcelById = async (req, res) => {
  try {
    const { id } = req.params;
    const parcel = await get(`
      SELECT p.*, prj.name as projectName, prj.code as projectCode 
      FROM parcels p 
      LEFT JOIN projects prj ON p.projectId = prj.id 
      WHERE p.id = ?
    `, [id]);

    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });

    const larr = await get(`SELECT * FROM larr_assessments WHERE parcelId = ?`, [id]);
    const dbt = await get(`SELECT * FROM dbt_transactions WHERE parcelId = ?`, [id]);
    const disputes = await query(`SELECT * FROM disputes WHERE parcelId = ?`, [id]);
    const documents = await query(`SELECT * FROM documents WHERE parcelId = ?`, [id]);
    const workflow = await query(`SELECT * FROM workflow_history WHERE parcelId = ? ORDER BY stageNumber ASC`, [id]);

    return res.json({
      ...parcel,
      larrAssessment: larr || null,
      dbtTransaction: dbt || null,
      disputes: disputes || [],
      documents: documents || [],
      workflowHistory: workflow || []
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch parcel details' });
  }
};

export const advanceParcelStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetStage, verifiedBy, remarks } = req.body;

    const parcel = await get(`SELECT * FROM parcels WHERE id = ?`, [id]);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });

    const nextStage = targetStage || (parcel.currentStage + 1);
    if (nextStage > 11) {
      return res.status(400).json({ error: 'Parcel already reached final stage (Stage 11)' });
    }

    const stageNames = [
      'Preliminary Proposal',
      'Social Impact Assessment (SIA)',
      'Expert Group Review',
      'Sec 11 Preliminary Notification',
      'Cadastral Field Survey & DGPS Verification',
      'Sec 16/19 R&R Scheme Formulation',
      'Sec 19 Final Acquisition Declaration',
      'Market Valuation & Solatium Assessment',
      'Sec 3G / 30 Award Declaration',
      'Compensation Disbursal via DBT',
      'Final Land Possession & Revenue Mutation'
    ];

    const stageName = stageNames[nextStage - 1] || `Stage ${nextStage}`;

    let statusText = `Stage ${nextStage} Approved`;
    if (nextStage === 11) statusText = 'Final Land Possession Acquired';
    else if (nextStage === 10) statusText = 'DBT Payment Disbursed';
    else if (nextStage === 9) statusText = 'Final Award Declared (Sec 3G)';

    await run(`UPDATE parcels SET currentStage = ?, acquisitionStatus = ? WHERE id = ?`, [nextStage, statusText, id]);

    // Record workflow history
    const historyId = `WF-${Date.now()}`;
    await run(`
      INSERT INTO workflow_history (id, parcelId, stageNumber, stageName, status, verifiedBy, remarks, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [historyId, id, nextStage, stageName, 'PASSED', verifiedBy || 'SLAO Officer', remarks || 'Statutory criteria verified', new Date().toISOString()]);

    return res.json({
      message: `Parcel ${id} successfully advanced to Stage ${nextStage}: ${stageName}`,
      currentStage: nextStage,
      status: statusText
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to advance stage' });
  }
};
