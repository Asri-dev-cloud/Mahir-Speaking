import express from 'express';
import { query, dbCompleteLesson } from '../database/db.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Mengambil semua daftar kelas belajar yang tersedia di platform.
router.get('/', async (req, res) => {
  try {
    const courses = await query(`
      SELECT c.*, u.full_name as tutor_name, u.avatar as tutor_avatar 
      FROM courses c
      LEFT JOIN users u ON c.tutor_id = u.id
      ORDER BY c.id ASC
    `);
    return res.json({ success: true, courses });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
});

// Mengambil rincian kelas belajar berdasarkan ID beserta unit pelajaran dan kuisnya.
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await query(
      `SELECT c.*, u.full_name as tutor_name, u.avatar as tutor_avatar FROM courses c LEFT JOIN users u ON c.tutor_id = u.id WHERE c.id = ?`,
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const lessons = await query(
      `SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC`,
      [courseId]
    );

    // Mengambil data kuis terkait untuk semua unit pelajaran secara sekaligus (Optimasi N+1 Query)
    const lessonIds = lessons.map(l => l.id);
    const quizzesByLessonId = {};
    
    if (lessonIds.length > 0) {
      const placeholders = lessonIds.map(() => '?').join(', ');
      const quizzes = await query(`SELECT * FROM quizzes WHERE lesson_id IN (${placeholders})`, lessonIds);
      
      for (const q of quizzes) {
        const lessonId = q.lesson_id;
        if (!quizzesByLessonId[lessonId]) {
          quizzesByLessonId[lessonId] = [];
        }
        quizzesByLessonId[lessonId].push({
          ...q,
          options: JSON.parse(q.options || '[]')
        });
      }
    }

    for (let lesson of lessons) {
      lesson.quizzes = quizzesByLessonId[lesson.id] || [];
    }

    return res.json({
      success: true,
      course: courses[0],
      lessons
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch course details.' });
  }
});

// Menyelesaikan sebuah materi pelajaran dan mengirimkan hasil kuis untuk memperbarui XP.
router.post('/complete-lesson', verifyToken, async (req, res) => {
  try {
    const { lesson_id, score, xp_earned } = req.body;
    const userId = req.user.id;
    const addXp = xp_earned !== undefined ? Number(xp_earned) : 5;

    // Jalankan Stored Procedure atau transaksi penyelesaian kuis secara aman
    const result = await dbCompleteLesson(userId, lesson_id, score || 100, addXp);

    return res.json({
      success: true,
      message: result.status_code === 'ALREADY_COMPLETED' 
        ? `Lesson score updated! Current highscore: ${score}%`
        : `Lesson completed! +${addXp} XP earned!`,
      xp: result.new_xp,
      points: result.new_points,
      streak: result.new_streak
    });
  } catch (err) {
    console.error('Complete lesson error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save lesson progress.' });
  }
});

// Tutor: Menambahkan unit pelajaran baru dan kuis pelengkapnya ke dalam kelas.
router.post('/upload-lesson', verifyToken, checkRole(['tutor', 'admin']), async (req, res) => {
  try {
    const { course_id, title, video_url, reading_content, target_vocabulary, speaking_prompt, quiz } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ success: false, message: 'Course ID and lesson title are required.' });
    }

    const orderResult = await query(`SELECT MAX(order_index) as max_order FROM lessons WHERE course_id = ?`, [course_id]);
    const nextOrder = (orderResult[0]?.max_order || 0) + 1;

    const lessonResult = await query(
      `INSERT INTO lessons (course_id, title, order_index, video_url, reading_content, target_vocabulary, speaking_prompt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id,
        title,
        nextOrder,
        video_url || '',
        reading_content || '',
        typeof target_vocabulary === 'string' ? target_vocabulary : JSON.stringify(target_vocabulary || []),
        speaking_prompt || ''
      ]
    );

    // Memperbarui total jumlah pelajaran dalam kelas
    await query(`UPDATE courses SET total_lessons = total_lessons + 1 WHERE id = ?`, [course_id]);

    // Memasukkan data kuis jika dilampirkan
    if (quiz && quiz.question && Array.isArray(quiz.options)) {
      await query(
        `INSERT INTO quizzes (lesson_id, question, options, correct_answer, xp_reward)
         VALUES (?, ?, ?, ?, ?)`,
        [lessonResult.lastID, quiz.question, JSON.stringify(quiz.options), quiz.correct_answer || 0, quiz.xp_reward || 25]
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Lesson uploaded successfully!',
      lessonId: lessonResult.lastID
    });
  } catch (err) {
    console.error('Upload lesson error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload lesson.' });
  }
});

export default router;
