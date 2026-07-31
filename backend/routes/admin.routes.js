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
        totalRevenue: totalRevenue[0]?.sum || 0
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
      SELECT u.id, u.full_name, u.username, u.email, u.whatsapp, u.role, u.package_id, u.xp, u.points, u.streak, u.created_at, p.name as package_name
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
    const { role, package_id } = req.body;
    const userId = req.params.id;

    await query(`UPDATE users SET role = ?, package_id = ? WHERE id = ?`, [role, package_id, userId]);

    return res.json({ success: true, message: 'User updated successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update user.' });
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

export default router;
