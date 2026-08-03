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
    const totalRevenue = await query(`SELECT SUM(amount) as sum FROM purchases WHERE status = 'success'`);
    const recentPurchases = await query(`
      SELECT p.*, u.full_name, u.email, pkg.name as package_name 
      FROM purchases p 
      JOIN users u ON p.user_id = u.id 
      JOIN packages pkg ON p.package_id = pkg.id 
      ORDER BY p.created_at DESC 
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
    return res.status(500).json({ success: false, message: 'Failed to fetch admin analytics.' });
  }
});

// Manage Users - Get list & update user role/package
router.get('/users', async (req, res) => {
  try {
    const users = await query(`
      SELECT u.id, u.full_name, u.username, u.email, u.whatsapp, u.role, u.package_id, u.xp, u.points, u.streak, u.created_at, p.name as package_name, u.admin_type
      FROM users u
      LEFT JOIN packages p ON u.package_id = p.id
      ORDER BY u.id DESC
    `);
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user list.' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, package_id, admin_type } = req.body;
    const userId = req.params.id;

    await query(`UPDATE users SET role = ?, package_id = ?, admin_type = ? WHERE id = ?`, [role, package_id || null, admin_type || null, userId]);

    return res.json({ success: true, message: 'User updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update user.' });
  }
});

// Add Assistant Admin to DB (inserts user with admin role/admin_type)
router.post('/assistants', async (req, res) => {
  const { full_name, email, whatsapp, role, admin_type } = req.body;
  try {
    const defaultPassword = 'mahirasisten123';
    const username = email.split('@')[0];

    // Check if email already registered
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    // Insert new user into database (defaults package_id to 3 = Master/Premium Admin)
    const result = await query(
      `INSERT INTO users (full_name, username, email, whatsapp, password, role, admin_type, package_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 3)`,
      [full_name, username, email, whatsapp || null, defaultPassword, role || 'admin', admin_type || 'Admin Asisten']
    );

    // Retrieve inserted ID from returning result
    const newId = result.lastID || Date.now();
    const newUser = {
      id: newId,
      full_name,
      username,
      email,
      whatsapp,
      role: role || 'admin',
      admin_type: admin_type || 'Admin Asisten'
    };

    return res.status(201).json({ success: true, assistant: newUser, message: 'Admin Asisten berhasil ditambahkan!' });
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
