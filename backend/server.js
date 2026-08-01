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
import exerciseRoutes from './routes/exercise.routes.js';

// 🛡️ Import Security & Bot Protection Middlewares
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { securityHeaders, botFilter, sanitizeInput } from './middleware/security.js';

// ⚙️ Konfigurasi Environment & Inisialisasi Server Express
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔒 Terapkan HTTP Security Headers & Bot Filtering Secara Global
app.use(securityHeaders);
app.use(botFilter);

app.use(cors());
app.use(express.json());

// 🧹 Sanitasi Input dari Potensi XSS
app.use(sanitizeInput);

// ⏱️ Batasi request spamming secara global
app.use(globalLimiter);

// 🛠️ Bikin tabel DB & nyiapin seed data biar gak suwung ya bestie~ ✨
initSeedData();

// 🛣️ Jalur Tol API (Routes) Pembawa Kebahagiaan Data
// Khusus rute autentikasi dipasang limiter ekstra ketat (Anti Brute-Force & Bot Spam)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exercises', exerciseRoutes);

// 🩺 Endpoint Cek Kesehatan Server (Biar Tau Server Masih Napas Mulus)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Mahir Speaking API Server', timestamp: new Date() });
});

// 🚀 Jalankan server lokal hanya jika bukan di lingkungan production Vercel Serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Mahir Speaking Server running santuy di http://localhost:${PORT} ~ slay!`);
  });
}

export default app;
