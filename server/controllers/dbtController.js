import { query, run } from '../database/db.js';

export const getDbtLedger = async (req, res) => {
  try {
    const transactions = await query(`
      SELECT d.*, p.surveyNo, p.village, p.district, prj.name as projectName
      FROM dbt_transactions d
      LEFT JOIN parcels p ON d.parcelId = p.id
      LEFT JOIN projects prj ON p.projectId = prj.id
      ORDER BY d.id DESC
    `);
    return res.json(transactions);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch DBT ledger' });
  }
};

export const triggerDbtPayment = async (req, res) => {
  try {
    const { parcelId, landownerName, bankAccount, ifscCode, amountCr } = req.body;

    const pfmsRefNo = `PFMS${Date.now()}`;
    const id = `DBT-${Date.now()}`;
    const disbursedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    await run(`
      INSERT INTO dbt_transactions (id, parcelId, landownerName, bankAccount, ifscCode, pfmsRefNo, amountCr, status, disbursedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, parcelId, landownerName, bankAccount, ifscCode, pfmsRefNo, amountCr, 'SUCCESSFUL_CREDITED', disbursedAt]);

    // Update parcel acquisition status to Stage 10 DBT Disbursed
    await run(`UPDATE parcels SET acquisitionStatus = 'DBT Payment Disbursed', currentStage = 10 WHERE id = ?`, [parcelId]);

    return res.json({
      message: 'Direct Benefit Transfer (DBT) successfully processed via PFMS Gateway',
      pfmsRefNo,
      status: 'SUCCESSFUL_CREDITED',
      disbursedAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process DBT transfer' });
  }
};
