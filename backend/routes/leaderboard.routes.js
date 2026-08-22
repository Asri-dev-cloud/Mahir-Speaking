import express from 'express';
import { query } from '../database/db.js';

const router = express.Router();

// Cache sederhana untuk performa optimal di production
let cachedLeaderboard = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 menit

// Mengambil daftar peringkat pengguna (leaderboard) berdasarkan jumlah XP dan poin tertinggi.
router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (cachedLeaderboard && (now - lastFetchTime < CACHE_DURATION)) {
      return res.json(cachedLeaderboard);
    }

    const leaderboard = await query(`
      SELECT u.id, u.full_name, u.username, u.xp, u.points, u.streak, u.avatar, u.role, p.badge as package_badge, p.name as package_name
      FROM users u
      LEFT JOIN packages p ON u.package_id = p.id
      ORDER BY u.xp DESC, u.points DESC
      LIMIT 50
    `);

    const ranked = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    const responseData = {
      success: true,
      top3: ranked.slice(0, 3),
      rankings: ranked
    };

    cachedLeaderboard = responseData;
    lastFetchTime = now;

    return res.json(responseData);
  } catch (err) {
    console.error('Leaderboard error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
});

export default router;
