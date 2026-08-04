import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initSeedData } from './database/seeds.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import packageRoutes from './routes/package.routes.js';
import aiRoutes from './routes/ai.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import adminRoutes from './routes/admin.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import paymentRoutes from './routes/payment.routes.js';

import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { securityHeaders, botFilter, sanitizeInput } from './middleware/security.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(securityHeaders);
app.use(botFilter);
app.use(cors());
app.use(express.json());
app.use(sanitizeInput);
app.use(globalLimiter);

initSeedData();

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Mahir Speaking API Server',
    timestamp: new Date(),
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Mahir Speaking Server running at http://localhost:${PORT}`);
  });
}

export default app;
