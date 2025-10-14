import { pool } from "../db.config.js";

export const findFirstUserId = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT id FROM user ORDER BY id ASC LIMIT 1");
    return rows.length ? rows[0].id : null;
  } finally {
    conn.release();
  }
};

export const findRegionById = async (regionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM region WHERE id = ?", [regionId]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};
