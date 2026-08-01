-- ============================================================
-- Mahir Speaking Database Schema (PostgreSQL)
-- Optimized for Vercel Postgres / Neon Serverless Databases
-- ============================================================

-- 1. Create Tables
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
  ai_daily_limit INT NOT NULL, -- -1 for unlimited
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
  options TEXT NOT NULL, -- JSON string of options
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
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
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

-- 2. Indexes for Optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_user ON ai_chats(user_id);

-- ============================================================
-- 🔐 STORED PROCEDURES / FUNCTIONS (PL/pgSQL) FOR SECURE LOGIC
-- ============================================================

-- Function 1: Register User Securely (Atomic Registration + Validation)
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
    -- Check if email already registered
    IF EXISTS (SELECT 1 FROM users WHERE email = LOWER(p_email)) THEN
        RETURN QUERY SELECT 0, 'EMAIL_EXISTS'::VARCHAR, 'Email is already registered.'::VARCHAR;
        RETURN;
    END IF;

    -- Check if username already registered
    IF EXISTS (SELECT 1 FROM users WHERE username = LOWER(p_username)) THEN
        RETURN QUERY SELECT 0, 'USERNAME_EXISTS'::VARCHAR, 'Username is already registered.'::VARCHAR;
        RETURN;
    END IF;

    -- Secure insert with default packages (ID 1: Basic), XP, points, etc.
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


-- Function 2: Secure Purchase Package (Atomic Insert + Update Role)
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
    -- Verify User Exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RETURN QUERY SELECT 0, 'USER_NOT_FOUND'::VARCHAR, 'User not found.'::VARCHAR;
        RETURN;
    END IF;

    -- Verify Package Exists
    IF NOT EXISTS (SELECT 1 FROM packages WHERE id = p_package_id) THEN
        RETURN QUERY SELECT 0, 'PACKAGE_NOT_FOUND'::VARCHAR, 'Package not found.'::VARCHAR;
        RETURN;
    END IF;

    -- Record purchase (Status set automatically to success for payment simulation)
    INSERT INTO purchases (user_id, package_id, amount, payment_method, status)
    VALUES (p_user_id, p_package_id, p_amount, COALESCE(p_payment_method, 'QRIS'), 'success')
    RETURNING id INTO new_purchase_id;

    -- Upgrade User's Active Package
    UPDATE users 
    SET package_id = p_package_id 
    WHERE id = p_user_id;

    RETURN QUERY SELECT new_purchase_id, 'SUCCESS'::VARCHAR, 'Purchase completed successfully.'::VARCHAR;
END;
$$;


-- Function 3: Complete Lesson Securely (Atomic Progress + XP + Streak)
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
    -- Get current user progress details
    SELECT completed, score INTO v_completed, v_old_score
    FROM user_progress 
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

    -- If already completed, just update score if it's higher (no new XP rewards to avoid double farming)
    IF v_completed = 1 THEN
        UPDATE user_progress 
        SET score = GREATEST(v_old_score, p_score) 
        WHERE user_id = p_user_id AND lesson_id = p_lesson_id
        RETURNING id INTO new_progress_id;

        SELECT xp, points INTO updated_xp, updated_points FROM users WHERE id = p_user_id;
        RETURN QUERY SELECT new_progress_id, updated_xp, updated_points, 'ALREADY_COMPLETED'::VARCHAR;
        RETURN;
    END IF;

    -- If not exists, insert new progress
    IF v_completed IS NULL THEN
        INSERT INTO user_progress (user_id, lesson_id, completed, score)
        VALUES (p_user_id, p_lesson_id, 1, p_score)
        RETURNING id INTO new_progress_id;
    ELSE
        -- Update incomplete progress
        UPDATE user_progress 
        SET completed = 1, score = p_score, completed_at = CURRENT_TIMESTAMP
        WHERE user_id = p_user_id AND lesson_id = p_lesson_id
        RETURNING id INTO new_progress_id;
    END IF;

    -- Award XP and Points, increment active streak
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
-- 🌱 SEED DATA (IF NOT YET SEEDED)
-- ============================================================

-- Packages
INSERT INTO packages (id, name, price, period, ai_daily_limit, tutor_sessions, badge, features)
VALUES 
(1, 'Basic', 99000, 'monthly', 10, 0, 'Starter', '["Access to Foundation Courses", "10 Daily AI Chat Messages", "Community Leaderboard", "Vocabulary Flashcards"]'),
(2, 'Standard', 199000, 'monthly', 50, 2, 'Pro Speaker', '["All Foundation & Intermediate Courses", "50 Daily AI Chat Messages", "AI Speaking Coach Feedback", "2 Live Tutor Practice Sessions/mo", "Certificate of Completion"]'),
(3, 'Premium', 349000, 'monthly', -1, 8, 'VIP Master', '["Unlimited Access to All Courses", "UNLIMITED AI Chat & Voice Assistant", "8 Live 1-on-1 Tutor Sessions/mo", "Priority Pronunciation Doctor", "IELTS/TOEFL Speaking Mock Exams", "Verified Speaking Badge"]')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('packages', 'id'), COALESCE(MAX(id), 1)) FROM packages;

-- Initial Exercises
INSERT INTO exercises (level, title, instruction, "referenceText", translation)
VALUES 
('A1', 'Introduce Yourself', 'Dengarkan lalu ulangi kalimat berikut.', 'Hello, my name is Dhalfa and I am learning English.', 'Halo, nama saya Dhalfa dan saya sedang belajar bahasa Inggris.'),
('A1', 'Daily Routine', 'Dengarkan lalu ulangi dengan jelas.', 'I usually study English in the evening.', 'Saya biasanya belajar bahasa Inggris pada malam hari.'),
('A2', 'Speaking Goal', 'Ucapkan kalimat berikut dengan percaya diri.', 'My goal is to speak English confidently.', 'Tujuan saya adalah berbicara bahasa Inggris dengan percaya diri.'),
('A2', 'Weekend Story', 'Jawab pertanyaan berikut dalam bahasa Inggris.', 'Tell me about your weekend.', 'Ceritakan tentang akhir pekanmu.')
ON CONFLICT DO NOTHING;
