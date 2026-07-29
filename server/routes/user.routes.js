import express from 'express';
import { query } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get Current User Profile with Package Details
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const users = await query(
      `SELECT u.id, u.full_name, u.username, u.email, u.whatsapp, u.role, u.package_id, u.xp, u.points, u.streak, u.avatar, u.created_at,
              p.name as package_name, p.ai_daily_limit, p.tutor_sessions, p.badge as package_badge
       FROM users u
       LEFT JOIN packages p ON u.package_id = p.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Also fetch completed lesson IDs
    const progress = await query(
      `SELECT lesson_id, score, completed_at FROM user_progress WHERE user_id = ? AND completed = 1`,
      [req.user.id]
    );

    return res.json({
      success: true,
      user: users[0],
      completedLessons: progress
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { full_name, whatsapp, avatar } = req.body;
    await query(
      `UPDATE users SET full_name = ?, whatsapp = ?, avatar = ? WHERE id = ?`,
      [full_name, whatsapp, avatar, req.user.id]
    );

    const updated = await query(`SELECT id, full_name, username, email, whatsapp, role, package_id, xp, points, streak, avatar FROM users WHERE id = ?`, [req.user.id]);
    return res.json({ success: true, message: 'Profile updated successfully!', user: updated[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

export default router;
