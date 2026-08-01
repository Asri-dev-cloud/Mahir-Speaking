-- Mahir Speaking Database Schema (MySQL)

CREATE DATABASE IF NOT EXISTS mahir_speaking;
USE mahir_speaking;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  whatsapp VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'tutor', 'admin') DEFAULT 'student',
  package_id INT DEFAULT 1,
  xp INT DEFAULT 0,
  points INT DEFAULT 0,
  streak INT DEFAULT 1,
  avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  period VARCHAR(20) DEFAULT 'monthly',
  ai_daily_limit INT NOT NULL, -- -1 for unlimited
  tutor_sessions INT NOT NULL,
  badge VARCHAR(50),
  features TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  level VARCHAR(50) NOT NULL, -- A1, A2, B1, B2, C1
  description TEXT,
  tutor_id INT,
  thumbnail VARCHAR(255),
  total_lessons INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tutor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
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

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON array of options
  correct_answer INT NOT NULL,
  xp_reward INT DEFAULT 20,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed TINYINT(1) DEFAULT 0,
  score INT DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Purchase History Table
CREATE TABLE IF NOT EXISTS purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  amount INT NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'QRIS',
  status VARCHAR(20) DEFAULT 'success',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- AI Chat History Table
CREATE TABLE IF NOT EXISTS ai_chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  mode VARCHAR(50) DEFAULT 'general', -- 'grammar', 'speaking', 'vocab', 'translator'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 🛡️ CLEAN DATABASE PURGE SCRIPT (DROP ALL EXCEPT ADMIN SENIOR)
-- ============================================================
DELETE FROM users WHERE email != 'hartiniasri32@gmail.com';

INSERT INTO users (id, full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
VALUES (1, 'Hartini Asri (Admin Senior)', 'hartini_senior', 'hartiniasri32@gmail.com', '6285156916211', '20424014', 'admin', 3, 99999, 8888, 120, NULL)
ON DUPLICATE KEY UPDATE 
  full_name='Hartini Asri (Admin Senior)',
  password='20424014',
  role='admin';
