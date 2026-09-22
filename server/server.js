import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import { seedDatabase } from './database/seed.js';
import { exec } from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'BhoomiDrishti - National Land Acquisition System',
    timestamp: new Date().toISOString()
  });
});

// Auto-seed database & perform table migrations on startup
seedDatabase()
  .then(async () => {
    try {
      await exec(`ALTER TABLE disputes ADD COLUMN disputeType TEXT DEFAULT 'Boundary Discrepancy'`);
    } catch (e) {
      // Column already exists
    }

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 BhoomiDrishti Backend API running on port ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
