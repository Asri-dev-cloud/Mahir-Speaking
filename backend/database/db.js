import sqlite3 from "sqlite3";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "mahir_speaking.db");

export let dbType = "sqlite";

let pgPool = null;
let sqliteDb = null;

/* ============================================================
   KONEKSI DATABASE
============================================================ */

const connectionString =
  process.env.SUPABASE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (connectionString) {
  dbType = "postgres";

  console.log(
    "🔌 [Database] DATABASE_URL ditemukan. Menggunakan PostgreSQL."
  );

  // Hanya menampilkan hostname, tidak menampilkan password.
  try {
    const databaseHost = new URL(connectionString).hostname;
    console.log(`🔎 [Database] Host aktif: ${databaseHost}`);
  } catch {
    console.error("❌ [Database] Format DATABASE_URL tidak valid.");
  }

  pgPool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pgPool.on("error", (error) => {
    console.error(
      "❌ [Database] PostgreSQL pool error:",
      error.message
    );
  });
} else {
  dbType = "sqlite";

  console.log(
    "🗄️ [Database] DATABASE_URL tidak ditemukan. Menggunakan SQLite:",
    dbPath
  );

  sqliteDb = new sqlite3.Database(dbPath, (error) => {
    if (error) {
      console.error(
        "❌ [Database] SQLite gagal terhubung:",
        error.message
      );
    } else {
      console.log("✅ [Database] SQLite berhasil terhubung.");
    }
  });
}

/* ============================================================
   QUERY HELPER
============================================================ */

function convertPlaceholders(sql) {
  let parameterNumber = 0;

  return sql.replace(/\?/g, () => {
    parameterNumber += 1;
    return `$${parameterNumber}`;
  });
}

export const query = async (sql, params = []) => {
  if (dbType === "postgres") {
    let pgSql = convertPlaceholders(sql);

    const normalizedSql = pgSql.trim().toUpperCase();
    const isInsert = normalizedSql.startsWith("INSERT");

    // Menyesuaikan MAX SQLite menjadi GREATEST PostgreSQL.
    pgSql = pgSql.replace(
      /MAX\s*\(\s*score\s*,\s*(\$\d+)\s*\)/gi,
      "GREATEST(score, $1)"
    );

    // Agar query INSERT mengembalikan ID.
    if (isInsert && !normalizedSql.includes("RETURNING")) {
      pgSql += " RETURNING id";
    }

    try {
      const result = await pgPool.query(pgSql, params);

      if (isInsert) {
        return {
          lastID:
            result.rows[0]?.id ||
            result.rows[0]?.lastid ||
            0,
          changes: result.rowCount,
          rows: result.rows,
        };
      }

      return result.rows;
    } catch (error) {
      console.error(
        "❌ [Database] PostgreSQL query error:",
        error.message
      );

      throw error;
    }
  }

  return new Promise((resolve, reject) => {
    let sqliteSql = sql.replace(
      /GREATEST\s*\(\s*score\s*,\s*\?\s*\)/gi,
      "MAX(score, ?)"
    );

    const normalizedSql = sqliteSql.trim().toUpperCase();
    const isSelect =
      normalizedSql.startsWith("SELECT") ||
      normalizedSql.startsWith("PRAGMA") ||
      normalizedSql.startsWith("WITH");

    if (isSelect) {
      sqliteDb.all(sqliteSql, params, (error, rows) => {
        if (error) {
          console.error(
            "❌ [Database] SQLite query error:",
            error.message
          );

          reject(error);
          return;
        }

        resolve(rows);
      });

      return;
    }

    sqliteDb.run(sqliteSql, params, function (error) {
      if (error) {
        console.error(
          "❌ [Database] SQLite query error:",
          error.message
        );

        reject(error);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
};

/* ============================================================
   TES KONEKSI
============================================================ */

export const testDatabaseConnection = async () => {
  try {
    if (dbType === "postgres") {
      const result = await pgPool.query(`
        SELECT
          current_database() AS database_name,
          current_user AS database_user
      `);

      console.log(
        "✅ [Database] PostgreSQL berhasil terhubung:",
        result.rows[0]?.database_name
      );

      return {
        success: true,
        type: "postgres",
        database: result.rows[0]?.database_name,
      };
    }

    await query("SELECT 1 AS connected");

    console.log("✅ [Database] SQLite berhasil terhubung.");

    return {
      success: true,
      type: "sqlite",
      database: dbPath,
    };
  } catch (error) {
    console.error(
      "❌ [Database] Tes koneksi gagal:",
      error.message
    );

    return {
      success: false,
      type: dbType,
      message: error.message,
    };
  }
};

/* ============================================================
   REGISTRASI USER
============================================================ */

export const dbRegisterUser = async (
  fullName,
  username,
  email,
  whatsapp,
  password,
  role,
  avatar
) => {
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedEmail = email.toLowerCase().trim();

  if (dbType === "postgres") {
    const result = await query(
      `
        SELECT *
        FROM register_user_secure(
          ?, ?, ?, ?, ?, ?, ?
        )
      `,
      [
        fullName,
        normalizedUsername,
        normalizedEmail,
        whatsapp || "",
        password,
        role || "student",
        avatar || "/ma.png",
      ]
    );

    if (!result[0]) {
      throw new Error(
        "register_user_secure tidak memberikan hasil."
      );
    }

    return result[0];
  }

  const existingUsers = await query(
    `
      SELECT username, email
      FROM users
      WHERE LOWER(email) = ?
         OR LOWER(username) = ?
    `,
    [normalizedEmail, normalizedUsername]
  );

  if (existingUsers.length > 0) {
    const existingUser = existingUsers[0];

    if (
      existingUser.email?.toLowerCase() === normalizedEmail
    ) {
      return {
        user_id: 0,
        status_code: "EMAIL_EXISTS",
        message: "Email is already registered.",
      };
    }

    return {
      user_id: 0,
      status_code: "USERNAME_EXISTS",
      message: "Username is already registered.",
    };
  }

  const insertResult = await query(
    `
      INSERT INTO users (
        full_name,
        username,
        email,
        whatsapp,
        password,
        role,
        package_id,
        xp,
        points,
        streak,
        avatar
      )
      VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 0, ?)
    `,
    [
      fullName,
      normalizedUsername,
      normalizedEmail,
      whatsapp || "",
      password,
      role || "student",
      avatar || "/ma.png",
    ]
  );

  return {
    user_id: insertResult.lastID,
    status_code: "SUCCESS",
    message: "User registered successfully.",
  };
};

/* ============================================================
   PEMBELIAN PAKET
============================================================ */

export const dbPurchasePackage = async (
  userId,
  packageId,
  amount,
  paymentMethod
) => {
  if (dbType === "postgres") {
    const result = await query(
      `
        SELECT *
        FROM secure_purchase_package(?, ?, ?, ?)
      `,
      [
        userId,
        packageId,
        amount,
        paymentMethod || "QRIS",
      ]
    );

    if (!result[0]) {
      throw new Error(
        "secure_purchase_package tidak memberikan hasil."
      );
    }

    return result[0];
  }

  const users = await query(
    "SELECT id FROM users WHERE id = ?",
    [userId]
  );

  if (users.length === 0) {
    return {
      purchase_id: 0,
      status_code: "USER_NOT_FOUND",
      message: "User not found.",
    };
  }

  const packages = await query(
    "SELECT id FROM packages WHERE id = ?",
    [packageId]
  );

  if (packages.length === 0) {
    return {
      purchase_id: 0,
      status_code: "PACKAGE_NOT_FOUND",
      message: "Package not found.",
    };
  }

  const purchaseResult = await query(
    `
      INSERT INTO purchases (
        user_id,
        package_id,
        amount,
        payment_method,
        status
      )
      VALUES (?, ?, ?, ?, 'success')
    `,
    [
      userId,
      packageId,
      amount,
      paymentMethod || "QRIS",
    ]
  );

  await query(
    `
      UPDATE users
      SET package_id = ?
      WHERE id = ?
    `,
    [packageId, userId]
  );

  return {
    purchase_id: purchaseResult.lastID,
    status_code: "SUCCESS",
    message: "Purchase completed successfully.",
  };
};

/* ============================================================
   SELESAIKAN LESSON DAN TAMBAH XP
============================================================ */

export const dbCompleteLesson = async (
  userId,
  lessonId,
  score,
  xpReward
) => {
  if (dbType === "postgres") {
    const result = await query(
      `
        SELECT *
        FROM complete_lesson_secure(?, ?, ?, ?)
      `,
      [userId, lessonId, score, xpReward]
    );

    if (!result[0]) {
      throw new Error(
        "complete_lesson_secure tidak memberikan hasil."
      );
    }

    return result[0];
  }

  const existingProgress = await query(
    `
      SELECT id, completed, score
      FROM user_progress
      WHERE user_id = ?
        AND lesson_id = ?
    `,
    [userId, lessonId]
  );

  if (
    existingProgress.length > 0 &&
    Number(existingProgress[0].completed) === 1
  ) {
    const highestScore = Math.max(
      Number(existingProgress[0].score || 0),
      Number(score || 0)
    );

    await query(
      `
        UPDATE user_progress
        SET score = ?
        WHERE user_id = ?
          AND lesson_id = ?
      `,
      [highestScore, userId, lessonId]
    );

    const users = await query(
      `
        SELECT xp, points, streak
        FROM users
        WHERE id = ?
      `,
      [userId]
    );

    return {
      progress_id: existingProgress[0].id,
      new_xp: users[0]?.xp || 0,
      new_points: users[0]?.points || 0,
      new_streak: users[0]?.streak || 0,
      status_code: "ALREADY_COMPLETED",
    };
  }

  let progressId = 0;

  if (existingProgress.length === 0) {
    const progressResult = await query(
      `
        INSERT INTO user_progress (
          user_id,
          lesson_id,
          completed,
          score
        )
        VALUES (?, ?, 1, ?)
      `,
      [userId, lessonId, score]
    );

    progressId = progressResult.lastID;
  } else {
    await query(
      `
        UPDATE user_progress
        SET
          completed = 1,
          score = ?,
          completed_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
          AND lesson_id = ?
      `,
      [score, userId, lessonId]
    );

    progressId = existingProgress[0].id;
  }

  await query(
    `
      UPDATE users
      SET
        xp = xp + ?
      WHERE id = ?
    `,
    [
      Number(xpReward !== undefined ? xpReward : 50),
      userId,
    ]
  );

  const updatedUsers = await query(
    `
      SELECT xp, points, streak
      FROM users
      WHERE id = ?
    `,
    [userId]
  );

  if (updatedUsers.length === 0) {
    return {
      progress_id: progressId,
      new_xp: 0,
      new_points: 0,
      new_streak: 0,
      status_code: "USER_NOT_FOUND",
    };
  }

  return {
    progress_id: progressId,
    new_xp: updatedUsers[0].xp,
    new_points: updatedUsers[0].points,
    new_streak: updatedUsers[0].streak,
    status_code: "SUCCESS",
  };
};

/* ============================================================
   TUTUP KONEKSI
============================================================ */

export const closeDatabase = async () => {
  if (dbType === "postgres" && pgPool) {
    await pgPool.end();
    return;
  }

  if (sqliteDb) {
    await new Promise((resolve, reject) => {
      sqliteDb.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
};

export default sqliteDb;