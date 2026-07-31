import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'mahir_speaking.db');

// 🗄️ Inisialisasi Database SQLite Mahir Speaking yang Super Setia & Anti Lag! ✨
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Waduh, gagal konek ke database SQLite nih bestie:', err.message);
  } else {
    console.log('✅ Yippie! Berhasil konek ke database SQLite di:', dbPath, '~ slay!');
  }
});

// ⚡ Helper Promise query database biar async-await makin smooth tanpa drama callback-hell~ 🚀
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    if (isSelect) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    } else {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    }
  });
};

export default db;
