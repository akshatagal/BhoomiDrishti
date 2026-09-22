import { get, run } from '../database/db.js';

export const calculateLarrCompensation = async (req, res) => {
  try {
    const { parcelId, marketRatePerHa, officialAreaHa, landCategory, isRural, additionalAssetsCr, interestYears } = req.body;

    if (!parcelId || !marketRatePerHa || !officialAreaHa) {
      return res.status(400).json({ error: 'parcelId, marketRatePerHa, and officialAreaHa are required' });
    }

    // 1. Base Land Market Value (in Crores)
    // marketRatePerHa is in Lakhs per Hectare
    const baseLandValueCr = (parseFloat(marketRatePerHa) * parseFloat(officialAreaHa)) / 100.0;

    // 2. Rural Multiplier Factor (RFCTLARR 2013 First Schedule: 1.2x to 2.0x for rural, 1.0x for urban)
    const multiplier = isRural ? (landCategory === 'Remote Rural' ? 2.0 : 1.5) : 1.0;

    const multipliedLandValueCr = baseLandValueCr * multiplier;

    // 3. 100% Solatium (RFCTLARR 2013 Section 30(1))
    const solatiumCr = multipliedLandValueCr;

    // 4. 12% Additional Interest per annum on Base Market Value (Section 30(2))
    const years = parseFloat(interestYears) || 1.5;
    const interestCr = baseLandValueCr * 0.12 * years;

    // 5. Assets Valuation (Structures, Trees, Borewells)
    const assetsValueCr = parseFloat(additionalAssetsCr) || 0.0;

    // Total Statutory Award Compensation
    const totalCompensationCr = Math.round((multipliedLandValueCr + solatiumCr + interestCr + assetsValueCr) * 10000) / 10000;

    // Save or update assessment in DB if parcel exists
    const existing = await get(`SELECT id FROM larr_assessments WHERE parcelId = ?`, [parcelId]);
    const id = existing ? existing.id : `LARR-${Date.now()}`;
    const calculatedAt = new Date().toISOString();

    if (existing) {
      await run(`
        UPDATE larr_assessments 
        SET landValueCr = ?, multiplier = ?, solatiumCr = ?, interestCr = ?, assetsValueCr = ?, totalCompensationCr = ?, calculatedAt = ?
        WHERE parcelId = ?
      `, [baseLandValueCr, multiplier, solatiumCr, interestCr, assetsValueCr, totalCompensationCr, calculatedAt, parcelId]);
    } else {
      await run(`
        INSERT INTO larr_assessments (id, parcelId, landValueCr, multiplier, solatiumCr, interestCr, assetsValueCr, totalCompensationCr, calculatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, parcelId, baseLandValueCr, multiplier, solatiumCr, interestCr, assetsValueCr, totalCompensationCr, calculatedAt]);
    }

    return res.json({
      parcelId,
      baseLandValueCr: Math.round(baseLandValueCr * 10000) / 10000,
      multiplier,
      multipliedLandValueCr: Math.round(multipliedLandValueCr * 10000) / 10000,
      solatiumCr: Math.round(solatiumCr * 10000) / 10000,
      interestCr: Math.round(interestCr * 10000) / 10000,
      assetsValueCr,
      totalCompensationCr,
      calculatedAt
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to calculate LARR compensation' });
  }
};
