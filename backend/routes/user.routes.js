import express from 'express';
import { query } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Mengambil informasi profil lengkap dari pengguna yang sedang login beserta tingkat paket aktif.
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

// Sinkronisasi ulang total XP pengguna berdasarkan riwayat pelajaran yang telah diselesaikan.
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

// Memperbarui informasi biodata profil pengguna (nama, whatsapp, dan avatar).
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

// Pendaftaran calon siswa baru dari formulir tes penempatan tingkat kemampuan berbicara (placement test).
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

// Mengambil daftar dokumen modul belajar resmi yang tersedia untuk dibaca.
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

// Public: Get all blog likes
router.get('/blog-likes', async (req, res) => {
  try {
    const likes = await query(`SELECT post_id, likes_count FROM blog_likes`);
    return res.json({ success: true, likes });
  } catch (err) {
    console.error('Fetch blog likes error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch blog likes.' });
  }
});

// Public: Add/remove a like for a specific blog post
router.post('/blog-likes/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    const { action } = req.body; // 'like' or 'unlike'

    const existing = await query(`SELECT likes_count FROM blog_likes WHERE post_id = ?`, [postId]);
    
    let newCount = 0;
    if (existing.length === 0) {
      newCount = action === 'unlike' ? 0 : 1;
      await query(`INSERT INTO blog_likes (post_id, likes_count) VALUES (?, ?)`, [postId, newCount]);
    } else {
      const currentCount = existing[0].likes_count || 0;
      if (action === 'unlike') {
        newCount = Math.max(0, currentCount - 1);
      } else {
        newCount = currentCount + 1;
      }
      await query(`UPDATE blog_likes SET likes_count = ? WHERE post_id = ?`, [newCount, postId]);
    }

    return res.json({ success: true, likes_count: newCount });
  } catch (err) {
    console.error('Update blog likes error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update blog likes.' });
  }
});

// Public: Get all alumni stories
router.get('/alumni-stories', async (req, res) => {
  try {
    const stories = await query(`SELECT id, name, text, rating, created_at FROM alumni_stories ORDER BY id DESC`);
    return res.json({ success: true, stories });
  } catch (err) {
    console.error('Fetch alumni stories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch alumni stories.' });
  }
});

// Public: Submit a new alumni story
router.post('/alumni-stories', async (req, res) => {
  try {
    const { name, text, rating } = req.body;
    if (!name || !text) {
      return res.status(400).json({ success: false, message: 'Nama dan cerita wajib diisi.' });
    }

    const storyRating = parseInt(rating) || 5;

    const result = await query(
      `INSERT INTO alumni_stories (name, text, rating) VALUES (?, ?, ?)`,
      [name.trim(), text.trim(), storyRating]
    );

    const newStory = {
      id: result.lastID,
      name: name.trim(),
      text: text.trim(),
      rating: storyRating,
      created_at: new Date()
    };

    return res.json({ success: true, message: 'Cerita berhasil dikirim!', story: newStory });
  } catch (err) {
    console.error('Submit alumni story error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit alumni story.' });
  }
});

// Public: Get all blog posts
router.get('/blog-posts', async (req, res) => {
  try {
    const posts = await query(`
      SELECT id, title, excerpt, category, author, author_image AS "authorImage",
             date, read_time AS "readTime", image, featured, likes, comments_count AS "commentsCount", content 
      FROM blog_posts ORDER BY id DESC
    `);
    
    // Map featured to boolean for React
    const formatted = posts.map(p => ({
      ...p,
      featured: p.featured === 1 || p.featured === true || p.featured === '1'
    }));

    return res.json({ success: true, posts: formatted });
  } catch (err) {
    console.error('Fetch blog posts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch blog posts.' });
  }
});

// Public: Create a new blog post
router.post('/blog-posts', async (req, res) => {
  try {
    const { title, excerpt, category, author, authorImage, readTime, image, featured, content } = req.body;
    
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Judul, ringkasan, dan konten wajib diisi.' });
    }

    const isFeatured = featured ? 1 : 0;
    
    if (isFeatured === 1) {
      // Unfeature other posts
      await query(`UPDATE blog_posts SET featured = 0`);
    }

    const result = await query(
      `INSERT INTO blog_posts 
       (title, excerpt, category, author, author_image, date, read_time, image, featured, likes, comments_count, content) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
      [
        title.trim(),
        excerpt.trim(),
        category || 'Tips & Trik',
        author ? author.trim() : 'Administrator',
        authorImage || '/MP.png',
        new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        readTime || '5 Menit Baca',
        image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
        isFeatured,
        content.trim()
      ]
    );

    const newPost = {
      id: result.lastID,
      title,
      excerpt,
      category: category || 'Tips & Trik',
      author: author || 'Administrator',
      authorImage: authorImage || '/MP.png',
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      readTime: readTime || '5 Menit Baca',
      image: image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
      featured: isFeatured === 1,
      likes: 0,
      commentsCount: 0,
      content
    };

    return res.json({ success: true, message: 'Artikel berhasil diterbitkan!', post: newPost });
  } catch (err) {
    console.error('Create blog post error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create blog post.' });
  }
});

// Public: Delete a blog post
router.delete('/blog-posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID.' });
    }

    await query(`DELETE FROM blog_posts WHERE id = ?`, [postId]);
    return res.json({ success: true, message: 'Artikel berhasil dihapus!' });
  } catch (err) {
    console.error('Delete blog post error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete blog post.' });
  }
});

export default router;
