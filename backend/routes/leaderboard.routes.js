import express from 'express';
import { query } from '../database/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const leaderboard = await query(`
      SELECT u.id, u.full_name, u.username, u.xp, u.points, u.streak, u.avatar, u.role, p.badge as package_badge, p.name as package_name
      FROM users u
      LEFT JOIN packages p ON u.package_id = p.id
      WHERE u.xp > 0
      ORDER BY u.xp DESC, u.points DESC
      LIMIT 50
    `);

    const ranked = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    return res.json({
      success: true,
      top3: ranked.slice(0, 3),
      rankings: ranked
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
});

export default router;
