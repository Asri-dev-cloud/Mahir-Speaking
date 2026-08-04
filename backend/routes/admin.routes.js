import express from 'express';
import { query } from '../database/db.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Apply Admin check to all admin routes
router.use(verifyToken, checkRole(['admin']));

// Platform Analytics Dashboard
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await query(`SELECT COUNT(*) as count FROM users`);
    const totalStudents = await query(`SELECT COUNT(*) as count FROM users WHERE role = 'student'`);
    const totalTutors = await query(`SELECT COUNT(*) as count FROM users WHERE role = 'tutor'`);
    const totalCourses = await query(`SELECT COUNT(*) as count FROM courses`);
    const totalLessons = await query(`SELECT COUNT(*) as count FROM lessons`);
    const activeTrials = await query(`SELECT COUNT(*) as count FROM users WHERE is_trial = true`);
    const totalLeads = await query(`SELECT COUNT(*) as count FROM placement_test_leads`);
    const expiringSoon = await query(`SELECT COUNT(*) as count FROM users WHERE package_expires BETWEEN NOW() AND NOW() + INTERVAL '7 days'`);
    const totalRevenue = await query(`
      SELECT COALESCE(SUM(gross_amount), 0) AS sum
      FROM payment_transactions
      WHERE payment_status = 'paid'
    `);
    const recentPurchases = await query(`
      SELECT pt.id, pt.order_id, pt.user_id, pt.package_code,
             pt.package_name, pt.gross_amount AS amount,
             pt.payment_status AS status, pt.payment_type,
             pt.paid_at, pt.created_at,
             u.full_name, u.email
      FROM payment_transactions pt
      JOIN users u ON pt.user_id = u.id
      WHERE pt.payment_status = 'paid'
      ORDER BY COALESCE(pt.paid_at, pt.created_at) DESC
      LIMIT 10
    `);

    return res.json({
      success: true,
      stats: {
        totalUsers: totalUsers[0]?.count || 0,
        totalStudents: totalStudents[0]?.count || 0,
        totalTutors: totalTutors[0]?.count || 0,
        totalCourses: totalCourses[0]?.count || 0,
        totalLessons: totalLessons[0]?.count || 0,
        activeTrials: Number(activeTrials[0]?.count || 0),
        totalLeads: Number(totalLeads[0]?.count || 0),
        expiringSoon: Number(expiringSoon[0]?.count || 0),
        totalRevenue: Number(totalRevenue[0]?.sum || 0)
      },
      recentPurchases
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin analytics.' });
  }
});

// Manage Users - Get list & update user role/package
router.get('/users', async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.full_name, u.username, u.email, u.whatsapp,
             u.role, u.admin_type, u.package_id,
             COALESCE(NULLIF(u.package_name, ''), p.name) AS package_name,
             u.package_expires, u.is_trial,
             u.xp, u.points, u.streak, u.created_at
      FROM users u
      LEFT JOIN packages p ON u.package_id = p.id
      ORDER BY u.id DESC
    `);
    return res.json({ success: true, users });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch user list.' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const allowedFields = [
      'role',
      'package_id',
      'admin_type',
      'package_name',
      'package_expires',
      'is_trial'
    ];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data pengguna yang diperbarui.' });
    }

    values.push(userId);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    return res.json({ success: true, message: 'User updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
});

// Add Assistant Admin to DB (upgrades existing user to admin role/admin_type)
router.post('/assistants', async (req, res) => {
  const { email } = req.body;
  const emailLower = (email || '').trim().toLowerCase();
  try {
    // Check if user exists
    const existing = await query('SELECT id, full_name, role FROM users WHERE LOWER(email) = ?', [emailLower]);
    if (!existing || existing.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pengguna dengan email tersebut belum terdaftar! Silakan minta calon asisten mendaftar akun di website terlebih dahulu.'
      });
    }

    const targetUser = existing[0];
    if (targetUser.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: `${targetUser.full_name} sudah berstatus sebagai Admin!`
      });
    }

    // Upgrade their role to admin and admin_type to Admin Asisten
    await query(
      `UPDATE users SET role = 'admin', admin_type = 'Admin Asisten' WHERE id = ?`,
      [targetUser.id]
    );

    return res.status(201).json({
      success: true,
      assistant: {
        id: targetUser.id,
        full_name: targetUser.full_name,
        email: emailLower,
        role: 'admin',
        admin_type: 'Admin Asisten'
      },
      message: `${targetUser.full_name} berhasil dijadikan Admin Asisten!`
    });
  } catch (err) {
    console.error('Failed to add assistant admin:', err);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan Admin Asisten.' });
  }
});

// Manage Packages - Update package prices / limits
router.put('/packages/:id', async (req, res) => {
  try {
    const { name, price, ai_daily_limit, tutor_sessions, badge } = req.body;
    const packageId = req.params.id;

    await query(
      `UPDATE packages SET name = ?, price = ?, ai_daily_limit = ?, tutor_sessions = ?, badge = ? WHERE id = ?`,
      [name, price, ai_daily_limit, tutor_sessions, badge, packageId]
    );

    return res.json({ success: true, message: 'Package updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update package.' });
  }
});

router.get('/leads', async (req, res) => {
  try {
    const leads = await query(`SELECT id, nama, no_wa AS "noWa", email, level_target AS "levelTarget", recommended_level AS "recommendedLevel", jadwal_trial AS "jadwalTrial", catatan, status, created_at FROM placement_test_leads ORDER BY created_at DESC`);
    res.json({ success: true, leads });
  } catch (err) {
    console.error('Admin leads error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data leads.' });
  }
});

router.put('/leads/:id/status', async (req, res) => {
  try {
    await query(`UPDATE placement_test_leads SET status = ?, updated_at = NOW() WHERE id = ?`, [req.body.status, req.params.id]);
    res.json({ success: true, message: 'Status lead diperbarui.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui lead.' });
  }
});

router.delete('/leads/:id', async (req, res) => {
  try {
    await query(`DELETE FROM placement_test_leads WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Lead dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus lead.' });
  }
});

router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await query(`SELECT id, lesson_id, question, options, correct_answer, xp_reward, created_at FROM quizzes ORDER BY id DESC`);
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil kuis.' });
  }
});

router.post('/quizzes', async (req, res) => {
  const quizzes = Array.isArray(req.body.quizzes) ? req.body.quizzes : [];
  try {
    for (const item of quizzes) {
      await query(`INSERT INTO quizzes (lesson_id, question, options, correct_answer, xp_reward, created_by) VALUES (?, ?, ?::jsonb, ?, ?, ?)`, [item.lesson_id, item.question, JSON.stringify(item.options || []), item.correct_answer, item.xp_reward || 20, req.user.id]);
    }
    res.status(201).json({ success: true, count: quizzes.length, message: `${quizzes.length} kuis berhasil ditambahkan.` });
  } catch (err) {
    console.error('Save quizzes error:', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan kuis.' });
  }
});

router.delete('/quizzes/:id', async (req, res) => {
  try {
    await query(`DELETE FROM quizzes WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Kuis dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kuis.' });
  }
});

router.get('/modules', async (req, res) => {
  try {
    const modules = await query(`SELECT id, title, type, file_size AS size, badge, description AS "desc", file_url AS "fileUrl", created_at FROM modules ORDER BY created_at DESC`);
    res.json({ success: true, modules });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil modul.' });
  }
});

router.post('/modules', async (req, res) => {
  const { title, type, size, badge, desc, fileUrl } = req.body;
  try {
    const rows = await query(`INSERT INTO modules (title, type, file_size, badge, description, file_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, title, type, file_size AS size, badge, description AS "desc", file_url AS "fileUrl", created_at`, [title, type || 'PDF Document', size || null, badge || 'Official Modul', desc || null, fileUrl, req.user.id]);
    res.status(201).json({ success: true, module: rows[0], message: 'Modul berhasil ditambahkan.' });
  } catch (err) {
    console.error('Save module error:', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan modul.' });
  }
});

router.delete('/modules/:id', async (req, res) => {
  try {
    await query(`DELETE FROM modules WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Modul dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus modul.' });
  }
});

router.get('/recorded-videos', async (req, res) => {
  try {
    const videos = await query(`SELECT id, title, tutor, duration, level, video_url AS "videoUrl", thumbnail, created_at FROM recorded_videos ORDER BY created_at DESC`);
    res.json({ success: true, videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil video.' });
  }
});

router.post('/recorded-videos', async (req, res) => {
  const { title, tutor, duration, level, videoUrl, thumbnail } = req.body;
  try {
    const rows = await query(`INSERT INTO recorded_videos (title, tutor, duration, level, video_url, thumbnail, created_by) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, title, tutor, duration, level, video_url AS "videoUrl", thumbnail, created_at`, [title, tutor || null, duration || null, level || 'All Levels', videoUrl, thumbnail || null, req.user.id]);
    res.status(201).json({ success: true, video: rows[0], message: 'Video berhasil ditambahkan.' });
  } catch (err) {
    console.error('Save video error:', err);
    res.status(500).json({ success: false, message: 'Gagal menyimpan video.' });
  }
});

router.delete('/recorded-videos/:id', async (req, res) => {
  try {
    await query(`DELETE FROM recorded_videos WHERE id = ?`, [req.params.id]);
    res.json({ success: true, message: 'Video dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus video.' });
  }
});

export default router;
