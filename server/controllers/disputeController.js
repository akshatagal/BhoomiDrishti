import { query, get, run } from '../database/db.js';

export const getAllDisputes = async (req, res) => {
  try {
    const disputes = await query(`
      SELECT d.*, p.surveyNo, p.village, p.district, p.landowner, prj.name as projectName 
      FROM disputes d
      LEFT JOIN parcels p ON d.parcelId = p.id
      LEFT JOIN projects prj ON p.projectId = prj.id
      ORDER BY d.createdAt DESC
    `);
    return res.json(disputes);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch disputes' });
  }
};

export const createDispute = async (req, res) => {
  try {
    let { parcelId, raisedBy, disputeType, description } = req.body;

    // Fallback defaults if any field is empty
    if (!parcelId || parcelId.trim() === '') {
      const firstParcel = await get(`SELECT id FROM parcels LIMIT 1`);
      parcelId = firstParcel ? firstParcel.id : 'PCL-101';
    }

    if (!raisedBy || raisedBy.trim() === '') {
      raisedBy = 'Akshat Agal';
    }

    if (!disputeType || disputeType.trim() === '') {
      disputeType = 'Joint Ownership & Title Claim';
    }

    const grievanceNo = `GRV-${Date.now().toString().slice(-6)}`;
    const id = `DSP-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    await run(`
      INSERT INTO disputes (id, parcelId, grievanceNo, raisedBy, disputeType, description, status, slaOfficer, hearingDate, riskLevel, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, 
      parcelId, 
      grievanceNo, 
      raisedBy, 
      disputeType, 
      description || 'Grievance registered via public portal', 
      'GRIEVANCE_REGISTERED', 
      'Special Land Acquisition Officer (SLAO)', 
      'Pending Schedule', 
      'MEDIUM_RISK', 
      createdAt
    ]);

    // Update parcel activeDispute flag
    await run(`UPDATE parcels SET activeDispute = 1 WHERE id = ?`, [parcelId]);

    return res.status(201).json({
      message: 'Grievance submitted successfully',
      grievanceNo,
      id
    });
  } catch (err) {
    console.error('Create dispute error:', err);
    return res.status(500).json({ error: 'Failed to submit grievance' });
  }
};
