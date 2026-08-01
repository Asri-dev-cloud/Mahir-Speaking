import express from 'express';
import { query } from '../database/db.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// 📂 Ambil semua data latihan (Public / All Users)
router.get('/', async (req, res) => {
  try {
    const exercises = await query(`SELECT * FROM exercises ORDER BY id ASC`);
    return res.json({ success: true, exercises });
  } catch (err) {
    console.error('Error fetching exercises:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch exercises.' });
  }
});

// 🔒 Buat latihan baru (Khusus Admin)
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { level, title, instruction, referenceText, translation } = req.body;

    if (!level || !title || !instruction || !referenceText || !translation) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi ya bestie!' });
    }

    const result = await query(
      `INSERT INTO exercises (level, title, instruction, referenceText, translation) VALUES (?, ?, ?, ?, ?)`,
      [level, title, instruction, referenceText, translation]
    );

    return res.status(201).json({
      success: true,
      message: 'Latihan baru berhasil ditambahkan! ✨',
      exerciseId: result.lastID
    });
  } catch (err) {
    console.error('Error creating exercise:', err);
    return res.status(500).json({ success: false, message: 'Failed to create exercise.' });
  }
});

// 🔒 Update latihan (Khusus Admin)
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const exerciseId = req.params.id;
    const { level, title, instruction, referenceText, translation } = req.body;

    if (!level || !title || !instruction || !referenceText || !translation) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi ya bestie!' });
    }

    const existing = await query(`SELECT * FROM exercises WHERE id = ?`, [exerciseId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Latihan tidak ditemukan.' });
    }

    await query(
      `UPDATE exercises SET level = ?, title = ?, instruction = ?, referenceText = ?, translation = ? WHERE id = ?`,
      [level, title, instruction, referenceText, translation, exerciseId]
    );

    return res.json({ success: true, message: 'Latihan berhasil diperbarui! 🚀' });
  } catch (err) {
    console.error('Error updating exercise:', err);
    return res.status(500).json({ success: false, message: 'Failed to update exercise.' });
  }
});

// 🔒 Hapus latihan (Khusus Admin)
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const exerciseId = req.params.id;

    const existing = await query(`SELECT * FROM exercises WHERE id = ?`, [exerciseId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Latihan tidak ditemukan.' });
    }

    await query(`DELETE FROM exercises WHERE id = ?`, [exerciseId]);

    return res.json({ success: true, message: 'Latihan berhasil dihapus! 🗑️' });
  } catch (err) {
    console.error('Error deleting exercise:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete exercise.' });
  }
});

export default router;
