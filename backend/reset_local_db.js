import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database', 'mahir_speaking.db');

console.log('🔄 Menghubungkan ke database lokal SQLite:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Gagal membuka database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  // 1. Reset data di tabel users
  db.run('UPDATE users SET xp = 0, points = 0, streak = 0', [], function(err) {
    if (err) {
      console.error('❌ Gagal mereset tabel users:', err.message);
    } else {
      console.log(`✅ Berhasil mereset data XP, Points, dan Streak untuk ${this.changes} user di SQLite.`);
    }
  });

  // 2. Kosongkan tabel progres pelajaran
  db.run('DELETE FROM user_progress', [], function(err) {
    if (err) {
      console.error('❌ Gagal mengosongkan tabel user_progress:', err.message);
    } else {
      console.log('✅ Berhasil mengosongkan tabel progres user_progress di SQLite.');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('❌ Gagal menutup database:', err.message);
  } else {
    console.log('✨ Selesai! Database lokal telah berhasil di-reset ke 0.');
  }
});
