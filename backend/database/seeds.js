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
      // Cek apakah tabel users sudah ada
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        )
      `);
      if (tableCheck[0].exists) {
        console.log('📊 [Database] Tabel PostgreSQL sudah ada. Melewati inisialisasi skema.');
        return;
      }

      console.log('🏗️ [Database] Menginisialisasi skema & Stored Procedures PostgreSQL...');
      const schemaPath = path.join(__dirname, 'schema_postgres.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      // Jalankan seluruh skema SQL
      await query(schemaSql);
      console.log('✅ [Database] Skema & Stored Procedures PostgreSQL berhasil diinisialisasi!');
      return;
    }

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
        xp INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 1,
        avatar TEXT DEFAULT '/ma.png',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    // 👑 Cek & Semai User Awal Termasuk Juara Leaderboard Aci, Fariha, Ira, Pipit
    const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
    if (usersCount[0].count === 0) {
      console.log('Nyiapin data user & juara leaderboard (Aci, Fariha, Ira, Pipit)...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Student 1: Aci (#1 Champion)
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Aci', 'aci_master', 'aci@mahirspeaking.com', '081234567890', '${hashedPassword}', 'student', 3, 0, 0, 0, '/ma.png')
      `);

      // Student 2: Fariha (#2 Silver)
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Fariha', 'fariha_speaking', 'fariha@mahirspeaking.com', '081234567891', '${hashedPassword}', 'student', 3, 0, 0, 0, '/mi.png')
      `);

      // Student 3: Ira (#3 Bronze)
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Ira', 'ira_fluent', 'ira@mahirspeaking.com', '081234567892', '${hashedPassword}', 'student', 2, 0, 0, 0, '/mo.png')
      `);

      // Student 4: Pipit (#4)
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Pipit', 'pipit_voice', 'pipit@mahirspeaking.com', '081234567893', '${hashedPassword}', 'student', 2, 0, 0, 0, '/ma.png')
      `);

      // Tutor User
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Coach David Miller', 'david_tutor', 'tutor@mahirspeaking.com', '081299988877', '${hashedPassword}', 'tutor', 3, 0, 0, 0, '/mi.png')
      `);

      // Admin User
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Mahir Admin', 'admin_mahir', 'admin@mahirspeaking.com', '081200001111', '${hashedPassword}', 'admin', 3, 0, 0, 0, '/mo.png')
      `);

      const hashedAdminPassword = await bcrypt.hash('20424014', 10);
      // Admin Senior (Hartini Asri)
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Hartini Asri (Admin Senior)', 'hartini_senior', 'hartiniasri32@gmail.com', '6285156916211', '${hashedAdminPassword}', 'admin', 5, 0, 0, 0, '/ma.png')
      `);
    } else {
      // 🌟 Tetep pastikan leaderboard di-sync cantik ke Aci, Fariha, Ira, Pipit
      await query(`UPDATE users SET full_name = 'Aci', username = 'aci_master', avatar = '/ma.png', xp = 0, points = 0, streak = 0 WHERE email = 'student@mahirspeaking.com' OR email = 'aci@mahirspeaking.com'`);
      await query(`UPDATE users SET full_name = 'Fariha', username = 'fariha_speaking', avatar = '/mi.png', xp = 0, points = 0, streak = 0 WHERE email = 'rian@mahirspeaking.com' OR email = 'fariha@mahirspeaking.com'`);
      await query(`UPDATE users SET full_name = 'Ira', username = 'ira_fluent', avatar = '/mo.png', xp = 0, points = 0, streak = 0 WHERE email = 'nadia@mahirspeaking.com' OR email = 'ira@mahirspeaking.com'`);
      await query(`UPDATE users SET full_name = 'Pipit', username = 'pipit_voice', avatar = '/ma.png', xp = 0, points = 0, streak = 0 WHERE email = 'budi@mahirspeaking.com' OR email = 'pipit@mahirspeaking.com'`);
    }

    // 📚 Cek Kursus & Materi Pembelajaran
    const coursesCount = await query(`SELECT COUNT(*) as count FROM courses`);
    if (coursesCount[0].count === 0) {
      console.log('Nyiapin materi kursus yang daging semua gais...');
      const tutor = await query(`SELECT id FROM users WHERE role = 'tutor' LIMIT 1`);
      const tutorId = tutor[0]?.id || 5;

      await query(`
        INSERT INTO courses (title, level, description, tutor_id, thumbnail, total_lessons)
        VALUES 
        ('Daily Conversation Mastery', 'A1 - Beginner', 'Learn essential English phrases for everyday introductions, ordering food, asking for directions, and small talk.', ${tutorId}, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', 4),
        ('Business English Speaking & Pitching', 'B1 - Intermediate', 'Master professional workplace communication, meeting contributions, job interview answers, and elevator pitches.', ${tutorId}, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600', 3),
        ('IELTS Speaking 7.0+ Intensive', 'B2 - Upper Intermediate', 'Advanced strategies for IELTS Speaking Parts 1, 2, and 3 with real examiner criteria and fluency drills.', ${tutorId}, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600', 3),
        ('Confident Public Speaking & Debating', 'C1 - Advanced', 'Hone persuasion skills, rhetorical devices, voice modulation, and spontaneous speech formulation.', ${tutorId}, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600', 2)
      `);
    }

    // 🤖 Semai data latihan bot Mashira AI
    const exercisesCount = await query(`SELECT COUNT(*) as count FROM exercises`);
    if (exercisesCount[0].count === 0) {
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
