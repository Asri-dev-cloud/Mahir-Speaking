import { query } from './database/db.js';
import bcrypt from 'bcryptjs';

async function forceUpdateLeaderboard() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Delete existing student users
    await query(`DELETE FROM users WHERE role = 'student'`);

    // Insert top learners requested by user
    await query(`
      INSERT INTO users (id, full_name, username, email, whatsapp, password, role, package_id, xp, points, streak, avatar)
      VALUES 
      (1, 'Aci', 'aci_master', 'aci@mahirspeaking.com', '081234567890', '${hashedPassword}', 'student', 3, 3450, 950, 18, '/ma.png'),
      (2, 'Fariha', 'fariha_speaking', 'fariha@mahirspeaking.com', '081234567891', '${hashedPassword}', 'student', 3, 2890, 850, 14, '/mi.png'),
      (3, 'Ira', 'ira_fluent', 'ira@mahirspeaking.com', '081234567892', '${hashedPassword}', 'student', 2, 2450, 720, 11, '/mo.png'),
      (4, 'Pipit', 'pipit_voice', 'pipit@mahirspeaking.com', '081234567893', '${hashedPassword}', 'student', 2, 1980, 560, 9, '/ma.png')
    `);

    console.log('Successfully force-updated SQLite database with Aci, Fariha, Ira, Pipit!');
  } catch (err) {
    console.error('Error updating leaderboard:', err.message);
  }
}

forceUpdateLeaderboard();
