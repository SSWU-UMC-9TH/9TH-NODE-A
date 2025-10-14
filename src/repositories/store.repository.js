import { pool } from "../db.config.js";

export const createStore = async ({ name, address, regionId, foodCategoryId, createdByUserId }) => {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.query(
      `INSERT INTO store (name, address, region_id, food_category_id, created_by_user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, address, regionId, foodCategoryId, createdByUserId]
    );
    const [rows] = await conn.query("SELECT * FROM store WHERE id = ?", [res.insertId]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const findStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM store WHERE id = ?", [storeId]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};
