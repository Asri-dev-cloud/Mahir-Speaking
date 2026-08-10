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
      `SELECT lesson_id, score, completed_at FROM user_progress WHERE user_id = ? AND completed = true`,
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

// Recalculate XP (strictly matches sum of completed quizzes)
router.post('/add-xp', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Recalculate user's XP strictly based on completed quizzes progress
    await query(
      `UPDATE users
       SET xp = (SELECT COALESCE(SUM(xp_earned), 0) FROM user_progress WHERE user_id = ? AND completed = true)
       WHERE id = ?`,
      [userId, userId]
    );

    const updated = await query('SELECT xp, points, streak FROM users WHERE id = ?', [userId]);

    return res.json({
      success: true,
      xp: updated[0].xp,
      points: updated[0].points,
      streak: updated[0].streak
    });
  } catch (err) {
    console.error('Recalculate XP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to recalculate XP.' });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { full_name, whatsapp, avatar } = req.body;
    
    const fields = [];
    const values = [];

    if (full_name !== undefined) { fields.push('full_name = ?'); values.push(full_name); }
    if (whatsapp !== undefined) { fields.push('whatsapp = ?'); values.push(whatsapp); }
    if (avatar !== undefined) { fields.push('avatar = ?'); values.push(avatar); }

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

// Public: Submit Placement Test Lead
router.post('/placement-lead', async (req, res) => {
  try {
    const { nama, noWa, email, levelTarget, recommendedLevel, jadwalTrial, catatan } = req.body;
    
    if (!nama || !noWa) {
      return res.status(400).json({ success: false, message: 'Nama dan nomor WhatsApp wajib diisi.' });
    }

    const cleanWa = noWa.replace(/[^0-9]/g, '');

    const result = await query(
      `INSERT INTO placement_test_leads (
        nama, no_wa, email, level_target, recommended_level, jadwal_trial, catatan, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Belum Dihubungi')`,
      [
        nama.trim(),
        cleanWa,
        email ? email.trim() : null,
        levelTarget || null,
        recommendedLevel || null,
        jadwalTrial || null,
        catatan || null
      ]
    );

    return res.json({ success: true, message: 'Data lead berhasil disimpan.', leadId: result.lastID });
  } catch (err) {
    console.error('Submit placement lead error:', err);
    return res.status(500).json({ success: false, message: 'Gagal menyimpan data lead.' });
  }
});

// Public: Get all modules from database
router.get('/modules', async (req, res) => {
  try {
    const modules = await query(`SELECT id, title, type, file_size AS size, badge, description AS "desc", file_url AS "fileUrl", created_at FROM modules ORDER BY id DESC`);
    return res.json({ success: true, modules });
  } catch (err) {
    console.error('Fetch modules error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch modules.' });
  }
});

// Public: Get all recorded videos from database
router.get('/recorded-videos', async (req, res) => {
  try {
    const videos = await query(`SELECT id, title, tutor, duration, level, video_url AS "videoUrl", thumbnail, created_at FROM recorded_videos ORDER BY id DESC`);
    return res.json({ success: true, videos });
  } catch (err) {
    console.error('Fetch videos error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch videos.' });
  }
});

export default router;
