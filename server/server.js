import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSeedData } from './database/seeds.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import packageRoutes from './routes/package.routes.js';
import aiRoutes from './routes/ai.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database Tables & Demo Seeds
initSeedData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Mahir Speaking API Server', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Mahir Speaking Server running on http://localhost:${PORT}`);
});
