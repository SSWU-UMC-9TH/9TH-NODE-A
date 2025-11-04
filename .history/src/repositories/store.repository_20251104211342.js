import { pool } from "../db.config.js";
import { prisma } from "../db.config.js";

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

export const getAllStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      storeId: true,
      userId: true,
      store: true,
      user: true,
    },
    where: { storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};