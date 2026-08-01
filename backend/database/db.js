import sqlite3 from 'sqlite3';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'mahir_speaking.db');

export let dbType = 'sqlite';
let pgPool = null;
let sqliteDb = null;

// ⚡ Deteksi otomatis environment database (PostgreSQL di Vercel, SQLite di Local)
if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
  dbType = 'postgres';
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  console.log('🔌 [Database] Mendeteksi DATABASE_URL. Beralih ke mode PostgreSQL...');
  
  pgPool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });
} else {
  dbType = 'sqlite';
  console.log('🗄️ [Database] Menggunakan SQLite lokal di:', dbPath);
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ [Database] Gagal konek ke database SQLite lokal:', err.message);
    } else {
      console.log('✅ [Database] Berhasil konek ke database SQLite lokal!');
    }
  });
}

// ⚡ Helper Promise query database dengan auto-translation antara SQLite dan Postgres
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (dbType === 'postgres') {
      // 1. Ubah placeholder parameter "?" (SQLite) ke "$1, $2" (PostgreSQL)
      let count = 0;
      let pgSql = sql.replace(/\?/g, () => {
        count++;
        return `$${count}`;
      });

      // 2. Sesuaikan penanganan INSERT agar mengembalikan ID secara konsisten
      const trimmed = pgSql.trim().toUpperCase();
      const isInsert = trimmed.startsWith('INSERT');
      if (isInsert && !trimmed.includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      // 3. Sesuaikan SQLite "MAX(score, ?)" ke PostgreSQL "GREATEST(score, $1)"
      pgSql = pgSql.replace(/MAX\s*\(\s*score\s*,\s*(\$\d+|\?)\s*\)/gi, 'GREATEST(score, $1)');

      pgPool.connect((err, client, release) => {
        if (err) {
          return reject(err);
        }
        client.query(pgSql, params, (queryErr, res) => {
          release();
          if (queryErr) {
            return reject(queryErr);
          }
          if (isInsert) {
            // Struktur balik SQLite-compatible: { lastID, changes }
            const lastID = res.rows[0]?.id || res.rows[0]?.lastid || 0;
            resolve({ lastID, changes: res.rowCount });
          } else {
            resolve(res.rows);
          }
        });
      });
    } else {
      // Jalankan SQLite query
      // Sesuaikan GREATEST ke MAX jika ada query yang menggunakan sintaks postgres
      let sqliteSql = sql.replace(/GREATEST\s*\(\s*score\s*,\s*(\?)\s*\)/gi, 'MAX(score, $1)');
      const isSelect = sqliteSql.trim().toUpperCase().startsWith('SELECT');

      if (isSelect) {
        sqliteDb.all(sqliteSql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      } else {
        sqliteDb.run(sqliteSql, params, function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      }
    }
  });
};

// ============================================================
// 🛡️ SECURE TRANSACTION WRAPPERS (PROD: POSTGRES PROCEDURE, DEV: SQLITE FALLBACK)
// ============================================================

/**
 * 📝 Pendaftaran User Baru Secara Aman
 */
export const dbRegisterUser = async (full_name, username, email, whatsapp, password, role, avatar) => {
  if (dbType === 'postgres') {
    const res = await query(
      'SELECT * FROM register_user_secure(?, ?, ?, ?, ?, ?, ?)',
      [full_name, username, email, whatsapp, password, role, avatar]
    );
    return res[0]; // { user_id, status_code, message }
  } else {
    // Fallback transaksi SQLite (Aman & Konsisten)
    return new Promise((resolve, reject) => {
      sqliteDb.serialize(async () => {
        try {
          // Cek existing email/username
          const existing = await query(
            'SELECT username, email FROM users WHERE email = ? OR username = ?',
            [email.toLowerCase(), username.toLowerCase()]
          );

          if (existing.length > 0) {
            const match = existing[0];
            if (match.email.toLowerCase() === email.toLowerCase()) {
              return resolve({ user_id: 0, status_code: 'EMAIL_EXISTS', message: 'Email is already registered.' });
            } else {
              return resolve({ user_id: 0, status_code: 'USERNAME_EXISTS', message: 'Username is already registered.' });
            }
          }

          // Insert user
          const result = await query(
            `INSERT INTO users (full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
             VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 0, ?)`,
            [full_name, username.toLowerCase(), email.toLowerCase(), whatsapp || '', password, role || 'student', avatar || '/ma.png']
          );

          resolve({
            user_id: result.lastID,
            status_code: 'SUCCESS',
            message: 'User registered successfully.'
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  }
};

/**
 * 📦 Pembelian Paket Langganan Secara Aman (Atomic)
 */
export const dbPurchasePackage = async (userId, packageId, amount, paymentMethod) => {
  if (dbType === 'postgres') {
    const res = await query(
      'SELECT * FROM secure_purchase_package(?, ?, ?, ?)',
      [userId, packageId, amount, paymentMethod]
    );
    return res[0]; // { purchase_id, status_code, message }
  } else {
    // Fallback transaksi SQLite
    return new Promise((resolve, reject) => {
      sqliteDb.serialize(async () => {
        try {
          // Cek User
          const user = await query('SELECT id FROM users WHERE id = ?', [userId]);
          if (user.length === 0) {
            return resolve({ purchase_id: 0, status_code: 'USER_NOT_FOUND', message: 'User not found.' });
          }

          // Cek Paket
          const pkg = await query('SELECT id FROM packages WHERE id = ?', [packageId]);
          if (pkg.length === 0) {
            return resolve({ purchase_id: 0, status_code: 'PACKAGE_NOT_FOUND', message: 'Package not found.' });
          }

          // Record Pembelian
          const result = await query(
            `INSERT INTO purchases (user_id, package_id, amount, payment_method, status) VALUES (?, ?, ?, ?, 'success')`,
            [userId, packageId, amount, paymentMethod || 'QRIS']
          );

          // Update Paket User
          await query(`UPDATE users SET package_id = ? WHERE id = ?`, [packageId, userId]);

          resolve({
            purchase_id: result.lastID,
            status_code: 'SUCCESS',
            message: 'Purchase completed successfully.'
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  }
};

/**
 * 🎓 Penyelesaian Materi & Kuis Secara Aman (Atomic XP & Streak)
 */
export const dbCompleteLesson = async (userId, lessonId, score, xpReward) => {
  if (dbType === 'postgres') {
    const res = await query(
      'SELECT * FROM complete_lesson_secure(?, ?, ?, ?)',
      [userId, lessonId, score, xpReward]
    );
    return res[0]; // { progress_id, new_xp, new_points, status_code }
  } else {
    // Fallback transaksi SQLite
    return new Promise((resolve, reject) => {
      sqliteDb.serialize(async () => {
        try {
          const existing = await query(
            `SELECT completed, score FROM user_progress WHERE user_id = ? AND lesson_id = ?`,
            [userId, lessonId]
          );

          let progressId = 0;
          let status_code = 'SUCCESS';

          if (existing.length > 0 && existing[0].completed === 1) {
            // Sudah kelar, update skor jika lebih tinggi
            const maxScore = Math.max(existing[0].score, score);
            await query(
              `UPDATE user_progress SET score = ? WHERE user_id = ? AND lesson_id = ?`,
              [maxScore, userId, lessonId]
            );
            const user = await query('SELECT xp, points FROM users WHERE id = ?', [userId]);
            const progress = await query('SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?', [userId, lessonId]);

            return resolve({
              progress_id: progress[0]?.id || 0,
              new_xp: user[0].xp,
              new_points: user[0].points,
              status_code: 'ALREADY_COMPLETED'
            });
          }

          if (existing.length === 0) {
            const result = await query(
              `INSERT INTO user_progress (user_id, lesson_id, completed, score) VALUES (?, ?, 1, ?)`,
              [userId, lessonId, score]
            );
            progressId = result.lastID;
          } else {
            await query(
              `UPDATE user_progress SET completed = 1, score = ? WHERE user_id = ? AND lesson_id = ?`,
              [score, userId, lessonId]
            );
            const progress = await query('SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?', [userId, lessonId]);
            progressId = progress[0]?.id || 0;
          }

          // Tambah XP, Point, dan Streak
          const addPoints = Math.floor(xpReward / 2);
          await query(
            `UPDATE users SET xp = xp + ?, points = points + ?, streak = streak + 1 WHERE id = ?`,
            [xpReward, addPoints, userId]
          );

          const updatedUser = await query(`SELECT xp, points FROM users WHERE id = ?`, [userId]);

          resolve({
            progress_id: progressId,
            new_xp: updatedUser[0].xp,
            new_points: updatedUser[0].points,
            status_code: 'SUCCESS'
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  }
};

export default sqliteDb;
