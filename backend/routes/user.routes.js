import express from 'express';
import { query } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get Current User Profile with Package Details
router.get('/profile', verifyToken, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const users = await query(
      `SELECT u.id, u.full_name, u.username, u.email, u.whatsapp, u.role,
              u.package_id, u.package_expires, u.is_trial,
              u.xp, u.points, u.streak, u.avatar, u.created_at,
              COALESCE(NULLIF(u.package_name, ''), p.name) AS package_name,
              p.name AS package_plan_name,
              p.ai_daily_limit, p.tutor_sessions, p.badge AS package_badge
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

// Add XP (Safe Increment)
router.post('/add-xp', verifyToken, async (req, res) => {
  try {
    const { xp } = req.body;
    const userId = req.user.id;

    const xpToAdd = Number(xp || 0);

    await query(
      `UPDATE users
       SET xp = xp + ?
       WHERE id = ?`,
      [xpToAdd, userId]
    );

    const updated = await query('SELECT xp, points, streak FROM users WHERE id = ?', [userId]);

    return res.json({
      success: true,
      xp: updated[0].xp,
      points: updated[0].points,
      streak: updated[0].streak
    });
  } catch (err) {
    console.error('Add XP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to add XP.' });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { full_name, whatsapp, avatar, xp } = req.body;
    
    const fields = [];
    const values = [];

    if (full_name !== undefined) { fields.push('full_name = ?'); values.push(full_name); }
    if (whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(whatsapp); }
    if (avatar !== undefined) { fields.push('avatar = ?'); values.push(avatar); }
    if (xp !== undefined) { fields.push('xp = ?'); values.push(Number(xp)); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update.' });
    }

    values.push(req.user.id);
    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const updated = await query(`SELECT id, full_name, username, email, whatsapp, role, package_id, xp, points, streak, avatar FROM users WHERE id = ?`, [req.user.id]);
    return res.json({ success: true, message: 'Profile updated successfully!', user: updated[0] });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

export default router;
