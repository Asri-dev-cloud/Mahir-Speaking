-- ============================================================
-- Skema Database Mahir Speaking (PostgreSQL)
-- Dirancang supaya Aman Sentosa
-- ============================================================

-- 1. Bikin Tabel-Tabel dulu
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  whatsapp VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student',
  package_id INT DEFAULT 1,
  xp INT DEFAULT 0,
  points INT DEFAULT 0,
  streak INT DEFAULT 1,
  avatar VARCHAR(255) DEFAULT '/ma.png',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly',
  ai_daily_limit INT NOT NULL, -- -1 artinya unlimited gais
  tutor_sessions INT NOT NULL,
  badge VARCHAR(50),
  features TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  level VARCHAR(50) NOT NULL, -- A1, A2, B1, B2, C1
  description TEXT,
  tutor_id INT,
  thumbnail VARCHAR(255),
  total_lessons INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  order_index INT NOT NULL,
  video_url VARCHAR(255),
  reading_content TEXT,
  target_vocabulary TEXT,
  speaking_prompt TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON string berisi pilihan jawaban
  correct_answer INT NOT NULL,
  xp_reward INT DEFAULT 20,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed INT DEFAULT 0,
  score INT DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  amount INT NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'QRIS',
  status VARCHAR(20) DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_chats (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'user' atau 'assistant'
  mode VARCHAR(50) DEFAULT 'general', -- 'grammar', 'speaking', 'vocab', 'translator'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  level VARCHAR(20) NOT NULL,
  title VARCHAR(150) NOT NULL,
  instruction TEXT NOT NULL,
  referenceText TEXT NOT NULL,
  translation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bikin Indeks Biar Pencarian Data Makin Sat-Set 
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user ON ai_chats(user_id);

-- ============================================================
--  KUMPULAN STORED FUNCTIONS (PL/pgSQL) BIAR LOGIKA DATA AMAN BINTANG LIMA 
-- ============================================================

-- Fungsi 1: Pendaftaran User Baru dengan Validasi Ganda (Biar Ga Ada Akun Kembar)
CREATE OR REPLACE FUNCTION register_user_secure(
    p_full_name VARCHAR,
    p_username VARCHAR,
    p_email VARCHAR,
    p_whatsapp VARCHAR,
    p_password VARCHAR,
    p_role VARCHAR,
    p_avatar VARCHAR
)
RETURNS TABLE (
    user_id INT,
    status_code VARCHAR,
    message VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_id INT;
BEGIN
    -- Cek dulu apakah emailnya udah pernah didaftarin atau belum ya bestie~
    IF EXISTS (SELECT 1 FROM users WHERE email = LOWER(p_email)) THEN
        RETURN QUERY SELECT 0, 'EMAIL_EXISTS'::VARCHAR, 'Email is already registered.'::VARCHAR;
        RETURN;
    END IF;

    -- Cek juga apakah usernamenya udah ada yang punya, biar ga tertukar~
    IF EXISTS (SELECT 1 FROM users WHERE username = LOWER(p_username)) THEN
        RETURN QUERY SELECT 0, 'USERNAME_EXISTS'::VARCHAR, 'Username is already registered.'::VARCHAR;
        RETURN;
    END IF;

    -- Masukkan data user baru dengan paket default (Basic) beserta bonus XP & Point biar happy!
    INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
    VALUES (
        p_full_name, 
        LOWER(p_username), 
        LOWER(p_email), 
        p_whatsapp, 
        p_password, 
        COALESCE(p_role, 'student'), 
        1, 100, 50, 1, 
        COALESCE(p_avatar, '/ma.png')
    )
    RETURNING id INTO new_id;

    RETURN QUERY SELECT new_id, 'SUCCESS'::VARCHAR, 'User registered successfully.'::VARCHAR;
END;
$$;


-- Fungsi 2: Transaksi Pembelian Paket Langganan (Biar Uang Keluar & Paket Aktif Terjadi Bersamaan, No Drama!)
CREATE OR REPLACE FUNCTION secure_purchase_package(
    p_user_id INT,
    p_package_id INT,
    p_amount INT,
    p_payment_method VARCHAR
)
RETURNS TABLE (
    purchase_id INT,
    status_code VARCHAR,
    message VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_purchase_id INT;
BEGIN
    -- Pastikan usernya emang beneran ada di database kita ya~
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RETURN QUERY SELECT 0, 'USER_NOT_FOUND'::VARCHAR, 'User not found.'::VARCHAR;
        RETURN;
    END IF;

    -- Pastikan paket yang mau dibeli emang terdaftar, jangan sampai fiktif~
    IF NOT EXISTS (SELECT 1 FROM packages WHERE id = p_package_id) THEN
        RETURN QUERY SELECT 0, 'PACKAGE_NOT_FOUND'::VARCHAR, 'Package not found.'::VARCHAR;
        RETURN;
    END IF;

    -- Catat riwayat pembelian dengan status sukses (simulasi QRIS sat-set)
    INSERT INTO purchases (user_id, package_id, amount, payment_method, status)
    VALUES (p_user_id, p_package_id, p_amount, COALESCE(p_payment_method, 'QRIS'), 'success')
    RETURNING id INTO new_purchase_id;

    -- Langsung upgrade paket aktif user biar langsung bisa menikmati fitur pro!
    UPDATE users 
    SET package_id = p_package_id 
    WHERE id = p_user_id;

    RETURN QUERY SELECT new_purchase_id, 'SUCCESS'::VARCHAR, 'Purchase completed successfully.'::VARCHAR;
END;
$$;


-- Fungsi 3: Selesaikan Materi & Kuis (Update progress secara otomatis & tambah XP + streak biar makin rajin)
CREATE OR REPLACE FUNCTION complete_lesson_secure(
    p_user_id INT,
    p_lesson_id INT,
    p_score INT,
    p_xp_reward INT
)
RETURNS TABLE (
    progress_id INT,
    new_xp INT,
    new_points INT,
    status_code VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_progress_id INT;
    updated_xp INT;
    updated_points INT;
    v_completed INT;
    v_old_score INT;
BEGIN
    -- Intip dulu apakah materi ini udah pernah dikerjakan sebelumnya atau belum~
    SELECT completed, score INTO v_completed, v_old_score
    FROM user_progress 
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

    -- Kalau udah pernah selesai, kita cuma update nilai tertinggi aja gais (no double XP biar ga dieksploitasi bot!)
    IF v_completed = 1 THEN
        UPDATE user_progress 
        SET score = GREATEST(v_old_score, p_score) 
        WHERE user_id = p_user_id AND lesson_id = p_lesson_id
        RETURNING id INTO new_progress_id;

        SELECT xp, points INTO updated_xp, updated_points FROM users WHERE id = p_user_id;
        RETURN QUERY SELECT new_progress_id, updated_xp, updated_points, 'ALREADY_COMPLETED'::VARCHAR;
        RETURN;
    END IF;

    -- Kalau baru pertama kali dikerjakan, mari kita catat progress barunya~
    IF v_completed IS NULL THEN
        INSERT INTO user_progress (user_id, lesson_id, completed, score)
        VALUES (p_user_id, p_lesson_id, 1, p_score)
        RETURNING id INTO new_progress_id;
    ELSE
        -- Kalau sebelumnya baru dibuka tapi belum selesai, sekarang kita set selesai!
        UPDATE user_progress 
        SET completed = 1, score = p_score, completed_at = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id AND lesson_id = p_lesson_id
        RETURNING id INTO new_progress_id;
    END IF;

    -- Kasih hadiah XP, Point, dan tambah streak biar hari-harinya makin produktif belajar English!
    UPDATE users 
    SET xp = xp + p_xp_reward,
        points = points + (p_xp_reward / 2),
        streak = streak + 1
    WHERE id = p_user_id
    RETURNING xp, points INTO updated_xp, updated_points;

    RETURN QUERY SELECT new_progress_id, updated_xp, updated_points, 'SUCCESS'::VARCHAR;
END;
$$;

-- ============================================================
-- PENYEMAIAN DATA AWAL (BIAR DATABASE GAK KOSONG)
-- ============================================================

-- Paket-paket langganan yang bikin user terpikat buat belajar
DELETE FROM packages;
INSERT INTO packages (id, name, price, period, ai_daily_limit, tutor_sessions, badge, features)
VALUES 
(1, 'Kelas Reguler', 350000, 'monthly', 30, 2, 'Reguler', '["Akses Kelas Reguler", "30 Percakapan AI / hari", "Leaderboard Komunitas", "Umpan Balik AI Coach"]'),
(2, 'Intermediate', 500000, 'monthly', 100, 4, 'Intermediate', '["Akses Kelas Intermediate", "100 Percakapan AI / hari", "4 Kelas Tatap Muka / bulan", "Analisis Pengucapan Detail"]'),
(3, 'Advanced', 750000, 'monthly', -1, 8, 'Advanced', '["Akses Kelas Advanced", "AI Chat & Suara Tanpa Batas", "8 Kelas Tatap Muka / bulan", "Simulasi Ujian IELTS/TOEFL"]'),
(4, 'Cash Promo (3 Bulan)', 750000, '3 months', -1, 12, 'Best Deal', '["Akses Penuh 3 Bulan", "AI Chat & Suara Tanpa Batas", "12 Kelas Tatap Muka / 3 bulan", "Sertifikat Kelulusan", "Badge Spesial Best Deal"]'),
(5, 'Harga Normal (3 Bulan)', 1500000, '3 months', -1, 24, 'Premium Pro', '["Akses Penuh 3 Bulan", "AI Chat & Suara Tanpa Batas", "24 Kelas Tatap Muka / 3 bulan", "Bimbingan Intensif IELTS/TOEFL"]');

SELECT setval(pg_get_serial_sequence('packages', 'id'), COALESCE(MAX(id), 1)) FROM packages;

-- Latihan percakapan awal untuk menyambut pejuang English!
INSERT INTO exercises (level, title, instruction, "referenceText", translation)
VALUES 
('A1', 'Introduce Yourself', 'Dengarkan lalu ulangi kalimat berikut.', 'Hello, my name is Dhalfa and I am learning English.', 'Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris.'),
('A1', 'Daily Routine', 'Dengarkan lalu ulangi dengan jelas.', 'I usually study English in the evening.', 'Saya biasanya belajar bahasa Inggris pada malam hari.'),
('A2', 'Speaking Goal', 'Ucapkan kalimat berikut dengan percaya diri.', 'My goal is to speak English confidently.', 'Tujuan saya adalah berbicara bahasa Inggris dengan percaya diri.'),
('A2', 'Weekend Story', 'Jawab pertanyaan berikut dalam bahasa Inggris.', 'Tell me about your weekend.', 'Ceritakan tentang akhir pekanmu.')
ON CONFLICT DO NOTHING;
