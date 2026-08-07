import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🪴 Fungsi Penyemaian Data Awal Database (Seed Data Bikin DB Slay)
export async function initSeedData() {
  try {
    const isPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

    if (isPostgres) {
      console.log('🏗️ [Database] Menginisialisasi/memperbarui skema & Stored Procedures PostgreSQL...');
      const schemaPath = path.join(__dirname, 'mahir_speaking_supabase.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      // Jalankan seluruh skema SQL
      await query(schemaSql);
      console.log('✅ [Database] Skema & Stored Procedures PostgreSQL berhasil diinisialisasi!');

      // 🌟 Hapus data user lama (Aci, Fariha, Ira, Pipit, David Miller, Mahir Admin) dari cloud Neon Postgres agar leaderboard bersih
      await query(`DELETE FROM users WHERE email IN ('aci@mahirspeaking.com', 'fariha@mahirspeaking.com', 'ira@mahirspeaking.com', 'pipit@mahirspeaking.com', 'tutor@mahirspeaking.com', 'admin@mahirspeaking.com')`);
    } else {
      // 🏗️ Bikin Tabel Database Kalo Belum Ada Gais~
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          full_name TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          whatsapp TEXT,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'student',
          package_id INTEGER DEFAULT 1,
          package_name TEXT,
          package_expires TEXT,
          is_trial INTEGER DEFAULT 0,
          admin_type TEXT,
          xp INTEGER DEFAULT 0,
          points INTEGER DEFAULT 0,
          streak INTEGER DEFAULT 1,
          avatar TEXT DEFAULT '/ma.png',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Migrasi kolom tambahan di SQLite untuk sinkronisasi role & package admin/student
      try {
        const tableInfo = await query(`PRAGMA table_info(users)`);
        if (Array.isArray(tableInfo) && tableInfo.length > 0) {
          const columns = tableInfo.map(info => info.name);
          if (!columns.includes('package_name')) {
            await query(`ALTER TABLE users ADD COLUMN package_name TEXT`);
          }
          if (!columns.includes('package_expires')) {
            await query(`ALTER TABLE users ADD COLUMN package_expires TEXT`);
          }
          if (!columns.includes('is_trial')) {
            await query(`ALTER TABLE users ADD COLUMN is_trial INTEGER DEFAULT 0`);
          }
          if (!columns.includes('admin_type')) {
            await query(`ALTER TABLE users ADD COLUMN admin_type TEXT`);
          }
        }
      } catch (err) {
        console.error('⚠️ [Database] Gagal migrasi kolom baru di SQLite:', err.message);
      }

      await query(`
        CREATE TABLE IF NOT EXISTS packages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price INTEGER NOT NULL,
          period TEXT DEFAULT 'monthly',
          ai_daily_limit INTEGER NOT NULL,
          tutor_sessions INTEGER NOT NULL,
          badge TEXT,
          features TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          level TEXT NOT NULL,
          description TEXT,
          tutor_id INTEGER,
          thumbnail TEXT,
          total_lessons INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS lessons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          course_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          order_index INTEGER NOT NULL,
          video_url TEXT,
          reading_content TEXT,
          target_vocabulary TEXT,
          speaking_prompt TEXT,
          xp_reward INTEGER DEFAULT 50,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS quizzes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          lesson_id INTEGER NOT NULL,
          question TEXT NOT NULL,
          options TEXT NOT NULL,
          correct_answer INTEGER NOT NULL,
          xp_reward INTEGER DEFAULT 20
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          lesson_id INTEGER NOT NULL,
          completed INTEGER DEFAULT 0,
          score INTEGER DEFAULT 0,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          package_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          payment_method TEXT DEFAULT 'QRIS',
          status TEXT DEFAULT 'success',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(`
        CREATE TABLE IF NOT EXISTS ai_chats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          role TEXT NOT NULL,
          mode TEXT DEFAULT 'general',
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 🤖 Tabel Latihan Bot Mashira AI
      await query(`
        CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          level TEXT NOT NULL,
          title TEXT NOT NULL,
          instruction TEXT NOT NULL,
          referenceText TEXT NOT NULL,
          translation TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // 📦 Cek & Semai Paket Langganan Biar User Bisa Belanja
    console.log('Nyiapin paket-paket langganan ketche dlu gais...');
    await query(`DELETE FROM packages`);
    await query(`
      INSERT INTO packages (id, name, price, period, ai_daily_limit, tutor_sessions, badge, features)
      VALUES 
      (1, 'Kelas Reguler', 350000, 'monthly', 30, 2, 'Reguler', '["Akses Kelas Reguler", "30 Percakapan AI / hari", "Leaderboard Komunitas", "Umpan Balik AI Coach"]'),
      (2, 'Intermediate', 500000, 'monthly', 100, 4, 'Intermediate', '["Akses Kelas Intermediate", "100 Percakapan AI / hari", "4 Kelas Tatap Muka / bulan", "Analisis Pengucapan Detail"]'),
      (3, 'Advanced', 750000, 'monthly', -1, 8, 'Advanced', '["Akses Kelas Advanced", "AI Chat & Suara Tanpa Batas", "8 Kelas Tatap Muka / bulan", "Simulasi Ujian IELTS/TOEFL"]'),
      (4, 'Cash Promo (3 Bulan)', 750000, '3 months', -1, 12, 'Best Deal', '["Akses Penuh 3 Bulan", "AI Chat & Suara Tanpa Batas", "12 Kelas Tatap Muka / 3 bulan", "Sertifikat Kelulusan", "Badge Spesial Best Deal"]'),
      (5, 'Harga Normal (3 Bulan)', 1500000, '3 months', -1, 24, 'Premium Pro', '["Akses Penuh 3 Bulan", "AI Chat & Suara Tanpa Batas", "24 Kelas Tatap Muka / 3 bulan", "Bimbingan Intensif IELTS/TOEFL"]')
    `);

    // 👑 Cek & Semai User Awal (Hanya Hartini Asri Senior Admin, Fauzi, dan Cintiani)
    const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
    if (Number(usersCount[0].count) === 0) {
      console.log('Nyiapin data user awal...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const hashedAdminPassword = await bcrypt.hash('20424014', 10);
      // Admin Senior (Hartini Asri)
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Hartini Asri (Admin Senior)', 'hartini_senior', 'hartiniasri32@gmail.com', '6281572120190', '${hashedAdminPassword}', 'admin', 5, 0, 0, 0, '/ma.png')
      `);

      // Student 5: Fauzi
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Fauzi', 'fauzi', 'fauzi@mahirspeaking.com', '081234567894', '${hashedPassword}', 'student', 1, 0, 0, 0, '/ma.png')
      `);

      // Student 6: Cintiani Ajah
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Cintiani Ajah', 'cintiani', 'cintiani@mahirspeaking.com', '081234567895', '${hashedPassword}', 'student', 1, 0, 0, 0, '/mi.png')
      `);
    } else {
      // 🌟 Hapus data user lama (Aci, Fariha, Ira, Pipit, David Miller, Mahir Admin) dari local SQLite agar leaderboard bersih
      await query(`DELETE FROM users WHERE email IN ('aci@mahirspeaking.com', 'fariha@mahirspeaking.com', 'ira@mahirspeaking.com', 'pipit@mahirspeaking.com', 'tutor@mahirspeaking.com', 'admin@mahirspeaking.com')`);
    }

    // 📚 Cek Kursus & Materi Pembelajaran
    const coursesCount = await query(`SELECT COUNT(*) as count FROM courses`);
    if (Number(coursesCount[0].count) === 0) {
      console.log('Nyiapin materi kursus yang daging semua gais...');
      const tutor = await query(`SELECT id FROM users WHERE role = 'tutor' LIMIT 1`);
      const tutorId = tutor[0]?.id || null;

      await query(`
        INSERT INTO courses (title, level, description, tutor_id, thumbnail, total_lessons)
        VALUES 
        ('Daily Conversation Mastery', 'A1 - Beginner', 'Learn essential English phrases for everyday introductions, ordering food, asking for directions, and small talk.', ${tutorId === null ? 'NULL' : tutorId}, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', 4),
        ('Business English Speaking & Pitching', 'B1 - Intermediate', 'Master professional workplace communication, meeting contributions, job interview answers, and elevator pitches.', ${tutorId === null ? 'NULL' : tutorId}, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600', 3),
        ('IELTS Speaking 7.0+ Intensive', 'B2 - Upper Intermediate', 'Advanced strategies for IELTS Speaking Parts 1, 2, and 3 with real examiner criteria and fluency drills.', ${tutorId === null ? 'NULL' : tutorId}, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600', 3),
        ('Confident Public Speaking & Debating', 'C1 - Advanced', 'Hone persuasion skills, rhetorical devices, voice modulation, and spontaneous speech formulation.', ${tutorId === null ? 'NULL' : tutorId}, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600', 2)
      `);
    }

    // 📚 Cek & Semai Lessons 1 sampai 40 biar kuis & LMS nyambung
    if (!isPostgres) {
      try {
        await query(`ALTER TABLE lessons ADD COLUMN xp_reward INTEGER DEFAULT 50`);
      } catch (e) {
        // Kolom mungkin sudah ada, abaikan
      }
    }
    const lessonsCount = await query(`SELECT COUNT(*) as count FROM lessons`);
    if (Number(lessonsCount[0].count) === 0) {
      console.log('Nyiapin data lesson 1-40 biar lms & kuis nyambung... 🚀');
      const courses = await query(`SELECT id FROM courses ORDER BY id ASC`);
      const course1Id = courses[0]?.id || 1;
      const course2Id = courses[1]?.id || 2;
      const course3Id = courses[2]?.id || 3;
      const course4Id = courses[3]?.id || 4;

      for (let i = 1; i <= 40; i++) {
        let courseId = course1Id;
        if (i > 10 && i <= 20) courseId = course2Id;
        else if (i > 20 && i <= 30) courseId = course3Id;
        else if (i > 30) courseId = course4Id;

        const title = `Unit ${i} Speaking Practice`;

        if (isPostgres) {
          await query(`
            INSERT INTO lessons (id, course_id, title, order_index, reading_content, target_vocabulary, speaking_prompt, xp_reward, is_published)
            VALUES (?, ?, ?, ?, ?, '[]'::jsonb, ?, 80, true)
            ON CONFLICT (id) DO NOTHING
          `, [i, courseId, title, i, `Reading content for ${title}`, `Speaking prompt for ${title}`]);
        } else {
          await query(`
            INSERT OR IGNORE INTO lessons (id, course_id, title, order_index, reading_content, target_vocabulary, speaking_prompt, xp_reward)
            VALUES (?, ?, ?, ?, ?, '[]', ?, 80)
          `, [i, courseId, title, i, `Reading content for ${title}`, `Speaking prompt for ${title}`]);
        }
      }
    }

    // 🤖 Semai data latihan bot Mashira AI
    const exercisesCount = await query(`SELECT COUNT(*) as count FROM exercises`);
    if (Number(exercisesCount[0].count) === 0) {
      console.log('Nyiapin data latihan chatbot awal gais...');
      await query(`
        INSERT INTO exercises (level, title, instruction, referenceText, translation)
        VALUES 
        ('A1', 'Introduce Yourself', 'Dengarkan lalu ulangi kalimat berikut.', 'Hello, my name is Dhalfa and I am learning English.', 'Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris.'),
        ('A1', 'Daily Routine', 'Dengarkan lalu ulangi dengan jelas.', 'I usually study English in the evening.', 'Saya biasanya belajar bahasa Inggris pada malam hari.'),
        ('A2', 'Speaking Goal', 'Ucapkan kalimat berikut dengan percaya diri.', 'My goal is to speak English confidently.', 'Tujuan saya adalah berbicara bahasa Inggris dengan percaya diri.'),
        ('A2', 'Weekend Story', 'Jawab pertanyaan berikut dalam bahasa Inggris.', 'Tell me about your weekend.', 'Ceritakan tentang akhir pekanmu.')
      `);
    }

    console.log('Seed data database beres dengan sempurna, slay abis! ✨');
  } catch (err) {
    console.error('Ada error waktu seeding DB gais:', err.message);
  }
}
