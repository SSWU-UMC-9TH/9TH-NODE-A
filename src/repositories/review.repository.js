import { pool } from "../db.config.js";

export const createReview = async ({ storeId, userId, rating, content }) => {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.query(
      `INSERT INTO review (store_id, user_id, rating, content)
       VALUES (?, ?, ?, ?)`,
      [storeId, userId, rating, content]
    );
    const [rows] = await conn.query("SELECT * FROM review WHERE id = ?", [res.insertId]);
    return rows[0];
  } finally {
    conn.release();
  }
};
