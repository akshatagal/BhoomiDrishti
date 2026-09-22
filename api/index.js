import express from 'express';
import cors from 'cors';
import apiRoutes from '../server/routes/apiRoutes.js';
import { seedDatabase } from '../server/database/seed.js';

const app = express();

app.use(cors());
app.use(express.json());

// Initialize SQLite Database Seeding
seedDatabase().catch((err) => console.error('DB seed error:', err));

app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', system: 'BhoomiDrishti Vercel Deployment' });
});

export default app;
