import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runLiveUpdates(query, isPostgres) {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('20424014', 10);

    // 1. Mempersiapkan data paket langganan default pada database.
    console.log('Sinkronisasi paket langganan...');
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

    // 2. Mempersiapkan data akun pengguna awal jika belum ada.
    console.log('Sinkronisasi data user awal...');
    // Admin Senior (Hartini Asri)
    const adminExists = await query("SELECT id FROM users WHERE email = 'hartiniasri32@gmail.com'");
    if (adminExists.length === 0) {
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Hartini Asri (Admin Senior)', 'hartini_senior', 'hartiniasri32@gmail.com', '6281572120190', '${hashedAdminPassword}', 'admin', 5, 0, 0, 0, '/ma.png')
      `);
      console.log('✅ Default admin account seeded.');
    }

    // Student: Fauzi
    const fauziExists = await query("SELECT id FROM users WHERE email = 'fauzi@mahirspeaking.com'");
    if (fauziExists.length === 0) {
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Fauzi', 'fauzi', 'fauzi@mahirspeaking.com', '081234567894', '${hashedPassword}', 'student', 1, 0, 0, 0, '/ma.png')
      `);
      console.log('✅ Default student Fauzi account seeded.');
    }

    // Student: Cintiani Ajah
    const cintianiExists = await query("SELECT id FROM users WHERE email = 'cintiani@mahirspeaking.com'");
    if (cintianiExists.length === 0) {
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Cintiani Ajah', 'cintiani', 'cintiani@mahirspeaking.com', '081234567895', '${hashedPassword}', 'student', 1, 0, 0, 0, '/mi.png')
      `);
      console.log('✅ Default student Cintiani account seeded.');
    }

    // Tutor: Tutor Mahir Speaking
    const tutorExists = await query("SELECT id FROM users WHERE email = 'tutor@mahirspeaking.com'");
    if (tutorExists.length === 0) {
      await query(`
        INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
        VALUES ('Tutor Mahir Speaking', 'tutor_mahir', 'tutor@mahirspeaking.com', '6281234567890', '${hashedPassword}', 'tutor', 1, 0, 0, 0, '/ma.png')
      `);
      console.log('✅ Default tutor account seeded.');
    }

    // Hapus data user lama agar leaderboard bersih
    await query(`DELETE FROM users WHERE email NOT IN ('hartiniasri32@gmail.com', 'fauzi@mahirspeaking.com', 'cintiani@mahirspeaking.com', 'tutor@mahirspeaking.com')`);

    // 3. Mempersiapkan data video pembelajaran.
    console.log('Sinkronisasi data video...');
    await query(`DELETE FROM recorded_videos`);
    await query(`
      INSERT INTO recorded_videos (title, tutor, duration, level, video_url)
      VALUES 
      ('Sesi 1: Self Introduction & Confidence Drill', 'Mr.Alfada Naufal', '90 Menit', 'Basic Level', 'https://www.youtube.com/embed/henIVlCPVIY'),
      ('Sesi 2: Vocabulary Mastery', 'Ms. Deasy Puspawati', '90 Menit', 'Basic Level', 'https://www.youtube.com/embed/9bdrVG297J4'),
      ('Sesi 3: Public Speaking Masterclass', 'Ms. Ade Ihdinayah', '90 Menit', 'Intermediate Level', 'https://www.youtube.com/embed/WioL50vGE04'),
      ('Sesi 4: Native Speaker Meeting Session', 'Native Speaker (Mr. James)', '90 Menit', 'All Levels', 'https://www.youtube.com/embed/ag3RnEaB3zM')
    `);
    console.log('✅ Data video synced successfully.');
  } catch (err) {
    console.error('Error during live updates execution:', err.message);
  }
}

// Menyelaraskan indeks database agar performa pencarian, penyaringan, gabungan (joins), dan pengurutan (sorting) optimal di bawah beban tinggi.
export async function createIndexes(query) {
  try {
    console.log('⚡ [Database] Menyelaraskan indeks database...');
    await query(`CREATE INDEX IF NOT EXISTS idx_users_xp_points ON users(xp DESC, points DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON user_progress(user_id, lesson_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON payment_transactions(order_id)`);
    console.log('✅ [Database] Indeks database berhasil diselaraskan.');
  } catch (err) {
    console.error('⚠️ [Database] Gagal menyelaraskan indeks database:', err.message);
  }
}

// Fungsi inisialisasi data awal database (seeding) untuk menyiapkan tabel dan data pengguna awal.
export async function initSeedData() {
  try {
    const isPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

    if (isPostgres) {
      // Cek apakah database sudah terinisialisasi untuk menghindari concurrent migration/lock di Vercel
      let isInitialized = false;
      try {
        await query(`SELECT id FROM public.users LIMIT 1`);
        isInitialized = true;
      } catch (err) {
        isInitialized = false;
      }

      if (isInitialized) {
        console.log('🟢 [Database] PostgreSQL sudah terinisialisasi. Menyelaraskan indeks...');
        await createIndexes(query);
        return;
      }

      console.log('🏗️ [Database] Database kosong. Menginisialisasi skema & Stored Procedures PostgreSQL...');
      const schemaPath = path.join(__dirname, 'mahir_speaking_supabase.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await query(schemaSql);
      console.log('✅ [Database] Skema PostgreSQL berhasil diinisialisasi!');

      // Cek dan buat tabel blog_likes di PostgreSQL jika belum ada/belum valid
      try {
        await query(`SELECT id FROM public.blog_likes LIMIT 1`);
      } catch (err) {
        console.log('⚠️ [Database] Tabel blog_likes PostgreSQL belum siap, membuat ulang skema...');
        try {
          await query(`DROP TABLE IF EXISTS public.blog_likes CASCADE`);
          await query(`
            CREATE TABLE public.blog_likes (
              id SERIAL PRIMARY KEY,
              post_id integer UNIQUE,
              likes_count integer DEFAULT 0
            )
          `);
          console.log('✅ [Database] Tabel public.blog_likes berhasil dibuat!');
        } catch (createErr) {
          console.error('❌ [Database] Gagal membuat tabel blog_likes:', createErr.message);
        }
      }

      // Cek dan buat tabel alumni_stories di PostgreSQL jika belum ada
      try {
        await query(`SELECT id FROM public.alumni_stories LIMIT 1`);
      } catch (err) {
        console.log('⚠️ [Database] Tabel alumni_stories PostgreSQL belum siap, membuat ulang skema...');
        try {
          await query(`DROP TABLE IF EXISTS public.alumni_stories CASCADE`);
          await query(`
            CREATE TABLE public.alumni_stories (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              text TEXT NOT NULL,
              rating INTEGER DEFAULT 5,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
          console.log('✅ [Database] Tabel public.alumni_stories berhasil dibuat!');
          // Seed default stories
          await query(`INSERT INTO public.alumni_stories (name, text, rating) VALUES 
            ('Rina Kusuma', 'Dulu mau ngomong ''hello'' aja mikir grammar 5 menit. Setelah ikut program intensif, sekarang pede banget ngomong sama klien luar negeri!', 5),
            ('Andi Wijaya', 'Sesi private dengan mentor bener-bener ngebantu karena dapet feedback pelafalan yang detail banget.', 5)
          `);
        } catch (createErr) {
          console.error('❌ [Database] Gagal membuat tabel alumni_stories:', createErr.message);
        }
      }

      // Cek dan buat tabel blog_posts di PostgreSQL jika belum ada
      try {
        await query(`SELECT id FROM public.blog_posts LIMIT 1`);
      } catch (err) {
        console.log('⚠️ [Database] Tabel blog_posts PostgreSQL belum siap, membuat skema...');
        try {
          await query(`DROP TABLE IF EXISTS public.blog_posts CASCADE`);
          await query(`
            CREATE TABLE public.blog_posts (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              excerpt TEXT NOT NULL,
              category VARCHAR(100) NOT NULL,
              author VARCHAR(255) NOT NULL,
              author_image TEXT,
              date VARCHAR(100) NOT NULL,
              read_time VARCHAR(100),
              image TEXT NOT NULL,
              featured BOOLEAN DEFAULT false,
              likes INTEGER DEFAULT 0,
              comments_count INTEGER DEFAULT 0,
              content TEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `);
          console.log('✅ [Database] Tabel public.blog_posts berhasil dibuat!');
        } catch (createErr) {
          console.error('❌ [Database] Gagal membuat tabel blog_posts PostgreSQL:', createErr.message);
        }
      }
      
      // Run payment_transactions.sql if exists
      const payPath = path.join(__dirname, 'payment_transactions.sql');
      if (fs.existsSync(payPath)) {
        const paySql = fs.readFileSync(payPath, 'utf8');
        await query(paySql);
      }

      // Alter columns to ensure column types are compatible (varchar instead of timestamptz for jadwal_trial)
      try {
        await query(`ALTER TABLE public.placement_test_leads ALTER COLUMN jadwal_trial TYPE varchar(100)`);
      } catch (err) {
        console.log('Note: Column alter check skipped or already updated:', err.message);
      }

      // Pastikan kolom created_at & updated_at ada di recorded_videos & modules untuk PostgreSQL
      try { await query(`ALTER TABLE public.recorded_videos ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      try { await query(`ALTER TABLE public.recorded_videos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      try { await query(`ALTER TABLE public.modules ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      try { await query(`ALTER TABLE public.modules ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}

      console.log('✅ [Database] Skema & Stored Procedures PostgreSQL berhasil diinisialisasi!');

      // 🌟 Hapus data user lama dari cloud Neon Postgres agar leaderboard bersih
      await query(`DELETE FROM users WHERE email NOT IN ('hartiniasri32@gmail.com', 'fauzi@mahirspeaking.com', 'cintiani@mahirspeaking.com', 'tutor@mahirspeaking.com')`);
      
      // Inisialisasi indeks untuk PostgreSQL
      await createIndexes(query);
    } else {
      // Cek apakah database SQLite sudah terinisialisasi
      let isInitialized = false;
      try {
        const usersCount = await query(`SELECT COUNT(*) as count FROM users`);
        if (Number(usersCount[0]?.count || 0) > 0) {
          isInitialized = true;
        }
      } catch (err) {
        isInitialized = false;
      }

      if (isInitialized) {
        console.log('🟢 [Database] SQLite sudah terinisialisasi. Menyelaraskan indeks...');
        await createIndexes(query);
        return;
      }

      // Membuat tabel users jika belum terdaftar pada database.
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

      // Pastikan kolom created_at & updated_at ada di recorded_videos & modules untuk SQLite
      try { await query(`ALTER TABLE recorded_videos ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      try { await query(`ALTER TABLE recorded_videos ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      try { await query(`ALTER TABLE modules ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}
      try { await query(`ALTER TABLE modules ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`); } catch (e) {}

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
          xp_earned INTEGER DEFAULT 0,
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

      // Tabel Latihan Bot Mashira AI
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

      // Tabel Placement Test Leads
      await query(`
        CREATE TABLE IF NOT EXISTS placement_test_leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nama TEXT NOT NULL,
          no_wa TEXT NOT NULL,
          email TEXT,
          level_target TEXT,
          recommended_level TEXT,
          jadwal_trial TEXT,
          catatan TEXT,
          status TEXT DEFAULT 'Belum Dihubungi',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabel Payment Transactions
      await query(`
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT UNIQUE NOT NULL,
          user_id INTEGER NOT NULL,
          package_code TEXT NOT NULL,
          package_name TEXT NOT NULL,
          gross_amount INTEGER NOT NULL,
          payment_status TEXT DEFAULT 'pending',
          payment_type TEXT,
          transaction_id TEXT,
          snap_token TEXT,
          midtrans_payload TEXT,
          paid_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabel Modules
      await query(`
        CREATE TABLE IF NOT EXISTS modules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'PDF Document',
          file_size TEXT,
          badge TEXT DEFAULT 'Official Modul',
          description TEXT,
          file_url TEXT NOT NULL,
          storage_path TEXT,
          is_published INTEGER DEFAULT 1,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabel Recorded Videos
      await query(`
        CREATE TABLE IF NOT EXISTS recorded_videos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          tutor TEXT,
          duration TEXT,
          level TEXT DEFAULT 'All Levels',
          video_url TEXT NOT NULL,
          thumbnail TEXT,
          is_published INTEGER DEFAULT 1,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Cek dan buat tabel blog_likes di SQLite
      try {
        await query(`SELECT id FROM blog_likes LIMIT 1`);
      } catch (err) {
        console.log('⚠️ [Database] Tabel blog_likes SQLite belum siap, membuat ulang skema...');
        try {
          await query(`DROP TABLE IF EXISTS blog_likes`);
          await query(`
            CREATE TABLE blog_likes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              post_id INTEGER UNIQUE,
              likes_count INTEGER DEFAULT 0
            )
          `);
          console.log('✅ [Database] Tabel blog_likes SQLite berhasil dibuat!');
        } catch (createErr) {
          console.error('❌ [Database] Gagal membuat tabel blog_likes SQLite:', createErr.message);
        }
      }

      // Cek dan buat tabel alumni_stories di SQLite
      try {
        await query(`SELECT id FROM alumni_stories LIMIT 1`);
      } catch (err) {
        console.log('⚠️ [Database] Tabel alumni_stories SQLite belum siap, membuat ulang skema...');
        try {
          await query(`DROP TABLE IF EXISTS alumni_stories`);
          await query(`
            CREATE TABLE alumni_stories (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              text TEXT NOT NULL,
              rating INTEGER DEFAULT 5,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          console.log('✅ [Database] Tabel alumni_stories SQLite berhasil dibuat!');
          // Seed default stories
          await query(`INSERT INTO alumni_stories (name, text, rating) VALUES 
            ('Rina Kusuma', 'Dulu mau ngomong ''hello'' aja mikir grammar 5 menit. Setelah ikut program intensif, sekarang pede banget ngomong sama klien luar negeri!', 5),
            ('Andi Wijaya', 'Sesi private dengan mentor bener-bener ngebantu karena dapet feedback pelafalan yang detail banget.', 5)
          `);
        } catch (createErr) {
          console.error('❌ [Database] Gagal membuat tabel alumni_stories SQLite:', createErr.message);
        }
      }

      // Cek dan buat tabel blog_posts di SQLite jika belum ada
      try {
        await query(`SELECT id FROM blog_posts LIMIT 1`);
      } catch (err) {
        console.log('⚠️ [Database] Tabel blog_posts SQLite belum siap, membuat skema...');
        try {
          await query(`DROP TABLE IF EXISTS blog_posts`);
          await query(`
            CREATE TABLE blog_posts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              excerpt TEXT NOT NULL,
              category TEXT NOT NULL,
              author TEXT NOT NULL,
              author_image TEXT,
              date TEXT NOT NULL,
              read_time TEXT,
              image TEXT NOT NULL,
              featured INTEGER DEFAULT 0,
              likes INTEGER DEFAULT 0,
              comments_count INTEGER DEFAULT 0,
              content TEXT NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `);
          console.log('✅ [Database] Tabel blog_posts SQLite berhasil dibuat!');
        } catch (createErr) {
          console.error('❌ [Database] Gagal membuat tabel blog_posts SQLite:', createErr.message);
        }
      }
    }

    // Jalankan sinkronisasi data live awal (paket, user, video)
    await runLiveUpdates(query, isPostgres);

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
            VALUES (?, ?, ?, ?, ?, '[]'::jsonb, ?, 25, true)
            ON CONFLICT (id) DO NOTHING
          `, [i, courseId, title, i, `Reading content for ${title}`, `Speaking prompt for ${title}`]);
        } else {
          await query(`
            INSERT OR IGNORE INTO lessons (id, course_id, title, order_index, reading_content, target_vocabulary, speaking_prompt, xp_reward)
            VALUES (?, ?, ?, ?, ?, '[]', ?, 25)
          `, [i, courseId, title, i, `Reading content for ${title}`, `Speaking prompt for ${title}`]);
        }
      }
    }

    // Force update existing records to make sure all lessons have xp_reward = 25
    try {
      await query(`UPDATE lessons SET xp_reward = 25`);
      console.log('✅ Berhasil menyelaraskan semua xp_reward lesson ke 25.');
    } catch (e) {
      console.error('⚠️ Gagal menyelaraskan xp_reward lesson:', e.message);
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

    // 📚 Cek & Semai data modul awal
    const modulesCount = await query(`SELECT COUNT(*) as count FROM modules`);
    if (Number(modulesCount[0].count) === 0) {
      console.log('Nyiapin data modul awal...');
      if (isPostgres) {
        await query(`
          INSERT INTO modules (title, type, file_size, badge, description, file_url)
          VALUES 
          ('E-Book Speaking - Basic Level (A1/A2)', 'PDF E-Book', '12.4 MB', 'Basic Level', 'Modul pembelajaran level Basic untuk melatih kelancaran perkenalan diri dan aktivitas harian.', 'https://drive.google.com/file/d/1bNcTgCgcyMju80MEamH9EhNx115vI2YM/view?usp=drive_link'),
          ('E-Book Speaking - Intermediate Level (B1)', 'PDF E-Book', '15.1 MB', 'Intermediate Level', 'Modul pembelajaran level Intermediate untuk menguasai percakapan profesional dan opini terstruktur.', 'https://drive.google.com/file/d/1atDc0w5W1TJ8AvHu7S_WaxP87lIs3-qA/view?usp=drive_link'),
          ('E-Book Speaking - Advance Level (B2/C1)', 'PDF E-Book', '18.7 MB', 'Advance Level', 'Modul pembelajaran level Advance untuk persiapan wawancara kerja, negosiasi, dan presentasi bisnis.', 'https://drive.google.com/file/d/157eH9drAwb6N2teVOJWxKCPiTRuf7it4/view?usp=sharing')
        `);
      } else {
        await query(`
          INSERT INTO modules (title, type, file_size, badge, description, file_url)
          VALUES 
          ('E-Book Speaking - Basic Level (A1/A2)', 'PDF E-Book', '12.4 MB', 'Basic Level', 'Modul pembelajaran level Basic untuk melatih kelancaran perkenalan diri dan aktivitas harian.', 'https://drive.google.com/file/d/1bNcTgCgcyMju80MEamH9EhNx115vI2YM/view?usp=drive_link'),
          ('E-Book Speaking - Intermediate Level (B1)', 'PDF E-Book', '15.1 MB', 'Intermediate Level', 'Modul pembelajaran level Intermediate untuk menguasai percakapan profesional dan opini terstruktur.', 'https://drive.google.com/file/d/1atDc0w5W1TJ8AvHu7S_WaxP87lIs3-qA/view?usp=drive_link'),
          ('E-Book Speaking - Advance Level (B2/C1)', 'PDF E-Book', '18.7 MB', 'Advance Level', 'Modul pembelajaran level Advance untuk persiapan wawancara kerja, negosiasi, dan presentasi bisnis.', 'https://drive.google.com/file/d/157eH9drAwb6N2teVOJWxKCPiTRuf7it4/view?usp=sharing')
        `);
      }
    }

    // 📝 Semai data blog_posts awal jika kosong
    // Hapus data lama jika terdeteksi data lama/terpotong (panjang konten default kurang dari 800 karakter)
    const checkTruncated = await query(`SELECT id FROM ${isPostgres ? 'public.' : ''}blog_posts WHERE author IN ('Mr. Alfada Naufal', 'Ms. Deasy Puspawati', 'Mr. Garry Wilson', 'Tim Akademik') AND LENGTH(content) < 800 LIMIT 1`);
    if (checkTruncated.length > 0) {
      console.log('🔄 Mendeteksi artikel default terpotong. Mengatur ulang tabel blog_posts...');
      await query(`DELETE FROM ${isPostgres ? 'public.' : ''}blog_posts`);
    }

    const postsCount = await query(`SELECT COUNT(*) as count FROM ${isPostgres ? 'public.' : ''}blog_posts`);
    if (Number(postsCount[0].count) === 0) {
      console.log('Nyiapin data blog posts awal...');
      const defaultPosts = [
        {
          title: "5 Tips Ampuh Mengatasi Rasa Takut & Canggung Saat Bicara Bahasa Inggris",
          excerpt: "Seringkali kendala utama belajar speaking bukan grammar, melainkan mental block. Simak cara melatih mental dan mengatasinya di sini.",
          category: "Tips & Trik",
          author: "Mr. Alfada Naufal",
          author_image: "/alfa.png",
          date: "18 Agustus 2026",
          read_time: "5 Menit Baca",
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800",
          featured: 1,
          content: `<p class="lead text-lg font-semibold text-slate-700 mb-4">
        Apakah kamu sering merasa deg-degan, keringat dingin, atau mendadak 'blank' saat harus berbicara Bahasa Inggris di depan umum? Tenang, kamu tidak sendirian. Lebih dari 70% pembelajar bahasa asing mengalami apa yang disebut dengan <em>foreign language anxiety</em>.
      </p>
      
      <p class="mb-4">
        Masalah utama biasanya bukan karena kamu tidak tahu kosakata (vocabulary) atau rumus tata bahasa (grammar), tetapi karena adanya mental block berupa rasa takut dinilai salah, ditertawakan, atau kurang sempurna. Di artikel ini, kita akan membahas 5 tips praktis untuk meruntuhkan tembok ketakutan tersebut.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">1. Sadari Bahwa Komunikasi Lebih Penting daripada Kesempurnaan</h3>
      <p class="mb-4">
        Tujuan utama bahasa adalah untuk menyampaikan pesan (message delivery). Selama lawan bicara memahami maksudmu, komunikasi telah sukses dilakukan. Para penutur asli (native speakers) pun sangat memaklumi jika ada kesalahan tata bahasa kecil saat kamu berbicara. Mereka akan lebih menghargai usahamu dalam mengekspresikan diri.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">2. Mulai dari Berbicara dengan Diri Sendiri (Self-Talk)</h3>
      <p class="mb-4">
        Sebelum langsung terjun mengobrol dengan orang lain, biasakan mendeskripsikan aktivitas harianmu dalam Bahasa Inggris di dalam hati atau dengan suara pelan. Misalnya: "Now, I am making a cup of coffee. The weather is beautiful today." Teknik ini membantu membangun jembatan antara pikiran verbal dan otot motorik bicaramu.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">3. Lakukan Sesi Shadowing secara Konsisten</h3>
      <p class="mb-4">
        Shadowing adalah metode meniru ucapan pembicara asli (native speaker) sesegera mungkin saat mendengarnya. Ini melatih intonasi, ritme, dan pelafalan (pronunciation) secara tidak langsung tanpa membebani pikiranmu untuk menyusun kalimat baru. Cukup dengar, tiru, dan rasakan ritmenya.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">4. Temukan Partner yang Tepat dan Suportif</h3>
      <p class="mb-4">
        Belajar mandiri terkadang membosankan. Memiliki partner berlatih yang memiliki visi yang sama—atau didampingi oleh mentor profesional—akan mempercepat rasa percaya dirimu. Lingkungan yang bebas dari penghakiman (judgment-free zone) adalah kunci utama melatih kelancaran lidah.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">5. Jangan Takut untuk Bertanya atau Meminta Umpan Balik</h3>
      <p class="mb-4">
        Setiap kesalahan adalah langkah maju. Catat kata-kata yang sulit kamu ucapkan hari ini, lalu cari tahu pelafalan yang benar. Dengan melakukan evaluasi berkala, rasa canggung perlahan akan tergantikan oleh rasa percaya diri yang nyata.
      </p>`
        },
        {
          title: "Mengenal Metode Shadowing: Cara Praktis Native Speaker Melatih Kelancaran",
          excerpt: "Bagaimana cara melatih otot lidah agar pelafalan terdengar natural? Shadowing adalah kunci utama yang banyak digunakan oleh poliglot dunia.",
          category: "Speaking Drill",
          author: "Ms. Deasy Puspawati",
          author_image: "/deasy.png",
          date: "15 Agustus 2026",
          read_time: "4 Menit Baca",
          image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800",
          featured: 0,
          content: `<p class="lead text-lg font-semibold text-slate-700 mb-4">
        Pernahkah kamu merasa lidahmu kaku saat melafalkan kata-kata Bahasa Inggris? Itu karena otot bicara kita belum terbiasa dengan artikulasi aksen asing. Salah satu metode terbaik untuk melatihnya adalah Shadowing.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Apa itu Metode Shadowing?</h3>
      <p class="mb-4">
        Shadowing dikembangkan oleh Profesor Alexander Arguelles. Cara kerjanya sangat sederhana: kamu memutar klip audio (pidato, podcast, film) berbahasa Inggris, lalu menirukan suara tersebut secara real-time dengan jeda sekian milidetik, layaknya bayangan yang selalu mengikuti objeknya.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Langkah Melakukan Shadowing untuk Pemula:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Pilih audio yang sesuai:</strong> Mulailah dengan tempo lambat dan durasi pendek (1-3 menit). Podcast edukasi atau dongeng anak sangat direkomendasikan.</li>
        <li><strong>Dengar tanpa teks pertama kali:</strong> Biasakan telinga menangkap bunyi, intonasi naik turun, serta penekanan suku kata.</li>
        <li><strong>Ulangi bersama teks:</strong> Bacakan teks mengikuti audio secara simultan. Ini melatih koneksi visual antara ejaan kata dan bunyinya.</li>
        <li><strong>Ulangi tanpa teks:</strong> Langkah terakhir ini adalah yang terpenting untuk melatih refleks motorik.</li>
      </ul>

      <p class="mb-4">
        Lakukan latihan ini selama 10-15 menit setiap hari. Konsistensi harian jauh lebih efektif daripada belajar 2 jam penuh hanya sekali dalam seminggu. Selamat mencoba!
      </p>`
        },
        {
          title: "10 Frasa Slang Bahasa Inggris Populer yang Bikin Kamu Terdengar Lebih Natural",
          excerpt: "Ingin terdengar lebih santai dan tidak kaku layaknya textbook? Pelajari kumpulan idiom dan slang modern yang sering dipakai sehari-hari.",
          category: "Vocabulary",
          author: "Mr. Garry Wilson",
          author_image: "/garry.png",
          date: "12 Agustus 2026",
          read_time: "6 Menit Baca",
          image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800",
          featured: 0,
          content: `<p class="lead text-lg font-semibold text-slate-700 mb-4">
        Pernahkah kamu mengobrol dengan penutur asli dan bingung ketika mereka menggunakan kata-kata yang tidak ada di kamus sekolah? Itulah yang disebut dengan <em>slang</em> atau bahasa gaul.
      </p>

      <p class="mb-4">
        Menggunakan bahasa slang dalam situasi kasual akan membuat komunikasimu terdengar lebih hidup, luwes, dan akrab. Berikut adalah 10 slang populer tahun 2026 yang wajib kamu ketahui:
      </p>

      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 mb-6">
        <p><strong>1. Spill the tea:</strong> Mengungkapkan gosip atau rahasia menarik. <em>(Example: "Come on, spill the tea!")</em></p>
        <p><strong>2. Slay:</strong> Melakukan sesuatu dengan sangat luar biasa sukses atau mengagumkan.</p>
        <p><strong>3. Vibe check:</strong> Memeriksa atau menilai energi/suasana sekitar atau seseorang.</p>
        <p><strong>4. For real:</strong> Menyatakan kesungguhan atau menyetujui sesuatu secara kuat.</p>
        <p><strong>5. Rent-free:</strong> Sesuatu yang terus memenuhi pikiranmu dan tidak bisa dilupakan.</p>
      </div>

      <p class="mb-4">
        Ingat, kunci dari penggunaan slang adalah menempatkannya pada konteks situasi yang tepat. Gunakan saat mengobrol dengan teman sebaya atau di komunitas santai, hindari menggunakannya pada sesi formal seperti wawancara kerja atau presentasi bisnis.
      </p>`
        },
        {
          title: "Pentingnya Mengetahui Gaya Belajar Unik (ST30) Sebelum Belajar Speaking",
          excerpt: "Setiap orang punya karakter kognitif yang berbeda. Mengapa cara belajar speaking konvensional seringkali gagal? Temukan jawabannya di sini.",
          category: "Metode Belajar",
          author: "Tim Akademik",
          author_image: "/MP.png",
          date: "10 Agustus 2026",
          read_time: "5 Menit Baca",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
          featured: 0,
          content: `<p class="lead text-lg font-semibold text-slate-700 mb-4">
        Mengapa ada siswa yang sangat cepat lancar bicara dengan sering mendengarkan lagu, sementara yang lain baru bisa lancar setelah banyak menulis dan melakukan simulasi roleplay? Jawabannya terletak pada gaya belajar unik masing-masing individu.
      </p>

      <p class="mb-4">
        Di Mahir Speaking, kami mengintegrasikan pendekatan 8 Cluster bakat alami (ST30) untuk mendeteksi cara kerja otakmu saat menyerap bahasa. Dengan mengetahui tipe karaktermu, kamu bisa menghemat waktu belajarmu secara drastif.
      </p>

      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Mengapa Metode Klasik Satu Ukuran (One-Size-Fits-All) Kurang Efektif?</h3>
      <p class="mb-4">
        Banyak bimbingan belajar memaksakan kurikulum hafalan yang kaku kepada semua tipe siswa. Padahal:
      </p>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Tipe Auditori:</strong> Lebih cepat menyerap melalui percakapan langsung, tanya-jawab spontan, dan diskusi kelompok.</li>
        <li><strong>Tipe Visual:</strong> Butuh visualisasi grafis, mindmapping kata, atau slide pendukung agar frasa melekat di memori.</li>
        <li><strong>Tipe Kinestetik:</strong> Perlu melakukan aksi fisik seperti bermain peran (roleplay), games interaktif, dan simulasi skenario nyata.</li>
      </ul>

      <p class="mb-4">
        Dengan menganalisis gaya belajarmu sejak awal lewat tes diagnostik, mentor kami bisa meramu teknik koreksi dan latihan speaking yang secara khusus memicu kenyamanan komunikasimu.
      </p>`
        }
      ];

      for (const post of defaultPosts) {
        await query(
          `INSERT INTO ${isPostgres ? 'public.' : ''}blog_posts 
           (title, excerpt, category, author, author_image, date, read_time, image, featured, content) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [post.title, post.excerpt, post.category, post.author, post.author_image, post.date, post.read_time, post.image, post.featured, post.content]
        );
      }
      console.log('✅ Default blog posts seeded successfully!');
    }

    // Pastikan indeks database dibuat setelah semua data awal selesai disemai
    await createIndexes(query);

    console.log('Seed data database beres dengan sempurna, slay abis! ✨');
  } catch (err) {
    console.error('Ada error waktu seeding DB gais:', err.message);
  }
}
