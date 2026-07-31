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

// ⚙️ Konfigurasi Environment & Inisialisasi Server Express
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🛠️ Bikin tabel DB & nyiapin seed data biar gak suwung ya bestie~ ✨
initSeedData();

// 🛣️ Jalur Tol API (Routes) Pembawa Kebahagiaan Data
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// 🩺 Endpoint Cek Kesehatan Server (Biar Tau Server Masih Napas Mulus)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Mahir Speaking API Server', timestamp: new Date() });
});

// 🚀 Server Meluncur Terbang di Port Pilihan!
app.listen(PORT, () => {
  console.log(`🚀 Mahir Speaking Server running santuy di http://localhost:${PORT} ~ slay!`);
});
