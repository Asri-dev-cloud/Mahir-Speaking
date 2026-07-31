import express from 'express';
import { query } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all available packages
router.get('/', async (req, res) => {
  try {
    const packages = await query(`SELECT * FROM packages ORDER BY price ASC`);
    const parsed = packages.map(p => ({
      ...p,
      features: JSON.parse(p.features || '[]')
    }));
    return res.json({ success: true, packages: parsed });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch packages.' });
  }
});

// Purchase Package
router.post('/purchase', verifyToken, async (req, res) => {
  try {
    const { package_id, payment_method } = req.body;
    const userId = req.user.id;

    const pkg = await query(`SELECT * FROM packages WHERE id = ?`, [package_id]);
    if (pkg.length === 0) {
      return res.status(404).json({ success: false, message: 'Package not found.' });
    }

    const selectedPkg = pkg[0];

    // Record purchase
    await query(
      `INSERT INTO purchases (user_id, package_id, amount, payment_method, status) VALUES (?, ?, ?, ?, 'success')`,
      [userId, package_id, selectedPkg.price, payment_method || 'QRIS']
    );

    // Upgrade user's package
    await query(`UPDATE users SET package_id = ? WHERE id = ?`, [package_id, userId]);

    return res.json({
      success: true,
      message: `Successfully upgraded to ${selectedPkg.name} Package!`,
      package: selectedPkg
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to complete package purchase.' });
  }
});

// Get user's purchase history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await query(
      `SELECT p.*, pkg.name as package_name, pkg.period 
       FROM purchases p 
       JOIN packages pkg ON p.package_id = pkg.id 
       WHERE p.user_id = ? 
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, history });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch purchase history.' });
  }
});

export default router;
