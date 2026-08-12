import express from 'express';
import { query } from '../database/db.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Mengambil semua data latihan (Tersedia untuk umum).
router.get('/', async (req, res) => {
  try {
    const rawExercises = await query(`SELECT * FROM exercises ORDER BY id ASC`);
    const exercises = rawExercises.map(ex => ({
      id: ex.id,
      level: ex.level,
      title: ex.title,
      instruction: ex.instruction,
      referenceText: ex.referenceText || ex.reference_text || '',
      translation: ex.translation
    }));
    return res.json({ success: true, exercises });
  } catch (err) {
    console.error('Error fetching exercises:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch exercises.' });
  }
});

// Membuat latihan baru (Khusus Admin).
router.post('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { level, title, instruction, referenceText, translation } = req.body;

    if (!level || !title || !instruction || !referenceText || !translation) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    const { dbType } = await import('../database/db.js');
    const column = dbType === 'postgres' ? 'reference_text' : 'referenceText';

    const result = await query(
      `INSERT INTO exercises (level, title, instruction, ${column}, translation) VALUES (?, ?, ?, ?, ?)`,
      [level, title, instruction, referenceText, translation]
    );

    return res.status(201).json({
      success: true,
      message: 'Latihan baru berhasil ditambahkan.',
      exerciseId: result.lastID
    });
  } catch (err) {
    console.error('Error creating exercise:', err);
    return res.status(500).json({ success: false, message: 'Failed to create exercise.' });
  }
});

// Memperbarui latihan (Khusus Admin).
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const exerciseId = req.params.id;
    const { level, title, instruction, referenceText, translation } = req.body;

    if (!level || !title || !instruction || !referenceText || !translation) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi.' });
    }

    const existing = await query(`SELECT * FROM exercises WHERE id = ?`, [exerciseId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Latihan tidak ditemukan.' });
    }

    const { dbType } = await import('../database/db.js');
    const column = dbType === 'postgres' ? 'reference_text' : 'referenceText';

    await query(
      `UPDATE exercises SET level = ?, title = ?, instruction = ?, ${column} = ?, translation = ? WHERE id = ?`,
      [level, title, instruction, referenceText, translation, exerciseId]
    );

    return res.json({ success: true, message: 'Latihan berhasil diperbarui.' });
  } catch (err) {
    console.error('Error updating exercise:', err);
    return res.status(500).json({ success: false, message: 'Failed to update exercise.' });
  }
});

// Menghapus latihan (Khusus Admin).
router.delete('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const exerciseId = req.params.id;

    const existing = await query(`SELECT * FROM exercises WHERE id = ?`, [exerciseId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Latihan tidak ditemukan.' });
    }

    await query(`DELETE FROM exercises WHERE id = ?`, [exerciseId]);

    return res.json({ success: true, message: 'Latihan berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting exercise:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete exercise.' });
  }
});

export default router;
