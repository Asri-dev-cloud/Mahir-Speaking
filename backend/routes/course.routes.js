import express from 'express';
import { query, dbCompleteLesson } from '../database/db.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
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

// Get Course by ID with lessons & quizzes
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

    // Fetch quizzes for each lesson
    for (let lesson of lessons) {
      const quizzes = await query(`SELECT * FROM quizzes WHERE lesson_id = ?`, [lesson.id]);
      lesson.quizzes = quizzes.map(q => ({
        ...q,
        options: JSON.parse(q.options || '[]')
      }));
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

// Complete a Lesson & Submit Quiz / Award XP
router.post('/complete-lesson', verifyToken, async (req, res) => {
  try {
    const { lesson_id, score, xp_earned } = req.body;
    const userId = req.user.id;

    const addXp = xp_earned || 50;

    // Jalankan Stored Procedure / Transaksi Aman kelulusan materi & kuis
    const result = await dbCompleteLesson(userId, lesson_id, score || 100, addXp);

    return res.json({
      success: true,
      message: result.status_code === 'ALREADY_COMPLETED' 
        ? `Lesson score updated! Current highscore: ${score}%`
        : `Lesson completed! +${addXp} XP earned! ✨`,
      xp: result.new_xp,
      points: result.new_points
    });
  } catch (err) {
    console.error('Complete lesson error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save lesson progress.' });
  }
});

// Tutor: Create/Upload Lesson
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

    // Update total lessons count in course
    await query(`UPDATE courses SET total_lessons = total_lessons + 1 WHERE id = ?`, [course_id]);

    // If quiz is provided
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
